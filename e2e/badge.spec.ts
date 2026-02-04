import { expect, test } from "@playwright/test";
import { getStoryUrl } from "./utils/storybook";

test.describe("Badge", () => {
  test("Default story renders correctly", async ({ page }) => {
    await page.goto(getStoryUrl("Badge", "Default"));

    const badge = page.getByTestId("badge");
    await expect(badge).toBeVisible();
    await expect(badge).toContainText("Badge");
  });

  test("Dark variant renders correctly", async ({ page }) => {
    await page.goto(getStoryUrl("Badge", "Dark"));

    const badge = page.getByTestId("badge");
    await expect(badge).toBeVisible();
    await expect(badge).toContainText("Badge");
  });
});
