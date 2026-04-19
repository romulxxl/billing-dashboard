import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative overflow-hidden py-28 sm:py-36">
      <div className="absolute inset-0 -z-10" style={{ background: "#040d1f" }} />

      {/* Glowing orbs */}
      <div
        className="absolute -z-10 rounded-full blur-3xl"
        style={{
          width: 700, height: 700, top: "-20%", left: "-10%",
          background: "radial-gradient(circle, rgba(37,99,235,0.18) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute -z-10 rounded-full blur-3xl"
        style={{
          width: 500, height: 500, top: "10%", right: "-5%",
          background: "radial-gradient(circle, rgba(6,182,212,0.12) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute -z-10 rounded-full blur-3xl"
        style={{
          width: 400, height: 400, bottom: "0", left: "40%",
          background: "radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)",
        }}
      />

      {/* Grid overlay */}
      <div
        className="absolute inset-0 -z-10 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(147,197,253,1) 1px, transparent 1px), linear-gradient(90deg, rgba(147,197,253,1) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="mx-auto max-w-4xl px-6 text-center">
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-sm text-blue-300 backdrop-blur-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse" />
          Now with AI-powered insights
          <ArrowRight className="h-3 w-3 opacity-60" />
        </div>

        <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl">
          <span className="block text-white">The analytics platform</span>
          <span
            className="block mt-2"
            style={{
              background: "linear-gradient(135deg, #60a5fa 0%, #22d3ee 50%, #818cf8 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            for modern teams
          </span>
        </h1>

        <p className="mt-8 text-xl leading-relaxed max-w-2xl mx-auto text-blue-300/70">
          Synapse gives your team real-time visibility into what matters. Track
          events, monitor usage, and make data‑driven decisions — all in one
          beautifully simple dashboard.
        </p>

        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button size="lg" variant="glow" asChild>
            <Link href="/login">
              Start free trial <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            asChild
            className="border-navy-600 bg-navy-800/40 text-slate-200 hover:bg-navy-700 hover:border-blue-500/40"
          >
            <Link href="/login">
              <Play className="h-4 w-4 text-cyan-400" />
              View demo
            </Link>
          </Button>
        </div>

        <p className="mt-4 text-sm text-slate-400">
          No credit card required · 14-day free trial · Cancel anytime
        </p>

        {/* Social proof */}
        <div
          className="mt-20 border-t pt-12"
          style={{ borderColor: "rgba(22,48,96,0.8)" }}
        >
          <p className="text-xs font-semibold uppercase tracking-widest mb-8 text-slate-400">
            Trusted by teams at
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
            {["Acme Corp", "Globex", "Initech", "Umbrella", "Hooli"].map((company) => (
              <span
                key={company}
                className="text-base font-bold tracking-tight text-slate-400 hover:text-blue-400 transition-colors cursor-default"
              >
                {company}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
