#!/usr/bin/env node

/**
 * Regenerates the Mintlify documentation for `@fanvue/ui` under docs/mintlify/.
 *
 * The docs site lives in another repository and syncs this directory verbatim,
 * so everything here has to be derivable from this tree alone. CI regenerates
 * and diffs the result, which makes determinism a hard requirement: no
 * timestamps, no wall-clock, every list sorted, and — deliberately — no package
 * version anywhere in the output, since release-please bumps the version in a
 * pull request nobody can regenerate on.
 *
 * What is generated, and what is not:
 *
 * - `snippets/<name>-props.mdx` and `snippets/<name>-examples.mdx` are fully
 *   generated and overwritten on every run.
 * - `components/<name>.mdx` wrappers are scaffolded **once** and then belong to
 *   whoever writes the prose. An existing wrapper is never touched.
 * - The three gallery pages (icons, animated icons, country flags) are indexes
 *   of hundreds of names with nothing to hand-write around them, so they are
 *   generated whole.
 * - `docs.config.json` is a hand-edited input, not an output. A new component
 *   with no category in it fails the run, so that adding a component forces a
 *   decision about where it belongs in the navigation.
 *
 * Usage: `pnpm docs:generate`
 */

import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  componentSourceFiles,
  declarationDescription,
  parseProps,
} from "./docs-generator/docgen.mjs";
import { buildFixtureContext, renderExamplesSnippet } from "./docs-generator/examples-snippet.mjs";
import { groupByDirectory, readPublicApi } from "./docs-generator/exports.mjs";
import {
  renderAnimatedIconsPage,
  renderCountryFlagPage,
  renderIconsPage,
} from "./docs-generator/galleries.mjs";
import { firstSentence, jsdocToMdx, kebabCase, pascalCase } from "./docs-generator/mdx.mjs";
import { renderPropsSnippet } from "./docs-generator/props-snippet.mjs";
import { parseModule, parseStoryFile } from "./docs-generator/storybook-csf.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..");
const DOCS_DIR = path.join(REPO_ROOT, "docs/mintlify");
const CONFIG_PATH = path.join(DOCS_DIR, "docs.config.json");

/** Version of the `_meta.json` contract the sync script reads. */
const META_SCHEMA_VERSION = 1;

/** Directories documented as galleries rather than as a component page. */
const GALLERY_PAGES = new Set(["Icons", "AnimatedIcons"]);

/** Subpaths whose page opens with an optional-peer-dependency callout. */
const PEER_DEPENDENCIES = {
  "@fanvue/ui/charts": "recharts",
  "@fanvue/ui/date-picker": "react-day-picker",
  "@fanvue/ui/animated-icons": "motion",
};

/** What a category's components are *for*, in the voice of a description. */
const CATEGORY_PURPOSE = {
  Actions: "an action control",
  "Forms & Inputs": "a form input",
  "Overlays & Dialogs": "an overlay surface",
  Navigation: "a navigation control",
  "Data Display": "a data display element",
  "Feedback & Status": "a feedback and status element",
  Layout: "a layout primitive",
  "Media & Audio": "a media control",
  "Creator & Social": "a creator and social element",
  Charts: "a chart building block",
  "Icons & Flags": "an icon set",
  Utility: "a utility",
};

main();

