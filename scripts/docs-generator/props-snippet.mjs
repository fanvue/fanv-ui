/**
 * Renders the `<kebab>-props.mdx` snippet for one page: a `##` section per
 * exported value, each a list of Mintlify `<ParamField>` elements.
 */

import { declarationDescription, describeEmptyProps, describeReExport } from "./docgen.mjs";
import { GENERATED_BANNER, jsdocToMdx, jsxAttribute } from "./mdx.mjs";

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
  const description = jsdocToMdx(declarationDescription(source, member.name));
  if (description) lines.push(description, "");

  const reExport = describeReExport(source, member.name);
  if (reExport) {
    lines.push(reExport, "");
    return { lines, missingDescriptions: 0, documentedProps: 0 };
  }

  const entry = context.docgenByMember.get(`${member.file}#${member.name}`);
  const props = selectProps(entry, context.propOverrides);

  if (props.length === 0) {
    lines.push(describeEmptyProps(source, member.name), "");
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
 * @param {object} prop
 * @returns {string[]}
 */
function renderParamField(prop) {
  const { display, full } = formatType(prop.type);
  const attributes = [jsxAttribute("path", prop.name), jsxAttribute("type", display)];
  const defaultValue = formatDefault(prop.defaultValue);
  if (defaultValue !== null) attributes.push(jsxAttribute("default", defaultValue));
  if (prop.required) attributes.push("required");

  const body = [jsdocToMdx(prop.description)];
  if (full !== display) body.push(`Full type: \`${full}\`.`);
  const text = body.filter(Boolean).join(" ");

  if (!text) return [`<ParamField ${attributes.join(" ")} />`];
  return [`<ParamField ${attributes.join(" ")}>`, `  ${text}`, "</ParamField>"];
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
 * @param {{ value?: unknown } | null | undefined} defaultValue
 * @returns {string | null}
 */
function formatDefault(defaultValue) {
  const value = defaultValue?.value;
  if (value === undefined || value === null) return null;
  const text = normalise(String(value));
  if (text === "" || text === "undefined") return null;
  return text.replace(/^["'`]|["'`]$/g, "");
}
