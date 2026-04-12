import { describe, it, expect } from "vitest";
import { cn, formatCurrency, formatDate, getInitials } from "@/lib/utils";

describe("cn", () => {
  it("merges class names", () => {
    expect(cn("a", "b")).toBe("a b");
  });

  it("deduplicates conflicting tailwind classes", () => {
    expect(cn("text-sm", "text-lg")).toBe("text-lg");
  });

  it("ignores falsy values", () => {
    expect(cn("a", false, undefined, null, "b")).toBe("a b");
  });

  it("handles conditional objects", () => {
    expect(cn({ "text-red-500": true, "text-blue-500": false })).toBe("text-red-500");
  });
});

describe("formatCurrency", () => {
  it("formats cents to dollars", () => {
    expect(formatCurrency(2900)).toBe("$29.00");
  });

  it("formats zero", () => {
    expect(formatCurrency(0)).toBe("$0.00");
  });

  it("respects custom currency", () => {
    const result = formatCurrency(1000, "eur");
    expect(result).toContain("10");
  });

  it("upcases lowercase currency code", () => {
    expect(() => formatCurrency(100, "usd")).not.toThrow();
  });

  it("handles large amounts", () => {
    expect(formatCurrency(95000)).toBe("$950.00");
  });
});

describe("formatDate", () => {
  it("formats a Date object", () => {
    const result = formatDate(new Date("2024-01-15T00:00:00Z"));
    expect(result).toMatch(/Jan/);
    expect(result).toMatch(/2024/);
  });

  it("formats an ISO string", () => {
    const result = formatDate("2024-06-01T00:00:00Z");
    expect(result).toMatch(/2024/);
  });

  it("returns month abbreviation", () => {
    const result = formatDate(new Date("2024-12-25T00:00:00Z"));
    expect(result).toMatch(/Dec/);
  });
});

describe("getInitials", () => {
  it("returns first letters of each word", () => {
    expect(getInitials("John Doe")).toBe("JD");
  });

  it("returns single letter for single name", () => {
    expect(getInitials("Alice")).toBe("A");
  });

  it("returns ? for null", () => {
    expect(getInitials(null)).toBe("?");
  });

  it("returns ? for undefined", () => {
    expect(getInitials(undefined)).toBe("?");
  });

  it("returns ? for empty string", () => {
    expect(getInitials("")).toBe("?");
  });

  it("uppercases initials", () => {
    expect(getInitials("jane doe")).toBe("JD");
  });

  it("slices to 2 characters max", () => {
    expect(getInitials("A B C")).toBe("AB");
  });
});
