/**
 * The three pages that are indexes rather than components: static icons,
 * animated icons, and country flags.
 *
 * Each is generated as a whole page rather than a wrapper plus snippets,
 * because the interesting content is a list of hundreds of names and there is
 * nothing useful to hand-write around it. Mintlify cannot run custom client
 * JavaScript, so the searchable galleries in Storybook become sorted tables
 * here, with one live Storybook embed for the interactive version.
 */

import { declarationDescription } from "./docgen.mjs";
import { GENERATED_BANNER, jsdocToMdx } from "./mdx.mjs";

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

  const rows = names.map((name) => {
    const entry = propBased.get(name);
    const sizes = entry ? entry.sizes.join(", ") : "any (via `className`)";
    const filled = entry?.hasFilled ? "yes" : "no";
    const keywords = (tags[name] ?? []).slice(0, 4).join(", ");
    const line = `\`import { ${name} } from "@fanvue/ui";\``;
    return `| ${line} | ${sizes} | ${filled} | ${animated.has(name) ? "yes" : "no"} | ${keywords} |`;
  });

  return [
    frontmatter("Icons", `All ${names.length} icons in @fanvue/ui, with their sizes and variants.`),
    GENERATED_BANNER,
    "",
    `Every icon is a named export of \`@fanvue/ui\` and renders as an inline \`<svg>\` that inherits \`currentColor\`.`,
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
    embed(context, "foundations-icons--gallery", "Icon gallery", 640),
    "",
    "The embed above is searchable and copies the import line on click. The full",
    "index below is sorted alphabetically.",
    "",
    "## All icons",
    "",
    "| Import | Sizes | Filled | Animated twin | Keywords |",
    "| --- | --- | --- | --- | --- |",
    ...rows,
    "",
  ].join("\n");
}

/**
 * @param {object} context
 * @returns {string[]}
 */
function iconPropFields(context) {
  const source = context.readSource("src/components/Icons/types.ts");
  const entry = context.docgenByMember.get("src/components/Icons/BaseIcon.tsx#BaseIcon");
  const lines = [];
  const props = Object.values(entry?.props ?? {})
    .filter((prop) => prop.name === "size" || prop.name === "filled")
    .sort((a, b) => a.name.localeCompare(b.name));
  for (const prop of props) {
    const type =
      prop.type?.name === "enum"
        ? prop.type.value.map((value) => value.value).join(" | ")
        : (prop.type?.raw ?? prop.type?.name);
    const attributes = [`path='${prop.name}'`, `type='${type}'`];
    if (prop.defaultValue?.value !== undefined && prop.defaultValue?.value !== null) {
      attributes.push(`default='${String(prop.defaultValue.value)}'`);
    }
    const description = jsdocToMdx(prop.description);
    if (description) {
      lines.push(`<ParamField ${attributes.join(" ")}>`, `  ${description}`, "</ParamField>", "");
    } else {
      lines.push(`<ParamField ${attributes.join(" ")} />`, "");
    }
  }
  if (lines.length === 0) {
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
  const rows = icons.map(
    (icon) => `| \`${icon.name}\` | \`${icon.slug}\` | ${icon.propBased ? "yes" : "no"} |`,
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
    '```tsx\nimport { HeartIcon } from "@fanvue/ui";                 // static\nimport { HeartIcon } from "@fanvue/ui/animated-icons";  // animates on hover\n```',
    "",
    "<Warning>",
    "  This subpath needs the optional `motion` peer dependency. Install it alongside",
    "  `@fanvue/ui`, or the import will fail to resolve.",
    "",
    "  ```bash",
    "  pnpm add motion",
    "  ```",
    "</Warning>",
    "",
    "## Driving the animation",
    "",
    "Each icon animates on its own hover and focus. To drive it from a parent — a",
    "card that plays its icon when the whole card is hovered — pass a `controlRef`",
    "and call the handle.",
    "",
    "Each icon exports a matching `<Name>Props` and `<Name>Handle` type, so a",
    "wrapper component can forward the ref with full typing.",
    "",
    '```tsx\nimport { useRef } from "react";\nimport { HeartIcon } from "@fanvue/ui/animated-icons";\nimport type { HeartIconHandle } from "@fanvue/ui/animated-icons";\n\nfunction LikeCard() {\n  const icon = useRef<HeartIconHandle>(null);\n  return (\n    <button\n      type="button"\n      onMouseEnter={() => icon.current?.startAnimation()}\n      onMouseLeave={() => icon.current?.stopAnimation()}\n    >\n      <HeartIcon controlRef={icon} size={24} />\n      Like\n    </button>\n  );\n}\n```',
    "",
    "<Note>",
    "  Nothing animates under `prefers-reduced-motion`. The animated artwork is",
    "  stroke-only, so these icons have no `filled` variant even where their static",
    "  twin does. `SpinnerIcon` is deliberately absent — a loading indicator must not",
    "  wait for a hover.",
    "</Note>",
    "",
    "## Preview",
    "",
    embed(context, "foundations-icons--gallery", "Animated icon gallery", 640),
    "",
    "Turn on the **animated** toggle in the embed above, then hover a card.",
    "",
    "## All animated icons",
    "",
    "| Icon | Upstream slug | Takes `size` / `filled` props |",
    "| --- | --- | --- |",
    ...rows,
    "",
    "Artwork and animations from [lucide-animated](https://lucide-animated.com) (MIT).",
    "",
  ].join("\n");
}

/**
 * @param {object} context
 * @returns {string}
 */
export function renderCountryFlagPage(context) {
  const codes = parseFlagCodes(context.readSource("src/components/CountryFlag/flagShapes.ts"));
  const grouped = new Map();
  for (const code of codes) {
    const letter = code[0];
    if (!grouped.has(letter)) grouped.set(letter, []);
    grouped.get(letter).push(code);
  }
  const rows = [...grouped.entries()]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([letter, list]) => `| **${letter}** | ${list.map((code) => `\`${code}\``).join(" ")} |`);

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
    "  Flags live on their own subpath so the artwork for 265 countries never lands",
    "  in a bundle that does not ask for it.",
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
    "## Supported codes",
    "",
    "Codes are case-insensitive, mostly ISO 3166-1 alpha-2 plus the extras the",
    "artwork source ships (`eu`, `un`, `xk`). Anything with no artwork renders the",
    "grey placeholder disc, so a live feed of country codes can be passed straight",
    "through without filtering.",
    "",
    "| | Codes |",
    "| --- | --- |",
    ...rows,
    "",
  ].join("\n");
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
 * @param {number} height
 * @returns {string}
 */
function embed(context, storyId, title, height) {
  const params = [`id=${storyId}`, "viewMode=story", "shortcuts=false", "singleStory=true"];
  if (context.config.embedTheme) params.push(`globals=theme:${context.config.embedTheme}`);
  const url = `${context.config.chromaticIframeBase}?${params.join("&")}`;
  return [
    "<Frame>",
    `  <iframe src={${JSON.stringify(url)}} width="100%" height="${height}" style={{border: "none", borderRadius: "8px"}} loading="lazy" title=${JSON.stringify(title)} />`,
    "</Frame>",
  ].join("\n");
}

/**
 * @param {string} title
 * @param {string} description
 * @returns {string}
 */
function frontmatter(title, description) {
  return ["---", `title: "${title}"`, `description: "${description}"`, "---", ""].join("\n");
}
