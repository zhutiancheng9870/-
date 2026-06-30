import { ArrowLeft, FileText } from "lucide-react";

const supportEmail = process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "support@example.com";

export default function TermsPage() {
  return (
    <main className="policy-page">
      <nav className="nav" aria-label="Terms navigation">
        <a className="brand" href="/">
          <span className="brand-mark">S</span>
          StatementReady
        </a>
        <a className="secondary-button" href="/">
          <ArrowLeft className="icon" />
          Back to product
        </a>
      </nav>
      <section className="section">
        <div className="container policy-content">
          <span className="eyebrow">
            <FileText className="icon" />
            Terms of use
          </span>
          <h1>Terms of Use</h1>
          <p className="lead">Last updated: June 30, 2026.</p>

          <h2>Product</h2>
          <p>
            StatementReady is a CSV and Excel cleanup utility for bank, card, PayPal, Stripe, and
            similar transaction exports.
          </p>

          <h2>No Professional Advice</h2>
          <p>
            StatementReady is not accounting, tax, legal, financial, or bookkeeping advice. Always
            review cleaned files before importing, reconciling, reporting, or sharing them.
          </p>

          <h2>User Responsibility</h2>
          <p>
            You are responsible for having permission to process uploaded data and for verifying
            final outputs before using them.
          </p>

          <h2>Payments</h2>
          <p>
            The MVP is designed for hosted Lemon Squeezy or Gumroad checkout links. Stripe and
            Paddle may be added later. Do not enter real credentials into the source code.
          </p>

          <h2>Contact</h2>
          <p>Terms questions can be sent to {supportEmail}.</p>
        </div>
      </section>
    </main>
  );
}
