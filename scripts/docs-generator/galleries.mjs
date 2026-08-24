/**
 * The three pages that are indexes rather than components: static icons,
 * animated icons, and country flags.
 *
 * Each is generated as a whole page rather than a wrapper plus snippets,
 * because the interesting content is a list of hundreds of names and there is
 * nothing useful to hand-write around it. Mintlify cannot run custom client
 * JavaScript, so the searchable galleries in Storybook become sorted tables
 * here, with one live Storybook embed for the interactive version — but only
 * where a story genuinely shows what the page is about.
 */

import { declarationDescription } from "./docgen.mjs";
import { embedHeight } from "./examples-snippet.mjs";
import { GENERATED_BANNER, jsdocToMdx } from "./mdx.mjs";
import { renderParamField } from "./props-snippet.mjs";

/**
 * Codes the flag artwork ships that are not ISO 3166-1 regions, so
 * `Intl.DisplayNames` has nothing to say about them.
 */
const NON_REGION_FLAG_NAMES = {
  eu: "European Union",
  un: "United Nations",
  xk: "Kosovo",
  xx: "Unknown / placeholder",
};

/**
 * @param {object} context
 * @returns {string}
 */
export function renderIconsPage(context) {
  const manifest = context.readJson("scripts/icons.manifest.json");
  const tags = context.readJson("scripts/icon-tags.json");
  const propBased = new Map(manifest.icons.map((icon) => [icon.name, icon]));
  const names = context.iconNames.slice().sort((a, b) => a.localeCompare(b));
  const animated = new Set(context.animatedIconNames);

  const untagged = [];
  const rows = names.map((name) => {
    const entry = propBased.get(name);
    const sizes = entry ? entry.sizes.join(", ") : "any (via `className`)";
    const filled = entry?.hasFilled ? "yes" : "no";
    const keywords = (tags[name] ?? []).slice(0, 4).join(", ");
    if (!keywords) untagged.push(name);
    return `| \`${name}\` | ${sizes} | ${filled} | ${animated.has(name) ? "yes" : "no"} | ${keywords} |`;
  });

  if (untagged.length > 0) {
    context.warnings.push(
      `${untagged.length} icons have no search keywords in scripts/icon-tags.json: ${untagged.join(", ")}`,
    );
  }

  return [
    frontmatter("Icons", `All ${names.length} icons in @fanvue/ui, with their sizes and variants.`),
    GENERATED_BANNER,
    "",
    "Every icon is a named export of `@fanvue/ui` and renders as an inline `<svg>` that inherits `currentColor`.",
    "",
    '```tsx\nimport { AddCircleIcon } from "@fanvue/ui";\n\n<AddCircleIcon size={24} filled />;\n```',
    "",
    "<Note>",
    `  ${propBased.size} of the ${names.length} icons take the \`size\` and \`filled\` props below — they ship dedicated path geometry per size rather than scaling one drawing. The rest are single-size legacy icons sized with a utility class, e.g. \`className="size-6"\`.`,
    "</Note>",
    "",
    "## Shared props",
    "",
    ...iconPropFields(context),
    "## Browse",
    "",
    embed(context, "foundations-icons--gallery", "Icon gallery"),
    "",
    "The embed above is searchable and copies the import line on click. The full",
    "index below is sorted alphabetically; every name imports from `@fanvue/ui`.",
    "",
    "## All icons",
    "",
    "| Icon | Sizes | Filled | Animated twin | Keywords |",
    "| --- | --- | --- | --- | --- |",
    ...rows,
    "",
    ...setupFooter(context, false),
  ].join("\n");
}

/**
 * @param {object} context
 * @returns {string[]}
 */
function iconPropFields(context) {
  const entry = context.docgenByMember.get("src/components/Icons/BaseIcon.tsx#BaseIcon");
  const lines = [];
  const props = Object.values(entry?.props ?? {})
    .filter((prop) => prop.name === "size" || prop.name === "filled")
    .sort((a, b) => a.name.localeCompare(b.name));
  for (const prop of props) {
    lines.push(...renderParamField(prop), "");
  }
  if (lines.length === 0) {
    const source = context.readSource("src/components/Icons/types.ts");
    lines.push(jsdocToMdx(declarationDescription(source, "BaseIconProps")), "");
  }
  lines.push(
    "Every icon also accepts the standard `SVGAttributes` of an `<svg>` element,",
    "including `className`, `style` and `aria-*`. Icons are `aria-hidden` by default;",
    'for a standalone icon pass `aria-hidden={false}` with `role="img"` and an `aria-label`.',
    "",
  );
  return lines;
}

/**
 * @param {object} context
 * @returns {string}
 */
