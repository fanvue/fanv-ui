import * as React from "react";
import { BaseIcon } from "./BaseIcon";
import type { BaseIconProps, IconVariants } from "./types";

const VARIANTS: IconVariants = {
  16: {
    outlined: [
      {
        d: "M13.333 8.667H2.667A.67.67 0 0 1 2 8c0-.364.302-.667.667-.667h10.666c.365 0 .667.303.667.667a.67.67 0 0 1-.667.667",
      },
      {
        d: "M8 14a.67.67 0 0 1-.667-.667V2.667C7.333 2.302 7.635 2 8 2c.364 0 .667.302.667.667v10.666A.67.67 0 0 1 8 14",
      },
    ],
  },
  24: {
    outlined: [
      {
        d: "M18.222 12.778H5.778A.783.783 0 0 1 5 12c0-.425.353-.778.778-.778h12.444c.425 0 .778.353.778.778a.783.783 0 0 1-.778.778",
      },
      {
        d: "M12 19a.783.783 0 0 1-.778-.778V5.778c0-.425.353-.778.778-.778s.778.353.778.778v12.444A.783.783 0 0 1 12 19",
      },
    ],
  },
  32: {
    outlined: [
      { d: "M24 17H8c-.547 0-1-.453-1-1s.453-1 1-1h16c.547 0 1 .453 1 1s-.453 1-1 1" },
      { d: "M16 25c-.547 0-1-.453-1-1V8c0-.547.453-1 1-1s1 .453 1 1v16c0 .547-.453 1-1 1" },
    ],
  },
};

/** Props for {@link AddIcon}. See {@link BaseIconProps} for the shared shape. */
export type AddIconProps = BaseIconProps;

/**
 * Add icon. Renders at sizes 16, 24, or 32 px.
 *
 * @example
 * ```tsx
 * <AddIcon size={24} />
 * ```
 */
export const AddIcon = React.forwardRef<SVGSVGElement, AddIconProps>((props, ref) => (
  <BaseIcon ref={ref} variants={VARIANTS} {...props} />
));

AddIcon.displayName = "AddIcon";
