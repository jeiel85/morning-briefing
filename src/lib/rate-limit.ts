// Best-effort, per-instance in-memory limiter. On serverless this is bounded to
// a single warm instance (state resets on cold start and isn't shared across
// instances), so it raises the bar against bursts but is not a distributed
// guarantee. For hard limits, back this with a shared store (e.g. Upstash Redis).
const store = new Map<string, { count: number; resetAt: number }>();
let lastSweep = 0;

/** Drop expired entries at most once a minute so the map can't grow unbounded. */
function sweep(now: number): void {
  if (now - lastSweep < 60_000) return;
  lastSweep = now;
  for (const [key, entry] of store) {
    if (now > entry.resetAt) store.delete(key);
  }
}

export function rateLimit(
  key: string,
  maxRequests: number,
  windowMs: number,
): { allowed: boolean; remaining: number } {
  const now = Date.now();
  sweep(now);

  const entry = store.get(key);
  if (!entry || now > entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: maxRequests - 1 };
  }

  entry.count++;
  if (entry.count > maxRequests) {
    return { allowed: false, remaining: 0 };
  }
  return { allowed: true, remaining: maxRequests - entry.count };
}
