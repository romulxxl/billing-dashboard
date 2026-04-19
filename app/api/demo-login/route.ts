import { NextResponse } from "next/server";
import { createDemoToken, DEMO_COOKIE_NAME } from "@/lib/demo-session";

/**
 * Signs in as the demo user by issuing a signed JWT cookie.
 * Zero database access — works with no DB configured.
 */
export async function POST() {
  let token: string;
  try {
    token = await createDemoToken();
  } catch (err) {
    const detail = err instanceof Error ? err.message : String(err);
    console.error("[POST /api/demo-login]", detail);
    return NextResponse.json(
      { data: null, error: detail },
      { status: 500 }
    );
  }

  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
  const response = NextResponse.json({ data: { ok: true }, error: null });

  response.cookies.set(DEMO_COOKIE_NAME, token, {
    expires,
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
  });

  return response;
}
