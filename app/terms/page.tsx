import { ArrowLeft, FileText } from "lucide-react";

const supportEmail = process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "you@example.com";

export default function TermsPage() {
  return (
    <main className="policy-page">
      <nav className="nav" aria-label="Terms navigation">
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
            <FileText className="icon" />
            Terms of use
          </span>
          <h1>Terms of Use</h1>
          <p className="lead">Last updated: June 30, 2026.</p>

          <h2>Product</h2>
          <p>
            CreatorCSV Cleaner is a CSV cleanup utility for creator and small-business order
            exports. It normalizes fields, removes duplicate rows, filters refunded or failed rows
            when selected, and exports a cleaned CSV.
          </p>

          <h2>No Professional Advice</h2>
          <p>
            The product is not accounting, tax, legal, financial, or business advice. Always review
            cleaned exports before using them for reporting, accounting, taxes, or customer
            communication.
          </p>

          <h2>User Responsibility</h2>
          <p>
            You are responsible for having the right to process the CSV data you upload or paste and
            for verifying the final output before using it.
          </p>

          <h2>License</h2>
          <p>
            A paid unlock code enables full export access for the MVP workflow. Do not share unlock
            codes publicly or use the product to process data you are not authorized to handle.
          </p>

          <h2>Contact</h2>
          <p>Support and terms questions can be sent to {supportEmail}.</p>
        </div>
      </section>
    </main>
  );
}
