/**
 * Renders the `<kebab>-props.mdx` snippet for one page: a `##` section per
 * exported value, each a list of Mintlify `<ParamField>` elements.
 */

import { declarationDescription, describeEmptyProps, describeReExport } from "./docgen.mjs";
import {
  GENERATED_BANNER,
  indentBlock,
  jsdocToMdx,
  jsdocToMdxBlocks,
  jsxAttribute,
  splitJsdocTags,
} from "./mdx.mjs";

/** Beyond this, a union is truncated in the `type` attribute and spelled out in the description. */
const MAX_TYPE_LENGTH = 90;

/**
 * @param {object} page
 * @param {object} context
 * @param {Map<string, object>} context.docgenByMember
 * @param {(file: string) => string} context.readSource
 * @param {{ allow?: string[], deny?: string[] }} context.propOverrides
 * @returns {{ text: string, missingDescriptions: number, documentedProps: number }}
 */
export function renderPropsSnippet(page, context) {
  const values = page.members.filter((member) => !member.isType);
  const types = page.members.filter((member) => member.isType);
  const lines = [GENERATED_BANNER, ""];
  let missingDescriptions = 0;
  let documentedProps = 0;

  for (const member of values) {
    const source = context.readSource(member.file);
    const section = renderMember(member, source, context);
    missingDescriptions += section.missingDescriptions;
    documentedProps += section.documentedProps;
    lines.push(...section.lines, "");
  }

  if (types.length > 0) {
    lines.push(
      "## Exported types",
      "",
      `Also exported from \`${page.subpath}\`: ${types
        .map((member) => `\`${member.name}\``)
        .join(", ")}.`,
      "",
    );
  }

  return { text: `${lines.join("\n").trimEnd()}\n`, missingDescriptions, documentedProps };
}

/**
 * @param {object} member
 * @param {string} source
 * @param {object} context
 * @returns {{ lines: string[], missingDescriptions: number, documentedProps: number }}
 */
function renderMember(member, source, context) {
  const lines = [`## ${member.name}`, ""];
  const description = jsdocToMdxBlocks(declarationDescription(source, member.name));
  if (description.length > 0) lines.push(...description, "");

  const reExport = describeReExport(source, member.name);
  if (reExport) {
    lines.push(reExport, "");
    return { lines, missingDescriptions: 0, documentedProps: 0 };
  }

  const entry = context.docgenByMember.get(`${member.file}#${member.name}`);
  const props = selectProps(entry, context.propOverrides);

  if (props.length === 0) {
    lines.push(describeEmptyProps(source, member.name, context.warnings), "");
    return { lines, missingDescriptions: 0, documentedProps: 0 };
  }

  if (/^use[A-Z]/.test(member.name)) {
    lines.push(`Options passed to \`${member.name}\`:`, "");
  }

  let missingDescriptions = 0;
  for (const prop of props) {
    const rendered = renderParamField(prop);
    if (!prop.description?.trim()) missingDescriptions += 1;
    lines.push(...rendered, "");
  }
  return { lines, missingDescriptions, documentedProps: props.length };
}

/**
 * Required props first, then alphabetical — the order a consumer reads them in.
 *
 * @param {object | undefined} entry
 * @param {{ allow?: string[], deny?: string[] }} overrides
 * @returns {object[]}
 */
function selectProps(entry, overrides) {
  const all = Object.values(entry?.props ?? {});
  const allow = overrides.allow ? new Set(overrides.allow) : null;
  const deny = new Set(overrides.deny ?? []);
  return all
    .filter((prop) => (allow ? allow.has(prop.name) : true) && !deny.has(prop.name))
    .sort((a, b) => {
      if (a.required !== b.required) return a.required ? -1 : 1;
      return a.name.localeCompare(b.name);
    });
}

