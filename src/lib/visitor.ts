import { prisma } from "@/lib/db";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const VISITOR_COOKIE = "db_visitor";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export async function getVisitor() {
  const cookieStore = await cookies();
  let visitorId = cookieStore.get(VISITOR_COOKIE)?.value;

  if (visitorId) {
    const user = await prisma.user.findUnique({ where: { id: visitorId } });
    if (user) return user;
  }

  const user = await prisma.user.create({ data: { email: null } });
  return user;
}

export async function ensureVisitor() {
  const user = await getVisitor();
  const cookieStore = await cookies();
  cookieStore.set(VISITOR_COOKIE, user.id, {
    httpOnly: true,
    sameSite: "lax",
    maxAge: COOKIE_MAX_AGE,
  });
  return user;
}
