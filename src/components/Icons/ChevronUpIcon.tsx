import * as React from "react";
import { BaseIcon } from "./BaseIcon";
import type { BaseIconProps, IconVariants } from "./types";

const VARIANTS: IconVariants = {
  16: {
    outlined: [{ d: "m4 10 4-4 4 4", sw: 1.5 }],
  },
  24: {
    outlined: [{ d: "m7 14.5 5-5 5 5", sw: 1.875 }],
  },
  32: {
    outlined: [{ d: "m10 19 6-6 6 6", sw: 2.25 }],
  },
};

/** Props for {@link ChevronUpIcon}. See {@link BaseIconProps} for the shared shape. */
export type ChevronUpIconProps = BaseIconProps;

/**
 * Chevron Up icon. Renders at sizes 16, 24, or 32 px.
 *
 * @example
 * ```tsx
 * <ChevronUpIcon size={24} />
 * ```
 */
export const ChevronUpIcon = React.forwardRef<SVGSVGElement, ChevronUpIconProps>((props, ref) => (
  <BaseIcon ref={ref} variants={VARIANTS} {...props} />
));

ChevronUpIcon.displayName = "ChevronUpIcon";
