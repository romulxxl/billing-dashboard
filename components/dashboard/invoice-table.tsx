import { FileText, Download } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import type { Invoice } from "@prisma/client";

interface InvoiceTableProps {
  invoices: Invoice[];
}

export function InvoiceTable({ invoices }: InvoiceTableProps) {
  if (invoices.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center rounded-2xl border-dashed border py-12 text-center"
        style={{ borderColor: "rgba(22,48,96,0.5)" }}
      >
        <div
          className="mb-3 rounded-2xl p-4"
          style={{ background: "rgba(22,48,96,0.3)" }}
        >
          <FileText className="h-8 w-8" style={{ color: "#1e4080" }} />
        </div>
        <p className="text-sm font-medium" style={{ color: "#475569" }}>No invoices yet</p>
        <p className="mt-1 text-xs" style={{ color: "#334155" }}>
          Invoices will appear here after your first payment.
        </p>
      </div>
    );
  }

  return (
    <div
      className="overflow-hidden rounded-2xl"
      style={{ border: "1px solid rgba(22,48,96,0.6)" }}
    >
      <table className="w-full text-sm">
        <thead style={{ background: "rgba(7,18,36,0.8)" }}>
          <tr>
            {["Description", "Date", "Amount", "Status", ""].map((h) => (
              <th
                key={h}
                className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-widest ${h === "" ? "text-right" : ""}`}
                style={{ color: "#1e4080" }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {invoices.map((invoice, i) => (
            <tr
              key={invoice.id}
              style={{
                borderTop: i > 0 ? "1px solid rgba(22,48,96,0.4)" : undefined,
                background: "rgba(10,25,49,0.4)",
              }}
            >
              <td className="px-4 py-3 font-medium text-white">
                {invoice.description ?? "Subscription payment"}
              </td>
              <td className="px-4 py-3" style={{ color: "#475569" }}>
                {formatDate(invoice.createdAt)}
              </td>
              <td className="px-4 py-3 font-semibold" style={{ color: "#93c5fd" }}>
                {formatCurrency(invoice.amountPaid, invoice.currency)}
              </td>
              <td className="px-4 py-3">
                <Badge
                  variant={
                    invoice.status === "paid" ? "active"
                    : invoice.status === "open" ? "trialing"
                    : "canceled"
                  }
                >
                  {invoice.status}
                </Badge>
              </td>
              <td className="px-4 py-3 text-right">
                {invoice.invoicePdf ? (
                  <a
                    href={invoice.invoicePdf}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs transition-colors"
                    style={{ color: "#3b82f6" }}
                  >
                    <Download className="h-3 w-3" /> PDF
                  </a>
                ) : (
                  <span style={{ color: "#1e4080" }}>—</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
