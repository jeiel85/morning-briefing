import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sendPush, renderPushPayload } from "@/lib/push";
import { isInternalRequest } from "@/lib/auth-guard";

export async function POST(request: Request) {
  if (!isInternalRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { briefingId } = await request.json();
  const briefing = await prisma.briefing.findUnique({
    where: { id: briefingId },
    include: { items: { select: { finalScore: true } } },
  });

  if (!briefing) {
    return NextResponse.json({ error: "Briefing not found" }, { status: 404 });
  }

  const hasUrgent = briefing.items.some((i) => i.finalScore >= 0.9);
  const payload = renderPushPayload(briefing.title, briefing.items.length, hasUrgent);
  const results = await sendPush(briefing.userId, payload);

  await prisma.deliveryLog.create({
    data: {
      userId: briefing.userId,
      briefingId: briefing.id,
      channel: "web_push",
      recipient: `push:${results.length} subs`,
      status: results.some((r) => r.status === "sent") ? "sent" : "failed",
    },
  });

  return NextResponse.json({ results, urgent: hasUrgent });
}
