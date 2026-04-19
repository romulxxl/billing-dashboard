import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/get-session", () => ({ getSession: vi.fn() }));
vi.mock("@/lib/db", () => ({
  db: { user: { findUnique: vi.fn() } },
}));
vi.mock("@/lib/stripe", () => ({
  stripe: {
    billingPortal: { sessions: { create: vi.fn() } },
  },
}));
vi.mock("@/lib/env", () => ({
  env: { NEXT_PUBLIC_APP_URL: "http://localhost:3000" },
}));

import { getSession } from "@/lib/get-session";
import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { POST } from "@/app/api/stripe/portal/route";

const mockGetSession = getSession as ReturnType<typeof vi.fn>;
const mockUserFind = db.user.findUnique as ReturnType<typeof vi.fn>;
const mockPortalCreate = stripe.billingPortal.sessions.create as ReturnType<typeof vi.fn>;

beforeEach(() => {
  vi.clearAllMocks();
});

describe("POST /api/stripe/portal", () => {
  it("returns 401 when unauthenticated", async () => {
    mockGetSession.mockResolvedValue(null);
    const res = await POST();
    expect(res.status).toBe(401);
  });

  it("returns 403 for demo user", async () => {
    mockGetSession.mockResolvedValue({ user: { id: "demo-user" }, isDemo: true });
    const res = await POST();
    expect(res.status).toBe(403);
    const json = await res.json();
    expect(json.error).toBe("DEMO_MODE");
  });

  it("returns 404 when user has no Stripe customer", async () => {
    mockGetSession.mockResolvedValue({ user: { id: "user_1" }, isDemo: false });
    mockUserFind.mockResolvedValue({ id: "user_1", stripeCustomerId: null });
    const res = await POST();
    expect(res.status).toBe(404);
  });

  it("returns portal URL on success", async () => {
    mockGetSession.mockResolvedValue({ user: { id: "user_1" }, isDemo: false });
    mockUserFind.mockResolvedValue({ id: "user_1", stripeCustomerId: "cus_1" });
    mockPortalCreate.mockResolvedValue({ url: "https://billing.stripe.com/session/test" });
    const res = await POST();
    const json = await res.json();
    expect(json.data.url).toBe("https://billing.stripe.com/session/test");
    expect(json.error).toBeNull();
  });

  it("returns 500 when Stripe throws", async () => {
    mockGetSession.mockResolvedValue({ user: { id: "user_1" }, isDemo: false });
    mockUserFind.mockResolvedValue({ id: "user_1", stripeCustomerId: "cus_1" });
    mockPortalCreate.mockRejectedValue(new Error("Stripe error"));
    const res = await POST();
    expect(res.status).toBe(500);
  });
});
