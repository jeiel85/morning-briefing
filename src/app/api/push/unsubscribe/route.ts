import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  const { endpoint } = await request.json();
  if (!endpoint) {
    return NextResponse.json({ error: "endpoint required" }, { status: 400 });
  }

  await prisma.pushSubscription.updateMany({
    where: { endpoint, revokedAt: null },
    data: { revokedAt: new Date() },
  });

  return NextResponse.json({ status: "ok" });
}
