import { expect, test } from "@playwright/test";

/**
 * E2E tests for Button component
 *
 * These tests run against Storybook stories to verify
 * component behavior across browsers.
 */

test.describe("Button", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the Button story
    await page.goto("/iframe.html?id=components-button--default");
  });

  test("renders correctly", async ({ page }) => {
    const button = page.getByRole("button");
    await expect(button).toBeVisible();
  });

  test("is keyboard accessible", async ({ page }) => {
    const button = page.getByRole("button");

    // Tab to the button
    await page.keyboard.press("Tab");
    await expect(button).toBeFocused();

    // Verify focus is visible
    const focusRing = await button.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return styles.outlineStyle !== "none" || styles.boxShadow !== "none";
    });
    expect(focusRing).toBe(true);
  });

  test("can be activated with Enter key", async ({ page }) => {
    const button = page.getByRole("button");

    // Focus and press Enter
    await button.focus();
    await page.keyboard.press("Enter");

    // Button should still be in normal state (not loading)
    await expect(button).not.toHaveAttribute("aria-busy", "true");
  });

  test("can be activated with Space key", async ({ page }) => {
    const button = page.getByRole("button");

    // Focus and press Space
    await button.focus();
    await page.keyboard.press("Space");

    // Button should still be in normal state
    await expect(button).toBeEnabled();
  });
});

test.describe("Button - Disabled State", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/iframe.html?id=components-button--disabled");
  });

  test("disabled button is not clickable", async ({ page }) => {
    const button = page.getByRole("button");

    await expect(button).toBeDisabled();
    await expect(button).toHaveAttribute("aria-disabled", "true");
  });
});

test.describe("Button - Loading State", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/iframe.html?id=components-button--loading");
  });

  test("loading button shows spinner and is disabled", async ({ page }) => {
    const button = page.getByRole("button");

    await expect(button).toBeDisabled();
    await expect(button).toHaveAttribute("aria-busy", "true");

    // Should have a spinner (svg element)
    const spinner = button.locator("svg");
    await expect(spinner).toBeVisible();
  });
});
