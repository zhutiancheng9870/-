import { mkdir, appendFile } from "fs/promises";
import path from "path";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

type OrderPayload = {
  name?: string;
  email?: string;
  plan?: string;
  paymentRef?: string;
  notes?: string;
};

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as OrderPayload | null;

  if (!body?.name || !body.email || !body.paymentRef) {
    return NextResponse.json(
      { ok: false, message: "Name, email, and payment reference are required." },
      { status: 400 }
    );
  }

  const emailLooksValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email);
  if (!emailLooksValid) {
    return NextResponse.json(
      { ok: false, message: "Enter a valid email address." },
      { status: 400 }
    );
  }

  const orderId = `CC-${Date.now().toString(36).toUpperCase()}`;
  const order = {
    orderId,
    createdAt: new Date().toISOString(),
    name: String(body.name).slice(0, 120),
    email: String(body.email).slice(0, 180),
    plan: String(body.plan || "solo").slice(0, 40),
    paymentRef: String(body.paymentRef).slice(0, 180),
    notes: String(body.notes || "").slice(0, 1000),
    status: "pending_manual_review"
  };

  let stored = true;
  try {
    const dataDir = path.join(process.cwd(), "data");
    await mkdir(dataDir, { recursive: true });
    await appendFile(path.join(dataDir, "orders.jsonl"), `${JSON.stringify(order)}\n`, "utf8");
  } catch {
    stored = false;
  }

  return NextResponse.json({
    ok: true,
    orderId,
    stored,
    supportEmail: process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "you@example.com",
    message:
      "Order reference created. Email the PayPal receipt with this order ID to receive an unlock code."
  });
}
