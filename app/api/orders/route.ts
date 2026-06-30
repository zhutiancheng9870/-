import { appendFile, mkdir } from "fs/promises";
import path from "path";
import { NextRequest, NextResponse } from "next/server";
import { createInitialCreditBalance } from "@/lib/billing/credits";
import { createLicensePayload, signLicense } from "@/lib/billing/license";
import { getPlan } from "@/lib/billing/plans";

export const runtime = "nodejs";

type OrderPayload = {
  email?: string;
  planId?: string;
  provider?: "mock" | "paypal" | "lemonsqueezy" | "gumroad" | "stripe" | "paddle";
  providerOrderId?: string;
};

export async function GET(request: NextRequest) {
  const plan = getPlan(request.nextUrl.searchParams.get("plan"));
  return NextResponse.json({
    ok: true,
    mode: "mock_checkout",
    message:
      "Mock checkout is active. Add PayPal environment variables to enable real PayPal Checkout.",
    plan
  });
}

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as OrderPayload | null;
  const email = String(body?.email || "").trim().toLowerCase();
  const plan = getPlan(body?.planId);

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ ok: false, message: "A valid email is required." }, { status: 400 });
  }

  const licensePayload = createLicensePayload(email, plan.id);
  const licenseKey = signLicense(licensePayload);
  const credits = createInitialCreditBalance(licensePayload.customerId, plan.id);
  const order = {
    orderId: `srdy_${Date.now().toString(36)}`,
    provider: body?.provider || "mock",
    providerOrderId: body?.providerOrderId || null,
    planId: plan.id,
    email,
    licenseKey,
    credits,
    createdAt: new Date().toISOString(),
    status: body?.provider ? "paid_placeholder" : "mock_created"
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
    stored,
    orderId: order.orderId,
    planId: plan.id,
    licenseKey,
    credits
  });
}
