/**
 * A tiny, dependency-free walker over Babel AST nodes.
 *
 * Babel nodes are plain objects, so traversal needs nothing beyond a recursive
 * descent. Avoiding `@babel/traverse` keeps the generator's dependency surface
 * to `react-docgen-typescript` and whatever Storybook already ships.
 */

const SKIP_KEYS = new Set(["loc", "leadingComments", "trailingComments", "innerComments", "extra"]);

/**
 * Depth-first walk. The visitor is called with every node; returning `false`
 * prunes that node's children.
 *
 * @param {object | null | undefined} node
 * @param {(node: object, parent: object | null, key: string | null) => boolean | void} visit
 * @param {object | null} [parent]
 * @param {string | null} [key]
 */
export function walk(node, visit, parent = null, key = null) {
  if (!node || typeof node !== "object") return;
  if (Array.isArray(node)) {
    for (const child of node) walk(child, visit, parent, key);
    return;
  }
  if (typeof node.type !== "string") return;
  if (visit(node, parent, key) === false) return;
  for (const [childKey, child] of Object.entries(node)) {
    if (SKIP_KEYS.has(childKey)) continue;
    if (child && typeof child === "object") walk(child, visit, node, childKey);
  }
}

/**
 * Collects every identifier name that is *referenced* by a subtree, skipping
 * positions that only ever name something rather than read it: object keys,
 * non-computed member accesses, JSX attribute names and import specifiers.
 *
 * Callers look each name up in a known-bindings map, so the occasional false
 * positive (a shadowing local) costs nothing unless the name collides.
 *
 * @param {object} node
 * @returns {Set<string>}
 */
export function referencedIdentifiers(node) {
  const names = new Set();
  const visit = (current, _parent, key) => {
    if (current.type === "ObjectProperty" && !current.computed) {
      walk(current.value, visit);
      return false;
    }
    if (current.type === "MemberExpression" && !current.computed) {
      walk(current.object, visit);
      return false;
    }
    if (current.type === "JSXAttribute") {
      walk(current.value, visit);
      return false;
    }
    if (current.type === "JSXMemberExpression") {
      names.add(rootJsxName(current));
      return false;
    }
    if (current.type === "Identifier" && key !== "key") names.add(current.name);
    if (current.type === "JSXIdentifier") names.add(current.name);
    return true;
  };
  walk(node, visit);
  names.delete("undefined");
  return names;
}

/**
 * @param {object} node A `JSXMemberExpression`.
 * @returns {string}
 */
function rootJsxName(node) {
  let current = node;
  while (current.type === "JSXMemberExpression") current = current.object;
  return current.name ?? "";
}

/**
 * Statically evaluates the literal subset of an expression: strings, numbers,
 * booleans, null, and arrays/objects built only from those. Anything with a
 * runtime component (a call, an identifier, JSX) returns `undefined`, which is
 * the caller's signal to fall back to the raw source text.
 *
 * @param {object | null | undefined} node
 * @returns {unknown}
 */
export function staticValue(node) {
  if (!node) return undefined;
  switch (node.type) {
    case "StringLiteral":
    case "NumericLiteral":
    case "BooleanLiteral":
      return node.value;
    case "NullLiteral":
      return null;
    case "TemplateLiteral":
      return node.expressions.length === 0
        ? node.quasis.map((q) => q.value.cooked).join("")
        : undefined;
    case "UnaryExpression": {
      if (node.operator !== "-") return undefined;
      const inner = staticValue(node.argument);
      return typeof inner === "number" ? -inner : undefined;
    }
    case "TSAsExpression":
    case "TSSatisfiesExpression":
    case "TSNonNullExpression":
    case "ParenthesizedExpression":
      return staticValue(node.expression);
    case "ArrayExpression": {
      const out = [];
      for (const element of node.elements) {
        const value = staticValue(element);
        if (value === undefined) return undefined;
        out.push(value);
      }
      return out;
    }
    case "ObjectExpression": {
      const out = {};
      for (const property of node.properties) {
        if (property.type !== "ObjectProperty" || property.computed) return undefined;
        const key = property.key.name ?? property.key.value;
        if (typeof key !== "string") return undefined;
        const value = staticValue(property.value);
        if (value === undefined) return undefined;
        out[key] = value;
      }
      return out;
    }
    default:
      return undefined;
  }
}

/**
 * Reads a dotted path out of an `ObjectExpression`, returning the AST node at
 * that path. Used to reach `parameters.docs.description.story` without
 * executing anything.
 *
 * @param {object | null | undefined} node
 * @param {string[]} path
 * @returns {object | null}
 */
export function objectPath(node, path) {
  let current = node;
  for (const segment of path) {
    if (!current || current.type !== "ObjectExpression") return null;
    const match = current.properties.find(
      (property) =>
        property.type === "ObjectProperty" &&
        !property.computed &&
        (property.key.name ?? property.key.value) === segment,
    );
    if (!match) return null;
    current = match.value;
  }
  return current ?? null;
}

/**
 * Removes the shared leading indentation from a multi-line source slice so an
 * extracted render body sits flush against the left margin of its code fence.
 *
 * A source slice starts mid-line, so line 0 carries no indentation of its own
 * and cannot take part in the minimum. The column the slice *started* at is
 * therefore the ceiling on what may be stripped: a statement that begins at
 * column 0 must keep every space its continuation lines carry, or
 * `const X =\n  "…"` collapses into two flush-left lines.
 *
 * @param {string} text
 * @param {number} [baseColumn] Column the slice starts at in the original source.
 * @returns {string}
 */
export function dedent(text, baseColumn = Number.POSITIVE_INFINITY) {
  const lines = text.replace(/\t/g, "  ").split("\n");
  let smallest = Number.POSITIVE_INFINITY;
  for (const line of lines.slice(1)) {
    if (line.trim() === "") continue;
    smallest = Math.min(smallest, line.length - line.trimStart().length);
  }
  const strip = Math.min(smallest, Math.max(0, baseColumn));
  if (!Number.isFinite(strip) || strip === 0) return text.trimEnd();
  const [first, ...rest] = lines;
  return [first, ...rest.map((line) => line.slice(strip))].join("\n").trimEnd();
}

/**
 * @param {string} source
 * @param {number} index
 * @returns {number} Zero-based column of `index` within its line.
 */
export function columnAt(source, index) {
  return index - (source.lastIndexOf("\n", index - 1) + 1);
}

/**
 * Slices a node out of its source and re-indents it for a code fence.
 *
 * @param {string} source
 * @param {{ start: number, end: number }} node
 * @returns {string}
 */
export function sliceNode(source, node) {
  return dedent(source.slice(node.start, node.end), columnAt(source, node.start));
}
