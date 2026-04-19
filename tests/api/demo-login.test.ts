import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/demo-session", () => ({
  DEMO_COOKIE_NAME: "synapse-demo-token",
  createDemoToken: vi.fn(),
}));

import { createDemoToken } from "@/lib/demo-session";
import { POST } from "@/app/api/demo-login/route";

const mockCreateDemoToken = createDemoToken as ReturnType<typeof vi.fn>;

beforeEach(() => {
  vi.clearAllMocks();
});

describe("POST /api/demo-login", () => {
  it("returns 200 on success", async () => {
    mockCreateDemoToken.mockResolvedValue("fake.jwt.token");
    const res = await POST();
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.data.ok).toBe(true);
    expect(json.error).toBeNull();
  });

  it("sets synapse-demo-token cookie on success", async () => {
    mockCreateDemoToken.mockResolvedValue("fake.jwt.token");
    const res = await POST();
    const cookieHeader = res.headers.get("set-cookie");
    expect(cookieHeader).toContain("synapse-demo-token");
  });

  it("returns 500 when createDemoToken throws", async () => {
    mockCreateDemoToken.mockRejectedValue(new Error("NEXTAUTH_SECRET is not configured"));
    const res = await POST();
    expect(res.status).toBe(500);
    const json = await res.json();
    expect(json.error).toBe("Failed to create demo session");
  });
});
