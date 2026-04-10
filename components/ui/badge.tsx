import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors border",
  {
    variants: {
      variant: {
        default: "bg-blue-500/15 border-blue-500/30 text-blue-300",
        active: "bg-green-500/15 border-green-500/30 text-green-400",
        trialing: "bg-cyan-500/15 border-cyan-500/30 text-cyan-400",
        past_due: "bg-amber-500/15 border-amber-500/30 text-amber-400",
        canceled: "bg-slate-500/15 border-slate-500/30 text-slate-400",
        outline: "border-navy-600 text-slate-300",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };

export function SubscriptionBadge({ status }: { status: string }) {
  const variantMap: Record<string, VariantProps<typeof badgeVariants>["variant"]> = {
    active: "active",
    trialing: "trialing",
    past_due: "past_due",
    canceled: "canceled",
  };
  const labelMap: Record<string, string> = {
    active: "Active",
    trialing: "Trial",
    past_due: "Past Due",
    canceled: "Canceled",
  };
  return (
    <Badge variant={variantMap[status] ?? "default"}>
      {labelMap[status] ?? status}
    </Badge>
  );
}
