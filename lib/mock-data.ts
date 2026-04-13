import { subMonths, startOfMonth, endOfMonth } from "date-fns";
import type { Subscription, Invoice } from "@prisma/client";
import type { SessionUser } from "@/types";

export const DEMO_USER: SessionUser = {
  id: "demo-user",
  name: "Alex Johnson",
  email: "demo@synapse.app",
  image: "https://ui-avatars.com/api/?name=Alex+Johnson&background=7C3AED&color=fff",
};

function buildMockData() {
  const now = new Date();
  const nextBillingDate = new Date(now);
  nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);

  const subscription: Subscription = {
    id: "sub_demo",
    userId: "demo-user",
    stripeSubscriptionId: "sub_demo_placeholder",
    stripePriceId: "price_demo_pro_monthly",
    stripeCurrentPeriodEnd: nextBillingDate,
    status: "active",
    plan: "pro",
    interval: "month",
    cancelAtPeriodEnd: false,
    createdAt: subMonths(now, 6),
    updatedAt: now,
  };

  const invoices: Invoice[] = [];
  for (let i = 5; i >= 0; i--) {
    const monthDate = subMonths(now, i + 1);
    const periodStart = startOfMonth(monthDate);
    const periodEnd = endOfMonth(monthDate);
    const invoiceDate = new Date(periodStart);
    invoiceDate.setDate(2);
    invoices.push({
      id: `inv_demo_${i}`,
      userId: "demo-user",
      stripeInvoiceId: `in_demo_${i}`,
      amountPaid: 2900,
      currency: "usd",
      status: "paid",
      invoicePdf: null,
      description: "Synapse Pro — Monthly",
      periodStart,
      periodEnd,
      createdAt: invoiceDate,
    });
  }
  // Most recent first
  invoices.reverse();

  return { subscription, invoices };
}

// Computed once at module load — static for the lifetime of the process
const { subscription: MOCK_SUBSCRIPTION, invoices: MOCK_INVOICES } =
  buildMockData();

export { MOCK_SUBSCRIPTION, MOCK_INVOICES };
