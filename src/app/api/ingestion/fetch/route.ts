import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createAdapter } from "@packages/source-adapters/src/registry";
import { canonicalUrl, urlHash, titleHash } from "@packages/source-adapters/src/normalize";
import { rateLimit } from "@/lib/rate-limit";
import { log } from "@/lib/logger";

export async function POST(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.INTERNAL_JOB_TOKEN}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const clientIp = request.headers.get("x-forwarded-for") ?? "internal";
  const { allowed } = rateLimit(`ingestion:${clientIp}`, 10, 60_000);
  if (!allowed) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const { windowStart, windowEnd } = await request.json().catch(() => ({}));
  const now = new Date();
  const wStart = windowStart ? new Date(windowStart) : new Date(now.getTime() - 12 * 60 * 60 * 1000);
  const wEnd = windowEnd ? new Date(windowEnd) : now;

  const sources = await prisma.source.findMany({ where: { enabled: true } });
  const results = [];

  for (const source of sources) {
    const run = await prisma.sourceFetchRun.create({
      data: {
        sourceId: source.id,
        status: "running",
        windowStart: wStart,
        windowEnd: wEnd,
      },
    });

    try {
      const adapter = createAdapter({
        key: source.key,
        displayName: source.displayName,
        url: source.url ?? undefined,
        sourceType: source.sourceType as "rss" | "api" | "status" | "trend",
        defaultCategory: source.defaultCategory ?? undefined,
        defaultLanguage: source.defaultLanguage ?? undefined,
        defaultRegion: source.defaultRegion ?? undefined,
        rateLimitPerHour: source.rateLimitPerHour ?? undefined,
      });

      const fetchResult = await adapter.fetch(wStart, wEnd);

      if (fetchResult.status === "failed") {
        await prisma.sourceFetchRun.update({
          where: { id: run.id },
          data: { status: "failed", completedAt: new Date(), errorCode: fetchResult.errorCode, errorMessage: fetchResult.errorMessage },
        });
        results.push({ sourceKey: source.key, status: "failed", items: 0 });
        continue;
      }

      let inserted = 0;
      let skipped = 0;

      for (const item of fetchResult.items) {
        const canonUrl = canonicalUrl(item.url);
        const cHash = urlHash(canonUrl);
        const tHash = titleHash(item.title);

        const existing = await prisma.rawItem.findUnique({ where: { canonicalUrlHash: cHash } });
        if (existing) { skipped++; continue; }

        await prisma.rawItem.create({
          data: {
            sourceId: source.id,
            externalId: item.externalId,
            title: item.title,
            url: item.url,
            canonicalUrl: canonUrl,
            canonicalUrlHash: cHash,
            normalizedTitleHash: tHash,
            sourceName: item.sourceName,
            publishedAt: item.publishedAt,
            snippet: item.snippet,
            author: item.author,
            language: item.language ?? source.defaultLanguage,
            region: item.region ?? source.defaultRegion,
            category: item.category ?? source.defaultCategory,
            tags: item.tags ?? [],
          },
        });
        inserted++;
      }

      await prisma.sourceFetchRun.update({
        where: { id: run.id },
        data: {
          status: fetchResult.status === "partial" ? "partial" : "success",
          completedAt: new Date(),
          fetchedCount: fetchResult.items.length,
          normalizedCount: inserted,
          skippedCount: skipped,
          ...(fetchResult.errorMessage ? { errorMessage: fetchResult.errorMessage } : {}),
        },
      });

      results.push({ sourceKey: source.key, status: fetchResult.status, items: inserted });
    } catch (err) {
      await prisma.sourceFetchRun.update({
        where: { id: run.id },
        data: { status: "failed", completedAt: new Date(), errorMessage: err instanceof Error ? err.message : String(err) },
      });
      results.push({ sourceKey: source.key, status: "error", items: 0 });
    }
  }

  log("info", "Ingestion fetch completed", { sourcesCount: sources.length, results });
  return NextResponse.json({ windowStart: wStart, windowEnd: wEnd, results });
}
