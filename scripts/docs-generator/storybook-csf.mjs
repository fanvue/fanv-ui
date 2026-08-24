/**
 * The only module in the docs generator that imports Storybook internals.
 *
 * `storybook/internal/*` is not part of Storybook's public API, so it churns
 * between majors. Keeping every import here means a Storybook upgrade that
 * moves `loadCsf` or `toId` is a one-file fix rather than a hunt through the
 * generator. Nothing else under scripts/docs-generator/ may import from
 * `storybook/...` directly.
 *
 * If a future Storybook drops these paths entirely, the fallback is the
 * standalone `@storybook/csf` package for `toId` plus the static AST walk in
 * ./ast.mjs, which does not depend on Storybook at all.
 */

import { storyNameFromExport, toId } from "storybook/internal/csf";
import { babelParse, loadCsf } from "storybook/internal/csf-tools";

/**
 * Parses a TS/TSX module into a Babel `File` node.
 *
 * @param {string} code
 * @returns {object}
 */
export function parseModule(code) {
  return babelParse(code);
}

/**
 * Computes a Storybook story id the same way the indexer does, so the ids in
 * the generated Chromatic embeds always match the published Storybook.
 *
 * @param {string} title Story file title, e.g. `Components/Button`.
 * @param {string} storyName Resolved story name, e.g. `With Left Icon`.
 * @returns {string}
 */
export function storyId(title, storyName) {
  return toId(title, storyName);
}

/**
 * @param {string} exportName
 * @returns {string} The story name Storybook derives from an export name.
 */
export function nameFromExport(exportName) {
  return storyNameFromExport(exportName);
}

/**
 * Parses one CSF story file into the shape the generator needs, flattening the
 * bits of `CsfFile` we rely on so no caller has to know its internal fields.
 *
 * @param {string} code
 * @param {string} fileName Path relative to the repo root.
 * @returns {{
 *   title: string,
 *   componentName: string | null,
 *   metaArgs: object | null,
 *   ast: object,
 *   stories: {
 *     exportName: string,
 *     name: string,
 *     id: string,
 *     tags: string[],
 *     usesRender: boolean,
 *     start: number,
 *     end: number,
 *     annotations: Record<string, object>,
 *   }[],
 * } | null}
 */
export function parseStoryFile(code, fileName) {
  const csf = loadCsf(code, { makeTitle: (title) => title, fileName }).parse();
  const title = csf._meta?.title;
  if (!title) return null;

  const byExport = new Map();
  for (const input of csf.indexInputs ?? []) {
    if (input.type !== "story") continue;
    byExport.set(input.exportName, input);
  }

  const stories = [];
  for (const [exportName, node] of Object.entries(csf._storyExports ?? {})) {
    const input = byExport.get(exportName);
    if (!input) continue;
    const annotations = csf._storyAnnotations?.[exportName] ?? {};
    stories.push({
      exportName,
      name: input.name ?? storyNameFromExport(exportName),
      id: input.__id ?? toId(title, input.name ?? storyNameFromExport(exportName)),
      tags: [...(input.tags ?? [])],
      usesRender: Boolean(annotations.render ?? input.__stats?.render),
      start: node.start ?? 0,
      end: node.end ?? 0,
      annotations,
    });
  }

  return {
    title,
    componentName: typeof csf._meta?.component === "string" ? csf._meta.component : null,
    metaArgs: csf._metaAnnotations?.args ?? null,
    ast: csf._ast,
    stories,
  };
}
