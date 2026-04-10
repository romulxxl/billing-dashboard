// No env import — this file is safe to use in both server and client components.
// Price ID resolution happens server-side only (see getPriceIdServer in lib/stripe-server.ts).

export type PlanId = "starter" | "pro" | "enterprise";
export type Interval = "month" | "year";

export interface Plan {
  id: PlanId;
  name: string;
  description: string;
  monthlyPrice: number; // in cents
  annualPrice: number;  // in cents
  features: string[];
  highlighted: boolean;
  badge?: string;
}

export const PLANS: Plan[] = [
  {
    id: "starter",
    name: "Starter",
    description: "Perfect for small teams getting started.",
    monthlyPrice: 900,
    annualPrice: 8600,
    highlighted: false,
    features: [
      "3 projects",
      "5 team members",
      "10k events / month",
      "Basic analytics",
      "Email support",
      "API access",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    description: "For growing teams who need more power.",
    monthlyPrice: 2900,
    annualPrice: 27800,
    highlighted: true,
    badge: "Most popular",
    features: [
      "Unlimited projects",
      "25 team members",
      "500k events / month",
      "Advanced analytics",
      "Priority support",
      "Custom dashboards",
      "Webhooks",
      "SSO",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "For large organizations with custom needs.",
    monthlyPrice: 9900,
    annualPrice: 95000,
    highlighted: false,
    features: [
      "Everything in Pro",
      "Unlimited members",
      "10M events / month",
      "Dedicated infrastructure",
      "SLA 99.99%",
      "Custom contracts",
      "Onboarding specialist",
      "Audit logs",
    ],
  },
];

export function getPlanById(id: string): Plan | undefined {
  return PLANS.find((p) => p.id === id);
}
