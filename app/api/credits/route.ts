import { NextRequest, NextResponse } from "next/server";
import { createInitialCreditBalance } from "@/lib/billing/credits";
import { verifyLicense } from "@/lib/billing/license";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as { licenseKey?: string } | null;
  const license = body?.licenseKey ? verifyLicense(body.licenseKey) : null;

  if (!license) {
    return NextResponse.json(
      { ok: false, message: "A valid license key is required." },
      { status: 400 }
    );
  }

  return NextResponse.json({
    ok: true,
    balance: createInitialCreditBalance(license.customerId, license.planId)
  });
}
