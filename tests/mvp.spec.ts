import { expect, test } from "@playwright/test";

test("landing page is positioned as a bank statement cleaner", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", {
      name: /Turn messy bank exports into bookkeeping-ready CSV and Excel files/i
    })
  ).toBeVisible();
  await expect(page.getByRole("link", { name: /Try the live demo/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /View pricing/i })).toBeVisible();
  await expect(page.getByRole("heading", { name: /Generic bank statement/i })).toBeVisible();
});

test("bank sample runs through mapping, validation, duplicate detection, and export flow", async ({
  page
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: /Load sample/i }).click();
  await expect(page.getByLabel("Cleaning summary")).toBeVisible();
  await expect(page.getByText(/Possible duplicates/i)).toBeVisible();
  await expect(page.getByLabel("Column mapping")).toBeVisible();
  await expect(page.getByLabel("Validation errors")).toBeVisible();
  await expect(page.getByRole("button", { name: /Export cleaned CSV/i })).toBeEnabled();
  await expect(page.getByRole("button", { name: /Export cleaned Excel/i })).toBeEnabled();
});

test("QuickBooks and Xero templates can be selected", async ({ page }) => {
  await page.goto("/");
  await page.getByLabel("Output template").selectOption("quickbooks-bank-csv");
  await expect(page.getByLabel("Amount source column")).toBeVisible();
  await expect(page.getByText(/QuickBooks-ready bank CSV generated/i)).toBeVisible();

  await page.getByLabel("Output template").selectOption("xero-bank-csv");
  await expect(page.getByLabel("Payee source column")).toBeVisible();
  await expect(page.getByText(/Xero-ready bank CSV generated/i)).toBeVisible();
});

test("error state appears when pasted input is empty", async ({ page }) => {
  await page.goto("/");
  const pastedInput = page.getByLabel("Paste CSV text");
  await expect(pastedInput).toHaveValue(/Posted Date/);
  await pastedInput.fill(" ");
  await expect(pastedInput).toHaveValue(" ");
  await page.getByRole("button", { name: /Clean pasted data/i }).click();
  await expect(
    page.getByRole("alert").filter({ hasText: /Upload or paste a file with a header row first/i })
  ).toBeVisible();
});

test("pricing page includes USD checkout plans", async ({ page }) => {
  await page.goto("/pricing");
  await expect(page.getByRole("heading", { name: /Clean bank statements/i })).toBeVisible();
  await expect(page.getByText("$19/month")).toBeVisible();
  await expect(page.getByText("$49/month")).toBeVisible();
  await expect(page.getByText("$99/month")).toBeVisible();
});

test("checkout page exposes PayPal primary checkout and safe fallback", async ({ page }) => {
  await page.goto("/checkout?plan=starter");
  await expect(page.getByRole("heading", { name: /Start StatementReady with PayPal/i })).toBeVisible();
  await expect(page.getByText(/PayPal Checkout is not configured yet/i)).toBeVisible();
  await expect(page.getByText(/NEXT_PUBLIC_PAYPAL_CLIENT_ID/i)).toBeVisible();
  await expect(page.getByRole("link", { name: /Mock checkout endpoint/i })).toBeVisible();
});

test("mock order endpoint remains available when PayPal is not configured", async ({ request }) => {
  const response = await request.get("/api/orders?plan=starter");
  expect(response.ok()).toBeTruthy();
  const payload = (await response.json()) as { ok: boolean; mode: string; message: string };
  expect(payload.ok).toBeTruthy();
  expect(payload.mode).toBe("mock_checkout");
  expect(payload.message).toContain("PayPal");
});

test("mobile layout has no horizontal overflow", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await expect(
    page.getByRole("heading", {
      name: /Turn messy bank exports into bookkeeping-ready CSV and Excel files/i
    })
  ).toBeVisible();
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth
  );
  expect(overflow).toBeLessThanOrEqual(1);
});
