"use client";
// Client component: cancel/resume subscription actions with toast + dialog

import { useState } from "react";
import { Loader2, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SubscriptionBadge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/utils";
import { getPlanById } from "@/lib/stripe-helpers";
import type { Subscription } from "@prisma/client";

interface CurrentPlanCardProps {
  subscription: Subscription;
  isDemo?: boolean;
}

export function CurrentPlanCard({
  subscription,
  isDemo,
}: CurrentPlanCardProps) {
  const [loading, setLoading] = useState(false);
  const plan = getPlanById(subscription.plan);

  const monthlyPrice =
    subscription.interval === "month"
      ? (plan?.monthlyPrice ?? 0)
      : (plan?.annualPrice ?? 0);

  async function openPortal() {
    if (isDemo) {
      toast.warning("Demo mode — sign in with GitHub to manage your subscription.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const json = await res.json();
      if (!res.ok || json.error) throw new Error(json.error ?? "Failed to open portal");
      if (!json.data?.url) throw new Error("Invalid portal response");
      window.location.href = json.data.url;
    } catch {
      toast.error("Failed to open billing portal.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between">
        <div>
          <CardTitle>Current Plan</CardTitle>
          <p className="mt-1 text-sm text-slate-300">
            Manage your active subscription
          </p>
        </div>
        <SubscriptionBadge status={subscription.status} />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div>
            <p className="text-xs text-slate-400">Plan</p>
            <p className="mt-1 font-semibold capitalize text-slate-50">
              {plan?.name ?? subscription.plan}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-400">Billing</p>
            <p className="mt-1 font-semibold capitalize text-slate-50">
              {subscription.interval === "month" ? "Monthly" : "Annual"}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-400">Amount</p>
            <p className="mt-1 font-semibold text-slate-50">
              {formatCurrency(monthlyPrice)}/
              {subscription.interval === "month" ? "mo" : "yr"}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-400">Next billing</p>
            <p className="mt-1 font-semibold text-slate-50">
              {formatDate(subscription.stripeCurrentPeriodEnd)}
            </p>
          </div>
        </div>

        {subscription.cancelAtPeriodEnd && (
          <div className="flex items-center gap-2 rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-700">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            Your subscription will cancel on{" "}
            {formatDate(subscription.stripeCurrentPeriodEnd)}. You&apos;ll retain
            access until then.
          </div>
        )}

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={openPortal}
            disabled={loading}
          >
            {loading && <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />}
            Manage in Stripe Portal
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
