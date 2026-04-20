import * as React from "react";
import { BaseIcon } from "./BaseIcon";
import type { BaseIconProps, IconVariants } from "./types";

const VARIANTS: IconVariants = {
  16: {
    outlined: [
      {
        d: "M7 3.333a1 1 0 1 0 2 0 1 1 0 1 0-2 0M7 8a1 1 0 1 0 2 0 1 1 0 1 0-2 0m0 4.667a1 1 0 1 0 2 0 1 1 0 1 0-2 0",
      },
    ],
  },
  24: {
    outlined: [
      {
        d: "M10.5 5a1.5 1.5 0 1 0 3 0 1.5 1.5 0 1 0-3 0m0 7a1.5 1.5 0 1 0 3 0 1.5 1.5 0 1 0-3 0m0 7a1.5 1.5 0 1 0 3 0 1.5 1.5 0 1 0-3 0",
      },
    ],
  },
  32: {
    outlined: [
      {
        d: "M14 6.667a2 2 0 1 0 4 0 2 2 0 1 0-4 0M14 16a2 2 0 1 0 4 0 2 2 0 1 0-4 0m0 9.333a2 2 0 1 0 4 0 2 2 0 1 0-4 0",
      },
    ],
  },
};

/** Props for {@link MoreVerticalIcon}. See {@link BaseIconProps} for the shared shape. */
export type MoreVerticalIconProps = BaseIconProps;

/**
 * More Vertical icon. Renders at sizes 16, 24, or 32 px.
 *
 * @example
 * ```tsx
 * <MoreVerticalIcon size={24} />
 * ```
 */
export const MoreVerticalIcon = React.forwardRef<SVGSVGElement, MoreVerticalIconProps>(
  (props, ref) => <BaseIcon ref={ref} variants={VARIANTS} {...props} />,
);

MoreVerticalIcon.displayName = "MoreVerticalIcon";
