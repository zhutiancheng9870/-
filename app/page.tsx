import {
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  FileDown,
  Lock,
  ShieldCheck,
  Sparkles,
  TableProperties,
  Upload
} from "lucide-react";
import { ToolClient } from "@/components/ToolClient";

const paymentLink = process.env.NEXT_PUBLIC_PAYMENT_LINK || "/checkout";
const supportEmail = process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "you@example.com";

export default function HomePage() {
  return (
    <main className="site-shell">
      <nav className="nav" aria-label="Main navigation">
        <a className="brand" href="/">
          <span className="brand-mark">C</span>
          CreatorCSV Cleaner
        </a>
        <div className="nav-links">
          <a href="#try">Try it</a>
          <a href="#pricing">Pricing</a>
          <a href="#faq">FAQ</a>
          <a className="primary-button" href={paymentLink}>
            <Lock className="icon" />
            Unlock
          </a>
        </div>
      </nav>

      <section className="section hero">
        <div className="container hero-grid">
          <div>
            <span className="eyebrow">
              <Sparkles className="icon" />
              Browser-side CSV cleanup for creator sellers
            </span>
            <h1>Turn messy order exports into clean customer lists in minutes.</h1>
            <p className="lead">
              CreatorCSV Cleaner standardizes Gumroad, Lemon Squeezy, Ko-fi, Etsy, Stripe, and
              generic sales CSV files so creators can reconcile revenue, segment buyers, and import
              clean customer data without spreadsheet busywork.
            </p>
            <div className="button-row">
              <a className="primary-button" href="#try">
                <Upload className="icon" />
                Try free preview
              </a>
              <a className="secondary-button" href={paymentLink}>
                <ArrowRight className="icon" />
                Buy full export
              </a>
            </div>
            <div className="trust-line">
              <span>
                <ShieldCheck className="icon" />
                Files process in your browser
              </span>
              <span>
                <BadgeCheck className="icon" />
                No account required
              </span>
              <span>
                <FileDown className="icon" />
                Free first 25 rows
              </span>
            </div>
          </div>
          <ToolClient />
        </div>
      </section>

      <section className="section" id="proof">
        <div className="container">
          <h2>Built for the boring export mess after a launch.</h2>
          <p className="lead">
            The painful part is rarely selling. It is the CSV after the sale: mismatched headers,
            duplicate rows, refunded orders, mixed money formats, and buyer emails that cannot be
            imported cleanly.
          </p>
          <div className="compare" aria-label="Product effect demonstration">
            <div className="mini-table">
              <div className="mini-table-header">
                <AlertIcon />
                Before
              </div>
              <div className="mini-row">
                <span className="muted-cell">Buyer Email</span>
                <span>JANE@EXAMPLE.COM</span>
              </div>
              <div className="mini-row">
                <span className="muted-cell">Amount</span>
                <span>$29.00 / 29 / USD 29</span>
              </div>
              <div className="mini-row">
                <span className="muted-cell">Status</span>
                <span>paid, refunded, failed</span>
              </div>
            </div>
            <div className="mini-table">
              <div className="mini-table-header">
                <CheckCircle2 className="icon" />
                After
              </div>
              <div className="mini-row">
                <span className="muted-cell">email</span>
                <span>jane@example.com</span>
              </div>
              <div className="mini-row">
                <span className="muted-cell">amount</span>
                <span>29.00</span>
              </div>
              <div className="mini-row">
                <span className="muted-cell">status</span>
                <span>paid only, deduped</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2>What the MVP does today</h2>
          <div className="feature-grid">
            <div className="feature">
              <TableProperties className="icon" />
              <h3>Normalizes messy headers</h3>
              <p className="small-copy">
                Converts platform-specific columns into a reusable customer list schema.
              </p>
            </div>
            <div className="feature">
              <ShieldCheck className="icon" />
              <h3>Filters unsafe rows</h3>
              <p className="small-copy">
                Removes duplicate, refunded, cancelled, failed, and empty rows by default.
              </p>
            </div>
            <div className="feature">
              <FileDown className="icon" />
              <h3>Exports clean CSV</h3>
              <p className="small-copy">
                Free preview exports 25 rows. Paid unlock exports the full cleaned file.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="pricing">
        <div className="container">
          <h2>Simple launch pricing</h2>
          <p className="lead">
            Start as a low-friction one-time purchase. Upgrade later only if users ask for saved
            recipes, team seats, or scheduled cleaning.
          </p>
          <div className="pricing-grid">
            <div className="price">
              <span className="badge badge-amber">Free</span>
              <strong>$0</strong>
              <p className="small-copy">Clean and inspect a sample or your own first rows.</p>
              <ul>
                <li>Upload or paste CSV</li>
                <li>Preview cleaned results</li>
                <li>Export first 25 rows</li>
              </ul>
              <a className="secondary-button" href="#try">
                Try preview
              </a>
            </div>
            <div className="price price-featured">
              <span className="badge badge-teal">Recommended</span>
              <strong>$9</strong>
              <p className="small-copy">Solo creator license for full exports.</p>
              <ul>
                <li>Unlimited rows per file</li>
                <li>All platform presets</li>
                <li>Manual support by email</li>
              </ul>
              <a className="primary-button" href={paymentLink}>
                Buy unlock key
              </a>
            </div>
            <div className="price">
              <span className="badge badge-coral">Bundle</span>
              <strong>$19</strong>
              <p className="small-copy">For creators cleaning multiple launch exports.</p>
              <ul>
                <li>Everything in Solo</li>
                <li>Priority CSV mapping help</li>
                <li>Launch checklist template</li>
              </ul>
              <a className="secondary-button" href={paymentLink}>
                Get bundle
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="faq">
        <div className="container">
          <h2>FAQ</h2>
          <div className="faq-grid">
            <div className="faq">
              <h3>Is this financial or tax advice?</h3>
              <p className="small-copy">
                No. It is a file cleanup utility. Always verify exports before accounting, tax, or
                legal use.
              </p>
            </div>
            <div className="faq">
              <h3>Do CSV files leave my browser?</h3>
              <p className="small-copy">
                The cleanup runs client-side. Only checkout form details are sent when you submit an
                order.
              </p>
            </div>
            <div className="faq">
              <h3>What if my platform has unusual headers?</h3>
              <p className="small-copy">
                Use the generic preset first. Paid users can email a sample header row for manual
                mapping support.
              </p>
            </div>
            <div className="faq">
              <h3>Refund policy?</h3>
              <p className="small-copy">
                If the tool cannot clean your exported CSV after you share the header row within 7
                days, request a refund at {supportEmail}.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-tight">
        <div className="container legal-box">
          <h3>Privacy, disclaimer, and contact</h3>
          <p className="small-copy">
            CSV processing happens in the browser. Order form submissions are used only to deliver
            unlock codes and support. This MVP does not promise accounting accuracy, tax compliance,
            revenue recovery, or platform compatibility with every export. Contact: {supportEmail}.
          </p>
        </div>
      </section>

      <footer className="footer">
        <div className="container footer-inner">
          <span>CreatorCSV Cleaner. Minimal CSV cleanup for creator sellers.</span>
          <span className="footer-links">
            <a href="/privacy">Privacy</a>
            <a href="/terms">Terms</a>
            <a href="/refund">Refund policy</a>
          </span>
        </div>
      </footer>
    </main>
  );
}

function AlertIcon() {
  return (
    <span className="badge badge-coral" aria-hidden="true">
      !
    </span>
  );
}
