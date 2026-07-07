import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { renderBriefingEmail, sendEmail } from "@/lib/email";

export async function POST(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.INTERNAL_JOB_TOKEN}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { briefingId } = await request.json();
  const briefing = await prisma.briefing.findUnique({
    where: { id: briefingId },
    include: {
      items: { orderBy: { rank: "asc" } },
      user: { include: { preferences: true } },
    },
  });

  if (!briefing) {
    return NextResponse.json({ error: "Briefing not found" }, { status: 404 });
  }

  if (!briefing.user.email || !briefing.user.preferences?.emailEnabled) {
    return NextResponse.json({ status: "skipped", reason: "no email or disabled" });
  }

  const { html, text } = renderBriefingEmail(
    briefing.title,
    briefing.items.map((i) => ({
      rank: i.rank,
      title: i.title,
      section: i.section,
      summaryBullets: i.summaryBullets,
      whyItMatters: i.whyItMatters,
      sourceLinks: (i.sourceLinks as { title: string; url: string; sourceName: string }[]) ?? [],
    })),
    `${process.env.NEXT_PUBLIC_APP_URL}/api/unsubscribe?userId=${briefing.userId}`,
    `${process.env.NEXT_PUBLIC_APP_URL}/app/settings`,
  );

  const result = await sendEmail(briefing.user.email, briefing.title, html, text);

  await prisma.deliveryLog.create({
    data: {
      userId: briefing.userId,
      briefingId: briefing.id,
      channel: "email",
      recipient: briefing.user.email,
      status: result.status === "sent" ? "sent" : "failed",
      providerMessageId: result.status === "sent" ? result.messageId : null,
      errorMessage: result.status === "failed" ? result.error : null,
    },
  });

  return NextResponse.json(result);
}
