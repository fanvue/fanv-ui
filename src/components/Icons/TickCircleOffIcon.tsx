import * as React from "react";
import { BaseIcon } from "./BaseIcon";
import type { BaseIconProps, IconVariants } from "./types";

const VARIANTS: IconVariants = {
  16: {
    outlined: [
      {
        d: "M8 15.167A7.173 7.173 0 0 1 .833 8 7.173 7.173 0 0 1 8 .833 7.173 7.173 0 0 1 15.167 8 7.173 7.173 0 0 1 8 15.167M8 1.833A6.174 6.174 0 0 0 1.833 8c0 3.4 2.767 6.167 6.167 6.167S14.167 11.4 14.167 8 11.4 1.833 8 1.833",
      },
    ],
  },
  24: {
    outlined: [
      {
        d: "M12 22.75C6.07 22.75 1.25 17.93 1.25 12S6.07 1.25 12 1.25 22.75 6.07 22.75 12 17.93 22.75 12 22.75m0-20C6.9 2.75 2.75 6.9 2.75 12S6.9 21.25 12 21.25s9.25-4.15 9.25-9.25S17.1 2.75 12 2.75",
      },
    ],
  },
  32: {
    outlined: [
      {
        d: "M16 30.333C8.093 30.333 1.667 23.907 1.667 16S8.093 1.667 16 1.667 30.333 8.093 30.333 16 23.907 30.333 16 30.333m0-26.666C9.2 3.667 3.667 9.2 3.667 16S9.2 28.333 16 28.333 28.333 22.8 28.333 16 22.8 3.667 16 3.667",
      },
    ],
  },
};

/** Props for {@link TickCircleOffIcon}. See {@link BaseIconProps} for the shared shape. */
export type TickCircleOffIconProps = BaseIconProps;

/**
 * Tick Circle Off icon. Renders at sizes 16, 24, or 32 px.
 *
 * @example
 * ```tsx
 * <TickCircleOffIcon size={24} />
 * ```
 */
export const TickCircleOffIcon = React.forwardRef<SVGSVGElement, TickCircleOffIconProps>(
  (props, ref) => <BaseIcon ref={ref} variants={VARIANTS} {...props} />,
);

TickCircleOffIcon.displayName = "TickCircleOffIcon";
