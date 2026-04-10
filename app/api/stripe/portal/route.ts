import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";
import { env } from "@/lib/env";
import type { ApiResponse } from "@/types";

export async function POST() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json<ApiResponse<null>>(
      { data: null, error: "Unauthorized" },
      { status: 401 }
    );
  }

  // Block demo user
  if (session.user.id === "demo-user") {
    return NextResponse.json<ApiResponse<null>>(
      { data: null, error: "DEMO_MODE" },
      { status: 403 }
    );
  }

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
}
