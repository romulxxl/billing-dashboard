import { NextResponse } from "next/server";
import { DEMO_COOKIE_NAME } from "@/lib/demo-session";

export async function POST() {
  const response = NextResponse.json({ data: { ok: true }, error: null });
  response.cookies.set(DEMO_COOKIE_NAME, "", {
    expires: new Date(0),
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });
  return response;
}
