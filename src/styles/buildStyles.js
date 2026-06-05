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

// Number of leading segments in a token reference before the token name:
// namespace.mode.collection.<name...> e.g. {semantic.dark.color.background.primary}.
const REF_PREFIX_SEGMENTS = 3;

// Resolve a token reference (e.g. "{primitives.light.radius.rounded-xl}") to the CSS
// var() that buildStyles emits. The CSS namespace is derived from the *referenced
// collection*, not the referring token's $type — Figma exports some dimension tokens
// (e.g. modal padding/radius) with type:"color" while pointing at spacing/radius values.
const refToVar = (inner) => {
  // Figma exports half-steps with a European decimal ("0,5") but the primitive key is
  // "05". Normalise any "<digit>,<digit>" segment so the reference resolves.
  const parts = inner.replace(/(\d),(\d)/g, "$1$2").split(".");
  if (parts.length <= REF_PREFIX_SEGMENTS) {
    throw new Error(`token reference too shallow: {${inner}}`);
  }
  const [namespace, , collection] = parts;
  const name = parts.slice(REF_PREFIX_SEGMENTS).map(toKebab).join("-");

  if (namespace === "primitives") {
    if (collection === "color") return `var(--primitives-color-${name})`;
    if (collection === "spacing") return `var(--primitives-spacing-${name})`;
    if (collection === "radius") return `var(--radius-${name.replace(/^rounded-?/, "")})`;
  } else if (namespace === "semantic") {
    if (collection === "color") return `var(--color-${name})`;
    if (collection === "spacing") return `var(--spacing-${name})`;
    if (collection === "opacity") return `var(--opacity-${name})`;
  }
  throw new Error(`unresolvable token reference: {${inner}}`);
};

const resolveValue = (value) => {
  if (typeof value === "number") return `${value}px`;
  if (typeof value !== "string" || !value.startsWith("{")) return value;
  return refToVar(value.slice(1, -1));
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
    const resolved = resolveValue(value);
    themeVars += `  ${cssVar}: ${resolved};\n`;
    lightVars += `  ${cssVar}: ${resolved};\n`;

    const darkRaw = darkMap.get(path.join("."));
    const darkResolved = darkRaw !== undefined ? resolveValue(darkRaw) : resolved;
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

const RADIUS_ORDER = ["3xs", "2xs", "xs", "sm", "md", "lg", "xl", "2xl", "full"];

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
  const flat = flattenTokens(spacingTokens);
  let output = "";
  for (const { path, value } of flat) {
    const kebabPath = path.map(toKebab).join("-");
    output += `  --spacing-${kebabPath}: ${resolveValue(value)};\n`;
  }
  return output;
};

const getPrimitiveSpacingVars = (primSpacingTokens) => {
  let output = "";
  for (const [name, entry] of Object.entries(primSpacingTokens)) {
    if (SKIP_KEYS.has(name)) continue;
    output += `  --primitives-spacing-${toKebab(name)}: ${entry.value}px;\n`;
  }
  return output;
};

const getOpacityVars = (opacityTokens) => {
  if (!opacityTokens) return "";
  let output = "";
  for (const [name, entry] of Object.entries(opacityTokens)) {
    if (SKIP_KEYS.has(name)) continue;
    // Figma stores opacity as 0–100; CSS needs 0–1.
    const value = typeof entry.value === "number" ? entry.value / 100 : entry.value;
    output += `  --opacity-${toKebab(name)}: ${value};\n`;
  }
  return output;
};

const getEffectTokens = (effectTokens) => {
  let output = "";

  const shadowValue = (s) => `${s.offsetX}px ${s.offsetY}px ${s.radius}px ${s.spread}px ${s.color}`;

  const processShadowGroup = (group, prefix) => {
    for (const [name, entry] of Object.entries(group)) {
      if (SKIP_KEYS.has(name)) continue;
      if (entry === null || typeof entry !== "object") continue;
      const cssName = `--shadow-${prefix}${toKebab(name)}`;

      // Single shadow: { value: {...} }.
      if ("value" in entry) {
        if (entry.value?.shadowType !== "dropShadow") continue;
        output += `  ${cssName}: ${shadowValue(entry.value)};\n`;
        continue;
      }

      // Multi-layer shadow: numeric keys "0","1","2",… each a dropShadow layer
      // (a layer may be null). Emit every dropShadow layer, not just the first two.
      const layers = Object.keys(entry)
        .filter((k) => /^\d+$/.test(k))
        .sort((a, b) => Number(a) - Number(b))
        .map((k) => entry[k])
        .filter((layer) => layer?.value?.shadowType === "dropShadow")
        .map((layer) => shadowValue(layer.value));
      if (layers.length) output += `  ${cssName}: ${layers.join(", ")};\n`;
    }
  };

  if (effectTokens.shadow) processShadowGroup(effectTokens.shadow, "");
  if (effectTokens.blurShadow) processShadowGroup(effectTokens.blurShadow, "blur-");
  if (effectTokens.aiButtonGlow)
    processShadowGroup({ aiButtonGlow: effectTokens.aiButtonGlow }, "");

  // Focus ring colour is mode-aware via --fv-focus-ring-color (set in :root and .dark):
  // violet on light backgrounds, white on dark ones, so the ring stays visible either way.
  output += `  --shadow-focus-ring: 0 0 0 2px var(--color-background-primary), 0 0 0 4px var(--fv-focus-ring-color);\n`;

  return output;
};

