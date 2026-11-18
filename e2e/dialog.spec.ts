import { expect, test } from "@playwright/test";
import { getStoryUrl } from "./utils/storybook";

test.describe("Dialog", () => {
  test("Edge Controls story leaves room for the ring of a control at the body edge", async ({
    page,
  }) => {
    await page.goto(getStoryUrl("Dialog", "Edge Controls"));
    const trigger = page.getByRole("button", { name: "Open Dialog" });
    const dialog = page.getByRole("dialog");
    await expect(dialog.or(trigger).first()).toBeVisible();
    if (!(await dialog.isVisible())) await trigger.click();
    const card = dialog.getByRole("button", { name: "Monthly" });
    await expect(card).toBeVisible();

    const geometry = await card.evaluate((input) => {
      const content = input.closest("[role='dialog']");
      let body = input.parentElement;
      while (body && getComputedStyle(body).overflowY !== "auto") body = body.parentElement;
      if (!body || !content) throw new Error("Dialog scroll box or content not found");
      const paddingLeft = Number.parseFloat(getComputedStyle(content).paddingLeft);
      const contentLeft = content.getBoundingClientRect().left + content.clientLeft + paddingLeft;
      return {
        clearance: input.getBoundingClientRect().left - body.getBoundingClientRect().left,
        offsetFromPadding: input.getBoundingClientRect().left - contentLeft,
      };
    });

    expect(geometry.clearance).toBeGreaterThanOrEqual(4);
    expect(geometry.offsetFromPadding).toBe(0);
  });
});
