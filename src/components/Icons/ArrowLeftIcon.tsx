import * as React from "react";
import { BaseIcon } from "./BaseIcon";
import type { BaseIconProps, IconVariants } from "./types";

const VARIANTS: IconVariants = {
  16: {
    outlined: [
      {
        d: "M6.38 12.547a.5.5 0 0 1-.353-.147L1.98 8.353a.503.503 0 0 1 0-.706L6.027 3.6a.503.503 0 0 1 .706 0 .503.503 0 0 1 0 .707L3.04 8l3.693 3.693a.503.503 0 0 1 0 .707.48.48 0 0 1-.353.147",
      },
      {
        d: "M13.667 8.5H2.446a.504.504 0 0 1-.5-.5c0-.273.226-.5.5-.5h11.22c.273 0 .5.227.5.5s-.227.5-.5.5",
      },
    ],
  },
  24: {
    outlined: [
      {
        d: "M9.57 18.82c-.19 0-.38-.07-.53-.22l-6.07-6.07a.754.754 0 0 1 0-1.06L9.04 5.4c.29-.29.77-.29 1.06 0s.29.77 0 1.06L4.56 12l5.54 5.54c.29.29.29.77 0 1.06-.14.15-.34.22-.53.22",
      },
      {
        d: "M20.5 12.75H3.67c-.41 0-.75-.34-.75-.75s.34-.75.75-.75H20.5c.41 0 .75.34.75.75s-.34.75-.75.75",
      },
    ],
  },
  32: {
    outlined: [
      {
        d: "M12.76 25.094a1 1 0 0 1-.707-.294L3.96 16.707a1.006 1.006 0 0 1 0-1.414L12.053 7.2a1.006 1.006 0 0 1 1.413 0 1.006 1.006 0 0 1 0 1.413L6.08 16l7.387 7.387a1.006 1.006 0 0 1 0 1.413.97.97 0 0 1-.707.293",
      },
      { d: "M27.333 17H4.893c-.546 0-1-.453-1-1s.454-1 1-1h22.44c.547 0 1 .453 1 1s-.453 1-1 1" },
    ],
  },
};

/** Props for {@link ArrowLeftIcon}. See {@link BaseIconProps} for the shared shape. */
export type ArrowLeftIconProps = BaseIconProps;

/**
 * Arrow Left icon. Renders at sizes 16, 24, or 32 px.
 *
 * @example
 * ```tsx
 * <ArrowLeftIcon size={24} />
 * ```
 */
export const ArrowLeftIcon = React.forwardRef<SVGSVGElement, ArrowLeftIconProps>((props, ref) => (
  <BaseIcon ref={ref} variants={VARIANTS} {...props} />
));

ArrowLeftIcon.displayName = "ArrowLeftIcon";
