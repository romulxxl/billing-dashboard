import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

vi.mock("@/lib/stripe", () => ({
  stripe: {
    webhooks: { constructEvent: vi.fn() },
    subscriptions: { retrieve: vi.fn() },
  },
}));
vi.mock("@/lib/db", () => ({
  db: {
    subscription: {
      upsert: vi.fn(),
      updateMany: vi.fn(),
    },
    invoice: { upsert: vi.fn() },
  },
}));
vi.mock("@/lib/env", () => ({
  env: {
    STRIPE_WEBHOOK_SECRET: "whsec_test",
    NEXT_PUBLIC_APP_URL: "http://localhost:3000",
  },
}));

import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";
import { POST } from "@/app/api/webhooks/stripe/route";

const mockConstructEvent = stripe.webhooks.constructEvent as ReturnType<typeof vi.fn>;
const mockSubRetrieve = stripe.subscriptions.retrieve as ReturnType<typeof vi.fn>;
const mockSubUpsert = db.subscription.upsert as ReturnType<typeof vi.fn>;
const mockSubUpdateMany = db.subscription.updateMany as ReturnType<typeof vi.fn>;
const mockInvoiceUpsert = db.invoice.upsert as ReturnType<typeof vi.fn>;

function makeRequest(body = "body", sig = "sig") {
  return new NextRequest("http://localhost/api/webhooks/stripe", {
    method: "POST",
    headers: { "stripe-signature": sig },
    body,
  });
}

const baseSub = {
  id: "sub_1",
  status: "active",
  cancel_at_period_end: false,
  metadata: { userId: "user_1" },
  items: {
    data: [
      {
        price: { id: "price_pro_month" },
        current_period_end: 1700000000,
      },
    ],
  },
};

beforeEach(() => {
  vi.clearAllMocks();
  mockSubRetrieve.mockResolvedValue(baseSub);
  mockSubUpsert.mockResolvedValue({});
  mockSubUpdateMany.mockResolvedValue({});
  mockInvoiceUpsert.mockResolvedValue({});
});

describe("POST /api/webhooks/stripe", () => {
  it("returns 400 when stripe-signature header is missing", async () => {
    const req = new NextRequest("http://localhost/api/webhooks/stripe", {
      method: "POST",
      body: "body",
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("returns 400 when signature verification fails", async () => {
    mockConstructEvent.mockImplementation(() => {
      throw new Error("Invalid signature");
    });
    const res = await POST(makeRequest());
    expect(res.status).toBe(400);
  });

  it("handles checkout.session.completed and upserts subscription", async () => {
    mockConstructEvent.mockReturnValue({
      type: "checkout.session.completed",
      id: "evt_1",
      data: {
        object: {
          mode: "subscription",
          subscription: "sub_1",
        },
      },
    });
    const res = await POST(makeRequest());
    expect(res.status).toBe(200);
    expect(mockSubUpsert).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { userId: "user_1" },
      })
    );
  });

  it("handles invoice.payment_succeeded and updates subscription", async () => {
    mockConstructEvent.mockReturnValue({
      type: "invoice.payment_succeeded",
      id: "evt_2",
      data: {
        object: {
          id: "in_1",
          amount_paid: 2900,
          currency: "usd",
          description: "Pro plan",
          invoice_pdf: "https://invoice.pdf",
          parent: { subscription_details: { subscription: "sub_1" } },
          lines: {
            data: [{ period: { start: 1699000000, end: 1700000000 } }],
          },
        },
      },
    });
    const res = await POST(makeRequest());
    expect(res.status).toBe(200);
    expect(mockSubUpdateMany).toHaveBeenCalled();
    expect(mockInvoiceUpsert).toHaveBeenCalled();
  });

  it("handles invoice.payment_failed and marks subscription past_due", async () => {
    mockConstructEvent.mockReturnValue({
      type: "invoice.payment_failed",
      id: "evt_3",
      data: {
        object: {
          id: "in_2",
          parent: { subscription_details: { subscription: "sub_1" } },
        },
      },
    });
    const res = await POST(makeRequest());
    expect(res.status).toBe(200);
    expect(mockSubUpdateMany).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ status: "past_due" }),
      })
    );
  });

  it("handles customer.subscription.updated", async () => {
    mockConstructEvent.mockReturnValue({
      type: "customer.subscription.updated",
      id: "evt_4",
      data: { object: baseSub },
    });
    const res = await POST(makeRequest());
    expect(res.status).toBe(200);
    expect(mockSubUpdateMany).toHaveBeenCalled();
  });

  it("handles customer.subscription.deleted and sets canceled", async () => {
    mockConstructEvent.mockReturnValue({
      type: "customer.subscription.deleted",
      id: "evt_5",
      data: { object: { id: "sub_1" } },
    });
    const res = await POST(makeRequest());
    expect(res.status).toBe(200);
    expect(mockSubUpdateMany).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ status: "canceled" }),
      })
    );
  });

  it("returns 200 for unhandled event types", async () => {
    mockConstructEvent.mockReturnValue({
      type: "payment_intent.created",
      id: "evt_6",
      data: { object: {} },
    });
    const res = await POST(makeRequest());
    expect(res.status).toBe(200);
  });

  it("returns 500 when DB throws during checkout.session.completed", async () => {
    mockConstructEvent.mockReturnValue({
      type: "checkout.session.completed",
      id: "evt_7",
      data: {
        object: { mode: "subscription", subscription: "sub_1" },
      },
    });
    mockSubUpsert.mockRejectedValue(new Error("DB down"));
    const res = await POST(makeRequest());
    expect(res.status).toBe(500);
  });

  it("skips non-subscription checkout sessions", async () => {
    mockConstructEvent.mockReturnValue({
      type: "checkout.session.completed",
      id: "evt_8",
      data: { object: { mode: "payment" } },
    });
    const res = await POST(makeRequest());
    expect(res.status).toBe(200);
    expect(mockSubUpsert).not.toHaveBeenCalled();
  });
});
