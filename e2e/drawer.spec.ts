import { expect, type Locator, test } from "@playwright/test";
import { getStoryUrl } from "./utils/storybook";

const style = (locator: Locator, property: string) =>
  locator.evaluate((element, name) => getComputedStyle(element).getPropertyValue(name), property);

test.describe("Drawer", () => {
  test.describe("page variant", () => {
    test("rises to 16px below the top edge and runs to the bottom one", async ({ page }) => {
      await page.goto(getStoryUrl("Drawer", "Page"));

      const panel = page.getByRole("dialog", { name: "Summer launch" });
      await expect(panel).toBeVisible({ timeout: 30_000 });
      const viewport = page.viewportSize();
      await expect
        .poll(async () => (await panel.boundingBox())?.y, { message: "panel settles" })
        .toBe(16);
      const box = await panel.boundingBox();
      expect(box?.x).toBe(0);
      expect(box?.width).toBe(viewport?.width);
      expect((box?.y ?? 0) + (box?.height ?? 0)).toBe(viewport?.height);
    });

    test("draws the page surface with a stroke on the top and sides", async ({ page }) => {
      await page.goto(getStoryUrl("Drawer", "Page"));

      const panel = page.getByRole("dialog", { name: "Summer launch" });
      await expect(panel).toBeVisible({ timeout: 30_000 });
      expect(await style(panel, "background-color")).toBe(
        await page.evaluate(() => {
          const probe = document.createElement("div");
          probe.className = "bg-background-primary";
          document.body.append(probe);
          const color = getComputedStyle(probe).backgroundColor;
          probe.remove();
          return color;
        }),
      );
      expect(await style(panel, "border-top-left-radius")).toBe("16px");
      expect(await style(panel, "border-top-right-radius")).toBe("16px");
      expect(await style(panel, "border-bottom-left-radius")).toBe("0px");
      expect(await style(panel, "border-top-width")).toBe("1px");
      expect(await style(panel, "border-left-width")).toBe("1px");
      expect(await style(panel, "border-bottom-width")).toBe("0px");
      expect(await style(panel, "box-shadow")).toContain("0px 8px 22px -1px");
    });

    test("covers one column when inset", async ({ page }) => {
      await page.goto(getStoryUrl("Drawer", "PageOverColumn"));

      const panel = page.getByRole("dialog", { name: "Summer launch" });
      await expect(panel).toBeVisible({ timeout: 30_000 });
      const viewport = page.viewportSize();
      await expect.poll(async () => (await panel.boundingBox())?.y).toBe(16);
      const box = await panel.boundingBox();
      expect(box?.x).toBe(72);
      expect((box?.x ?? 0) + (box?.width ?? 0)).toBe((viewport?.width ?? 0) - 8);
    });

    test("closes on Escape", async ({ page }) => {
      await page.goto(getStoryUrl("Drawer", "Page"));

      const panel = page.getByRole("dialog", { name: "Summer launch" });
      await expect(panel).toBeVisible({ timeout: 30_000 });
      await page.keyboard.press("Escape");
      await expect(panel).toBeHidden();
    });
  });
});
