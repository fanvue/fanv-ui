import * as React from "react";
import { BaseIcon } from "./BaseIcon";
import type { BaseIconProps, IconVariants } from "./types";

const VARIANTS: IconVariants = {
  16: {
    outlined: [
      {
        d: "M14 9.333h-4m4 2h-3.333m3.333 2h-2.667M8 1.333a3 3 0 1 0 0 6 3 3 0 1 0 0-6zM2.667 14c0-2.9 1.333-5.333 4.666-5.333",
      },
    ],
    filled: [
      { d: "M14 9.333h-4m4 2h-3.333m3.333 2h-2.667" },
      { d: "M8 1.333a3 3 0 1 0 0 6 3 3 0 1 0 0-6" },
      { d: "M2.667 14c0-2.9 1.333-5.333 4.666-5.333" },
    ],
  },
  24: {
    outlined: [
      {
        d: "M21 14h-6m6 3h-5m5 3h-4M12 2a4.5 4.5 0 1 0 0 9 4.5 4.5 0 1 0 0-9zM4 21c0-4.35 2-8 7-8",
        sw: 1.5,
      },
    ],
    filled: [
      { d: "M12 2a4.5 4.5 0 1 0 0 9 4.5 4.5 0 1 0 0-9" },
      { d: "M21 14h-6m6 3h-5m5 3h-4", sw: 1.5 },
      { d: "M4 21c0-4.35 2-8 7-8", sw: 1.5 },
    ],
  },
  32: {
    outlined: [
      {
        d: "M28 18.667h-8m8 4h-6.667m6.667 4h-5.333M16 2.667a6 6 0 1 0 0 12 6 6 0 1 0 0-12zM5.333 28c0-5.799 2.667-10.667 9.334-10.667",
        sw: 2,
      },
    ],
    filled: [
      { d: "M16 2.667a6 6 0 1 0 0 12 6 6 0 1 0 0-12" },
      { d: "M28 18.667h-8m8 4h-6.667m6.667 4h-5.333", sw: 2 },
      { d: "M5.333 28c0-5.799 2.667-10.667 9.334-10.667", sw: 2 },
    ],
  },
};

/** Props for {@link UserMenuIcon}. See {@link BaseIconProps} for the shared shape. */
export type UserMenuIconProps = BaseIconProps;

/**
 * User Menu icon. Renders at sizes 16, 24, or 32 px with outlined and filled variants.
 *
 * @example
 * ```tsx
 * <UserMenuIcon size={24} filled />
 * ```
 */
export const UserMenuIcon = React.forwardRef<SVGSVGElement, UserMenuIconProps>((props, ref) => (
  <BaseIcon ref={ref} variants={VARIANTS} {...props} />
));

UserMenuIcon.displayName = "UserMenuIcon";
