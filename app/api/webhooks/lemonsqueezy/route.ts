import { appendFile, mkdir } from "fs/promises";
import path from "path";
import { NextRequest, NextResponse } from "next/server";
import { verifyLemonSqueezySignature, type WebhookRecord } from "@/lib/billing/webhooks";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-signature");

  if (!verifyLemonSqueezySignature(rawBody, signature)) {
    return NextResponse.json({ ok: false, message: "Invalid webhook signature." }, { status: 401 });
  }

  const payload = JSON.parse(rawBody || "{}") as {
    meta?: { event_name?: string };
    data?: { id?: string; attributes?: { user_email?: string; first_order_item?: { product_name?: string } } };
  };

  const record: WebhookRecord = {
    provider: "lemonsqueezy",
    eventName: payload.meta?.event_name || "unknown",
    orderId: payload.data?.id,
    email: payload.data?.attributes?.user_email,
    planId: payload.data?.attributes?.first_order_item?.product_name,
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
