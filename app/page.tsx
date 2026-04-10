import Link from "next/link";
import { SynapseLogo } from "@/components/ui/synapse-logo";
import { Button } from "@/components/ui/button";
import { Hero } from "@/components/landing/hero";
import { Features } from "@/components/landing/features";
import { PricingSection } from "@/components/landing/pricing-section";
import { Testimonials } from "@/components/landing/testimonials";
import { FAQ } from "@/components/landing/faq";
import { Footer } from "@/components/landing/footer";

export default function HomePage() {
  return (
    <div className="min-h-screen" style={{ background: "#040d1f" }}>
      {/* Navigation */}
      <nav
        className="sticky top-0 z-30 border-b backdrop-blur-md"
        style={{
          borderColor: "rgba(22,48,96,0.5)",
          background: "rgba(4,13,31,0.85)",
        }}
      >
        <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
          <SynapseLogo />
          <div className="hidden sm:flex items-center gap-8 text-sm">
            <Link href="#features" className="text-slate-500 hover:text-blue-300 transition-colors">
              Features
            </Link>
            <Link href="#pricing" className="text-slate-500 hover:text-blue-300 transition-colors">
              Pricing
            </Link>
            <Link href="/login" className="text-slate-500 hover:text-blue-300 transition-colors">
              Sign in
            </Link>
          </div>
          <Button size="sm" asChild>
            <Link href="/login">Get started free</Link>
          </Button>
        </div>
      </nav>

      <Hero />
      <Features />
      <Testimonials />
      <PricingSection />
      <FAQ />
      <Footer />
    </div>
  );
}
