import * as React from "react";
import { BaseIcon } from "./BaseIcon";
import type { BaseIconProps, IconVariants } from "./types";

const VARIANTS: IconVariants = {
  16: {
    outlined: [
      {
        d: "M8 14.167a.5.5 0 0 1-.353-.147L3.6 9.973a.503.503 0 0 1 0-.706.503.503 0 0 1 .707 0L8 12.96l3.693-3.693a.503.503 0 0 1 .707 0 .503.503 0 0 1 0 .706L8.353 14.02c-.1.1-.226.147-.353.147",
      },
      {
        d: "M8 14.053a.504.504 0 0 1-.5-.5V2.333c0-.273.227-.5.5-.5s.5.227.5.5v11.22c0 .274-.227.5-.5.5",
      },
    ],
  },
  24: {
    outlined: [
      {
        d: "M12 21.25c-.19 0-.38-.07-.53-.22L5.4 14.96a.754.754 0 0 1 0-1.06c.29-.29.77-.29 1.06 0L12 19.44l5.54-5.54c.29-.29.77-.29 1.06 0s.29.77 0 1.06l-6.07 6.07c-.15.15-.34.22-.53.22",
      },
      {
        d: "M12 21.08c-.41 0-.75-.34-.75-.75V3.5c0-.41.34-.75.75-.75s.75.34.75.75v16.83c0 .41-.34.75-.75.75",
      },
    ],
  },
  32: {
    outlined: [
      {
        d: "M16 28.333a1 1 0 0 1-.707-.293L7.2 19.947a1.006 1.006 0 0 1 0-1.414 1.006 1.006 0 0 1 1.413 0L16 25.92l7.387-7.387a1.006 1.006 0 0 1 1.413 0 1.006 1.006 0 0 1 0 1.414l-8.093 8.093a1 1 0 0 1-.707.293",
      },
      {
        d: "M16 28.107c-.547 0-1-.454-1-1V4.667c0-.547.453-1 1-1s1 .453 1 1v22.44c0 .546-.453 1-1 1",
      },
    ],
  },
};

/** Props for {@link ArrowDownIcon}. See {@link BaseIconProps} for the shared shape. */
export type ArrowDownIconProps = BaseIconProps;

/**
 * Arrow Down icon. Renders at sizes 16, 24, or 32 px.
 *
 * @example
 * ```tsx
 * <ArrowDownIcon size={24} />
 * ```
 */
export const ArrowDownIcon = React.forwardRef<SVGSVGElement, ArrowDownIconProps>((props, ref) => (
  <BaseIcon ref={ref} variants={VARIANTS} {...props} />
));

ArrowDownIcon.displayName = "ArrowDownIcon";
