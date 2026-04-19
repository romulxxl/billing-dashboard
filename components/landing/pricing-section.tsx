"use client";

import { useState } from "react";
import { PricingToggle } from "@/components/billing/pricing-toggle";
import { PlanCard } from "@/components/billing/plan-card";
import { PLANS } from "@/lib/stripe-helpers";

interface PricingSectionProps {
  currentPlanId?: string | null;
  isDemo?: boolean;
}

export function PricingSection({ currentPlanId, isDemo }: PricingSectionProps) {
  const [interval, setInterval] = useState<"month" | "year">("month");

  return (
    <section
      className="py-24 relative overflow-hidden"
      id="pricing"
      style={{ background: "linear-gradient(180deg, #071224 0%, #040d1f 100%)" }}
    >
      {/* Background glow */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 100%, rgba(37,99,235,0.08) 0%, transparent 70%)",
        }}
      />

      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center mb-14">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/5 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-blue-400">
            Pricing
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Simple, transparent pricing
          </h2>
          <p className="mt-4 text-lg" style={{ color: "#94a3b8" }}>
            No hidden fees. Cancel anytime.
          </p>
          <div className="mt-8 flex justify-center">
            <PricingToggle value={interval} onChange={setInterval} />
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-3">
          {PLANS.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              interval={interval}
              currentPlanId={currentPlanId}
              isDemo={isDemo}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
