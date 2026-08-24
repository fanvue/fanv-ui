/**
 * Renders the `<kebab>-examples.mdx` snippet for one page: a live Chromatic
 * embed plus runnable source for each selected story.
 *
 * The hard part is the source. A CSF3 story is written against the library's
 * own relative imports and often leans on module-scope fixtures, so lifting the
 * text verbatim would give consumers something that does not compile. Instead
 * every identifier a story reaches for is resolved: library components turn
 * into an import from the right published subpath, peer dependencies keep their
 * own import, and local fixtures are inlined ahead of the example. A story whose
 * dependencies cannot be resolved that way is skipped rather than published
 * broken.
 */

import path from "node:path";
import { dedent, objectPath, referencedIdentifiers, staticValue } from "./ast.mjs";
import { codeFence, GENERATED_BANNER, jsdocToMdx } from "./mdx.mjs";
import { parseStoryFile } from "./storybook-csf.mjs";

/** Storybook parameter identifiers that mark a story as not-for-documentation. */
const NON_DOC_PARAMETERS = ["E2E_FIXTURE_PARAMETERS", "NON_VISUAL_STORY_PARAMETERS"];

/** Modules an example may import from. Anything else means the story is test-only. */
const ALLOWED_PACKAGES = new Set(["react", "recharts", "react-day-picker", "motion"]);

/** Type-only Storybook imports that never reach the rendered output. */
const IGNORED_MODULES = new Set(["@storybook/react", "@storybook/react-vite"]);

/** How far the fixture inliner will follow a relative import out of the story file. */
const MAX_FILE_HOPS = 2;

/** An example longer than this stops being a useful illustration. */
const MAX_EXAMPLE_CHARS = 4000;

/**
 * @param {object} page
 * @param {object} context
 * @returns {{ text: string, storyIds: string[], skipped: { story: string, reason: string }[] }}
 */
export function renderExamplesSnippet(page, context) {
  const files = context.storyFilesByDir.get(page.dir) ?? [];
  const multiFile = files.length > 1;
  const lines = [GENERATED_BANNER, ""];
  const storyIds = [];
  /** @type {{ story: string, reason: string }[]} */
  const skipped = [];

  for (const file of files) {
    const parsed = parseStoryFile(context.readSource(file), file);
    if (!parsed) continue;
    const fileContext = buildFileContext(parsed, file, context);
    const candidates = selectCandidates(parsed, fileContext, page, context);
    const limit = context.config.maxExamplesPerStoryFile ?? 3;
    let used = 0;

    for (const story of candidates) {
      if (used >= limit) break;
      const example = buildExample(story, fileContext, context);
      if (!example.code) {
        skipped.push({ story: `${parsed.title}/${story.exportName}`, reason: example.reason });
        continue;
      }
      used += 1;
      storyIds.push(story.id);
      lines.push(...renderExample(page, parsed, story, example, multiFile, context), "");
    }
  }

  if (storyIds.length === 0) {
    lines.push(
      "No runnable examples are generated for this component yet. See the",
      `[Storybook](${context.config.storybookUrl}) entry for live variants.`,
      "",
    );
  }

  return { text: `${lines.join("\n").trimEnd()}\n`, storyIds, skipped };
}

/**
 * @returns {string[]}
 */
function renderExample(page, parsed, story, example, multiFile, context) {
  const leaf = parsed.title.split("/").pop();
  const heading = multiFile && leaf !== page.dir ? `${leaf} — ${story.name}` : story.name;
  const height = story.embedHeight ?? context.config.defaultEmbedHeight ?? 200;
  const title = heading.includes(" — ") ? heading : `${page.dir} — ${heading}`;
  const lines = [`## ${heading}`, ""];
  if (story.prose) lines.push(story.prose, "");
  lines.push(
    "<Frame>",
    `  <iframe src={${JSON.stringify(embedUrl(story.id, context.config))}} width="100%" height="${height}" style={{border: "none", borderRadius: "8px"}} loading="lazy" title=${JSON.stringify(title)} />`,
    "</Frame>",
    "",
    codeFence(example.code),
  );
  return lines;
}

