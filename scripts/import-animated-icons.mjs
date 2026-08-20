#!/usr/bin/env node
/**
 * Imports animated icon components from the lucide-animated registry
 * (https://lucide-animated.com, MIT © 2024-2026 pqoqubbw) and rewrites them onto
 * the Fanvue icon API, so `@fanvue/ui/animated-icons` exports the same names as
 * `@fanvue/ui` and renders them in the same box.
 *
 * Which icons get imported is driven by scripts/animated-icons.map.json — a
 * curated `{ OurIconName: registry-slug }` map. Nothing is inferred from names:
 * a pair only lands there once the two glyphs have been compared.
 *
 * The rewrite is deliberately surgical. Motion variants and SVG children are
 * copied verbatim (that is the animation, and upstream owns it); only the module
 * shell is replaced:
 *
 * - the `<div>` wrapper is dropped and `className` + hover handlers move onto the
 *   `<svg>`, so the animated icon is a single element occupying its twin's box
 * - `width`/`height={size}` become the shared ICON_SIZE_CLASS box class (or the
 *   legacy twin's own classes), keeping animated and static art 1:1 at every size
 * - `strokeWidth` is re-derived from the static twin so the swap keeps the same
 *   optical weight, not just the same box
 * - the `ref` stays an `SVGSVGElement` ref like every other icon here; upstream's
 *   imperative handle moves to the `controlRef` prop
 * - the variant labels upstream plays on enter/leave travel with the icon, because
 *   Motion resolves a label it cannot find to nothing at all, silently
 *
 * Anything the rewrite does not recognise is reported and skipped rather than
 * emitted half-transformed, and a run with any failure writes nothing at all.
 *
 * The registry response for each slug is committed under scripts/animated-registry
 * so a regeneration is reproducible offline and the untransformed upstream input is
 * reviewable on its own. Hashes are recorded in the manifest and verified on every
 * cached run, so a tampered or truncated cache entry fails loudly.
 *
 * Usage:
 *   node scripts/import-animated-icons.mjs            # use the committed registry files
 *   node scripts/import-animated-icons.mjs --refresh  # re-fetch from the registry
 */

import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..");
const MAP_PATH = path.join(__dirname, "animated-icons.map.json");
const ICONS_MANIFEST_PATH = path.join(__dirname, "icons.manifest.json");
const OUT_MANIFEST_PATH = path.join(__dirname, "animated-icons.manifest.json");
const REGISTRY_DIR = path.join(__dirname, "animated-registry");
const STATIC_ICONS_DIR = path.join(REPO_ROOT, "src/components/Icons");
const OUT_DIR = path.join(REPO_ROOT, "src/components/AnimatedIcons");
const BARREL_PATH = path.join(REPO_ROOT, "src/animated-icons.ts");

const REGISTRY_HOST = "https://lucide-animated.com";
const REGISTRY_URL = (slug) => `${REGISTRY_HOST}/r/${slug}.json`;
const ATTRIBUTION = "lucide-animated (MIT, (c) 2024-2026 pqoqubbw) — https://lucide-animated.com";

/** Registry slugs are used as both a URL segment and a filename. */
const SLUG_PATTERN = /^[a-z0-9-]+$/;

/**
 * Ceiling for `repeat`. Upstream leaves a few animations running forever, which on
 * touch is unstoppable: the emulated hover sticks until the user taps elsewhere, so
 * `mouseleave` — the only thing that stops an icon — never fires.
 */
const MAX_REPEAT = 2;

/** Files the generator owns; everything else in OUT_DIR is hand-written. */
const HAND_WRITTEN = new Set(["types.ts", "useIconAnimation.ts", "NOTICE.md"]);

/**
 * SVG elements the artwork is allowed to use. Upstream is MIT and well behaved,
 * but its output is fetched over the network and written into `src/`, so the
 * rewrite pins the grammar it will emit rather than trusting whatever arrives.
 */
const ALLOWED_ELEMENTS = new Set([
  "AnimatePresence",
  "Fragment",
  "path",
  "circle",
  "ellipse",
  "rect",
  "line",
  "polyline",
  "polygon",
  "g",
  "defs",
  "clipPath",
  "mask",
  "title",
]);

/** Attributes that could reach the network or execute; never legitimate on icon art. */
const FORBIDDEN_ATTR_PATTERN =
  /\b(?:href|xlink:href|xlinkHref|src|srcSet|dangerouslySetInnerHTML)\s*=/;
const FORBIDDEN_HANDLER_PATTERN = /\bon[A-Z]\w*\s*=/;

/** Tokens that have no business in a stroke-and-path icon. */
const FORBIDDEN_TOKENS = [
  "eval(",
  "new Function",
  "fetch(",
  "import(",
  "require(",
  "document.",
  "window.",
  "globalThis",
  "localStorage",
  "sessionStorage",
  "XMLHttpRequest",
  "navigator.",
  "atob(",
  "btoa(",
  "process.env",
  "<script",
  "javascript:",
  "<foreignObject",
  "<iframe",
  "<image",
  "<use",
];

const refresh = process.argv.includes("--refresh");

const sha256 = (text) => crypto.createHash("sha256").update(text).digest("hex");

/** Most common value in a list; ties resolve to the largest. */
function mode(values) {
  const counts = new Map();
  for (const v of values) counts.set(v, (counts.get(v) ?? 0) + 1);
  return [...counts.entries()].sort((a, b) => b[1] - a[1] || b[0] - a[0])[0][0];
}

/** Trim float noise from derived stroke widths without rounding real values away. */
const round = (n) => Number(n.toFixed(4));

/**
 * Read a registry item, verifying it against the hash recorded in the manifest.
 *
 * Without `--refresh` this never touches the network: the committed file is the
 * input, and a hash mismatch is a hard failure rather than a silent re-fetch.
 */
