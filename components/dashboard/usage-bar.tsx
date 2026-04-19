import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface UsageBarProps {
  label: string;
  used: number;
  limit: number;
  unit?: string;
  className?: string;
}

function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}k`;
  return n.toString();
}

const HIGH_USAGE_THRESHOLD = 80;

export function UsageBar({ label, used, limit, unit = "", className }: UsageBarProps) {
  const isUnlimited = !isFinite(limit);
  const pct = isUnlimited || limit === 0 ? 0 : Math.min(Math.round((used / limit) * 100), 100);
  const isHigh = !isUnlimited && pct >= HIGH_USAGE_THRESHOLD;

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-slate-200">{label}</span>
        <span className="text-slate-300">
          {formatNumber(used)}
          {unit} / {isUnlimited ? "∞" : `${formatNumber(limit)}${unit}`}
        </span>
      </div>
      <Progress
        value={pct}
        className={cn(isHigh && "[&>div]:bg-amber-500")}
      />
      <p className={cn("text-xs", isHigh ? "text-amber-400" : "text-slate-400")}>
        {isUnlimited ? "Unlimited" : `${pct}% used${isHigh ? " — approaching limit" : ""}`}
      </p>
    </div>
  );
}
