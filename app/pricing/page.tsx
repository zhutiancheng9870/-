import { ArrowLeft, BadgeCheck, CheckCircle2 } from "lucide-react";
import { billingPlans, formatPlanPrice } from "@/lib/billing/plans";

export default function PricingPage() {
  return (
    <main className="site-shell">
      <nav className="nav" aria-label="Pricing navigation">
        <a className="brand" href="/">
          <span className="brand-mark">S</span>
          StatementReady
        </a>
        <div className="nav-links">
          <a href="/#demo">Demo</a>
          <a className="secondary-button" href="/">
            <ArrowLeft className="icon" />
            Back to product
          </a>
        </div>
      </nav>

      <section className="section">
        <div className="container">
          <span className="eyebrow">
            <BadgeCheck className="icon" />
            USD pricing
          </span>
          <h1>Clean bank statements without spreadsheet busywork.</h1>
          <p className="lead">
            Start free, then upgrade when you need larger files, more monthly cleanups, and
            bookkeeping-focused export templates.
          </p>

          <div className="pricing-grid">
            {billingPlans.map((plan) => (
              <div
                className={plan.id === "starter" ? "price price-featured" : "price"}
                key={plan.id}
              >
                <span className="badge badge-teal">{plan.name}</span>
                <strong>{formatPlanPrice(plan)}</strong>
                <p className="small-copy">{plan.description}</p>
                <ul>
                  {plan.features.map((feature) => (
                    <li key={feature}>
                      <CheckCircle2 className="icon" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <a
                  className={plan.id === "starter" ? "primary-button" : "secondary-button"}
                  href={plan.id === "free" ? "/#demo" : `/checkout?plan=${plan.id}`}
                >
                  {plan.id === "free" ? "Try demo" : "Choose plan"}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