async function loadRegistryItem(slug, recorded, fetched) {
  if (!SLUG_PATTERN.test(slug)) {
    throw new Error(`slug ${JSON.stringify(slug)} is not a plain kebab-case identifier`);
  }
  const cachePath = path.join(REGISTRY_DIR, `${slug}.json`);

  if (refresh || !fs.existsSync(cachePath)) {
    const res = await fetch(REGISTRY_URL(slug), { signal: AbortSignal.timeout(30_000) });
    if (!res.ok) throw new Error(`registry fetch failed (${res.status}) for ${slug}`);
    const text = await res.text();
    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch {
      throw new Error(`registry response for ${slug} is not JSON (${text.length} bytes)`);
    }
    if (!Array.isArray(parsed.files)) {
      throw new Error(`registry response for ${slug} has no files array`);
    }
    const digest = sha256(text);
    if (recorded[slug] && recorded[slug].sha256 !== digest) {
      console.log(
        `  ${slug}: upstream changed (${recorded[slug].sha256.slice(0, 12)} → ${digest.slice(0, 12)})`,
      );
    }
    fs.mkdirSync(REGISTRY_DIR, { recursive: true });
    fs.writeFileSync(cachePath, text);
    fetched[slug] = { sha256: digest, fetchedAt: new Date().toISOString() };
    return parsed;
  }

  const text = fs.readFileSync(cachePath, "utf8");
  const digest = sha256(text);
  const previous = recorded[slug];
  if (previous && previous.sha256 !== digest) {
    throw new Error(
      `committed registry file for ${slug} does not match the manifest hash ` +
        `(expected ${previous.sha256.slice(0, 12)}, got ${digest.slice(0, 12)}) — ` +
        `re-run with --refresh if the change is intended`,
    );
  }
  fetched[slug] = previous ?? { sha256: digest, fetchedAt: new Date().toISOString() };
  return JSON.parse(text);
}

/**
 * Split a JSX open tag's attribute text into `name -> raw value` pairs, tracking
 * brace/quote depth so `variants={{ normal: { ... } }}` survives intact.
 */
function parseAttrs(attrText) {
  const attrs = [];
  let i = 0;
  while (i < attrText.length) {
    while (i < attrText.length && /\s/.test(attrText[i])) i++;
    const nameStart = i;
    while (i < attrText.length && /[\w:-]/.test(attrText[i])) i++;
    const name = attrText.slice(nameStart, i);
    if (!name) break;
    while (i < attrText.length && /\s/.test(attrText[i])) i++;
    if (attrText[i] !== "=") {
      attrs.push({ name, raw: null });
      continue;
    }
    i++;
    while (i < attrText.length && /\s/.test(attrText[i])) i++;
    const valueStart = i;
    if (attrText[i] === '"' || attrText[i] === "'") {
      const quote = attrText[i];
      i++;
      while (i < attrText.length && attrText[i] !== quote) i++;
      i++;
    } else if (attrText[i] === "{") {
      let depth = 0;
      do {
        if (attrText[i] === "{") depth++;
        else if (attrText[i] === "}") depth--;
        i++;
      } while (i < attrText.length && depth > 0);
    } else {
      while (i < attrText.length && !/\s/.test(attrText[i])) i++;
    }
    attrs.push({ name, raw: attrText.slice(valueStart, i) });
  }
  return attrs;
}

/**
 * Slice out the balanced `open`…`close` region starting at `openIdx`, skipping
 * over string literals.
 */
function balanced(code, openIdx, open = "{", close = "}") {
  let depth = 0;
  let quote = null;
  for (let i = openIdx; i < code.length; i++) {
    const ch = code[i];
    if (quote) {
      if (ch === quote && code[i - 1] !== "\\") quote = null;
      continue;
    }
    if (ch === '"' || ch === "'" || ch === "`") {
      quote = ch;
      continue;
    }
    if (ch === open) depth++;
    else if (ch === close) {
      depth--;
      if (depth === 0) return code.slice(openIdx, i + 1);
    }
  }
  return null;
}

/** Keys declared directly on an object literal, ignoring anything nested. */
function depth1Keys(objText) {
  const keys = [];
  let depth = 0;
  let quote = null;
  for (let i = 0; i < objText.length; i++) {
    const ch = objText[i];
    if (quote) {
      if (ch === quote && objText[i - 1] !== "\\") quote = null;
      continue;
    }
    if (ch === '"' || ch === "'" || ch === "`") {
      quote = ch;
      continue;
    }
    if ("{([".includes(ch)) {
      depth++;
      continue;
    }
    if ("})]".includes(ch)) {
      depth--;
      continue;
    }
    if (depth === 1 && /[A-Za-z_$]/.test(ch)) {
      const m = objText.slice(i).match(/^([A-Za-z_$][\w$]*)\s*:/);
      if (m) {
        keys.push(m[1]);
        i += m[0].length - 1;
      } else {
        const id = objText.slice(i).match(/^[\w$]+/);
        i += (id ? id[0].length : 1) - 1;
      }
    }
  }
  return keys;
}

