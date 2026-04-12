import "server-only"; // prevents this module from being bundled client-side
import { z } from "zod";

const envSchema = z.object({
  // App
  NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),
  NEXT_PUBLIC_APP_NAME: z.string().default("Synapse"),

  // Auth
  NEXTAUTH_SECRET: z.string().min(1),
  NEXTAUTH_URL: z.string().url().default("http://localhost:3000"),
  GITHUB_CLIENT_ID: z.string().optional(),
  GITHUB_CLIENT_SECRET: z.string().optional(),

  // Database
  DATABASE_URL: z.string().min(1),

  // Stripe
  STRIPE_SECRET_KEY: z.string().startsWith("sk_"),
  STRIPE_WEBHOOK_SECRET: z.string().startsWith("whsec_"),
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().startsWith("pk_"),

  // Stripe Price IDs
  STRIPE_STARTER_MONTHLY_PRICE_ID: z.string().min(1),
  STRIPE_STARTER_ANNUAL_PRICE_ID: z.string().min(1),
  STRIPE_PRO_MONTHLY_PRICE_ID: z.string().min(1),
  STRIPE_PRO_ANNUAL_PRICE_ID: z.string().min(1),
  STRIPE_ENTERPRISE_MONTHLY_PRICE_ID: z.string().min(1),
  STRIPE_ENTERPRISE_ANNUAL_PRICE_ID: z.string().min(1),
});

type Env = z.infer<typeof envSchema>;

function validateEnv(): Env {
  // During `next build` (NEXT_PHASE = "phase-production-build") the runtime
  // environment variables are not injected yet — only build-time vars are present.
  // Skip strict validation here; missing vars will throw at the first runtime
  // request, not at build time. This allows Vercel builds to succeed even when
  // env vars are only configured in the deployment environment (not in CI).
  if (process.env.NEXT_PHASE === "phase-production-build") {
    return process.env as unknown as Env;
  }
  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    console.error("❌ Invalid environment variables:");
    console.error(parsed.error.flatten().fieldErrors);
    throw new Error("Invalid environment variables");
  }
  return parsed.data;
}

// Singleton — validated once at startup
export const env: Env = validateEnv();
