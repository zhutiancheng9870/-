import {
  BadgeCheck,
  CheckCircle2,
  FileDown,
  ShieldCheck,
  Sparkles,
  TableProperties,
  Upload
} from "lucide-react";
import { ToolClient } from "@/components/ToolClient";
import { billingPlans, formatPlanPrice } from "@/lib/billing/plans";

const starterPlan = billingPlans.find((plan) => plan.id === "starter") ?? billingPlans[1];

export default function HomePage() {
  return (
    <main className="site-shell">
      <nav className="nav" aria-label="Main navigation">
        <a className="brand" href="/">
          <span className="brand-mark">S</span>
          StatementReady
        </a>
        <div className="nav-links">
          <a href="#demo">Demo</a>
          <a href="#templates">Templates</a>
          <a href="/pricing">Pricing</a>
          <a className="primary-button" href="/checkout?plan=starter">
            Get started
          </a>
        </div>
      </nav>

      <section className="section hero">
        <div className="container hero-grid">
          <div>
            <span className="eyebrow">
              <Sparkles className="icon" />
              Bank statement CSV cleaner for freelancers and bookkeepers
            </span>
            <h1>Turn messy bank exports into bookkeeping-ready CSV and Excel files.</h1>
            <p className="lead">
              StatementReady cleans bank, card, PayPal, and Stripe exports before they reach
              QuickBooks, Xero, spreadsheets, or monthly reconciliation. Upload CSV or Excel, map
              columns, catch bad rows, detect duplicates, and export a clean file.
            </p>
            <div className="button-row">
              <a className="primary-button" href="#demo">
                <Upload className="icon" />
                Try the live demo
              </a>
              <a className="secondary-button" href="/pricing">
                <TableProperties className="icon" />
                View pricing
              </a>
            </div>
            <div className="trust-line">
              <span>
                <ShieldCheck className="icon" />
                Browser-side file processing
              </span>
              <span>
                <BadgeCheck className="icon" />
                QuickBooks and Xero-ready templates
              </span>
              <span>
                <FileDown className="icon" />
                CSV and XLSX export
              </span>
            </div>
          </div>
          <ToolClient />
        </div>
      </section>

      <section className="section" id="templates">
        <div className="container">
          <h2>Built for the bank CSV mess before reconciliation.</h2>
          <p className="lead">
            Bookkeepers waste time fixing inconsistent dates, negative amounts, duplicate rows,
            unclear descriptions, and platform-specific bank export formats. This MVP turns that
            cleanup into a repeatable workflow.
          </p>
          <div className="feature-grid">
            <div className="feature">
              <TableProperties className="icon" />
              <h3>Generic bank statement</h3>
              <p className="small-copy">
                Normalize Date, Description, Money In, Money Out, Balance, Currency, Reference, and
                Category.
              </p>
            </div>
            <div className="feature">
              <TableProperties className="icon" />
              <h3>QuickBooks-ready CSV</h3>
              <p className="small-copy">
                Prepare a compact Date, Description, Amount, Reference, and Category export for
                review before import.
              </p>
            </div>
            <div className="feature">
              <TableProperties className="icon" />
              <h3>Xero-ready CSV</h3>
              <p className="small-copy">
                Generate Date, Amount, Payee, Description, Reference, and Currency fields for a
                cleaner statement workflow.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2>What the cleaner catches</h2>
          <div className="compare" aria-label="Product effect demonstration">
            <div className="mini-table">
              <div className="mini-table-header">
                <span className="badge badge-coral" aria-hidden="true">
                  Before
                </span>
                Messy exports
              </div>
              <div className="mini-row">
                <span className="muted-cell">Dates</span>
                <span>2026/06/01, 06-02-2026, bad-date</span>
              </div>
              <div className="mini-row">
                <span className="muted-cell">Amounts</span>
                <span>$59.99, (1,800), debit/credit columns</span>
              </div>
              <div className="mini-row">
                <span className="muted-cell">Quality</span>
                <span>Duplicates, missing descriptions, suspicious large values</span>
              </div>
            </div>
            <div className="mini-table">
              <div className="mini-table-header">
                <CheckCircle2 className="icon" />
                Cleaned output
              </div>
              <div className="mini-row">
                <span className="muted-cell">Dates</span>
                <span>2026-06-01</span>
              </div>
              <div className="mini-row">
                <span className="muted-cell">Amounts</span>
                <span>-1800.00 / 2500.00</span>
              </div>
              <div className="mini-row">
                <span className="muted-cell">Export</span>
                <span>CSV or Excel, ready for bookkeeping review</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container legal-box">
          <span className="badge badge-teal">USD pricing</span>
          <h2>Start with {formatPlanPrice(starterPlan)}.</h2>
          <p className="lead">
            The MVP supports hosted checkout links for Lemon Squeezy or Gumroad, plus mock checkout
            while payment accounts are being configured.
          </p>
          <div className="button-row">
            <a className="primary-button" href="/checkout?plan=starter">
              Open checkout placeholder
            </a>
            <a className="secondary-button" href="/pricing">
              Compare plans
            </a>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="container footer-inner">
          <span>StatementReady. Bank CSV cleanup for overseas freelancers and bookkeepers.</span>
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