function main() {
  const config = readConfig();
  const sources = new Map();
  const readSource = (file) => {
    if (!sources.has(file)) sources.set(file, fs.readFileSync(path.join(REPO_ROOT, file), "utf8"));
    return sources.get(file);
  };

  const api = readPublicApi(REPO_ROOT);
  const pages = groupByDirectory(api.exports);
  assertCategorised(pages, config);

  const docgenByMember = parseProps(REPO_ROOT, componentSourceFiles(REPO_ROOT));
  const warnings = [...api.warnings];
  const context = buildContext({ config, readSource, api, pages, docgenByMember, warnings });

  const written = { snippets: 0, wrappers: 0, galleries: 0, skippedWrappers: 0 };
  const gaps = [];
  const descriptionGaps = [];
  const skippedStories = [];
  const storyIndex = {};
  /** Every file this run is responsible for, so anything else can be pruned. */
  const emitted = new Set();
  const emit = (relative, content) => {
    emitted.add(relative);
    writeFile(relative, content);
  };

  for (const page of pages.values()) {
    if (GALLERY_PAGES.has(page.dir)) continue;
    const name = kebabCase(page.dir);

    const props = renderPropsSnippet(page, {
      docgenByMember,
      readSource,
      warnings,
      propOverrides: config.propOverrides?.[page.dir] ?? {},
    });
    emit(`snippets/${name}-props.mdx`, props.text);
    written.snippets += 1;
    if (props.missingDescriptions > 0) {
      gaps.push({
        component: page.dir,
        missing: props.missingDescriptions,
        total: props.documentedProps,
      });
    }

    const examples = renderExamplesSnippet(page, context);
    emit(`snippets/${name}-examples.mdx`, examples.text);
    written.snippets += 1;
    storyIndex[name] = examples.storyIds;
    skippedStories.push(...examples.skipped);

    if (page.dir === "CountryFlag") continue;
    const description = pageDescription(page, config, descriptionGaps);
    emitted.add(`components/${name}.mdx`);
    if (writeWrapperOnce(page, name, config, description)) written.wrappers += 1;
    else written.skippedWrappers += 1;
  }

  emit("components/icons.mdx", renderIconsPage(context));
  emit("components/animated-icons.mdx", renderAnimatedIconsPage(context));
  emit("components/country-flag.mdx", renderCountryFlagPage(context));
  written.galleries = 3;

  emit("nav.json", `${JSON.stringify(buildNav(pages, config), null, 2)}\n`);
  emit(
    "snippets/_meta.json",
    `${JSON.stringify(buildMeta(pages, config, storyIndex, api), null, 2)}\n`,
  );

  const pruned = pruneOrphans(emitted);
  report(written, pruned, gaps, descriptionGaps, skippedStories, warnings);
  formatOutput();
}

/**
 * Deletes generated files this run did not emit.
 *
 * Nothing else does: renaming a component leaves its page and both snippets on
 * disk serving stale content forever, and the CI freshness gate cannot see it
 * because an orphan is neither modified nor untracked. Wrapper pages may hold
 * hand-written prose, so one is only removed when its component has genuinely
 * left the export graph — which is exactly the case this handles.
 *
 * @param {Set<string>} emitted
 * @returns {string[]} Repo-relative paths removed.
 */
function pruneOrphans(emitted) {
  const removed = [];
  for (const directory of ["components", "snippets"]) {
    const absolute = path.join(DOCS_DIR, directory);
    if (!fs.existsSync(absolute)) continue;
    for (const entry of fs.readdirSync(absolute).sort((a, b) => a.localeCompare(b))) {
      const relative = `${directory}/${entry}`;
      if (emitted.has(relative)) continue;
      if (!/\.(mdx|json)$/.test(entry)) continue;
      fs.unlinkSync(path.join(DOCS_DIR, relative));
      removed.push(relative);
    }
  }
  return removed;
}

/**
 * Everything the snippet renderers need, bundled once so no renderer reaches
 * for the filesystem or the config on its own.
 */
