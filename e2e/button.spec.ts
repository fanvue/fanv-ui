import { expect, test } from "@playwright/test";

test.describe("Button", () => {
  test("Primary story renders correctly", async ({ page }) => {
    await page.goto("/iframe.html?id=components-button--primary");

    const button = page.getByTestId("button");
    await expect(button).toBeVisible();
    await expect(button).toContainText("Label");
  });

  test("Secondary variant renders correctly", async ({ page }) => {
    await page.goto("/iframe.html?id=components-button--secondary");

    const button = page.getByTestId("button");
    await expect(button).toBeVisible();
    await expect(button).toContainText("Label");
  });

  test("Tertiary variant renders correctly", async ({ page }) => {
    await page.goto("/iframe.html?id=components-button--tertiary");

    const button = page.getByTestId("button");
    await expect(button).toBeVisible();
    await expect(button).toContainText("Label");
  });

  test("Brand variant renders correctly", async ({ page }) => {
    await page.goto("/iframe.html?id=components-button--brand");

    const button = page.getByTestId("button");
    await expect(button).toBeVisible();
    await expect(button).toContainText("Label");
  });

  test("Destructive variant renders correctly", async ({ page }) => {
    await page.goto("/iframe.html?id=components-button--destructive");

    const button = page.getByTestId("button");
    await expect(button).toBeVisible();
    await expect(button).toContainText("Label");
  });

  test("Loading state renders spinner", async ({ page }) => {
    await page.goto("/iframe.html?id=components-button--loading");

    const button = page.getByTestId("button");
    await expect(button).toBeVisible();

    // Check for spinner SVG
    const spinner = button.locator("svg").first();
    await expect(spinner).toBeVisible();
  });

  test("Disabled button is not interactive", async ({ page }) => {
    await page.goto("/iframe.html?id=components-button--disabled");

    const button = page.getByTestId("button");
    await expect(button).toBeVisible();
    await expect(button).toBeDisabled();
  });

  test("Button with left icon renders correctly", async ({ page }) => {
    await page.goto("/iframe.html?id=components-button--with-left-icon");

    const button = page.getByTestId("button");
    await expect(button).toBeVisible();
    await expect(button).toContainText("Add Item");

    // Check for icon
    const icon = button.locator("svg").first();
    await expect(icon).toBeVisible();
  });

  test("Button with right icon renders correctly", async ({ page }) => {
    await page.goto("/iframe.html?id=components-button--with-right-icon");

    const button = page.getByTestId("button");
    await expect(button).toBeVisible();
    await expect(button).toContainText("Continue");

    // Check for icon
    const icon = button.locator("svg").first();
    await expect(icon).toBeVisible();
  });

  test("Button sizes render correctly", async ({ page }) => {
    // Test size 32
    await page.goto("/iframe.html?id=components-button--size-32");
    let button = page.getByTestId("button");
    await expect(button).toBeVisible();

    // Test size 40
    await page.goto("/iframe.html?id=components-button--size-40");
    button = page.getByTestId("button");
    await expect(button).toBeVisible();

    // Test size 48
    await page.goto("/iframe.html?id=components-button--size-48");
    button = page.getByTestId("button");
    await expect(button).toBeVisible();
  });
});
