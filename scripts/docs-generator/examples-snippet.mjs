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
import {
  columnAt,
  dedent,
  objectPath,
  referencedIdentifiers,
  sliceNode,
  staticValue,
  walk,
} from "./ast.mjs";
import { codeFence, GENERATED_BANNER, jsdocToMdx } from "./mdx.mjs";
import { parseStoryFile } from "./storybook-csf.mjs";

/**
 * Modules an example may import from. Anything else means the story is
 * test-only. These are the package's declared peer dependencies plus React
 * itself — `@radix-ui/react-slot` and `react-dom` are as legitimate in an
 * example as `motion` is.
 */
const ALLOWED_PACKAGES = new Set([
  "react",
  "react-dom",
  "recharts",
  "react-day-picker",
  "motion",
  "motion/react",
  "@radix-ui/react-slot",
]);

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
  const perFile = limitFor(context.config, "maxExamplesPerStoryFile", page.dir, 5);
  const perPage = limitFor(context.config, "maxExamplesPerPage", page.dir, 8);
  /** Two stories can differ only in a `chromatic` parameter; one is enough here. */
  const seenCode = new Set();

  for (const file of files) {
    if (storyIds.length >= perPage) break;
    const parsed = parseStoryFile(context.readSource(file), file);
    if (!parsed) continue;
    const fileContext = buildFileContext(parsed, file, context);
    const candidates = selectCandidates(parsed, page, context);
    let used = 0;

    for (const story of candidates) {
      if (used >= perFile || storyIds.length >= perPage) break;
      const example = buildExample(story, fileContext, context);
      if (!example.code) {
        skipped.push({ story: `${parsed.title}/${story.exportName}`, reason: example.reason });
        continue;
      }
      if (seenCode.has(example.code)) {
        skipped.push({
          story: `${parsed.title}/${story.exportName}`,
          reason: "renders the same source as an example already on the page",
        });
        continue;
      }
      seenCode.add(example.code);
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
 * @param {object} config
 * @param {string} key
 * @param {string} dir
 * @param {number} fallback
 * @returns {number}
 */
function limitFor(config, key, dir, fallback) {
  const setting = config[key];
  if (typeof setting === "number") return setting;
  const override = setting?.byComponent?.[dir];
  if (typeof override === "number") return override;
  return typeof setting?.default === "number" ? setting.default : fallback;
}

/**
 * Embed height, most specific source first.
 *
 * Every embed used to be 200px, which clipped a calendar, every chart, every
 * dialog and every multi-state matrix. The category is the coarse signal (a
 * chart is always taller than a badge), the component and story maps are for
 * the outliers, and a story may still name its own height in `parameters`.
 *
 * @returns {number}
 */
export function embedHeight(config, { category, component, storyId, story }) {
  const heights = config.embedHeights ?? {};
  if (typeof story?.embedHeight === "number") return story.embedHeight;
  const byStory = heights.byStory?.[storyId];
  if (typeof byStory === "number") return byStory;
  const byComponent = heights.byComponent?.[component];
  if (typeof byComponent === "number") return byComponent;
  const byCategory = heights.byCategory?.[category];
  if (typeof byCategory === "number") return byCategory;
  return heights.default ?? config.defaultEmbedHeight ?? 240;
}

/**
 * Storybook derives story names by splitting on case boundaries, which pushes a
 * trailing version digit into its own word (`AllStylesV2` -> `All Styles V 2`).
 * Only the visible heading is rejoined: `story.name` itself feeds the story id,
 * so it must stay byte-identical to Storybook's own derivation.
 *
 * @param {string} name
 * @returns {string}
 */
function headingText(name) {
  return name.replace(/\b([A-Z]) (\d+)\b/g, "$1$2");
}

/**
 * @returns {string[]}
 */
function renderExample(page, parsed, story, example, multiFile, context) {
  const leaf = parsed.title.split("/").pop();
  const storyHeading = headingText(story.name);
  const heading = multiFile && leaf !== page.dir ? `${leaf} — ${storyHeading}` : storyHeading;
  const height = embedHeight(context.config, {
    category: context.config.categories?.[page.dir],
    component: page.dir,
    storyId: story.id,
    story,
  });
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
      // The declarator, not just its initialiser: `const SIZES: AvatarSize[] =
      // […]` reaches for a type that only appears in the annotation, and a
      // fixture whose type is invisible to the resolver is emitted without the
      // import that makes it compile.
      declarations.set(declarator.id.name, { node: declarator.init, statement, scope: declarator });
    }
    return;
  }
  if (
    (declaration.type === "FunctionDeclaration" || declaration.type === "ClassDeclaration") &&
    declaration.id
  ) {
    declarations.set(declaration.id.name, { node: declaration, statement, scope: declaration });
    return;
  }
  // Local `type` / `interface` / `enum` declarations are as much a dependency of
  // an example as a fixture value is: `const rows: ProductRow[]` does not
  // compile next to an import block that has never heard of `ProductRow`.
  if (
    (declaration.type === "TSTypeAliasDeclaration" ||
      declaration.type === "TSInterfaceDeclaration" ||
      declaration.type === "TSEnumDeclaration") &&
    declaration.id
  ) {
    declarations.set(declaration.id.name, {
      node: declaration,
      statement,
      scope: declaration,
      isType: declaration.type !== "TSEnumDeclaration",
    });
  }
}

