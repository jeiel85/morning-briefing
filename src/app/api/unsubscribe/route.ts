import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return new Response("Missing userId", { status: 400 });
  }

  await prisma.userPreference.upsert({
    where: { userId },
    update: { emailEnabled: false },
    create: { userId, emailEnabled: false },
  });

  return new Response("You have been unsubscribed from email briefings.", {
    status: 200,
    headers: { "Content-Type": "text/plain" },
  });
}
