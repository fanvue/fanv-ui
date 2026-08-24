#!/usr/bin/env node
/**
 * Guards what gets published to npm: runs `npm pack --dry-run --json` and fails
 * if any packed path falls outside the allowlist. Catches the case where the
 * `files` field in package.json drifts and sources, fixtures or local config
 * start shipping to consumers.
 *
 * Used by .github/workflows/ci.yml in the Build job, after `pnpm build` so that
 * dist/ exists — an unbuilt tree would otherwise pack a near-empty package and
 * pass trivially.
 *
 * pnpm 9's `pnpm pack` has no reliable `--dry-run --json` output, so this shells
 * out to npm, which is always available on the CI runners.
 *
 * Usage:
 *   node scripts/check-pack-contents.mjs              # check the real package
 *   node scripts/check-pack-contents.mjs --self-test  # exercise the allowlist rules
 */

import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..");
const DIST_DIR = path.join(REPO_ROOT, "dist");

/** Directories whose entire contents may ship. */
const ALLOWED_DIRS = ["dist/"];

/**
 * Exact paths that may ship. npm adds `package.json`, `README.md` and `LICENSE`
 * automatically whatever `files` says; `THIRD-PARTY-NOTICES.md` is opt-in via
 * `files`. `CHANGELOG.md` is allowed but not currently packed — npm no longer
 * force-includes it, so it only appears if someone adds it to `files`.
 */
const ALLOWED_FILES = new Set([
  "package.json",
  "README.md",
  "CHANGELOG.md",
  "THIRD-PARTY-NOTICES.md",
]);

/** LICENSE / LICENCE, with or without an extension (LICENSE.md, LICENSE.txt). */
const LICENSE_PATTERN = /^LICEN[SC]E(\.[\w-]+)?$/;

const ALLOWLIST_SUMMARY =
  "dist/**, package.json, README.md, LICENSE*, CHANGELOG.md, THIRD-PARTY-NOTICES.md";

/** True when `filePath` (a pack-relative POSIX path) is allowed to ship. */
export function isAllowed(filePath) {
  if (ALLOWED_DIRS.some((dir) => filePath.startsWith(dir))) return true;
  if (ALLOWED_FILES.has(filePath)) return true;
  return LICENSE_PATTERN.test(filePath);
}

/**
 * npm sometimes prefixes the JSON payload with progress or notice lines, so
 * slice out the array rather than parsing stdout wholesale.
 */
function parsePackJson(stdout) {
  const start = stdout.indexOf("[");
  const end = stdout.lastIndexOf("]");
  if (start === -1 || end === -1 || end < start) {
    throw new Error(`no JSON array found in npm pack output:\n${stdout.trim()}`);
  }
  return JSON.parse(stdout.slice(start, end + 1));
}

/** Runs `npm pack --dry-run --json` and returns the packed paths. */
function readPackedFiles() {
  const result = spawnSync("npm", ["pack", "--dry-run", "--json"], {
    cwd: REPO_ROOT,
    encoding: "utf8",
    // A full dist/ listing is thousands of entries; give the pipe plenty of room.
    maxBuffer: 64 * 1024 * 1024,
  });

  if (result.error) {
    console.error(`✗ Could not run npm pack: ${result.error.message}`);
    process.exit(1);
  }
  if (result.status !== 0) {
    console.error(`✗ npm pack exited with status ${result.status}`);
    if (result.stderr) console.error(result.stderr.trim());
    process.exit(1);
  }

  let payload;
  try {
    payload = parsePackJson(result.stdout);
  } catch (err) {
    console.error(`✗ Could not parse npm pack output: ${err.message}`);
    process.exit(1);
  }

  const files = payload?.[0]?.files;
  if (!Array.isArray(files)) {
    console.error("✗ npm pack output had no files list");
    process.exit(1);
  }
  return files.map((entry) => entry.path);
}

/** Prints the verdict for a list of packed paths and returns the exit code. */
function report(packedFiles) {
  const offenders = packedFiles.filter((file) => !isAllowed(file)).sort();

  if (offenders.length > 0) {
    console.error(`✗ npm pack would publish ${offenders.length} file(s) outside the allowlist:`);
    for (const file of offenders) console.error(`    ${file}`);
    console.error("");
    console.error(`  Allowed: ${ALLOWLIST_SUMMARY}`);
    console.error('  Fix the "files" field in package.json, then re-run this check.');
    return 1;
  }

  const distCount = packedFiles.filter((file) => file.startsWith("dist/")).length;
  const rootFiles = packedFiles.filter((file) => !file.startsWith("dist/")).sort();
  console.log(`✓ npm pack contents are within the allowlist (${packedFiles.length} files)`);
  console.log(`    dist/: ${distCount} files`);
  for (const file of rootFiles) console.log(`    ${file}`);
  return 0;
}

/**
 * Exercises the allowlist rules against a synthetic file list, so the logic can
 * be validated without a build. Returns the exit code.
 */
function selfTest() {
  const cases = [
    ["dist/index.mjs", true],
    ["dist/cjs/index.cjs", true],
    ["dist/styles/theme.css", true],
    ["package.json", true],
    ["README.md", true],
    ["LICENSE", true],
    ["LICENSE.md", true],
    ["LICENCE.txt", true],
    ["CHANGELOG.md", true],
    ["THIRD-PARTY-NOTICES.md", true],
    ["src/index.ts", false],
    [".env", false],
    ["scripts/generate-icons.mjs", false],
    ["distraction/index.mjs", false],
    ["docs/mintlify/index.mdx", false],
    ["node_modules/react/index.js", false],
  ];

  let failed = 0;
  for (const [file, expected] of cases) {
    const actual = isAllowed(file);
    if (actual === expected) continue;
    console.error(`✗ ${file}: expected isAllowed=${expected}, got ${actual}`);
    failed++;
  }

  if (failed > 0) {
    console.error(`✗ self-test: ${failed} of ${cases.length} case(s) failed`);
    return 1;
  }
  console.log(`✓ self-test: ${cases.length} allowlist cases passed`);
  return 0;
}

function main() {
  if (process.argv.includes("--self-test")) {
    process.exit(selfTest());
  }

  if (!fs.existsSync(DIST_DIR)) {
    console.error(`✗ ${DIST_DIR} does not exist — run \`pnpm build\` first.`);
    process.exit(1);
  }

  process.exit(report(readPackedFiles()));
}

main();
