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

  test("draws the range band flush with the day buttons and rounds it at week ends", async ({
    page,
  }) => {
    await page.goto(getStoryUrl("DatePicker", "RangeSelection"));
    const band = (day: RegExp) =>
      page.getByRole("button", { name: day }).evaluate((button) => {
        const style = getComputedStyle(button.parentElement as Element, "::before");
        return {
          height: Number.parseFloat(style.height),
          buttonHeight: button.getBoundingClientRect().height,
          left: style.borderTopLeftRadius,
          right: style.borderTopRightRadius,
        };
      });

    const weekEnd = await band(/February 14/);
    const weekStart = await band(/February 15/);
    const middle = await band(/February 11/);

    expect(weekEnd.height).toBe(weekEnd.buttonHeight);
    expect(weekEnd.right).not.toBe("0px");
    expect(weekStart.left).not.toBe("0px");
    expect(middle.left).toBe("0px");
    expect(middle.right).toBe("0px");
  });

  test("sizes the footer buttons to match", async ({ page }) => {
    const apply = page.getByRole("button", { name: "Apply" });

    await page.goto(getStoryUrl("DatePicker", "RangeSelection"));
    await expect(apply).toBeVisible();
    const standardApply = await apply.boundingBox();

    await page.goto(getStoryUrl("DatePicker", "CompactRange"));
    await expect(apply).toBeVisible();
    const compactApply = await apply.boundingBox();

    expect(standardApply?.height).toBe(40);
    expect(compactApply?.height).toBe(32);
  });
});
