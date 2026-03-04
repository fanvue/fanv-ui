import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

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

  let themeVars = "";
  let lightVars = "";
  let darkVars = "";

  for (const { path, value } of semanticLightTokens) {
    const cssVar = semanticVarName(path);
    themeVars += `  ${cssVar}: var(${cssVar});\n`;

    const lightResolved = resolveRef(value);
    lightVars += `  ${cssVar}: ${lightResolved};\n`;

    const darkRaw = darkMap.get(path.join("."));
    const darkResolved = darkRaw !== undefined ? resolveRef(darkRaw) : lightResolved;
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

const rawTokens = JSON.parse(fs.readFileSync(tokensPath, "utf-8"));

const { themeVars, lightVars, darkVars, primitivesVars } = getColorSections(rawTokens);
const effectVars = getEffectTokens(rawTokens.effect);
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
  `}`,
  ``,
  `.dark {`,
  darkVars,
  `}`,
  typographyClasses,
  ``,
].join("\n");

fs.writeFileSync(outputPath, output, "utf-8");
console.log(`✓ theme.css written to ${outputPath}`);
