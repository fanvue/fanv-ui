/**
 * Reads the package's public API straight out of the entry files.
 *
 * `src/index.ts` and the four subpath entries are strictly explicit named
 * re-exports (the tree-shaking rule in AGENTS.md), so the export surface can be
 * derived exactly rather than guessed from the filesystem. A component
 * directory that no entry file re-exports from is not public and gets no page.
 */

import fs from "node:fs";
import path from "node:path";
import { parseModule } from "./storybook-csf.mjs";

/** Entry file -> the import specifier consumers write. */
export const ENTRY_SUBPATHS = {
  "src/index.ts": "@fanvue/ui",
  "src/animated-icons.ts": "@fanvue/ui/animated-icons",
  "src/charts.ts": "@fanvue/ui/charts",
  "src/date-picker.ts": "@fanvue/ui/date-picker",
  "src/flags.ts": "@fanvue/ui/flags",
};

/**
 * @typedef {object} ExportRecord
 * @property {string} name Exported name as consumers import it.
 * @property {boolean} isType `export type { ... }`.
 * @property {string} subpath Import specifier the member is reachable from.
 * @property {string} dir Component directory name, e.g. `Dialog`.
 * @property {string} file Repo-relative implementation file.
 */

/**
 * @param {string} repoRoot
 * @returns {{ exports: ExportRecord[], reExports: { name: string, from: string }[], warnings: string[] }}
 */
export function readPublicApi(repoRoot) {
  /** @type {ExportRecord[]} */
  const exports = [];
  /** @type {{ name: string, from: string }[]} */
  const reExports = [];
  /** @type {string[]} */
  const warnings = [];

  for (const entry of Object.keys(ENTRY_SUBPATHS).sort((a, b) => a.localeCompare(b))) {
    const absolute = path.join(repoRoot, entry);
    if (!fs.existsSync(absolute)) {
      warnings.push(`entry file ${entry} is missing`);
      continue;
    }
    const ast = parseModule(fs.readFileSync(absolute, "utf8"));
    for (const statement of ast.program.body) {
      if (statement.type === "ExportAllDeclaration") {
        warnings.push(`${entry} uses \`export *\`, which the docs generator cannot resolve`);
        continue;
      }
      if (statement.type !== "ExportNamedDeclaration" || !statement.source) continue;
      collectStatement(statement, entry, exports, reExports, repoRoot, warnings);
    }
  }

  return { exports, reExports, warnings };
}

/**
 * @param {object} statement
 * @param {string} entry
 * @param {ExportRecord[]} exports
 * @param {{ name: string, from: string }[]} reExports
 * @param {string} repoRoot
 */
function collectStatement(statement, entry, exports, reExports, repoRoot, warnings) {
  const source = statement.source.value;
  const subpath = ENTRY_SUBPATHS[entry];
  for (const specifier of statement.specifiers) {
    if (specifier.type !== "ExportSpecifier") continue;
    const name = specifier.exported.name ?? specifier.exported.value;
    if (!source.startsWith("./components/")) {
      const kind = source.startsWith(".") ? "utility" : "third-party";
      const isType = statement.exportKind === "type" || specifier.exportKind === "type";
      if (!reExports.some((item) => item.name === name)) {
        reExports.push({ name, from: source, kind, isType, subpath });
      }
      continue;
    }
    // `./components/<Dir>/<any/depth/of/stem>` — anything shallower has no
    // component directory to hang a page off, and hardcoding two segments
    // silently truncates anything deeper into a path that does not exist.
    const segments = source.replace(/^\.\//, "").split("/").filter(Boolean);
    if (segments.length < 3) {
      warnings.push(
        `${entry} re-exports \`${name}\` from \`${source}\`, which names no component directory — expected ./components/<Dir>/<file>`,
      );
      continue;
    }
    const dir = segments[1];
    const stem = segments.slice(2).join("/");
    const file = resolveSource(repoRoot, `src/components/${dir}/${stem}`);
    if (!file) {
      warnings.push(
        `${entry} re-exports \`${name}\` from \`${source}\`, but no source file exists at src/components/${dir}/${stem}{.tsx,.ts,/index.tsx,/index.ts}`,
      );
      continue;
    }
    exports.push({
      name,
      isType: statement.exportKind === "type" || specifier.exportKind === "type",
      subpath,
      dir,
      file,
    });
  }
}

/**
 * Entry files re-export without a file extension, so the implementation file has
 * to be found the way the bundler would.
 *
 * @param {string} repoRoot
 * @param {string} stem Repo-relative path with no extension.
 * @returns {string | null}
 */
function resolveSource(repoRoot, stem) {
  for (const suffix of [".tsx", ".ts", "/index.tsx", "/index.ts"]) {
    if (fs.existsSync(path.join(repoRoot, `${stem}${suffix}`))) return `${stem}${suffix}`;
  }
  return null;
}

/**
 * Folds the flat export list into one record per documentation page.
 *
 * A member reachable from more than one entry (a shared type re-exported on a
 * subpath) is documented against the entry a consumer is most likely to use:
 * the root, when the root exposes it.
 *
 * @param {ExportRecord[]} exports
 * @returns {Map<string, { dir: string, subpath: string, members: ExportRecord[] }>}
 */
export function groupByDirectory(exports) {
  /** @type {Map<string, { dir: string, subpath: string, members: ExportRecord[] }>} */
  const pages = new Map();
  for (const record of exports) {
    let page = pages.get(record.dir);
    if (!page) {
      page = { dir: record.dir, subpath: record.subpath, members: [] };
      pages.set(record.dir, page);
    }
    const existing = page.members.find((member) => member.name === record.name);
    if (existing) {
      if (record.subpath === "@fanvue/ui") existing.subpath = record.subpath;
      continue;
    }
    page.members.push({ ...record });
  }

  for (const page of pages.values()) {
    page.subpath = page.members.some((member) => member.subpath === "@fanvue/ui")
      ? "@fanvue/ui"
      : page.members[0].subpath;
    page.members.sort((a, b) => a.name.localeCompare(b.name));
  }

  return new Map([...pages.entries()].sort((a, b) => a[0].localeCompare(b[0])));
}
