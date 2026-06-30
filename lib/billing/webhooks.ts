import crypto from "crypto";

export type WebhookRecord = {
  provider: "lemonsqueezy" | "gumroad" | "mock";
  eventName: string;
  orderId?: string;
  email?: string;
  planId?: string;
  raw: unknown;
  receivedAt: string;
};

export function verifyLemonSqueezySignature(
  rawBody: string,
  signature: string | null,
  secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET
): boolean {
  if (!secret) return process.env.NODE_ENV !== "production";
  if (!signature) return false;
  const expected = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
}

export function verifyGumroadWebhookToken(
  token: string | null,
  secret = process.env.GUMROAD_WEBHOOK_SECRET
): boolean {
  if (!secret) return process.env.NODE_ENV !== "production";
  return token === secret;
}