/**
 * The URL is emitted as a JSX expression rather than a quoted attribute so the
 * `&` separators are never read as character references by the MDX parser.
 *
 * @param {string} id
 * @param {object} config
 * @returns {string}
 */
function embedUrl(id, config) {
  const params = [`id=${id}`, "viewMode=story", "shortcuts=false", "singleStory=true"];
  if (config.embedTheme) params.push(`globals=theme:${config.embedTheme}`);
  return `${config.chromaticIframeBase}?${params.join("&")}`;
}

/**
 * Indexes everything a story file declares or imports at module scope, which is
 * the lookup table the dependency resolver walks.
 */
function buildFileContext(parsed, file, context) {
  return {
    ...buildFixtureContext(file, context.readSource(file), parsed.ast, 0),
    componentName: parsed.componentName,
    metaArgs: parsed.metaArgs,
  };
}

/**
 * @param {object} statement An `ImportDeclaration`.
 * @param {Map<string, object>} imports
 */
function collectImports(statement, imports) {
  const module = statement.source.value;
  for (const specifier of statement.specifiers) {
    const record = {
      module,
      isType: statement.importKind === "type" || specifier.importKind === "type",
      namespace: specifier.type === "ImportNamespaceSpecifier",
      imported:
        specifier.type === "ImportSpecifier"
          ? (specifier.imported.name ?? specifier.imported.value)
          : specifier.local.name,
      isDefault: specifier.type === "ImportDefaultSpecifier",
    };
    imports.set(specifier.local.name, record);
  }
}

/**
 * @param {object | null} declaration
 * @param {object} statement The statement to slice source from.
 * @param {Map<string, object>} declarations
 */
function collectDeclarations(declaration, statement, declarations) {
  if (!declaration) return;
  if (declaration.type === "VariableDeclaration") {
    for (const declarator of declaration.declarations) {
      if (declarator.id.type !== "Identifier") continue;
      declarations.set(declarator.id.name, { node: declarator.init, statement });
    }
    return;
  }
  if (
    (declaration.type === "FunctionDeclaration" || declaration.type === "ClassDeclaration") &&
    declaration.id
  ) {
    declarations.set(declaration.id.name, { node: declaration, statement });
  }
}

/**
 * Story selection. Explicit config wins; otherwise a `docs` tag opts a story in,
 * and failing that the first few stories in file order stand in — always
 * skipping the ones marked as test fixtures or held out of autodocs.
 */
function selectCandidates(parsed, fileContext, page, context) {
  const overrides = context.config.storyOverrides?.[page.dir] ?? {};
  const eligible = parsed.stories
    .filter((story) => !story.tags.includes("!autodocs"))
    .filter((story) => !isTestOnly(story, fileContext.source))
    .filter((story) => !(overrides.exclude ?? []).includes(story.exportName))
    .map((story) => ({ ...story, ...readStoryDocs(story) }));

  if (overrides.include?.length) {
    const wanted = new Map(eligible.map((story) => [story.exportName, story]));
    return overrides.include.map((name) => wanted.get(name)).filter(Boolean);
  }
  const tagged = eligible.filter((story) => story.tags.includes("docs"));
  return tagged.length > 0 ? tagged : eligible;
}

/**
 * @param {object} story
 * @param {string} source
 * @returns {boolean}
 */
function isTestOnly(story, source) {
  const slice = source.slice(story.start, story.end);
  return NON_DOC_PARAMETERS.some((name) => slice.includes(name));
}

/**
 * @param {object} story
 * @returns {{ prose: string, embedHeight: number | undefined }}
 */
function readStoryDocs(story) {
  const parameters = story.annotations.parameters;
  const proseNode = objectPath(parameters, ["docs", "description", "story"]);
  const heightNode = objectPath(parameters, ["docs", "embedHeight"]);
  const prose = staticValue(proseNode);
  const height = staticValue(heightNode);
  return {
    prose: typeof prose === "string" ? jsdocToMdx(prose) : "",
    embedHeight: typeof height === "number" ? height : undefined,
  };
}