/** Every variant label the emitted code actually defines a table entry for. */
function collectVariantKeys(code) {
  const keys = new Set();
  const collect = (openIdx) => {
    const obj = balanced(code, openIdx);
    if (obj) for (const k of depth1Keys(obj)) keys.add(k);
  };
  for (const m of code.matchAll(/variants=\{\{/g)) collect(m.index + "variants={".length);
  for (const m of code.matchAll(/variants:\s*\{/g)) collect(m.index + m[0].length - 1);
  for (const m of code.matchAll(/:\s*Variants\s*=\s*\{/g)) collect(m.index + m[0].length - 1);
  for (const m of code.matchAll(/const\s+\w*VARIANTS\w*\s*(?::\s*[\w.<>[\]]+)?\s*=\s*\{/gi)) {
    collect(m.index + m[0].length - 1);
  }
  return keys;
}

/** The balanced text of the statement matching `startRe`, or null. */
function statementText(body, startRe) {
  const m = body.match(startRe);
  if (!m) return null;
  let depth = 0;
  let quote = null;
  for (let i = m.index; i < body.length; i++) {
    const ch = body[i];
    if (quote) {
      if (ch === quote && body[i - 1] !== "\\") quote = null;
      continue;
    }
    if (ch === '"' || ch === "'" || ch === "`") {
      quote = ch;
      continue;
    }
    if ("({[".includes(ch)) depth++;
    else if (")}]".includes(ch)) depth--;
    else if (ch === ";" && depth === 0) return body.slice(m.index, i + 1);
  }
  return body.slice(m.index);
}

/** Variant labels a block of upstream code starts, in order, de-duplicated. */
function labelsIn(text) {
  if (!text) return [];
  const labels = [...text.matchAll(/\.start\(\s*["']([^"']+)["']/g)].map((m) => m[1]);
  return [...new Set(labels)];
}

/**
 * Cut the statement starting at `startRe` out of `body`, balancing brackets and
 * quotes so a statement containing object literals or callbacks is removed whole.
 */
function removeStatement(body, startRe) {
  const m = body.match(startRe);
  if (!m) return body;
  let i = m.index;
  let depth = 0;
  let quote = null;
  while (i < body.length) {
    const ch = body[i];
    if (quote) {
      if (ch === quote && body[i - 1] !== "\\") quote = null;
    } else if (ch === '"' || ch === "'" || ch === "`") {
      quote = ch;
    } else if ("({[".includes(ch)) {
      depth++;
    } else if (")}]".includes(ch)) {
      depth--;
    } else if (ch === ";" && depth === 0) {
      i++;
      break;
    }
    i++;
  }
  return `${body.slice(0, m.index)}${body.slice(i)}`;
}

/** The statements the shared hook replaces; anything else in the body is kept. */
const BOILERPLATE_STATEMENTS = [
  /const isControlledRef = useRef\(false\);/,
  /useImperativeHandle\(/,
  /const handleMouseEnter = useCallback\(/,
  /const handleMouseLeave = useCallback\(/,
];

/**
 * Strip the standard hook boilerplate, leaving whatever else the component
 * declared — several icons build their variant tables inside the body, and those
 * declarations have to survive or the artwork references undefined names.
 */
function stripBoilerplate(body, controllerNames) {
  let out = BOILERPLATE_STATEMENTS.reduce(removeStatement, body);
  for (const name of controllerNames) {
    out = removeStatement(out, new RegExp(`const ${name} = useAnimation\\(\\);`));
  }
  return out.trim();
}

/**
 * Adapt an upstream hook body we are keeping: namespace the React hooks (we import
 * React wholesale) and retype the hover handlers now that they sit on the `<svg>`.
 */
function rewriteHookBody(body) {
  return body
    .replace(/(?<!React\.)\buse(Ref|Callback|Memo)\(/g, "React.use$1(")
    .replace(/(?:React\.)?MouseEvent<HTMLDivElement>/g, "React.MouseEvent<SVGSVGElement>");
}

/** Pull the module-level declarations (variant tables, easings) out of the source. */
function extractModuleDecls(source, forwardRefIdx) {
  const lastImportEnd = (() => {
    let end = 0;
    for (const m of source.matchAll(/^import[\s\S]*?;$/gm)) end = m.index + m[0].length;
    return end;
  })();
  return (
    source
      .slice(lastImportEnd, forwardRefIdx)
      // Both interfaces are replaced by our shared types.
      .replace(/export interface \w+Handle \{[\s\S]*?\n\}\n/g, "")
      .replace(/interface \w+Props extends HTMLAttributes<HTMLDivElement> \{[\s\S]*?\n\}\n/g, "")
      .trim()
  );
}

/** Locate the root `<svg>` / `<motion.svg>` element inside the upstream render. */
function extractSvg(source) {
  const openMatch = source.match(/<(motion\.svg|svg)\b/);
  if (!openMatch) throw new Error("no <svg> root found");
  const tag = openMatch[1];
  const openStart = openMatch.index;
  // Walk to the end of the open tag, skipping over quoted and braced values.
  let i = openStart + openMatch[0].length;
  let depth = 0;
  let quote = null;
  while (i < source.length) {
    const ch = source[i];
    if (quote) {
      if (ch === quote) quote = null;
    } else if (ch === '"' || ch === "'") {
      quote = ch;
    } else if (ch === "{") {
      depth++;
    } else if (ch === "}") {
      depth--;
    } else if (ch === ">" && depth === 0) {
      break;
    }
    i++;
  }
  if (i >= source.length) throw new Error("unterminated <svg> open tag");
  const attrText = source.slice(openStart + openMatch[0].length, i);
  const closeTag = `</${tag}>`;
  const closeIdx = source.indexOf(closeTag, i);
  if (closeIdx === -1) throw new Error(`missing ${closeTag}`);
  return {
    isMotionRoot: tag === "motion.svg",
    attrs: parseAttrs(attrText),
    children: source.slice(i + 1, closeIdx),
  };
}

/** Reject artwork that steps outside the grammar we are willing to publish. */
function assertSafeArtwork(children, moduleDecls, hookBody) {
  const all = `${moduleDecls}\n${hookBody}\n${children}`;
  for (const token of FORBIDDEN_TOKENS) {
    if (all.includes(token)) throw new Error(`artwork contains a disallowed token: ${token}`);
  }
  if (FORBIDDEN_ATTR_PATTERN.test(children)) {
    throw new Error("artwork contains a URL-bearing attribute (href/src/…)");
  }
  if (FORBIDDEN_HANDLER_PATTERN.test(children)) {
    throw new Error("artwork declares its own event handler attribute");
  }
  for (const m of children.matchAll(/<\s*(motion\.)?([A-Za-z][\w.]*)(?=[\s/>])/g)) {
    const tag = m[2];
    if (!ALLOWED_ELEMENTS.has(tag)) {
      throw new Error(`artwork uses a disallowed element: <${m[1] ?? ""}${tag}>`);
    }
  }
}

/**
 * Per-size stroke widths of a prop-based static twin, in its own coordinate space
 * (which is also CSS pixels: those icons author `viewBox="0 0 size size"`).
 */
function staticStrokeWidths(name) {
  const src = fs.readFileSync(path.join(STATIC_ICONS_DIR, `${name}.tsx`), "utf8");
  const declIdx = src.search(/const VARIANTS\s*:\s*IconVariants\s*=\s*\{/);
  if (declIdx === -1) return null;
  const variants = balanced(src, src.indexOf("{", declIdx));
  if (!variants) return null;

  const widths = {};
  for (const size of [16, 24, 32]) {
    const m = new RegExp(`(?:^|[\\s{,])${size}\\s*:\\s*\\{`).exec(variants);
    if (!m) continue;
    const sizeObj = balanced(variants, variants.indexOf("{", m.index + m[0].length - 1));
    if (!sizeObj) continue;
    const outlinedIdx = sizeObj.indexOf("outlined:");
    if (outlinedIdx === -1) continue;
    const paths = balanced(sizeObj, sizeObj.indexOf("[", outlinedIdx), "[", "]");
    if (!paths) continue;
    const sws = [...paths.matchAll(/\bsw:\s*([\d.]+)/g)].map((x) => Number(x[1]));
    if (sws.length) widths[size] = mode(sws);
  }
  // Partial coverage is normal: several icons are stroked at 24/32 and drawn as a
  // compound fill at 16. Sizes without a stroke keep upstream's width.
  return Object.keys(widths).length ? widths : null;
}

/** Box classes, viewBox and stroke width of a legacy static twin. */
function staticLegacyShape(name) {
  const src = fs.readFileSync(path.join(STATIC_ICONS_DIR, `${name}.tsx`), "utf8");
  const cnMatch = src.match(/cn\(\s*"([^"]*)"/);
  if (!cnMatch) throw new Error(`could not read the default classes from ${name}.tsx`);
  const classes = cnMatch[1].trim().split(/\s+/);
  if (!classes.some((c) => c.startsWith("size-"))) {
    throw new Error(`no default size class found in ${name}.tsx`);
  }
  const viewBox = src.match(/viewBox="0 0 [\d.]+ ([\d.]+)"/);
  const sws = [...src.matchAll(/strokeWidth=(?:"([\d.]+)"|\{([\d.]+)\})/g)].map((m) =>
    Number(m[1] ?? m[2]),
  );
  return {
    classes,
    viewBox: viewBox ? Number(viewBox[1]) : null,
    strokeWidth: sws.length ? mode(sws) : null,
  };
}

/**
 * Decide the enter/leave labels for an icon, repairing the cases where upstream
 * starts a variant its own tables never define.
 */
function resolveLabels({ enterRaw, leaveRaw, variantKeys }) {
  const known = (labels) => labels.filter((l) => variantKeys.has(l));
  const defined = [...variantKeys].join(" | ") || "none";
  const notes = [];

  const enter = known(enterRaw);
  if (!enter.length) {
    throw new Error(`upstream starts ${JSON.stringify(enterRaw)} on enter but defines ${defined}`);
  }

  let leave = known(leaveRaw);
  if (!leave.length) {
    const rest =
      ["normal", "initial", "rest", "idle"].find((k) => variantKeys.has(k) && !enter.includes(k)) ??
      [...variantKeys].find((k) => !enter.includes(k));
    if (!rest) throw new Error(`no resting variant to return to (defines ${defined})`);
    leave = [rest];
    notes.push(
      `leave label ${JSON.stringify(leaveRaw)} is undefined upstream; returning to "${rest}"`,
    );
  }
  return { enter, leave, notes };
}

/**
 * Move an element-level `transition` that repeats into the enter variant.
 *
 * An element-level transition is the default for *every* variant on that element,
 * resting variants included, so `repeat` there makes the exit animation replay
 * instead of settling.
 */
function hoistRepeatingTransition(attrs, enterLabel) {
  const transition = attrs.find((a) => a.name === "transition");
  if (!transition?.raw || !/\brepeat\s*:/.test(transition.raw)) return { attrs, hoisted: false };

  const variants = attrs.find((a) => a.name === "variants");
  if (!variants?.raw?.startsWith("{{")) {
    throw new Error("element-level transition repeats but the element has no inline variants");
  }
  const inner = variants.raw.slice(1, -1);
  const keyIdx = inner.search(new RegExp(`\\b${enterLabel}\\s*:\\s*\\{`));
  if (keyIdx === -1) {
    throw new Error(`cannot hoist a repeating transition into the "${enterLabel}" variant`);
  }
  const openIdx = inner.indexOf("{", keyIdx);
  const target = balanced(inner, openIdx);
  if (!target) throw new Error(`malformed "${enterLabel}" variant`);

  const transitionObj = transition.raw.slice(1, -1).trim();
  const merged = `{ ${target.slice(1, -1).trim().replace(/,$/, "")}, transition: ${transitionObj} }`;
  const rewritten = `{${inner.slice(0, openIdx)}${merged}${inner.slice(openIdx + target.length)}}`;

  return {
    attrs: attrs
      .filter((a) => a.name !== "transition")
      .map((a) => (a.name === "variants" ? { ...a, raw: rewritten } : a)),
    hoisted: true,
  };
}

/** Replace unbounded repeats with a finite count. */
function capRepeats(code) {
  return code.replace(
    /repeat:\s*(?:Number\.POSITIVE_INFINITY|Infinity|Number\.MAX_SAFE_INTEGER)/g,
    `repeat: ${MAX_REPEAT}`,
  );
}

/**
 * Express a root-`<svg>` translation as a percentage of the icon's own box.
 *
 * Motion on a child element animates in viewBox units, which scale with `size`
 * for free. On the root it is a CSS transform on an HTML-context box, so a raw
 * number is a fixed pixel amount — 31% of the box at `size={16}`, 16% at 32.
 */
function percentifyTranslations(raw, viewBox) {
  return raw.replace(
    /\b(x|y|translateX|translateY)\s*:\s*(\[[^\]]*\]|"-?[\d.]+px"|-?[\d.]+)/g,
    (all, key, value) => {
      const pct = (n) => `"${round((n / viewBox) * 100)}%"`;
      if (value.startsWith("[")) {
        const items = value
          .slice(1, -1)
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
        if (!items.every((s) => /^-?[\d.]+$/.test(s))) return all;
        return `${key}: [${items.map((s) => pct(Number(s))).join(", ")}]`;
      }
      if (value.startsWith('"')) return `${key}: ${pct(Number(value.replace(/["]|px/g, "")))}`;
      return `${key}: ${pct(Number(value))}`;
    },
  );
}

function renderComponent({ name, slug, source, propBased, legacy, strokeWidths, notes }) {
  const forwardRefIdx = source.search(/const \w+Icon = forwardRef</);
  if (forwardRefIdx === -1) throw new Error("no forwardRef component found");

  const componentSource = source.slice(forwardRefIdx);
  for (const marker of ["useImperativeHandle(", "handleMouseEnter", "handleMouseLeave"]) {
    if (!componentSource.includes(marker)) {
      throw new Error(`unrecognised component shell (missing \`${marker}\`)`);
    }
  }
  for (const hook of ["useState(", "useEffect(", "useMemo(", "useReducer(", "useId("]) {
    if (componentSource.includes(hook)) {
      throw new Error(`uses ${hook.slice(0, -1)}, which this rewrite does not model`);
    }
  }
  if (!componentSource.includes("<div")) {
    throw new Error("expected a wrapping <div> to strip");
  }

  const controllerNames = [
    ...new Set(
      [...componentSource.matchAll(/const\s+(\w+)\s*=\s*useAnimation\(\)/g)].map((m) => m[1]),
    ),
  ];
  if (!controllerNames.length) throw new Error("no useAnimation() controller found");

  const bodyStart = componentSource.indexOf("=> {");
  const returnMatch = componentSource.slice(bodyStart).match(/\n\s*return \(/);
  if (bodyStart === -1 || !returnMatch) {
    throw new Error("could not isolate the component's hook body");
  }
  const rawBody = componentSource
    .slice(bodyStart + "=> {".length, bodyStart + returnMatch.index)
    .trim();

  // The labels upstream plays, read from the handlers before they are stripped.
  const enterRaw = labelsIn(
    statementText(rawBody, /const handleMouseEnter = useCallback\(/) ??
      statementText(rawBody, /startAnimation:/),
  );
  const leaveRaw = labelsIn(
    statementText(rawBody, /const handleMouseLeave = useCallback\(/) ??
      statementText(rawBody, /stopAnimation:/),
  );
  if (!enterRaw.length || !leaveRaw.length) {
    throw new Error("could not read the variant labels upstream plays on hover");
  }

  const moduleDecls = capRepeats(extractModuleDecls(source, forwardRefIdx));
  const hookBody = rewriteHookBody(capRepeats(stripBoilerplate(rawBody, controllerNames)));
  const svg = extractSvg(componentSource);
  let { attrs } = svg;
  const children = capRepeats(svg.children);

  assertSafeArtwork(children, moduleDecls, hookBody);

  // The root element's variants arrive as a bare attribute value, so they are
  // re-wrapped into the `variants={{...}}` shape the key scanner recognises.
  const rootVariants = attrs
    .filter((a) => a.name === "variants" && a.raw?.startsWith("{{"))
    .map((a) => `variants=${a.raw}`)
    .join("\n");
  const variantKeys = collectVariantKeys(
    `${moduleDecls}\n${hookBody}\n${children}\n${rootVariants}`,
  );
  const { enter, leave, notes: labelNotes } = resolveLabels({ enterRaw, leaveRaw, variantKeys });
  notes.push(...labelNotes);

  const hoist = hoistRepeatingTransition(attrs, enter[0]);
  attrs = hoist.attrs;
  if (hoist.hoisted) {
    notes.push(`moved a repeating element transition into the "${enter[0]}" variant`);
  }

  // `width`/`height` become the box class; `xmlns` is redundant for inline SVG.
  const dropped = new Set(["width", "height", "xmlns", "classname", "class"]);
  const viewBoxAttr = attrs.find((a) => a.name === "viewBox")?.raw ?? '"0 0 24 24"';
  const viewBox = Number(viewBoxAttr.replace(/"/g, "").split(/\s+/)[3] ?? 24);

  // Stroke parity with the static twin. Effective px = sw * boxPx / viewBox, so
  // matching the twin means scaling its width into our viewBox.
  let strokeAttr = attrs.find((a) => a.name === "strokeWidth")?.raw ?? null;
  const upstreamStroke = strokeAttr ? Number(strokeAttr.replace(/"/g, "")) : null;
  let strokeConst = null;
  let strokeScale = null;

  if (strokeWidths && upstreamStroke) {
    if (propBased) {
      const perSize = Object.fromEntries(
        [16, 24, 32].map((size) => [
          size,
          strokeWidths[size] ? round((strokeWidths[size] * viewBox) / size) : upstreamStroke,
        ]),
      );
      const unique = [...new Set(Object.values(perSize))];
      if (unique.length === 1) {
        strokeAttr = `"${unique[0]}"`;
        strokeScale = unique[0] / upstreamStroke;
      } else {
        strokeConst = perSize;
        strokeAttr = "{STROKE_WIDTH[size]}";
      }
    } else if (legacy.viewBox) {
      const target = round((strokeWidths * viewBox) / legacy.viewBox);
      strokeAttr = `"${target}"`;
      strokeScale = target / upstreamStroke;
    }
  }

  // A few icons animate `strokeWidth` itself; those values have to move with the
  // resting width or the artwork jumps weight the moment it animates.
  const animatesStroke = /strokeWidth:/.test(`${moduleDecls}\n${hookBody}\n${children}`);
  if (animatesStroke && strokeConst) {
    throw new Error("animates strokeWidth, which per-size stroke parity does not model");
  }
  const scaleStroke = (code) =>
    animatesStroke && strokeScale !== null && strokeScale !== 1
      ? code.replace(/strokeWidth:\s*(\[[^\]]*\]|[\d.]+)/g, (all, value) => {
          if (value.startsWith("[")) {
            const items = value
              .slice(1, -1)
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean);
            if (!items.every((s) => /^-?[\d.]+$/.test(s))) return all;
            return `strokeWidth: [${items.map((s) => round(Number(s) * strokeScale)).join(", ")}]`;
          }
          return `strokeWidth: ${round(Number(value) * strokeScale)}`;
        })
      : code;

  const finalModuleDecls = scaleStroke(moduleDecls);
  const finalHookBody = scaleStroke(hookBody);
  const finalChildren = scaleStroke(children);

  // Root-level translations are CSS pixels; make them proportional to the box.
  const rootAnimationAttrs = new Set(["variants", "initial", "animate"]);
  attrs = attrs.map((a) => {
    if (!rootAnimationAttrs.has(a.name) || !a.raw?.startsWith("{{")) return a;
    const converted = percentifyTranslations(a.raw, viewBox);
    if (converted !== a.raw) notes.push(`root ${a.name} translations expressed as percentages`);
    return { ...a, raw: converted };
  });

  // The root's variants are often a module-level table. Rewriting it is only safe
  // when the root is its sole consumer — a table shared with child elements
  // animates in viewBox units there, which already scales.
  let rootTableDecls = finalModuleDecls;
  const rootVariantsRef = attrs.find((a) => a.name === "variants")?.raw?.match(/^\{(\w+)\}$/);
  if (rootVariantsRef) {
    const table = rootVariantsRef[1];
    const usages = [
      ...`${finalChildren}\n${finalHookBody}`.matchAll(new RegExp(`\\b${table}\\b`, "g")),
    ];
    const declIdx = rootTableDecls.search(new RegExp(`\\b${table}\\b[^=]*=\\s*\\{`));
    if (!usages.length && declIdx !== -1) {
      const objText = balanced(rootTableDecls, rootTableDecls.indexOf("{", declIdx));
      const converted = percentifyTranslations(objText, viewBox);
      if (converted !== objText) {
        rootTableDecls = rootTableDecls.replace(objText, converted);
        notes.push(`root ${table} translations expressed as percentages`);
      }
    }
  }

  const rootStyle = attrs.find((a) => a.name === "style");
  const keptAttrs = attrs.filter(
    (a) => !dropped.has(a.name.toLowerCase()) && a.name !== "style" && a.name !== "strokeWidth",
  );
  const attrLines = keptAttrs.map((a) => (a.raw === null ? a.name : `${a.name}=${a.raw}`));
  if (strokeAttr) attrLines.push(`strokeWidth=${strokeAttr}`);

  const rootTag = svg.isMotionRoot ? "motion.svg" : "svg";
  const propsType = propBased ? "AnimatedIconProps" : "AnimatedLegacyIconProps";
  const classExpr = propBased
    ? "cn(ICON_SIZE_CLASS[size], className)"
    : `cn("${legacy.classes.join(" ")}", className)`;

  const signature = [
    "{",
    propBased ? " size = 24," : "",
    propBased ? " filled: _filled," : "",
    " className,",
    rootStyle ? " style," : "",
    " controlRef,",
    " onMouseEnter,",
    " onMouseLeave,",
    " ...props }, ref)",
  ]
    .filter(Boolean)
    .join("")
    .replace(/^\{/, "({");

  const styleLine = rootStyle
    ? `\n        style={{ ${rootStyle.raw
        .slice(1, -1)
        .trim()
        .replace(/^\{|\}$/g, "")
        .trim()
        .replace(/,$/, "")}, ...style }}`
    : "";

  const body = `      <${rootTag}
        ref={ref}
        aria-hidden="true"
        {...props}
${attrLines.map((l) => `        ${l}`).join("\n")}
        className={${classExpr}}${styleLine}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >${finalChildren.replace(/\s+$/, "")}
      </${rootTag}>`;

  const emitted = `${rootTableDecls}\n${finalHookBody}\n${body}`;

  // Every controller the artwork reaches for has to be one we declared.
  const stray = [...emitted.matchAll(/\b(\w*[Cc]ontrols)\b/g)]
    .map((m) => m[1])
    .filter((id) => !controllerNames.includes(id));
  if (stray.length) {
    throw new Error(`references unknown controller(s): ${[...new Set(stray)].join(", ")}`);
  }
  if (/POSITIVE_INFINITY|:\s*Infinity/.test(emitted)) {
    throw new Error("still contains an unbounded repeat after capping");
  }

  const single = controllerNames.length === 1;
  const labelOptions = [
    ...(enter.length === 1 && enter[0] === "animate"
      ? []
      : [`      enter: [${enter.map((l) => `"${l}"`).join(", ")}],`]),
    ...(leave.length === 1 && leave[0] === "normal"
      ? []
      : [`      leave: [${leave.map((l) => `"${l}"`).join(", ")}],`]),
  ];
  const hookOptions = [
    "      controlRef,",
    "      onMouseEnter,",
    "      onMouseLeave,",
    ...labelOptions,
  ].join("\n");

  const hookCall = single
    ? `    const { controls, handleMouseEnter, handleMouseLeave } = useIconAnimation({
${hookOptions}
    });`
    : `${controllerNames.map((c) => `    const ${c} = useAnimation();`).join("\n")}

    const { handleMouseEnter, handleMouseLeave } = useIconAnimationHandlers({
      controls: [${controllerNames.join(", ")}],
${hookOptions}
    });`;

  const hookImport = single
    ? `import { useIconAnimation } from "./useIconAnimation";`
    : `import { useIconAnimationHandlers } from "./useIconAnimation";`;

  const motionNamed = ["motion", "AnimatePresence", "cubicBezier"].filter((id) =>
    new RegExp(`\\b${id}\\b`).test(emitted),
  );
  if (!single) motionNamed.push("useAnimation");
  const motionTypes = ["Transition", "Variants"].filter((id) =>
    new RegExp(`\\b${id}\\b`).test(emitted),
  );
  const reactNamed = ["Fragment"].filter((id) => new RegExp(`\\b${id}\\b`).test(emitted));

  const imports = [
    ...(motionTypes.length
      ? [`import type { ${motionTypes.join(", ")} } from "motion/react";`]
      : []),
    ...(motionNamed.length
      ? [`import { ${[...new Set(motionNamed)].sort().join(", ")} } from "motion/react";`]
      : []),
    `import * as React from "react";`,
    ...(reactNamed.length ? [`import { ${reactNamed.join(", ")} } from "react";`] : []),
    `import { cn } from "@/utils/cn";`,
    ...(propBased ? [`import { ICON_SIZE_CLASS } from "../Icons/iconSizeClass";`] : []),
    ...(strokeConst ? [`import type { IconSize } from "../Icons/types";`] : []),
    `import type { AnimatedIconHandle, ${propsType} } from "./types";`,
    hookImport,
  ].join("\n");

  const strokeDecl = strokeConst
    ? `const STROKE_WIDTH: Record<IconSize, number> = {\n${[16, 24, 32]
        .map((s) => `  ${s}: ${strokeConst[s]},`)
        .join("\n")}\n};\n\n`
    : "";

  const sizeDoc = propBased
    ? "Renders at sizes 16, 24, or 32 px — the same box and stroke weight as the static icon."
    : `Sized via \`className\`, defaulting to the same \`${legacy.classes.find((c) =>
        c.startsWith("size-"),
      )}\` box as the static icon.`;

  return `"use client";

/*! Animated icon artwork from ${ATTRIBUTION} (registry item "${slug}"). @license MIT */
// Generated by scripts/import-animated-icons.mjs — do not edit by hand.
${imports}

${rootTableDecls ? `${rootTableDecls}\n\n` : ""}${strokeDecl}/** Props for {@link ${name}}. See {@link ${propsType}} for the shared shape. */
export type ${name}Props = ${propsType};

/** Imperative handle for {@link ${name}}, via its \`controlRef\` prop. */
export type ${name}Handle = AnimatedIconHandle;

/**
 * Animated ${name.replace(/Icon$/, "")} icon — the animated twin of \`${name}\` from
 * \`@fanvue/ui\`. Plays on hover, or on demand through \`controlRef\`, and stays
 * still when the user has asked for reduced motion.
 * ${sizeDoc}
 *
 * @example
 * \`\`\`tsx
 * import { ${name} } from "@fanvue/ui/animated-icons";
 *
 * <${name}${propBased ? " size={24}" : ""} />
 * \`\`\`
 */
export const ${name} = React.forwardRef<SVGSVGElement, ${name}Props>(
  ${signature} => {
${[
  hookCall,
  ...(finalHookBody
    ? [
        finalHookBody
          .split("\n")
          .map((line) => (line.trim() ? `    ${line}` : line))
          .join("\n"),
      ]
    : []),
].join("\n\n")}

    return (
${body}
    );
  },
);

${name}.displayName = "${name}";
`;
}

async function main() {
  const { icons: nameToSlug } = JSON.parse(fs.readFileSync(MAP_PATH, "utf8"));
  const staticManifest = JSON.parse(fs.readFileSync(ICONS_MANIFEST_PATH, "utf8"));
  const propBasedNames = new Set(staticManifest.icons.map((i) => i.name));

  const previous = fs.existsSync(OUT_MANIFEST_PATH)
    ? JSON.parse(fs.readFileSync(OUT_MANIFEST_PATH, "utf8"))
    : {};
  const recorded = previous.registry?.items ?? {};
  const fetched = {};

  const entries = Object.entries(nameToSlug)
    .filter(([name]) => !name.startsWith("$"))
    .sort(([a], [b]) => a.localeCompare(b));

  const missingTwin = entries.filter(
    ([name]) => !fs.existsSync(path.join(STATIC_ICONS_DIR, `${name}.tsx`)),
  );
  if (missingTwin.length) {
    console.error("These mapped names have no static icon to mirror:");
    for (const [name] of missingTwin) console.error(`  ${name}`);
    process.exit(1);
  }

  const generated = [];
  const failures = [];
  const notesByIcon = new Map();
  const noStrokeParity = [];

  for (const [name, slug] of entries) {
    const notes = [];
    try {
      const item = await loadRegistryItem(slug, recorded, fetched);
      const file = item.files?.find((f) => f.path?.endsWith(".tsx")) ?? item.files?.[0];
      if (!file?.content) throw new Error("registry item has no component file");

      const propBased = propBasedNames.has(name);
      const legacy = propBased ? null : staticLegacyShape(name);
      const strokeWidths = propBased ? staticStrokeWidths(name) : legacy.strokeWidth;
      if (!strokeWidths) noStrokeParity.push(name);

      const source = renderComponent({
        name,
        slug,
        source: file.content,
        propBased,
        legacy,
        strokeWidths,
        notes,
      });
      generated.push({
        name,
        slug,
        propBased,
        source,
        ...(propBased ? {} : { sizeClass: legacy.classes.find((c) => c.startsWith("size-")) }),
      });
      if (notes.length) notesByIcon.set(name, notes);
    } catch (err) {
      failures.push({ name, slug, message: err.message });
    }
  }

  // A partial run writes nothing: `keep` is built from successes, so emitting here
  // would delete working, committed components for every icon that failed.
  if (failures.length) {
    console.error(`${failures.length} of ${entries.length} icon(s) could not be imported:`);
    for (const f of failures) console.error(`  ${f.name} (${f.slug}): ${f.message}`);
    console.error(
      "\nNothing was written. Fix the above (or drop the icon from the map) and re-run.",
    );
    process.exit(1);
  }
  if (generated.length !== entries.length) {
    console.error(`expected ${entries.length} icons, generated ${generated.length}`);
    process.exit(1);
  }

  fs.mkdirSync(OUT_DIR, { recursive: true });
  for (const icon of generated) {
    fs.writeFileSync(path.join(OUT_DIR, `${icon.name}.tsx`), icon.source);
  }

  // Drop generated files for icons no longer in the map.
  const keep = new Set(generated.map((e) => `${e.name}.tsx`));
  for (const file of fs.readdirSync(OUT_DIR)) {
    if (HAND_WRITTEN.has(file) || keep.has(file) || file.endsWith(".test.tsx")) continue;
    fs.rmSync(path.join(OUT_DIR, file));
    console.log(`removed stale ${file}`);
  }

  const manifestEntries = generated
    .map(({ name, slug, propBased, sizeClass }) => ({
      name,
      slug,
      propBased,
      ...(sizeClass ? { sizeClass } : {}),
    }))
    .sort((a, b) => a.name.localeCompare(b.name));

  const manifest = {
    registry: {
      host: REGISTRY_HOST,
      items: Object.fromEntries(Object.entries(fetched).sort(([a], [b]) => a.localeCompare(b))),
    },
    icons: manifestEntries,
  };
  fs.writeFileSync(OUT_MANIFEST_PATH, `${JSON.stringify(manifest, null, 2)}\n`);

  const barrel = `/**
 * Optional animated icon entry point — \`@fanvue/ui/animated-icons\`.
 *
 * Every export here mirrors an icon of the same name in \`@fanvue/ui\`, renders in
 * the same box and carries the same stroke weight, so swapping the import path
 * changes the motion and nothing else:
 *
 * \`\`\`tsx
 * import { HeartIcon } from "@fanvue/ui";                 // static
 * import { HeartIcon } from "@fanvue/ui/animated-icons";  // animates on hover
 * \`\`\`
 *
 * Not every icon has a twin: an icon is only mapped once its animated artwork has
 * been compared against ours, so a missing export means the pair was rejected or
 * upstream has no equivalent. \`SpinnerIcon\` is deliberately absent — a loading
 * indicator must not wait for a hover.
 *
 * Nothing animates when the user has asked for reduced motion.
 *
 * Requires the optional \`motion\` peer dependency (\`pnpm add motion\`). Kept on its
 * own subpath so \`@fanvue/ui\` consumers never pay for Motion unless they opt in.
 *
 * Artwork and animations from ${ATTRIBUTION}.
 * See THIRD-PARTY-NOTICES.md for the full licence text.
 * Generated by scripts/import-animated-icons.mjs — do not edit by hand.
 */
${manifestEntries
  .map(
    (e) =>
      `export type { ${e.name}Handle, ${e.name}Props } from "./components/AnimatedIcons/${e.name}";\nexport { ${e.name} } from "./components/AnimatedIcons/${e.name}";`,
  )
  .join("\n")}
export type { IconSize } from "./components/Icons/types";
export type {
  AnimatedIconHandle,
  AnimatedIconProps,
  AnimatedLegacyIconProps,
} from "./components/AnimatedIcons/types";
`;
  fs.writeFileSync(BARREL_PATH, barrel);

  console.log(`Wrote ${manifestEntries.length} animated icons to ${OUT_DIR}`);
  console.log(`Wrote manifest to ${OUT_MANIFEST_PATH}`);
  console.log(`Wrote barrel to ${BARREL_PATH}`);

  const { spawnSync } = await import("node:child_process");
  const result = spawnSync(
    "pnpm",
    ["biome", "check", OUT_DIR, BARREL_PATH, OUT_MANIFEST_PATH, "--write"],
    { cwd: REPO_ROOT, stdio: "inherit" },
  );
  // status 1 is biome's "fixed something" status; only other codes are real failures.
  if (result.status !== 0 && result.status !== 1) {
    console.error("biome format pass failed with status", result.status);
    process.exit(result.status ?? 1);
  }

  // Registry files for slugs no longer mapped would otherwise sit there forever,
  // hash-verified against nothing.
  const orphans = fs
    .readdirSync(REGISTRY_DIR)
    .filter((f) => f.endsWith(".json") && !fetched[f.replace(/\.json$/, "")]);
  if (orphans.length) {
    console.log(
      `\n${orphans.length} unused registry file(s) — delete them:\n  ${orphans.join(", ")}`,
    );
  }

  // Reported last so it survives biome's output.
  if (noStrokeParity.length) {
    console.log(
      `\n${noStrokeParity.length} icon(s) have no stroke to match (the static twin is fill-only), ` +
        `so they keep upstream's weight:\n  ${noStrokeParity.join(", ")}`,
    );
  }
  if (notesByIcon.size) {
    console.log("\nRewrites worth knowing about:");
    for (const [name, notes] of notesByIcon) {
      for (const note of notes) console.log(`  ${name}: ${note}`);
    }
  }
}

await main();
