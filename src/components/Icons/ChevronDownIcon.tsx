import * as React from "react";
import { BaseIcon } from "./BaseIcon";
import type { BaseIconProps, IconVariants } from "./types";

const VARIANTS: IconVariants = {
  16: {
    outlined: [{ d: "m4 6 4 4 4-4", sw: 1.5 }],
  },
  24: {
    outlined: [{ d: "m7 9.5 5 5 5-5", sw: 1.875 }],
  },
  32: {
    outlined: [{ d: "m10 13 6 6 6-6", sw: 2.25 }],
  },
};

/** Props for {@link ChevronDownIcon}. See {@link BaseIconProps} for the shared shape. */
export type ChevronDownIconProps = BaseIconProps;

/**
 * Chevron Down icon. Renders at sizes 16, 24, or 32 px.
 *
 * @example
 * ```tsx
 * <ChevronDownIcon size={24} />
 * ```
 */
export const ChevronDownIcon = React.forwardRef<SVGSVGElement, ChevronDownIconProps>(
  (props, ref) => <BaseIcon ref={ref} variants={VARIANTS} {...props} />,
);

ChevronDownIcon.displayName = "ChevronDownIcon";
