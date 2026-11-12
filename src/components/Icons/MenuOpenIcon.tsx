import * as React from "react";
import { BaseIcon } from "./BaseIcon";
import type { BaseIconProps, IconVariants } from "./types";

const VARIANTS: IconVariants = {
  16: {
    outlined: [
      {
        d: "M4.5 2h7A2.5 2.5 0 0 1 14 4.5v7a2.5 2.5 0 0 1-2.5 2.5h-7A2.5 2.5 0 0 1 2 11.5v-7A2.5 2.5 0 0 1 4.5 2Z",
        sw: 1,
      },
      { d: "M11 11.5v-7", sw: 1 },
    ],
    filled: [
      {
        d: "M4.5 1.5h7a3 3 0 0 1 3 3v7a3 3 0 0 1-3 3h-7a3 3 0 0 1-3-3v-7a3 3 0 0 1 3-3Z M10.5 4.5a0.5 0.5 0 0 1 1 0v7a0.5 0.5 0 0 1-1 0Z",
        eo: true,
      },
    ],
  },
  24: {
    outlined: [
      {
        d: "M6.25 2.85h11.5a3.4 3.4 0 0 1 3.4 3.4v11.5a3.4 3.4 0 0 1-3.4 3.4H6.25a3.4 3.4 0 0 1-3.4-3.4V6.25a3.4 3.4 0 0 1 3.4-3.4Z",
        sw: 1.2,
      },
      { d: "M17.5 18.75V5.25", sw: 1.2 },
    ],
    filled: [
      {
        d: "M6.25 2.25h11.5a4 4 0 0 1 4 4v11.5a4 4 0 0 1-4 4H6.25a4 4 0 0 1-4-4V6.25a4 4 0 0 1 4-4Z M17.9 5.25a0.6 0.6 0 0 1 1.2 0v13.5a0.6 0.6 0 0 1-1.2 0Z",
        eo: true,
      },
    ],
  },
  32: {
    outlined: [
      {
        d: "M8 3.75h16a4.25 4.25 0 0 1 4.25 4.25v16A4.25 4.25 0 0 1 24 28.25H8A4.25 4.25 0 0 1 3.75 24V8A4.25 4.25 0 0 1 8 3.75Z",
        sw: 1.5,
      },
      { d: "M24 25V7", sw: 1.5 },
    ],
    filled: [
      {
        d: "M8 3h16a5 5 0 0 1 5 5v16a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5V8a5 5 0 0 1 5-5Z M23.25 7a0.75 0.75 0 0 1 1.5 0v18a0.75 0.75 0 0 1-1.5 0Z",
        eo: true,
      },
    ],
  },
};

/** Props for {@link MenuOpenIcon}. See {@link BaseIconProps} for the shared shape. */
export type MenuOpenIconProps = BaseIconProps;

/**
 * Menu Open icon. Renders at sizes 16, 24, or 32 px with outlined and filled variants.
 *
 * @example
 * ```tsx
 * <MenuOpenIcon size={24} filled />
 * ```
 */
export const MenuOpenIcon = React.forwardRef<SVGSVGElement, MenuOpenIconProps>((props, ref) => (
  <BaseIcon ref={ref} variants={VARIANTS} {...props} />
));

MenuOpenIcon.displayName = "MenuOpenIcon";
