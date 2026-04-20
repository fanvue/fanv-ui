#!/usr/bin/env node
/**
 * Reads raw Figma SVGs from .icon-migration/raw-svgs/{IconName}/{size}-{fill}.svg,
 * optimizes each with SVGO, extracts drawable path data (stripping Figma's
 * mask/clipPath/defs wrappers), and emits prop-based React icon components
 * into src/components/Icons/.
 *
 * Also writes scripts/icons.manifest.json — the single source of truth that
 * other generators (tests, stories, barrel) consume to know which icons
 * follow the prop-based API.
 *
 * Re-runs overwrite generated files.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { optimize } from "svgo";
import svgoConfig from "./svgo.config.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..");
const RAW_DIR = path.join(REPO_ROOT, ".icon-migration/raw-svgs");
const OUT_DIR = path.join(REPO_ROOT, "src/components/Icons");
const MANIFEST_PATH = path.join(__dirname, "icons.manifest.json");

const NAME_OVERRIDES = {
  Ai: "AI",
  "Ai 2": "AI2",
};

function toPascalCase(name) {
  return name
    .split(/[\s_-]+/)
    .filter(Boolean)
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join("");
}

function toComponentName(iconName) {
  const base = NAME_OVERRIDES[iconName] ?? toPascalCase(iconName);
  return `${base}Icon`;
}

/**
 * Extract drawable <path> elements from an SVG, skipping anything inside
 * <defs>, <mask>, <clipPath> (Figma wraps every export in a luminance mask
 * + clip to the viewBox rect — neither contributes to the drawing).
 *
 * Returns objects of shape `{ d, sw?, eo? }`:
 * - `sw` set → stroked outline (Figma emits these for center-aligned strokes;
 *   svg_simplify_stroke=true only flattens inside/outside alignments).
 * - `eo` set → fill-rule=evenodd compound path (used to combine a foreground
 *   shape with white-fill "knockout" subpaths to produce transparent cutouts).
 * - Otherwise → plain fill.
 */
function extractDrawablePaths(svg) {
  const stripped = svg
    .replace(/<defs\b[^>]*>[\s\S]*?<\/defs>/gi, "")
    .replace(/<mask\b[^>]*>[\s\S]*?<\/mask>/gi, "")
    .replace(/<clipPath\b[^>]*>[\s\S]*?<\/clipPath>/gi, "");

  const seen = new Set();
  const strokes = [];
  const fills = [];
  for (const m of stripped.matchAll(/<path\b([^>]*?)\bd="([^"]+)"([^>]*?)\/?\s*>/gi)) {
    const tag = m[1] + m[3];
    const d = m[2];
    // Figma's REST exporter occasionally emits the same path twice as siblings
    // (a stroke-as-fill artefact for inside/outside-aligned strokes). Monochrome
    // icons never legitimately overlap identical fills, so drop exact duplicates.
    if (seen.has(d)) continue;
    seen.add(d);
    const strokeMatch = tag.match(/\bstroke="(?!none)([^"]+)"/i);
    const widthMatch = tag.match(/\bstroke-width="([^"]+)"/i);
    if (strokeMatch && widthMatch) {
      strokes.push({ d, sw: Number(widthMatch[1]) });
      continue;
    }
    const fillMatch = tag.match(/\bfill="([^"]+)"/i);
    const fill = fillMatch?.[1].toLowerCase();
    const knockout = fill === "white" || fill === "#fff" || fill === "#ffffff";
    fills.push({ d, knockout });
  }

  const result = [];
  if (fills.some((f) => f.knockout)) {
    // Merge into one compound path so white subpaths become transparent cutouts
    // under fill-rule=evenodd (otherwise white paints over currentColor).
    const merged = fills.map((f) => f.d).join(" ");
    result.push({ d: merged, eo: true });
  } else {
    for (const f of fills) result.push({ d: f.d });
  }
  for (const s of strokes) result.push(s);
  return result;
}

function optimizeSvg(raw) {
  const { data, error } = optimize(raw, svgoConfig);
  if (error) throw new Error(error);
  return data;
}

function loadIconVariants(iconName) {
  const dir = path.join(RAW_DIR, iconName);
  if (!fs.existsSync(dir)) {
    throw new Error(`No raw svgs dir for ${iconName} at ${dir}`);
  }
  const variants = {};
  for (const file of fs.readdirSync(dir)) {
    const match = file.match(/^(16|24|32)-(outlined|filled)\.svg$/);
    if (!match) continue;
    const size = Number(match[1]);
    const fill = match[2];
    const raw = fs.readFileSync(path.join(dir, file), "utf8");
    const optimized = optimizeSvg(raw);
    const paths = extractDrawablePaths(optimized);
    if (paths.length === 0) {
      console.warn(`  warn: ${iconName}/${file} produced zero drawable paths`);
    }
    variants[`${size}-${fill}`] = paths;
  }
  return variants;
}

