import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const [users, briefings] = await Promise.all([
    prisma.user.count(),
    prisma.briefing.count(),
  ]);

  return NextResponse.json({ users, briefings });
}
