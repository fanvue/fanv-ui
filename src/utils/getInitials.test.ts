import { describe, expect, it } from "vitest";
import { getInitials } from "./getInitials";

describe("getInitials", () => {
  it("returns initials of the first two words", () => {
    expect(getInitials("Ciao Bello")).toBe("CB");
  });

  it("returns a single initial for a single word", () => {
    expect(getInitials("JavaScript")).toBe("J");
  });

  it("returns an empty string for nullish input", () => {
    expect(getInitials(undefined)).toBe("");
    expect(getInitials(null)).toBe("");
    expect(getInitials("")).toBe("");
  });

  it("uses only the first two words when more are present", () => {
    expect(getInitials("one two three four")).toBe("OT");
  });

  it("collapses and trims surrounding/internal whitespace", () => {
    expect(getInitials("  Ciao   Bello  ")).toBe("CB");
  });

  it("uppercases lowercase initials", () => {
    expect(getInitials("ciao bello")).toBe("CB");
  });

  it("handles multi-byte characters by their first code point", () => {
    expect(getInitials("élise dupont")).toBe("ÉD");
  });
});