/**
 * Builds the example source for one story, or explains why it cannot be built.
 *
 * @returns {{ code: string | null, reason: string }}
 */
function buildExample(story, fileContext, context) {
  const body = renderStoryBody(story, fileContext);
  if (!body.text) return { code: null, reason: body.reason };

  const resolution = resolveDependencies(body.roots, fileContext, context);
  if (resolution.blocked) return { code: null, reason: resolution.blocked };

  const parts = [];
  const importBlock = renderImports(resolution.imports);
  if (importBlock) parts.push(importBlock);
  if (resolution.inlines.length > 0) parts.push(resolution.inlines.join("\n\n"));
  parts.push(body.text);
  const code = parts.join("\n\n");

  if (code.length > MAX_EXAMPLE_CHARS) {
    return { code: null, reason: `example source exceeds ${MAX_EXAMPLE_CHARS} characters` };
  }
  return { code, reason: "" };
}

/**
 * Args declared on the meta apply to every story in the file, so a story
 * written as `export const Default: Story = {}` is not empty — it is the meta's
 * args. Story-level args win on a key-by-key basis, exactly as Storybook merges
 * them.
 *
 * @returns {{ properties: object[], nodes: object[] }}
 */
function mergeArgs(metaArgs, storyArgs) {
  const byKey = new Map();
  const spreads = [];
  const nodes = [];
  for (const node of [metaArgs, storyArgs]) {
    if (node?.type !== "ObjectExpression") continue;
    nodes.push(node);
    for (const property of node.properties) {
      if (property.type === "SpreadElement") {
        spreads.push(property);
        continue;
      }
      if (property.type !== "ObjectProperty" || property.computed) continue;
      const key = property.key.name ?? property.key.value;
      if (typeof key === "string") byKey.set(key, property);
    }
  }
  return { properties: [...spreads, ...byKey.values()], nodes };
}

/**
 * @returns {{ text: string | null, roots: object[], reason: string }}
 */
function renderStoryBody(story, fileContext) {
  const render = story.annotations.render;
  const args = mergeArgs(fileContext.metaArgs, story.annotations.args);

  if (render) return renderFromRender(render, args, fileContext);
  if (!fileContext.componentName) {
    return { text: null, roots: [], reason: "story file has no `component` in meta" };
  }
  const text = synthesiseJsx(fileContext.componentName, args.properties, fileContext.source);
  return {
    text,
    roots: [...args.nodes, { type: "Identifier", name: fileContext.componentName }],
    reason: text ? "" : "args could not be rendered as JSX",
  };
}

/**
 * A render function that takes `args` is shown with those args spelled out as a
 * literal above it, which keeps the snippet both runnable and faithful to what
 * the embed above it is showing.
 *
 * @returns {{ text: string | null, roots: object[], reason: string }}
 */
function renderFromRender(render, args, fileContext) {
  const params = render.params ?? [];
  if (params.length === 0) {
    const text = renderFunctionSource(render, fileContext.source);
    return { text, roots: [render], reason: text ? "" : "unsupported render shape" };
  }
  if (params.length > 1 || params[0].type !== "Identifier") {
    return { text: null, roots: [], reason: "render function destructures its arguments" };
  }
  const body = renderFunctionSource(render, fileContext.source);
  if (!body) return { text: null, roots: [], reason: "unsupported render shape" };
  const literal = renderObjectLiteral(args.properties, fileContext.source);
  return {
    text: `const ${params[0].name} = ${literal};\n\n${body}`,
    roots: [render, ...args.nodes],
    reason: "",
  };
}

/**
 * @param {object[]} properties
 * @param {string} source
 * @returns {string}
 */
