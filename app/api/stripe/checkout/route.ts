import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";
import { env } from "@/lib/env";
import { getPriceId } from "@/lib/stripe-server";
import { z } from "zod";
import type { ApiResponse } from "@/types";

const checkoutSchema = z.object({
  planId: z.enum(["starter", "pro", "enterprise"]),
  interval: z.enum(["month", "year"]),
});

export async function POST(req: NextRequest) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json<ApiResponse<null>>(
      { data: null, error: "Unauthorized" },
      { status: 401 }
    );
  }

  if (session.user.id === "demo-user") {
    return NextResponse.json<ApiResponse<null>>(
      { data: null, error: "DEMO_MODE" },
      { status: 403 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json<ApiResponse<null>>(
      { data: null, error: "Invalid request body" },
      { status: 400 }
    );
  }
  const parsed = checkoutSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json<ApiResponse<null>>(
      { data: null, error: "Invalid request" },
      { status: 400 }
    );
  }

  const { planId, interval } = parsed.data;
  const priceId = getPriceId(planId, interval);

  try {
    const user = await db.user.findUnique({ where: { id: session.user.id } });
    if (!user) {
      return NextResponse.json<ApiResponse<null>>(
        { data: null, error: "User not found" },
        { status: 404 }
      );
    }

    let customerId = user.stripeCustomerId;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email ?? undefined,
        name: user.name ?? undefined,
        metadata: { userId: user.id },
      });
      customerId = customer.id;
      await db.user.update({
        where: { id: user.id },
        data: { stripeCustomerId: customerId },
      });
    }

    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${env.NEXT_PUBLIC_APP_URL}/dashboard/billing?success=true`,
      cancel_url: `${env.NEXT_PUBLIC_APP_URL}/dashboard/billing?canceled=true`,
      allow_promotion_codes: true,
      subscription_data: {
        metadata: { userId: user.id },
      },
    });

    if (!checkoutSession.url) {
      return NextResponse.json<ApiResponse<null>>(
        { data: null, error: "Stripe returned no checkout URL" },
        { status: 500 }
      );
    }

    return NextResponse.json<ApiResponse<{ url: string }>>({
      data: { url: checkoutSession.url },
      error: null,
    });
  } catch (err) {
    console.error("[POST /api/stripe/checkout]", err instanceof Error ? err.message : err);
    return NextResponse.json<ApiResponse<null>>(
      { data: null, error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
