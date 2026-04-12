"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { Loader2, Info } from "lucide-react";
import { SynapseLogo } from "@/components/ui/synapse-logo";

export default function LoginPage() {
  const router = useRouter();
  const [githubLoading, setGithubLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);

  async function handleGitHub() {
    setGithubLoading(true);
    try {
      await signIn("github", { callbackUrl: "/dashboard" });
    } catch {
      toast.error("GitHub sign-in failed. Please try again.");
      setGithubLoading(false);
    }
  }

  async function handleDemoLogin() {
    setDemoLoading(true);
    try {
      const res = await fetch("/api/demo-login", { method: "POST" });
      const json = await res.json();
      if (!res.ok || json.error) throw new Error(json.error ?? "Demo login failed");
      toast.success("Signed in as demo user!");
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Demo login failed");
      setDemoLoading(false);
    }
  }

  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center px-4 relative overflow-hidden"
      style={{ background: "#040d1f" }}
    >
      {/* Background orbs */}
      <div
        className="absolute rounded-full blur-3xl pointer-events-none"
        style={{
          width: 600,
          height: 600,
          top: "-20%",
          left: "-10%",
          background: "radial-gradient(circle, rgba(37,99,235,0.12) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute rounded-full blur-3xl pointer-events-none"
        style={{
          width: 400,
          height: 400,
          bottom: "-10%",
          right: "-5%",
          background: "radial-gradient(circle, rgba(6,182,212,0.08) 0%, transparent 70%)",
        }}
      />

      <div className="relative w-full max-w-sm">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center">
          <SynapseLogo />
          <h1 className="mt-6 text-2xl font-bold text-white">Welcome back</h1>
          <p className="mt-1 text-sm" style={{ color: "#475569" }}>
            The analytics platform for modern teams
          </p>
        </div>

        {/* Card */}
        <div
          className="rounded-2xl p-6 space-y-4"
          style={{
            background: "rgba(10,25,49,0.8)",
            border: "1px solid rgba(22,48,96,0.7)",
            backdropFilter: "blur(16px)",
            boxShadow: "0 0 60px rgba(37,99,235,0.08)",
          }}
        >
          {/* GitHub */}
          <button
            onClick={handleGitHub}
            disabled={githubLoading || demoLoading}
            className="w-full flex items-center justify-center gap-3 rounded-xl py-2.5 text-sm font-semibold transition-all disabled:opacity-40"
            style={{
              background: "rgba(22,48,96,0.5)",
              border: "1px solid rgba(22,48,96,0.8)",
              color: "#93c5fd",
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLElement).style.borderColor = "rgba(59,130,246,0.4)")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLElement).style.borderColor = "rgba(22,48,96,0.8)")
            }
          >
            {githubLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
              </svg>
            )}
            Continue with GitHub
          </button>

          {/* Divider */}
          <div className="relative flex items-center">
            <div className="flex-1 h-px" style={{ background: "rgba(22,48,96,0.6)" }} />
            <span className="px-3 text-xs" style={{ color: "#1e4080" }}>or</span>
            <div className="flex-1 h-px" style={{ background: "rgba(22,48,96,0.6)" }} />
          </div>

          {/* Demo login */}
          <div className="space-y-2">
            <button
              onClick={handleDemoLogin}
              disabled={githubLoading || demoLoading}
              className="w-full flex items-center justify-center gap-2.5 rounded-xl py-2.5 text-sm font-bold text-white transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-40"
              style={{
                background: "linear-gradient(135deg, #2563eb 0%, #0891b2 100%)",
                boxShadow: "0 4px 24px rgba(37,99,235,0.3)",
              }}
            >
              {demoLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <span className="text-base">✨</span>
              )}
              Continue as Demo User
            </button>

            <div
              className="flex items-start gap-2 rounded-xl px-3 py-2.5 text-xs"
              style={{
                background: "rgba(37,99,235,0.06)",
                border: "1px solid rgba(59,130,246,0.15)",
                color: "#64748b",
              }}
            >
              <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-blue-500" />
              <span>
                Explore the full dashboard with pre-loaded data. No signup needed.
                Use card{" "}
                <code
                  className="rounded px-1 font-mono"
                  style={{ background: "rgba(59,130,246,0.1)", color: "#60a5fa" }}
                >
                  4242 4242 4242 4242
                </code>{" "}
                to test checkout.
              </span>
            </div>
          </div>

          <p className="text-center text-xs" style={{ color: "#1e4080" }}>
            No credit card required for demo
          </p>
        </div>

        <p className="mt-6 text-center text-xs" style={{ color: "#1e4080" }}>
          By continuing you agree to our{" "}
          <a href="#" className="text-blue-500 hover:text-blue-400">Terms</a>{" "}
          and{" "}
          <a href="#" className="text-blue-500 hover:text-blue-400">Privacy Policy</a>.
        </p>
      </div>
    </div>
  );
}
