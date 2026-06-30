# PayPal Manual Checkout Fallback

Use this if Lemon Squeezy tax forms or store activation are blocked.

## Why This Works For MVP

The product already supports:

- a public landing page
- a checkout page
- manual payment instructions
- order form submission
- manual unlock-code delivery
- paid full export after unlock

This is slower than Lemon Squeezy, but it creates a real payment/order loop without API keys or a merchant-of-record review.

## Vercel Environment Variables

Set these in Vercel Project Settings -> Environment Variables:

```text
NEXT_PUBLIC_SUPPORT_EMAIL=your-support-email@example.com
NEXT_PUBLIC_PAYPAL_EMAIL=your-public-paypal-email@example.com
NEXT_PUBLIC_PAYMENT_INSTRUCTIONS=Pay with PayPal Goods and Services, then submit the receipt reference below.
```

Leave this empty until Lemon, Gumroad, Paddle, or another hosted checkout is ready:

```text
NEXT_PUBLIC_PAYMENT_LINK=
```

## Buyer Flow

1. Buyer opens `/checkout`.
2. Buyer sends `$9 USD` via PayPal Goods and Services.
3. Buyer submits the order form with transaction ID or receipt reference.
4. Seller verifies payment in PayPal.
5. Seller emails an unlock code.

## Generate An Unlock Code Hash

Do not put the raw code in Vercel. Generate a hash locally:

```bash
node -e "console.log(require('crypto').createHash('sha256').update('YOUR-CODE-HERE').digest('hex'))"
```

Then set:

```text
LICENSE_CODE_HASHES=the-generated-hash
ALLOW_DEMO_LICENSE=false
```

## Important

- Do not ask buyers to use Friends and Family.
- Do not publish a PayPal email unless you are comfortable with it being public.
- Do not send passwords, PayPal verification codes, ID documents, or private financial details to Codex.
