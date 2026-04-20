import * as React from "react";
import { BaseIcon } from "./BaseIcon";
import type { BaseIconProps, IconVariants } from "./types";

const VARIANTS: IconVariants = {
  16: {
    outlined: [{ d: "m4.001 4.004 8 8m0-8.008-8 8", sw: 1.2 }],
  },
  24: {
    outlined: [{ d: "m7.001 7.005 10 10m.001-10.01-10 10", sw: 1.5 }],
  },
  32: {
    outlined: [{ d: "m10.002 10.006 12 12m0-12.012-12 12", sw: 1.801 }],
  },
};

/** Props for {@link CloseIcon}. See {@link BaseIconProps} for the shared shape. */
export type CloseIconProps = BaseIconProps;

/**
 * Close icon. Renders at sizes 16, 24, or 32 px.
 *
 * @example
 * ```tsx
 * <CloseIcon size={24} />
 * ```
 */
export const CloseIcon = React.forwardRef<SVGSVGElement, CloseIconProps>((props, ref) => (
  <BaseIcon ref={ref} variants={VARIANTS} {...props} />
));

CloseIcon.displayName = "CloseIcon";
