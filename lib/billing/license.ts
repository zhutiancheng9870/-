import crypto from "crypto";
import { getPlan } from "./plans";

export type LicensePayload = {
  customerId: string;
  email: string;
  planId: string;
  credits: number;
  issuedAt: string;
  expiresAt?: string;
};

export function createLicensePayload(email: string, planId: string): LicensePayload {
  const plan = getPlan(planId);
  return {
    customerId: `cus_${crypto.randomUUID()}`,
    email,
    planId: plan.id,
    credits: plan.credits,
    issuedAt: new Date().toISOString(),
    expiresAt:
      plan.interval === "month"
        ? new Date(Date.now() + 31 * 24 * 60 * 60 * 1000).toISOString()
        : undefined
  };
}

export function signLicense(payload: LicensePayload, secret = process.env.LICENSE_SIGNING_SECRET): string {
  const signingSecret = secret || "dev-statementready-secret";
  const encoded = Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
  const signature = crypto.createHmac("sha256", signingSecret).update(encoded).digest("base64url");
  return `SRDY.${encoded}.${signature}`;
}

export function verifyLicense(token: string, secret = process.env.LICENSE_SIGNING_SECRET): LicensePayload | null {
  const signingSecret = secret || "dev-statementready-secret";
  const [prefix, encoded, signature] = token.split(".");
  if (prefix !== "SRDY" || !encoded || !signature) return null;
  const expected = crypto.createHmac("sha256", signingSecret).update(encoded).digest("base64url");
  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return null;
  return JSON.parse(Buffer.from(encoded, "base64url").toString("utf8")) as LicensePayload;
}