export function renderAnimatedIconsPage(context) {
  const manifest = context.readJson("scripts/animated-icons.manifest.json");
  const icons = manifest.icons.slice().sort((a, b) => a.name.localeCompare(b.name));
  const propBased = icons.filter((icon) => icon.propBased).length;
  const rows = icons.map(
    (icon) =>
      `| \`${icon.name}\` | \`${icon.slug}\` | ${icon.propBased ? "`size={16 \\| 24 \\| 32}`" : "`className`"} |`,
  );

  return [
    frontmatter(
      "Animated icons",
      `${icons.length} icons that animate on hover, as a drop-in replacement for their static twins.`,
    ),
    GENERATED_BANNER,
    "",
    "Every export here mirrors an icon of the same name in `@fanvue/ui` and renders",
    "in the same box, so swapping the import path changes the motion and nothing",
    "about your layout.",
    "",
    '```tsx\n// The static icon, and its animated twin of the same name.\nimport { HeartIcon } from "@fanvue/ui";\nimport { HeartIcon as AnimatedHeartIcon } from "@fanvue/ui/animated-icons";\n```',
    "",
    "<Warning>",
    "  This subpath needs the optional `motion` peer dependency. Install it alongside",
    `  \`@fanvue/ui\`, or the import will fail to resolve — see [Subpath exports](/${context.config.docsPathPrefix ?? "ui"}/subpath-exports).`,
    "",
    "  ```bash",
    "  pnpm add motion",
    "  ```",
    "</Warning>",
    "",
    "## Shared props",
    "",
    "Every animated icon accepts the standard `SVGAttributes` of an `<svg>` element",
    "(`className`, `style`, `aria-*`), plus:",
    "",
    "<ParamField path='size' type='16 | 24 | 32' default='24'>",
    `  Pixel size, matching the static icon's box exactly. Available on the ${propBased} icons`,
    `  whose static twin is prop-based; the other ${icons.length - propBased} are sized with a utility`,
    '  class instead, e.g. `className="size-6"`.',
    "</ParamField>",
    "",
    "<ParamField path='controlRef' type='Ref<AnimatedIconHandle>'>",
    "  Drives the animation yourself. When set, hovering the icon no longer starts it,",
    "  and `onMouseEnter` / `onMouseLeave` are forwarded untouched. The handle exposes",
    "  `startAnimation()` and `stopAnimation()`.",
    "</ParamField>",
    "",
    "<ParamField path='filled' type='never'>",
    "  Not available. The animated artwork is stroke-only, so there is no filled variant",
    "  to swap to; the prop is typed as `never` so passing it through a wrapper's spread",
    "  fails to compile instead of reaching the DOM.",
    "</ParamField>",
    "",
    "Each icon also exports a matching `<Name>Props` and `<Name>Handle` type, so a",
    "wrapper component can forward the ref with full typing.",
    "",
    "## Driving the animation",
    "",
    "Each icon animates on its own hover and focus. To drive it from a parent — a",
    "card that plays its icon when the whole card is hovered — pass a `controlRef`",
    "and call the handle.",
    "",
    '```tsx\nimport { useRef } from "react";\nimport { HeartIcon } from "@fanvue/ui/animated-icons";\nimport type { HeartIconHandle } from "@fanvue/ui/animated-icons";\n\nfunction LikeCard() {\n  const icon = useRef<HeartIconHandle>(null);\n  return (\n    <button\n      type="button"\n      onMouseEnter={() => icon.current?.startAnimation()}\n      onMouseLeave={() => icon.current?.stopAnimation()}\n    >\n      <HeartIcon controlRef={icon} size={24} />\n      Like\n    </button>\n  );\n}\n```',
    "",
    "<Note>",
    "  Nothing animates under `prefers-reduced-motion`. `SpinnerIcon` is deliberately",
    "  absent — a loading indicator must not wait for a hover.",
    "</Note>",
    "",
    "## All animated icons",
    "",
    `Every name below imports from \`@fanvue/ui/animated-icons\`. The sizing column says how the icon is sized: the ${propBased} icons whose static twin is prop-based take \`size\`, and the remaining ${icons.length - propBased} take a utility class.`,
    "",
    "| Icon | Upstream slug | Sizing |",
    "| --- | --- | --- |",
    ...rows,
    "",
    "Artwork and animations from [lucide-animated](https://lucide-animated.com) (MIT).",
    "",
    ...setupFooter(context, true),
  ].join("\n");
}

/**
 * @param {object} context
 * @returns {string}
 */
