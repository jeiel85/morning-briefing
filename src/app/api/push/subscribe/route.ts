import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  const { userId, endpoint, p256dh, auth, userAgent } = await request.json();
  if (!userId || !endpoint || !p256dh || !auth) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const subscription = await prisma.pushSubscription.upsert({
    where: { endpoint },
    update: { userId, p256dh, auth, userAgent, revokedAt: null, lastUsedAt: new Date() },
    create: { userId, endpoint, p256dh, auth, userAgent },
  });

  return NextResponse.json({ id: subscription.id });
}
