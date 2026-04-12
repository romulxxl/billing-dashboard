import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { StatCard } from "@/components/dashboard/stat-card";
import { Activity } from "lucide-react";

describe("StatCard", () => {
  it("renders title and value", () => {
    render(<StatCard title="Revenue" value="$1,200" icon={Activity} />);
    expect(screen.getByText("Revenue")).toBeInTheDocument();
    expect(screen.getByText("$1,200")).toBeInTheDocument();
  });

  it("renders description when provided", () => {
    render(<StatCard title="T" value="V" icon={Activity} description="This month" />);
    expect(screen.getByText("This month")).toBeInTheDocument();
  });

  it("does not render description when omitted", () => {
    render(<StatCard title="T" value="V" icon={Activity} />);
    expect(screen.queryByText("This month")).not.toBeInTheDocument();
  });

  it("shows positive trend with + prefix", () => {
    render(<StatCard title="T" value="V" icon={Activity} trend={{ value: 12, label: "vs last month" }} />);
    expect(screen.getByText(/\+12%/)).toBeInTheDocument();
  });

  it("shows negative trend without + prefix", () => {
    render(<StatCard title="T" value="V" icon={Activity} trend={{ value: -5, label: "vs last month" }} />);
    expect(screen.getByText(/-5%/)).toBeInTheDocument();
  });

  it("renders trend label", () => {
    render(<StatCard title="T" value="V" icon={Activity} trend={{ value: 3, label: "vs last week" }} />);
    expect(screen.getByText(/vs last week/)).toBeInTheDocument();
  });

  it("does not render trend section when trend is omitted", () => {
    render(<StatCard title="T" value="V" icon={Activity} />);
    expect(screen.queryByText(/%/)).not.toBeInTheDocument();
  });

  it("zero trend value shows positive sign", () => {
    render(<StatCard title="T" value="V" icon={Activity} trend={{ value: 0, label: "unchanged" }} />);
    expect(screen.getByText(/\+0%/)).toBeInTheDocument();
  });

  it("renders icon element", () => {
    const { container } = render(<StatCard title="T" value="V" icon={Activity} />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("accepts className prop", () => {
    const { container } = render(<StatCard title="T" value="V" icon={Activity} className="test-class" />);
    expect(container.firstChild).toHaveClass("test-class");
  });
});
