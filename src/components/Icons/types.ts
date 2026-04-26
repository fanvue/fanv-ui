import type * as React from "react";

/**
 * Props for legacy (un-migrated) icons. Newer prop-based icons use
 * {@link BaseIconProps} instead, which adds typed `size` and `filled` props.
 *
 * Legacy icons ship at a single size and are sized via `className` (e.g.
 * `className="size-6"`).
 */
export type IconProps = React.SVGAttributes<SVGSVGElement> & {
  className?: string;
};

/** Pixel size at which a prop-based icon was authored. Each size has dedicated path geometry. */
export type IconSize = 16 | 24 | 32;

/** A single drawable path within an icon variant. */
export type IconPath = {
  /** SVG `d` attribute. */
  d: string;
  /** When set, render as a stroke of this width using `currentColor`. Otherwise renders as a fill. */
  sw?: number;
  /** When `true`, render the fill with `fill-rule="evenodd"` (compound paths with cutouts). */
  eo?: boolean;
};

/**
 * Per-size variant data for a prop-based icon. Each size always has `outlined`
 * paths; `filled` is only present when the filled artwork differs from outlined.
 */
export type IconVariants = Partial<
  Record<IconSize, { outlined: readonly IconPath[]; filled?: readonly IconPath[] }>
>;

/**
 * Props shared by every prop-based icon. Each icon re-exports this as its own
 * `*IconProps` alias so consumers can type wrappers and forwarded refs.
 *
 * `aria-hidden` defaults to `"true"` (icons are decorative). For standalone
 * icons (e.g. icon-only buttons), pass `aria-hidden={false}` together with
 * `role="img"` and an `aria-label`.
 */
export interface BaseIconProps extends Omit<React.SVGAttributes<SVGSVGElement>, "size"> {
  /** Pixel size — selects the dedicated path geometry. @default 24 */
  size?: IconSize;
  /** Render the filled variant when available; falls back to outlined. @default false */
  filled?: boolean;
}
