import { NextRequest, NextResponse } from "next/server";
import { createSignedLicenseCode } from "@/lib/license";
import { capturePayPalOrder, isCheckoutPlan, isPayPalConfigured } from "@/lib/paypal";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  if (!isPayPalConfigured()) {
    return NextResponse.json(
      { ok: false, message: "PayPal Checkout is not configured yet." },
      { status: 503 }
    );
  }

  const body = (await request.json().catch(() => null)) as {
    orderId?: string;
    email?: string;
    plan?: string;
  } | null;

  if (!body?.orderId || !body.email || !isCheckoutPlan(body.plan)) {
    return NextResponse.json(
      { ok: false, message: "Missing PayPal order details." },
      { status: 400 }
    );
  }

  try {
    const capture = await capturePayPalOrder(body.orderId, body.plan);
    const licenseCode = createSignedLicenseCode({
      orderId: capture.orderId,
      email: body.email,
      plan: body.plan,
      issuedAt: new Date().toISOString()
    });

    return NextResponse.json({
      ok: true,
      licenseCode,
      orderId: capture.orderId,
      captureId: capture.captureId,
      amount: capture.amount,
      currency: capture.currency,
      message: "Payment complete. Copy your unlock code and paste it into the tool."
    });
  } catch {
    return NextResponse.json(
      { ok: false, message: "Payment could not be verified. Contact support with your receipt." },
      { status: 502 }
    );
  }
}
