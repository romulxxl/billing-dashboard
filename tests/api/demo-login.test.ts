import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/db", () => ({
  db: {
    user: { findUnique: vi.fn() },
    session: { create: vi.fn() },
  },
}));

import { db } from "@/lib/db";
import { POST } from "@/app/api/demo-login/route";

const mockUserFind = db.user.findUnique as ReturnType<typeof vi.fn>;
const mockSessionCreate = db.session.create as ReturnType<typeof vi.fn>;

const demoUser = { id: "demo-user", email: "demo@example.com", name: "Demo" };

beforeEach(() => {
  vi.clearAllMocks();
});

describe("POST /api/demo-login", () => {
  it("returns 404 when demo user not seeded", async () => {
    mockUserFind.mockResolvedValue(null);
    const res = await POST();
    expect(res.status).toBe(404);
    const json = await res.json();
    expect(json.error).toMatch(/Demo user not found/);
  });

  it("returns 200 on success", async () => {
    mockUserFind.mockResolvedValue(demoUser);
    mockSessionCreate.mockResolvedValue({});
    const res = await POST();
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.data.ok).toBe(true);
    expect(json.error).toBeNull();
  });

  it("sets authjs.session-token cookie on success", async () => {
    mockUserFind.mockResolvedValue(demoUser);
    mockSessionCreate.mockResolvedValue({});
    const res = await POST();
    const cookieHeader = res.headers.get("set-cookie");
    expect(cookieHeader).toContain("authjs.session-token");
  });

  it("returns 500 when session create fails", async () => {
    mockUserFind.mockResolvedValue(demoUser);
    mockSessionCreate.mockRejectedValue(new Error("DB error"));
    const res = await POST();
    expect(res.status).toBe(500);
    const json = await res.json();
    expect(json.error).toBe("Failed to create demo session");
  });

  it("creates session with demo-user id", async () => {
    mockUserFind.mockResolvedValue(demoUser);
    mockSessionCreate.mockResolvedValue({});
    await POST();
    expect(mockSessionCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ userId: "demo-user" }),
      })
    );
  });
});
