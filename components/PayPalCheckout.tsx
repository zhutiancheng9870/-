"use client";

import { AlertCircle, ArrowRight, CheckCircle2, Copy, Loader2 } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { billingPlans, formatPlanPrice } from "@/lib/billing/plans";
import type { PayPalPlanId } from "@/lib/paypal";

declare global {
  interface Window {
    paypal?: {
      Buttons: (options: Record<string, unknown>) => {
        render: (selector: string) => Promise<void>;
        close?: () => void;
      };
    };
  }
}

type PayPalCheckoutProps = {
  clientId: string;
  currency: string;
  initialPlanId: PayPalPlanId;
  isSandbox: boolean;
};

type CaptureResponse = {
  ok: boolean;
  licenseKey?: string;
  orderId?: string;
  credits?: {
    creditsRemaining: number;
  };
  message: string;
};

const LICENSE_STORAGE_KEY = "statementready_license_key";

export function PayPalCheckout({
  clientId,
  currency,
  initialPlanId,
  isSandbox
}: PayPalCheckoutProps) {
  const paidPlans = useMemo(
    () => billingPlans.filter((plan) => plan.priceUsd > 0 && plan.id !== "free"),
    []
  );
  const [planId, setPlanId] = useState<PayPalPlanId>(initialPlanId);
  const [message, setMessage] = useState("");
  const [licenseKey, setLicenseKey] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const latest = useRef({ planId });
  const rendered = useRef(false);

  useEffect(() => {
    latest.current = { planId };
  }, [planId]);

  useEffect(() => {
    if (rendered.current) return;
    rendered.current = true;

    const scriptId = "paypal-js-sdk";
    const existing = document.getElementById(scriptId);
    const load = existing
      ? Promise.resolve()
      : new Promise<void>((resolve, reject) => {
          const script = document.createElement("script");
          script.id = scriptId;
          script.src = `https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(
            clientId
          )}&currency=${encodeURIComponent(currency)}&intent=capture`;
          script.async = true;
          script.onload = () => resolve();
          script.onerror = () => reject(new Error("PayPal SDK failed to load."));
          document.body.appendChild(script);
        });

    load
      .then(async () => {
        if (!window.paypal) {
          throw new Error("PayPal SDK is unavailable.");
        }

        await window.paypal
          .Buttons({
            createOrder: async () => {
              const current = latest.current;
              setMessage("");
              setLicenseKey("");

              const response = await fetch("/api/paypal/create-order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(current)
              });
              const data = (await response.json()) as {
                ok: boolean;
                orderId?: string;
                message?: string;
              };
              if (!response.ok || !data.orderId) {
                setMessage(data.message || "PayPal order could not be created.");
                throw new Error("PayPal order creation failed.");
              }
              return data.orderId;
            },
            onApprove: async (data: { orderID: string }) => {
              const current = latest.current;
              const response = await fetch("/api/paypal/capture-order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  orderId: data.orderID,
                  planId: current.planId
                })
              });
              const payload = (await response.json()) as CaptureResponse;
              setMessage(payload.message);
              if (payload.ok && payload.licenseKey) {
                window.localStorage.setItem(LICENSE_STORAGE_KEY, payload.licenseKey);
                setLicenseKey(payload.licenseKey);
              }
            },
            onError: () => {
              setMessage(
                isSandbox
                  ? "PayPal checkout did not complete. In sandbox mode, use a PayPal sandbox buyer account."
                  : "PayPal checkout did not complete. Try again or contact support."
              );
            }
          })
          .render("#paypal-button-container");
      })
      .catch((error) => {
        setMessage(error instanceof Error ? error.message : "PayPal could not be loaded.");
      })
      .finally(() => setIsLoading(false));
  }, [clientId, currency, isSandbox]);

  async function copyLicense() {
    if (!licenseKey) return;
    await navigator.clipboard.writeText(licenseKey);
    setMessage("License key copied.");
  }

  return (
    <div className="checkout-form" aria-label="PayPal checkout">
      <div className="field">
        <label htmlFor="paypal-plan">Plan</label>
        <select
          id="paypal-plan"
          name="paypal-plan"
          value={planId}
          onChange={(event) => setPlanId(event.target.value as PayPalPlanId)}
        >
          {paidPlans.map((plan) => (
            <option key={plan.id} value={plan.id}>
              {plan.name} - {formatPlanPrice(plan)}
            </option>
          ))}
        </select>
      </div>

      {isSandbox ? (
        <div className="alert alert-error" role="status">
          <AlertCircle className="icon" />
          <span>
            Sandbox mode is active. Use a PayPal sandbox buyer account. Real buyers require
            `PAYPAL_ENV=live` and live credentials.
          </span>
        </div>
      ) : null}

      {isLoading ? (
        <div className="alert alert-success" role="status">
          <Loader2 className="icon" />
          <span>Loading PayPal Checkout...</span>
        </div>
      ) : null}

      <div id="paypal-button-container" />

      {message ? (
        <div className={licenseKey ? "alert alert-success" : "alert alert-error"} role="status">
          {licenseKey ? <CheckCircle2 className="icon" /> : <AlertCircle className="icon" />}
          <span>{message}</span>
        </div>
      ) : null}

      {licenseKey ? (
        <div className="license-box">
          <label htmlFor="license-key">License key</label>
          <textarea id="license-key" className="textarea" readOnly value={licenseKey} />
          <button className="secondary-button" onClick={copyLicense} type="button">
            <Copy className="icon" />
            Copy license key
          </button>
          <a className="primary-button" href="/#demo">
            <ArrowRight className="icon" />
            Open cleaner
          </a>
        </div>
      ) : null}
    </div>
  );
}
