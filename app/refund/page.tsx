import { ArrowLeft, Receipt } from "lucide-react";

const supportEmail = process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "you@example.com";

export default function RefundPage() {
  return (
    <main className="policy-page">
      <nav className="nav" aria-label="Refund navigation">
        <a className="brand" href="/">
          <span className="brand-mark">C</span>
          CreatorCSV Cleaner
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
            If CreatorCSV Cleaner cannot clean your exported CSV after you share the header row
            within 7 days of purchase, contact {supportEmail} with your order email and receipt.
          </p>

          <h2>What We May Ask For</h2>
          <p>
            To protect your data, send only a header row or a small anonymized sample. Do not send
            full customer lists unless explicitly requested for support.
          </p>

          <h2>Non-Refundable Cases</h2>
          <ul>
            <li>The tool works with your CSV but you no longer need it.</li>
            <li>The request is made more than 7 days after purchase.</li>
            <li>The issue depends on unsupported accounting, tax, legal, or platform automation use.</li>
          </ul>

          <h2>Contact</h2>
          <p>Refund requests can be sent to {supportEmail}.</p>
        </div>
      </section>
    </main>
  );
}
