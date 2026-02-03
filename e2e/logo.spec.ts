import { expect, test } from "@playwright/test";
import { getStoryUrl } from "./utils/storybook";

test.describe("Logo", () => {
  test("FullColour story renders correctly", async ({ page }) => {
    await page.goto(getStoryUrl("Logo", "FullColour"));
    const logo = page.getByTestId("logo");
    await expect(logo).toBeVisible();
    const svg = logo.locator("svg");
    await expect(svg).toBeVisible();
    await expect(logo).toContainText("fanvue");
  });

  test("Icon story renders only icon", async ({ page }) => {
    await page.goto(getStoryUrl("Logo", "IconFullColour"));
    const logo = page.getByTestId("logo");
    await expect(logo).toBeVisible();
    const svg = logo.locator("svg");
    await expect(svg).toBeVisible();
    await expect(logo).not.toContainText("fanvue");
  });

  test("Wordmark story renders only text", async ({ page }) => {
    await page.goto(getStoryUrl("Logo", "WordmarkFullColour"));
    const logo = page.getByTestId("logo");
    await expect(logo).toBeVisible();
    await expect(logo).toContainText("fanvue");
    const svg = logo.locator("svg");
    await expect(svg).not.toBeVisible();
  });

  test("Portrait story renders icon and text in column", async ({ page }) => {
    await page.goto(getStoryUrl("Logo", "PortraitFullColour"));
    const logo = page.getByTestId("logo");
    await expect(logo).toBeVisible();
    const svg = logo.locator("svg");
    await expect(svg).toBeVisible();
    await expect(logo).toContainText("fanvue");
  });
});
