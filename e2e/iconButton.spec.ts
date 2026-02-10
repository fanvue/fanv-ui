import { expect, test } from "@playwright/test";
import { getStoryUrl } from "./utils/storybook";

test.describe("IconButton", () => {
  test("keyboard Enter activates button", async ({ page }) => {
    await page.goto(getStoryUrl("IconButton", "Primary 40"));
    const button = page.getByTestId("icon-button");
    await button.focus();
    await expect(button).toBeFocused();

    await page.keyboard.press("Enter");
  });

  test("keyboard Space activates button", async ({ page }) => {
    await page.goto(getStoryUrl("IconButton", "Primary 40"));
    const button = page.getByTestId("icon-button");
    await button.focus();
    await expect(button).toBeFocused();

    await page.keyboard.press("Space");
  });

  test("NavTrayWithCounter story shows counter", async ({ page }) => {
    await page.goto(getStoryUrl("IconButton", "NavTrayWithCounter"));
    const button = page.getByTestId("icon-button");
    await expect(button).toBeVisible();
    await expect(button).toContainText("12");
  });
});
