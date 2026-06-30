import { ArrowLeft, ShieldCheck } from "lucide-react";

const supportEmail = process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "support@example.com";

export default function PrivacyPage() {
  return (
    <main className="policy-page">
      <nav className="nav" aria-label="Privacy navigation">
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
            <ShieldCheck className="icon" />
            Privacy policy
          </span>
          <h1>Privacy Policy</h1>
          <p className="lead">Last updated: June 30, 2026.</p>

          <h2>Files</h2>
          <p>
            The demo cleaner processes uploaded or pasted CSV and Excel files in your browser. The
            current MVP does not intentionally upload statement files to our server.
          </p>

          <h2>Checkout and Support Data</h2>
          <p>
            If you use a hosted checkout link or contact support, the payment provider or email
            platform may process the details you submit. We only use that data to deliver access,
            provide support, and maintain basic business records.
          </p>

          <h2>Sensitive Data</h2>
          <p>
            Bank statements can contain sensitive information. Use anonymized samples when testing
            and review cleaned exports before accounting, tax, or reporting use.
          </p>

          <h2>Contact</h2>
          <p>Privacy questions can be sent to {supportEmail}.</p>
        </div>
      </section>
    </main>
  );
}
