import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  assertNoDanglingVars,
  assertPrimitiveParity,
  buildThemeCss,
  getEffectTokens,
  refToVar,
  resolveValue,
} from "./buildStyles.js";

const stylesDir = join(process.cwd(), "src/styles");
const rawTokens = JSON.parse(readFileSync(join(stylesDir, "styleTokens.json"), "utf-8"));

describe("refToVar", () => {
  it("namespaces by the referenced collection, not the referring token's type", () => {
    expect(refToVar("semantic.light.color.background.primary")).toBe(
      "var(--color-background-primary)",
    );
    // modal padding/radius are exported as type:color but reference spacing/radius
    expect(refToVar("semantic.light.spacing.global.lg")).toBe("var(--spacing-global-lg)");
    expect(refToVar("primitives.light.radius.rounded-xl")).toBe("var(--radius-xl)");
    expect(refToVar("primitives.light.color.green.500")).toBe("var(--primitives-color-green-500)");
    expect(refToVar("semantic.light.opacity.disabled")).toBe("var(--opacity-disabled)");
  });

  it("normalises Figma's European half-step decimal (0,5 -> 05)", () => {
    expect(refToVar("primitives.light.spacing.0,5")).toBe("var(--primitives-spacing-05)");
  });

  it("throws on a too-shallow or unresolvable reference", () => {
    expect(() => refToVar("semantic.light.color")).toThrow(/too shallow/);
    expect(() => refToVar("mystery.light.color.foo")).toThrow(/unresolvable/);
  });
});

describe("resolveValue", () => {
  it("renders numbers as px and passes raw values through", () => {
    expect(resolveValue(16)).toBe("16px");
    expect(resolveValue("#ffffffcc")).toBe("#ffffffcc");
    expect(resolveValue("{primitives.light.color.green.500}")).toBe(
      "var(--primitives-color-green-500)",
    );
  });
});

describe("getEffectTokens", () => {
  const css = getEffectTokens(rawTokens.effect);

  it("emits every layer of a multi-layer shadow", () => {
    const glow = css.match(/--shadow-ai-button-glow:([^;]+);/)?.[1] ?? "";
    expect(glow.split(",")).toHaveLength(3);
  });

  it("drives the focus ring through the mode-aware colour var", () => {
    expect(css).toContain("--shadow-focus-ring: inset 0 0 0 2px var(--fv-focus-ring-color)");
  });
});

describe("assertNoDanglingVars", () => {
  it("passes when every referenced var is defined", () => {
    expect(() => assertNoDanglingVars(":root {\n  --a: 1px;\n  --b: var(--a);\n}")).not.toThrow();
  });

  it("throws when a var() target is undefined", () => {
    expect(() => assertNoDanglingVars(":root {\n  --b: var(--missing);\n}")).toThrow(/--missing/);
  });
});

describe("assertPrimitiveParity", () => {
  it("passes for the current token set", () => {
    expect(() => assertPrimitiveParity(rawTokens)).not.toThrow();
  });

  it("throws when a dark token references a primitive that diverges from light", () => {
    const broken = structuredClone(rawTokens);
    broken.primitives.dark.color.green["500"].value = "#000000ff";
    broken.semantic.dark.color.__probe = {
      type: "color",
      value: "{primitives.dark.color.green.500}",
    };
    expect(() => assertPrimitiveParity(broken)).toThrow(/green\.500/);
  });
});

describe("buildThemeCss", () => {
  const css = buildThemeCss(rawTokens);

  it("produces CSS with no dangling variable references", () => {
    expect(() => assertNoDanglingVars(css)).not.toThrow();
  });

  it("resolves modal dimension tokens to spacing/radius vars", () => {
    expect(css).toContain("--color-modal-padding-desktop: var(--spacing-global-lg)");
    expect(css).toContain("--color-modal-radius: var(--radius-xl)");
  });

  it("converts Figma opacity (0-100) to the CSS 0-1 scale", () => {
    expect(css).toMatch(/--opacity-disabled: 0\.6;/);
  });

  it("stays in sync with the committed theme.css (run buildStyles.js to regenerate)", () => {
    const committed = readFileSync(join(stylesDir, "theme.css"), "utf-8");
    expect(css).toBe(committed);
  });
});
