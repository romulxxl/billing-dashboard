import { PricingSection } from "@/components/landing/pricing-section";
import { SynapseLogo } from "@/components/ui/synapse-logo";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Pricing — Synapse",
  description: "Simple, transparent pricing for every team size.",
};

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="border-b border-zinc-100 px-6 py-4">
        <div className="mx-auto max-w-6xl flex items-center justify-between">
          <Link href="/">
            <SynapseLogo />
          </Link>
          <Button variant="outline" size="sm" asChild>
            <Link href="/login">Sign in</Link>
          </Button>
        </div>
      </nav>

      <PricingSection />
    </div>
  );
}