function renderObjectLiteral(properties, source) {
  if (properties.length === 0) return "{}";
  const entries = properties.map((property) => {
    if (property.type === "SpreadElement") {
      return `  ...${source.slice(property.argument.start, property.argument.end)},`;
    }
    const key = property.key.name ?? JSON.stringify(property.key.value);
    const literal = staticValue(property.value);
    const value =
      typeof literal === "string"
        ? JSON.stringify(shortenString(literal))
        : dedent(source.slice(property.value.start, property.value.end));
    return `  ${key}: ${value},`;
  });
  return `{\n${entries.join("\n")}\n}`;
}

/**
 * A zero-argument render arrow is the interesting case: its body *is* the
 * example, so it is unwrapped rather than shown as a callback.
 *
 * @param {object} node
 * @param {string} source
 * @returns {string | null}
 */
function renderFunctionSource(node, source) {
  if (node.type !== "ArrowFunctionExpression" && node.type !== "FunctionExpression") return null;
  const body = node.body;
  if (body.type === "BlockStatement") {
    return `function Example() ${dedent(source.slice(body.start, body.end))}`;
  }
  const inner = body.type === "ParenthesizedExpression" ? body.expression : body;
  return dedent(source.slice(inner.start, inner.end));
}

/**
 * Rebuilds `args` as the JSX a consumer would write.
 *
 * @param {string} componentName
 * @param {object[]} properties Merged args properties.
 * @param {string} source
 * @returns {string | null}
 */
function synthesiseJsx(componentName, properties, source) {
  const attributes = [];
  let children = null;

  for (const property of properties) {
    if (property.type === "SpreadElement") {
      attributes.push(`{...${source.slice(property.argument.start, property.argument.end)}}`);
      continue;
    }
    if (property.type !== "ObjectProperty" || property.computed) return null;
    const key = property.key.name ?? property.key.value;
    if (typeof key !== "string") return null;
    if (key === "children") {
      children = renderChildren(property.value, source);
      continue;
    }
    attributes.push(renderAttribute(key, property.value, source));
  }

  const open = `<${componentName}${attributes.map((item) => ` ${item}`).join("")}`;
  const wrap = open.length > 80;
  const head = wrap
    ? `<${componentName}\n${attributes.map((item) => `  ${item}`).join("\n")}\n`
    : open;

  if (children === null) return `${head}${wrap ? "/>" : " />"}`;
  const onOwnLines = wrap || children.includes("\n");
  const body = onOwnLines ? `\n${indent(children)}\n` : children;
  return `${head}>${body}</${componentName}>`;
}

/**
 * @param {string} key
 * @param {object} value
 * @param {string} source
 * @returns {string}
 */
function renderAttribute(key, value, source) {
  const literal = staticValue(value);
  if (typeof literal === "string") {
    const text = shortenString(literal);
    return text.includes('"') ? `${key}={${JSON.stringify(text)}}` : `${key}="${text}"`;
  }
  if (literal === true) return key;
  if (literal === false || typeof literal === "number") return `${key}={${String(literal)}}`;
  return `${key}={${dedent(source.slice(value.start, value.end))}}`;
}

/** Longer than this and a string is padding rather than illustration. */
const MAX_STRING_LITERAL = 120;

/**
 * Stories inline whole media files as base64 data URIs so Chromatic snapshots
 * stay offline and deterministic. That is the right call for a story and the
 * wrong one for a documentation example, so they become ordinary URLs.
 *
 * @param {string} value
 * @returns {string}
 */
function shortenString(value) {
  if (value.length <= MAX_STRING_LITERAL) return value;
  const dataUri = value.match(/^data:([a-z]+)\/([a-z0-9.+-]+)/i);
  if (dataUri) {
    const [, kind, subtype] = dataUri;
    return `https://example.com/sample.${subtype.replace(/^x-/, "")}`.replace(
      "sample.",
      kind === "image" ? "image." : "sample.",
    );
  }
  return `${value.slice(0, MAX_STRING_LITERAL).trimEnd()}…`;
}

/**
 * @param {object} value
 * @param {string} source
 * @returns {string}
 */
