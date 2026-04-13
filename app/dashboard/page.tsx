import { getSession } from "@/lib/get-session";
import { db } from "@/lib/db";
import { MOCK_SUBSCRIPTION, MOCK_INVOICES } from "@/lib/mock-data";
import { redirect } from "next/navigation";
import { DollarSign, CreditCard, Calendar, Zap, ArrowRight } from "lucide-react";
import Link from "next/link";
import { StatCard } from "@/components/dashboard/stat-card";
import { UsageBar } from "@/components/dashboard/usage-bar";
import { InvoiceTable } from "@/components/dashboard/invoice-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatDate } from "@/lib/utils";
import { getPlanById } from "@/lib/stripe-helpers";

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const { user, isDemo } = session;

  const [subscription, invoices] = isDemo
    ? [MOCK_SUBSCRIPTION, MOCK_INVOICES.slice(0, 3)]
    : await Promise.all([
        db.subscription.findUnique({ where: { userId: user.id } }),
        db.invoice.findMany({
          where: { userId: user.id },
          orderBy: { createdAt: "desc" },
          take: 3,
        }),
      ]);

  const plan = subscription ? getPlanById(subscription.plan) : null;

  // Fake realistic usage stats for demo appeal
  const plan_id = subscription?.plan ?? "starter";
  const eventLimits:       Record<string, number> = { starter: 10_000,  pro: 500_000, enterprise: 10_000_000 };
  const memberLimits:      Record<string, number> = { starter: 5,       pro: 25,      enterprise: Infinity    };
  const projectLimits:     Record<string, number> = { starter: 3,       pro: Infinity, enterprise: Infinity   };
  const projectsUsed:      Record<string, number> = { starter: 2,       pro: 7,        enterprise: 7          };
  const usageStats = {
    events:      { used: 312_500, limit: eventLimits[plan_id]   ?? 10_000 },
    teamMembers: { used: 8,       limit: memberLimits[plan_id]  ?? 5      },
    projects:    { used: projectsUsed[plan_id] ?? 2, limit: projectLimits[plan_id] ?? 3 },
  };

  const monthlyAmount = subscription?.interval === "month"
    ? (plan?.monthlyPrice ?? 0)
    : (plan?.annualPrice ?? 0);

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-zinc-900">
          {getGreeting()}, {user.name?.split(" ")[0] ?? "there"} 👋
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          Here&apos;s what&apos;s happening with your Synapse account today.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Monthly Spend"
          value={formatCurrency(monthlyAmount)}
          description={subscription ? `${subscription.plan} plan` : "No active plan"}
          icon={DollarSign}
          trend={{ value: 0, label: "vs last month" }}
        />
        <StatCard
          title="Active Plan"
          value={plan?.name ?? "None"}
          description={subscription?.interval === "month" ? "Monthly billing" : "Annual billing"}
          icon={CreditCard}
          trend={{ value: 12, label: "since joining" }}
        />
        <StatCard
          title="Next Invoice"
          value={
            subscription
              ? formatDate(subscription.stripeCurrentPeriodEnd)
              : "—"
          }
          description={
            subscription
              ? formatCurrency(monthlyAmount) + " due"
              : "Subscribe to get started"
          }
          icon={Calendar}
        />
        <StatCard
          title="Events This Month"
          value="312.5k"
          description={`of ${usageStats.events.limit >= 1_000_000 ? `${usageStats.events.limit / 1_000_000}M` : `${usageStats.events.limit / 1_000}k`} limit`}
          icon={Zap}
          trend={{ value: 24, label: "vs last month" }}
        />
      </div>

      {/* Usage + Recent invoices */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Usage */}
        <Card>
          <CardHeader>
            <CardTitle>Usage this month</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <UsageBar
              label="Events"
              used={usageStats.events.used}
              limit={usageStats.events.limit}
            />
            <UsageBar
              label="Team Members"
              used={usageStats.teamMembers.used}
              limit={usageStats.teamMembers.limit}
            />
            <UsageBar
              label="Projects"
              used={usageStats.projects.used}
              limit={usageStats.projects.limit}
            />
          </CardContent>
        </Card>

        {/* Recent invoices */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent invoices</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/billing">
                View all <ArrowRight className="ml-1 h-3 w-3" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <InvoiceTable invoices={invoices} />
          </CardContent>
        </Card>
      </div>

      {/* Quick actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick actions</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/billing">
              <CreditCard className="mr-2 h-4 w-4" />
              {subscription ? "Manage subscription" : "Upgrade plan"}
            </Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/billing">
              Download invoice
            </Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/settings">
              Invite teammate
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
