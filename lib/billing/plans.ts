export type BillingInterval = "one_time" | "month";

export type BillingPlan = {
  id: "free" | "starter" | "pro" | "team_api";
  name: string;
  priceUsd: number;
  interval: BillingInterval;
  rowLimit: number;
  fileLimit: number;
  credits: number;
  checkoutEnvKey?: string;
  description: string;
  features: string[];
};

export const billingPlans: BillingPlan[] = [
  {
    id: "free",
    name: "Free",
    priceUsd: 0,
    interval: "month",
    rowLimit: 100,
    fileLimit: 3,
    credits: 3,
    description: "Test the cleaner with small bank exports before buying.",
    features: ["3 files per month", "100 rows per file", "CSV and Excel preview", "Basic validation"]
  },
  {
    id: "starter",
    name: "Starter",
    priceUsd: 19,
    interval: "month",
    rowLimit: 5000,
    fileLimit: 50,
    credits: 50,
    checkoutEnvKey: "NEXT_PUBLIC_LEMONSQUEEZY_CHECKOUT_URL",
    description: "For freelancers cleaning monthly bank, PayPal, and card exports.",
    features: [
      "50 files per month",
      "5,000 rows per file",
      "Cleaned CSV and XLSX export",
      "QuickBooks and Xero templates"
    ]
  },
  {
    id: "pro",
    name: "Pro",
    priceUsd: 49,
    interval: "month",
    rowLimit: 50000,
    fileLimit: 300,
    credits: 300,
    checkoutEnvKey: "NEXT_PUBLIC_GUMROAD_CHECKOUT_URL",
    description: "For bookkeepers handling multiple clients and recurring imports.",
    features: [
      "300 files per month",
      "50,000 rows per file",
      "Bulk-friendly validation workflow",
      "Priority mapping support"
    ]
  },
  {
    id: "team_api",
    name: "Team/API",
    priceUsd: 99,
    interval: "month",
    rowLimit: 250000,
    fileLimit: 1000,
    credits: 1000,
    description: "For small firms and developers embedding bank CSV cleanup.",
    features: [
      "1,000 files per month",
      "Internal API structure",
      "Webhook and license scaffolding",
      "Team onboarding support"
    ]
  }
];

export function formatPlanPrice(plan: BillingPlan): string {
  if (plan.priceUsd === 0) return "$0";
  return `$${plan.priceUsd}/${plan.interval === "month" ? "month" : "one-time"}`;
}

export function getPlan(planId: string | null | undefined): BillingPlan {
  return billingPlans.find((plan) => plan.id === planId) ?? billingPlans[1];
}
