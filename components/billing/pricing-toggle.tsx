"use client";

import { useState } from "react";

interface PricingToggleProps {
  value: "month" | "year";
  onChange: (value: "month" | "year") => void;
}

export function PricingToggle({ value, onChange }: PricingToggleProps) {
  return (
    <div className="flex items-center gap-3">
      <button
        onClick={() => onChange("month")}
        className="text-sm font-semibold transition-colors"
        style={{ color: value === "month" ? "#e1eefe" : "#64748b" }}
      >
        Monthly
      </button>

      <button
        role="switch"
        aria-checked={value === "year"}
        onClick={() => onChange(value === "month" ? "year" : "month")}
        className="relative inline-flex h-6 w-11 items-center rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
        style={{
          background: value === "year"
            ? "linear-gradient(90deg, #2563eb, #0891b2)"
            : "rgba(22,48,96,0.8)",
          border: "1px solid rgba(59,130,246,0.2)",
        }}
      >
        <span
          className="inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform"
          style={{ transform: value === "year" ? "translateX(24px)" : "translateX(4px)" }}
        />
      </button>

      <button
        onClick={() => onChange("year")}
        className="flex items-center gap-1.5 text-sm font-semibold transition-colors"
        style={{ color: value === "year" ? "#e1eefe" : "#64748b" }}
      >
        Annual
        <span
          className="rounded-full px-2 py-0.5 text-xs font-bold"
          style={{
            background: "rgba(34,197,94,0.12)",
            border: "1px solid rgba(34,197,94,0.25)",
            color: "#4ade80",
          }}
        >
          Save 20%
        </span>
      </button>
    </div>
  );
}

export function usePricingToggle() {
  const [interval, setInterval] = useState<"month" | "year">("month");
  return { interval, setInterval };
}
