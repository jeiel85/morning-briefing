import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const VISITOR_COOKIE = "db_visitor";

export default function middleware(request: NextRequest) {
  const acceptLang = request.headers.get("accept-language") || "";
  const locale = acceptLang.startsWith("ko") ? "ko" : "en";

  const response = NextResponse.next();

  response.cookies.set("NEXT_LOCALE", locale, {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30,
  });

  return response;
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
