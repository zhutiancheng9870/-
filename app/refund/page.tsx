import { ArrowLeft, Receipt } from "lucide-react";

const supportEmail = process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "support@example.com";

export default function RefundPage() {
  return (
    <main className="policy-page">
      <nav className="nav" aria-label="Refund navigation">
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
            <Receipt className="icon" />
            Refund policy
          </span>
          <h1>Refund Policy</h1>
          <p className="lead">Last updated: June 30, 2026.</p>

          <h2>Seven-Day Compatibility Refund</h2>
          <p>
            For paid tests, request a refund within 7 days if StatementReady cannot parse or clean
            your anonymized bank export sample after support review.
          </p>

          <h2>What to Send</h2>
          <p>
            Send a header row and a few anonymized rows only. Do not send full bank statements or
            personal financial details unless explicitly requested for support.
          </p>

          <h2>Non-Refundable Cases</h2>
          <ul>
            <li>The cleaner works, but you no longer need it.</li>
            <li>The request is made more than 7 days after purchase.</li>
            <li>The issue depends on unsupported accounting, tax, legal, or bank automation use.</li>
          </ul>

          <h2>Contact</h2>
          <p>Refund requests can be sent to {supportEmail}.</p>
        </div>
      </section>
    </main>
  );
}
