import { auth } from "@/lib/auth";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isOnApp = req.nextUrl.pathname.startsWith("/app");
  const isOnAuth = req.nextUrl.pathname.startsWith("/auth");

  if (isOnApp && !isLoggedIn) {
    return Response.redirect(new URL("/auth/signin", req.nextUrl));
  }

  if (isOnAuth && isLoggedIn) {
    return Response.redirect(new URL("/app", req.nextUrl));
  }
});

export const config = {
  matcher: ["/app/:path*", "/auth/:path*"],
};
