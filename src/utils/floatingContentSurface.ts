/**
 * Surface shared by the floating panels: dropdown menu, select list and popover. Each component
 * keeps its own layout, padding, width and animation; this is only what makes them look like one
 * surface, so a change here reaches all three.
 *
 * The tokens come from `V2 Menu Dropdown` (library node `17245:2317`): `rounded-md` (16px) over
 * `Background/Secondary`, a `Border/Strong` stroke, and the `blur + shadow/menu` effect.
 * `backdrop-blur-xs` (4px) is the CSS equivalent of that effect's BACKGROUND_BLUR radius 8, which
 * Figma halves on export. It is not a 4-against-8 mismatch.
 */
export const FLOATING_CONTENT_SURFACE_CLASS =
  "rounded-md border border-border-strong bg-background-secondary text-content-primary shadow-blur-menu backdrop-blur-xs";

/** Stacking order for portal-rendered panels. Apps override it with `--fanvue-ui-portal-z-index`. */
export const FLOATING_CONTENT_Z_INDEX = "var(--fanvue-ui-portal-z-index, 50)";
