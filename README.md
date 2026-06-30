# StatementReady

StatementReady is a USD-focused CSV/Excel cleanup tool for overseas freelancers and bookkeepers.
It turns messy bank, credit card, PayPal, Stripe, and wallet exports into bookkeeping-ready CSV and
Excel files before review, import, or reconciliation.

Live MVP: https://creatorcsv-cleaner.vercel.app/

## MVP Scope

- English landing page.
- Live demo uploader.
- CSV, TSV, and XLSX parsing.
- Automatic column mapping with manual overrides.
- Date and amount normalization.
- Validation errors for missing required fields, invalid dates, invalid amounts, and suspiciously large transactions.
- Duplicate row detection.
- Cleaned CSV export.
- Cleaned Excel export.
- USD pricing page.
- PayPal Checkout primary payment flow.
- Lemon Squeezy / Gumroad hosted checkout fallback placeholders.
- Mock order, license, credits, and webhook structure.
- Overseas launch copy in `docs/launch-copy.md`.

## Chosen Market

The MVP targets **Bank Statement CSV Cleaner for freelancers/bookkeepers**.

Why this direction:

- Clear USD buyer pain: bank exports are messy before QuickBooks, Xero, spreadsheets, and monthly reconciliation.
- Demo is easy to understand.
- The existing parsing, mapping, validation, duplicate detection, and export modules fit the use case.
- Hosted checkout via Lemon Squeezy or Gumroad can be added without blocking development.

## Local Development

```bash
npm install
npm run dev
```

Open `http://127.0.0.1:3000`.

## Test

```bash
npm run build
npm test
```

## Environment Variables

No real payment credentials are required for local development.

Optional production values:

```bash
NEXT_PUBLIC_SUPPORT_EMAIL=support@example.com
NEXT_PUBLIC_LEMONSQUEEZY_CHECKOUT_URL=https://...
NEXT_PUBLIC_GUMROAD_CHECKOUT_URL=https://...
LEMONSQUEEZY_WEBHOOK_SECRET=...
GUMROAD_WEBHOOK_SECRET=...
LICENSE_SIGNING_SECRET=...
```

Never commit real payment credentials or webhook secrets.

## Reusable Modules

- `lib/csv/parse.ts` parses CSV, TSV, and XLSX files.
- `lib/csv/map-columns.ts` detects and applies column mappings.
- `lib/csv/normalize.ts` normalizes dates, text, and amounts.
- `lib/csv/detect-duplicates.ts` detects duplicate rows by template keys.
- `lib/csv/detect-anomalies.ts` reports validation errors and warnings.
- `lib/csv/export-csv.ts` exports cleaned CSV.
- `lib/csv/export-excel.ts` exports cleaned XLSX.
- `lib/templates/*` defines bank statement, QuickBooks-ready, and Xero-ready templates.
- `lib/paypal.ts` creates and captures PayPal Orders API payments.
- `lib/billing/*` defines plans, license payloads, credits, and webhook helpers.

## Payment Architecture

The first paid test should use PayPal Checkout as the primary payment flow:

- PayPal Orders API creates and captures one-time paid access for Starter, Pro, and Team/API.
- Successful captures return a signed StatementReady license key and credit balance.
- Lemon Squeezy and Gumroad hosted checkout links remain available as fallback options.
- Stripe/Paddle can be added later behind the same order/license/credits interfaces.

The checkout page is safe in development. It only shows real PayPal buttons when PayPal environment
variables are configured.
