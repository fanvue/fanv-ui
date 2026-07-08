import * as React from "react";
import { BaseIcon } from "./BaseIcon";
import type { BaseIconProps, IconVariants } from "./types";

const VARIANTS: IconVariants = {
  16: {
    outlined: [
      {
        d: "M13.267 9H2.733c-1 0-1.4.427-1.4 1.487v2.693c0 1.06.4 1.487 1.4 1.487h10.534c1 0 1.4-.427 1.4-1.487v-2.693c0-1.06-.4-1.487-1.4-1.487m0-7.667H2.733c-1 0-1.4.427-1.4 1.487v2.693c0 1.06.4 1.487 1.4 1.487h10.534c1 0 1.4-.427 1.4-1.487V2.82c0-1.06-.4-1.487-1.4-1.487",
      },
    ],
  },
  24: {
    outlined: [
      {
        d: "M19.9 13.5H4.1c-1.5 0-2.1.64-2.1 2.23v4.04C2 21.36 2.6 22 4.1 22h15.8c1.5 0 2.1-.64 2.1-2.23v-4.04c0-1.59-.6-2.23-2.1-2.23m0-11.5H4.1C2.6 2 2 2.64 2 4.23v4.04c0 1.59.6 2.23 2.1 2.23h15.8c1.5 0 2.1-.64 2.1-2.23V4.23C22 2.64 21.4 2 19.9 2",
      },
    ],
  },
  32: {
    outlined: [
      {
        d: "M26.533 18H5.467c-2 0-2.8.853-2.8 2.973v5.387c0 2.12.8 2.973 2.8 2.973h21.066c2 0 2.8-.853 2.8-2.973v-5.387c0-2.12-.8-2.973-2.8-2.973m0-15.333H5.467c-2 0-2.8.853-2.8 2.973v5.387c0 2.12.8 2.973 2.8 2.973h21.066c2 0 2.8-.854 2.8-2.973V5.64c0-2.12-.8-2.973-2.8-2.973",
      },
    ],
  },
};

/** Props for {@link ListViewIcon}. See {@link BaseIconProps} for the shared shape. */
export type ListViewIconProps = BaseIconProps;

/**
 * List view icon. Renders at sizes 16, 24, or 32 px.
 *
 * @example
 * ```tsx
 * <ListViewIcon size={24} />
 * ```
 */
export const ListViewIcon = React.forwardRef<SVGSVGElement, ListViewIconProps>((props, ref) => (
  <BaseIcon ref={ref} variants={VARIANTS} {...props} />
));

ListViewIcon.displayName = "ListViewIcon";
