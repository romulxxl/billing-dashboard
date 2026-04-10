"use client";
// Client component: per-card dynamic glow color on hover requires JS

import { BarChart3, Zap, Shield, Globe, Bell, Code2 } from "lucide-react";
import { useState } from "react";

const features = [
  {
    icon: BarChart3,
    title: "Advanced Analytics",
    description: "Drill down into your data with beautiful charts, custom dashboards, and exportable reports that impress stakeholders.",
    color: "#3b82f6",
    glow: "rgba(59,130,246,0.15)",
  },
  {
    icon: Zap,
    title: "Real-time Events",
    description: "Track up to 10M events per month with sub-second latency. Never miss a beat in your product's performance.",
    color: "#22d3ee",
    glow: "rgba(34,211,238,0.15)",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "SOC 2 Type II certified. SSO, audit logs, and role-based access control keep your data safe.",
    color: "#818cf8",
    glow: "rgba(129,140,248,0.15)",
  },
  {
    icon: Globe,
    title: "Global Infrastructure",
    description: "Data stored in your region. 99.99% uptime SLA backed by our dedicated infrastructure team.",
    color: "#60a5fa",
    glow: "rgba(96,165,250,0.15)",
  },
  {
    icon: Bell,
    title: "Smart Alerts",
    description: "Set threshold-based alerts on any metric. Get notified via email, Slack, or webhooks the moment things change.",
    color: "#22d3ee",
    glow: "rgba(34,211,238,0.15)",
  },
  {
    icon: Code2,
    title: "Developer-first API",
    description: "RESTful API with SDKs for every major language. Comprehensive docs and a generous free tier to build with.",
    color: "#818cf8",
    glow: "rgba(129,140,248,0.15)",
  },
];

function FeatureCard({
  icon: Icon,
  title,
  description,
  color,
  glow,
}: (typeof features)[0]) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="group relative rounded-2xl p-6 transition-all duration-300 cursor-default"
      style={{
        background: "rgba(10,25,49,0.6)",
        border: `1px solid ${hovered ? color + "50" : "rgba(22,48,96,0.6)"}`,
        backdropFilter: "blur(12px)",
        boxShadow: hovered ? `0 0 30px ${glow}` : "none",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className="mb-5 inline-flex rounded-xl p-3"
        style={{ background: glow, border: `1px solid ${color}30` }}
      >
        <Icon className="h-5 w-5" style={{ color }} />
      </div>
      <h3 className="mb-2 font-semibold text-white">{title}</h3>
      <p className="text-sm leading-relaxed text-slate-500">{description}</p>

      {/* Corner accent */}
      <div
        className="absolute top-0 right-0 h-16 w-16 rounded-tr-2xl transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle at top right, ${glow}, transparent 70%)`,
          opacity: hovered ? 1 : 0,
        }}
      />
    </div>
  );
}

export function Features() {
  return (
    <section
      className="py-24"
      id="features"
      style={{ background: "linear-gradient(180deg, #040d1f 0%, #071224 100%)" }}
    >
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center mb-16">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/5 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-blue-400">
            Features
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Everything your team needs
          </h2>
          <p className="mt-4 text-lg text-slate-500 max-w-2xl mx-auto">
            From startup to enterprise, Synapse scales with you. One platform, every insight.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <FeatureCard key={f.title} {...f} />
          ))}
        </div>
      </div>
    </section>
  );
}
