import { timingSafeEqual } from "crypto";

/** Constant-time string compare that never throws on length mismatch. */
function safeEqual(a: string, b: string): boolean {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ba.length !== bb.length) return false;
  return timingSafeEqual(ba, bb);
}

/**
 * True only when the request carries `Authorization: Bearer <secret>` AND the
 * secret is actually configured. Missing env → always false (fail closed), so
 * an unset token can never degrade into `Bearer undefined` accepting traffic.
 */
function bearerMatches(request: Request, secret: string | undefined): boolean {
  if (!secret) return false;
  const header = request.headers.get("authorization");
  if (!header) return false;
  return safeEqual(header, `Bearer ${secret}`);
}

/** Authorizes internal job routes (ingestion, generation, push send, cleanup). */
export function isInternalRequest(request: Request): boolean {
  return bearerMatches(request, process.env.INTERNAL_JOB_TOKEN);
}

/** Authorizes the Vercel cron endpoint (Vercel sends Authorization: Bearer $CRON_SECRET). */
export function isCronRequest(request: Request): boolean {
  return bearerMatches(request, process.env.CRON_SECRET);
}
