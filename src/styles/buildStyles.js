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
    .replace(/([a-zA-Z])(\d)/g, "$1-$2")
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
    const cssVar = `--primitives-color-${parts.slice(3).map(toKebab).join("-")}`;
    return `var(${cssVar})`;
  }

  if (inner.startsWith("semantic.")) {
    const parts = inner.split(".");
    const semanticParts = parts.slice(3);
    return `var(${semanticVarName(semanticParts)})`;
  }

  throw new Error(`resolveRef: unresolvable token reference: ${value}`);
};

const getColorSections = (rawTokens) => {
  const semanticLightTokens = flattenTokens(rawTokens.semantic.light.color);
  const semanticDarkTokens = flattenTokens(rawTokens.semantic.dark.color);

  const darkMap = new Map(semanticDarkTokens.map(({ path, value }) => [path.join("."), value]));

  let themeVars = "";
  let lightVars = "";
  let darkVars = "";

  for (const { path, value } of semanticLightTokens) {
    const cssVar = semanticVarName(path);
    const resolved = resolveRef(value);
    themeVars += `  ${cssVar}: ${resolved};\n`;
    lightVars += `  ${cssVar}: ${resolved};\n`;

    const darkRaw = darkMap.get(path.join("."));
    const darkResolved = darkRaw !== undefined ? resolveRef(darkRaw) : resolved;
    darkVars += `  ${cssVar}: ${darkResolved};\n`;
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

const RADIUS_ORDER = ["xs", "sm", "md", "lg", "xl", "2xl", "full"];

const getRadiusVars = (radiusTokens) => {
  const entries = Object.entries(radiusTokens)
    .filter(([name]) => !SKIP_KEYS.has(name))
    .map(([name, entry]) => {
      const kebab = toKebab(name.replace(/^rounded/, ""));
      return { kebab, value: entry.value };
    })
    .sort((a, b) => RADIUS_ORDER.indexOf(a.kebab) - RADIUS_ORDER.indexOf(b.kebab));

  let output = "";
  for (const { kebab, value } of entries) {
    output += `  --radius-${kebab}: ${value}px;\n`;
  }
  return output;
};

const getSpacingVars = (spacingTokens) => {
  let output = "";
  for (const [name, entry] of Object.entries(spacingTokens)) {
    if (SKIP_KEYS.has(name)) continue;
    output += `  --spacing-${toKebab(name)}: ${entry.value}px;\n`;
  }
  return output;
};

const getEffectTokens = (effectTokens) => {
  let output = "";

  const shadowValue = (s) => `${s.offsetX}px ${s.offsetY}px ${s.radius}px ${s.spread}px ${s.color}`;

  const processShadowGroup = (group, prefix) => {
    for (const [name, entry] of Object.entries(group)) {
      if (SKIP_KEYS.has(name)) continue;
      const cssName = `--shadow-${prefix}${toKebab(name)}`;
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
  };

  if (effectTokens.shadow) processShadowGroup(effectTokens.shadow, "");
  if (effectTokens.blurShadow) processShadowGroup(effectTokens.blurShadow, "blur-");

  output += `  --shadow-focus-ring: 0 0 0 2px var(--color-bg-primary), 0 0 0 4px var(--color-interaction-focus);\n`;

  return output;
};

const BASE_LAYER = `@layer base {
  html {
    touch-action: manipulation;
  }

  body {
    -webkit-font-smoothing: antialiased;
    scrollbar-gutter: stable;
  }

  input:-webkit-autofill,
  input:-webkit-autofill:hover,
  input:-webkit-autofill:focus,
  textarea:-webkit-autofill,
  textarea:-webkit-autofill:hover,
  textarea:-webkit-autofill:focus {
    -webkit-text-fill-color: var(--color-content-primary);
    transition: background-color 9999s ease-in-out 0s;
  }
}`;

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
      color-mix(in srgb, var(--color-content-primary) 8%, transparent),
      color-mix(in srgb, var(--color-content-primary) 16%, transparent),
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
const radiusVars = getRadiusVars(rawTokens.primitives.light.radius);
const spacingVars = getSpacingVars(rawTokens.semantic.light.spacing);
const typographyClasses = getTypographyClasses(rawTokens.typography);

const output = [
  `/* Consumers must provide their own Tailwind import: @import "tailwindcss"; */`,
  ``,
  `@variant dark (&:where(.dark, .dark *));`,
  ``,
  BASE_LAYER,
  ``,
  `@theme {`,
  effectVars,
  radiusVars,
  ``,
  themeVars,
  `}`,
  ``,
  `:root {`,
  `  /* Stacking layer for portal-rendered overlays (Select, Tooltip).`,
  `     Override to sit above high-z containers such as MUI Dialog:`,
  `     :root { --fanvue-ui-portal-z-index: 1400; } */`,
  `  --fanvue-ui-portal-z-index: 50;`,
  ``,
  `  /* Spacing tokens live in :root (not @theme) to avoid overriding`,
  `     Tailwind v4's default --spacing-* scale used by p-*, m-*, gap-*, etc. */`,
  spacingVars,
  ``,
  primitivesVars,
  ``,
  `  /* Light-mode semantic tokens must also live in :root because @theme`,
  `     cannot resolve var() references to :root primitives at build time. */`,
  lightVars,
  `}`,
  ``,
  `.dark {`,
  darkVars,
  `}`,
  typographyClasses,
  KEYFRAMES_AND_ANIMATIONS,
].join("\n");

fs.writeFileSync(outputPath, output, "utf-8");
console.log(`✓ theme.css written to ${outputPath}`);
