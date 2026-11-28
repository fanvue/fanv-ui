import { describe, it } from "vitest";
import { expectTranslatedTransitions } from "./pageTranslation";
import { translationCases } from "./pageTranslation.fixtures";

describe("page translation state changes", () => {
  it.each(translationCases)("%s", async (_name, fixture) => {
    await expectTranslatedTransitions(fixture);
  });
});