/**
 * What a story's name says it is *about*. Order matters: the first matching
 * facet wins, so `AllVariants` is an overview rather than a variant.
 */
const FACETS = [
  // Case-sensitive: story export names are PascalCase, so `^All` before another
  // capital is "AllStyles" and not "Alignment".
  {
    name: "overview",
    test: /^All(?=[A-Z_]|$)|Matrix|Showcase|Overview|Gallery|Kitchen|Permutation/,
  },
  { name: "default", test: /^(default|basic|example|playground|simple|standard)$/i },
  {
    name: "state",
    test: /loading|disabled|error|invalid|active|selected|checked|indeterminate|readonly|read-only|empty|open$|closed|expanded|collapsed|pending|skeleton|focus|hover|unknown|placeholder|required|busy|offline|online/i,
  },
  { name: "size", test: /size|small|medium|large|compact|dense|\b(xs|sm|md|lg|xl)\b|\d\dpx/i },
  {
    name: "composition",
    test: /^with|without|icon|label|helper|caption|action|footer|header|children|slot|custom|nested|controlled|form|truncat|long|multi|scroll/i,
  },
  {
    name: "variant",
    test: /primary|secondary|tertiary|outline|brand|destructive|ghost|link|filled|solid|white|inverted|negative|variant|hierarchy|tone|colou?r|style|theme|dark|light/i,
  },
];

/**
 * The order facets are drawn from when building the shortlist. One story per
 * facet is taken per round, so a page that keeps four examples shows four
 * *different kinds* of example rather than the first four in file order.
 */
const FACET_PRIORITY = ["default", "variant", "state", "size", "composition", "overview", "other"];

/**
 * Story selection. Explicit config wins; otherwise a `docs` tag opts a story in,
 * and failing that every story that is not held out of autodocs is a candidate,
 * ordered so the shortlist spans variants, states, sizes and composition.
 *
 * `E2E_FIXTURE_PARAMETERS` / `NON_VISUAL_STORY_PARAMETERS` are deliberately
 * *not* a filter: they set `chromatic.disableSnapshot` and nothing else. Reading
 * them as "not documentation-worthy" is what left the Button page showing three
 * icon slots and none of its twelve variants, sizes or loading state.
 */
function selectCandidates(parsed, page, context) {
  const overrides = context.config.storyOverrides?.[page.dir] ?? {};
  const eligible = parsed.stories
    .filter((story) => !story.tags.includes("!autodocs"))
    .filter((story) => !(overrides.exclude ?? []).includes(story.exportName))
    .map((story) => ({ ...story, ...readStoryDocs(story) }));

  if (overrides.include?.length) {
    const wanted = new Map(eligible.map((story) => [story.exportName, story]));
    return overrides.include.map((name) => wanted.get(name)).filter(Boolean);
  }
  const tagged = eligible.filter((story) => story.tags.includes("docs"));
  return spreadByFacet(tagged.length > 0 ? tagged : eligible);
}

/**
 * @param {string} name
 * @returns {string}
 */
