"use client";

import { AlertCircle, ArrowRight, CheckCircle2, Copy, Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

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

type Plan = "solo" | "bundle" | "team";

type PayPalCheckoutProps = {
  clientId: string;
  currency: string;
};

type CaptureResponse = {
  ok: boolean;
  licenseCode?: string;
  message: string;
};

const PLAN_LABELS: Record<Plan, string> = {
  solo: "Solo license - $9",
  bundle: "Launch bundle - $19",
  team: "Tiny team - $39"
};

const LICENSE_STORAGE_KEY = "creatorcsv_unlock_code";

export function PayPalCheckout({ clientId, currency }: PayPalCheckoutProps) {
  const [plan, setPlan] = useState<Plan>("solo");
  const [message, setMessage] = useState("");
  const [licenseCode, setLicenseCode] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const latest = useRef({ plan });
  const rendered = useRef(false);

  useEffect(() => {
    latest.current = { plan };
  }, [plan]);

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
              setLicenseCode("");

              const response = await fetch("/api/paypal/create-order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(current)
              });
              const data = (await response.json()) as { ok: boolean; orderId?: string; message?: string };
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
                  plan: current.plan
                })
              });
              const payload = (await response.json()) as CaptureResponse;
              setMessage(payload.message);
              if (payload.ok && payload.licenseCode) {
                window.localStorage.setItem(LICENSE_STORAGE_KEY, payload.licenseCode);
                setLicenseCode(payload.licenseCode);
              }
            },
            onError: () => {
              setMessage(
                "PayPal checkout did not complete. In sandbox mode, use a PayPal sandbox buyer account instead of your real PayPal login."
              );
            }
          })
          .render("#paypal-button-container");
      })
      .catch((error) => {
        setMessage(error instanceof Error ? error.message : "PayPal could not be loaded.");
      })
      .finally(() => setIsLoading(false));
  }, [clientId, currency]);

  async function copyCode() {
    if (!licenseCode) return;
    await navigator.clipboard.writeText(licenseCode);
    setMessage("Unlock code copied.");
  }

  return (
    <div className="checkout-form" aria-label="Automated PayPal checkout">
      <div className="field">
        <label htmlFor="paypal-plan">Plan</label>
        <select
          id="paypal-plan"
          name="paypal-plan"
          value={plan}
          onChange={(event) => setPlan(event.target.value as Plan)}
        >
          {Object.entries(PLAN_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {isLoading ? (
        <div className="alert alert-success" role="status">
          <Loader2 className="icon" />
          <span>Loading PayPal Checkout...</span>
        </div>
      ) : null}

      <div id="paypal-button-container" />

      {message ? (
        <div className={licenseCode ? "alert alert-success" : "alert alert-error"} role="status">
          {licenseCode ? <CheckCircle2 className="icon" /> : <AlertCircle className="icon" />}
          <span>{message}</span>
        </div>
      ) : null}

      {licenseCode ? (
        <div className="license-box">
          <label htmlFor="license-code">Unlock code</label>
          <textarea id="license-code" className="textarea" readOnly value={licenseCode} />
          <button className="secondary-button" onClick={copyCode} type="button">
            <Copy className="icon" />
            Copy unlock code
          </button>
          <a className="primary-button" href="/#try">
            <ArrowRight className="icon" />
            Open tool unlocked
          </a>
        </div>
      ) : null}
    </div>
  );
}
