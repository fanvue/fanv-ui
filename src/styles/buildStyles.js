import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const tokensPath = path.join(__dirname, "styleTokens.json");
const outputPath = path.join(__dirname, "theme.css");

const SKIP_KEYS = new Set([
  "extensions",
  "description",
  "blendMode",
  "paragraphIndent",
  "paragraphSpacing",
]);

const toKebab = (str) =>
  str
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .replace(/\s+/g, "-")
    .toLowerCase();

const flattenTokens = (obj, path = []) => {
  if (!obj || typeof obj !== "object") return [];
  if ("value" in obj && "type" in obj) {
    return [{ path, value: obj.value, type: obj.type }];
  }
  const results = [];
  for (const [k, v] of Object.entries(obj)) {
    if (SKIP_KEYS.has(k)) continue;
    results.push(...flattenTokens(v, [...path, k]));
  }
  return results;
};

const semanticVarName = (parts) => `--color-${parts.map(toKebab).join("-")}`;

const resolveRef = (value) => {
  if (typeof value !== "string" || !value.startsWith("{")) return value;
  const inner = value.slice(1, -1);

  if (inner.startsWith("primitives.")) {
    const parts = inner.split(".");
    // NOTE: Both primitives.light.* and primitives.dark.* resolve to the same
    // CSS var because only light primitives are emitted into :root. This is safe
    // today — all dark-referenced primitives have identical values to their light
    // counterparts. If the dark primitive palette diverges (e.g. alpha tokens),
    // this will need a separate --primitives-dark-* namespace.
    const cssVar = `--primitives-color-${parts.slice(3).map(toKebab).join("-")}`;
    return `var(${cssVar})`;
  }

  if (inner.startsWith("semantic.")) {
    const parts = inner.split(".");
    const semanticParts = parts.slice(3);
    return `var(${semanticVarName(semanticParts)})`;
  }

  return value;
};

const getColorSections = (rawTokens) => {
  const semanticLightTokens = flattenTokens(rawTokens.semantic.light.color);
  const semanticDarkTokens = flattenTokens(rawTokens.semantic.dark.color);

  const darkMap = new Map(semanticDarkTokens.map(({ path, value }) => [path.join("."), value]));

  // Track which legacy keys were emitted so we can add legacy-only extras after.
  const emittedLegacyLight = new Set();
  const emittedLegacyDark = new Set();

  let themeVars = "";
  let lightVars = "";
  let darkVars = "";

  for (const { path, value } of semanticLightTokens) {
    const cssVar = semanticVarName(path);

    // @theme uses the legacy value if available so @layer theme and :root agree.
    // This prevents the Tailwind v4 compiler from deduplicating our :root overrides.
    const themeLegacy = LEGACY_LIGHT_MAP.get(cssVar);
    themeVars += `  ${cssVar}: ${themeLegacy ?? resolveRef(value)};\n`;

    // :root and .dark use legacy value if available, otherwise the new value
    const legacyLight = LEGACY_LIGHT_MAP.get(cssVar);
    lightVars += `  ${cssVar}: ${legacyLight ?? resolveRef(value)};\n`;
    if (legacyLight) emittedLegacyLight.add(cssVar);

    const darkRaw = darkMap.get(path.join("."));
    const darkResolved = darkRaw !== undefined ? resolveRef(darkRaw) : resolveRef(value);
    const legacyDark = LEGACY_DARK_MAP.get(cssVar);
    darkVars += `  ${cssVar}: ${legacyDark ?? darkResolved};\n`;
    if (legacyDark) emittedLegacyDark.add(cssVar);
  }

  // Add legacy-only tokens (not in new token set, e.g. neutral-250, neutral-350)
  for (const [cssVar, val] of LEGACY_LIGHT_MAP) {
    if (!emittedLegacyLight.has(cssVar)) {
      themeVars += `  ${cssVar}: ${val};\n`;
      lightVars += `  ${cssVar}: ${val};\n`;
    }
  }
  for (const [cssVar, val] of LEGACY_DARK_MAP) {
    if (!emittedLegacyDark.has(cssVar)) {
      darkVars += `  ${cssVar}: ${val};\n`;
    }
  }

  let primitivesVars = "";
  const primTokens = flattenTokens(rawTokens.primitives.light.color);
  for (const { path, value } of primTokens) {
    const varName = `--primitives-color-${path.map(toKebab).join("-")}`;
    primitivesVars += `  ${varName}: ${value};\n`;
  }

  return { themeVars, lightVars, darkVars, primitivesVars };
};

