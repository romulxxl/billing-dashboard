import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// Signs in as the seeded demo user by creating a database session directly.
// Safe for both dev and production — demo user has no real Stripe access.
export async function POST() {
  const demoUser = await db.user.findUnique({
    where: { id: "demo-user" },
  });

  if (!demoUser) {
    return NextResponse.json(
      { data: null, error: "Demo user not found. Run `npm run db:seed` first." },
      { status: 404 }
    );
  }

  // Create a session that expires in 24 hours
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
  const sessionToken = crypto.randomUUID();

  try {
    await db.session.create({
      data: {
        sessionToken,
        userId: demoUser.id,
        expires,
      },
    });
  } catch (err) {
    console.error("[POST /api/demo-login] Failed to create session:", err instanceof Error ? err.message : err);
    return NextResponse.json(
      { data: null, error: "Failed to create demo session" },
      { status: 500 }
    );
  }

  const response = NextResponse.json({ data: { ok: true }, error: null });

  // Set the session cookie matching next-auth's database strategy
  response.cookies.set("authjs.session-token", sessionToken, {
    expires,
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
  });

  return response;
}
