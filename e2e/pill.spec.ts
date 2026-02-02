import { expect, test } from "@playwright/test";

test.describe("Pill", () => {
  test("Green variant renders correctly", async ({ page }) => {
    await page.goto("/iframe.html?id=components-pill--green");

    const pill = page.getByTestId("pill");
    await expect(pill).toBeVisible();
    await expect(pill).toContainText("Subscriber");
  });

  test("Beta variant renders correctly", async ({ page }) => {
    await page.goto("/iframe.html?id=components-pill--beta");

    const pill = page.getByTestId("pill");
    await expect(pill).toBeVisible();
    await expect(pill).toContainText("Beta");
  });
});
