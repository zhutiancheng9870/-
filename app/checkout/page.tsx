import { ArrowLeft, ExternalLink, Receipt, ShieldCheck } from "lucide-react";
import { PayPalCheckout } from "@/components/PayPalCheckout";
import { getPlan } from "@/lib/billing/plans";
import {
  getPayPalCurrency,
  getPayPalPlan,
  isPayPalConfigured,
  isPayPalPlanId,
  type PayPalPlanId
} from "@/lib/paypal";

const supportEmail = process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "support@example.com";
const lemonCheckoutUrl = process.env.NEXT_PUBLIC_LEMONSQUEEZY_CHECKOUT_URL || "";
const gumroadCheckoutUrl = process.env.NEXT_PUBLIC_GUMROAD_CHECKOUT_URL || "";
const paypalClientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "";
const paypalConfigured = isPayPalConfigured();
const isSandbox = process.env.PAYPAL_ENV !== "live";

type CheckoutPageProps = {
  searchParams?: Promise<{ plan?: string }>;
};

export default async function CheckoutPage({ searchParams }: CheckoutPageProps) {
  const params = await searchParams;
  const requestedPlan = isPayPalPlanId(params?.plan) ? params.plan : "starter";
  const plan = getPayPalPlan(requestedPlan);
  const hostedFallbackUrl =
    getPlan(params?.plan).checkoutEnvKey === "NEXT_PUBLIC_GUMROAD_CHECKOUT_URL"
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
              PayPal primary checkout
            </span>
            <h1>Start StatementReady with PayPal.</h1>
            <p className="lead">
              Pay with PayPal Checkout and receive a signed StatementReady license key after
              capture. Lemon Squeezy and Gumroad remain available as hosted-checkout backups.
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
                <h3>Payment structure</h3>
                <p className="small-copy">
                  PayPal Orders API handles create/capture. Successful captures create a signed
                  license key and monthly credit balance. Real secrets stay in environment
                  variables.
                </p>
              </div>
            </div>
          </div>

          <div className="checkout-card">
            <h2>Pay with PayPal</h2>
            <p className="small-copy">
              Choose a plan and complete PayPal Checkout. If live credentials are not configured,
              this page shows a safe mock fallback.
            </p>
            {paypalConfigured ? (
              <PayPalCheckout
                clientId={paypalClientId}
                currency={getPayPalCurrency()}
                initialPlanId={requestedPlan as PayPalPlanId}
                isSandbox={isSandbox}
              />
            ) : (
              <>
                <div className="alert alert-error" role="status">
                  <span>
                    PayPal Checkout is not configured yet. Add live or sandbox PayPal environment
                    variables in Vercel to enable real payment buttons.
                  </span>
                </div>
                <div className="button-row">
                  <a className="primary-button" href={`/api/orders?plan=${plan.id}`}>
                    Mock checkout endpoint
                  </a>
                  {hostedFallbackUrl ? (
                    <a className="secondary-button" href={hostedFallbackUrl}>
                      <ExternalLink className="icon" />
                      Hosted checkout backup
                    </a>
                  ) : null}
                </div>
              </>
            )}
            <p className="small-copy">
              Required env vars: `NEXT_PUBLIC_PAYPAL_CLIENT_ID`, `PAYPAL_CLIENT_SECRET`,
              `PAYPAL_ENV`, `NEXT_PUBLIC_PAYPAL_CURRENCY`, and `LICENSE_SIGNING_SECRET`.
            </p>
            <a className="secondary-button" href={`mailto:${supportEmail}`}>
              Contact support
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