function renderChildren(value, source) {
  const literal = staticValue(value);
  if (typeof literal === "string") {
    return /[{}<>]/.test(literal) ? `{${JSON.stringify(literal)}}` : literal;
  }
  if (typeof literal === "number") return String(literal);
  if (value.type === "JSXElement" || value.type === "JSXFragment") {
    return dedent(source.slice(value.start, value.end));
  }
  if (value.type === "ArrayExpression") {
    return value.elements
      .map((element) => dedent(source.slice(element.start, element.end)))
      .join("\n");
  }
  return `{${dedent(source.slice(value.start, value.end))}}`;
}

/**
 * @param {string} text
 * @returns {string}
 */
function indent(text) {
  return text
    .split("\n")
    .map((line) => (line.trim() === "" ? line : `  ${line}`))
    .join("\n");
}

/**
 * Walks every identifier an example reaches for and decides its fate: a
 * published export becomes an import from its subpath, a peer dependency keeps
 * its own import, a local fixture is inlined, and a test-only binding blocks the
 * story.
 *
 * @returns {{ imports: Map<string, Set<string>>, inlines: string[], blocked: string }}
 */
function resolveDependencies(roots, fileContext, context) {
  /** @type {Map<string, Set<string>>} */
  const imports = new Map();
  /** @type {Map<string, { order: string, text: string }>} */
  const inlines = new Map();
  const seen = new Set();
  const queue = [];
  for (const root of roots) {
    for (const name of rootIdentifiers(root)) queue.push({ name, context: fileContext });
  }

  while (queue.length > 0) {
    const item = queue.shift();
    const key = `${item.context.file}#${item.name}`;
    if (seen.has(key)) continue;
    seen.add(key);

    const outcome = resolveName(item.name, item.context, context);
    if (outcome.blocked) return { imports, inlines: [], blocked: outcome.blocked };
    if (outcome.import) {
      const module = outcome.import.type ? `type:${outcome.import.module}` : outcome.import.module;
      addImport(imports, module, outcome.import.name);
    }
    if (outcome.inline) inlines.set(outcome.inline.order, outcome.inline);
    for (const next of outcome.next ?? []) queue.push(next);
  }

  const ordered = [...inlines.values()]
    .sort((a, b) => a.order.localeCompare(b.order))
    .map((entry) => entry.text);
  return { imports, inlines: ordered, blocked: "" };
}

/**
 * @param {object} root
 * @returns {Set<string>}
 */
function rootIdentifiers(root) {
  if (root.type === "Identifier") return new Set([root.name]);
  return referencedIdentifiers(root);
}

/**
 * @returns {{ blocked?: string, import?: object, inline?: object, next?: object[] }}
 */
function resolveName(name, fileContext, context) {
  const declaration = fileContext.declarations.get(name);
  if (declaration) return inlineDeclaration(name, declaration, fileContext);

  const imported = fileContext.imports.get(name);
  if (!imported) return {};
  if (IGNORED_MODULES.has(imported.module)) return {};

  if (imported.isType) {
    const published = context.publishedExports.get(imported.imported);
    return published ? { import: { module: published.subpath, name, type: true } } : {};
  }

  if (!imported.module.startsWith(".")) {
    if (!ALLOWED_PACKAGES.has(imported.module)) {
      return { blocked: `imports \`${name}\` from test-only module \`${imported.module}\`` };
    }
    const specifier = imported.namespace ? `* as ${name}` : imported.imported;
    return { import: { module: imported.module, name: specifier } };
  }

  return resolveRelative(name, imported, fileContext, context);
}

/**
 * @returns {{ blocked?: string, import?: object, inline?: object, next?: object[] }}
 */
