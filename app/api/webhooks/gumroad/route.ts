import { appendFile, mkdir } from "fs/promises";
import path from "path";
import { NextRequest, NextResponse } from "next/server";
import { verifyGumroadWebhookToken, type WebhookRecord } from "@/lib/billing/webhooks";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const contentType = request.headers.get("content-type") || "";
  const token = request.nextUrl.searchParams.get("token");

  if (!verifyGumroadWebhookToken(token)) {
    return NextResponse.json({ ok: false, message: "Invalid webhook token." }, { status: 401 });
  }

  const payload = contentType.includes("application/json")
    ? await request.json()
    : Object.fromEntries((await request.formData()).entries());

  const record: WebhookRecord = {
    provider: "gumroad",
    eventName: "sale",
    orderId: String(payload.sale_id || payload.order_number || ""),
    email: String(payload.email || ""),
    planId: String(payload.product_name || payload.product_id || ""),
    raw: payload,
    receivedAt: new Date().toISOString()
  };

  await storeWebhook(record);
  return NextResponse.json({ ok: true, received: record.eventName });
}

async function storeWebhook(record: WebhookRecord): Promise<void> {
  const dataDir = path.join(process.cwd(), "data");
  await mkdir(dataDir, { recursive: true });
  await appendFile(path.join(dataDir, "webhooks.jsonl"), `${JSON.stringify(record)}\n`, "utf8");
}
