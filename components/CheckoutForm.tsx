"use client";

import { AlertCircle, CheckCircle2, Send } from "lucide-react";
import { FormEvent, useState } from "react";

type OrderResponse = {
  ok: boolean;
  orderId?: string;
  message: string;
};

export function CheckoutForm() {
  const [status, setStatus] = useState<OrderResponse | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submitOrder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus(null);

    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = (await response.json()) as OrderResponse;
      setStatus(data);
      if (data.ok) {
        form.reset();
      }
    } catch {
      setStatus({
        ok: false,
        message: "Order could not be saved. Please contact support instead."
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="checkout-form" onSubmit={submitOrder}>
      <div className="field">
        <label htmlFor="name">Name</label>
        <input id="name" name="name" placeholder="Your name" required />
      </div>
      <div className="field">
        <label htmlFor="email">Email for unlock code</label>
        <input id="email" name="email" placeholder="you@example.com" required type="email" />
      </div>
      <div className="field">
        <label htmlFor="plan">Plan</label>
        <select id="plan" name="plan" defaultValue="solo">
          <option value="solo">Solo license - $9</option>
          <option value="bundle">Launch bundle - $19</option>
          <option value="team">Tiny team - $39</option>
        </select>
      </div>
      <div className="field">
        <label htmlFor="paymentRef">Payment reference</label>
        <input
          id="paymentRef"
          name="paymentRef"
          placeholder="Transaction ID, receipt email, or note"
          required
        />
      </div>
      <div className="field">
        <label htmlFor="notes">What do you need cleaned?</label>
        <textarea
          id="notes"
          name="notes"
          className="textarea"
          placeholder="Example: Gumroad orders, 3,200 rows, need dedupe and refund filtering."
        />
      </div>
      <button className="primary-button" disabled={isSubmitting} type="submit">
        <Send className="icon" />
        {isSubmitting ? "Saving order..." : "Submit order"}
      </button>

      {status ? (
        <div className={status.ok ? "alert alert-success" : "alert alert-error"} role="status">
          {status.ok ? <CheckCircle2 className="icon" /> : <AlertCircle className="icon" />}
          <span>
            {status.message}
            {status.orderId ? (
              <>
                {" "}
                <span className="order-number">Order {status.orderId}</span>
              </>
            ) : null}
          </span>
        </div>
      ) : null}
    </form>
  );
}
