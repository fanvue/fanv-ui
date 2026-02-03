import { expect, test } from "@playwright/test";
import { getStoryUrl } from "./utils/storybook";

test.describe("Count", () => {
  test("displays overflow value when exceeding max", async ({ page }) => {
    await page.goto(getStoryUrl("Count", "MaxValue"));

    const count = page.getByText("99+");
    await expect(count).toBeVisible();
  });

  test("does not render when value is zero", async ({ page }) => {
    await page.goto(getStoryUrl("Count", "ZeroValue"));

    // Component should not render anything
    const count = page.locator('[class*="rounded-full"]');
    await expect(count).not.toBeVisible();
  });

  test("positions correctly on button", async ({ page }) => {
    await page.goto(getStoryUrl("Count", "OnButton"));

    const button = page.getByRole("button", { name: "Messages" });
    const count = page.getByText("24");

    await expect(button).toBeVisible();
    await expect(count).toBeVisible();

    // Verify count is positioned at top-right of button
    const buttonBox = await button.boundingBox();
    const countBox = await count.boundingBox();

    expect(buttonBox).toBeTruthy();
    expect(countBox).toBeTruthy();

    if (buttonBox && countBox) {
      expect(countBox.x).toBeGreaterThan(buttonBox.x);
      expect(countBox.y).toBeLessThan(buttonBox.y + buttonBox.height / 2);
    }
  });
});
