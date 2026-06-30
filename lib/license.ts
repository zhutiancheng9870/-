import { createHmac, timingSafeEqual } from "crypto";

type LicensePayload = {
  orderId: string;
  email: string;
  plan: string;
  issuedAt: string;
};

export function createSignedLicenseCode(payload: LicensePayload): string {
  const body = base64UrlEncode(JSON.stringify(payload));
  const signature = sign(body);
  return `CCPAID.${body}.${signature}`;
}

export function verifySignedLicenseCode(code: string): boolean {
  const parts = code.split(".");
  if (parts.length !== 3 || parts[0] !== "CCPAID") {
    return false;
  }

  const [, body, signature] = parts;
  const expected = sign(body);
  return safeEqual(signature, expected);
}

function sign(value: string): string {
  return createHmac("sha256", getSigningSecret()).update(value).digest("base64url");
}

function getSigningSecret(): string {
  const secret = process.env.LICENSE_SIGNING_SECRET;
  if (secret) {
    return secret;
  }

  if (process.env.NODE_ENV !== "production") {
    return "local-development-license-secret";
  }

  throw new Error("LICENSE_SIGNING_SECRET is required in production.");
}

function base64UrlEncode(value: string): string {
  return Buffer.from(value, "utf8").toString("base64url");
}

function safeEqual(left: string, right: string): boolean {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }
  return timingSafeEqual(leftBuffer, rightBuffer);
}
