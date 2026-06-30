import { createHash } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { verifySignedLicenseCode } from "@/lib/license";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as { code?: string } | null;
  const code = body?.code?.trim() || "";

  if (!code) {
    return NextResponse.json(
      { ok: false, message: "Enter the unlock code from your receipt." },
      { status: 400 }
    );
  }

  const allowDemo =
    process.env.NODE_ENV !== "production" || process.env.ALLOW_DEMO_LICENSE === "true";
  if (allowDemo && code === "DEMO-FULL-ACCESS") {
    return NextResponse.json({
      ok: true,
      message: "Demo unlock accepted. Full export is enabled for this browser session."
    });
  }

  const codeHash = createHash("sha256").update(code).digest("hex");
  const validHashes = (process.env.LICENSE_CODE_HASHES || "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);

  if (validHashes.includes(codeHash)) {
    return NextResponse.json({
      ok: true,
      message: "Unlock accepted. Full export is enabled for this browser session."
    });
  }

  try {
    if (verifySignedLicenseCode(code)) {
      return NextResponse.json({
        ok: true,
        message: "Paid unlock accepted. Full export is enabled for this browser session."
      });
    }
  } catch {
    return NextResponse.json(
      { ok: false, message: "License verification is not fully configured yet." },
      { status: 503 }
    );
  }

  return NextResponse.json(
    { ok: false, message: "That unlock code was not recognized." },
    { status: 401 }
  );
}
