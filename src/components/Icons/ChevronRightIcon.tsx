import * as React from "react";
import { BaseIcon } from "./BaseIcon";
import type { BaseIconProps, IconVariants } from "./types";

const VARIANTS: IconVariants = {
  16: {
    outlined: [{ d: "m6 4 4 4-4 4", sw: 1.5 }],
  },
  24: {
    outlined: [{ d: "m9.5 7 5 5-5 5", sw: 1.875 }],
  },
  32: {
    outlined: [{ d: "m13 10 6 6-6 6", sw: 2.25 }],
  },
};

/** Props for {@link ChevronRightIcon}. See {@link BaseIconProps} for the shared shape. */
export type ChevronRightIconProps = BaseIconProps;

/**
 * Chevron Right icon. Renders at sizes 16, 24, or 32 px.
 *
 * @example
 * ```tsx
 * <ChevronRightIcon size={24} />
 * ```
 */
export const ChevronRightIcon = React.forwardRef<SVGSVGElement, ChevronRightIconProps>(
  (props, ref) => <BaseIcon ref={ref} variants={VARIANTS} {...props} />,
);

ChevronRightIcon.displayName = "ChevronRightIcon";
