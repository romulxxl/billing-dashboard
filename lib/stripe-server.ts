import "server-only"; // prevents this module from being bundled client-side
// Server-only — imports env. Never import this from client components.
import { env } from "@/lib/env";
import type { PlanId, Interval } from "@/lib/stripe-helpers";

const PRICE_ID_MAP: Record<PlanId, Record<Interval, string>> = {
  starter: {
    month: env.STRIPE_STARTER_MONTHLY_PRICE_ID,
    year: env.STRIPE_STARTER_ANNUAL_PRICE_ID,
  },
  pro: {
    month: env.STRIPE_PRO_MONTHLY_PRICE_ID,
    year: env.STRIPE_PRO_ANNUAL_PRICE_ID,
  },
  enterprise: {
    month: env.STRIPE_ENTERPRISE_MONTHLY_PRICE_ID,
    year: env.STRIPE_ENTERPRISE_ANNUAL_PRICE_ID,
  },
};

export function getPriceId(planId: PlanId, interval: Interval): string {
  return PRICE_ID_MAP[planId][interval];
}

export function getPlanFromPriceId(
  priceId: string
): PlanId | undefined {
  for (const [plan, intervals] of Object.entries(PRICE_ID_MAP)) {
    if (Object.values(intervals).includes(priceId)) {
      return plan as PlanId;
    }
  }
  return undefined;
}

export function getIntervalFromPriceId(priceId: string): Interval {
  for (const intervals of Object.values(PRICE_ID_MAP)) {
    if (intervals.month === priceId) return "month";
    if (intervals.year === priceId) return "year";
  }
  return "month";
}