const getTypographyClasses = (typographyTokens) => {
  let output = "";

  for (const [weight, styles] of Object.entries(typographyTokens)) {
    for (const [styleName, props] of Object.entries(styles)) {
      const className = `typography-${toKebab(weight)}-${toKebab(styleName)}`;
      output += `\n@utility ${className} {\n`;

      for (const [propName, propObj] of Object.entries(props)) {
        if (SKIP_KEYS.has(propName)) continue;
        if (propName === "textCase") {
          if (propObj.value && propObj.value !== "none") {
            output += `  text-transform: ${propObj.value};\n`;
          }
          continue;
        }
        const kebabProp = toKebab(propName);
        const suffix = propObj.type === "dimension" ? "px" : "";
        output += `  ${kebabProp}: ${propObj.value}${suffix};\n`;
      }

      output += `}\n`;
    }
  }

  return output;
};

const shadowValue = (s) => `${s.offsetX}px ${s.offsetY}px ${s.radius}px ${s.spread}px ${s.color}`;

const getShadowVars = (shadowGroup, prefix) => {
  let output = "";

  for (const [name, entry] of Object.entries(shadowGroup)) {
    if (SKIP_KEYS.has(name)) continue;
    const cssName = `--shadow-${prefix ? `${prefix}-` : ""}${toKebab(name)}`;

    if (entry === null || typeof entry !== "object") continue;

    if ("value" in entry) {
      if (entry.value?.shadowType !== "dropShadow") continue;
      output += `  ${cssName}: ${shadowValue(entry.value)};\n`;
    } else if (entry["0"] && entry["1"]) {
      if (
        entry["0"].value?.shadowType !== "dropShadow" ||
        entry["1"].value?.shadowType !== "dropShadow"
      )
        continue;
      output += `  ${cssName}: ${shadowValue(entry["0"].value)}, ${shadowValue(entry["1"].value)};\n`;
    } else if (entry["0"] === null && entry["1"]) {
      if (entry["1"].value?.shadowType !== "dropShadow") continue;
      output += `  ${cssName}: ${shadowValue(entry["1"].value)};\n`;
    }
  }

  return output;
};

const getEffectTokens = (effectTokens) => {
  let output = "";

  if (effectTokens.shadow) {
    output += getShadowVars(effectTokens.shadow, "");
  }

  if (effectTokens.blurShadow) {
    output += getShadowVars(effectTokens.blurShadow, "blur");
  }

  output += `  --shadow-focus-ring: 0 0 0 2px var(--color-surface-page), 0 0 0 4px var(--color-ring);\n`;

  return output;
};

const BASE_LAYER = `@layer base {
  html {
    touch-action: manipulation;
  }

  input:-webkit-autofill,
  input:-webkit-autofill:hover,
  input:-webkit-autofill:focus,
  textarea:-webkit-autofill,
  textarea:-webkit-autofill:hover,
  textarea:-webkit-autofill:focus {
    -webkit-text-fill-color: var(--color-foreground-default);
    transition: background-color 9999s ease-in-out 0s;
  }
}`;

