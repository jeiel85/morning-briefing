import { normalizeTitle } from "@packages/source-adapters/src/normalize";

export interface ClusterCandidate {
  title: string;
  category: string;
  language?: string;
  region?: string;
  rawItemIds: string[];
  sourceIds: Set<string>;
  firstSeenAt: Date;
  lastSeenAt: Date;
  reliabilityScores: number[];
  urgencyFlags: boolean[];
}

export function buildClusters(
  items: Array<{
    id: string;
    title: string;
    category: string | null;
    language: string | null;
    region: string | null;
    publishedAt: Date | null;
    fetchedAt: Date;
    sourceId: string;
    source: { reliabilityScore: number; sourceType: string };
  }>,
): ClusterCandidate[] {
  const clusters: ClusterCandidate[] = [];
  const assigned = new Set<string>();

  // Compare by normalized title similarity
  for (let i = 0; i < items.length; i++) {
    if (assigned.has(items[i].id)) continue;

    const base = items[i];
    const baseNorm = normalizeTitle(base.title);
    const baseWords = new Set(baseNorm.split(/\s+/).filter((w) => w.length > 2));

    const cluster: ClusterCandidate = {
      title: base.title,
      category: base.category ?? "uncategorized",
      language: base.language ?? undefined,
      region: base.region ?? undefined,
      rawItemIds: [base.id],
      sourceIds: new Set([base.sourceId]),
      firstSeenAt: base.publishedAt ?? base.fetchedAt,
      lastSeenAt: base.publishedAt ?? base.fetchedAt,
      reliabilityScores: [base.source.reliabilityScore],
      urgencyFlags: [base.source.sourceType === "status"],
    };
    assigned.add(base.id);

    for (let j = i + 1; j < items.length; j++) {
      if (assigned.has(items[j].id)) continue;
      const compare = items[j];
      const compareNorm = normalizeTitle(compare.title);
      const compareWords = new Set(compareNorm.split(/\s+/).filter((w) => w.length > 2));

      const intersection = new Set([...baseWords].filter((w) => compareWords.has(w)));
      const union = new Set([...baseWords, ...compareWords]);
      const jaccard = union.size > 0 ? intersection.size / union.size : 0;

      if (jaccard >= 0.3) {
        cluster.rawItemIds.push(compare.id);
        cluster.sourceIds.add(compare.sourceId);
        cluster.reliabilityScores.push(compare.source.reliabilityScore);
        cluster.urgencyFlags.push(compare.source.sourceType === "status");
        const ts = compare.publishedAt ?? compare.fetchedAt;
        if (ts < cluster.firstSeenAt) cluster.firstSeenAt = ts;
        if (ts > cluster.lastSeenAt) cluster.lastSeenAt = ts;
        assigned.add(compare.id);
      }
    }

    clusters.push(cluster);
  }

  return clusters;
}
