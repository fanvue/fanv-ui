import { expect, type Page, test } from "@playwright/test";
import { getStoryUrl } from "./utils/storybook";

async function measure(page: Page, story: string) {
  await page.goto(getStoryUrl("DatePicker", story));
  const day = page.getByRole("button", { name: /February 10/ });
  await expect(day).toBeVisible();
  const dayBox = await day.boundingBox();
  const calendarBox = await page.getByRole("grid").boundingBox();
  return { day: dayBox, calendar: calendarBox };
}

test.describe("DatePicker", () => {
  test("renders 40px days by default", async ({ page }) => {
    const { day } = await measure(page, "SingleSelection");

    expect(day?.width).toBe(40);
    expect(day?.height).toBe(40);
  });

  test("renders 32px days in a narrower calendar at the compact size", async ({ page }) => {
    const standard = await measure(page, "SingleSelection");
    const compact = await measure(page, "CompactSingle");

    expect(compact.day?.width).toBe(32);
    expect(compact.day?.height).toBe(32);
    expect(compact.calendar?.width).toBeLessThan(standard.calendar?.width ?? 0);
  });
});
