import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { DEMO_COOKIE_NAME } from "@/lib/demo-session";

// Lightweight edge middleware — checks for either a NextAuth session cookie
// or a valid demo JWT cookie before allowing access to protected routes.
// Full session verification (user data, expiry, etc.) happens in server
// components via lib/get-session.ts.
export async function proxy(request: NextRequest) {
  const isProtected = request.nextUrl.pathname.startsWith("/dashboard");

  if (!isProtected) {
    return NextResponse.next();
  }

  // 1. Check NextAuth database session cookie
  const sessionToken =
    request.cookies.get("authjs.session-token")?.value ??
    request.cookies.get("__Secure-authjs.session-token")?.value;

  if (sessionToken) {
    return NextResponse.next();
  }

  // 2. Check demo JWT cookie
  const demoToken = request.cookies.get(DEMO_COOKIE_NAME)?.value;
  if (demoToken) {
    try {
      const secret = process.env.NEXTAUTH_SECRET;
      if (secret) {
        await jwtVerify(demoToken, new TextEncoder().encode(secret));
        return NextResponse.next();
      }
    } catch {
      // Invalid or expired demo token — fall through to redirect
    }
  }

  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("callbackUrl", request.nextUrl.pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
