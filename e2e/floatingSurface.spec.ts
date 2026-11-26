import { expect, type Locator, test } from "@playwright/test";
import { getStoryUrl } from "./utils/storybook";

const surface = (panel: Locator) =>
  panel.evaluate((element) => {
    const style = getComputedStyle(element);
    return {
      background: style.backgroundColor,
      border: style.borderTopColor,
      radius: style.borderTopLeftRadius,
      shadow: style.boxShadow,
      blur: style.backdropFilter,
      color: style.color,
    };
  });

test.describe("floating panels", () => {
  test("dropdown menu, select list and popover share one surface", async ({ page }) => {
    await page.goto(getStoryUrl("Popover", "Open"));
    const popover = page.getByRole("dialog");
    await expect(popover).toBeVisible();
    const popoverSurface = await surface(popover);

    await page.goto(getStoryUrl("DropdownMenu", "Default"));
    const menu = page.getByRole("menu");
    await expect(menu).toBeVisible();
    const menuSurface = await surface(menu);

    await page.goto(getStoryUrl("Select", "Default"));
    await page.getByRole("combobox").first().click();
    const list = page.getByRole("listbox");
    await expect(list).toBeVisible();
    const listSurface = await surface(list);

    expect(popoverSurface.radius).not.toBe("0px");
    expect(popoverSurface.shadow).not.toBe("none");
    expect(menuSurface).toEqual(popoverSurface);
    expect(listSurface).toEqual(popoverSurface);
  });
});