function buildContext({ config, readSource, api, pages, docgenByMember, warnings }) {
  const publishedExports = new Map();
  for (const record of api.exports) {
    const existing = publishedExports.get(record.name);
    if (!existing || record.subpath === "@fanvue/ui") publishedExports.set(record.name, record);
  }

  const fixtureCache = new Map();
  const storyFilesByDir = indexStoryFiles();
  const spreadFallbacks = new Set();
  return {
    config,
    readSource,
    docgenByMember,
    publishedExports,
    warnings,
    storyFilesByDir,
    /** Reported rather than silent: a leftover `{...args}` is a docs bug. */
    onSpreadFallback: (reason) => {
      if (!reason || spreadFallbacks.has(reason)) return;
      spreadFallbacks.add(reason);
      warnings.push(`example kept a \`{...args}\` spread: ${reason}`);
    },
    /**
     * Storybook's own id for a story, so a gallery can embed one without
     * hardcoding a slug that silently rots when the story is renamed.
     */
    storyIdFor: (dir, exportName) => {
      for (const file of storyFilesByDir.get(dir) ?? []) {
        const parsed = parseStoryFile(readSource(file), file);
        const story = parsed?.stories.find((item) => item.exportName === exportName);
        if (story) return story.id;
      }
      return null;
    },
    iconNames: valueExportNames(pages, "Icons"),
    animatedIconNames: valueExportNames(pages, "AnimatedIcons"),
    fileExists: (file) => fs.existsSync(path.join(REPO_ROOT, file)),
    readJson: (file) => JSON.parse(readSource(file)),
    fixtureContext: (file, hops) => {
      const key = `${file}#${hops}`;
      if (!fixtureCache.has(key)) {
        const source = readSource(file);
        fixtureCache.set(key, buildFixtureContext(file, source, parseModule(source), hops));
      }
      return fixtureCache.get(key);
    },
  };
}

/**
 * @param {Map<string, object>} pages
 * @param {string} dir
 * @returns {string[]}
 */
function valueExportNames(pages, dir) {
  return (pages.get(dir)?.members ?? [])
    .filter((member) => !member.isType)
    .map((member) => member.name);
}

/**
 * @returns {Map<string, string[]>} Component directory -> story files, sorted.
 */
function indexStoryFiles() {
  const root = path.join(REPO_ROOT, "src/components");
  const byDir = new Map();
  for (const dir of fs.readdirSync(root).sort((a, b) => a.localeCompare(b))) {
    const absolute = path.join(root, dir);
    if (!fs.statSync(absolute).isDirectory()) continue;
    const files = fs
      .readdirSync(absolute)
      .filter((file) => file.endsWith(".stories.tsx"))
      .sort((a, b) => a.localeCompare(b))
      .map((file) => `src/components/${dir}/${file}`);
    if (files.length > 0) byDir.set(dir, files);
  }
  return byDir;
}

/**
 * Scaffolds a component page the first time it is needed and never again — the
 * prose under the generated sections is the point of the file.
 *
 * @returns {boolean} Whether a file was written.
 */
function writeWrapperOnce(page, name, config, description) {
  const relative = `components/${name}.mdx`;
  if (fs.existsSync(path.join(DOCS_DIR, relative))) return false;

  const component = pascalCase(name);
  const peer = PEER_DEPENDENCIES[page.subpath];
  const prefix = config.docsPathPrefix ?? "ui";
  const subpath = page.subpath !== "@fanvue/ui";

  const lines = [
    "---",
    `title: ${JSON.stringify(page.dir)}`,
    `description: ${JSON.stringify(description)}`,
    "---",
    "",
    `import ${component}Props from "/snippets/ui/${name}-props.mdx";`,
    `import ${component}Examples from "/snippets/ui/${name}-examples.mdx";`,
    "",
  ];

  if (peer) {
    lines.push(
      "<Warning>",
      `  This subpath needs the optional \`${peer}\` peer dependency: \`pnpm add ${peer}\`.`,
      `  See [Subpath exports](/${prefix}/subpath-exports).`,
      "</Warning>",
      "",
    );
  }

  // Search drops people straight onto a component page, so every one of them
  // needs a route back to the setup it assumes has already happened.
  const footer = [
    `[Installation](/${prefix}/installation)`,
    `[Theming](/${prefix}/theming)`,
    ...(subpath ? [`[Subpath exports](/${prefix}/subpath-exports)`] : []),
  ].join(" · ");

  lines.push(
    "```tsx",
    ...renderImportBlock(page),
    "```",
    "",
    "## Examples",
    "",
    `<${component}Examples />`,
    "",
    "## Props",
    "",
    `<${component}Props />`,
    "",
    "---",
    "",
    `**Setup:** ${footer}`,
    "",
    `{/* Add hand-written guidance below — when to reach for ${page.dir}, accessibility notes,`,
    "    composition patterns. Everything above this line is regenerated by",
    "    scripts/generate-docs.mjs in fanvue/fanv-ui; everything below it is yours. */}",
    "",
  );

  writeFile(relative, lines.join("\n"));
  return true;
}

