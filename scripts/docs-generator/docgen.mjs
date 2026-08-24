/**
 * Prop extraction, mirroring `.storybook/main.ts` exactly.
 *
 * The docgen options here are a copy of `reactDocgenTypescriptOptions` in the
 * Storybook config: the same three settings, in the same shape. If that config
 * changes, change this too — the whole point is that the published props tables
 * say the same thing as the Storybook Controls panel.
 *
 * Component descriptions do *not* come from docgen. react-docgen-typescript
 * misattributes the JSDoc of a plain re-assignment (`export const Dialog =
 * DialogPrimitive.Root`) to whichever component it parses next, so member
 * descriptions are read straight off the declaration instead.
 */

import fs from "node:fs";
import path from "node:path";
import docgen from "react-docgen-typescript";

const DOCGEN_OPTIONS = {
  shouldExtractLiteralValuesFromEnum: true,
  shouldRemoveUndefinedFromOptional: true,
  propFilter: (prop) => !prop.parent?.fileName.includes("node_modules"),
};

const COMPILER_OPTIONS = {
  jsx: 4,
  esModuleInterop: true,
  skipLibCheck: true,
  allowSyntheticDefaultImports: true,
  strict: true,
  target: 99,
  moduleResolution: 100,
};

/**
 * Parses every implementation file under `src/components` in a single
 * TypeScript program — one program for 370-odd files takes a few seconds,
 * whereas one program per file takes minutes.
 *
 * @param {string} repoRoot
 * @param {string[]} files Repo-relative implementation files.
 * @returns {Map<string, object>} Keyed `<repo-relative file>#<displayName>`.
 */
export function parseProps(repoRoot, files) {
  const parser = docgen.withCompilerOptions(COMPILER_OPTIONS, DOCGEN_OPTIONS);
  const parsed = parser.parse(files.map((file) => path.join(repoRoot, file)));
  const byMember = new Map();
  for (const entry of parsed) {
    const relative = path.relative(repoRoot, entry.filePath).split(path.sep).join("/");
    byMember.set(`${relative}#${entry.displayName}`, entry);
  }
  return byMember;
}

/**
 * @param {string} repoRoot
 * @returns {string[]} Every repo-relative component source file worth parsing.
 */
export function componentSourceFiles(repoRoot) {
  const root = path.join(repoRoot, "src/components");
  /** @type {string[]} */
  const files = [];
  const visit = (dir) => {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name))) {
      const absolute = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        visit(absolute);
        continue;
      }
      if (!/\.tsx?$/.test(entry.name)) continue;
      if (/\.(test|stories)\.tsx?$/.test(entry.name)) continue;
      files.push(path.relative(repoRoot, absolute).split(path.sep).join("/"));
    }
  };
  visit(root);
  return files;
}

/**
 * Pulls the JSDoc block immediately above an exported declaration.
 *
 * @param {string} source
 * @param {string} name
 * @returns {string}
 */
export function declarationDescription(source, name) {
  // A `// biome-ignore` line between the JSDoc and the export is common enough
  // in this library to matter: without allowing for it, Autocomplete's
  // carefully written block comment was invisible and its page description fell
  // back to "The Autocomplete component, from @fanvue/ui."
  const pattern = new RegExp(
    String.raw`/\*\*((?:(?!\*/)[\s\S])*?)\*/\s*(?://[^\n]*\n\s*)*export\s+(?:declare\s+)?(?:const|function|class|interface|type)\s+${name}\b`,
  );
  const match = source.match(pattern);
  if (!match) return "";
  return match[1]
    .split("\n")
    .map((line) => line.replace(/^\s*\*\s?/, ""))
    .join("\n")
    .split(/\n\s*@(?:example|default|param|returns|see|deprecated)\b/)[0]
    .trim();
}

/**
 * Detects `export const X = SomethingImported;` — a straight re-export of
 * another library's component under our name.
 *
 * These have no API of their own to document, and docgen happily reports every
 * prop of the upstream component (165 of them, for the Recharts legend), so
 * they get a sentence and a pointer instead of a table nobody can maintain.
 *
 * @param {string} source Implementation file text.
 * @param {string} name Member name.
 * @returns {string | null} MDX-ready prose, or null if this is our own component.
 */
export function describeReExport(source, name) {
  const alias = source.match(
    new RegExp(
      String.raw`export\s+const\s+${name}\s*=\s*([A-Za-z_$][\w$]*)(\.[A-Za-z_$][\w$]*)?\s*;`,
    ),
  );
  if (!alias) return null;
  const [, local, member = ""] = alias;
  const module = importedFrom(source, local);
  if (!module || module.startsWith(".")) return null;

  const upstream = `${local}${member}`;
  if (module.startsWith("@radix-ui/")) {
    return `A direct re-export of the Radix \`${upstream}\` primitive. It accepts all of that primitive's props, unchanged.`;
  }
  return `A direct re-export of \`${upstream}\` from \`${module}\`, provided so a chart can be assembled from one import. Its props are ${module}'s own — see the [${module} documentation](https://www.npmjs.com/package/${module}).`;
}

