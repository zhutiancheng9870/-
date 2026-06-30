# PayPal Automatic Checkout

Use this to replace manual PayPal receipt checking with automatic payment capture and unlock-code delivery.

## What It Does

1. Buyer enters email and chooses a plan on `/checkout`.
2. PayPal Checkout opens.
3. The server creates a PayPal order with the expected amount.
4. PayPal captures the payment after buyer approval.
5. The server verifies amount, currency, and capture status.
6. The server returns a signed unlock code immediately.
7. The buyer pastes the unlock code into the tool for full CSV export.

## Required Vercel Environment Variables

```text
NEXT_PUBLIC_PAYPAL_CLIENT_ID=your-paypal-client-id
PAYPAL_CLIENT_SECRET=your-paypal-secret
PAYPAL_ENV=sandbox
NEXT_PUBLIC_PAYPAL_CURRENCY=USD
LICENSE_SIGNING_SECRET=generate-a-long-random-secret
ALLOW_DEMO_LICENSE=false
```

Optional price overrides:

```text
NEXT_PUBLIC_PRICE_SOLO=9.00
NEXT_PUBLIC_PRICE_BUNDLE=19.00
NEXT_PUBLIC_PRICE_TEAM=39.00
```

## Generate A Signing Secret

Run locally:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Put the result in Vercel as `LICENSE_SIGNING_SECRET`.

## PayPal Developer Setup

1. Open `https://developer.paypal.com/dashboard/applications/sandbox`.
2. Create an app for testing.
3. Copy the Sandbox Client ID into `NEXT_PUBLIC_PAYPAL_CLIENT_ID`.
4. Copy the Sandbox Secret into `PAYPAL_CLIENT_SECRET`.
5. Keep `PAYPAL_ENV=sandbox` while testing.
6. After test payment works, create/live-copy Live credentials and set `PAYPAL_ENV=live`.

Do not send PayPal secrets, passwords, verification codes, or identity documents to Codex.
