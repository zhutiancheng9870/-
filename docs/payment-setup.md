# Payment Setup Notes

StatementReady uses PayPal Checkout as the primary payment flow. Hosted Lemon Squeezy and Gumroad
links stay available as fallback options.

## Preferred Order

1. PayPal Checkout Orders API for Starter, Pro, and Team/API.
2. Lemon Squeezy hosted checkout URL as a backup.
3. Gumroad hosted checkout URL as a backup or early-access sale page.
4. Stripe Checkout after the first paid demand is validated.
5. Paddle if merchant-of-record coverage is needed later.

## Environment Variables

```bash
NEXT_PUBLIC_PAYPAL_CLIENT_ID=...
PAYPAL_CLIENT_SECRET=...
PAYPAL_ENV=live
NEXT_PUBLIC_PAYPAL_CURRENCY=USD
NEXT_PUBLIC_LEMONSQUEEZY_CHECKOUT_URL=https://...
NEXT_PUBLIC_GUMROAD_CHECKOUT_URL=https://...
LEMONSQUEEZY_WEBHOOK_SECRET=...
GUMROAD_WEBHOOK_SECRET=...
LICENSE_SIGNING_SECRET=...
```

## Webhook Endpoints

- `/api/webhooks/lemonsqueezy`
- `/api/webhooks/gumroad?token=...`
- `/api/paypal/create-order`
- `/api/paypal/capture-order`

Webhook endpoints currently store payloads to local JSONL during MVP testing. PayPal capture stores
paid orders and signed license keys the same way. Replace this with a database before production.