// ---------------------------------------------------------------------------
// Legacy compatibility layer
//
// Every old token name is preserved with its exact original hex value so that
// existing components render identically. This block is appended AFTER the new
// tokens so that CSS cascade gives old values precedence for shared names
// (e.g. neutral-50 through neutral-500 whose values changed).
//
// Remove this block once all components have been migrated to the new tokens.
// ---------------------------------------------------------------------------
// LEGACY_LIGHT_MAP / LEGACY_DARK_MAP
// Hardcoded colour + shadow values from the previous design system.
// During the transition period every semantic token listed here will use the
// legacy value in :root / .dark instead of the new primitives reference, so
// existing components see zero visual change.
//
// Tokens that only exist in the legacy set (e.g. neutral-250, neutral-350)
// are added as extra declarations after the main loop.
//
// Remove these maps once all components have been migrated to the new tokens.
// ---------------------------------------------------------------------------
const LEGACY_LIGHT_MAP = new Map([
  ["--color-primary-50", "#1515150a"],
  ["--color-primary-100", "#15151533"],
  ["--color-primary-200", "#15151566"],
  ["--color-primary-300", "#15151599"],
  ["--color-primary-400", "#151515cc"],
  ["--color-primary-500", "#151515ff"],
  ["--color-neutral-50", "#15151526"],
  ["--color-neutral-100", "#1515150a"],
  ["--color-neutral-200", "#15151533"],
  ["--color-neutral-250", "#15151566"],
  ["--color-neutral-300", "#15151599"],
  ["--color-neutral-350", "#151515cc"],
  ["--color-neutral-400", "#151515ff"],
  ["--color-neutral-500", "#f6f6f6ff"],
  ["--color-body-100", "#151515ff"],
  ["--color-body-200", "#151515cc"],
  ["--color-body-300", "#ffffffff"],
  ["--color-body-400", "#ffffffff"],
  ["--color-body-black-solid-constant", "#151515ff"],
  ["--color-body-white-solid-constant", "#ffffffff"],
  ["--color-success-50", "#e6fff5ff"],
  ["--color-success-500", "#00874cff"],
  ["--color-warning-50", "#fff6eaff"],
  ["--color-warning-500", "#ff9000ff"],
  ["--color-error-50", "#fdececff"],
  ["--color-error-500", "#e33d3dff"],
  ["--color-background-0", "#ffffff00"],
  ["--color-background-1", "#00000026"],
  ["--color-background-150", "#ffffffff"],
  ["--color-background-200", "#ffffffff"],
  ["--color-background-250", "#ffffff66"],
  ["--color-background-350", "#15151533"],
  ["--color-background-400", "#151515e6"],
  ["--color-background-500", "#15151580"],
  ["--color-background-600", "#1515151a"],
  ["--color-background-700", "#1515150d"],
  ["--color-background-800", "#15151599"],
  ["--color-background-inverse-solid", "#ffffffff"],
  ["--color-background-solid", "#151515ff"],
  ["--color-background-inverse-solid-light", "#efefefff"],
  ["--color-background-white-solid-constant", "#ffffffff"],
  ["--color-info-50", "#ebf8fcff"],
  ["--color-info-500", "#007bffff"],
  ["--color-hover-100", "#000000cc"],
  ["--color-hover-200", "#00000080"],
  ["--color-hover-300", "#0000001a"],
  ["--color-hover-400", "#0000000d"],
  ["--color-link-500", "#151515ff"],
  ["--color-link-600", "#000000cc"],
  ["--color-disabled-100", "#15151566"],
  ["--color-disabled-400", "#15151580"],
  ["--color-disabled-500", "#15151599"],
  ["--color-disabled-600", "#000000b3"],
  ["--color-chart-50", "#28ba8eff"],
  ["--color-chart-100", "#4fb2f9ff"],
  ["--color-chart-200", "#d74ff9ff"],
  ["--color-chart-300", "#f4a124ff"],
  ["--color-chart-400", "#c6c6c6ff"],
  ["--color-chart-500", "#ff59acff"],
  ["--color-chart-600", "#785dffff"],
  ["--color-brand-green-50", "#49f26433"],
  ["--color-brand-green-500", "#49f264ff"],
  ["--color-brand-pink-50", "#fc61ff33"],
  ["--color-brand-pink-500", "#fc61ffff"],
  ["--color-brand-purple-50", "#9772ff33"],
  ["--color-brand-purple-500", "#9772ffff"],
  ["--color-special-50", "#fdf1ffff"],
  ["--color-special-500", "#9c27b0ff"],
]);

