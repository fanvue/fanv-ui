import * as React from "react";
import { BaseIcon } from "./BaseIcon";
import type { BaseIconProps, IconVariants } from "./types";

const VARIANTS: IconVariants = {
  16: {
    outlined: [{ d: "M5.334 7.667 8.667 11 15 4.667m-13.666 3L4.667 11l1-1M11 4.667 7.834 7.833" }],
    filled: [{ d: "M5.333 7.667 8.667 11 15 4.667m-13.667 3L4.667 11l1-1M11 4.667 7.833 7.833" }],
  },
  24: {
    outlined: [{ d: "m8 11.5 5 5L22.5 7M2 11.5l5 5L8.5 15m8-8-4.75 4.75", sw: 1.5 }],
  },
  32: {
    outlined: [
      {
        d: "M10.667 15.333 17.333 22 30 9.333m-27.333 6L9.333 22l2-2M22 9.333l-6.333 6.334",
        sw: 2,
      },
    ],
  },
};

/** Props for {@link DoubleTickIcon}. See {@link BaseIconProps} for the shared shape. */
export type DoubleTickIconProps = BaseIconProps;

/**
 * Double Tick icon. Renders at sizes 16, 24, or 32 px with outlined and filled variants.
 *
 * @example
 * ```tsx
 * <DoubleTickIcon size={24} filled />
 * ```
 */
export const DoubleTickIcon = React.forwardRef<SVGSVGElement, DoubleTickIconProps>((props, ref) => (
  <BaseIcon ref={ref} variants={VARIANTS} {...props} />
));

DoubleTickIcon.displayName = "DoubleTickIcon";
