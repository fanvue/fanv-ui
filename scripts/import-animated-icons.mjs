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
 *   legacy twin's own class), keeping animated and static art 1:1 at every size
 * - the `ref` stays an `SVGSVGElement` ref like every other icon here; upstream's
 *   imperative handle moves to the `controlRef` prop
 *
 * Anything the rewrite does not recognise is reported and skipped rather than
 * emitted half-transformed.
 *
 * Usage:
 *   node scripts/import-animated-icons.mjs            # use cached registry files
 *   node scripts/import-animated-icons.mjs --refresh  # re-fetch from the registry
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..");
const MAP_PATH = path.join(__dirname, "animated-icons.map.json");
const ICONS_MANIFEST_PATH = path.join(__dirname, "icons.manifest.json");
const OUT_MANIFEST_PATH = path.join(__dirname, "animated-icons.manifest.json");
const CACHE_DIR = path.join(REPO_ROOT, ".icon-migration/animated-registry");
const STATIC_ICONS_DIR = path.join(REPO_ROOT, "src/components/Icons");
const OUT_DIR = path.join(REPO_ROOT, "src/components/AnimatedIcons");
const BARREL_PATH = path.join(REPO_ROOT, "src/animated-icons.ts");

const REGISTRY_URL = (slug) => `https://lucide-animated.com/r/${slug}.json`;
const ATTRIBUTION = "lucide-animated (MIT, (c) 2024-2026 pqoqubbw) — https://lucide-animated.com";

/** Files the generator owns; everything else in OUT_DIR is hand-written. */
const HAND_WRITTEN = new Set(["types.ts", "useIconAnimation.ts", "NOTICE.md"]);

const refresh = process.argv.includes("--refresh");

