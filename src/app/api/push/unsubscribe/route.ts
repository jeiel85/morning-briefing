import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getVisitor } from "@/lib/visitor";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(request: Request) {
  const user = await getVisitor();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (!rateLimit(`push-unsub:${ip}`, 20, 60_000).allowed) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const { endpoint } = await request.json();
  if (!endpoint) {
    return NextResponse.json({ error: "endpoint required" }, { status: 400 });
  }

  // Only the owning visitor can revoke their own subscription.
  await prisma.pushSubscription.updateMany({
    where: { endpoint, userId: user.id, revokedAt: null },
    data: { revokedAt: new Date() },
  });

  return NextResponse.json({ status: "ok" });
}
