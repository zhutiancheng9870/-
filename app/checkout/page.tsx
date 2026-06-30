import { ArrowLeft, ExternalLink, Lock, Receipt, ShieldCheck } from "lucide-react";
import { CheckoutForm } from "@/components/CheckoutForm";
import { PayPalCheckout } from "@/components/PayPalCheckout";
import { getPayPalCurrency, isPayPalConfigured } from "@/lib/paypal";

const paymentLink = process.env.NEXT_PUBLIC_PAYMENT_LINK || "";
const supportEmail = process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "you@example.com";
const paypalEmail = process.env.NEXT_PUBLIC_PAYPAL_EMAIL || "";
const paypalClientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "";
const paypalConfigured = isPayPalConfigured();
const paymentInstructions =
  process.env.NEXT_PUBLIC_PAYMENT_INSTRUCTIONS ||
  "Pay with PayPal Goods and Services, then submit the receipt reference below.";

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
              Automated checkout
            </span>
            <h1>Unlock full CSV export.</h1>
            <p className="lead">
              Pay with PayPal Checkout and receive an unlock code immediately after the payment is
              captured. Manual fallback stays available while payment accounts are being reviewed.
            </p>
            <div className="feature-grid" style={{ gridTemplateColumns: "1fr" }}>
              <div className="feature">
                <Receipt className="icon" />
                <h3>Payment step</h3>
                {paypalConfigured ? (
                  <p className="small-copy">
                    Use the automated PayPal checkout form. Your unlock code appears immediately
                    after a successful payment.
                  </p>
                ) : paymentLink ? (
                  <a className="primary-button" href={paymentLink}>
                    <ExternalLink className="icon" />
                    Open payment page
                  </a>
                ) : paypalEmail ? (
                  <>
                    <p className="small-copy">{paymentInstructions}</p>
                    <div className="alert alert-success">
                      <span>
                        Send <strong>$9 USD</strong> to PayPal: <strong>{paypalEmail}</strong>. Use
                        Goods and Services, then paste the transaction ID in the order form.
                      </span>
                    </div>
                  </>
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
                  Automated PayPal purchases receive a signed unlock code immediately. Refund
                  requests go to {supportEmail} within 7 days if the tool cannot clean the buyer's
                  CSV header row.
                </p>
              </div>
            </div>
          </div>

          <div className="checkout-card">
            {paypalConfigured ? (
              <>
                <h2>Pay automatically</h2>
                <p className="small-copy">
                  Choose a plan, enter the email for your receipt, and complete PayPal Checkout.
                </p>
                <PayPalCheckout clientId={paypalClientId} currency={getPayPalCurrency()} />
              </>
            ) : (
              <>
                <h2>Submit order</h2>
                <p className="small-copy">
                  Submit your email and payment reference so an unlock code can be delivered
                  manually during the MVP test.
                </p>
                <CheckoutForm />
              </>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
