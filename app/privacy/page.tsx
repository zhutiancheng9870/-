import { ArrowLeft, ShieldCheck } from "lucide-react";

const supportEmail = process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "you@example.com";

export default function PrivacyPage() {
  return (
    <main className="policy-page">
      <nav className="nav" aria-label="Privacy navigation">
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
            <ShieldCheck className="icon" />
            Privacy policy
          </span>
          <h1>Privacy Policy</h1>
          <p className="lead">Last updated: June 30, 2026.</p>

          <h2>What We Process</h2>
          <p>
            CreatorCSV Cleaner processes uploaded or pasted CSV content in your browser for the
            purpose of cleaning and exporting your own order data.
          </p>

          <h2>CSV Files</h2>
          <p>
            The CSV cleaning tool runs client-side. CSV files are not intentionally uploaded to our
            server by the cleaning tool. You should still avoid uploading sensitive data that is not
            needed for cleanup.
          </p>

          <h2>Order Form Data</h2>
          <p>
            If you submit the checkout form, we collect the name, email, plan, payment reference,
            and notes you provide so we can verify the purchase, deliver an unlock code, and provide
            support.
          </p>

          <h2>Retention</h2>
          <p>
            MVP order records may be retained for customer support, fraud prevention, and basic
            business records. You can request deletion of support data by contacting {supportEmail}.
          </p>

          <h2>Contact</h2>
          <p>Questions about privacy can be sent to {supportEmail}.</p>
        </div>
      </section>
    </main>
  );
}
