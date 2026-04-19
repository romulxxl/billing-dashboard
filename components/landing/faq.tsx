import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "Is there a free trial?",
    a: "Yes! Every plan comes with a 14-day free trial. No credit card required to start. You'll only be charged after the trial ends if you choose to continue.",
  },
  {
    q: "Can I change my plan at any time?",
    a: "Absolutely. Upgrade or downgrade at any time. When upgrading, you'll be charged a prorated amount for the remainder of your billing period. Downgrades take effect at the start of the next billing period.",
  },
  {
    q: "What happens if I exceed my event limit?",
    a: "We'll send you an alert when you reach 80% of your limit. If you exceed it, additional events are queued and processed once you upgrade. You won't lose any data.",
  },
  {
    q: "Do you offer annual billing discounts?",
    a: "Yes — switching to annual billing saves you 20% compared to monthly. That's roughly 2.4 months free per year.",
  },
  {
    q: "How do I cancel?",
    a: "Cancel anytime from your billing dashboard. Your subscription stays active until the end of the current billing period. No cancellation fees, no questions asked.",
  },
];

export function FAQ() {
  return (
    <section
      className="py-24"
      style={{ background: "linear-gradient(180deg, #0a1931 0%, #071224 100%)" }}
    >
      <div className="mx-auto max-w-3xl px-6">
        <div className="text-center mb-14">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/5 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-blue-400">
            FAQ
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Frequently asked questions
          </h2>
        </div>

        <div
          className="rounded-2xl overflow-hidden"
          style={{
            background: "rgba(10,25,49,0.6)",
            border: "1px solid rgba(22,48,96,0.6)",
            backdropFilter: "blur(12px)",
          }}
        >
          <Accordion type="single" collapsible>
            {faqs.map((faq, i) => (
              <AccordionItem
                key={i}
                value={`faq-${i}`}
                style={{ borderColor: "rgba(22,48,96,0.5)" }}
                className="px-6"
              >
                <AccordionTrigger className="text-left font-medium text-slate-100 hover:text-blue-300 py-5">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent style={{ color: "#94a3b8" }}>
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