function formatPath(p) {
  const extras = [];
  if (p.sw !== undefined) extras.push(`sw: ${p.sw}`);
  if (p.eo) extras.push("eo: true");
  const tail = extras.length ? `, ${extras.join(", ")}` : "";
  return `      { d: ${JSON.stringify(p.d)}${tail} },`;
}

function renderComponent(iconName, variants) {
  const componentName = toComponentName(iconName);
  const sizes = [...new Set(Object.keys(variants).map((k) => Number(k.split("-")[0])))].sort(
    (a, b) => a - b,
  );

  if (sizes.length === 0) {
    throw new Error(`No variants for ${iconName}`);
  }

  let hasFilled = false;
  const variantBody = sizes
    .map((size) => {
      const outlined = variants[`${size}-outlined`];
      const filled = variants[`${size}-filled`];
      if (!outlined) return null;
      const filledIsDistinct = filled && JSON.stringify(filled) !== JSON.stringify(outlined);
      if (filledIsDistinct) hasFilled = true;
      const lines = [`  ${size}: {`];
      lines.push(`    outlined: [`);
      lines.push(outlined.map(formatPath).join("\n"));
      lines.push(`    ],`);
      if (filledIsDistinct) {
        lines.push(`    filled: [`);
        lines.push(filled.map(formatPath).join("\n"));
        lines.push(`    ],`);
      }
      lines.push(`  },`);
      return lines.join("\n");
    })
    .filter(Boolean)
    .join("\n");

  const body = `import * as React from "react";
import { BaseIcon } from "./BaseIcon";
import type { BaseIconProps, IconVariants } from "./types";

const VARIANTS: IconVariants = {
${variantBody}
};

/** Props for {@link ${componentName}}. See {@link BaseIconProps} for the shared shape. */
export type ${componentName}Props = BaseIconProps;

/**
 * ${iconName} icon. Renders at sizes 16, 24, or 32 px${hasFilled ? " with outlined and filled variants" : ""}.
 *
 * @example
 * \`\`\`tsx
 * <${componentName} size={24}${hasFilled ? " filled" : ""} />
 * \`\`\`
 */
export const ${componentName} = React.forwardRef<SVGSVGElement, ${componentName}Props>(
  (props, ref) => <BaseIcon ref={ref} variants={VARIANTS} {...props} />,
);

${componentName}.displayName = "${componentName}";
`;

  return { source: body, hasFilled, sizes };
}

async function main() {
  if (!fs.existsSync(RAW_DIR)) {
    console.error(`Raw svgs dir does not exist: ${RAW_DIR}`);
    process.exit(1);
  }

  const iconDirs = fs
    .readdirSync(RAW_DIR)
    .filter((f) => fs.statSync(path.join(RAW_DIR, f)).isDirectory());

  console.log(`Found ${iconDirs.length} icon directories`);

  const manifestEntries = [];
  let written = 0;
  for (const iconName of iconDirs) {
    const variants = loadIconVariants(iconName);
    const componentName = toComponentName(iconName);
    const { source, hasFilled, sizes } = renderComponent(iconName, variants);
    const outPath = path.join(OUT_DIR, `${componentName}.tsx`);
    fs.writeFileSync(outPath, source);
    // On case-insensitive filesystems (macOS default), writing to `AI2Icon.tsx`
    // when `Ai2Icon.tsx` exists keeps the lowercase filename. Force-rename via
    // a tmp path to normalize casing. try/finally so a partial failure leaves
    // the file at a known location instead of stranding `*.__casefix__`.
    const tmpPath = `${outPath}.__casefix__`;
    try {
      fs.renameSync(outPath, tmpPath);
      fs.renameSync(tmpPath, outPath);
    } catch (err) {
      if (fs.existsSync(tmpPath)) {
        try {
          fs.renameSync(tmpPath, outPath);
        } catch {
          /* swallow — original error is more relevant */
        }
      }
      throw err;
    }
    manifestEntries.push({ name: componentName, sizes, hasFilled });
    written++;
  }

  manifestEntries.sort((a, b) => a.name.localeCompare(b.name));
  fs.writeFileSync(MANIFEST_PATH, `${JSON.stringify({ icons: manifestEntries }, null, 2)}\n`);

  console.log(`Wrote ${written} component files to ${OUT_DIR}`);
  console.log(`Wrote manifest to ${MANIFEST_PATH}`);

  // Apply Biome's canonical formatting so re-runs stay lint-clean.
  const { spawnSync } = await import("node:child_process");
  const result = spawnSync("pnpm", ["biome", "check", OUT_DIR, MANIFEST_PATH, "--write"], {
    cwd: REPO_ROOT,
    stdio: "inherit",
  });
  if (result.status !== 0 && result.status !== 1) {
    console.error("biome format pass failed with status", result.status);
    process.exit(result.status ?? 1);
  }
}

await main();
