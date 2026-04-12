import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

vi.mock("@/lib/auth", () => ({ auth: vi.fn() }));
vi.mock("@/lib/db", () => ({
  db: { user: { findUnique: vi.fn(), update: vi.fn() } },
}));
vi.mock("@/lib/stripe", () => ({
  stripe: {
    customers: { create: vi.fn() },
    checkout: { sessions: { create: vi.fn() } },
  },
}));
vi.mock("@/lib/env", () => ({
  env: {
    NEXT_PUBLIC_APP_URL: "http://localhost:3000",
    STRIPE_SECRET_KEY: "sk_test",
    STRIPE_WEBHOOK_SECRET: "whsec_test",
    STRIPE_STARTER_MONTHLY_PRICE_ID: "price_starter_month",
    STRIPE_STARTER_ANNUAL_PRICE_ID: "price_starter_year",
    STRIPE_PRO_MONTHLY_PRICE_ID: "price_pro_month",
    STRIPE_PRO_ANNUAL_PRICE_ID: "price_pro_year",
    STRIPE_ENTERPRISE_MONTHLY_PRICE_ID: "price_enterprise_month",
    STRIPE_ENTERPRISE_ANNUAL_PRICE_ID: "price_enterprise_year",
  },
}));

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { POST } from "@/app/api/stripe/checkout/route";

const mockAuth = auth as ReturnType<typeof vi.fn>;
const mockUserFind = db.user.findUnique as ReturnType<typeof vi.fn>;
const mockUserUpdate = db.user.update as ReturnType<typeof vi.fn>;
const mockCustomerCreate = stripe.customers.create as ReturnType<typeof vi.fn>;
const mockSessionCreate = stripe.checkout.sessions.create as ReturnType<typeof vi.fn>;

function makeRequest(body: unknown) {
  return new NextRequest("http://localhost/api/stripe/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("POST /api/stripe/checkout", () => {
  it("returns 401 when unauthenticated", async () => {
    mockAuth.mockResolvedValue(null);
    const res = await POST(makeRequest({ planId: "pro", interval: "month" }));
    expect(res.status).toBe(401);
  });

  it("returns 403 for demo user", async () => {
    mockAuth.mockResolvedValue({ user: { id: "demo-user" } });
    const res = await POST(makeRequest({ planId: "pro", interval: "month" }));
    expect(res.status).toBe(403);
    const json = await res.json();
    expect(json.error).toBe("DEMO_MODE");
  });

  it("returns 400 for invalid planId", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user_1" } });
    const res = await POST(makeRequest({ planId: "invalid", interval: "month" }));
    expect(res.status).toBe(400);
  });

  it("returns 400 for invalid interval", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user_1" } });
    const res = await POST(makeRequest({ planId: "pro", interval: "weekly" }));
    expect(res.status).toBe(400);
  });

  it("returns 400 for malformed body", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user_1" } });
    const req = new NextRequest("http://localhost/api/stripe/checkout", {
      method: "POST",
      body: "not json",
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("returns 404 when user not in DB", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user_1" } });
    mockUserFind.mockResolvedValue(null);
    const res = await POST(makeRequest({ planId: "pro", interval: "month" }));
    expect(res.status).toBe(404);
  });

  it("creates Stripe customer when none exists", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user_1" } });
    mockUserFind.mockResolvedValue({ id: "user_1", email: "u@ex.com", name: "U", stripeCustomerId: null });
    mockUserUpdate.mockResolvedValue({});
    mockCustomerCreate.mockResolvedValue({ id: "cus_new" });
    mockSessionCreate.mockResolvedValue({ url: "https://checkout.stripe.com/pay/test" });
    const res = await POST(makeRequest({ planId: "pro", interval: "month" }));
    expect(mockCustomerCreate).toHaveBeenCalled();
    expect(res.status).toBe(200);
  });

  it("reuses existing Stripe customer", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user_1" } });
    mockUserFind.mockResolvedValue({ id: "user_1", email: "u@ex.com", name: "U", stripeCustomerId: "cus_existing" });
    mockSessionCreate.mockResolvedValue({ url: "https://checkout.stripe.com/pay/test" });
    const res = await POST(makeRequest({ planId: "starter", interval: "year" }));
    expect(mockCustomerCreate).not.toHaveBeenCalled();
    expect(res.status).toBe(200);
  });

  it("returns checkout URL on success", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user_1" } });
    mockUserFind.mockResolvedValue({ id: "user_1", email: "u@ex.com", name: "U", stripeCustomerId: "cus_1" });
    mockSessionCreate.mockResolvedValue({ url: "https://checkout.stripe.com/pay/test" });
    const res = await POST(makeRequest({ planId: "enterprise", interval: "month" }));
    const json = await res.json();
    expect(json.data.url).toBe("https://checkout.stripe.com/pay/test");
  });

  it("returns 500 when Stripe returns no URL", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user_1" } });
    mockUserFind.mockResolvedValue({ id: "user_1", stripeCustomerId: "cus_1" });
    mockSessionCreate.mockResolvedValue({ url: null });
    const res = await POST(makeRequest({ planId: "pro", interval: "month" }));
    expect(res.status).toBe(500);
  });
});
