import { expect, test } from "@playwright/test";
import { getStoryUrl } from "./utils/storybook";

test.describe("Alert dismissing behavior", () => {
  test("can dismiss a closable alert", async ({ page }) => {
    await page.goto(getStoryUrl("Alert", "InfoClosable"));

    const alert = page.getByRole("alert");
    await expect(alert).toBeVisible();
    await expect(alert).toContainText("This is a closable info alert.");

    const closeButton = page.getByRole("button", { name: "Close alert" });
    await expect(closeButton).toBeVisible();
    await closeButton.click();

    await expect(alert).not.toBeVisible();
    await expect(page.getByText("Alert dismissed!")).toBeVisible();
  });
});
