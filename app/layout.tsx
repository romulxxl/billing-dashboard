import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Synapse — The analytics platform for modern teams",
  description:
    "Synapse gives your team real-time visibility into what matters. Track events, monitor usage, and make data-driven decisions.",
  keywords: ["analytics", "SaaS", "dashboard", "events", "monitoring"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.className}>
      <body className="min-h-screen bg-white antialiased">
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
