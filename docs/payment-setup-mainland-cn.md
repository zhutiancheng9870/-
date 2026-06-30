# Mainland China Payment Setup

## Recommendation

Best first path for this MVP:

1. Register **PayPal China Business Account** as an **Individual Seller**.
2. Register **Lemon Squeezy** and use PayPal as the payout method.
3. Add the Lemon Squeezy hosted checkout link to `.env`.

If Lemon Squeezy does not approve the store quickly, try Paddle as the next merchant-of-record option. Do not start with Stripe direct checkout because Mainland China is not a standard Stripe account country for accepting payments.

## Why This Order

- PayPal China's signup page says personal accounts should not be selected for profit-selling, and its Business Account path supports individual seller accounts.
- Lemon Squeezy supports merchants who can receive bank or PayPal payouts, and its checkout supports cards, PayPal, Alipay, WeChat Pay, and China UnionPay for customers where available.
- Ko-fi depends on PayPal or Stripe, so it does not solve the core problem until PayPal is ready.
- Paddle is strong for software products, but review can be stricter than a quick MVP checkout.

## What To Create

### PayPal China

- Account type: Business Account.
- Seller type: Individual Seller if offered.
- Use your own email and phone.
- Use your own legal ID information directly on PayPal.
- Do not send passwords, ID photos, or verification codes to Codex.

### Lemon Squeezy

- Store name: CreatorCSV Cleaner.
- Product type: single payment digital product or software license.
- Product name: CreatorCSV Cleaner Solo License.
- Price: USD 9.
- Bundle product: CreatorCSV Cleaner Launch Bundle, USD 19.
- Support email: your chosen public support email.
- Checkout mode: hosted checkout link.

## Send Back To Codex

Only send:

- Lemon Squeezy checkout URL, or PayPal payment link if using PayPal-only first.
- Public support email.
- Final prices if different from `$9` and `$19`.

Do not send:

- Passwords.
- ID documents.
- PayPal balance screenshots.
- Bank card numbers.
- Verification codes.

## Fallback

If PayPal or Lemon Squeezy blocks approval, use:

1. Paddle for software checkout.
2. PayPal invoice/payment link as a manual MVP fallback.
3. WeChat/Alipay QR only for China-based buyers, not as the main international checkout.
