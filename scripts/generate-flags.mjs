#!/usr/bin/env node
/**
 * Generates the country flag artwork behind `<CountryFlag />` into
 * src/components/CountryFlag/flagShapes.ts.
 *
 * Source is the `circle-flags` npm package (MIT), pinned below. That is the
 * artwork the Figma `Iconography / Flag` component set is drawn from — the
 * palette and geometry match exactly (e.g. the Netherlands stripes split at
 * 167/512 = 32.61%, which is what the design reports).
 *
 * Every flag in that package has the same shape:
 *
 *   <svg viewBox="0 0 512 512">
 *     <mask id="a"><circle cx="256" cy="256" r="256" fill="#fff"/></mask>
 *     <g mask="url(#a)"> ...path|circle|rect|ellipse... </g>
 *   </svg>
 *
 * The wrapper and mask are supplied by the component (which gives the mask a
 * unique id per instance, so several flags can share a page), so this script
 * only extracts the drawables inside the <g>. Verified across all 265 files:
 * no gradients, no <defs>, no <use>, and no ids inside the group — so nothing
 * in the extracted markup can collide between instances.
 *
 * Only ISO 3166-1 alpha-2 style two-letter codes are taken. The package also
 * ships subdivision, language and three-letter flags we have no use for.
 *
 * Re-runs overwrite the generated file.
 */

import { execFileSync, spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..");
const OUT_FILE = path.join(REPO_ROOT, "src/components/CountryFlag/flagShapes.ts");

const PACKAGE = "circle-flags";
const VERSION = "2.8.3";
const TARBALL = `https://registry.npmjs.org/${PACKAGE}/-/${PACKAGE}-${VERSION}.tgz`;

/** The wrapper every source file uses. Group 1 is the drawable markup. */
const WRAPPER =
  /^<svg xmlns="http:\/\/www\.w3\.org\/2000\/svg" width="512" height="512" viewBox="0 0 512 512"><mask id="a"><circle cx="256" cy="256" r="256" fill="#fff"\/><\/mask><g mask="url\(#a\)">([\s\S]*)<\/g><\/svg>$/;

const SHAPE = /<(path|circle|rect|ellipse)\s([^>]*?)\s*\/?>/g;
const ATTR = /([a-zA-Z-]+)="([^"]*)"/g;

/** Attributes we carry over, per element. Anything else is a generator bug. */
const ALLOWED = {
  path: new Set(["fill", "d"]),
  circle: new Set(["fill", "cx", "cy", "r"]),
  rect: new Set(["fill", "x", "y", "width", "height", "rx", "ry"]),
  ellipse: new Set(["fill", "cx", "cy", "rx", "ry"]),
};

async function download() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "fanvue-flags-"));
  const tgz = path.join(dir, "package.tgz");
  const res = await fetch(TARBALL);
  if (!res.ok) throw new Error(`Failed to download ${TARBALL}: ${res.status}`);
  fs.writeFileSync(tgz, Buffer.from(await res.arrayBuffer()));
  execFileSync("tar", ["-xzf", tgz, "-C", dir]);
  return { dir, flagsDir: path.join(dir, "package/flags") };
}

function parseFlag(file, source) {
  const wrapped = source.trim().match(WRAPPER);
  if (!wrapped) throw new Error(`${file}: unexpected SVG wrapper`);

  const shapes = [];
  for (const [, tag, rawAttrs] of wrapped[1].matchAll(SHAPE)) {
    const attrs = {};
    for (const [, name, value] of rawAttrs.matchAll(ATTR)) {
      if (!ALLOWED[tag].has(name)) throw new Error(`${file}: unhandled <${tag} ${name}>`);
      attrs[name] = value;
    }
    shapes.push({ tag, attrs });
  }
  if (shapes.length === 0) throw new Error(`${file}: no drawable shapes`);
  return shapes;
}

/** `{ tag: "path", fill: "#eee", d: "..." }` — one line per shape. */
function serialiseShape({ tag, attrs }) {
  const entries = [`tag: "${tag}"`];
  for (const [name, value] of Object.entries(attrs)) {
    entries.push(`${name}: ${JSON.stringify(value)}`);
  }
  return `    { ${entries.join(", ")} },`;
}

const { dir, flagsDir } = await download();
try {
  const files = fs
    .readdirSync(flagsDir)
    .filter((f) => /^[a-z]{2}\.svg$/.test(f))
    .sort();

  const blocks = files.map((file) => {
    const code = path.basename(file, ".svg");
    const shapes = parseFlag(file, fs.readFileSync(path.join(flagsDir, file), "utf8"));
    return `  ${code}: [\n${shapes.map(serialiseShape).join("\n")}\n  ],`;
  });

  const contents = `// AUTO-GENERATED - DO NOT MODIFY
// Run \`pnpm flags:generate\` to regenerate from ${PACKAGE}@${VERSION} (MIT).

/** One drawable inside a flag. Coordinates are in the shared 512x512 viewBox. */
export type FlagShape =
  | { tag: "path"; fill: string; d: string }
  | { tag: "circle"; fill: string; cx: string; cy: string; r: string }
  | {
      tag: "rect";
      fill: string;
      x?: string;
      y?: string;
      width: string;
      height: string;
      rx?: string;
      ry?: string;
    }
  | { tag: "ellipse"; fill: string; cx: string; cy: string; rx: string; ry: string };

/**
 * Every code {@link FLAG_SHAPES} has artwork for. Mostly ISO 3166-1 alpha-2,
 * plus the codes the source ships alongside them (\`eu\`, \`un\`, \`xk\`, \`xx\`, ...).
 */
export type CountryFlagCode =
${files.map((file) => `  | "${path.basename(file, ".svg")}"`).join("\n")};

/**
 * Flag artwork by lower-case code, drawn to be clipped by a circle filling the
 * 512x512 viewBox.
 *
 * Annotated rather than inferred: \`as const\` would put every path string into
 * the emitted declaration, which costs consumers ~220kB of .d.ts to typecheck.
 */
export const FLAG_SHAPES: Record<CountryFlagCode, readonly FlagShape[]> = {
${blocks.join("\n")}
};
`;

  fs.mkdirSync(path.dirname(OUT_FILE), { recursive: true });
  fs.writeFileSync(OUT_FILE, contents);
  console.log(`Wrote ${files.length} flags to ${path.relative(REPO_ROOT, OUT_FILE)}`);

  // Apply Biome's canonical formatting so re-runs stay lint-clean.
  const formatted = spawnSync("pnpm", ["biome", "check", OUT_FILE, "--write"], {
    cwd: REPO_ROOT,
    stdio: "inherit",
  });
  if (formatted.status !== 0 && formatted.status !== 1) {
    console.error("biome format pass failed with status", formatted.status);
    process.exit(formatted.status ?? 1);
  }
} finally {
  fs.rmSync(dir, { recursive: true, force: true });
}
