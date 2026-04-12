import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { Sidebar } from "@/components/layout/sidebar";
import { TopBar } from "@/components/layout/topbar";
import { Providers } from "@/components/providers";
import type { SessionUser } from "@/types";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const user: SessionUser = {
    id: session.user.id,
    name: session.user.name,
    email: session.user.email,
    image: session.user.image,
  };

  const isDemo = user.id === "demo-user";

  return (
    <Providers>
      <div className="flex h-screen overflow-hidden" style={{ background: "#071224" }}>
        {/* Desktop sidebar */}
        <div className="hidden lg:flex lg:shrink-0">
          <Sidebar user={user} isDemo={isDemo} />
        </div>

        {/* Main area */}
        <div className="flex flex-1 flex-col overflow-hidden">
          <TopBar user={user} isDemo={isDemo} />

          {/* Demo banner */}
          {isDemo && (
            <div
              className="px-6 py-2 text-center text-sm"
              style={{
                background: "rgba(251,191,36,0.06)",
                borderBottom: "1px solid rgba(251,191,36,0.15)",
                color: "#fbbf24",
              }}
            >
              <strong>Demo mode.</strong> Use Stripe test card{" "}
              <code
                className="rounded px-1 font-mono text-xs"
                style={{ background: "rgba(251,191,36,0.1)" }}
              >
                4242 4242 4242 4242
              </code>{" "}
              to test checkout.{" "}
              <a href="/login" className="underline font-medium hover:text-amber-300">
                Sign in with GitHub
              </a>{" "}
              for full access.
            </div>
          )}

          <main className="flex-1 overflow-y-auto p-6">{children}</main>
        </div>
      </div>
    </Providers>
  );
}
