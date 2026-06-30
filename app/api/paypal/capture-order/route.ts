import { appendFile, mkdir } from "fs/promises";
import path from "path";
import { NextRequest, NextResponse } from "next/server";
import { createInitialCreditBalance } from "@/lib/billing/credits";
import { createLicensePayload, signLicense } from "@/lib/billing/license";
import { capturePayPalOrder, isPayPalConfigured, isPayPalPlanId } from "@/lib/paypal";

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
    planId?: string;
  } | null;

  if (!body?.orderId || !isPayPalPlanId(body.planId)) {
    return NextResponse.json(
      { ok: false, message: "Missing PayPal order details." },
      { status: 400 }
    );
  }

  try {
    const capture = await capturePayPalOrder(body.orderId, body.planId);
    const email = capture.payerEmail || `${capture.captureId}@paypal.statementready.local`;
    const licensePayload = createLicensePayload(email, body.planId);
    const licenseKey = signLicense(licensePayload);
    const credits = createInitialCreditBalance(licensePayload.customerId, body.planId);
    const order = {
      orderId: capture.orderId,
      captureId: capture.captureId,
      provider: "paypal",
      planId: body.planId,
      email,
      amount: capture.amount,
      currency: capture.currency,
      licenseKey,
      credits,
      status: "paid",
      createdAt: new Date().toISOString()
    };

    await storeOrder(order);

    return NextResponse.json({
      ok: true,
      licenseKey,
      orderId: capture.orderId,
      captureId: capture.captureId,
      amount: capture.amount,
      currency: capture.currency,
      credits,
      message: "Payment complete. Copy your StatementReady license key."
    });
  } catch {
    return NextResponse.json(
      { ok: false, message: "Payment could not be verified. Contact support with your receipt." },
      { status: 502 }
    );
  }
}

async function storeOrder(order: unknown): Promise<void> {
  const dataDir = path.join(process.cwd(), "data");
  await mkdir(dataDir, { recursive: true });
  await appendFile(path.join(dataDir, "orders.jsonl"), `${JSON.stringify(order)}\n`, "utf8");
}
