import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { UsageBar } from "@/components/dashboard/usage-bar";

describe("UsageBar", () => {
  it("renders label", () => {
    render(<UsageBar label="API Calls" used={500} limit={1000} />);
    expect(screen.getByText("API Calls")).toBeInTheDocument();
  });

  it("shows used / limit as formatted numbers", () => {
    render(<UsageBar label="Events" used={5000} limit={10000} />);
    expect(screen.getByText(/5k/)).toBeInTheDocument();
    expect(screen.getByText(/10k/)).toBeInTheDocument();
  });

  it("shows percentage used", () => {
    render(<UsageBar label="Seats" used={50} limit={100} />);
    expect(screen.getByText(/50%/)).toBeInTheDocument();
  });

  it("shows 'Unlimited' when limit is Infinity", () => {
    render(<UsageBar label="Projects" used={7} limit={Infinity} />);
    expect(screen.getByText("Unlimited")).toBeInTheDocument();
    expect(screen.getByText(/∞/)).toBeInTheDocument();
  });

  it("does not crash when limit is zero", () => {
    render(<UsageBar label="Zero" used={0} limit={0} />);
    expect(screen.getByText("Zero")).toBeInTheDocument();
    expect(screen.getByText(/0%/)).toBeInTheDocument();
  });

  it("caps percentage at 100", () => {
    render(<UsageBar label="Over" used={200} limit={100} />);
    expect(screen.getByText(/100%/)).toBeInTheDocument();
  });

  it("shows approaching limit warning when >= 80%", () => {
    render(<UsageBar label="High" used={80} limit={100} />);
    expect(screen.getByText(/approaching limit/)).toBeInTheDocument();
  });

  it("does not show warning when under 80%", () => {
    render(<UsageBar label="Low" used={79} limit={100} />);
    expect(screen.queryByText(/approaching limit/)).not.toBeInTheDocument();
  });

  it("formats millions with M suffix", () => {
    render(<UsageBar label="Big" used={1_500_000} limit={10_000_000} />);
    expect(screen.getByText(/1\.5M/)).toBeInTheDocument();
  });

  it("appends unit when provided", () => {
    render(<UsageBar label="Storage" used={512} limit={1024} unit="MB" />);
    expect(screen.getByText(/512MB/)).toBeInTheDocument();
  });

  it("does not show warning for unlimited even at high usage", () => {
    render(<UsageBar label="Unlim" used={9_000_000} limit={Infinity} />);
    expect(screen.queryByText(/approaching limit/)).not.toBeInTheDocument();
    expect(screen.getByText("Unlimited")).toBeInTheDocument();
  });
});
