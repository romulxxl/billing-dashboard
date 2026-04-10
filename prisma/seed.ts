import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { subMonths, startOfMonth, endOfMonth } from "date-fns";
import path from "node:path";

const dbUrl = process.env.DATABASE_URL ?? "file:./dev.db";
const resolvedUrl = dbUrl.startsWith("file:./")
  ? `file:${path.resolve(process.cwd(), dbUrl.slice(7))}`
  : dbUrl;

const adapter = new PrismaBetterSqlite3({ url: resolvedUrl });
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = new PrismaClient({ adapter } as any);

async function main() {
  console.log("🌱 Seeding database...");

  // Clean up existing demo data
  await db.invoice.deleteMany({ where: { userId: "demo-user" } });
  await db.subscription.deleteMany({ where: { userId: "demo-user" } });
  await db.user.deleteMany({ where: { id: "demo-user" } });

  // Create demo user
  const demoUser = await db.user.create({
    data: {
      id: "demo-user",
      email: "demo@synapse.app",
      name: "Alex Johnson",
      image:
        "https://ui-avatars.com/api/?name=Alex+Johnson&background=7C3AED&color=fff",
      stripeCustomerId: "cus_demo_placeholder",
    },
  });

  console.log(`✅ Created demo user: ${demoUser.email}`);

  const now = new Date();
  const nextBillingDate = new Date(now);
  nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);

  // Create Pro subscription
  const subscription = await db.subscription.create({
    data: {
      userId: demoUser.id,
      stripeSubscriptionId: "sub_demo_placeholder",
      stripePriceId:
        process.env.STRIPE_PRO_MONTHLY_PRICE_ID ?? "price_demo_pro_monthly",
      stripeCurrentPeriodEnd: nextBillingDate,
      status: "active",
      plan: "pro",
      interval: "month",
      cancelAtPeriodEnd: false,
    },
  });

  console.log(
    `✅ Created subscription: ${subscription.plan} / ${subscription.status}`
  );

  // Create 6 months of invoices
  const invoices = [];
  for (let i = 5; i >= 0; i--) {
    const monthDate = subMonths(now, i + 1);
    const periodStart = startOfMonth(monthDate);
    const periodEnd = endOfMonth(monthDate);
    const invoiceDate = new Date(periodStart);
    invoiceDate.setDate(2);

    invoices.push({
      userId: demoUser.id,
      stripeInvoiceId: `in_demo_${i}_${Date.now()}_${Math.random().toString(36).slice(2)}`,
      amountPaid: 2900,
      currency: "usd",
      status: "paid",
      description: "Synapse Pro — Monthly",
      periodStart,
      periodEnd,
      createdAt: invoiceDate,
    });
  }

  await db.invoice.createMany({ data: invoices });
  console.log(`✅ Created ${invoices.length} demo invoices`);

  console.log("\n🎉 Seed complete!");
  console.log("Demo credentials:");
  console.log("  Email: demo@synapse.app");
  console.log("  Click 'Continue as Demo User' on the login page");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
