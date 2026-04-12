import { describe, it, expect } from "vitest";
import { PLANS, getPlanById } from "@/lib/stripe-helpers";

describe("PLANS", () => {
  it("contains exactly 3 plans", () => {
    expect(PLANS).toHaveLength(3);
  });

  it("has starter, pro, and enterprise plans", () => {
    const ids = PLANS.map((p) => p.id);
    expect(ids).toContain("starter");
    expect(ids).toContain("pro");
    expect(ids).toContain("enterprise");
  });

  it("starter has correct monthly price", () => {
    const plan = PLANS.find((p) => p.id === "starter");
    expect(plan?.monthlyPrice).toBe(900);
  });

  it("pro has correct monthly price", () => {
    const plan = PLANS.find((p) => p.id === "pro");
    expect(plan?.monthlyPrice).toBe(2900);
  });

  it("enterprise has correct monthly price", () => {
    const plan = PLANS.find((p) => p.id === "enterprise");
    expect(plan?.monthlyPrice).toBe(9900);
  });

  it("only pro is highlighted", () => {
    const highlighted = PLANS.filter((p) => p.highlighted);
    expect(highlighted).toHaveLength(1);
    expect(highlighted[0].id).toBe("pro");
  });

  it("each plan has at least one feature", () => {
    PLANS.forEach((p) => {
      expect(p.features.length).toBeGreaterThan(0);
    });
  });

  it("annual price is less than 12x monthly for pro (discount exists)", () => {
    const pro = PLANS.find((p) => p.id === "pro")!;
    expect(pro.annualPrice).toBeLessThan(pro.monthlyPrice * 12);
  });
});

describe("getPlanById", () => {
  it("returns plan for valid id", () => {
    const plan = getPlanById("starter");
    expect(plan).toBeDefined();
    expect(plan?.id).toBe("starter");
  });

  it("returns pro plan", () => {
    expect(getPlanById("pro")?.id).toBe("pro");
  });

  it("returns enterprise plan", () => {
    expect(getPlanById("enterprise")?.id).toBe("enterprise");
  });

  it("returns undefined for unknown id", () => {
    expect(getPlanById("unknown")).toBeUndefined();
  });

  it("returns undefined for empty string", () => {
    expect(getPlanById("")).toBeUndefined();
  });
});
