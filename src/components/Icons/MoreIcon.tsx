import * as React from "react";
import { BaseIcon } from "./BaseIcon";
import type { BaseIconProps, IconVariants } from "./types";

const VARIANTS: IconVariants = {
  16: {
    outlined: [
      {
        d: "M12.667 7a1 1 0 1 0 0 2 1 1 0 1 0 0-2M8 7a1 1 0 1 0 0 2 1 1 0 1 0 0-2M3.333 7a1 1 0 1 0 0 2 1 1 0 1 0 0-2",
      },
    ],
  },
  24: {
    outlined: [
      {
        d: "M19 10.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 1 0 0-3m-7 0a1.5 1.5 0 1 0 0 3 1.5 1.5 0 1 0 0-3m-7 0a1.5 1.5 0 1 0 0 3 1.5 1.5 0 1 0 0-3",
      },
    ],
  },
  32: {
    outlined: [
      {
        d: "M25.333 14a2 2 0 1 0 0 4 2 2 0 1 0 0-4M16 14a2 2 0 1 0 0 4 2 2 0 1 0 0-4m-9.333 0a2 2 0 1 0 0 4 2 2 0 1 0 0-4",
      },
    ],
  },
};

/** Props for {@link MoreIcon}. See {@link BaseIconProps} for the shared shape. */
export type MoreIconProps = BaseIconProps;

/**
 * More icon. Renders at sizes 16, 24, or 32 px.
 *
 * @example
 * ```tsx
 * <MoreIcon size={24} />
 * ```
 */
export const MoreIcon = React.forwardRef<SVGSVGElement, MoreIconProps>((props, ref) => (
  <BaseIcon ref={ref} variants={VARIANTS} {...props} />
));

MoreIcon.displayName = "MoreIcon";
