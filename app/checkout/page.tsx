import { ArrowLeft, ExternalLink, Lock, Receipt, ShieldCheck } from "lucide-react";
import { CheckoutForm } from "@/components/CheckoutForm";

const paymentLink = process.env.NEXT_PUBLIC_PAYMENT_LINK || "";
const supportEmail = process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "you@example.com";
const paymentInstructions =
  process.env.NEXT_PUBLIC_PAYMENT_INSTRUCTIONS ||
  "Use your configured Gumroad, Lemon Squeezy, Ko-fi, Stripe payment link, or pay manually and paste the receipt reference below.";

export default function CheckoutPage() {
  return (
    <main className="site-shell">
      <nav className="nav" aria-label="Checkout navigation">
        <a className="brand" href="/">
          <span className="brand-mark">C</span>
          CreatorCSV Cleaner
        </a>
        <div className="nav-links">
          <a href="/privacy">Privacy</a>
          <a href="/terms">Terms</a>
          <a href="/refund">Refunds</a>
          <a className="secondary-button" href="/">
            <ArrowLeft className="icon" />
            Back to tool
          </a>
        </div>
      </nav>

      <section className="section">
        <div className="container checkout-layout">
          <div>
            <span className="eyebrow">
              <Lock className="icon" />
              Manual checkout MVP
            </span>
            <h1>Unlock full CSV export.</h1>
            <p className="lead">
              Pay for a license, submit the receipt reference, and receive an unlock code by email.
              This keeps the first launch simple while still allowing real order collection.
            </p>
            <div className="feature-grid" style={{ gridTemplateColumns: "1fr" }}>
              <div className="feature">
                <Receipt className="icon" />
                <h3>Payment step</h3>
                <p className="small-copy">{paymentInstructions}</p>
                {paymentLink ? (
                  <a className="primary-button" href={paymentLink}>
                    <ExternalLink className="icon" />
                    Open payment page
                  </a>
                ) : (
                  <p className="alert alert-success">
                    Secure checkout is being prepared. For early access or purchase questions,
                    contact {supportEmail}.
                  </p>
                )}
              </div>
              <div className="feature">
                <ShieldCheck className="icon" />
                <h3>Delivery promise</h3>
                <p className="small-copy">
                  Unlock codes are delivered manually during the MVP phase. Refund requests go to{" "}
                  {supportEmail} within 7 days if the tool cannot clean the buyer's CSV header row.
                </p>
              </div>
            </div>
          </div>

          <div className="checkout-card">
            <h2>Submit order</h2>
            <p className="small-copy">
              This form writes a local order record in development. On deployment, use Railway or
              Render with persistent storage, or replace this with a Gumroad/Lemon webhook.
            </p>
            <CheckoutForm />
          </div>
        </div>
      </section>
    </main>
  );
}