function facetOf(name) {
  return FACETS.find((facet) => facet.test.test(name))?.name ?? "other";
}

/**
 * Round-robins the stories across their facets, preserving file order within
 * each facet, so truncating the list to N still yields a representative spread.
 *
 * @param {object[]} stories
 * @returns {object[]}
 */
function spreadByFacet(stories) {
  /** @type {Map<string, object[]>} */
  const buckets = new Map();
  for (const story of stories) {
    const facet = facetOf(story.exportName);
    if (!buckets.has(facet)) buckets.set(facet, []);
    buckets.get(facet).push(story);
  }
  const order = [...buckets.keys()].sort((a, b) => {
    const rank = (name) => {
      const index = FACET_PRIORITY.indexOf(name);
      return index === -1 ? FACET_PRIORITY.length : index;
    };
    return rank(a) - rank(b) || a.localeCompare(b);
  });

  const out = [];
  for (let round = 0; out.length < stories.length; round += 1) {
    let added = false;
    for (const facet of order) {
      const story = buckets.get(facet)[round];
      if (!story) continue;
      out.push(story);
      added = true;
    }
    if (!added) break;
  }
  return out;
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
  const body = renderStoryBody(story, fileContext, context);
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
 * `args: defaultArgs` and `args: { ...defaultArgs, tag: undefined }` are both
 * ordinary in this library, so an identifier is followed to its declaration and
 * a spread of a known object is flattened in place. Refusing to do either is
 * what published a bare `<CreatorCover />` with none of its required props.
 *
 * @returns {{ properties: object[], nodes: object[], blocked: string }}
 */
function mergeArgs(metaArgs, storyArgs, fileContext) {
  /** @type {object[]} */
  const properties = [];
  /** @type {Map<string, number>} */
  const indexByKey = new Map();
  const nodes = [];
  let blocked = "";

  const put = (key, property) => {
    const existing = indexByKey.get(key);
    if (existing !== undefined) {
      properties[existing] = property;
      return;
    }
    if (key !== null) indexByKey.set(key, properties.length);
    properties.push(property);
  };

  const absorb = (node, depth) => {
    const object = resolveObjectExpression(node, fileContext);
    if (!object) {
      blocked ||= `args are \`${describeNode(node, fileContext.source)}\`, which is not a resolvable object literal`;
      return;
    }
    nodes.push(object);
    for (const property of object.properties) {
      if (property.type === "SpreadElement") {
        if (depth < 4 && resolveObjectExpression(property.argument, fileContext)) {
          absorb(property.argument, depth + 1);
        } else {
          put(null, property);
        }
        continue;
      }
      if (property.type !== "ObjectProperty" || property.computed) {
        put(null, property);
        continue;
      }
      const key = property.key.name ?? property.key.value;
      put(typeof key === "string" ? key : null, property);
    }
  };

  for (const node of [metaArgs, storyArgs]) if (node) absorb(node, 0);

  // `tag: undefined` in a spread override means "unset", not "pass undefined".
  return {
    properties: properties.filter((property) => !isUndefinedProperty(property)),
    nodes,
    blocked,
  };
}

/**
 * @param {object | null | undefined} node
 * @returns {boolean}
 */
function isUndefinedProperty(node) {
  return (
    node?.type === "ObjectProperty" &&
    node.value?.type === "Identifier" &&
    node.value.name === "undefined"
  );
}

/**
 * Follows identifiers and type assertions down to an object literal.
 *
 * @param {object | null | undefined} node
 * @param {object} fileContext
 * @returns {object | null}
 */
function resolveObjectExpression(node, fileContext, seen = new Set()) {
  if (!node) return null;
  switch (node.type) {
    case "ObjectExpression":
      return node;
    case "TSAsExpression":
    case "TSSatisfiesExpression":
    case "TSNonNullExpression":
    case "ParenthesizedExpression":
      return resolveObjectExpression(node.expression, fileContext, seen);
    case "Identifier": {
      if (seen.has(node.name)) return null;
      seen.add(node.name);
      const declaration = fileContext.declarations.get(node.name);
      return declaration ? resolveObjectExpression(declaration.node, fileContext, seen) : null;
    }
    default:
      return null;
  }
}

/**
 * @param {object | null | undefined} node
 * @param {string} source
 * @returns {string}
 */
function describeNode(node, source) {
  if (!node) return "missing";
  const text = source.slice(node.start, node.end).replace(/\s+/g, " ");
  return text.length > 40 ? `${text.slice(0, 40)}…` : text;
}

/**
 * @returns {{ text: string | null, roots: object[], reason: string }}
 */
function renderStoryBody(story, fileContext, context) {
  const render = story.annotations.render;
  const args = mergeArgs(fileContext.metaArgs, story.annotations.args, fileContext);
  if (args.blocked) return { text: null, roots: [], reason: args.blocked };

  if (render) return renderFromRender(render, args, fileContext, context);
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
 * A render function that takes `args` is Storybook plumbing, not something a
 * consumer would ever write: nobody builds an `args` object just to spread it
 * into one element. The args are therefore substituted into the JSX as real
 * attributes, and the `const args = …` form is kept only for the shapes that
 * cannot be resolved statically — which are reported rather than silently
 * published.
 *
 * @returns {{ text: string | null, roots: object[], reason: string }}
 */
function renderFromRender(render, args, fileContext, context) {
  const params = render.params ?? [];
  if (params.length === 0) {
    const text = renderFunctionSource(render, fileContext.source);
    return { text, roots: [render], reason: text ? "" : "unsupported render shape" };
  }
  if (params.length > 1 || params[0].type !== "Identifier") {
    return { text: null, roots: [], reason: "render function destructures its arguments" };
  }

  const argName = params[0].name;
  const substituted = substituteArgs(render, argName, args, fileContext);
  if (substituted.text) {
    return { text: substituted.text, roots: [render, ...args.nodes], reason: "" };
  }

  const body = renderFunctionSource(render, fileContext.source);
  if (!body) return { text: null, roots: [], reason: "unsupported render shape" };
  context.onSpreadFallback?.(substituted.reason);
  const literal = renderObjectLiteral(args.properties, fileContext.source);
  return {
    text: `const ${argName} = ${literal};\n\n${body}`,
    roots: [render, ...args.nodes],
    reason: "",
  };
}

/**
 * Rewrites `<Card {...args} className="…">` as `<Card hierarchy="primary" …
 * className="…">`, which is the line a reader is meant to copy.
 *
 * @returns {{ text: string | null, reason: string }}
 */
function substituteArgs(render, argName, args, fileContext) {
  const source = fileContext.source;
  /** @type {object[]} */
  const targets = [];
  const isArgSpread = (attribute) =>
    attribute.type === "JSXSpreadAttribute" &&
    attribute.argument.type === "Identifier" &&
    attribute.argument.name === argName;

  /** @type {object[]} */
  const reads = [];
  let otherUse = "";
  walk(render.body, (node) => {
    if (node.type === "JSXElement" && node.openingElement.attributes.some(isArgSpread)) {
      targets.push(node);
    }
    if (node.type === "JSXSpreadAttribute" && isArgSpread(node)) return false;
    // `useState(args.value)` is plumbing too — the value is right there, so read
    // it out rather than keeping the object alive just to index into it.
    if (
      node.type === "MemberExpression" &&
      !node.computed &&
      node.object.type === "Identifier" &&
      node.object.name === argName &&
      node.property.type === "Identifier"
    ) {
      reads.push(node);
      return false;
    }
    if (node.type === "Identifier" && node.name === argName) {
      otherUse ||= `\`${argName}\` is read in a way that cannot be inlined`;
    }
    return true;
  });

  if (otherUse) return { text: null, reason: otherUse };

  /** @type {{ start: number, end: number, text: string }[]} */
  const readReplacements = [];
  const byKey = new Map();
  for (const property of args.properties) {
    if (property.type !== "ObjectProperty" || property.computed) continue;
    const key = property.key.name ?? property.key.value;
    if (typeof key === "string") byKey.set(key, property.value);
  }
  for (const read of reads) {
    const value = byKey.get(read.property.name);
    if (!value) {
      return { text: null, reason: `\`${argName}.${read.property.name}\` is not in the args` };
    }
    const literal = staticValue(value);
    readReplacements.push({
      start: read.start,
      end: read.end,
      text:
        typeof literal === "string"
          ? JSON.stringify(shortenString(literal))
          : reindent(sliceNode(source, value), columnAt(source, read.start)),
    });
  }

  if (targets.length === 0 && readReplacements.length > 0) {
    const text = renderFunctionSource(render, source, readReplacements);
    return { text, reason: text ? "" : "unsupported render shape" };
  }
  if (targets.length === 0) {
    // The render ignores its args entirely; the literal would be dead weight.
    const text = renderFunctionSource(render, source);
    return { text, reason: text ? "" : "unsupported render shape" };
  }

  const replacements = [...readReplacements];
  for (const element of targets) {
    const rebuilt = rebuildElement(element, isArgSpread, args, source);
    if (!rebuilt) {
      return { text: null, reason: `spread into \`<${elementName(element, source)}>\` collides` };
    }
    // A rebuilt element swallows any `args.x` reads inside it.
    for (let index = replacements.length - 1; index >= 0; index -= 1) {
      const item = replacements[index];
      if (item.start >= rebuilt.start && item.end <= rebuilt.end) replacements.splice(index, 1);
    }
    replacements.push(rebuilt);
  }

  const text = renderFunctionSource(render, source, replacements);
  return { text, reason: text ? "" : "unsupported render shape" };
}

/**
 * @param {object} element
 * @param {string} source
 * @returns {string}
 */
function elementName(element, source) {
  const name = element.openingElement.name;
  return source.slice(name.start, name.end);
}

/**
 * Rebuilds one JSX element with the spread expanded into real attributes.
 *
 * @returns {{ start: number, end: number, text: string } | null}
 */
function rebuildElement(element, isArgSpread, args, source) {
  const opening = element.openingElement;
  const attributes = opening.attributes;
  const spreadIndex = attributes.findIndex(isArgSpread);
  /** @type {Map<string, number>} */
  const explicit = new Map();
  for (const [index, attribute] of attributes.entries()) {
    if (attribute.type !== "JSXAttribute") continue;
    const name = attribute.name.name ?? attribute.name.value;
    if (typeof name === "string") explicit.set(name, index);
  }

  const baseColumn = columnAt(source, element.start);
  const expanded = [];
  let childrenNode = null;
  for (const property of args.properties) {
    if (property.type === "SpreadElement") {
      expanded.push(`{...${source.slice(property.argument.start, property.argument.end)}}`);
      continue;
    }
    if (property.type !== "ObjectProperty" || property.computed) return null;
    const key = property.key.name ?? property.key.value;
    if (typeof key !== "string") return null;
    if (key === "children") {
      childrenNode = property.value;
      continue;
    }
    const collision = explicit.get(key);
    // A JSX attribute written after the spread already wins at runtime, so the
    // arg is genuinely dead. One written *before* it does not, and reordering
    // would change behaviour — leave that shape to the fallback.
    if (collision !== undefined) {
      if (collision > spreadIndex) continue;
      return null;
    }
    expanded.push(reindent(renderAttribute(key, property.value, source), baseColumn + 2));
  }

  const parts = [];
  for (const [index, attribute] of attributes.entries()) {
    if (index === spreadIndex) {
      parts.push(...expanded);
      continue;
    }
    parts.push(reindent(sliceNode(source, attribute), baseColumn + 2));
  }

  const hasOwnChildren = element.children.some(
    (child) => child.type !== "JSXText" || child.value.trim() !== "",
  );
  // JSX children beat a `children` arg at runtime, so only an element with none
  // of its own gets the arg spelled out.
  const children = childrenNode && !hasOwnChildren ? renderChildren(childrenNode, source) : null;
  const selfClose = !children && !hasOwnChildren && opening.selfClosing;
  const tag = elementName(element, source);
  const head = renderOpeningTag(tag, parts, baseColumn, selfClose);

  if (children === null) {
    return { start: opening.start, end: opening.end, text: head };
  }
  const pad = " ".repeat(baseColumn);
  const body = reindent(children, baseColumn + 2);
  return {
    start: element.start,
    end: element.end,
    text: `${head}\n${pad}  ${body}\n${pad}</${tag}>`,
  };
}

/**
 * @param {string} tag
 * @param {string[]} parts
 * @param {number} baseColumn
 * @param {boolean} selfClose
 * @returns {string}
 */
function renderOpeningTag(tag, parts, baseColumn, selfClose) {
  const tail = selfClose ? " />" : ">";
  const single = `<${tag}${parts.map((part) => ` ${part}`).join("")}${tail}`;
  if (!single.includes("\n") && baseColumn + single.length <= 96) return single;
  const pad = " ".repeat(baseColumn);
  return [
    `<${tag}`,
    ...parts.map((part) => `${pad}  ${part}`),
    `${pad}${selfClose ? "/>" : ">"}`,
  ].join("\n");
}

/**
 * @param {string} text
 * @param {number} column
 * @returns {string}
 */
function reindent(text, column) {
  const pad = " ".repeat(column);
  return text
    .split("\n")
    .map((line, index) => (index === 0 || line.trim() === "" ? line : `${pad}${line}`))
    .join("\n");
}

/**
 * @param {string} source
 * @param {number} start
 * @param {number} end
 * @param {{ start: number, end: number, text: string }[]} replacements
 * @returns {string}
 */
function applyReplacements(source, start, end, replacements) {
  const inside = replacements
    .filter((item) => item.start >= start && item.end <= end)
    .sort((a, b) => a.start - b.start);
  let out = "";
  let cursor = start;
  for (const item of inside) {
    if (item.start < cursor) continue;
    out += source.slice(cursor, item.start) + item.text;
    cursor = item.end;
  }
  return out + source.slice(cursor, end);
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
        : reindent(sliceNode(source, property.value), 2);
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
 * @param {{ start: number, end: number, text: string }[]} [replacements]
 * @returns {string | null}
 */
function renderFunctionSource(node, source, replacements = []) {
  if (node.type !== "ArrowFunctionExpression" && node.type !== "FunctionExpression") return null;
  const body = node.body;
  if (body.type === "BlockStatement") {
    const text = applyReplacements(source, body.start, body.end, replacements);
    return `function Example() ${dedent(text, columnAt(source, body.start))}`;
  }
  const inner = body.type === "ParenthesizedExpression" ? body.expression : body;
  const text = applyReplacements(source, inner.start, inner.end, replacements);
  return dedent(text, columnAt(source, inner.start));
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
  const wrap = open.length > 80 || open.includes("\n");
  // An attribute whose value is itself multi-line JSX has to be re-indented, or
  // its continuation lines land against the left margin of the code fence.
  const head = wrap
    ? `<${componentName}\n${attributes.map((item) => `  ${reindent(item, 2)}`).join("\n")}\n`
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
  return `${key}={${sliceNode(source, value)}}`;
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
    return sliceNode(source, value);
  }
  if (value.type === "ArrayExpression") {
    return value.elements.map((element) => sliceNode(source, element)).join("\n");
  }
  return `{${sliceNode(source, value)}}`;
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
  /** @type {Map<string, object>} */
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
    if (outcome.import) addImport(imports, outcome.import);
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
  if (!imported) {
    // `React.ReactNode` in a fixture's type annotation is a real dependency even
    // when the story file relies on the automatic JSX runtime and never imports
    // React itself. Emitting the example without it would not compile.
    if (name === "React") return { import: { module: "react", default: "React", type: true } };
    return {};
  }
  if (IGNORED_MODULES.has(imported.module)) return {};

  if (!imported.module.startsWith(".")) {
    if (!ALLOWED_PACKAGES.has(imported.module)) {
      if (imported.isType) return {};
      return { blocked: `imports \`${name}\` from test-only module \`${imported.module}\`` };
    }
    return { import: bareImport(imported, name) };
  }

  return resolveRelative(name, imported, fileContext, context);
}

/**
 * @param {object} imported
 * @param {string} local
 * @returns {object}
 */
function bareImport(imported, local) {
  if (imported.namespace) return { module: imported.module, namespace: local };
  if (imported.isDefault) return { module: imported.module, default: local };
  return { module: imported.module, named: specifier(imported.imported, local) };
}

/**
 * `import { ButtonProps as BP }` has to keep the `as`: emitting the local alias
 * on its own names an export the package does not have.
 *
 * @param {string} exported
 * @param {string} local
 * @returns {string}
 */
function specifier(exported, local) {
  return exported === local ? local : `${exported} as ${local}`;
}

/**
 * @returns {{ blocked?: string, import?: object, inline?: object, next?: object[] }}
 */
function resolveRelative(name, imported, fileContext, context) {
  const published = context.publishedExports.get(imported.imported);
  const target = resolveModulePath(fileContext.file, imported.module, context);
  // The identity check matters for types as much as for values: a local
  // `ChipSize` that happens to share a name with a published export must not be
  // rewritten into an import from the package.
  if (published && target && published.file === target) {
    return {
      import: {
        module: published.subpath,
        named: specifier(imported.imported, name),
        type: imported.isType || published.isType,
      },
    };
  }
  if (!target) {
    if (imported.isType) return {};
    return { blocked: `cannot resolve \`${imported.module}\`` };
  }
  if (fileContext.hops >= MAX_FILE_HOPS) {
    return { blocked: `fixture \`${name}\` is nested more than ${MAX_FILE_HOPS} files deep` };
  }

  const nested = context.fixtureContext(target, fileContext.hops + 1);
  if (!nested) return { blocked: `cannot read fixture module \`${imported.module}\`` };
  const declaration = nested.declarations.get(imported.imported);
  if (!declaration) {
    if (imported.isType) return {};
    return { blocked: `fixture \`${name}\` is not a plain declaration` };
  }
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
          columnAt(fileContext.source, declaration.statement.start),
        );
  const renamed =
    alias && alias !== name
      ? `${text}\n\n${declaration.isType ? `type ${alias} = ${name};` : `const ${alias} = ${name};`}`
      : text;
  return {
    inline: {
      order: `${fileContext.file}:${String(declaration.statement.start).padStart(8, "0")}`,
      text: renamed,
    },
    // The whole declarator, so its TS type annotation is scanned alongside its
    // initialiser.
    next: [
      ...referencedIdentifiers(declaration.scope ?? declaration.node ?? declaration.statement),
    ].map((next) => ({ name: next, context: fileContext })),
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
 * @param {Map<string, object>} imports
 * @param {{ module: string, type?: boolean, named?: string, default?: string, namespace?: string }} record
 */
function addImport(imports, record) {
  const key = record.type ? `type:${record.module}` : record.module;
  if (!imports.has(key)) {
    imports.set(key, { module: record.module, type: Boolean(record.type), named: new Set() });
  }
  const entry = imports.get(key);
  if (record.named) entry.named.add(record.named);
  if (record.default) entry.default = record.default;
  if (record.namespace) entry.namespace = record.namespace;
}

/**
 * React first, then the library, then peer dependencies — the order a hand
 * written example would use.
 *
 * A module can legitimately need more than one statement (a namespace import
 * cannot share a statement with named ones), so each entry renders every form
 * it actually collected rather than the first one that matched.
 *
 * @param {Map<string, object>} imports
 * @returns {string}
 */
function renderImports(imports) {
  const rank = (module) => {
    if (module === "react" || module === "react-dom") return 0;
    if (module.startsWith("@fanvue/ui")) return 1;
    return 2;
  };
  const lines = [];
  for (const [, entry] of [...imports.entries()].sort(
    (a, b) => rank(a[1].module) - rank(b[1].module) || a[0].localeCompare(b[0]),
  )) {
    const keyword = entry.type ? "import type" : "import";
    if (entry.namespace) {
      lines.push(`${keyword} * as ${entry.namespace} from "${entry.module}";`);
    }
    const named = [...entry.named].sort((a, b) => a.localeCompare(b));
    if (named.length === 0 && !entry.default) continue;
    const clause = [
      ...(entry.default ? [entry.default] : []),
      ...(named.length > 0 ? [`{ ${named.join(", ")} }`] : []),
    ].join(", ");
    const line = `${keyword} ${clause} from "${entry.module}";`;
    if (line.length <= 96 || named.length === 0) {
      lines.push(line);
      continue;
    }
    const head = entry.default ? `${keyword} ${entry.default}, {` : `${keyword} {`;
    lines.push(
      [head, ...named.map((name) => `  ${name},`), `} from "${entry.module}";`].join("\n"),
    );
  }
  return lines.join("\n");
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
