# Synapse Billing Dashboard

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Stripe](https://img.shields.io/badge/Stripe-TEST_MODE-635BFF?logo=stripe)
![Prisma](https://img.shields.io/badge/Prisma-7-2D3748?logo=prisma)
![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel)

A production-grade SaaS billing dashboard built as a portfolio demonstration. Simulates a fictional analytics product called **Synapse** with full Stripe TEST mode integration, real subscription flows, and a polished UI.

**Live demo:** [your-app.vercel.app](https://your-app.vercel.app)

---

![Dashboard Screenshot](docs/screenshot-placeholder.png)
*The dashboard overview with subscription stats, usage tracking, and invoice history.*

---

## Try the demo

No sign-up required. A pre-seeded demo account is ready to explore.

1. Visit the app and click **"Continue as Demo User"** on the login page
2. Explore the dashboard — subscription status, invoices, usage stats
3. Go to **Billing** to see plan comparison
4. Test a real Stripe checkout with card `4242 4242 4242 4242`, any future expiry, any CVC
5. Sign in with **GitHub** for full access and real Stripe interaction

---

## Features

**Authentication**
- GitHub OAuth via NextAuth.js v5
- One-click demo login (no GitHub required)
- Cookie-based session with Prisma adapter

**Billing & Payments**
- Stripe Checkout Sessions (real integration, TEST mode)
- Stripe Customer Portal for self-service management
- Webhook handler for 5 critical events
- Upgrade / downgrade / cancel flows

**Dashboard**
- Stat cards with trend indicators
- Usage progress bars (events, team members, projects)
- Invoice history table with PDF download links
- Responsive sidebar + mobile drawer navigation

**Data & Code Quality**
- Zero TypeScript errors (`tsc --noEmit`)
- Zod validation on all API inputs
- All money in cents, displayed via `Intl.NumberFormat`
- Server Components by default, `"use client"` only where needed
- Skeleton loaders for all async data
- Toast feedback for all user actions

---

## Tech Stack

| Technology | Purpose | Version |
|---|---|---|
| Next.js | Framework (App Router) | 16 |
| TypeScript | Type safety | 5 |
| NextAuth.js | Authentication | 5 beta |
| Stripe | Payments & billing | 22 |
| Prisma | ORM | 7 |
| SQLite | Local database | — |
| TanStack Query | Async state | 5 |
| Tailwind CSS | Styling | 4 |
| Radix UI | Accessible components | 1+ |
| Zod | Schema validation | 4 |
| Sonner | Toast notifications | 2 |
| date-fns | Date formatting | 4 |

---

## Local setup

**Prerequisites:** Node.js 20+, npm

```bash
# 1. Clone and install
git clone https://github.com/your-username/synapse-billing.git
cd synapse-billing
npm install

# 2. Copy environment variables
cp .env.example .env.local
# Fill in NEXTAUTH_SECRET, GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, and Stripe keys

# 3. Run database migration
npm run db:migrate

# 4. Seed demo data
npm run db:seed

# 5. Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and click **"Continue as Demo User"**.

---

## Stripe webhook testing (local)

```bash
# Install Stripe CLI: https://docs.stripe.com/stripe-cli

# Forward webhooks to your local server
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# Copy the webhook secret printed to your terminal
# Add it to .env.local as STRIPE_WEBHOOK_SECRET
```

Test events fire automatically when you use the demo checkout flow.

---

## Architecture

```
synapse-billing/
├── app/
│   ├── (public)/          Landing, pricing, login
│   ├── dashboard/         Protected pages (layout, overview, billing, settings)
│   └── api/               Auth, Stripe checkout/portal/webhooks, subscription
├── components/
│   ├── ui/                Design system (Button, Card, Badge, etc.)
│   ├── layout/            Sidebar + mobile TopBar
│   ├── dashboard/         StatCard, UsageBar, InvoiceTable
│   ├── billing/           PlanCard, CurrentPlanCard, PricingToggle
│   └── landing/           Hero, Features, Testimonials, FAQ, Footer
├── lib/
│   ├── auth.ts            NextAuth config (GitHub + demo)
│   ├── db.ts              Prisma client singleton
│   ├── stripe.ts          Stripe client
│   ├── stripe-helpers.ts  Plan definitions, price ID helpers
│   ├── env.ts             Zod-validated environment variables
│   └── utils.ts           cn(), formatCurrency(), formatDate()
├── prisma/
│   ├── schema.prisma      User, Subscription, Invoice, Session models
│   └── seed.ts            Demo user + 6 months of invoice history
├── proxy.ts               Route protection (cookie check)
└── types/index.ts         Shared TypeScript types
```

**Request flow:**
```
Browser → Middleware (cookie check) → Server Component (auth + DB) → UI
                                    ↓
                              API Route → Stripe API / DB
                                    ↑
                         Stripe Webhook → DB upsert
```

---

## Deployment

### Demo-only deploy on Vercel (no database)

The app ships a full in-memory demo mode — no DB or Stripe keys required.

1. Push to GitHub
2. Import the repo in [Vercel](https://vercel.com)
3. Add a single environment variable:
   ```
   NEXTAUTH_SECRET=<run: openssl rand -base64 32>
   ```
4. Deploy — the `/login` page will show only **"Continue as Demo User"**

All Stripe routes return `403 DEMO_MODE` before touching any real API; the Prisma
client is never instantiated because demo flows never call the DB.

### Full deploy (with real database)

For a production setup with real auth and payments:

1. Provision a hosted SQLite database (e.g. [Turso](https://turso.tech) — free tier available)
2. Set all variables from `.env.example` in Vercel's Environment Variables UI
3. Add the Stripe webhook endpoint: `https://your-app.vercel.app/api/webhooks/stripe`
4. Run `npm run db:migrate` against your production DB URL before first deploy

---

## License

MIT © 2025 — built as a portfolio demonstration
