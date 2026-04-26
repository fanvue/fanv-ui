#!/usr/bin/env node
/**
 * Rewrites the icon exports block in src/index.ts so it matches the set of
 * .tsx files under src/components/Icons/ plus the prop-based icons listed in
 * scripts/icons.manifest.json. Sort order matches Biome's organizeImports.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..");
const ICONS_DIR = path.join(REPO_ROOT, "src/components/Icons");
const INDEX = path.join(REPO_ROOT, "src/index.ts");
const MANIFEST_PATH = path.join(__dirname, "icons.manifest.json");

const START = `export { IconButton } from "./components/IconButton/IconButton";\n`;
const END_PREFIX = "export type {\n  InfoBoxAction";

const manifest = fs.existsSync(MANIFEST_PATH)
  ? JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf8"))
  : { icons: [] };
const propBasedNames = new Set(manifest.icons.map((i) => i.name));

const files = fs
  .readdirSync(ICONS_DIR)
  .filter((f) => f.endsWith(".tsx") && !f.endsWith(".test.tsx"))
  .map((f) => f.replace(/\.tsx$/, ""))
  .filter((n) => n !== "BaseIcon")
  // Biome's organizeImports uses case-insensitive ordering (add, AI, Ai2),
  // falling back to case-sensitive when the lowercase forms match.
  .sort((a, b) => {
    const lo = a.toLowerCase().localeCompare(b.toLowerCase());
    return lo !== 0 ? lo : a.localeCompare(b);
  });

const componentExports = files
  .map((f) => `export { ${f} } from "./components/Icons/${f}";`)
  .join("\n");

const propTypeExports = files
  .filter((f) => propBasedNames.has(f))
  .map((f) => `export type { ${f}Props } from "./components/Icons/${f}";`)
  .join("\n");

const sharedTypeExport = `export type {
  BaseIconProps,
  IconPath,
  IconProps,
  IconSize,
  IconVariants,
} from "./components/Icons/types";\n`;

const block = `${componentExports}\n${propTypeExports}\n${sharedTypeExport}`;

const source = fs.readFileSync(INDEX, "utf8");
const startIdx = source.indexOf(START);
if (startIdx === -1) throw new Error("Could not find icons block start marker");
const afterStart = startIdx + START.length;
const endIdx = source.indexOf(END_PREFIX, afterStart);
if (endIdx === -1) throw new Error("Could not find icons block end marker");

const updated = `${source.slice(0, afterStart)}${block}\n${source.slice(endIdx)}`;
fs.writeFileSync(INDEX, updated);

const { spawnSync } = await import("node:child_process");
const result = spawnSync("pnpm", ["biome", "check", "src/index.ts", "--write"], {
  cwd: REPO_ROOT,
  stdio: "inherit",
});
if (result.status !== 0 && result.status !== 1) {
  // status 1 is biome's "fixed" status; only non-0/1 means real failure
  console.error("biome format pass failed with status", result.status);
  process.exit(result.status ?? 1);
}
console.log(
  `Rewrote icon exports block: ${files.length} icons, ${propTypeExports ? propTypeExports.split("\n").length : 0} prop types`,
);
