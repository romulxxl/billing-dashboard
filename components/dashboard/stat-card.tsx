import { TrendingUp, TrendingDown } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  description?: string;
  icon: LucideIcon;
  trend?: { value: number; label: string };
  className?: string;
}

export function StatCard({ title, value, description, icon: Icon, trend, className }: StatCardProps) {
  const isPositive = (trend?.value ?? 0) >= 0;

  return (
    <div
      className={`rounded-2xl p-5 transition-all duration-200 ${className ?? ""}`}
      style={{
        background: "rgba(10,25,49,0.7)",
        border: "1px solid rgba(22,48,96,0.6)",
        backdropFilter: "blur(12px)",
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#64748b" }}>
          {title}
        </p>
        <div
          className="rounded-xl p-2"
          style={{ background: "rgba(37,99,235,0.12)", border: "1px solid rgba(59,130,246,0.15)" }}
        >
          <Icon className="h-4 w-4" style={{ color: "#3b82f6" }} />
        </div>
      </div>

      <p className="text-2xl font-bold text-white tracking-tight">{value}</p>
      {description && (
        <p className="mt-1 text-xs" style={{ color: "#64748b" }}>{description}</p>
      )}
      {trend && (
        <div
          className="mt-3 flex items-center gap-1 text-xs font-semibold"
          style={{ color: isPositive ? "#4ade80" : "#f87171" }}
        >
          {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
          {isPositive ? "+" : ""}{trend.value}% {trend.label}
        </div>
      )}
    </div>
  );
}
