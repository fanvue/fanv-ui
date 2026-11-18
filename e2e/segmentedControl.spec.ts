import { expect, type Locator, test } from "@playwright/test";
import { getStoryUrl } from "./utils/storybook";

const style = (locator: Locator, property: string) =>
  locator.evaluate((element, name) => getComputedStyle(element).getPropertyValue(name), property);

test.describe("SegmentedControl", () => {
  test.describe("squared appearance", () => {
    test("draws a 32px bordered track with squared corners", async ({ page }) => {
      await page.goto(getStoryUrl("SegmentedControl", "Squared"));

      const track = page.getByRole("radiogroup", { name: "Date range" });
      await expect(track).toBeVisible();
      expect((await track.boundingBox())?.height).toBe(32);
      expect(await style(track, "border-top-left-radius")).toBe("8px");
      expect(await style(track, "border-top-width")).toBe("1px");
    });

    test("raises the selected segment and mutes the others", async ({ page }) => {
      await page.goto(getStoryUrl("SegmentedControl", "Squared"));

      const selected = page.getByRole("radio", { name: "30 days" });
      const unselected = page.getByRole("radio", { name: "7 days" });
      await expect(selected).toHaveAttribute("aria-checked", "true");
      expect((await selected.boundingBox())?.height).toBe(26);
      expect(await style(selected, "border-top-left-radius")).toBe("4px");
      expect(await style(selected, "font-weight")).toBe("500");
      expect(await style(selected, "font-size")).toBe("12px");
      expect(await style(selected, "background-color")).not.toBe(
        await style(unselected, "background-color"),
      );
      expect(await style(selected, "color")).not.toBe(await style(unselected, "color"));
    });

    test("moves the raised segment to the option that is clicked", async ({ page }) => {
      await page.goto(getStoryUrl("SegmentedControl", "Squared"));

      const previous = page.getByRole("radio", { name: "30 days" });
      const next = page.getByRole("radio", { name: "90 days" });
      const raised = await style(previous, "background-color");
      await next.click();
      await page.mouse.move(0, 0);

      await expect(next).toHaveAttribute("aria-checked", "true");
      await expect.poll(() => style(next, "background-color")).toBe(raised);
      await expect.poll(() => style(previous, "background-color")).not.toBe(raised);
    });
  });
});
