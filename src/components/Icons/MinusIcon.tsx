import * as React from "react";
import { BaseIcon } from "./BaseIcon";
import type { BaseIconProps, IconVariants } from "./types";

const VARIANTS: IconVariants = {
  16: {
    outlined: [
      { d: "M12 8.5H4a.504.504 0 0 1-.5-.5c0-.273.227-.5.5-.5h8c.273 0 .5.227.5.5s-.227.5-.5.5" },
    ],
  },
  24: {
    outlined: [
      {
        d: "M18 12.75H6c-.41 0-.75-.34-.75-.75s.34-.75.75-.75h12c.41 0 .75.34.75.75s-.34.75-.75.75",
      },
    ],
  },
  32: {
    outlined: [{ d: "M24 17H8c-.547 0-1-.453-1-1s.453-1 1-1h16c.547 0 1 .453 1 1s-.453 1-1 1" }],
  },
};

/** Props for {@link MinusIcon}. See {@link BaseIconProps} for the shared shape. */
export type MinusIconProps = BaseIconProps;

/**
 * Minus icon. Renders at sizes 16, 24, or 32 px.
 *
 * @example
 * ```tsx
 * <MinusIcon size={24} />
 * ```
 */
export const MinusIcon = React.forwardRef<SVGSVGElement, MinusIconProps>((props, ref) => (
  <BaseIcon ref={ref} variants={VARIANTS} {...props} />
));

MinusIcon.displayName = "MinusIcon";