/**
 * Values and types get separate statements: consumers on
 * `verbatimModuleSyntax` need `import type` for the types, and the split makes
 * it obvious which names are runtime and which are compile-time.
 *
 * @param {object} page
 * @returns {string[]}
 */
function renderImportBlock(page) {
  const values = page.members.filter((member) => !member.isType).map((member) => member.name);
  const types = page.members.filter((member) => member.isType).map((member) => member.name);
  return [
    ...(values.length > 0 ? [renderImportLine("import", values, page.subpath)] : []),
    ...(types.length > 0 ? [renderImportLine("import type", types, page.subpath)] : []),
  ];
}

/**
 * @param {string} keyword
 * @param {string[]} names
 * @param {string} subpath
 * @returns {string}
 */
function renderImportLine(keyword, names, subpath) {
  const single = `${keyword} { ${names.join(", ")} } from "${subpath}";`;
  if (single.length <= 96) return single;
  return [`${keyword} {`, ...names.map((name) => `  ${name},`), `} from "${subpath}";`].join("\n");
}

/**
 * The one-line description that becomes the page's `<meta>`, its search result
 * and its card in the navigation.
 *
 * Sources, best first:
 *
 * 1. `pageDescriptions` in docs.config.json. A compound component's root export
 *    (`export const Dialog = DialogPrimitive.Root`) carries a JSDoc about the
 *    *root primitive* — "Root component that manages open/close state" — which
 *    is true of the export and useless as a description of the page. There is
 *    nothing better to derive, so the config is where a human says it.
 * 2. The JSDoc of the export whose name matches the directory.
 * 3. The JSDoc of the only value export, when there is exactly one.
 * 4. A category-shaped fallback, which at least says what kind of thing it is.
 *
 * Anything that reaches 3 or 4 is reported as a JSDoc gap.
 *
 * @param {object} page
 * @param {object} config
 * @param {{ component: string, reason: string, description: string }[]} gaps
 * @returns {string}
 */
function pageDescription(page, config, gaps) {
  const values = page.members.filter((member) => !member.isType);
  const primary = values.find((member) => member.name === page.dir) ?? null;
  const fromPrimary = primary ? memberSentence(primary) : "";

  const override = config.pageDescriptions?.[page.dir];
  if (override) {
    if (!fromPrimary) {
      gaps.push({
        component: page.dir,
        reason: primary
          ? `\`${primary.name}\` has no JSDoc — description comes from docs.config.json`
          : `no export named ${page.dir} — description comes from docs.config.json`,
        description: override,
      });
    }
    return override;
  }
  if (fromPrimary) return fromPrimary;

  if (values.length === 1) {
    const only = memberSentence(values[0]);
    if (only) {
      gaps.push({
        component: page.dir,
        reason: `no export named ${page.dir}; used ${values[0].name}'s JSDoc`,
        description: only,
      });
      return only;
    }
  }

  const fallback = fallbackDescription(page, config);
  gaps.push({
    component: page.dir,
    reason: primary
      ? `\`${primary.name}\` has no JSDoc`
      : `no export named ${page.dir} carries usable JSDoc`,
    description: fallback,
  });
  return fallback;
}

/**
 * @param {object} member
 * @returns {string}
 */
