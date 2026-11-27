import { describe, expect, it } from "vitest";
import { parseTagName } from "./parseTagName";

describe("parseTagName", () => {
  it("takes a leading emoji as the tag's emoji", () => {
    expect(parseTagName("🐳 Whale")).toEqual({ emoji: "🐳", label: "Whale" });
  });

  it("accepts an emoji with no space before the label", () => {
    expect(parseTagName("💎Top spender")).toEqual({ emoji: "💎", label: "Top spender" });
  });

  it("keeps a name with no leading emoji as label only", () => {
    expect(parseTagName("Night owl")).toEqual({ label: "Night owl" });
  });

  it("leaves an emoji later in the name in the label", () => {
    expect(parseTagName("Night 🦉")).toEqual({ label: "Night 🦉" });
  });

  it("keeps joined, skin-tone and flag emoji whole", () => {
    expect(parseTagName("👩‍💻 Builder")).toEqual({ emoji: "👩‍💻", label: "Builder" });
    expect(parseTagName("👍🏽 Fan")).toEqual({ emoji: "👍🏽", label: "Fan" });
    expect(parseTagName("🇬🇧 UK")).toEqual({ emoji: "🇬🇧", label: "UK" });
  });

  it("keeps a name that is only an emoji as its label", () => {
    expect(parseTagName("🐳")).toEqual({ label: "🐳" });
  });

  it("trims surrounding space", () => {
    expect(parseTagName("  🐳   Whale  ")).toEqual({ emoji: "🐳", label: "Whale" });
  });
});
