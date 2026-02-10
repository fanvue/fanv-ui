import { expect, test } from "@playwright/test";
import { getStoryUrl } from "./utils/storybook";

test.describe("Slider", () => {
  test("Default story renders with thumb visible", async ({ page }) => {
    await page.goto(getStoryUrl("Slider", "Default"));
    const thumb = page.getByRole("slider");
    await expect(thumb).toBeVisible();
  });

  test("keyboard arrow keys change the value", async ({ page }) => {
    await page.goto(getStoryUrl("Slider", "NoLabels"));
    const thumb = page.getByRole("slider");
    await thumb.focus();
    await expect(thumb).toBeFocused();

    const before = Number(await thumb.getAttribute("aria-valuenow"));
    await page.keyboard.press("ArrowRight");
    const after = Number(await thumb.getAttribute("aria-valuenow"));
    expect(after).toBeGreaterThan(before);
  });

  test("disabled slider is not interactive", async ({ page }) => {
    await page.goto(getStoryUrl("Slider", "Disabled"));
    const thumb = page.getByRole("slider");
    await expect(thumb).toBeVisible();
    await expect(thumb).toHaveAttribute("data-disabled", "");
  });

  test("range slider renders two thumbs", async ({ page }) => {
    await page.goto(getStoryUrl("Slider", "Range"));
    const thumbs = page.getByRole("slider");
    await expect(thumbs).toHaveCount(2);
  });

  test("tooltip appears on interaction", async ({ page }) => {
    await page.goto(getStoryUrl("Slider", "WithTooltip"));
    const thumb = page.getByRole("slider");
    const tooltip = page.getByRole("tooltip");

    await expect(tooltip).toBeVisible();
    await thumb.focus();
    await page.keyboard.press("ArrowRight");
    await expect(tooltip).toBeVisible();
    await expect(tooltip).not.toBeEmpty();
  });
});
