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
- Lemon Squeezy / Gumroad hosted checkout placeholder.
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
- `lib/billing/*` defines plans, license payloads, credits, and webhook helpers.

## Payment Architecture

The first paid test should use a hosted checkout link:

- Lemon Squeezy hosted checkout for Starter.
- Gumroad hosted checkout for Pro or backup sales.
- Stripe/Paddle can be added later behind the same order/license/credits interfaces.

The current checkout page is a safe placeholder and does not charge real money unless hosted checkout
URLs are configured.
