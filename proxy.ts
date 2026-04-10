import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Lightweight edge middleware — only checks for the session cookie.
// Full auth verification happens in server components/routes via lib/auth.ts.
export function proxy(request: NextRequest) {
  const isProtected = request.nextUrl.pathname.startsWith("/dashboard");

  if (!isProtected) {
    return NextResponse.next();
  }

  // next-auth v5 with database sessions uses "authjs.session-token"
  const sessionToken =
    request.cookies.get("authjs.session-token")?.value ??
    request.cookies.get("__Secure-authjs.session-token")?.value;

  if (!sessionToken) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
