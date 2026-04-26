import * as React from "react";
import { BaseIcon } from "./BaseIcon";
import type { BaseIconProps, IconVariants } from "./types";

const VARIANTS: IconVariants = {
  16: {
    outlined: [
      {
        d: "M10 15.167H6C2.38 15.167.833 13.62.833 10V6C.833 2.38 2.38.833 6 .833h4c3.62 0 5.167 1.547 5.167 5.167v4c0 3.62-1.547 5.167-5.167 5.167M6 1.833C2.927 1.833 1.833 2.927 1.833 6v4c0 3.073 1.094 4.167 4.167 4.167h4c3.073 0 4.167-1.094 4.167-4.167V6c0-3.073-1.094-4.167-4.167-4.167z",
      },
    ],
    filled: [
      {
        d: "M10.793 1.333H5.207c-2.427 0-3.874 1.447-3.874 3.874v5.58c0 2.433 1.447 3.88 3.874 3.88h5.58c2.426 0 3.873-1.447 3.873-3.874V5.207c.007-2.427-1.44-3.874-3.867-3.874",
      },
    ],
  },
  24: {
    outlined: [
      {
        d: "M15 22.75H9c-5.43 0-7.75-2.32-7.75-7.75V9c0-5.43 2.32-7.75 7.75-7.75h6c5.43 0 7.75 2.32 7.75 7.75v6c0 5.43-2.32 7.75-7.75 7.75m-6-20C4.39 2.75 2.75 4.39 2.75 9v6c0 4.61 1.64 6.25 6.25 6.25h6c4.61 0 6.25-1.64 6.25-6.25V9c0-4.61-1.64-6.25-6.25-6.25z",
      },
    ],
    filled: [
      {
        d: "M16.19 2H7.81C4.17 2 2 4.17 2 7.81v8.37C2 19.83 4.17 22 7.81 22h8.37c3.64 0 5.81-2.17 5.81-5.81V7.81C22 4.17 19.83 2 16.19 2",
      },
    ],
  },
  32: {
    outlined: [
      {
        d: "M20 30.333h-8C4.76 30.333 1.667 27.24 1.667 20v-8C1.667 4.76 4.76 1.667 12 1.667h8c7.24 0 10.333 3.093 10.333 10.333v8c0 7.24-3.093 10.333-10.333 10.333M12 3.667c-6.147 0-8.333 2.186-8.333 8.333v8c0 6.147 2.186 8.333 8.333 8.333h8c6.147 0 8.333-2.186 8.333-8.333v-8c0-6.147-2.186-8.333-8.333-8.333z",
      },
    ],
    filled: [
      {
        d: "M21.587 2.667H10.413c-4.853 0-7.746 2.893-7.746 7.746v11.16c0 4.867 2.893 7.76 7.746 7.76h11.16c4.854 0 7.747-2.893 7.747-7.746V10.413c.013-4.853-2.88-7.746-7.733-7.746",
      },
    ],
  },
};

/** Props for {@link CheckBoxOffIcon}. See {@link BaseIconProps} for the shared shape. */
export type CheckBoxOffIconProps = BaseIconProps;

/**
 * CheckBox Off icon. Renders at sizes 16, 24, or 32 px with outlined and filled variants.
 *
 * @example
 * ```tsx
 * <CheckBoxOffIcon size={24} filled />
 * ```
 */
export const CheckBoxOffIcon = React.forwardRef<SVGSVGElement, CheckBoxOffIconProps>(
  (props, ref) => <BaseIcon ref={ref} variants={VARIANTS} {...props} />,
);

CheckBoxOffIcon.displayName = "CheckBoxOffIcon";