/**
 * @param {string} source
 * @param {string} local
 * @returns {string | null}
 */
function importedFrom(source, local) {
  const pattern = new RegExp(
    String.raw`import\s+(?:\*\s+as\s+${local}|\{[^}]*\b${local}\b[^}]*\})\s+from\s+["']([^"']+)["']`,
  );
  const match = source.match(pattern);
  return match ? match[1] : null;
}

/**
 * Works out what to say about a member docgen reports no own props for. Radix
 * aliases and empty `extends React.HTMLAttributes<…>` interfaces are the two
 * shapes this library produces, and each deserves a sentence rather than an
 * empty table.
 *
 * @param {string} source Implementation file text.
 * @param {string} name Member name.
 * @param {string[]} [warnings] Collector for unmapped DOM interfaces.
 * @returns {string} MDX-ready prose, already safe (no braces or angle brackets).
 */
export function describeEmptyProps(source, name, warnings) {
  const primitive = matchPrimitiveAlias(source, name);
  if (primitive) {
    return `Accepts all props of the underlying Radix \`${primitive}\` primitive, plus \`className\`.`;
  }
  const element = matchHtmlAttributes(source, name, warnings);
  if (element) {
    return `Takes no props of its own. Accepts all standard \`${element}\` attributes, including \`className\`.`;
  }
  return "Takes no props of its own beyond the standard attributes of the element it renders.";
}

/**
 * @param {string} source
 * @param {string} name
 * @returns {string | null} e.g. `DialogPrimitive.Trigger`.
 */
function matchPrimitiveAlias(source, name) {
  const declaration = propsDeclaration(source, name);
  const fromProps = declaration?.match(/typeof\s+([A-Za-z_$][\w$]*\.[A-Za-z_$][\w$]*)/);
  if (fromProps) return fromProps[1];
  const alias = source.match(
    new RegExp(String.raw`export\s+const\s+${name}\s*=\s*([A-Za-z_$][\w$]*\.[A-Za-z_$][\w$]*)\s*;`),
  );
  return alias ? alias[1] : null;
}

/**
 * @param {string} source
 * @param {string} name
 * @returns {string | null} e.g. `div`.
 */
function matchHtmlAttributes(source, name, warnings) {
  const declaration = propsDeclaration(source, name);
  const match = declaration?.match(/React\.(\w*?)HTMLAttributes<HTML(\w*?)Element>/);
  if (!match) return null;
  const stem = match[2].toLowerCase();
  if (stem === "") return "div";
  const element = ELEMENT_NAMES[stem];
  if (element) return element;
  // Lower-casing an unmapped DOM interface stem invents elements that do not
  // exist — `HTMLTableSectionElement` became "tablesection" in three published
  // props tables. Say nothing rather than say something false.
  warnings?.push(
    `${name}: no HTML element mapped for \`HTML${match[2]}Element\` — add it to ELEMENT_NAMES in scripts/docs-generator/docgen.mjs`,
  );
  return null;
}

/**
 * DOM interface stem (from `HTML<Stem>Element`) -> the tag or tags it covers.
 * `HTMLElement` itself is handled separately, as `div`.
 */
const ELEMENT_NAMES = {
  anchor: "a",
  area: "area",
  audio: "audio",
  br: "br",
  button: "button",
  canvas: "canvas",
  data: "data",
  datalist: "datalist",
  details: "details",
  dialog: "dialog",
  div: "div",
  dlist: "dl",
  embed: "embed",
  fieldset: "fieldset",
  form: "form",
  heading: "h1-h6",
  hr: "hr",
  iframe: "iframe",
  image: "img",
  input: "input",
  label: "label",
  legend: "legend",
  li: "li",
  map: "map",
  media: "audio/video",
  meter: "meter",
  object: "object",
  olist: "ol",
  optgroup: "optgroup",
  option: "option",
  output: "output",
  paragraph: "p",
  picture: "picture",
  pre: "pre",
  progress: "progress",
  quote: "blockquote/q",
  script: "script",
  select: "select",
  slot: "slot",
  source: "source",
  span: "span",
  style: "style",
  table: "table",
  tablecaption: "caption",
  tablecell: "td/th",
  tablecol: "col/colgroup",
  tablerow: "tr",
  tablesection: "thead/tbody/tfoot",
  template: "template",
  textarea: "textarea",
  time: "time",
  track: "track",
  ulist: "ul",
  video: "video",
};

/**
 * @param {string} source
 * @param {string} name
 * @returns {string | null} The text of `<name>Props`, up to its body or `;`.
 */
function propsDeclaration(source, name) {
  const pattern = new RegExp(
    String.raw`export\s+(?:interface|type)\s+${name}Props\b([\s\S]*?)(?:\{|;)`,
  );
  const match = source.match(pattern);
  return match ? match[1] : null;
}
