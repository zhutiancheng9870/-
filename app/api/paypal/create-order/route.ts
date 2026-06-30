import { NextRequest, NextResponse } from "next/server";
import { createPayPalOrder, isPayPalConfigured, isPayPalPlanId } from "@/lib/paypal";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  if (!isPayPalConfigured()) {
    return NextResponse.json(
      { ok: false, message: "PayPal Checkout is not configured yet." },
      { status: 503 }
    );
  }

  const body = (await request.json().catch(() => null)) as {
    planId?: string;
  } | null;

  if (!isPayPalPlanId(body?.planId)) {
    return NextResponse.json({ ok: false, message: "Choose a valid paid plan." }, { status: 400 });
  }

  try {
    const order = await createPayPalOrder(body.planId);
    return NextResponse.json({ ok: true, orderId: order.id });
  } catch {
    return NextResponse.json(
      { ok: false, message: "PayPal order could not be created. Try again shortly." },
      { status: 502 }
    );
  }
}
