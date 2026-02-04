import { expect, test } from "@playwright/test";
import { getStoryUrl } from "./utils/storybook";

test.describe("RadioGroup interactions", () => {
  test("only one radio can be selected at a time", async ({ page }) => {
    await page.goto(getStoryUrl("RadioGroup", "Default"));
    const radios = page.getByRole("radio");
    const firstRadio = radios.first();
    const secondRadio = radios.nth(1);
    await expect(firstRadio).toBeChecked();
    await expect(secondRadio).not.toBeChecked();
    await secondRadio.click();
    await expect(firstRadio).not.toBeChecked();
    await expect(secondRadio).toBeChecked();
  });

  test("keyboard navigation moves focus", async ({ page }) => {
    await page.goto(getStoryUrl("RadioGroup", "Default"));
    const firstRadio = page.getByRole("radio").first();
    await firstRadio.click();
    await expect(firstRadio).toBeFocused();
    await expect(firstRadio).toBeChecked();
    await page.keyboard.press("ArrowDown");
    const secondRadio = page.getByRole("radio").nth(1);
    await expect(secondRadio).toBeFocused();
    await page.keyboard.press("ArrowDown");
    const thirdRadio = page.getByRole("radio").nth(2);
    await expect(thirdRadio).toBeFocused();
  });
});
