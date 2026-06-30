# Deploy to Vercel

Use this when Lemon Squeezy asks for a product website URL.

## Fastest Path

1. Go to `https://vercel.com/new`.
2. Sign in with GitHub.
3. Import this repository: `zhutiancheng9870/-`.
4. If Vercel asks for a project name, use `creatorcsv-cleaner`.
5. Framework preset: Next.js.
6. Build command: leave default, or use `npm run build`.
7. Install command: leave default, or use `npm install`.
8. Output directory: leave empty/default.
9. Add environment variables before production launch:
   - `NEXT_PUBLIC_SUPPORT_EMAIL`
   - `NEXT_PUBLIC_PAYMENT_LINK`
   - `LICENSE_CODE_HASHES`
10. Click Deploy.

## Temporary Lemon Review Setup

If Lemon only needs a website URL before the payment link exists, deploy with:

- `NEXT_PUBLIC_SUPPORT_EMAIL`: your real support email
- leave `NEXT_PUBLIC_PAYMENT_LINK` empty

The checkout page will show the manual checkout fallback until a payment link is configured.

## After Deployment

Send Codex:

- the Vercel URL, such as `https://creatorcsv-cleaner.vercel.app`
- the support email you used
- later, the Lemon Squeezy checkout URL

Do not send passwords, Vercel tokens, identity documents, or verification codes.
