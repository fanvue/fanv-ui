import { expect, test } from "@playwright/test";

test("Storybook loads and renders sidebar", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("[data-nodetype='story']").first()).toBeVisible({ timeout: 15_000 });
});
