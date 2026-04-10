import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { CurrentPlanCard } from "@/components/billing/current-plan-card";
import { PricingSection } from "@/components/landing/pricing-section";
import { InvoiceTable } from "@/components/dashboard/invoice-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function BillingPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const isDemo = session.user.id === "demo-user";

  const [subscription, invoices] = await Promise.all([
    db.subscription.findUnique({ where: { userId: session.user.id } }),
    db.invoice.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900">Billing</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Manage your subscription and view invoice history.
        </p>
      </div>

      {/* Current plan */}
      {subscription ? (
        <CurrentPlanCard subscription={subscription} isDemo={isDemo} />
      ) : (
        <div className="rounded-xl border border-dashed border-zinc-300 bg-zinc-50 p-8 text-center">
          <p className="font-medium text-zinc-700">No active subscription</p>
          <p className="mt-1 text-sm text-zinc-500">
            Choose a plan below to get started.
          </p>
        </div>
      )}

      {/* Plan comparison / upgrade */}
      <div>
        <h2 className="text-lg font-semibold text-zinc-900 mb-4">
          {subscription ? "Change plan" : "Choose a plan"}
        </h2>
        <PricingSection currentPlanId={subscription?.plan} isDemo={isDemo} />
      </div>

      {/* Invoice history */}
      <Card>
        <CardHeader>
          <CardTitle>Invoice history</CardTitle>
        </CardHeader>
        <CardContent>
          <InvoiceTable invoices={invoices} />
        </CardContent>
      </Card>
    </div>
  );
}