/**
 * Renders one `<ParamField>`.
 *
 * Three things a naive single-line render gets wrong, all visible in the
 * published tables: a JSDoc bullet list collapses into run-on prose with stray
 * hyphens, a raw `@deprecated` tag renders as part of the sentence, and a
 * `@default` containing backticks loses them to Mintlify's markdown pass.
 *
 * @param {object} prop
 * @returns {string[]}
 */
export function renderParamField(prop) {
  const { display, full } = formatType(prop.type);
  const { description, tags } = splitJsdocTags(prop.description);

  const attributes = [jsxAttribute("path", prop.name), jsxAttribute("type", display)];
  const defaultValue = formatDefault(prop.defaultValue) ?? formatDefault({ value: tags.default });
  if (defaultValue !== null) attributes.push(jsxAttribute("default", defaultValue));
  if (prop.required) attributes.push("required");
  if (tags.deprecated !== undefined) attributes.push("deprecated");

  const body = jsdocToMdxBlocks(description);
  const trailer = [];
  if (tags.deprecated) trailer.push(`**Deprecated.** ${jsdocToMdx(tags.deprecated)}`);
  // A truncated `type` attribute is only readable if the whole union is spelled
  // out somewhere, so this is unconditional whenever the display form was cut.
  if (full !== display) trailer.push(`Full type: \`${full}\`.`);

  for (const paragraph of trailer) {
    if (body.length > 0) body.push("");
    body.push(paragraph);
  }

  if (body.length === 0) return [`<ParamField ${attributes.join(" ")} />`];
  return [`<ParamField ${attributes.join(" ")}>`, ...indentBlock(body), "</ParamField>"];
}

/**
 * @param {object | undefined} type
 * @returns {{ display: string, full: string }}
 */
function formatType(type) {
  const full = normalise(unionMembers(type).join(" | ") || type?.raw || type?.name || "unknown");
  if (full.length <= MAX_TYPE_LENGTH) return { display: full, full };

  const members = unionMembers(type);
  if (members.length > 1) {
    const kept = [];
    let width = 0;
    for (const item of members) {
      if (width + item.length + 3 > MAX_TYPE_LENGTH) break;
      kept.push(item);
      width += item.length + 3;
    }
    if (kept.length > 0) return { display: `${kept.join(" | ")} | ...`, full };
  }
  return { display: `${full.slice(0, MAX_TYPE_LENGTH - 4).trimEnd()} ...`, full };
}

/**
 * @param {object | undefined} type
 * @returns {string[]}
 */
function unionMembers(type) {
  if (type?.name !== "enum" || !Array.isArray(type.value)) return [];
  const seen = new Set();
  const members = [];
  for (const item of type.value) {
    const value = normalise(String(item.value));
    if (value === "undefined" || seen.has(value)) continue;
    seen.add(value);
    members.push(value);
  }
  return members;
}

/**
 * @param {string} text
 * @returns {string}
 */
function normalise(text) {
  return text
    .replace(/\s*\n\s*/g, " ")
    .replace(/\s{2,}/g, " ")
    .trim();
}

/**
 * Normalises the many shapes a `@default` reaches docgen in. The library writes
 * them three different ways — bare, escaped (`` \` ``), and wrapped in a
 * markdown code span (`` ``…`` ``) — and stripping one leading and one trailing
 * quote character handles none of them, which is what left seven defaults
 * rendering with dangling backticks and a literal backslash.
 *
 * @param {{ value?: unknown } | null | undefined} defaultValue
 * @returns {string | null}
 */
function formatDefault(defaultValue) {
  const value = defaultValue?.value;
  if (value === undefined || value === null) return null;
  let text = normalise(String(value));

  const codeSpan = text.match(/^(`+)([\s\S]*?)\1$/);
  if (codeSpan) text = codeSpan[2].trim();
  text = text.replace(/\\`/g, "`");
  const quoted = text.match(/^(["'])((?:(?!\1)[\s\S])*)\1$/);
  if (quoted) text = quoted[2];

  if (text === "" || text === "undefined") return null;
  return text;
}
