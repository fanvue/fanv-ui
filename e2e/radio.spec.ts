import { expect, test } from "@playwright/test";
import { getStoryUrl } from "./utils/storybook";

test.describe("Radio", () => {
  test("Default story renders correctly", async ({ page }) => {
    await page.goto(getStoryUrl("Radio", "Default"));
    const radio = page.getByRole("radio");
    await expect(radio).toBeVisible();
    await expect(radio).toBeEnabled();
  });

  test("Small variant renders correctly", async ({ page }) => {
    await page.goto(getStoryUrl("Radio", "Small"));
    const radio = page.getByRole("radio");
    await expect(radio).toBeVisible();
    await expect(radio).toBeEnabled();
  });

  test("WithHelperText story renders correctly", async ({ page }) => {
    await page.goto(getStoryUrl("Radio", "With Helper Text"));
    const radio = page.getByRole("radio");
    const helperText = page.getByText("This is helpful descriptive text");
    await expect(radio).toBeVisible();
    await expect(helperText).toBeVisible();
  });

  test("disabled state prevents interaction", async ({ page }) => {
    await page.goto(getStoryUrl("Radio", "Disabled"));

    const radio = page.getByRole("radio");
    await expect(radio).toBeDisabled();
  });
});

test.describe("RadioGroup", () => {
  test("Default story renders correctly", async ({ page }) => {
    await page.goto(getStoryUrl("RadioGroup", "Default"));
    const radios = page.getByRole("radio");
    await expect(radios).toHaveCount(3);
    await expect(radios.first()).toBeChecked();
  });

  test("Small variant renders correctly", async ({ page }) => {
    await page.goto(getStoryUrl("RadioGroup", "Small"));
    const radios = page.getByRole("radio");
    await expect(radios).toHaveCount(3);
  });

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

  test("disabled group prevents all interactions", async ({ page }) => {
    await page.goto(getStoryUrl("RadioGroup", "Disabled"));
    const radios = page.getByRole("radio");
    for (let i = 0; i < (await radios.count()); i++) {
      await expect(radios.nth(i)).toBeDisabled();
    }
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
