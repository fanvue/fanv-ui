import * as React from "react";
import { BaseIcon } from "./BaseIcon";
import type { BaseIconProps, IconVariants } from "./types";

const VARIANTS: IconVariants = {
  16: {
    outlined: [
      {
        d: "M14 5.167H2a.504.504 0 0 1-.5-.5c0-.274.227-.5.5-.5h12c.273 0 .5.226.5.5 0 .273-.227.5-.5.5M14 8.5H2a.504.504 0 0 1-.5-.5c0-.273.227-.5.5-.5h12c.273 0 .5.227.5.5s-.227.5-.5.5m0 3.333H2a.504.504 0 0 1-.5-.5c0-.273.227-.5.5-.5h12c.273 0 .5.227.5.5 0 .274-.227.5-.5.5",
      },
    ],
  },
  24: {
    outlined: [
      {
        d: "M21 7.75H3c-.41 0-.75-.34-.75-.75s.34-.75.75-.75h18c.41 0 .75.34.75.75s-.34.75-.75.75m0 5H3c-.41 0-.75-.34-.75-.75s.34-.75.75-.75h18c.41 0 .75.34.75.75s-.34.75-.75.75m0 5H3c-.41 0-.75-.34-.75-.75s.34-.75.75-.75h18c.41 0 .75.34.75.75s-.34.75-.75.75",
      },
    ],
  },
  32: {
    outlined: [
      {
        d: "M28 10.333H4c-.547 0-1-.453-1-1s.453-1 1-1h24c.547 0 1 .454 1 1 0 .547-.453 1-1 1M28 17H4c-.547 0-1-.453-1-1s.453-1 1-1h24c.547 0 1 .453 1 1s-.453 1-1 1m0 6.667H4c-.547 0-1-.454-1-1 0-.547.453-1 1-1h24c.547 0 1 .453 1 1s-.453 1-1 1",
      },
    ],
  },
};

/** Props for {@link MenuIcon}. See {@link BaseIconProps} for the shared shape. */
export type MenuIconProps = BaseIconProps;

/**
 * Menu icon. Renders at sizes 16, 24, or 32 px.
 *
 * @example
 * ```tsx
 * <MenuIcon size={24} />
 * ```
 */
export const MenuIcon = React.forwardRef<SVGSVGElement, MenuIconProps>((props, ref) => (
  <BaseIcon ref={ref} variants={VARIANTS} {...props} />
));

MenuIcon.displayName = "MenuIcon";
