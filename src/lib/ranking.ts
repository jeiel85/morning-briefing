export interface RankInput {
  relevance: number;
  urgency: number;
  consensus: number;
  reliability: number;
  freshness: number;
  trend: number;
  novelty: number;
}

const WEIGHTS = {
  relevance: 0.25,
  urgency: 0.20,
  consensus: 0.20,
  reliability: 0.15,
  freshness: 0.10,
  trend: 0.05,
  novelty: 0.05,
};

export function calculateScore(input: RankInput): number {
  return (
    input.relevance * WEIGHTS.relevance +
    input.urgency * WEIGHTS.urgency +
    input.consensus * WEIGHTS.consensus +
    input.reliability * WEIGHTS.reliability +
    input.freshness * WEIGHTS.freshness +
    input.trend * WEIGHTS.trend +
    input.novelty * WEIGHTS.novelty
  );
}

export function calculateFreshness(publishedAt: Date | null, now: Date): number {
  if (!publishedAt) return 0;
  const hoursAgo = (now.getTime() - publishedAt.getTime()) / (1000 * 60 * 60);
  if (hoursAgo < 1) return 1;
  if (hoursAgo < 6) return 0.9;
  if (hoursAgo < 12) return 0.7;
  if (hoursAgo < 24) return 0.5;
  if (hoursAgo < 48) return 0.3;
  return 0.1;
}

export function calculateConsensus(sourceCount: number, maxSources: number = 5): number {
  return Math.min(sourceCount / maxSources, 1);
}

export function calculateUrgency(isStatusIncident: boolean, hoursUntilDelivery: number): number {
  if (isStatusIncident && hoursUntilDelivery < 4) return 1;
  if (isStatusIncident) return 0.8;
  if (hoursUntilDelivery < 1) return 0.6;
  return 0.2;
}
