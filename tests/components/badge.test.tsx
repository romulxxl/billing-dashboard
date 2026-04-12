import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Badge, SubscriptionBadge } from "@/components/ui/badge";

describe("Badge", () => {
  it("renders children", () => {
    render(<Badge>Hello</Badge>);
    expect(screen.getByText("Hello")).toBeInTheDocument();
  });

  it("accepts custom className", () => {
    const { container } = render(<Badge className="my-class">X</Badge>);
    expect(container.firstChild).toHaveClass("my-class");
  });

  it("renders with variant prop", () => {
    const { container } = render(<Badge variant="active">Active</Badge>);
    expect(container.firstChild).toHaveClass("text-green-400");
  });
});

describe("SubscriptionBadge", () => {
  it("shows 'Active' for active status", () => {
    render(<SubscriptionBadge status="active" />);
    expect(screen.getByText("Active")).toBeInTheDocument();
  });

  it("shows 'Trial' for trialing status", () => {
    render(<SubscriptionBadge status="trialing" />);
    expect(screen.getByText("Trial")).toBeInTheDocument();
  });

  it("shows 'Past Due' for past_due status", () => {
    render(<SubscriptionBadge status="past_due" />);
    expect(screen.getByText("Past Due")).toBeInTheDocument();
  });

  it("shows 'Canceled' for canceled status", () => {
    render(<SubscriptionBadge status="canceled" />);
    expect(screen.getByText("Canceled")).toBeInTheDocument();
  });

  it("renders raw status for unknown value", () => {
    render(<SubscriptionBadge status="unknown_status" />);
    expect(screen.getByText("unknown_status")).toBeInTheDocument();
  });
});
