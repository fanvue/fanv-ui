import { expect, test } from "@playwright/test";
import { getStoryUrl } from "./utils/storybook";

test.describe("Pill", () => {
  test("Green variant renders correctly", async ({ page }) => {
    await page.goto(getStoryUrl("Pill", "Green"));

    const pill = page.getByTestId("pill");
    await expect(pill).toBeVisible();
    await expect(pill).toContainText("Subscriber");
  });

  test("Beta variant renders correctly", async ({ page }) => {
    await page.goto(getStoryUrl("Pill", "Beta"));

    const pill = page.getByTestId("pill");
    await expect(pill).toBeVisible();
    await expect(pill).toContainText("Beta");
  });
});
