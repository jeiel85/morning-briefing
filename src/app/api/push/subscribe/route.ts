import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getVisitor } from "@/lib/visitor";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(request: Request) {
  // Derive the owner from the httpOnly visitor cookie, never from the body.
  const user = await getVisitor();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (!rateLimit(`push-sub:${ip}`, 20, 60_000).allowed) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const { endpoint, p256dh, auth, userAgent } = await request.json();
  if (!endpoint || !p256dh || !auth) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const subscription = await prisma.pushSubscription.upsert({
    where: { endpoint },
    update: { userId: user.id, p256dh, auth, userAgent, revokedAt: null, lastUsedAt: new Date() },
    create: { userId: user.id, endpoint, p256dh, auth, userAgent },
  });

  return NextResponse.json({ id: subscription.id });
}