export function renderCountryFlagPage(context) {
  const codes = parseFlagCodes(context.readSource("src/components/CountryFlag/flagShapes.ts"));
  const names = countryNames(codes, context);
  const rows = codes
    .slice()
    .sort((a, b) => a.localeCompare(b))
    .map((code) => `| \`${code}\` | ${names.get(code)} |`);
  const allFlags = context.storyIdFor?.("CountryFlag", "AllFlags");

  return [
    frontmatter(
      "CountryFlag",
      `A circular country flag for any of ${codes.length} codes, drawn inline as SVG.`,
    ),
    GENERATED_BANNER,
    "",
    'import CountryFlagProps from "/snippets/ui/country-flag-props.mdx";',
    'import CountryFlagExamples from "/snippets/ui/country-flag-examples.mdx";',
    "",
    '```tsx\nimport { CountryFlag } from "@fanvue/ui/flags";\n\n<CountryFlag country="NL" size={24} label="Netherlands" />;\n```',
    "",
    "<Note>",
    `  Flags live on their own subpath so the artwork for ${codes.length} countries never lands`,
    `  in a bundle that does not ask for it — see [Subpath exports](/${context.config.docsPathPrefix ?? "ui"}/subpath-exports).`,
    "</Note>",
    "",
    "## Props",
    "",
    "<CountryFlagProps />",
    "",
    "## Examples",
    "",
    "<CountryFlagExamples />",
    "",
    ...(allFlags ? ["## Every flag", "", embed(context, allFlags, "Every country flag"), ""] : []),
    "## Supported codes",
    "",
    "Codes are case-insensitive, mostly ISO 3166-1 alpha-2 plus the extras the",
    "artwork source ships (`eu`, `un`, `xk`). Anything with no artwork renders the",
    "grey placeholder disc, so a live feed of country codes can be passed straight",
    "through without filtering.",
    "",
    "| Code | Country |",
    "| --- | --- |",
    ...rows,
    "",
    ...setupFooter(context, true),
  ].join("\n");
}

/**
 * Country names come from `Intl.DisplayNames`, which every supported Node ships
 * with full ICU data for — there is no dependency to add and no 265-entry table
 * to keep in step with the artwork.
 *
 * @param {string[]} codes
 * @param {object} context
 * @returns {Map<string, string>}
 */
function countryNames(codes, context) {
  const display = new Intl.DisplayNames(["en"], { type: "region", fallback: "none" });
  const names = new Map();
  const unnamed = [];
  for (const code of codes) {
    const explicit = NON_REGION_FLAG_NAMES[code.toLowerCase()];
    if (explicit) {
      names.set(code, explicit);
      continue;
    }
    const resolved = display.of(code.toUpperCase());
    if (resolved) {
      names.set(code, resolved);
      continue;
    }
    names.set(code, "—");
    unnamed.push(code);
  }
  if (unnamed.length > 0) {
    context.warnings.push(
      `${unnamed.length} flag codes have no region name: ${unnamed.join(", ")}. Add them to NON_REGION_FLAG_NAMES in scripts/docs-generator/galleries.mjs.`,
    );
  }
  return names;
}

/**
 * @param {string} source
 * @returns {string[]}
 */
function parseFlagCodes(source) {
  const match = source.match(/export type CountryFlagCode =([\s\S]*?);/);
  if (!match) return [];
  return [...match[1].matchAll(/"([^"]+)"/g)].map((item) => item[1]);
}

/**
 * @param {object} context
 * @param {string} storyId
 * @param {string} title
 * @returns {string}
 */
function embed(context, storyId, title) {
  const params = [`id=${storyId}`, "viewMode=story", "shortcuts=false", "singleStory=true"];
  if (context.config.embedTheme) params.push(`globals=theme:${context.config.embedTheme}`);
  const url = `${context.config.chromaticIframeBase}?${params.join("&")}`;
  // A gallery embed is one story showing hundreds of items, so it is always an
  // outlier: its height belongs in `embedHeights.byStory`.
  const height = embedHeight(context.config, { category: "Gallery", storyId });
  return [
    "<Frame>",
    `  <iframe src={${JSON.stringify(url)}} width="100%" height="${height}" style={{border: "none", borderRadius: "8px"}} loading="lazy" title=${JSON.stringify(title)} />`,
    "</Frame>",
  ].join("\n");
}

/**
 * Search drops people onto a gallery as readily as onto a component page, so
 * each one ends with the same route back to setup.
 *
 * @param {object} context
 * @param {boolean} subpath Whether the page documents a non-root subpath.
 * @returns {string[]}
 */
function setupFooter(context, subpath) {
  const prefix = context.config.docsPathPrefix ?? "ui";
  const links = [
    `[Installation](/${prefix}/installation)`,
    `[Theming](/${prefix}/theming)`,
    ...(subpath ? [`[Subpath exports](/${prefix}/subpath-exports)`] : []),
  ];
  return ["---", "", `**Setup:** ${links.join(" · ")}`, ""];
}

/**
 * @param {string} title
 * @param {string} description
 * @returns {string}
 */
function frontmatter(title, description) {
  return ["---", `title: "${title}"`, `description: "${description}"`, "---", ""].join("\n");
}
