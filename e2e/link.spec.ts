import { expect, test } from "@playwright/test";
import { hoverAndPaint } from "./utils/hover";
import { getStoryUrl } from "./utils/storybook";

const textDecoration = (element: Element) =>
  getComputedStyle(element).getPropertyValue("text-decoration");
const color = (element: Element) => getComputedStyle(element).color;
const translate = (element: Element) => getComputedStyle(element).translate;

test.describe("Link", () => {
  test.describe("subtle variant", () => {
    test("is 32px tall with an icon and has no underline at rest", async ({ page }) => {
      await page.goto(getStoryUrl("Link", "Subtle"));

      const link = page.getByRole("link", { name: "Open full page" });
      await expect(link).toBeVisible();
      expect((await link.boundingBox())?.height).toBe(32);
      expect(await link.evaluate((element) => getComputedStyle(element).columnGap)).toBe("4px");
      expect(await link.evaluate((element) => getComputedStyle(element).paddingLeft)).toBe("4px");
      const label = link.getByText("Open full page");
      expect(await label.evaluate(textDecoration)).not.toContain("underline");
      expect(await label.evaluate((element) => getComputedStyle(element).fontSize)).toBe("14px");
      expect(await label.evaluate((element) => getComputedStyle(element).textUnderlineOffset)).toBe(
        "4px",
      );
    });

    test("underlines, darkens and nudges its arrow on hover", async ({ page, isMobile }) => {
      test.skip(isMobile, "Hover styles only apply on devices with a hovering pointer");
      await page.goto(getStoryUrl("Link", "Subtle"));

      const link = page.getByRole("link", { name: "Open full page" });
      const label = link.getByText("Open full page");
      const arrow = link.locator("span[aria-hidden='true']");
      const restColor = await link.evaluate(color);
      expect(await arrow.evaluate(translate)).toBe("none");

      await hoverAndPaint(page, link);

      await expect.poll(() => label.evaluate(textDecoration)).toContain("underline");
      await expect.poll(() => link.evaluate(color)).not.toBe(restColor);
      await expect.poll(() => arrow.evaluate(translate)).toBe("2px");
    });

    test("keeps its arrow still on hover when reduced motion is on", async ({ page, isMobile }) => {
      test.skip(isMobile, "Hover styles only apply on devices with a hovering pointer");
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.goto(getStoryUrl("Link", "Subtle"));

      const link = page.getByRole("link", { name: "Open full page" });
      const label = link.getByText("Open full page");
      const arrow = link.locator("span[aria-hidden='true']");

      await hoverAndPaint(page, link);

      await expect.poll(() => label.evaluate(textDecoration)).toContain("underline");
      expect(await arrow.evaluate(translate)).toBe("none");
    });

    test("underlines on hover at an inherited size, with no icon", async ({ page, isMobile }) => {
      test.skip(isMobile, "Hover styles only apply on devices with a hovering pointer");
      await page.goto(getStoryUrl("Link", "SubtleInheritSize"));

      const link = page.getByRole("link", { name: "View all campaigns" });
      const label = link.getByText("View all campaigns");
      expect(await label.evaluate(textDecoration)).not.toContain("underline");

      await hoverAndPaint(page, link);

      await expect.poll(() => label.evaluate(textDecoration)).toContain("underline");
    });
  });
});
