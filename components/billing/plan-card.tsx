"use client";

import { useState } from "react";
import { Check, Loader2, Zap } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import type { Plan, Interval } from "@/lib/stripe-helpers";

interface PlanCardProps {
  plan: Plan;
  interval: Interval;
  currentPlanId?: string | null;
  isDemo?: boolean;
}

export function PlanCard({ plan, interval, currentPlanId, isDemo }: PlanCardProps) {
  const [loading, setLoading] = useState(false);
  const isCurrent = currentPlanId === plan.id;
  const price = interval === "month" ? plan.monthlyPrice : plan.annualPrice;

  async function handleSubscribe() {
    if (isDemo) {
      toast.warning("Demo mode — sign in with GitHub to test real payments.", {
        description: "Use card 4242 4242 4242 4242 with any future date.",
      });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId: plan.id, interval }),
      });
      const json = await res.json();
      if (json.error) throw new Error(json.error);
      window.location.href = json.data.url;
    } catch {
      toast.error("Failed to start checkout. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (plan.highlighted) {
    return (
      <div
        className="relative flex flex-col rounded-2xl p-px overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #3b82f6 0%, #22d3ee 50%, #818cf8 100%)",
        }}
      >
        {/* Badge */}
        {plan.badge && (
          <div className="absolute -top-px left-1/2 -translate-x-1/2 z-10">
            <span
              className="flex items-center gap-1 rounded-b-lg px-3 py-1 text-xs font-bold text-white"
              style={{ background: "linear-gradient(90deg, #3b82f6, #22d3ee)" }}
            >
              <Zap className="h-3 w-3" /> {plan.badge}
            </span>
          </div>
        )}

        <div
          className="flex flex-col flex-1 rounded-2xl p-6"
          style={{ background: "#0a1931" }}
        >
          <div className="mb-5 mt-3">
            <h3 className="text-lg font-bold text-white">{plan.name}</h3>
            <p className="mt-1 text-sm" style={{ color: "#64748b" }}>{plan.description}</p>
          </div>

          <div className="mb-6">
            <span className="text-4xl font-extrabold text-white">
              {formatCurrency(price, "usd")}
            </span>
            <span className="text-sm" style={{ color: "#64748b" }}>
              /{interval === "month" ? "mo" : "yr"}
            </span>
            {interval === "year" && (
              <p className="mt-1 text-xs text-cyan-400 font-medium">
                ≈ {formatCurrency(Math.round(price / 12), "usd")}/month
              </p>
            )}
          </div>

          <ul className="mb-6 space-y-3 flex-1">
            {plan.features.map((feature) => (
              <li key={feature} className="flex items-center gap-2.5 text-sm">
                <div
                  className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full"
                  style={{ background: "rgba(59,130,246,0.15)", border: "1px solid rgba(59,130,246,0.3)" }}
                >
                  <Check className="h-3 w-3 text-blue-400" />
                </div>
                <span style={{ color: "#93c5fd" }}>{feature}</span>
              </li>
            ))}
          </ul>

          <button
            onClick={handleSubscribe}
            disabled={isCurrent || loading}
            className="w-full rounded-xl py-2.5 text-sm font-bold text-white transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-40"
            style={{
              background: "linear-gradient(135deg, #2563eb 0%, #0891b2 100%)",
              boxShadow: "0 4px 20px rgba(37,99,235,0.4)",
            }}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" /> Processing…
              </span>
            ) : isCurrent ? (
              "Current plan"
            ) : (
              `Get ${plan.name}`
            )}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative flex flex-col rounded-2xl p-6 transition-all duration-200 hover:border-blue-500/30"
      style={{
        background: "rgba(10,25,49,0.6)",
        border: "1px solid rgba(22,48,96,0.6)",
        backdropFilter: "blur(12px)",
      }}
    >
      <div className="mb-5">
        <h3 className="text-lg font-bold text-white">{plan.name}</h3>
        <p className="mt-1 text-sm" style={{ color: "#64748b" }}>{plan.description}</p>
      </div>

      <div className="mb-6">
        <span className="text-4xl font-extrabold text-white">
          {formatCurrency(price, "usd")}
        </span>
        <span className="text-sm" style={{ color: "#64748b" }}>
          /{interval === "month" ? "mo" : "yr"}
        </span>
        {interval === "year" && (
          <p className="mt-1 text-xs text-cyan-400 font-medium">
            ≈ {formatCurrency(Math.round(price / 12), "usd")}/month
          </p>
        )}
      </div>

      <ul className="mb-6 space-y-3 flex-1">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-center gap-2.5 text-sm">
            <div
              className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full"
              style={{ background: "rgba(22,48,96,0.8)", border: "1px solid rgba(22,48,96,1)" }}
            >
              <Check className="h-3 w-3 text-blue-400" />
            </div>
            <span style={{ color: "#64748b" }}>{feature}</span>
          </li>
        ))}
      </ul>

      <Button
        onClick={handleSubscribe}
        disabled={isCurrent || loading}
        variant="outline"
        className="w-full"
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        {isCurrent ? "Current plan" : `Get ${plan.name}`}
      </Button>
    </div>
  );
}
