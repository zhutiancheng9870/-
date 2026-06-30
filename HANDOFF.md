# StatementReady Handoff

This project is now a USD-focused overseas product. It is not connected to any local-market
accounting product and should not use region-specific payment or finance positioning.

## Product Positioning

StatementReady cleans messy bank, credit card, PayPal, Stripe, and wallet CSV/Excel exports for
freelancers and bookkeepers. The output is a reviewed, bookkeeping-ready CSV or Excel file.

## Implemented Capabilities

- English landing page.
- Demo uploader with CSV, TSV, and XLSX parsing.
- Automatic column mapping and manual mapping overrides.
- Date normalization.
- Amount normalization.
- Empty row cleanup.
- Duplicate detection.
- Validation warnings and required-field errors.
- Cleaned CSV export.
- Cleaned Excel export.
- USD pricing page.
- PayPal Checkout as primary payment flow.
- Hosted checkout fallback placeholders for Lemon Squeezy and Gumroad.
- Mock order, license, credits, and webhook structure.
- Overseas launch copy.

## Reusable Functions

- `parseCsvText(input, sourceName?)`: parse pasted CSV/TSV text.
- `parseSpreadsheetFile(file)`: parse browser `File` uploads for CSV, TSV, or XLSX.
- `detectColumnMapping(headers, template)`: infer source-to-standard column mappings.
- `mapRows(parsed, mapping, template)`: apply mappings to raw rows.
- `normalizeRows(rows, template)`: normalize text, date, and amount fields.
- `detectDuplicates(rows, keyFields)`: return duplicate row issues.
- `detectAnomalies(rows, template)`: return validation errors and warnings.
- `exportStandardCsv(rows, template)`: return cleaned CSV text.
- `exportStandardExcel(rows, template)`: return an XLSX `Blob`.
- `prepareTable(parsed, template, mappingOverride?)`: run the full parse-to-validation pipeline.

## Templates

- `bank-statement`: generic bookkeeping-ready bank statement schema.
- `quickbooks-bank-csv`: compact QuickBooks-ready schema.
- `xero-bank-csv`: Xero-ready bank statement schema.

## Billing Structure

- `lib/billing/plans.ts`: Free, Starter, Pro, Team/API USD plans.
- `lib/billing/license.ts`: signed license payload generation and verification.
- `lib/billing/credits.ts`: monthly cleanup credit balance structure.
- `lib/billing/webhooks.ts`: Lemon Squeezy signature and Gumroad token helpers.
- `lib/paypal.ts`: PayPal Orders API create/capture helpers.
- `app/api/orders/route.ts`: mock order creation.
- `app/api/paypal/create-order/route.ts`: PayPal order creation endpoint.
- `app/api/paypal/capture-order/route.ts`: PayPal capture and license endpoint.
- `app/api/webhooks/lemonsqueezy/route.ts`: Lemon Squeezy webhook placeholder.
- `app/api/webhooks/gumroad/route.ts`: Gumroad webhook placeholder.

## Copy to Another Project

Copy:

- `lib/csv.ts`
- `lib/csv/`
- `lib/templates/`
- optionally `lib/billing/`

Install:

```bash
npm install jszip
```

Use:

```ts
import { parseCsvText, prepareTable } from "@/lib/csv";
import { bankStatementTemplate } from "@/lib/templates";

const parsed = parseCsvText(csvText, "bank.csv");
const result = prepareTable(parsed, bankStatementTemplate);
```

## Missing or Future Work

- Real Lemon Squeezy or Gumroad product URLs.
- Production webhook secret configuration.
- Persistent database for customers, orders, licenses, and credit balances.
- Batch upload.
- Saved mappings per bank/platform.
- More bank-specific presets.
- Real accounting platform import verification.
