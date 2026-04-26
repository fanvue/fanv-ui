import * as React from "react";
import { BaseIcon } from "./BaseIcon";
import type { BaseIconProps, IconVariants } from "./types";

const VARIANTS: IconVariants = {
  16: {
    outlined: [{ d: "M10 12 6 8l4-4", sw: 1.5 }],
  },
  24: {
    outlined: [{ d: "m14.5 17-5-5 5-5", sw: 1.875 }],
  },
  32: {
    outlined: [{ d: "m19 22-6-6 6-6", sw: 2.25 }],
  },
};

/** Props for {@link ChevronLeftIcon}. See {@link BaseIconProps} for the shared shape. */
export type ChevronLeftIconProps = BaseIconProps;

/**
 * Chevron Left icon. Renders at sizes 16, 24, or 32 px.
 *
 * @example
 * ```tsx
 * <ChevronLeftIcon size={24} />
 * ```
 */
export const ChevronLeftIcon = React.forwardRef<SVGSVGElement, ChevronLeftIconProps>(
  (props, ref) => <BaseIcon ref={ref} variants={VARIANTS} {...props} />,
);

ChevronLeftIcon.displayName = "ChevronLeftIcon";
