#!/usr/bin/env node

/**
 * Serves a local preview of docs/mintlify/ with the Mintlify CLI.
 *
 * The published site lives in fanvue/styx-docs-mintlify, which vendors this
 * tree as `ui/` (snippets as `snippets/ui/`) and splices nav.json into its own
 * docs.json — so this repo deliberately has no docs.json. This script rebuilds
 * that layout with symlinks under node_modules/.cache/docs-preview/, writes a
 * minimal docs.json around nav.json, and runs `mint dev` against it. Because
 * the preview root symlinks back into docs/mintlify/, edits to pages and
 * snippets hot-reload in the browser.
 *
 * Two harmless warnings are expected in the CLI output: a RangeError from the
 * file watcher (it dislikes the symlinks but still picks up changes) and a
 * missing /snippets/ui/version.mdx (the consumer repo generates that file; the
 * index page renders without its version stamp).
 *
 * Usage: `pnpm docs:preview` (port 3333, or pass `--port <n>`)
 */

import { spawn, spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..");
const DOCS_DIR = path.join(REPO_ROOT, "docs/mintlify");
const PREVIEW_DIR = path.join(REPO_ROOT, "node_modules/.cache/docs-preview");

main();

function main() {
  const generated = ["components", "snippets", "nav.json"].map((name) => path.join(DOCS_DIR, name));
  if (!generated.every((p) => fs.existsSync(p))) {
    console.log("Generated docs missing — running docs:generate first.");
    const result = spawnSync("node", [path.join(__dirname, "generate-docs.mjs")], {
      stdio: "inherit",
    });
    if (result.status !== 0) process.exit(result.status ?? 1);
  }

  fs.mkdirSync(path.join(PREVIEW_DIR, "snippets"), { recursive: true });
  symlink(DOCS_DIR, path.join(PREVIEW_DIR, "ui"));
  symlink(path.join(DOCS_DIR, "snippets"), path.join(PREVIEW_DIR, "snippets/ui"));

  const nav = JSON.parse(fs.readFileSync(path.join(DOCS_DIR, "nav.json"), "utf8"));
  const docsJson = {
    $schema: "https://mintlify.com/docs.json",
    theme: "mint",
    name: "@fanvue/ui (local preview)",
    colors: { primary: "#0069ED" },
    navigation: { tabs: [nav] },
  };
  fs.writeFileSync(path.join(PREVIEW_DIR, "docs.json"), `${JSON.stringify(docsJson, null, 2)}\n`);

  const args = process.argv.slice(2);
  if (!args.includes("--port")) args.push("--port", "3333");
  const mint = spawn("pnpm", ["dlx", "mint@latest", "dev", ...args], {
    cwd: PREVIEW_DIR,
    stdio: "inherit",
  });
  mint.on("exit", (code) => process.exit(code ?? 0));
}

/** Replaces whatever is at linkPath with a symlink to target. */
function symlink(target, linkPath) {
  fs.rmSync(linkPath, { recursive: true, force: true });
  fs.symlinkSync(target, linkPath, "dir");
}
