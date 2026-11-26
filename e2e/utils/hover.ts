import type { Locator, Page } from "@playwright/test";

/**
 * Hovers a target from a pointer parked away from it, then takes a throwaway screenshot. Headless
 * WebKit applies hover styles to a hovered element's descendants only once it paints, and nothing
 * in a test forces a paint until a screenshot does.
 */
export async function hoverAndPaint(page: Page, target: Locator) {
  await page.mouse.move(0, 0);
  await target.hover();
  await page.screenshot();
}
