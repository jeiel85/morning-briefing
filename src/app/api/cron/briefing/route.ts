import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sendPush, renderPushPayload } from "@/lib/push";

export const maxDuration = 60;
export const dynamic = "force-dynamic";

async function runIngestion() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL ?? "https://zam-dun.vercel.app"}/api/ingestion/fetch`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.INTERNAL_JOB_TOKEN}`,
      },
      body: JSON.stringify({}),
    },
  );
  if (!res.ok) {
    const err = await res.text();
    return { status: "failed", error: err };
  }
  return await res.json();
}

async function generateBriefingForUser(userId: string): Promise<string | null> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL ?? "https://zam-dun.vercel.app"}/api/briefing/generate`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.INTERNAL_JOB_TOKEN}`,
      },
      body: JSON.stringify({ userId }),
    },
  );
  if (!res.ok) return null;
  const data = await res.json();
  return data.briefingId ?? null;
}

async function sendPushForBriefing(briefingId: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL ?? "https://zam-dun.vercel.app"}/api/push/send`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.INTERNAL_JOB_TOKEN}`,
      },
      body: JSON.stringify({ briefingId }),
    },
  );
  if (!res.ok) return null;
  return await res.json();
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");
  if (process.env.CRON_SECRET && token !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const results: Record<string, unknown> = {};

  results.ingestion = await runIngestion();

  const pushUsers = await prisma.pushSubscription.findMany({
    where: { revokedAt: null },
    select: { userId: true },
    distinct: ["userId"],
  });

  const userBriefings: { userId: string; briefingId: string }[] = [];

  for (const { userId } of pushUsers) {
    const briefingId = await generateBriefingForUser(userId);
    if (briefingId) {
      userBriefings.push({ userId, briefingId });
    }
  }

  const pushResults: Record<string, unknown> = {};
  for (const { userId, briefingId } of userBriefings) {
    const pushResult = await sendPushForBriefing(briefingId);
    pushResults[userId] = pushResult;
  }

  results.checked = pushUsers.length;
  results.generated = userBriefings.length;
  results.pushResults = pushResults;

  return NextResponse.json(results);
}
