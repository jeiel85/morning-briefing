import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { buildClusters } from "@/lib/clustering";
import { calculateScore, calculateFreshness, calculateConsensus, calculateUrgency } from "@/lib/ranking";
import { generateSummary } from "@/lib/summarizer";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { windowStart, windowEnd } = await request.json();
  const now = new Date();
  const wStart = windowStart ? new Date(windowStart) : new Date(now.getTime() - 12 * 60 * 60 * 1000);
  const wEnd = windowEnd ? new Date(windowEnd) : now;

  const prefs = await prisma.userPreference.findUnique({ where: { userId: session.user.id } });
  const blockedKeywords = prefs?.blockedKeywords ?? [];
  const interestKeywords = prefs?.interestKeywords ?? [];
  const mode = prefs?.briefingMode ?? "three_minute";
  const categories = prefs?.categories ?? [];

  const rawItems = await prisma.rawItem.findMany({
    where: {
      publishedAt: { gte: wStart, lte: wEnd },
      ...(categories.length > 0 ? { category: { in: categories } } : {}),
    },
    include: { source: { select: { reliabilityScore: true, sourceType: true } } },
  });

  const filtered = rawItems.filter((item) => {
    const title = item.title.toLowerCase();
    return !blockedKeywords.some((kw) => title.includes(kw.toLowerCase()));
  });

  const clusters = buildClusters(filtered);
  const maxItems = mode === "three_minute" ? 5 : mode === "ten_minute" ? 10 : 20;

  const ranked = clusters.map((c) => {
    const avgReliability = c.reliabilityScores.reduce((a, b) => a + b, 0) / c.reliabilityScores.length;
    const freshness = calculateFreshness(c.firstSeenAt, now);
    const consensus = calculateConsensus(c.sourceIds.size);
    const urgency = calculateUrgency(c.urgencyFlags.some(Boolean), 0);
    const relevance = interestKeywords.length > 0
      ? interestKeywords.some((kw) => c.title.toLowerCase().includes(kw.toLowerCase())) ? 0.8 : 0.3
      : 0.5;

    return {
      cluster: c,
      score: calculateScore({ relevance, urgency, consensus, reliability: avgReliability, freshness, trend: 0.2, novelty: 0.3 }),
    };
  });

  ranked.sort((a, b) => b.score - a.score);
  const topClusters = ranked.slice(0, maxItems);

  const briefing = await prisma.briefing.create({
    data: {
      userId: session.user.id,
      briefingDate: wEnd,
      windowStart: wStart,
      windowEnd: wEnd,
      mode,
      title: `Briefing for ${wEnd.toLocaleDateString()}`,
    },
  });

  const briefingItems = [];

  for (let i = 0; i < topClusters.length; i++) {
    const { cluster, score } = topClusters[i];
    const clusterRec = await prisma.topicCluster.create({
      data: {
        title: cluster.title,
        category: cluster.category,
        primaryRegion: cluster.region,
        language: cluster.language,
        status: cluster.urgencyFlags.some(Boolean) ? "confirmed" : "developing",
        firstSeenAt: cluster.firstSeenAt,
        lastSeenAt: cluster.lastSeenAt,
        itemCount: cluster.rawItemIds.length,
        sourceCount: cluster.sourceIds.size,
        reliabilityScore: cluster.reliabilityScores.reduce((a, b) => a + b, 0) / cluster.reliabilityScores.length,
        urgencyScore: cluster.urgencyFlags.some(Boolean) ? 1 : 0,
        trendScore: 0.3,
        consensusScore: calculateConsensus(cluster.sourceIds.size),
      },
    });

    for (const rawId of cluster.rawItemIds) {
      await prisma.clusterItem.create({ data: { clusterId: clusterRec.id, rawItemId: rawId } });
    }

    const itemDetails = filtered.filter((f) => cluster.rawItemIds.includes(f.id));
    const summary = await generateSummary({
      title: cluster.title,
      category: cluster.category,
      sourceCount: cluster.sourceIds.size,
      items: itemDetails.map((i) => ({
        title: i.title,
        snippet: i.snippet,
        sourceName: i.sourceName,
        publishedAt: i.publishedAt,
        url: i.url,
      })),
    });

    const briefingItem = await prisma.briefingItem.create({
      data: {
        briefingId: briefing.id,
        clusterId: clusterRec.id,
        section: cluster.category,
        rank: i + 1,
        finalScore: score,
        title: cluster.title,
        status: "developing",
        summaryBullets: summary.summaryBullets,
        whyItMatters: summary.whyItMatters,
        confirmedFacts: summary.confirmedFacts,
        uncertainties: summary.uncertainties,
        sourceLinks: itemDetails.map((i) => ({ title: i.title, url: i.url, sourceName: i.sourceName })),
        rankingExplanation: `Reliability: ${cluster.reliabilityScores.reduce((a, b) => a + b, 0) / cluster.reliabilityScores.length}, Sources: ${cluster.sourceIds.size}`,
        modelProvider: summary.modelProvider,
        modelName: summary.modelName,
        validationStatus: summary.validationStatus,
      },
    });

    briefingItems.push(briefingItem);
  }

  return NextResponse.json({ briefingId: briefing.id, itemCount: briefingItems.length });
}
