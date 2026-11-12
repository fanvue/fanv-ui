import type * as React from "react";
import { cn } from "../../utils/cn";
import { type IconDefaults, IconDefaultsContext } from "./IconDefaults";

const MENU_ROW_ICON_DEFAULTS: IconDefaults = { filled: true, size: 16 };

interface MenuRowIconProps {
  children: React.ReactNode;
  /** Keep the row's own colour (e.g. a destructive row's error red) instead of `Icons/Secondary`. */
  inheritColor?: boolean;
  /** Centre the icon on an 18px title line, for two-line rows aligned to their title. */
  alignToTitle?: boolean;
  className?: string;
}

/**
 * The icon slot of a menu or select row: a 16px box in `Icons/Secondary`, with
 * prop-based icons drawn filled at 16px unless they set their own `filled` or
 * `size`. The disabled variants cover every way a row is disabled: Radix's
 * `data-disabled`, a native `disabled` button and `aria-disabled`. Internal to
 * the package.
 */
export function MenuRowIcon({ children, inheritColor, alignToTitle, className }: MenuRowIconProps) {
  return (
    <span
      className={cn(
        "flex shrink-0 items-center [&>svg]:size-4",
        alignToTitle && "h-4.5",
        !inheritColor && [
          "text-icons-secondary",
          "group-data-[disabled]:text-icons-disabled group-disabled:text-icons-disabled group-aria-disabled:text-icons-disabled",
        ],
        className,
      )}
    >
      <IconDefaultsContext.Provider value={MENU_ROW_ICON_DEFAULTS}>
        {children}
      </IconDefaultsContext.Provider>
    </span>
  );
}
