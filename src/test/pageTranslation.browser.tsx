import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { page } from "vitest/browser";
import { Select, SelectContent, SelectItem } from "../components/Select/Select";
import { expectTranslatedTransitions, translateTextNodes } from "./pageTranslation";
import { translationCases } from "./pageTranslation.fixtures";
import "../../.storybook/preview.css";

describe("page translation in Chromium", () => {
  it.each(translationCases)("%s", async (_name, fixture) => {
    await expectTranslatedTransitions(fixture);
  });
});

describe("translated Select interactions in Chromium", () => {
  it.each([undefined, "a"])("picks an option from initial value %s", async (defaultValue) => {
    const translator = new MutationObserver(() => translateTextNodes(document.body));
    try {
      translator.observe(document.body, { childList: true, subtree: true });
      render(
        <Select
          label="Country"
          helperText="Choose a country"
          defaultValue={defaultValue}
          placeholder="Pick a country"
        >
          <SelectContent>
            <SelectItem value="a">Option A</SelectItem>
            <SelectItem value="b">Option B</SelectItem>
          </SelectContent>
        </Select>,
      );
      translateTextNodes(document.body);
      await page.getByRole("combobox", { name: "Country" }).click();
      await expect.element(page.getByRole("option", { name: "Option B" })).toBeVisible();
      translateTextNodes(document.body);
      expect(document.querySelector('[role="option"] font')).not.toBeNull();
      await page.getByRole("option", { name: "Option B" }).click();
      await expect
        .element(page.getByRole("combobox", { name: "Country" }))
        .toHaveTextContent("Option B");
    } finally {
      translator.disconnect();
    }
  });
});