const LEGACY_DARK_MAP = new Map([
  ["--color-primary-50", "#ffffff14"],
  ["--color-primary-100", "#ffffff4d"],
  ["--color-primary-200", "#ffffff99"],
  ["--color-primary-300", "#ffffffb3"],
  ["--color-primary-400", "#ffffffcc"],
  ["--color-primary-500", "#ffffffff"],
  ["--color-neutral-50", "#232323cc"],
  ["--color-neutral-100", "#ffffff14"],
  ["--color-neutral-200", "#ffffff33"],
  ["--color-neutral-250", "#ffffff66"],
  ["--color-neutral-300", "#ffffff99"],
  ["--color-neutral-350", "#ffffffcc"],
  ["--color-neutral-400", "#ffffffff"],
  ["--color-neutral-500", "#272727ff"],
  ["--color-body-100", "#ffffffff"],
  ["--color-body-200", "#ffffffcc"],
  ["--color-body-300", "#151515ff"],
  ["--color-body-400", "#151515ff"],
  ["--color-body-black-solid-constant", "#151515ff"],
  ["--color-body-white-solid-constant", "#ffffffff"],
  ["--color-success-50", "#224235ff"],
  ["--color-success-500", "#13ce7cff"],
  ["--color-warning-50", "#553820ff"],
  ["--color-warning-500", "#ffba30ff"],
  ["--color-error-50", "#5e1b1bff"],
  ["--color-error-500", "#ff7070ff"],
  ["--color-background-0", "#15151500"],
  ["--color-background-1", "#000000ff"],
  ["--color-background-150", "#363636cc"],
  ["--color-background-200", "#2c2c2ccc"],
  ["--color-background-250", "#15151599"],
  ["--color-background-350", "#15151533"],
  ["--color-background-400", "#ffffffe6"],
  ["--color-background-500", "#ffffff80"],
  ["--color-background-600", "#ffffff26"],
  ["--color-background-700", "#ffffff26"],
  ["--color-background-800", "#15151599"],
  ["--color-background-inverse-solid", "#151515ff"],
  ["--color-background-solid", "#ffffffff"],
  ["--color-background-inverse-solid-light", "#272727ff"],
  ["--color-background-white-solid-constant", "#ffffffff"],
  ["--color-info-50", "#003063ff"],
  ["--color-info-500", "#3f9cffff"],
  ["--color-hover-100", "#ffffffcc"],
  ["--color-hover-200", "#ffffff80"],
  ["--color-hover-300", "#ffffff1a"],
  ["--color-hover-400", "#ffffff0d"],
  ["--color-link-500", "#ffffffff"],
  ["--color-link-600", "#ffffffcc"],
  ["--color-disabled-100", "#ffffff66"],
  ["--color-disabled-400", "#ffffff80"],
  ["--color-disabled-500", "#ffffff99"],
  ["--color-disabled-600", "#ffffffb3"],
  ["--color-chart-50", "#28ba8eff"],
  ["--color-chart-100", "#4fb2f9ff"],
  ["--color-chart-200", "#d74ff9ff"],
  ["--color-chart-300", "#f4a124ff"],
  ["--color-chart-400", "#c6c6c6ff"],
  ["--color-chart-500", "#ff59acff"],
  ["--color-chart-600", "#785dffff"],
  ["--color-brand-green-50", "#49f26426"],
  ["--color-brand-green-500", "#49f264ff"],
  ["--color-brand-pink-50", "#fc61ff33"],
  ["--color-brand-pink-500", "#fc61ffff"],
  ["--color-brand-purple-50", "#9772ff33"],
  ["--color-brand-purple-500", "#9772ffff"],
  ["--color-special-50", "#4f1259ff"],
  ["--color-special-500", "#ed81ffff"],
]);

