import { expect, test } from "@playwright/test";

test.describe("Badge", () => {
  test("Default story renders correctly", async ({ page }) => {
    await page.goto("/iframe.html?id=components-badge--default");

    const badge = page.getByTestId("badge");
    await expect(badge).toBeVisible();
    await expect(badge).toContainText("Badge");
  });

  test("Dark variant renders correctly", async ({ page }) => {
    await page.goto("/iframe.html?id=components-badge--dark");

    const badge = page.getByTestId("badge");
    await expect(badge).toBeVisible();
    await expect(badge).toContainText("Badge");
  });
});
