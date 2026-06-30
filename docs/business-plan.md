# CreatorCSV Cleaner Business Plan

## Stage 1: Ten Legal Project Candidates

Scoring: 1 is weak, 5 is strong. Legal/platform risk is scored as safety, so 5 means low risk.

| # | Project | Target user | Pain | Why pay | Charge | MVP | Channels | Risk | Codex can do | Needs from owner | 1 week | Independent | Payment | Acquisition | Legal safety | Differentiation | Automation | Codex Pro fit | Total |
|---|---|---|---|---|---|---|---|---|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| 1 | CreatorCSV Cleaner: clean order/export CSVs for creators | Gumroad, Lemon, Ko-fi, Etsy, Stripe sellers | Messy exports block email imports, bookkeeping prep, buyer segmentation | Saves launch cleanup time immediately | $9 one-time, $19 bundle | Upload/paste CSV, normalize, dedupe, free 25-row export, paid full export | Reddit creator subs, Indie Hackers, Product Hunt, Gumroad communities | Low; avoid tax claims | 90% | Payment link, support email, optional unlock codes | 5 | 5 | 5 | 4 | 5 | 4 | 4 | 5 | 37 |
| 2 | Short-Form Hook Generator | creators, marketers | Running out of hooks | Pays for more video tests | $7 pack or $5/mo | Inputs niche, outputs hooks and scripts | TikTok, X, creator groups | Medium; crowded, claims risk | 85% | Payment link | 5 | 5 | 5 | 3 | 4 | 2 | 5 | 5 | 34 |
| 3 | Freelance Scope Builder | freelancers | Vague client requests become scope creep | Better proposal drafts | $9 per pack | Guided form, proposal, scope, exclusions | Reddit freelancing, LinkedIn | Low; not legal advice | 90% | Payment link | 5 | 5 | 5 | 3 | 4 | 3 | 4 | 5 | 34 |
| 4 | Review Reply Studio | local businesses | Slow review responses | Reputation and time savings | $9/mo or $19 one-time | Tone-based reply templates | Local business forums, SEO groups | Low if no scraping | 85% | Payment link | 5 | 5 | 4 | 3 | 4 | 3 | 5 | 5 | 34 |
| 5 | Rental Message Templates | small landlords, STR hosts | Repetitive guest/tenant replies | Saves admin time | $12 pack | Generator for check-in, maintenance, apology notes | Host forums, Facebook groups | Medium; housing/legal wording | 80% | Payment link | 4 | 5 | 5 | 3 | 3 | 3 | 4 | 5 | 32 |
| 6 | Job Application Tracker Lite | students, job seekers | Spreadsheet chaos in applications | Reduces missed follow-ups | $5 one-time | Local tracker, reminders export | Reddit career subs | Low | 85% | Payment link | 5 | 5 | 5 | 3 | 5 | 2 | 4 | 4 | 33 |
| 7 | PDF Rename and Folder Rules Tool | ops assistants, students | Batch files are badly named | Saves manual file work | $9 one-time | Browser file rename rules and zip export | Productivity communities | Low | 80% | Payment link | 4 | 4 | 5 | 3 | 5 | 3 | 4 | 4 | 32 |
| 8 | Client Intake Form Generator | freelancers, agencies | Intake questions are incomplete | Better project kickoff | $9 templates | Generate form copy and email | LinkedIn, Reddit freelance | Low | 90% | Payment link | 5 | 5 | 5 | 3 | 4 | 2 | 4 | 5 | 33 |
| 9 | Study Plan Generator for Exams | students | Hard to plan revision | Pays near exam season | $5 pack | Calendar-style plan export | TikTok, student Reddit | Low-medium; avoid outcome promises | 85% | Payment link | 5 | 5 | 5 | 3 | 4 | 2 | 5 | 5 | 34 |
| 10 | Product FAQ/Policy Draft Kit | indie sellers | Need product FAQs and refund copy | Speeds launch pages | $9 pack | Guided generator with disclaimers | Indie Hackers, Gumroad | Medium; legal wording risk | 85% | Payment link | 5 | 5 | 5 | 3 | 3 | 3 | 5 | 5 | 34 |

