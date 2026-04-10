import Link from "next/link";
import { SynapseLogo } from "@/components/ui/synapse-logo";

const links = {
  Product: ["Features", "Pricing", "Changelog", "Roadmap"],
  Company: ["About", "Blog", "Careers", "Press"],
  Legal: ["Privacy", "Terms", "Security", "Cookies"],
};

export function Footer() {
  return (
    <footer
      className="border-t py-16"
      style={{ background: "#040d1f", borderColor: "rgba(22,48,96,0.5)" }}
    >
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <SynapseLogo />
            <p className="mt-4 text-sm leading-relaxed text-navy-500">
              The analytics platform for modern teams. Ship faster with better data.
            </p>
          </div>
          {Object.entries(links).map(([category, items]) => (
            <div key={category}>
              <p className="text-xs font-semibold uppercase tracking-widest mb-4 text-navy-500">
                {category}
              </p>
              <ul className="space-y-2.5">
                {items.map((item) => (
                  <li key={item}>
                    <Link
                      href="#"
                      className="text-sm text-navy-500 hover:text-blue-400 transition-colors"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div
          className="mt-14 border-t pt-8 flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{ borderColor: "rgba(22,48,96,0.4)" }}
        >
          <p className="text-sm text-navy-500">© 2025 Synapse, Inc. All rights reserved.</p>
          <p className="text-sm text-navy-500">Built with Next.js · Hosted on Vercel</p>
        </div>
      </div>
    </footer>
  );
}
