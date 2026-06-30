import { NextRequest, NextResponse } from "next/server";
import { createPayPalOrder, isCheckoutPlan, isPayPalConfigured } from "@/lib/paypal";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  if (!isPayPalConfigured()) {
    return NextResponse.json(
      { ok: false, message: "PayPal Checkout is not configured yet." },
      { status: 503 }
    );
  }

  const body = (await request.json().catch(() => null)) as {
    email?: string;
    plan?: string;
  } | null;

  if (!body?.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
    return NextResponse.json(
      { ok: false, message: "Enter a valid email before paying." },
      { status: 400 }
    );
  }

  if (!isCheckoutPlan(body.plan)) {
    return NextResponse.json({ ok: false, message: "Choose a valid plan." }, { status: 400 });
  }

  try {
    const order = await createPayPalOrder(body.plan, body.email);
    return NextResponse.json({ ok: true, orderId: order.id });
  } catch {
    return NextResponse.json(
      { ok: false, message: "PayPal order could not be created. Try again shortly." },
      { status: 502 }
    );
  }
}
