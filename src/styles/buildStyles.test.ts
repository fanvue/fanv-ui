import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  assertNoDanglingVars,
  assertPrimitiveParity,
  buildThemeCss,
  getEffectTokens,
  LEGACY_COLOR_ALIASES,
  ROLE_COLOR_TOKENS,
  refToVar,
  resolveValue,
  THEME_V2_FALLBACKS,
} from "./buildStyles.js";

const stylesDir = join(process.cwd(), "src/styles");
const rawTokens = JSON.parse(readFileSync(join(stylesDir, "styleTokens.json"), "utf-8"));
const v2Tokens = JSON.parse(readFileSync(join(stylesDir, "styleTokensV2.json"), "utf-8"));

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

  it("emits the live glow from the live colour tokens, red layer on top", () => {
    expect(css).toContain(
      "--shadow-live-glow: -2px 2px 16px 0px var(--color-live-glow-red), 2px -2px 16px 0px var(--color-live-glow-pink);",
    );
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

  it("passes for the v2 token set", () => {
    expect(() => assertPrimitiveParity(v2Tokens)).not.toThrow();
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
  const css = buildThemeCss(rawTokens, v2Tokens);

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

  it("gives the ai button a different fill per theme", () => {
    const aiFillAliasTarget = "--color-creator-agent-banner-background";
    const bySelector = new Map<string, string>();
    let selector = "";
    for (const line of css.split("\n")) {
      const opener = line.match(/^(@theme|:root|\.dark)\s*\{/)?.[1];
      if (opener) {
        selector = opener;
      }
      const declaration = line.match(new RegExp(`^\\s*${aiFillAliasTarget}: ([^;]+);`))?.[1];
      if (declaration && !bySelector.has(selector)) {
        bySelector.set(selector, declaration);
      }
    }

    expect(bySelector.get(":root")).toBeDefined();
    expect(bySelector.get(".dark")).toBeDefined();
    expect(bySelector.get(":root")).not.toBe(bySelector.get(".dark"));
  });

  it("gives the Regular body and description styles a heavier weight in dark mode", () => {
    const blockOf = (selector: string) =>
      css.match(new RegExp(`^${selector} \\{\\n([\\s\\S]*?)^\\}`, "m"))?.[1] ?? "";
    const weights = (block: string) =>
      Object.fromEntries(
        [...block.matchAll(/^\s*--(typography-[\w-]+)-font-weight: (\d+);/gm)].map((match) => [
          match[1],
          Number(match[2]),
        ]),
      );

    expect(weights(blockOf(":root"))).toEqual({
      "typography-body-default-16px-regular": 400,
      "typography-body-small-14px-regular": 400,
      "typography-description-12px-regular": 400,
    });
    expect(weights(blockOf("\\.dark"))).toEqual({
      "typography-body-default-16px-regular": 450,
      "typography-body-small-14px-regular": 450,
      "typography-description-12px-regular": 500,
    });
    expect(css).toMatch(
      /@utility typography-body-small-14px-regular \{[^}]*font-weight: var\(--typography-body-small-14px-regular-font-weight\);/,
    );
    expect(css).toMatch(/@utility typography-body-small-14px-semibold \{[^}]*font-weight: 600;/);
  });

  it("keeps every renamed-away colour var working as an alias", () => {
    for (const [legacy, current] of Object.entries(LEGACY_COLOR_ALIASES)) {
      expect(css).toContain(`${legacy}: var(${current});`);
    }
  });

  it("declares the aliases in @theme so the old utilities regenerate", () => {
    const themeBlocks = css.match(/@theme \{[^}]*\}/g) ?? [];
    for (const legacy of Object.keys(LEGACY_COLOR_ALIASES)) {
      expect(themeBlocks.some((block) => block.includes(`${legacy}:`))).toBe(true);
    }
  });

  it("points every alias at a var that is actually defined", () => {
    const defined = new Set([...css.matchAll(/^\s*(--[\w-]+)\s*:/gm)].map((m) => m[1]));
    for (const current of Object.values(LEGACY_COLOR_ALIASES)) {
      expect(defined).toContain(current);
    }
  });

  it("documents every alias in DesignTokenDeprecations.mdx", () => {
    const doc = readFileSync(join(process.cwd(), "src/docs/DesignTokenDeprecations.mdx"), "utf-8");
    const documented = new Map(
      [...doc.matchAll(/^\|\s*`(--color-[\w-]+)`\s*\|\s*`(--color-[\w-]+)`\s*\|/gm)].map(
        (match) => [match[1], match[2]],
      ),
    );
    expect(Object.fromEntries(documented)).toEqual(LEGACY_COLOR_ALIASES);
  });

  describe("theme-v2", () => {
    const block = (selector: string) => {
      const start = css.indexOf(`\n${selector} {`);
      return css.slice(start, css.indexOf("\n}", start));
    };
    const declared = (text: string) =>
      new Map<string, string>(
        [...text.matchAll(/^\s*(--[\w-]+)\s*:\s*([^;]+);/gm)].map((m) => [m[1] ?? "", m[2] ?? ""]),
      );
    const root = declared(block(":root"));
    const v2Light = declared(block(".theme-v2"));
    const v2Dark = declared(block(".theme-v2 .theme-v2-dark"));
    // Modal padding and radius sit under --color-* but hold spacing and radius values.
    const colourVars = (vars: Map<string, string>) =>
      [...vars.entries()]
        .filter(
          ([name, value]) => name.startsWith("--color-") && !/--(spacing|radius)-/.test(value),
        )
        .map(([name]) => name);

    it("forces a surface dark under theme-v2 only, for tokens and dark: utilities", () => {
      expect(css).toContain(
        "@variant dark (&:where(.dark, .dark *, .theme-v2 .theme-v2-dark, .theme-v2 .theme-v2-dark *));",
      );
      const forced = declared(block(".theme-v2 .theme-v2-dark"));
      expect(forced.get("--color-surface-primary")).toBe("var(--primitives-color-gray-900)");
      expect(forced.get("--fv-focus-ring-color")).toBe("var(--color-content-always-white)");
      for (const [legacy, current] of Object.entries(LEGACY_COLOR_ALIASES)) {
        expect(forced.get(legacy)).toBe(`var(${current})`);
      }
      expect(css).not.toMatch(/^\.theme-v2-dark/m);
    });

    it("forces a surface light under theme-v2 with the v2 light values, after the dark block", () => {
      const forced = declared(block(".theme-v2 .theme-v2-light"));
      expect(css.indexOf("\n.theme-v2 .theme-v2-light {")).toBeGreaterThan(
        css.indexOf("\n.theme-v2 .theme-v2-dark {"),
      );
      expect(block(".theme-v2 .theme-v2-light")).toContain("color-scheme: light;");
      expect(forced.get("--color-surface-primary")).toBe("var(--primitives-color-gray-white)");
      expect(forced.get("--fv-focus-ring-color")).toBe("var(--color-interaction-focus)");
      for (const name of colourVars(v2Light)) {
        expect(forced.get(name), name).toBe(v2Light.get(name));
      }
      for (const [legacy, current] of Object.entries(LEGACY_COLOR_ALIASES)) {
        expect(forced.get(legacy)).toBe(`var(${current})`);
      }
      const base = readFileSync(join(stylesDir, "base.css"), "utf-8");
      expect(base.match(/^:root,\n\.theme-v2 \.theme-v2-light \{/gm) ?? []).toHaveLength(2);
    });

    it("adds a theme-v2 variant for styles that only apply under the v2 palette", () => {
      expect(css).toContain("@custom-variant theme-v2 (&:where(.theme-v2, .theme-v2 *));");
    });

    it("uses the v2 values for the retuned surfaces in each mode", () => {
      expect(v2Light.get("--color-background-primary")).toBe("var(--primitives-color-gray-75)");
      expect(v2Light.get("--color-surface-primary")).toBe("var(--primitives-color-gray-white)");
      expect(v2Dark.get("--color-background-primary")).toBe("var(--primitives-color-gray-black)");
      expect(v2Dark.get("--color-surface-primary")).toBe("var(--primitives-color-gray-900)");
      expect(v2Light.get("--primitives-color-gray-75")).toBe("#f4f4f4ff");
    });

    it("redefines every colour var the default theme declares, in both modes", () => {
      const missingLight = colourVars(root).filter(
        (name) => !v2Light.has(name) && !(name in LEGACY_COLOR_ALIASES),
      );
      const missingDark = colourVars(root).filter(
        (name) => !v2Dark.has(name) && !(name in LEGACY_COLOR_ALIASES),
      );
      expect(missingLight).toEqual([]);
      expect(missingDark).toEqual([]);
    });

    it("adds no colour var that the default theme does not declare", () => {
      expect(colourVars(v2Light).filter((name) => !root.has(name))).toEqual([]);
    });

    it("gives each v2-only var the current palette's value outside theme-v2, in @theme too", () => {
      const themeBlocks = (css.match(/@theme \{[^}]*\}/g) ?? []).join("\n");
      for (const [token, fallback] of Object.entries(THEME_V2_FALLBACKS)) {
        expect(root.get(token)).toBe(`var(${fallback})`);
        expect(declared(block(".dark")).get(token)).toBe(`var(${fallback})`);
        expect(themeBlocks).toContain(`${token}: var(${fallback});`);
        expect(v2Light.get(token)).toMatch(/^var\(--primitives-color-/);
        expect(v2Dark.get(token)).toMatch(/^var\(--primitives-color-/);
      }
    });

    it("gives selected menu rows a readable fill in each palette", () => {
      const themeBlocks = (css.match(/@theme \{[^}]*\}/g) ?? []).join("\n");
      expect(root.get("--color-menu-item-selected")).toBe("var(--color-buttons-navigation-hover)");
      expect(themeBlocks).toContain(
        "--color-menu-item-selected: var(--color-buttons-navigation-hover);",
      );
      expect(v2Light.get("--color-menu-item-selected")).toBe(
        "var(--color-surface-primary-inverted)",
      );
      expect(v2Dark.get("--color-menu-item-selected")).toBe(
        "var(--color-surface-primary-inverted)",
      );
      expect(v2Light.get("--color-menu-item-selected-hover")).toBe(
        "var(--color-buttons-primary-hover)",
      );
      expect(v2Dark.get("--color-menu-item-selected-hover")).toBe(
        "var(--color-buttons-primary-hover)",
      );
      expect(Object.keys(ROLE_COLOR_TOKENS)).toEqual([
        "--color-menu-item-selected",
        "--color-menu-item-selected-hover",
      ]);
    });

    it("applies the v2 dark palette to dark mode and to theme-v2-dark scopes only", () => {
      expect(css).toContain(
        ".theme-v2.dark,\n.theme-v2 .dark,\n.dark .theme-v2,\n.theme-v2 .theme-v2-dark {",
      );
    });

    it("fails the build when a v2 token has no dark value", () => {
      const broken = structuredClone(v2Tokens);
      delete broken.semantic.dark.color.content.primary;
      expect(() => buildThemeCss(rawTokens, broken)).toThrow(/no dark value for content\.primary/);
    });

    it("gives theme-v2-dark scopes the hand-written dark overrides in base.css", () => {
      const base = readFileSync(join(stylesDir, "base.css"), "utf-8");
      const darkBlocks = base.match(/^\.dark,\n\.theme-v2 \.theme-v2-dark \{/gm) ?? [];
      expect(darkBlocks).toHaveLength(2);
      expect(base).not.toMatch(/^\.dark \{/m);
    });
  });

  it("stays in sync with the committed theme.css (run buildStyles.js to regenerate)", () => {
    const committed = readFileSync(join(stylesDir, "theme.css"), "utf-8");
    expect(css).toBe(committed);
  });
});
