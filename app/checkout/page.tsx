import { ArrowLeft, ExternalLink, Receipt, ShieldCheck } from "lucide-react";
import { getPlan } from "@/lib/billing/plans";

const supportEmail = process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "support@example.com";
const lemonCheckoutUrl = process.env.NEXT_PUBLIC_LEMONSQUEEZY_CHECKOUT_URL || "";
const gumroadCheckoutUrl = process.env.NEXT_PUBLIC_GUMROAD_CHECKOUT_URL || "";

type CheckoutPageProps = {
  searchParams?: Promise<{ plan?: string }>;
};

export default async function CheckoutPage({ searchParams }: CheckoutPageProps) {
  const params = await searchParams;
  const plan = getPlan(params?.plan);
  const hostedUrl =
    plan.checkoutEnvKey === "NEXT_PUBLIC_GUMROAD_CHECKOUT_URL"
      ? gumroadCheckoutUrl
      : lemonCheckoutUrl || gumroadCheckoutUrl;

  return (
    <main className="site-shell">
      <nav className="nav" aria-label="Checkout navigation">
        <a className="brand" href="/">
          <span className="brand-mark">S</span>
          StatementReady
        </a>
        <div className="nav-links">
          <a href="/pricing">Pricing</a>
          <a href="/privacy">Privacy</a>
          <a href="/terms">Terms</a>
          <a className="secondary-button" href="/">
            <ArrowLeft className="icon" />
            Back to product
          </a>
        </div>
      </nav>

      <section className="section">
        <div className="container checkout-layout">
          <div>
            <span className="eyebrow">
              <Receipt className="icon" />
              USD checkout placeholder
            </span>
            <h1>{plan.name} checkout is ready to wire up.</h1>
            <p className="lead">
              Use a hosted Lemon Squeezy or Gumroad checkout link for the first paid test. Stripe
              and Paddle can be added later behind the same order, license, and credits structure.
            </p>
            <div className="feature-grid" style={{ gridTemplateColumns: "1fr" }}>
              <div className="feature">
                <ShieldCheck className="icon" />
                <h3>Current plan</h3>
                <p className="small-copy">
                  {plan.name}: ${plan.priceUsd}
                  {plan.interval === "month" ? "/month" : " one-time"} with {plan.credits} cleanup
                  credits.
                </p>
              </div>
              <div className="feature">
                <ShieldCheck className="icon" />
                <h3>Webhook-ready structure</h3>
                <p className="small-copy">
                  The app includes mock orders, signed license payloads, monthly credits, and
                  Lemon Squeezy/Gumroad webhook endpoints. Real account keys belong in environment
                  variables.
                </p>
              </div>
            </div>
          </div>

          <div className="checkout-card">
            <h2>Hosted checkout option</h2>
            <p className="small-copy">
              Add `NEXT_PUBLIC_LEMONSQUEEZY_CHECKOUT_URL` or `NEXT_PUBLIC_GUMROAD_CHECKOUT_URL` in
              production. Until then, use the mock checkout to test the order flow.
            </p>
            <div className="button-row">
              {hostedUrl ? (
                <a className="primary-button" href={hostedUrl}>
                  <ExternalLink className="icon" />
                  Open hosted checkout
                </a>
              ) : (
                <a className="primary-button" href={`/api/orders?plan=${plan.id}`}>
                  Mock checkout endpoint
                </a>
              )}
              <a className="secondary-button" href={`mailto:${supportEmail}`}>
                Contact support
              </a>
            </div>
            <div className="alert alert-success">
              <span>
                No real charge is attempted on this placeholder page. Hosted checkout links can be
                swapped in without changing the demo cleaner.
              </span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