// ---------------------------------------------------------------------------
// LEGACY_TYPOGRAPHY_ALIASES
// Maps old typography class names to their equivalent new names.
// Emitted as duplicate @utility rules so existing components keep working.
// Remove once all consumers have migrated to the new names.
// ---------------------------------------------------------------------------
const LEGACY_TYPOGRAPHY_ALIASES = new Map([
  // body-1 → body-lg
  ["typography-body-1-regular", "typography-regular-body-lg"],
  ["typography-body-1-medium", null], // no direct equivalent — inline below
  ["typography-body-1-semibold", "typography-semibold-body-lg"],
  // body-2 → body-md
  ["typography-body-2-regular", "typography-regular-body-md"],
  ["typography-body-2-medium", null], // no direct equivalent — inline below
  ["typography-body-2-semibold", "typography-semibold-body-md"],
  // buttons
  ["typography-button-large", null], // inline below
  ["typography-button-small", null], // inline below
  // links
  ["typography-link-large", "typography-semibold-link-lg"],
  ["typography-link-small", "typography-semibold-link-md"],
  ["typography-link-x-small", "typography-semibold-link-xs"],
  // captions → body-sm
  ["typography-caption-regular", "typography-regular-body-sm"],
  ["typography-caption-semibold", "typography-semibold-body-sm"],
  // subtitle (no exact match)
  ["typography-subtitle", null], // inline below
  // headings
  ["typography-heading-4", "typography-bold-heading-xs"],
  ["typography-heading-3", "typography-bold-heading-sm"],
  ["typography-heading-32", "typography-bold-heading-md"],
  ["typography-heading-2", "typography-bold-heading-lg"],
  ["typography-heading-1", "typography-bold-heading-xl"],
  // display
  ["typography-hero", "typography-bold-display"],
  // badge
  ["typography-badge", "typography-semibold-badge"],
]);

// Old classes that have no direct mapping — hardcoded with original values.
// (medium weight, button styles, and subtitle don't exist in the new token set)
const LEGACY_TYPOGRAPHY_HARDCODED = `
@utility typography-body-1-medium {
  font-size: 16px;
  text-decoration: none;
  font-family: Inter;
  font-weight: 500;
  font-style: normal;
  font-stretch: normal;
  letter-spacing: 0px;
  line-height: 24px;
}

@utility typography-body-2-medium {
  font-size: 14px;
  text-decoration: none;
  font-family: Inter;
  font-weight: 500;
  font-style: normal;
  font-stretch: normal;
  letter-spacing: 0px;
  line-height: 18px;
}

@utility typography-button-large {
  font-size: 18px;
  text-decoration: none;
  font-family: Inter;
  font-weight: 600;
  font-style: normal;
  font-stretch: normal;
  letter-spacing: 0px;
  line-height: 24px;
}

@utility typography-button-small {
  font-size: 16px;
  text-decoration: none;
  font-family: Inter;
  font-weight: 600;
  font-style: normal;
  font-stretch: normal;
  letter-spacing: 0px;
  line-height: 22px;
}

@utility typography-subtitle {
  font-size: 18px;
  text-decoration: none;
  font-family: Inter;
  font-weight: 600;
  font-style: normal;
  font-stretch: normal;
  letter-spacing: 0px;
  line-height: 24px;
}
`;

// Legacy shadow values — added to :root so they override the @layer theme values.
const LEGACY_SHADOW_VARS = `
  --shadow-box-shadow-med: 4px #0000000d 0px 2px 0px;
  --shadow-box-shadow-small: 2px #0000000d 0px 2px 0px;
  --shadow-nav-box-shadow: 12px #0000000d 0px -2px 0px;
  --shadow-menu-blur-+-shadow: 12px #0000001a 0px 6px 0px;
  --shadow-floating-item: 40px #00000026 0px 12px 2px;
`;

