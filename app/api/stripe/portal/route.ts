import { NextResponse } from "next/server";
import { getSession } from "@/lib/get-session";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";
import { env } from "@/lib/env";
import type { ApiResponse } from "@/types";

export async function POST() {
  const session = await getSession();

  if (!session) {
    return NextResponse.json<ApiResponse<null>>(
      { data: null, error: "Unauthorized" },
      { status: 401 }
    );
  }

  if (session.isDemo) {
    return NextResponse.json<ApiResponse<null>>(
      { data: null, error: "DEMO_MODE" },
      { status: 403 }
    );
  }

  if (!session.user.id) {
    return NextResponse.json<ApiResponse<null>>(
      { data: null, error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const user = await db.user.findUnique({ where: { id: session.user.id } });
    if (!user?.stripeCustomerId) {
      return NextResponse.json<ApiResponse<null>>(
        { data: null, error: "No Stripe customer found" },
        { status: 404 }
      );
    }

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: `${env.NEXT_PUBLIC_APP_URL}/dashboard/billing`,
    });

    return NextResponse.json<ApiResponse<{ url: string }>>({
      data: { url: portalSession.url },
      error: null,
    });
  } catch (err) {
    console.error("[POST /api/stripe/portal]", err instanceof Error ? err.message : err);
    return NextResponse.json<ApiResponse<null>>(
      { data: null, error: "Failed to create portal session" },
      { status: 500 }
    );
  }
}