function resolveRelative(name, imported, fileContext, context) {
  const published = context.publishedExports.get(imported.imported);
  const target = resolveModulePath(fileContext.file, imported.module, context);
  if (published && target && published.file === target) {
    return { import: { module: published.subpath, name: imported.imported } };
  }
  if (!target) return { blocked: `cannot resolve \`${imported.module}\`` };
  if (fileContext.hops >= MAX_FILE_HOPS) {
    return { blocked: `fixture \`${name}\` is nested more than ${MAX_FILE_HOPS} files deep` };
  }

  const nested = context.fixtureContext(target, fileContext.hops + 1);
  if (!nested) return { blocked: `cannot read fixture module \`${imported.module}\`` };
  const declaration = nested.declarations.get(imported.imported);
  if (!declaration) return { blocked: `fixture \`${name}\` is not a plain declaration` };
  return inlineDeclaration(imported.imported, declaration, nested, name);
}

/**
 * @returns {{ inline: object, next: object[] }}
 */
function inlineDeclaration(name, declaration, fileContext, alias) {
  const literal = staticValue(declaration.node);
  const text =
    typeof literal === "string" && literal.length > MAX_STRING_LITERAL
      ? `const ${name} = ${JSON.stringify(shortenString(literal))};`
      : dedent(
          fileContext.source
            .slice(declaration.statement.start, declaration.statement.end)
            .replace(/^export\s+/, ""),
        );
  const renamed = alias && alias !== name ? `${text}\n\nconst ${alias} = ${name};` : text;
  return {
    inline: {
      order: `${fileContext.file}:${String(declaration.statement.start).padStart(8, "0")}`,
      text: renamed,
    },
    next: [...referencedIdentifiers(declaration.node ?? declaration.statement)].map((next) => ({
      name: next,
      context: fileContext,
    })),
  };
}

/**
 * @param {string} fromFile
 * @param {string} specifier
 * @param {object} context
 * @returns {string | null}
 */
function resolveModulePath(fromFile, specifier, context) {
  const base = path.posix.join(path.posix.dirname(fromFile), specifier);
  for (const extension of [".tsx", ".ts", "/index.tsx", "/index.ts"]) {
    if (context.fileExists(`${base}${extension}`)) return `${base}${extension}`;
  }
  return null;
}

/**
 * @param {Map<string, Set<string>>} imports
 * @param {string} module
 * @param {string} name
 */
function addImport(imports, module, name) {
  if (!imports.has(module)) imports.set(module, new Set());
  imports.get(module).add(name);
}

/**
 * React first, then the library, then peer dependencies — the order a hand
 * written example would use.
 *
 * @param {Map<string, Set<string>>} imports
 * @returns {string}
 */
function renderImports(imports) {
  const rank = (module) => {
    const bare = module.replace(/^type:/, "");
    if (bare === "react") return 0;
    if (bare.startsWith("@fanvue/ui")) return 1;
    return 2;
  };
  return [...imports.entries()]
    .sort((a, b) => rank(a[0]) - rank(b[0]) || a[0].localeCompare(b[0]))
    .map(([module, names]) => {
      const sorted = [...names].sort((a, b) => a.localeCompare(b));
      const namespace = sorted.find((name) => name.startsWith("* as "));
      if (namespace) return `import ${namespace} from "${module}";`;
      const keyword = module.startsWith("type:") ? "import type" : "import";
      const bare = module.replace(/^type:/, "");
      const line = `${keyword} { ${sorted.join(", ")} } from "${bare}";`;
      if (line.length <= 96) return line;
      return [`${keyword} {`, ...sorted.map((name) => `  ${name},`), `} from "${bare}";`].join(
        "\n",
      );
    })
    .join("\n");
}

/**
 * Exposed for the fixture resolver in the orchestrator, which needs the same
 * module-scope index for a non-story file.
 *
 * @param {string} file
 * @param {string} source
 * @param {object} ast
 * @param {number} hops
 * @returns {object}
 */
export function buildFixtureContext(file, source, ast, hops) {
  const declarations = new Map();
  const imports = new Map();
  for (const statement of ast.program.body) {
    if (statement.type === "ImportDeclaration") {
      collectImports(statement, imports);
      continue;
    }
    const declaration =
      statement.type === "ExportNamedDeclaration" ? statement.declaration : statement;
    collectDeclarations(declaration, statement, declarations);
  }
  return { file, source, declarations, imports, componentName: null, metaArgs: null, hops };
}
