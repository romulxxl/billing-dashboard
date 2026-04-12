import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderHook, act } from "@testing-library/react";
import { PricingToggle, usePricingToggle } from "@/components/billing/pricing-toggle";

describe("PricingToggle", () => {
  it("renders Monthly and Annual buttons", () => {
    render(<PricingToggle value="month" onChange={vi.fn()} />);
    expect(screen.getByText("Monthly")).toBeInTheDocument();
    expect(screen.getByText("Annual")).toBeInTheDocument();
  });

  it("calls onChange with 'year' when Annual is clicked", async () => {
    const onChange = vi.fn();
    render(<PricingToggle value="month" onChange={onChange} />);
    await userEvent.click(screen.getByText("Annual"));
    expect(onChange).toHaveBeenCalledWith("year");
  });

  it("calls onChange with 'month' when Monthly is clicked", async () => {
    const onChange = vi.fn();
    render(<PricingToggle value="year" onChange={onChange} />);
    await userEvent.click(screen.getByText("Monthly"));
    expect(onChange).toHaveBeenCalledWith("month");
  });

  it("switch has aria-checked=false when monthly", () => {
    render(<PricingToggle value="month" onChange={vi.fn()} />);
    const toggle = screen.getByRole("switch");
    expect(toggle).toHaveAttribute("aria-checked", "false");
  });

  it("switch has aria-checked=true when yearly", () => {
    render(<PricingToggle value="year" onChange={vi.fn()} />);
    const toggle = screen.getByRole("switch");
    expect(toggle).toHaveAttribute("aria-checked", "true");
  });

  it("clicking switch toggles from month to year", async () => {
    const onChange = vi.fn();
    render(<PricingToggle value="month" onChange={onChange} />);
    await userEvent.click(screen.getByRole("switch"));
    expect(onChange).toHaveBeenCalledWith("year");
  });

  it("clicking switch toggles from year to month", async () => {
    const onChange = vi.fn();
    render(<PricingToggle value="year" onChange={onChange} />);
    await userEvent.click(screen.getByRole("switch"));
    expect(onChange).toHaveBeenCalledWith("month");
  });

  it("shows Save 20% badge", () => {
    render(<PricingToggle value="month" onChange={vi.fn()} />);
    expect(screen.getByText("Save 20%")).toBeInTheDocument();
  });
});

describe("usePricingToggle", () => {
  it("initialises with 'month'", () => {
    const { result } = renderHook(() => usePricingToggle());
    expect(result.current.interval).toBe("month");
  });

  it("setInterval updates to 'year'", () => {
    const { result } = renderHook(() => usePricingToggle());
    act(() => result.current.setInterval("year"));
    expect(result.current.interval).toBe("year");
  });
});
