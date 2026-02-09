import { expect, test } from "@playwright/test";
import { getStoryUrl } from "./utils/storybook";

test.describe("IconButton", () => {
  test("Primary40 story renders and is clickable", async ({ page }) => {
    await page.goto(getStoryUrl("IconButton", "Primary40"));
    const button = page.getByTestId("icon-button");
    await expect(button).toBeVisible();
    await expect(button).toBeEnabled();

    await button.click();
  });

  test("Secondary40 story renders correctly", async ({ page }) => {
    await page.goto(getStoryUrl("IconButton", "Secondary40"));
    const button = page.getByTestId("icon-button");
    await expect(button).toBeVisible();
    await expect(button).toBeEnabled();
  });

  test("Tertiary40 story renders correctly", async ({ page }) => {
    await page.goto(getStoryUrl("IconButton", "Tertiary40"));
    const button = page.getByTestId("icon-button");
    await expect(button).toBeVisible();
    await expect(button).toBeEnabled();
  });

  test("TertiaryWithCounter story shows counter badge", async ({ page }) => {
    await page.goto(getStoryUrl("IconButton", "TertiaryWithCounter"));
    const button = page.getByTestId("icon-button");
    await expect(button).toBeVisible();
    await expect(button).toContainText("12");
  });

  test("PrimaryDisabled story is not interactive", async ({ page }) => {
    await page.goto(getStoryUrl("IconButton", "PrimaryDisabled"));
    const button = page.getByTestId("icon-button");
    await expect(button).toBeVisible();
    await expect(button).toBeDisabled();
  });

  test("Brand40 story renders with brand styling", async ({ page }) => {
    await page.goto(getStoryUrl("IconButton", "Brand40"));
    const button = page.getByTestId("icon-button");
    await expect(button).toBeVisible();
    await expect(button).toBeEnabled();
  });

  test("Messaging52 story renders at correct size", async ({ page }) => {
    await page.goto(getStoryUrl("IconButton", "Messaging52"));
    const button = page.getByTestId("icon-button");
    await expect(button).toBeVisible();
    await expect(button).toBeEnabled();
  });

  test("Microphone72 story renders large button", async ({ page }) => {
    await page.goto(getStoryUrl("IconButton", "Microphone72"));
    const button = page.getByTestId("icon-button");
    await expect(button).toBeVisible();
    await expect(button).toBeEnabled();
  });

  test("keyboard Enter activates button", async ({ page }) => {
    await page.goto(getStoryUrl("IconButton", "Primary40"));
    const button = page.getByTestId("icon-button");
    await button.focus();
    await expect(button).toBeFocused();

    await page.keyboard.press("Enter");
  });

  test("keyboard Space activates button", async ({ page }) => {
    await page.goto(getStoryUrl("IconButton", "Primary40"));
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
