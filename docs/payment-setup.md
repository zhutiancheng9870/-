# Payment Setup Notes

StatementReady should start with hosted checkout links instead of a custom payment integration.

## Preferred Order

1. Lemon Squeezy hosted checkout URL for the Starter plan.
2. Gumroad hosted checkout URL as a backup or early-access sale page.
3. Stripe Checkout after the first paid demand is validated.
4. Paddle if merchant-of-record coverage is needed later.

## Environment Variables

```bash
NEXT_PUBLIC_LEMONSQUEEZY_CHECKOUT_URL=https://...
NEXT_PUBLIC_GUMROAD_CHECKOUT_URL=https://...
LEMONSQUEEZY_WEBHOOK_SECRET=...
GUMROAD_WEBHOOK_SECRET=...
LICENSE_SIGNING_SECRET=...
```

## Webhook Endpoints

- `/api/webhooks/lemonsqueezy`
- `/api/webhooks/gumroad?token=...`

Both endpoints currently store webhook payloads to local JSONL during MVP testing. Replace this with
a database before production.
