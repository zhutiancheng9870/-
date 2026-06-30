import { getPlan, type BillingPlan } from "@/lib/billing/plans";

type PayPalOrderResponse = {
  id: string;
  status: string;
};

type PayPalCaptureResponse = {
  id: string;
  status: string;
  payer?: {
    email_address?: string;
  };
  purchase_units?: Array<{
    custom_id?: string;
    payments?: {
      captures?: Array<{
        id: string;
        status: string;
        amount?: {
          currency_code: string;
          value: string;
        };
      }>;
    };
  }>;
};

export type PayPalPlanId = "starter" | "pro" | "team_api";

export function isPayPalPlanId(value: unknown): value is PayPalPlanId {
  return value === "starter" || value === "pro" || value === "team_api";
}

export function getPayPalCurrency(): string {
  return process.env.NEXT_PUBLIC_PAYPAL_CURRENCY || "USD";
}

export function isPayPalConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID &&
      process.env.PAYPAL_CLIENT_SECRET &&
      process.env.LICENSE_SIGNING_SECRET
  );
}

export function getPayPalPlan(planId: string | null | undefined): BillingPlan {
  const plan = getPlan(planId);
  return plan.priceUsd > 0 ? plan : getPlan("starter");
}

export async function createPayPalOrder(planId: PayPalPlanId): Promise<PayPalOrderResponse> {
  const accessToken = await getAccessToken();
  const plan = getPayPalPlan(planId);
  const currency = getPayPalCurrency();
  const amount = formatPayPalAmount(plan.priceUsd);

  const response = await fetch(`${getPayPalBaseUrl()}/v2/checkout/orders`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      intent: "CAPTURE",
      application_context: {
        brand_name: "StatementReady",
        landing_page: "BILLING",
        shipping_preference: "NO_SHIPPING",
        user_action: "PAY_NOW"
      },
      purchase_units: [
        {
          custom_id: plan.id,
          description: `StatementReady ${plan.name} access`,
          items: [
            {
              name: `StatementReady ${plan.name}`,
              description: `${plan.credits} cleanup credits for bank CSV/Excel files`,
              quantity: "1",
              category: "DIGITAL_GOODS",
              unit_amount: {
                currency_code: currency,
                value: amount
              }
            }
          ],
          amount: {
            currency_code: currency,
            value: amount,
            breakdown: {
              item_total: {
                currency_code: currency,
                value: amount
              }
            }
          }
        }
      ]
    })
  });

  if (!response.ok) {
    throw new Error(`PayPal order creation failed: ${response.status}`);
  }

  return (await response.json()) as PayPalOrderResponse;
}

export async function capturePayPalOrder(orderId: string, planId: PayPalPlanId) {
  const accessToken = await getAccessToken();
  const response = await fetch(`${getPayPalBaseUrl()}/v2/checkout/orders/${orderId}/capture`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json"
    }
  });

  if (!response.ok) {
    throw new Error(`PayPal capture failed: ${response.status}`);
  }

  const data = (await response.json()) as PayPalCaptureResponse;
  const capture = data.purchase_units?.[0]?.payments?.captures?.[0];
  const plan = getPayPalPlan(planId);
  const currency = getPayPalCurrency();
  const amount = formatPayPalAmount(plan.priceUsd);

  if (
    data.status !== "COMPLETED" ||
    capture?.status !== "COMPLETED" ||
    capture.amount?.currency_code !== currency ||
    capture.amount?.value !== amount
  ) {
    throw new Error("PayPal capture did not match the expected paid order.");
  }

  return {
    orderId: data.id,
    captureId: capture.id,
    payerEmail: data.payer?.email_address || "",
    planId: plan.id,
    amount: capture.amount.value,
    currency: capture.amount.currency_code
  };
}

function formatPayPalAmount(value: number): string {
  return value.toFixed(2);
}

async function getAccessToken(): Promise<string> {
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    throw new Error("PayPal client ID and secret are required.");
  }

  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
  const response = await fetch(`${getPayPalBaseUrl()}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: "grant_type=client_credentials"
  });

  if (!response.ok) {
    throw new Error(`PayPal token request failed: ${response.status}`);
  }

  const data = (await response.json()) as { access_token?: string };
  if (!data.access_token) {
    throw new Error("PayPal token response did not include an access token.");
  }

  return data.access_token;
}

function getPayPalBaseUrl(): string {
  return process.env.PAYPAL_ENV === "live"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";
}
