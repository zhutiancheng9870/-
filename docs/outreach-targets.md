# Outreach Targets

Use these as places to reply helpfully or post build-in-public updates. Do not spam. Only reply when the thread is active or when the community rules allow sharing a relevant tool.

## High-Fit Public Threads And Communities

| Priority | Channel | URL | Why It Fits | Suggested Action |
|---:|---|---|---|---|
| 1 | Reddit r/DigitalMarketing | https://www.reddit.com/r/DigitalMarketing/comments/1fx75tj/gumroad_email_list_transfer/ | User asks how to move a Gumroad email list into a dedicated mailing platform. This is close to our buyer-list cleanup use case. | Reply with a short checklist first, then mention CreatorCSV Cleaner as a browser-side helper. |
| 2 | Reddit r/Kofi | https://www.reddit.com/r/Kofi/comments/10mmy65/automatic_info_from_kofi_to_excel/ | Ko-fi users discuss getting supporter/payment info into Excel/CSV. | Reply with a PayPal/Ko-fi export cleanup checklist. Mention the Ko-fi preset. |
| 3 | Reddit r/EtsySellers | https://www.reddit.com/r/EtsySellers/comments/1luw66a/is_there_a_way_to_get_the_csv_files_from_the_app/ | Etsy sellers are looking for CSV download paths and order exports. | Do not overpromise because Etsy has platform constraints. Offer cleanup once they have a CSV. |
| 4 | Reddit r/EtsySellers | https://www.reddit.com/r/EtsySellers/comments/1m71rts/etsy_has_neutered_csv_order_exports_from_support/ | Sellers are frustrated with Etsy CSV order export delays. | Helpful reply only; our product cannot fix Etsy's delay, but can clean older exported CSVs. |
| 5 | Reddit r/EtsySellers | https://www.reddit.com/r/EtsySellers/comments/1m1eulb/csvs_now_have_a_2_week_delay/ | Same Etsy CSV pain, but operationally intense. | Do not claim to solve delayed data. Offer order CSV cleanup and dedupe once exported. |
| 6 | Indie Hackers | https://www.indiehackers.com/post/5-hidden-gumroad-features-that-help-me-make-sales-3f3eb354e4 | Gumroad sales CSV export is mentioned as a useful feature. | Post a lightweight comment about cleaning exports before importing or analysis. |
| 7 | Indie Hackers | https://www.indiehackers.com/post/need-help-how-do-you-send-product-updates-to-your-customers-on-gumroad-2f0b0f9ab1 | Thread discusses using Gumroad customer email lists for updates. | Reply with privacy-aware CSV cleanup/import steps. |
| 8 | Indie Hackers | https://www.indiehackers.com/post/i-built-a-tool-that-turns-csv-exports-into-shareable-dashboards-fd04d03083 | People discuss messy CSV exports and analysis prep. | Build-in-public peer reply; ask for feedback on creator-order CSV cleanup. |
| 9 | Indie Hackers | https://www.indiehackers.com/product/indie-hackers/promote-your-business-to-165-000-entrepreneurs--NWAAyRCgiBFt2kn1uWn | Similar CSV-fix product positioning exists, validating willingness to pay. | Do not hijack. Use for positioning research and pricing comparison. |
| 10 | Indie Hackers | https://www.indiehackers.com/post/share-your-product-if-you-havent-made-your-first-sale-f9d6bdebba | Product-sharing style thread. | If still active or a new similar thread exists, share product transparently. |

## Ready-To-Post Replies

### Gumroad Email Transfer Reply

```text
Before importing the Gumroad customer CSV into an email platform, I would clean it first:

1. lowercase and trim emails
2. remove refunded/failed orders if you do not want them in the active buyer list
3. dedupe by email + order ID
4. keep product/source/date columns so you can segment later
5. do a small test import before importing the whole list

I built a small browser-side tool for this workflow if useful: https://creatorcsv-cleaner.vercel.app/
It does not need your Gumroad login and the free preview handles the first 25 rows.
```

### Ko-fi Excel Reply

```text
If you can export the supporter/payment data as CSV, the cleanup step is usually the annoying part: email casing, duplicate supporters, payment status, amount formats, and dates.

I made a tiny browser-side cleaner with a Ko-fi preset here:
https://creatorcsv-cleaner.vercel.app/

Free preview is 25 rows, and it does not ask for your Ko-fi login.
```

### Etsy CSV Reply

```text
Once you have the Etsy CSV, I would separate two problems:

1. getting the data out of Etsy, which only Etsy controls
2. cleaning the exported file so it is usable in Excel, Sheets, or email/import workflows

For the second part, I built a small browser-side CSV cleaner:
https://creatorcsv-cleaner.vercel.app/

It can normalize emails/dates/amounts, remove duplicate/refunded/failed rows, and export a cleaner file. It will not fix Etsy's export delay, but it can make the downloaded CSV less painful to work with.
```

### Indie Hackers Build-In-Public Post

```text
I shipped a deliberately small paid tool this week: CreatorCSV Cleaner.

It is for creators and small sellers who export orders from Gumroad, Lemon Squeezy, Ko-fi, Etsy, Stripe, or PayPal and then need a clean buyer/customer CSV.

What it does:
- paste/upload CSV
- normalize headers, emails, dates, and amounts
- remove duplicate, refunded, failed, and empty rows
- preview and export the first 25 rows free
- full export unlocks for $9 via PayPal Checkout

No platform login, no scraping, no AI dependency.

I am looking for weird CSV header rows to improve the presets:
https://creatorcsv-cleaner.vercel.app/
```

## Do-Not-Say List

- Do not say it fixes Etsy's CSV delay.
- Do not imply accounting, tax, legal, or email consent advice.
- Do not say files are guaranteed private beyond the actual browser-side behavior.
- Do not promise compatibility with every platform export.
- Do not mass-DM people who did not ask about CSV/export/import problems.
