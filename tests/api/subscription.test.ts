import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextResponse } from "next/server";

// --- mocks ---
vi.mock("@/lib/auth", () => ({ auth: vi.fn() }));
vi.mock("@/lib/db", () => ({
  db: { subscription: { findUnique: vi.fn() } },
}));

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { GET } from "@/app/api/subscription/route";

const mockAuth = auth as ReturnType<typeof vi.fn>;
const mockFindUnique = db.subscription.findUnique as ReturnType<typeof vi.fn>;

beforeEach(() => {
  vi.clearAllMocks();
});

describe("GET /api/subscription", () => {
  it("returns 401 when unauthenticated", async () => {
    mockAuth.mockResolvedValue(null);
    const res = await GET();
    expect(res.status).toBe(401);
    const json = await res.json();
    expect(json.error).toBe("Unauthorized");
  });

  it("returns 401 when session has no user id", async () => {
    mockAuth.mockResolvedValue({ user: {} });
    const res = await GET();
    expect(res.status).toBe(401);
  });

  it("returns subscription data for authenticated user", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user_1" } });
    const fakeSub = { id: "sub_1", plan: "pro", status: "active" };
    mockFindUnique.mockResolvedValue(fakeSub);
    const res = await GET();
    const json = await res.json();
    expect(json.data).toEqual(fakeSub);
    expect(json.error).toBeNull();
  });

  it("returns null data when no subscription exists", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user_1" } });
    mockFindUnique.mockResolvedValue(null);
    const res = await GET();
    const json = await res.json();
    expect(json.data).toBeNull();
    expect(json.error).toBeNull();
  });

  it("returns 500 when DB throws", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user_1" } });
    mockFindUnique.mockRejectedValue(new Error("DB down"));
    const res = await GET();
    expect(res.status).toBe(500);
    const json = await res.json();
    expect(json.error).toBe("Failed to fetch subscription");
  });
});
