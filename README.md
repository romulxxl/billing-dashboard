# Synapse Billing Dashboard

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Stripe](https://img.shields.io/badge/Stripe-TEST_MODE-635BFF?logo=stripe)
![Prisma](https://img.shields.io/badge/Prisma-7-2D3748?logo=prisma)
![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel)
![License](https://img.shields.io/badge/license-MIT-green)

A production-grade SaaS billing dashboard built as a portfolio demonstration. Simulates a fictional analytics product called **Synapse** — featuring real Stripe TEST mode subscriptions, GitHub OAuth, and a zero-config demo mode that requires only one environment variable to deploy.

**Live demo:** [your-app.vercel.app](https://your-app.vercel.app)

---

## Try the demo

No sign-up required. A pre-seeded account is ready to explore immediately.

1. Visit the app and click **"Continue as Demo User"**
2. Explore the dashboard — subscription status, usage bars, invoice history
3. Open **Billing** to see plan comparison (Starter / Pro / Enterprise)
4. Test a real Stripe checkout with card `4242 4242 4242 4242`, any future expiry, any CVC
5. Sign in with **GitHub** for a full session with real Stripe integration

---

## Features

### Authentication
- GitHub OAuth via NextAuth.js v5 with Prisma adapter (database sessions)
- One-click demo login — signed 24-hour JWT cookie, no database required
- Edge middleware route protection (`proxy.ts`) — fast cookie check before server hit

### Billing & Payments
- **Three-tier pricing** — Starter ($9/mo), Pro ($29/mo), Enterprise ($99/mo)
- Monthly / annual billing toggle (annual saves ~20%)
- Stripe Checkout Sessions for new subscriptions
- Stripe Customer Portal for self-service upgrades, downgrades, and cancellations
- Webhook processor handling 5 critical Stripe events (see table below)

### Dashboard
- Stat cards: monthly spend, active plan, next invoice date
- Usage progress bars: API events, team members, projects (with soft-limit indicators)
- Invoice history table with status badges and PDF download links
- Responsive sidebar navigation + mobile drawer

### Code Quality
- Zero TypeScript errors (`tsc --noEmit`) — strict mode enabled
- Zod validation on every API route input
- All monetary values stored in cents, displayed via `Intl.NumberFormat`
- Server Components by default; `"use client"` only where state or interactivity is needed
- Environment variables validated at startup with Zod schemas (`lib/env.ts`)

---

## Tech Stack

| Technology | Purpose | Version |
|---|---|---|
| Next.js (App Router) | Framework, SSR, API routes | 16 |
| TypeScript | Type safety (strict mode) | 5 |
| NextAuth.js | Auth — GitHub OAuth + demo JWT | 5 beta |
| Stripe | Payments, subscriptions, webhooks | 22 |
| Prisma | ORM, migrations, database GUI | 7 |
| SQLite / Turso libsql | Database (local / production) | — |
| TanStack Query | Server state + cache | 5 |
| Tailwind CSS | Utility-first styling | 4 |
| Radix UI | Accessible headless components | 1+ |
| React Hook Form + Zod | Form handling + validation | 7 / 4 |
| Sonner | Toast notifications | 2 |
| jose | JWT signing for demo sessions | 6 |
| date-fns | Date formatting | 4 |
| Vitest + RTL | Unit and component tests | 4 |

---

## Quick Start

**Prerequisites:** Node.js 20+, npm

```bash
# 1. Clone and install
git clone https://github.com/your-username/synapse-billing.git
cd synapse-billing
npm install

# 2. Set the minimum required environment variable
cp .env.example .env.local
echo "NEXTAUTH_SECRET=$(openssl rand -base64 32)" >> .env.local

# 3. Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and click **"Continue as Demo User"**. No database, no Stripe keys needed.

### Full local setup (database + Stripe)

```bash
# After completing the quick start steps above, add remaining .env.local values
# (see Environment Variables section), then:

npm run db:migrate     # Initialize SQLite schema
npm run db:seed        # Seed demo user + 6 months of invoices

# In a separate terminal — forward Stripe webhooks
stripe listen --forward-to localhost:3000/api/webhooks/stripe
# Copy the printed webhook secret → set as STRIPE_WEBHOOK_SECRET in .env.local
```

---

## Environment Variables

Copy `.env.example` to `.env.local`. Only `NEXTAUTH_SECRET` is required for demo mode.

```bash
# ── Required ──────────────────────────────────────────────────────────────────
# Generate with: openssl rand -base64 32
NEXTAUTH_SECRET=

# ── App URLs ──────────────────────────────────────────────────────────────────
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXTAUTH_URL=http://localhost:3000

# ── GitHub OAuth (optional — hides GitHub button if omitted) ──────────────────
# Create at: https://github.com/settings/developers → New OAuth App
# Callback URL: http://localhost:3000/api/auth/callback/github
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=

# ── Database (defaults to local SQLite) ───────────────────────────────────────
# Local:      file:./dev.db
# Turso:      libsql://<host>?authToken=<token>
DATABASE_URL=file:./dev.db

# ── Stripe (optional — Stripe routes return 403 DEMO_MODE if omitted) ─────────
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# ── Stripe Price IDs (from Stripe Dashboard → Products) ───────────────────────
STRIPE_STARTER_MONTHLY_PRICE_ID=price_...
STRIPE_STARTER_ANNUAL_PRICE_ID=price_...
STRIPE_PRO_MONTHLY_PRICE_ID=price_...
STRIPE_PRO_ANNUAL_PRICE_ID=price_...
STRIPE_ENTERPRISE_MONTHLY_PRICE_ID=price_...
STRIPE_ENTERPRISE_ANNUAL_PRICE_ID=price_...
```

---

## Scripts

```bash
npm run dev            # Start development server on http://localhost:3000
npm run build          # Generate Prisma client + Next.js production build
npm run start          # Start production server (after build)
npm run type-check     # TypeScript check — must pass with zero errors
npm run lint           # ESLint
npm run test           # Vitest in watch mode
npm run test:run       # Run all tests once and exit

npm run db:migrate     # Run Prisma migrations (creates/updates dev.db)
npm run db:seed        # Seed demo user + invoice history
npm run db:studio      # Open Prisma Studio GUI at http://localhost:5555
```

---

## Project Structure

```
synapse-billing/
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/    # NextAuth handlers (GitHub callback, session)
│   │   ├── demo-login/            # Issue 24-hour demo JWT cookie
│   │   ├── demo-logout/           # Clear demo session
│   │   ├── stripe/checkout/       # Create Stripe Checkout Session
│   │   ├── stripe/portal/         # Redirect to Stripe Customer Portal
│   │   ├── subscription/          # Fetch user subscription (or demo mock)
│   │   └── webhooks/stripe/       # Stripe webhook event processor
│   ├── dashboard/
│   │   ├── layout.tsx             # Sidebar + mobile nav shell
│   │   ├── page.tsx               # Overview: stat cards + usage bars
│   │   ├── billing/               # Plan cards + invoice history
│   │   └── settings/              # User profile settings
│   ├── login/                     # GitHub OAuth + demo login button
│   ├── pricing/                   # Public pricing page
│   └── page.tsx                   # Landing page (hero, features, testimonials, FAQ)
├── components/
│   ├── ui/                        # Design system — Button, Card, Badge, Dialog…
│   ├── layout/                    # Sidebar, TopBar, mobile navigation drawer
│   ├── dashboard/                 # StatCard, UsageBar, InvoiceTable
│   ├── billing/                   # PlanCard, CurrentPlanCard, PricingToggle
│   └── landing/                   # Hero, Features, Testimonials, FAQ, Footer
├── lib/
│   ├── auth.ts                    # NextAuth config (GitHub provider + Prisma adapter)
│   ├── db.ts                      # Prisma client singleton
│   ├── env.ts                     # Zod-validated environment variable schemas
│   ├── get-session.ts             # Unified session resolver (NextAuth + demo JWT)
│   ├── demo-session.ts            # Demo JWT sign/verify via jose
│   ├── stripe.ts                  # Stripe client (server-only)
│   ├── stripe-server.ts           # Price ID resolution helpers (server-only)
│   ├── stripe-helpers.ts          # Plan definitions and display metadata
│   ├── mock-data.ts               # Demo user + 6 months of invoice fixtures
│   └── utils.ts                   # cn(), formatCurrency(), formatDate()
├── prisma/
│   ├── schema.prisma              # User, Subscription, Invoice, Session models
│   ├── seed.ts                    # Demo data seeding script
│   └── migrations/                # Migration history
├── tests/
│   ├── api/                       # API route tests
│   ├── components/                # Component tests (Badge, InvoiceTable, etc.)
│   ├── lib/                       # Utility tests
│   └── setup.ts                   # Vitest + jsdom setup
├── types/index.ts                 # Shared TypeScript interfaces
└── proxy.ts                       # Edge middleware — route protection
```

---

## How Demo Mode Works

The entire dashboard is accessible without any database or Stripe credentials:

1. `/api/demo-login` signs a JWT with `NEXTAUTH_SECRET` (24h expiry) and sets it as an HTTP-only cookie
2. `proxy.ts` edge middleware accepts either a standard NextAuth session cookie **or** this demo JWT — no database hit
3. `getSession()` verifies the demo JWT via `jose` and returns a synthetic session object with `isDemo: true`
4. All Stripe API routes (`/checkout`, `/portal`) detect `session.isDemo` and return `403 DEMO_MODE` immediately
5. `/api/subscription` returns hard-coded mock data (Pro plan, active, renews next month)
6. Mock invoices — 6 months of $29 payments — are served from `lib/mock-data.ts`

The Prisma client is never instantiated in demo flows, so the app deploys to Vercel free tier with a single env var.

---

## Stripe Integration

### Webhook events processed

| Event | Action |
|---|---|
| `checkout.session.completed` | Create or update subscription + Stripe customer record |
| `invoice.payment_succeeded` | Store invoice record, update current period end |
| `invoice.payment_failed` | Set subscription status to `past_due` |
| `customer.subscription.updated` | Sync plan, billing interval, and cancel-at-period-end flag |
| `customer.subscription.deleted` | Mark subscription as `canceled` |

### Test cards

| Scenario | Card number |
|---|---|
| Successful payment | `4242 4242 4242 4242` |
| Requires 3D Secure auth | `4000 0025 0000 3155` |
| Payment declined | `4000 0000 0000 9995` |

Use any future expiry date and any 3-digit CVC.

---

## Database Schema

```
User
  id               CUID (primary key)
  email            Unique, from GitHub OAuth or seeded demo
  name, image      Display name, avatar URL
  stripeCustomerId Maps to a Stripe Customer object

Subscription
  stripeSubscriptionId  Stripe API identifier
  plan                  "starter" | "pro" | "enterprise"
  interval              "month" | "year"
  status                "active" | "past_due" | "canceled"
  stripeCurrentPeriodEnd  Next billing date
  cancelAtPeriodEnd     Scheduled cancellation flag

Invoice
  stripeInvoiceId   Stripe API identifier
  amountPaid        Integer (cents) — e.g. 2900 = $29.00
  currency          "usd"
  status            "paid" | "draft" | "open"
  invoicePdf        PDF download URL (optional)
  periodStart/End   Billing period covered

Account            NextAuth OAuth provider connections
Session            NextAuth database sessions
VerificationToken  NextAuth email verification tokens
```

---

## Deployment

### Vercel — demo only (free tier, one env var)

1. Push to GitHub
2. Import the repo in [Vercel](https://vercel.com)
3. Add one environment variable:
   ```
   NEXTAUTH_SECRET=<openssl rand -base64 32>
   ```
4. Deploy — the login page shows only **"Continue as Demo User"**

### Vercel — production (database + GitHub OAuth + Stripe)

1. **Provision a database.** [Turso](https://turso.tech) free tier works well:
   ```bash
   turso db create synapse-billing
   turso db tokens create synapse-billing
   ```

2. **Create a GitHub OAuth App:**
   - Settings → Developer settings → OAuth Apps → New
   - Homepage URL: `https://your-app.vercel.app`
   - Callback URL: `https://your-app.vercel.app/api/auth/callback/github`

3. **Set all environment variables** in Vercel (see section above).

4. **Register a Stripe webhook** in the Stripe Dashboard:
   - URL: `https://your-app.vercel.app/api/webhooks/stripe`
   - Events: `checkout.session.completed`, `invoice.payment_succeeded`, `invoice.payment_failed`, `customer.subscription.updated`, `customer.subscription.deleted`
   - Copy the signing secret → `STRIPE_WEBHOOK_SECRET`

5. **Deploy:**
   ```bash
   git push origin main
   ```
   The `postinstall` script runs `prisma generate` automatically on Vercel.

---

## License

MIT © 2025 — built as a portfolio demonstration
