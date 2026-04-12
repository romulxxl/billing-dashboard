import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { InvoiceTable } from "@/components/dashboard/invoice-table";
import type { Invoice } from "@prisma/client";

const baseInvoice: Invoice = {
  id: "inv_1",
  userId: "user_1",
  stripeInvoiceId: "in_1",
  amountPaid: 2900,
  currency: "usd",
  status: "paid",
  invoicePdf: null,
  description: "Pro plan",
  periodStart: new Date("2024-01-01"),
  periodEnd: new Date("2024-02-01"),
  createdAt: new Date("2024-01-01"),
  updatedAt: new Date("2024-01-01"),
};

describe("InvoiceTable (empty)", () => {
  it("shows 'No invoices yet' when empty", () => {
    render(<InvoiceTable invoices={[]} />);
    expect(screen.getByText("No invoices yet")).toBeInTheDocument();
  });

  it("shows helper message when empty", () => {
    render(<InvoiceTable invoices={[]} />);
    expect(screen.getByText(/Invoices will appear here/)).toBeInTheDocument();
  });
});

describe("InvoiceTable (with data)", () => {
  it("renders table headers", () => {
    render(<InvoiceTable invoices={[baseInvoice]} />);
    expect(screen.getByText("Description")).toBeInTheDocument();
    expect(screen.getByText("Amount")).toBeInTheDocument();
    expect(screen.getByText("Status")).toBeInTheDocument();
  });

  it("renders invoice description", () => {
    render(<InvoiceTable invoices={[baseInvoice]} />);
    expect(screen.getByText("Pro plan")).toBeInTheDocument();
  });

  it("renders formatted amount", () => {
    render(<InvoiceTable invoices={[baseInvoice]} />);
    expect(screen.getByText("$29.00")).toBeInTheDocument();
  });

  it("renders 'paid' status badge", () => {
    render(<InvoiceTable invoices={[baseInvoice]} />);
    expect(screen.getByText("paid")).toBeInTheDocument();
  });

  it("renders 'open' status badge", () => {
    render(<InvoiceTable invoices={[{ ...baseInvoice, status: "open" }]} />);
    expect(screen.getByText("open")).toBeInTheDocument();
  });

  it("shows PDF link when invoicePdf is set", () => {
    render(<InvoiceTable invoices={[{ ...baseInvoice, invoicePdf: "https://example.com/inv.pdf" }]} />);
    const link = screen.getByText("PDF").closest("a");
    expect(link).toHaveAttribute("href", "https://example.com/inv.pdf");
    expect(link).toHaveAttribute("target", "_blank");
  });

  it("shows dash when no PDF", () => {
    render(<InvoiceTable invoices={[baseInvoice]} />);
    expect(screen.getByText("—")).toBeInTheDocument();
  });

  it("renders multiple invoice rows", () => {
    const invoices = [
      baseInvoice,
      { ...baseInvoice, id: "inv_2", description: "Starter plan", amountPaid: 900 },
    ];
    render(<InvoiceTable invoices={invoices} />);
    expect(screen.getByText("Pro plan")).toBeInTheDocument();
    expect(screen.getByText("Starter plan")).toBeInTheDocument();
    expect(screen.getByText("$9.00")).toBeInTheDocument();
  });

  it("uses fallback description when null", () => {
    render(<InvoiceTable invoices={[{ ...baseInvoice, description: null }]} />);
    expect(screen.getByText("Subscription payment")).toBeInTheDocument();
  });
});
