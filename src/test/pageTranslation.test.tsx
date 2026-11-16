import { act, cleanup, render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderedText, translateTextNodes } from "./pageTranslation";
import { translationCases } from "./pageTranslation.fixtures";

describe("page translation state changes", () => {
  it.each(translationCases)("%s", async (_name, fixture) => {
    const { rerender } = render(fixture(false));
    translateTextNodes(document.body);
    expect(document.querySelector("font")).not.toBeNull();
    await act(async () => rerender(fixture(true)));
    const translatedResult = renderedText();
    translateTextNodes(document.body);
    await act(async () => rerender(fixture(false)));
    translateTextNodes(document.body);
    await act(async () => rerender(fixture(true)));
    expect(renderedText()).toBe(translatedResult);
    cleanup();
    await act(async () => {
      render(fixture(true));
    });
    expect(translatedResult).toBe(renderedText());
  });
});
