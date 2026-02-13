import type * as React from "react";

/**
 * Shared props for all icon components. Extends standard SVG attributes.
 *
 * Each icon ships with a default size class (e.g. `size-5`). Override it via
 * `className` (e.g. `className="size-6"`).
 */
export type IconProps = React.SVGAttributes<SVGSVGElement> & {
  className?: string;
};