function memberSentence(member) {
  const source = fs.readFileSync(path.join(REPO_ROOT, member.file), "utf8");
  const sentence = firstSentence(declarationDescription(source, member.name));
  if (!sentence) return "";
  return jsdocToMdx(sentence).replace(/&#\d+;|&[a-z]+;/g, "");
}

/**
 * Used when the directory has no export of its own name (the chart parts, for
 * instance) or when that export carries no JSDoc. "The X component, from
 * @fanvue/ui" says nothing at all, so the category at least narrows it down.
 *
 * @param {object} page
 * @param {object} config
 * @returns {string}
 */
function fallbackDescription(page, config) {
  const values = page.members.filter((member) => !member.isType);
  const purpose = CATEGORY_PURPOSE[config.categories?.[page.dir]] ?? "a component";
  if (values.length > 1) {
    return `${page.dir}: ${purpose} built from ${values.length} exports — ${values
      .slice(0, 4)
      .map((member) => member.name)
      .join(", ")}${values.length > 4 ? ", …" : ""} — imported from ${page.subpath}.`;
  }
  return `${page.dir} — ${purpose} from ${page.subpath}.`;
}

/**
 * @param {Map<string, object>} pages
 * @param {object} config
 * @returns {object}
 */
function buildNav(pages, config) {
  const prefix = config.docsPathPrefix ?? "ui";
  const groups = [{ group: "Getting Started", pages: [...config.gettingStartedPages] }];
  const byCategory = new Map();
  for (const page of pages.values()) {
    const category = config.categories[page.dir];
    if (!byCategory.has(category)) byCategory.set(category, []);
    byCategory.get(category).push(`${prefix}/components/${kebabCase(page.dir)}`);
  }

  const ordered = [...byCategory.keys()].sort((a, b) => {
    const rank = (name) => {
      const index = config.categoryOrder.indexOf(name);
      return index === -1 ? config.categoryOrder.length : index;
    };
    return rank(a) - rank(b) || a.localeCompare(b);
  });

  for (const category of ordered) {
    groups.push({
      group: category,
      pages: byCategory.get(category).sort((a, b) => a.localeCompare(b)),
    });
  }
  return { tab: "UI Library", groups };
}

/**
 * @returns {object}
 */
function buildMeta(pages, config, storyIndex, api) {
  const entries = {};
  for (const page of pages.values()) {
    entries[kebabCase(page.dir)] = {
      component: page.dir,
      category: config.categories[page.dir],
      subpath: page.subpath,
      gallery: GALLERY_PAGES.has(page.dir) || page.dir === "CountryFlag",
      exports: page.members.map((member) => member.name),
      types: page.members.filter((member) => member.isType).map((member) => member.name),
    };
  }
  return {
    schemaVersion: META_SCHEMA_VERSION,
    generator: "scripts/generate-docs.mjs",
    source: "fanvue/fanv-ui",
    tab: "UI Library",
    docsPathPrefix: config.docsPathPrefix ?? "ui",
    subpaths: [...new Set([...pages.values()].map((page) => page.subpath))].sort((a, b) =>
      a.localeCompare(b),
    ),
    pages: Object.fromEntries(Object.entries(entries).sort((a, b) => a[0].localeCompare(b[0]))),
    stories: Object.fromEntries(
      Object.entries(storyIndex).sort((a, b) => a[0].localeCompare(b[0])),
    ),
    reExports: api.reExports
      .filter((item) => item.kind === "third-party")
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((item) => ({
        name: item.name,
        from: item.from,
        subpath: item.subpath,
        note: "Re-exported from a third-party package. Not a Fanvue component, and has no page.",
      })),
    utilities: api.reExports
      .filter((item) => item.kind === "utility")
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((item) => ({
        name: item.name,
        subpath: item.subpath,
        isType: item.isType,
        note: "Shared helper exported from the package root, not tied to one component.",
      })),
  };
}

/**
 * A component with no category is a hard failure: the alternative is silently
 * dropping a new component out of the navigation.
 */
function assertCategorised(pages, config) {
  const missing = [...pages.keys()].filter((dir) => !config.categories[dir]);
  if (missing.length === 0) return;
  console.error(
    `Uncategorised component${missing.length === 1 ? "" : "s"}: ${missing.join(", ")}.\n` +
      `Add ${missing.length === 1 ? "an entry" : "entries"} under "categories" in docs/mintlify/docs.config.json ` +
      `(one of: ${config.categoryOrder.join(", ")}), then re-run.`,
  );
  process.exit(1);
}

/**
 * @returns {object}
 */
function readConfig() {
  if (!fs.existsSync(CONFIG_PATH)) {
    console.error(
      `Missing ${path.relative(REPO_ROOT, CONFIG_PATH)}. It is a hand-edited input, not an output.`,
    );
    process.exit(1);
  }
  return JSON.parse(fs.readFileSync(CONFIG_PATH, "utf8"));
}

/**
 * @param {string} relative
 * @param {string} content
 */
function writeFile(relative, content) {
  const absolute = path.join(DOCS_DIR, relative);
  fs.mkdirSync(path.dirname(absolute), { recursive: true });
  fs.writeFileSync(absolute, content);
}

/**
 * @param {object} written
 * @param {{ component: string, missing: number, total: number }[]} gaps
 * @param {{ story: string, reason: string }[]} skipped
 * @param {string[]} warnings
 */
function report(written, pruned, gaps, descriptionGaps, skipped, warnings) {
  console.log(
    `Wrote ${written.snippets} snippets, ${written.wrappers} new wrapper pages ` +
      `(${written.skippedWrappers} left alone), ${written.galleries} gallery pages, nav.json and _meta.json.`,
  );

  if (pruned.length > 0) {
    console.warn(`\nPruned ${pruned.length} orphaned generated file(s):`);
    for (const file of pruned) console.warn(`  removed docs/mintlify/${file}`);
  }

  for (const warning of warnings) console.warn(`warning: ${warning}`);

  if (descriptionGaps.length > 0) {
    console.warn(
      `\n${descriptionGaps.length} pages have no usable component-level JSDoc, so their description was derived:`,
    );
    for (const gap of descriptionGaps.sort((a, b) => a.component.localeCompare(b.component))) {
      console.warn(`  ${gap.component}: ${gap.reason}`);
    }
    console.warn(
      "  Fix at the source (a JSDoc on the export), or set `pageDescriptions` in docs/mintlify/docs.config.json.",
    );
  }

  if (skipped.length > 0) {
    console.warn(`\n${skipped.length} stories skipped:`);
    for (const item of skipped.slice(0, 20)) console.warn(`  ${item.story}: ${item.reason}`);
    if (skipped.length > 20) console.warn(`  ... and ${skipped.length - 20} more`);
  }

  if (gaps.length === 0) {
    console.log("\nEvery documented prop has a JSDoc description.");
    return;
  }
  const total = gaps.reduce((sum, gap) => sum + gap.missing, 0);
  console.warn(
    `\n${total} props are missing a JSDoc description, across ${gaps.length} components:`,
  );
  for (const gap of gaps
    .sort((a, b) => b.missing - a.missing || a.component.localeCompare(b.component))
    .slice(0, 10)) {
    console.warn(`  ${gap.component}: ${gap.missing}/${gap.total}`);
  }
}

/**
 * Biome owns the formatting of the JSON outputs, so a check pass over the whole
 * directory keeps `biome check .` in CI green.
 *
 * The write pass is followed by a verify pass on purpose. On biome 2.x a clean
 * `--write` exits 0 and exit 1 means diagnostics *remain* — so treating 1 as
 * success let generated output biome cannot auto-fix sail through `docs:generate`
 * and fail later in the lint job, on a file whose header tells the author not to
 * touch it.
 */
function formatOutput() {
  runBiome(["biome", "check", "docs/mintlify", "--write"]);
  const verify = runBiome(["biome", "check", "docs/mintlify"]);
  if (verify.status !== 0) {
    console.error(
      "\nbiome still reports problems in the generated output that it cannot fix itself.\n" +
        "The output is generated, so fix scripts/generate-docs.mjs (or scripts/docs-generator/), not docs/mintlify/.",
    );
    process.exit(1);
  }
}

/**
 * @param {string[]} args
 * @returns {{ status: number | null }}
 */
function runBiome(args) {
  let result = spawnSync("pnpm", args, { cwd: REPO_ROOT, stdio: "inherit" });
  if (result.error?.code === "EACCES" || result.error?.code === "ENOENT") {
    result = spawnSync("npx", ["pnpm", ...args], { cwd: REPO_ROOT, stdio: "inherit" });
  }
  if (result.error) {
    console.error("could not run biome:", result.error.message);
    process.exit(1);
  }
  return result;
}
