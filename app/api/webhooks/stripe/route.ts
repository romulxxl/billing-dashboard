import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";
import { env } from "@/lib/env";
import { getPlanFromPriceId, getIntervalFromPriceId } from "@/lib/stripe-server";
import type Stripe from "stripe";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Webhook verification failed";
    console.error("❌ Webhook signature verification failed:", message);
    return NextResponse.json({ error: message }, { status: 400 });
  }

  console.log(`✅ Stripe webhook: ${event.type} [${event.id}]`);

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const checkoutSession = event.data.object as Stripe.Checkout.Session;
        if (checkoutSession.mode !== "subscription") break;

        const subscriptionId = checkoutSession.subscription as string;
        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        const userId = subscription.metadata.userId;

        if (!userId) {
          console.error("No userId in subscription metadata");
          break;
        }

        const item = subscription.items.data[0];
        if (!item) {
          console.error("checkout.session.completed: subscription has no items", subscriptionId);
          break;
        }
        const priceId = item.price.id;
        const plan = getPlanFromPriceId(priceId);
        const interval = getIntervalFromPriceId(priceId);
        // In Stripe v22, current_period_end moved to subscription items
        const periodEnd = item.current_period_end;

        await db.subscription.upsert({
          where: { userId },
          create: {
            userId,
            stripeSubscriptionId: subscriptionId,
            stripePriceId: priceId,
            stripeCurrentPeriodEnd: new Date(periodEnd * 1000),
            status: subscription.status,
            plan: plan ?? "starter",
            interval,
            cancelAtPeriodEnd: subscription.cancel_at_period_end,
          },
          update: {
            stripeSubscriptionId: subscriptionId,
            stripePriceId: priceId,
            stripeCurrentPeriodEnd: new Date(periodEnd * 1000),
            status: subscription.status,
            plan: plan ?? "starter",
            interval,
            cancelAtPeriodEnd: subscription.cancel_at_period_end,
          },
        });
        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;
        // In Stripe v22, subscription is nested in parent.subscription_details
        const subscriptionId =
          typeof invoice.parent?.subscription_details?.subscription === "string"
            ? invoice.parent.subscription_details.subscription
            : invoice.parent?.subscription_details?.subscription?.id;

        if (!subscriptionId) break;

        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        const userId = subscription.metadata.userId;
        if (!userId) break;

        const invoiceItem = subscription.items.data[0];
        if (!invoiceItem) break;
        const periodEnd = invoiceItem.current_period_end;

        await db.subscription.updateMany({
          where: { stripeSubscriptionId: subscriptionId },
          data: {
            stripeCurrentPeriodEnd: new Date(periodEnd * 1000),
            status: subscription.status,
          },
        });

        const lines = invoice.lines.data;
        const periodStart = lines[0]?.period.start
          ? new Date(lines[0].period.start * 1000)
          : new Date();
        const periodEndDate = lines[0]?.period.end
          ? new Date(lines[0].period.end * 1000)
          : new Date();

        await db.invoice.upsert({
          where: { stripeInvoiceId: invoice.id },
          create: {
            userId,
            stripeInvoiceId: invoice.id,
            amountPaid: invoice.amount_paid,
            currency: invoice.currency,
            status: "paid",
            invoicePdf: invoice.invoice_pdf ?? null,
            description: invoice.description ?? "Subscription payment",
            periodStart,
            periodEnd: periodEndDate,
          },
          update: {
            amountPaid: invoice.amount_paid,
            status: "paid",
            invoicePdf: invoice.invoice_pdf ?? null,
          },
        });
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const subscriptionId =
          typeof invoice.parent?.subscription_details?.subscription === "string"
            ? invoice.parent.subscription_details.subscription
            : invoice.parent?.subscription_details?.subscription?.id;

        if (!subscriptionId) break;

        await db.subscription.updateMany({
          where: { stripeSubscriptionId: subscriptionId },
          data: { status: "past_due" },
        });
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const updatedItem = subscription.items.data[0];
        if (!updatedItem) break;
        const priceId = updatedItem.price.id;
        const plan = getPlanFromPriceId(priceId);
        const interval = getIntervalFromPriceId(priceId);
        const periodEnd = updatedItem.current_period_end;

        await db.subscription.updateMany({
          where: { stripeSubscriptionId: subscription.id },
          data: {
            stripePriceId: priceId,
            stripeCurrentPeriodEnd: new Date(periodEnd * 1000),
            status: subscription.status,
            plan: plan ?? "starter",
            interval,
            cancelAtPeriodEnd: subscription.cancel_at_period_end,
          },
        });
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        await db.subscription.updateMany({
          where: { stripeSubscriptionId: subscription.id },
          data: { status: "canceled" },
        });
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error(`Error processing webhook ${event.type}:`, message);
    // Return 500 so Stripe retries the webhook instead of marking it succeeded
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }

  return NextResponse.json({ received: true });
}