## Stage 2: Selected Project

Selected: **CreatorCSV Cleaner**.

Reason: It has the best mix of fast shipping, low legal risk, real pain, simple pricing, and a product demo that users can understand in under one minute. It does not need an AI API, scraping, ads, email sending, or existing business assets. It can be sold with a simple external payment link and manual unlock codes before adding webhooks.

MVP boundary:
- Browser-side CSV upload/paste.
- Presets for Gumroad, Lemon Squeezy, Ko-fi, Etsy, Stripe, and generic CSV.
- Normalize headers, names, emails, money, dates, status, and platform.
- Remove empty, duplicate, refunded, cancelled, failed, and void rows by default.
- Free preview/export limited to 25 rows.
- Paid unlock code enables full export.
- Checkout page supports external payment link or manual order form.
- No tax, accounting, revenue guarantee, scraping, or platform automation claims.

## Stage 3: Execution Checklist

1. Product definition
- Name: CreatorCSV Cleaner.
- Promise: clean creator platform order exports into import-ready CSVs.
- Audience: creators and micro-sellers with messy order exports.
- Offer: free 25-row preview, $9 full export unlock, $19 launch bundle.

2. Page structure
- Sticky nav.
- Tool-first hero with free preview.
- Pain and before/after demonstration.
- MVP feature section.
- Pricing.
- FAQ.
- Refund, disclaimer, privacy, and contact.
- Checkout page.

3. Functional modules
- CSV parser.
- Header mapper.
- Row cleaner.
- Deduper.
- Refund/failed filter.
- Preview table.
- CSV exporter.
- License verifier.
- Manual order form.

4. Technical stack
- Next.js + React + TypeScript.
- Plain CSS with responsive components.
- Node API routes for license verification and local order capture.
- Playwright for end-to-end tests.

5. Database/storage
- No database is needed for CSV cleaning.
- MVP order records append to `data/orders.jsonl` for local or persistent-disk deployment.
- Later: replace with Gumroad/Lemon webhooks, Supabase, or SQLite on Railway.

6. Payment scheme
- Primary: external Gumroad, Lemon Squeezy, Ko-fi, Buy Me a Coffee, or Stripe payment link.
- Current fallback: manual checkout form plus payment instructions.
- Production needs a real `NEXT_PUBLIC_PAYMENT_LINK` or QR/manual payment instruction.

7. Login/permissions
- No account required.
- Paid permission is an unlock code verified through hashed codes in env.
- Local dev accepts `DEMO-FULL-ACCESS` for testing only.

8. Free/paid limits
- Free: upload, clean, preview, export first 25 rows.
- Paid: full export for the current browser session after unlock.
- Future: saved recipes and bulk files.

9. Deployment
- Recommended first deployment: Railway or Render because local order JSONL can persist with a volume.
- Alternative: Vercel if order form is replaced by Gumroad/Lemon checkout and webhook or form provider.

10. Acquisition copy
- Positioning: "Clean Gumroad/Lemon/Ko-fi order exports before importing buyers into your email tool."
- Avoid spam. Use opt-in communities, product launch posts, and helpful replies only.

11. Test checklist
- Page starts.
- Core CSV cleaning runs.
- Payment entry exists.
- Free/paid restriction works.
- Form can submit.
- Error state appears.
- Mobile has no horizontal overflow.

12. Launch checklist
- Set support email.
- Add payment link or manual QR/instruction.
- Generate production unlock code hash.
- Deploy.
- Run smoke test on deployed URL.
- Post launch assets.

13. Growth experiments
- Post a free CSV cleaning guide.
- Offer manual cleanup for first 10 users.
- Add platform-specific landing pages.
- Add sample before/after screenshots.
- Test $9 vs $12 vs $19.
- Add "clean Mailchimp import" export preset.