// Build legacy typography aliases from the alias map + new generated classes.
const buildLegacyTypographyAliases = (newTypographyCSS) => {
  // Parse new classes into a map of className → body
  const classMap = new Map();
  for (const m of newTypographyCSS.matchAll(/@utility ([\w-]+) \{([^}]+)\}/g)) {
    classMap.set(m[1], m[2].trim());
  }

  let output = "\n/* Legacy typography aliases — remove after full migration */\n";
  for (const [oldName, newName] of LEGACY_TYPOGRAPHY_ALIASES) {
    if (newName && classMap.has(newName)) {
      output += `\n@utility ${oldName} {\n  ${classMap.get(newName).replace(/\n\s*/g, "\n  ")}\n}\n`;
    }
    // null entries are handled by LEGACY_TYPOGRAPHY_HARDCODED
  }
  output += LEGACY_TYPOGRAPHY_HARDCODED;
  return output;
};

// ---------------------------------------------------------------------------
// Keyframe animations & utility classes
// ---------------------------------------------------------------------------
const KEYFRAMES_AND_ANIMATIONS = `
@utility fv-skeleton-wave {
  position: relative;
  overflow: hidden;

  &::after {
    position: absolute;
    inset: 0;
    transform: translateX(-100%);
    will-change: transform;
    background-image: linear-gradient(
      90deg,
      transparent,
      color-mix(in srgb, var(--color-foreground-default) 8%, transparent),
      color-mix(in srgb, var(--color-foreground-default) 16%, transparent),
      transparent
    );
    animation: fv-skeleton-shimmer 1.5s ease-in-out infinite;
    content: "";
  }
}

@keyframes fv-skeleton-shimmer {
  100% {
    transform: translateX(100%);
  }
}

@keyframes accordion-expand {
  from {
    height: 0;
  }
  to {
    height: var(--radix-accordion-content-height);
  }
}

@keyframes accordion-collapse {
  from {
    height: var(--radix-accordion-content-height);
  }
  to {
    height: 0;
  }
}

@utility animate-accordion-expand {
  animation: accordion-expand 200ms ease-out;
}

@utility animate-accordion-collapse {
  animation: accordion-collapse 200ms ease-out;
}`;

const rawTokens = JSON.parse(fs.readFileSync(tokensPath, "utf-8"));

const { themeVars, lightVars, darkVars, primitivesVars } = getColorSections(rawTokens);
const effectVars = getEffectTokens(rawTokens.effect);
const typographyClasses = getTypographyClasses(rawTokens.typography);
const legacyTypography = buildLegacyTypographyAliases(typographyClasses);

const output = [
  `/* Consumers must provide their own Tailwind import: @import "tailwindcss"; */`,
  ``,
  `@variant dark (&:where(.dark, .dark *));`,
  ``,
  BASE_LAYER,
  ``,
  `@theme {`,
  effectVars,
  themeVars,
  `}`,
  ``,
  `:root {`,
  `  /* Stacking layer for portal-rendered overlays (Select, Tooltip).`,
  `     Override to sit above high-z containers such as MUI Dialog:`,
  `     :root { --fanvue-ui-portal-z-index: 1400; } */`,
  `  --fanvue-ui-portal-z-index: 50;`,
  ``,
  primitivesVars,
  ``,
  lightVars,
  `  /* Legacy shadow overrides (unlayered beats @layer theme) */`,
  LEGACY_SHADOW_VARS,
  `}`,
  ``,
  `.dark {`,
  darkVars,
  `}`,
  typographyClasses,
  legacyTypography,
  KEYFRAMES_AND_ANIMATIONS,
].join("\n");

fs.writeFileSync(outputPath, output, "utf-8");
console.log(`✓ theme.css written to ${outputPath}`);
