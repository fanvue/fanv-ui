import { expect, test } from "@playwright/test";
import { getStoryUrl } from "./utils/storybook";

test.describe("Checkbox", () => {
  test("Default story renders and can toggle by click", async ({ page }) => {
    await page.goto(getStoryUrl("Checkbox", "Default"));
    const checkbox = page.getByRole("checkbox");
    await expect(checkbox).toBeVisible();
    await expect(checkbox).not.toBeChecked();

    await checkbox.click();
    await expect(checkbox).toBeChecked();

    await checkbox.click();
    await expect(checkbox).not.toBeChecked();
  });

  test("Checked story shows checked state", async ({ page }) => {
    await page.goto(getStoryUrl("Checkbox", "Checked"));
    await expect(page.getByRole("checkbox")).toBeVisible();
    await expect(page.getByRole("checkbox")).toBeChecked();
  });

  test("WithLabel story: label and checkbox visible, click label toggles", async ({ page }) => {
    await page.goto(getStoryUrl("Checkbox", "WithLabel"));
    const checkbox = page.getByRole("checkbox");
    const label = page.getByText("Accept terms and conditions");
    await expect(checkbox).toBeVisible();
    await expect(label).toBeVisible();
    await expect(checkbox).not.toBeChecked();

    await label.click();
    await expect(checkbox).toBeChecked();
  });

  test("Disabled story is not interactive", async ({ page }) => {
    await page.goto(getStoryUrl("Checkbox", "Disabled"));
    const checkbox = page.getByRole("checkbox");
    await expect(checkbox).toBeVisible();
    await expect(checkbox).toBeDisabled();
  });

  test("keyboard Space toggles checkbox", async ({ page }) => {
    await page.goto(getStoryUrl("Checkbox", "WithLabel"));
    const checkbox = page.getByRole("checkbox");
    await checkbox.focus();
    await expect(checkbox).toBeFocused();

    await page.keyboard.press("Space");
    await expect(checkbox).toBeChecked();

    await page.keyboard.press("Space");
    await expect(checkbox).not.toBeChecked();
  });
});
