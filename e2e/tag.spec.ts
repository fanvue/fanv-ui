import { expect, test } from "@playwright/test";
import { hoverAndPaint } from "./utils/hover";
import { getStoryUrl } from "./utils/storybook";

const opacity = (element: Element) => getComputedStyle(element).opacity;

test.describe("Tag", () => {
  test.describe("remove button revealed on hover", () => {
    test("is hidden at rest and shown on hover without changing the tag height", async ({
      page,
      isMobile,
    }) => {
      test.skip(isMobile, "Hover styles only apply on devices with a hovering pointer");
      await page.goto(getStoryUrl("Tag", "Removable"));

      const tag = page.getByTestId("tag");
      const remove = page.getByRole("button", { name: "Remove Whale" });
      await expect(tag).toBeVisible();
      expect(await remove.evaluate(opacity)).toBe("0");
      expect((await tag.boundingBox())?.height).toBe(20);

      await hoverAndPaint(page, tag);

      await expect.poll(() => remove.evaluate(opacity)).toBe("1");
      expect((await tag.boundingBox())?.height).toBe(20);
    });

    test("is shown when the keyboard focuses it", async ({ page, isMobile }) => {
      test.skip(isMobile, "Keyboard focus is a desktop path");
      await page.goto(getStoryUrl("Tag", "Removable"));

      const remove = page.getByRole("button", { name: "Remove Whale" });
      await remove.focus();

      await expect(remove).toBeFocused();
      await expect.poll(() => remove.evaluate(opacity)).toBe("1");
    });
  });

  test.describe("remove button on a device that cannot hover", () => {
    test.skip(({ browserName }) => browserName === "firefox", "Firefox has no mobile emulation");
    test.use({ hasTouch: true, isMobile: true });

    test("is always shown", async ({ page }) => {
      await page.goto(getStoryUrl("Tag", "Removable"));

      const remove = page.getByRole("button", { name: "Remove Whale" });
      await expect(remove).toBeVisible();
      expect(await remove.evaluate(opacity)).toBe("1");
      expect((await remove.boundingBox())?.width).toBe(12);
    });
  });
});
