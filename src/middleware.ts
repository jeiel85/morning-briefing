import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default async function middleware(request: NextRequest) {
  const acceptLang = request.headers.get("accept-language") || "";
  const locale = acceptLang.startsWith("ko") ? "ko" : "en";

  const response = NextResponse.next();
  response.cookies.set("NEXT_LOCALE", locale, {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30,
  });

  const session = await auth();
  const isOnApp = request.nextUrl.pathname.startsWith("/app");
  const isOnAuth = request.nextUrl.pathname.startsWith("/auth");

  if (isOnApp && !session) {
    return Response.redirect(new URL("/auth/signin", request.nextUrl));
  }

  if (isOnAuth && session) {
    return Response.redirect(new URL("/app", request.nextUrl));
  }

  return response;
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
