import * as React from "react";
import { BaseIcon } from "./BaseIcon";
import type { BaseIconProps, IconVariants } from "./types";

const VARIANTS: IconVariants = {
  16: {
    outlined: [{ d: "m3.333 8 3.334 3.333L13 5" }],
  },
  24: {
    outlined: [{ d: "m5 12 5 5 9.5-9.5", sw: 1.5 }],
  },
  32: {
    outlined: [{ d: "m6.667 16 6.666 6.667L26 10", sw: 2 }],
  },
};

/** Props for {@link TickIcon}. See {@link BaseIconProps} for the shared shape. */
export type TickIconProps = BaseIconProps;

/**
 * Tick icon. Renders at sizes 16, 24, or 32 px.
 *
 * @example
 * ```tsx
 * <TickIcon size={24} />
 * ```
 */
export const TickIcon = React.forwardRef<SVGSVGElement, TickIconProps>((props, ref) => (
  <BaseIcon ref={ref} variants={VARIANTS} {...props} />
));

TickIcon.displayName = "TickIcon";
