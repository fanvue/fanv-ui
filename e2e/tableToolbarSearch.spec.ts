import { expect, type Page, test } from "@playwright/test";
import { getStoryUrl } from "./utils/storybook";

const NARROW = 520;
const WIDE = 1000;

async function openAt(page: Page, width: number) {
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.goto(getStoryUrl("Table", "WithSearchFilters"));
  const frame = page.getByTestId("toolbar-frame");
  await expect(frame).toBeVisible();
  const resize = (next: number) =>
    frame.evaluate((element, value) => {
      element.style.width = `${value}px`;
    }, next);
  await resize(width);
  return {
    resize,
    remove: (name: string) => page.getByRole("button", { name: `Remove ${name} filter` }),
    hiddenFilters: page.getByText(/^\d+ more filters$/),
    toolbarHeight: async () => (await frame.locator("> div").boundingBox())?.height,
  };
}

test.describe("TableToolbarSearch filters", () => {
  test("shows every filter and no +N tag when they fit", async ({ page }) => {
    const toolbar = await openAt(page, WIDE);

    await expect(toolbar.remove("Platform")).toBeVisible();
    await expect(toolbar.remove("Tag")).toBeVisible();
    await expect(toolbar.remove("Date")).toBeVisible();
    await expect(toolbar.hiddenFilters).toHaveCount(0);
    await expect.poll(toolbar.toolbarHeight).toBe(40);
  });

  test("keeps the first filter and collapses the rest into +2 without growing", async ({
    page,
  }) => {
    const toolbar = await openAt(page, NARROW);

    await expect(toolbar.hiddenFilters).toHaveText("2 more filters");
    await expect(page.getByText("+2", { exact: true }).filter({ visible: true })).toHaveCount(1);
    await expect(toolbar.remove("Platform")).toBeVisible();
    await expect(toolbar.remove("Tag")).toHaveCount(0);
    await expect(toolbar.remove("Date")).toHaveCount(0);
    await expect.poll(toolbar.toolbarHeight).toBe(40);
  });

  test("brings the filters back when the toolbar widens", async ({ page }) => {
    const toolbar = await openAt(page, NARROW);
    await expect(toolbar.hiddenFilters).toHaveText("2 more filters");

    await toolbar.resize(WIDE);

    await expect(toolbar.remove("Tag")).toBeVisible();
    await expect(toolbar.remove("Date")).toBeVisible();
    await expect(toolbar.hiddenFilters).toHaveCount(0);
    await expect.poll(toolbar.toolbarHeight).toBe(40);
  });
});