// The build emits a single primitive colour set (from primitives.light.color) and the
// .dark block reuses it via the same --primitives-color-* vars. That is only sound while
// light and dark primitives share values. Assert it, so a future divergent dark primitive
// fails the build loudly instead of silently rendering the wrong colour in dark mode.
const assertPrimitiveParity = (rawTokens) => {
  const light = new Map(
    flattenTokens(rawTokens.primitives.light.color).map((t) => [t.path.join("."), t.value]),
  );
  const dark = new Map(
    flattenTokens(rawTokens.primitives.dark.color).map((t) => [t.path.join("."), t.value]),
  );
  // Only primitives actually referenced by a dark semantic token matter: those resolve to
  // the shared (light) --primitives-color-* var, so a divergent dark value would be lost.
  // Divergent-but-unreferenced primitives are harmless and intentionally ignored.
  const diverged = new Set();
  for (const { value } of flattenTokens(rawTokens.semantic.dark.color)) {
    if (typeof value !== "string" || !value.startsWith("{primitives.dark.color.")) continue;
    const key = value.slice(1, -1).split(".").slice(REF_PREFIX_SEGMENTS).join(".");
    if (light.has(key) && dark.has(key) && light.get(key) !== dark.get(key)) diverged.add(key);
  }
  if (diverged.size) {
    throw new Error(
      `dark semantic tokens reference primitives whose dark value differs from light ` +
        `(${diverged.size}): ${[...diverged].join(", ")}. ` +
        `Make refToVar mode-aware and emit dark primitives inside the .dark block.`,
    );
  }
};

// Guard against dangling references: every var(--x) used in the output must also be
// defined in the output. Catches mis-namespaced tokens (e.g. a colour token pointing at a
// spacing value) that would otherwise resolve to nothing at runtime.
const assertNoDanglingVars = (css) => {
  const defined = new Set([...css.matchAll(/^\s*(--[\w-]+)\s*:/gm)].map((m) => m[1]));
  const missing = new Set(
    [...css.matchAll(/var\((--[\w-]+)/g)].map((m) => m[1]).filter((name) => !defined.has(name)),
  );
  if (missing.size) {
    throw new Error(`theme.css references undefined variables: ${[...missing].join(", ")}`);
  }
};

/* Hand-written styles (base layer, utilities, keyframes, autofill overrides)
 * live in base.css and are imported into the generated theme.css. */

const buildThemeCss = (rawTokens) => {
  const { themeVars, lightVars, darkVars, primitivesVars } = getColorSections(rawTokens);
  const effectVars = getEffectTokens(rawTokens.effect);
  const radiusVars = getRadiusVars(rawTokens.primitives.light.radius);
  const primitiveSpacingVars = getPrimitiveSpacingVars(rawTokens.primitives.light.spacing);
  const spacingVars = getSpacingVars(rawTokens.semantic.light.spacing);
  const opacityVars = getOpacityVars(rawTokens.semantic.light.opacity);
  const typographyClasses = getTypographyClasses(rawTokens.typography);

  const output = [
    `/* AUTO-GENERATED — do not edit. Run \`node src/styles/buildStyles.js\` to regenerate. */`,
    ``,
    `@import "./base.css";`,
    ``,
    `@variant dark (&:where(.dark, .dark *));`,
    `@custom-variant infloww (&:is([data-infloww] *));`,
    ``,
    `@theme {`,
    `  --breakpoint-*: initial;`,
    `  --breakpoint-sm: 850px;`,
    `  --breakpoint-md: 1024px;`,
    `  --breakpoint-inflowwmd: 1223px;`,
    `  --breakpoint-lg: 1280px;`,
    `}`,
    ``,
    `@theme {`,
    effectVars.trimEnd(),
    radiusVars.trimEnd(),
    ``,
    themeVars.trimEnd(),
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
    primitiveSpacingVars.trimEnd(),
    spacingVars.trimEnd(),
    ``,
    opacityVars.trimEnd(),
    ``,
    primitivesVars.trimEnd(),
    ``,
    `  /* Light-mode semantic tokens must also live in :root because @theme`,
    `     cannot resolve var() references to :root primitives at build time. */`,
    lightVars.trimEnd(),
    ``,
    `  /* Focus-ring colour, consumed by --shadow-focus-ring. Violet on light`,
    `     backgrounds; overridden to white in .dark so the ring stays visible. */`,
    `  --fv-focus-ring-color: var(--color-interaction-focus);`,
    `}`,
    ``,
    `.dark {`,
    darkVars.trimEnd(),
    `  --fv-focus-ring-color: var(--color-content-always-white);`,
    `}`,
    typographyClasses,
  ].join("\n");

  assertPrimitiveParity(rawTokens);
  assertNoDanglingVars(output);

  return output;
};

// Pure helpers are exported for unit testing; the file write only runs when this module
// is executed directly (node src/styles/buildStyles.js), not when imported.
export {
  refToVar,
  resolveValue,
  getEffectTokens,
  assertPrimitiveParity,
  assertNoDanglingVars,
  buildThemeCss,
};

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const rawTokens = JSON.parse(fs.readFileSync(tokensPath, "utf-8"));
  fs.writeFileSync(outputPath, buildThemeCss(rawTokens), "utf-8");
  console.log(`✓ theme.css written to ${outputPath}`);
}
