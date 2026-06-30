type PayPalOrderResponse = {
  id: string;
  status: string;
};

type PayPalCaptureResponse = {
  id: string;
  status: string;
  purchase_units?: Array<{
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

export type CheckoutPlan = "solo" | "bundle" | "team";

export const PLANS: Record<
  CheckoutPlan,
  { label: string; amount: string; description: string }
> = {
  solo: {
    label: "Solo license",
    amount: process.env.NEXT_PUBLIC_PRICE_SOLO || "9.00",
    description: "CreatorCSV Cleaner Solo License"
  },
  bundle: {
    label: "Launch bundle",
    amount: process.env.NEXT_PUBLIC_PRICE_BUNDLE || "19.00",
    description: "CreatorCSV Cleaner Launch Bundle"
  },
  team: {
    label: "Tiny team",
    amount: process.env.NEXT_PUBLIC_PRICE_TEAM || "39.00",
    description: "CreatorCSV Cleaner Tiny Team License"
  }
};

export function isCheckoutPlan(value: unknown): value is CheckoutPlan {
  return typeof value === "string" && value in PLANS;
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

export async function createPayPalOrder(plan: CheckoutPlan, email: string) {
  const accessToken = await getAccessToken();
  const planInfo = PLANS[plan];
  const response = await fetch(`${getPayPalBaseUrl()}/v2/checkout/orders`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [
        {
          custom_id: email,
          description: planInfo.description,
          amount: {
            currency_code: getPayPalCurrency(),
            value: planInfo.amount
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

export async function capturePayPalOrder(orderId: string, plan: CheckoutPlan) {
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
  const planInfo = PLANS[plan];

  if (
    data.status !== "COMPLETED" ||
    capture?.status !== "COMPLETED" ||
    capture.amount?.currency_code !== getPayPalCurrency() ||
    capture.amount?.value !== planInfo.amount
  ) {
    throw new Error("PayPal capture did not match the expected paid order.");
  }

  return {
    orderId: data.id,
    captureId: capture.id,
    amount: capture.amount.value,
    currency: capture.amount.currency_code
  };
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
