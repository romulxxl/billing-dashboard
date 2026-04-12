import "@testing-library/jest-dom";

// Provide minimal env vars so lib/env.ts Zod validation passes at test runtime.
process.env.NEXTAUTH_SECRET = "test-secret";
process.env.NEXTAUTH_URL = "http://localhost:3000";
process.env.NEXT_PUBLIC_APP_URL = "http://localhost:3000";
process.env.DATABASE_URL = "file:./test.db";
process.env.STRIPE_SECRET_KEY = "sk_test_placeholder";
process.env.STRIPE_WEBHOOK_SECRET = "whsec_placeholder";
process.env.STRIPE_STARTER_MONTHLY_PRICE_ID = "price_starter_month";
process.env.STRIPE_STARTER_ANNUAL_PRICE_ID = "price_starter_year";
process.env.STRIPE_PRO_MONTHLY_PRICE_ID = "price_pro_month";
process.env.STRIPE_PRO_ANNUAL_PRICE_ID = "price_pro_year";
process.env.STRIPE_ENTERPRISE_MONTHLY_PRICE_ID = "price_enterprise_month";
process.env.STRIPE_ENTERPRISE_ANNUAL_PRICE_ID = "price_enterprise_year";
