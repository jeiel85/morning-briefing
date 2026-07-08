import { prisma } from "@/lib/db";
import { cookies } from "next/headers";

const VISITOR_COOKIE = "db_visitor";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export async function getVisitor() {
  const cookieStore = await cookies();
  const visitorId = cookieStore.get(VISITOR_COOKIE)?.value;

  if (visitorId) {
    const user = await prisma.user.findUnique({ where: { id: visitorId } });
    if (user) return user;
  }

  return null;
}

export async function ensureVisitor() {
  const cookieStore = await cookies();
  let visitorId = cookieStore.get(VISITOR_COOKIE)?.value;

  if (visitorId) {
    const user = await prisma.user.findUnique({ where: { id: visitorId } });
    if (user) return user;
  }

  const user = await prisma.user.create({ data: {} });
  cookieStore.set(VISITOR_COOKIE, user.id, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: COOKIE_MAX_AGE,
  });
  return user;
}
