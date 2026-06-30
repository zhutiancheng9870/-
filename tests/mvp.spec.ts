import { expect, test } from "@playwright/test";

test("landing page includes sales page essentials and payment entry", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /turn messy order exports/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /buy full export/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /refund policy/i })).toBeVisible();
  await expect(page.getByText(/privacy, disclaimer, and contact/i)).toBeVisible();
});

test("core CSV cleaning works and free limit locks full export", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: /load sample data/i }).click();
  await expect(page.getByLabel("Cleaning summary")).toBeVisible();
  await expect(page.getByText(/free mode shows and exports 25 rows/i)).toBeVisible();
  await expect(page.getByRole("button", { name: /export free preview/i })).toBeEnabled();
  await expect(page.getByRole("button", { name: /export full csv/i })).toBeDisabled();
});

test("demo license unlock enables full export in local mode", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: /load sample data/i }).click();
  await page.getByLabel("Unlock code").fill("DEMO-FULL-ACCESS");
  await page.getByRole("button", { name: /verify/i }).click();
  await expect(page.getByText(/demo unlock accepted/i)).toBeVisible();
  await expect(page.getByRole("button", { name: /export full csv/i })).toBeEnabled();
});

test("error state appears when cleaning empty input", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: /clean pasted csv/i }).click();
  await expect(page.getByRole("alert").filter({ hasText: /add a csv file/i })).toBeVisible();
});

test("checkout form can submit a manual order", async ({ page }) => {
  await page.goto("/checkout");
  await page.getByLabel("Name").fill("Test Buyer");
  await page.getByLabel("Email for unlock code").fill("buyer@example.com");
  await page.getByLabel("Payment reference").fill("TEST-RECEIPT-123");
  await page.getByLabel("What do you need cleaned?").fill("Gumroad export with duplicate rows.");
  await page.getByRole("button", { name: /submit order/i }).click();
  await expect(page.getByText(/order saved/i)).toBeVisible();
});

test("mobile layout has no horizontal overflow", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /turn messy order exports/i })).toBeVisible();
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth
  );
  expect(overflow).toBeLessThanOrEqual(1);
});
