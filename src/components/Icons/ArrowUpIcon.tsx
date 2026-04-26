import * as React from "react";
import { BaseIcon } from "./BaseIcon";
import type { BaseIconProps, IconVariants } from "./types";

const VARIANTS: IconVariants = {
  16: {
    outlined: [
      {
        d: "M12.047 6.88a.5.5 0 0 1-.354-.146L8 3.04 4.307 6.734a.503.503 0 0 1-.707 0 .503.503 0 0 1 0-.707L7.647 1.98a.503.503 0 0 1 .706 0L12.4 6.027a.503.503 0 0 1 0 .707.48.48 0 0 1-.353.146",
      },
      {
        d: "M8 14.167a.504.504 0 0 1-.5-.5V2.447c0-.274.227-.5.5-.5s.5.226.5.5v11.22c0 .273-.227.5-.5.5",
      },
    ],
  },
  24: {
    outlined: [
      {
        d: "M18.07 10.32c-.19 0-.38-.07-.53-.22L12 4.56 6.46 10.1c-.29.29-.77.29-1.06 0a.754.754 0 0 1 0-1.06l6.07-6.07c.29-.29.77-.29 1.06 0l6.07 6.07c.29.29.29.77 0 1.06-.14.15-.34.22-.53.22",
      },
      {
        d: "M12 21.25c-.41 0-.75-.34-.75-.75V3.67c0-.41.34-.75.75-.75s.75.34.75.75V20.5c0 .41-.34.75-.75.75",
      },
    ],
  },
  32: {
    outlined: [
      {
        d: "M24.094 13.76a1 1 0 0 1-.707-.293L16 6.081l-7.387 7.386a1.006 1.006 0 0 1-1.413 0 1.006 1.006 0 0 1 0-1.413l8.093-8.093a1.006 1.006 0 0 1 1.414 0l8.093 8.093a1.006 1.006 0 0 1 0 1.413.97.97 0 0 1-.707.293",
      },
      {
        d: "M16 28.333c-.547 0-1-.453-1-1V4.893c0-.546.453-1 1-1s1 .454 1 1v22.44c0 .547-.453 1-1 1",
      },
    ],
  },
};

/** Props for {@link ArrowUpIcon}. See {@link BaseIconProps} for the shared shape. */
export type ArrowUpIconProps = BaseIconProps;

/**
 * Arrow Up icon. Renders at sizes 16, 24, or 32 px.
 *
 * @example
 * ```tsx
 * <ArrowUpIcon size={24} />
 * ```
 */
export const ArrowUpIcon = React.forwardRef<SVGSVGElement, ArrowUpIconProps>((props, ref) => (
  <BaseIcon ref={ref} variants={VARIANTS} {...props} />
));

ArrowUpIcon.displayName = "ArrowUpIcon";