async function loadRegistryItem(slug) {
  const cachePath = path.join(CACHE_DIR, `${slug}.json`);
  if (!refresh && fs.existsSync(cachePath)) {
    return JSON.parse(fs.readFileSync(cachePath, "utf8"));
  }
  const res = await fetch(REGISTRY_URL(slug));
  if (!res.ok) throw new Error(`registry fetch failed (${res.status}) for ${slug}`);
  const text = await res.text();
  fs.mkdirSync(CACHE_DIR, { recursive: true });
  fs.writeFileSync(cachePath, text);
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

/**
 * Markers for the standard upstream shell — one `controls` animation, hover
 * handlers, an imperative handle. Those icons get the shared `useIconAnimation`
 * hook; anything else keeps its own hook body (see `rewriteHookBody`).
 */
const BOILERPLATE_MARKERS = ["useImperativeHandle(", "handleMouseEnter", "handleMouseLeave"];
const UNSUPPORTED_HOOKS = ["useState(", "useEffect(", "useMemo(", "useReducer(", "useId("];

/**
 * Adapt an upstream hook body we are keeping verbatim: point the imperative
 * handle at `controlRef`, namespace the React hooks (we import React wholesale),
 * and retype the hover handlers now that they sit on the `<svg>`.
 *
 * Used for the handful of icons that drive several animations at once, where the
 * shared single-controller hook does not fit.
 */
function rewriteHookBody(body) {
  return body
    .replace(/\buseImperativeHandle\(\s*ref\b/g, "React.useImperativeHandle(controlRef")
    .replace(/(?<!React\.)\buse(Ref|Callback|ImperativeHandle)\(/g, "React.use$1(")
    .replace(/(?:React\.)?MouseEvent<HTMLDivElement>/g, "React.MouseEvent<SVGSVGElement>");
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

/** The statements `useIconAnimation` replaces; anything else in the body is kept. */
const BOILERPLATE_STATEMENTS = [
  /const controls = useAnimation\(\);/,
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
function stripBoilerplate(body) {
  return BOILERPLATE_STATEMENTS.reduce(removeStatement, body).trim();
}

/** Default box class of a static icon, e.g. `size-5` for a legacy 20px icon. */
function legacySizeClass(name) {
  const src = fs.readFileSync(path.join(STATIC_ICONS_DIR, `${name}.tsx`), "utf8");
  const m = src.match(/cn\(\s*"([^"]*)"/);
  const sizeToken = m?.[1].split(/\s+/).find((c) => c.startsWith("size-"));
  if (!sizeToken) throw new Error(`could not read a default size class from ${name}.tsx`);
  return sizeToken;
}

function renderComponent({ name, slug, source, propBased, sizeClass }) {
  const forwardRefIdx = source.search(/const \w+Icon = forwardRef</);
  if (forwardRefIdx === -1) throw new Error("no forwardRef component found");

  const componentSource = source.slice(forwardRefIdx);
  for (const marker of BOILERPLATE_MARKERS) {
    if (!componentSource.includes(marker)) {
      throw new Error(`unrecognised component shell (missing \`${marker}\`)`);
    }
  }
  for (const hook of UNSUPPORTED_HOOKS) {
    if (componentSource.includes(hook)) {
      throw new Error(`uses ${hook.slice(0, -1)}, which this rewrite does not model`);
    }
  }
  if (!componentSource.includes("<div")) {
    throw new Error("expected a wrapping <div> to strip");
  }

  const moduleDecls = extractModuleDecls(source, forwardRefIdx);
  const { isMotionRoot, attrs, children } = extractSvg(componentSource);

  // Icons that animate several elements independently declare more than one
  // controller, so they keep their own hook body instead of the shared hook.
  const controllerCount = (componentSource.match(/=\s*useAnimation\(\)/g) ?? []).length;
  if (controllerCount === 0) throw new Error("no useAnimation() controller found");
  const sharedHook = controllerCount === 1 && componentSource.includes("const controls =");

  const bodyStart = componentSource.indexOf("=> {");
  const returnMatch = componentSource.slice(bodyStart).match(/\n\s*return \(/);
  if (bodyStart === -1 || !returnMatch) {
    throw new Error("could not isolate the component's hook body");
  }
  const rawBody = componentSource
    .slice(bodyStart + "=> {".length, bodyStart + returnMatch.index)
    .trim();
  // With the shared hook, only the declarations the boilerplate did not cover are
  // carried over; otherwise the whole body comes with us.
  const hookBody = rewriteHookBody(sharedHook ? stripBoilerplate(rawBody) : rawBody);

  // `width`/`height` become the box class; `xmlns` is redundant for inline SVG.
  const dropped = new Set(["width", "height", "xmlns", "classname", "class"]);
  const keptAttrs = attrs.filter((a) => !dropped.has(a.name.toLowerCase()));
  const attrLines = keptAttrs.map((a) => (a.raw === null ? a.name : `${a.name}=${a.raw}`));

  const rootTag = isMotionRoot ? "motion.svg" : "svg";
  const propsType = propBased ? "AnimatedIconProps" : "AnimatedLegacyIconProps";
  const signature = propBased
    ? "({ size = 24, className, controlRef, onMouseEnter, onMouseLeave, ...props }, ref)"
    : "({ className, controlRef, onMouseEnter, onMouseLeave, ...props }, ref)";
  const classExpr = propBased
    ? `cn(ICON_SIZE_CLASS[size], className)`
    : `cn("${sizeClass}", className)`;

  const body = `      <${rootTag}
        ref={ref}
${attrLines.map((l) => `        ${l}`).join("\n")}
        aria-hidden="true"
        className={${classExpr}}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...props}
      >${children.replace(/\s+$/, "")}
      </${rootTag}>`;

  const emitted = `${moduleDecls}\n${hookBody ?? ""}\n${body}`;

  // With the shared hook the only controller in scope is `controls`; if the
  // artwork reaches for another one, the rewrite has lost something.
  if (sharedHook) {
    const stray = [...body.matchAll(/\b(\w*[Cc]ontrols)\b/g)]
      .map((m) => m[1])
      .filter((id) => id !== "controls");
    if (stray.length) {
      throw new Error(`references unknown controller(s): ${[...new Set(stray)].join(", ")}`);
    }
  }

  const motionNamed = ["motion", "AnimatePresence", "cubicBezier", "useAnimation"].filter((id) =>
    new RegExp(`\\b${id}\\b`).test(emitted),
  );
  const motionTypes = ["Transition", "Variants"].filter((id) =>
    new RegExp(`\\b${id}\\b`).test(emitted),
  );
  const reactNamed = ["Fragment"].filter((id) => new RegExp(`\\b${id}\\b`).test(emitted));

  const imports = [
    ...(motionTypes.length
      ? [`import type { ${motionTypes.join(", ")} } from "motion/react";`]
      : []),
    ...(motionNamed.length ? [`import { ${motionNamed.join(", ")} } from "motion/react";`] : []),
    `import * as React from "react";`,
    ...(reactNamed.length ? [`import { ${reactNamed.join(", ")} } from "react";`] : []),
    `import { cn } from "@/utils/cn";`,
    ...(propBased ? [`import { ICON_SIZE_CLASS } from "../Icons/iconSizeClass";`] : []),
    `import type { AnimatedIconHandle, ${propsType} } from "./types";`,
    ...(sharedHook ? [`import { useIconAnimation } from "./useIconAnimation";`] : []),
  ].join("\n");

  const sizeDoc = propBased
    ? "Renders at sizes 16, 24, or 32 px — the same box as the static icon."
    : `Sized via \`className\`, defaulting to the same \`${sizeClass}\` box as the static icon.`;

  return `"use client";

// Generated by scripts/import-animated-icons.mjs — do not edit by hand.
// Source: ${ATTRIBUTION} (registry item "${slug}").
${imports}

${moduleDecls ? `${moduleDecls}\n\n` : ""}/** Props for {@link ${name}}. See {@link ${propsType}} for the shared shape. */
export type ${name}Props = ${propsType};

/** Imperative handle for {@link ${name}}, via its \`controlRef\` prop. */
export type ${name}Handle = AnimatedIconHandle;

/**
 * Animated ${name.replace(/Icon$/, "")} icon — the animated twin of \`${name}\` from
 * \`@fanvue/ui\`. Plays on hover, or on demand through \`controlRef\`.
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
  ...(sharedHook
    ? [
        `    const { controls, handleMouseEnter, handleMouseLeave } = useIconAnimation({
      controlRef,
      onMouseEnter,
      onMouseLeave,
    });`,
      ]
    : []),
  ...(hookBody
    ? [
        hookBody
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

  fs.mkdirSync(OUT_DIR, { recursive: true });

  const manifestEntries = [];
  const failures = [];
  for (const [name, slug] of entries) {
    try {
      const item = await loadRegistryItem(slug);
      const file = item.files?.[0];
      if (!file?.content) throw new Error("registry item has no component file");
      const propBased = propBasedNames.has(name);
      const sizeClass = propBased ? null : legacySizeClass(name);
      const source = renderComponent({
        name,
        slug,
        source: file.content,
        propBased,
        sizeClass,
      });
      fs.writeFileSync(path.join(OUT_DIR, `${name}.tsx`), source);
      manifestEntries.push({ name, slug, propBased, ...(sizeClass ? { sizeClass } : {}) });
    } catch (err) {
      failures.push({ name, slug, message: err.message });
    }
  }

  // Drop generated files for icons no longer in the map.
  const keep = new Set(manifestEntries.map((e) => `${e.name}.tsx`));
  for (const file of fs.readdirSync(OUT_DIR)) {
    if (HAND_WRITTEN.has(file) || keep.has(file) || file.endsWith(".test.tsx")) continue;
    fs.rmSync(path.join(OUT_DIR, file));
    console.log(`removed stale ${file}`);
  }

  manifestEntries.sort((a, b) => a.name.localeCompare(b.name));
  fs.writeFileSync(OUT_MANIFEST_PATH, `${JSON.stringify({ icons: manifestEntries }, null, 2)}\n`);

  const barrel = `/**
 * Optional animated icon entry point — \`@fanvue/ui/animated-icons\`.
 *
 * Every export here mirrors an icon of the same name in \`@fanvue/ui\` and renders
 * in the same box, so an animated icon is a drop-in for its static twin:
 *
 * \`\`\`tsx
 * import { HeartIcon } from "@fanvue/ui";                 // static
 * import { HeartIcon } from "@fanvue/ui/animated-icons";  // animates on hover
 * \`\`\`
 *
 * Requires the optional \`motion\` peer dependency (\`pnpm add motion\`). Kept on its
 * own subpath so \`@fanvue/ui\` consumers never pay for Motion unless they opt in.
 *
 * Artwork and animations from ${ATTRIBUTION}.
 * Generated by scripts/import-animated-icons.mjs — do not edit by hand.
 */
${manifestEntries
  .map(
    (e) =>
      `export type { ${e.name}Handle, ${e.name}Props } from "./components/AnimatedIcons/${e.name}";\nexport { ${e.name} } from "./components/AnimatedIcons/${e.name}";`,
  )
  .join("\n")}
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
  if (failures.length) {
    console.error(`\n${failures.length} icon(s) could not be imported:`);
    for (const f of failures) console.error(`  ${f.name} (${f.slug}): ${f.message}`);
  }

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
  if (failures.length) process.exit(1);
}

await main();
