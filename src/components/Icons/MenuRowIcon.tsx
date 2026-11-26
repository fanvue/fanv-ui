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
  /** Turn `Icons/Primary Inverted` when the row is selected under the v2 palette. Pass `false` for a disabled row. */
  invertWhenSelected?: boolean;
  className?: string;
}

/**
 * The icon slot of a menu or select row: a 16px box in `Icons/Secondary`, with
 * prop-based icons drawn filled at 16px unless they set their own `filled` or
 * `size`. The disabled variants cover every way a row is disabled: Radix's
 * `data-disabled`, a native `disabled` button and `aria-disabled`. With
 * `invertWhenSelected`, a selected row (`data-selected` or `data-state="checked"`)
 * turns the icon `Icons/Primary Inverted` under the v2 palette. Internal to the package.
 */
export function MenuRowIcon({
  children,
  inheritColor,
  alignToTitle,
  invertWhenSelected,
  className,
}: MenuRowIconProps) {
  return (
    <span
      className={cn(
        "flex shrink-0 items-center [&>svg]:size-4",
        alignToTitle && "h-4.5",
        !inheritColor && [
          "text-icons-secondary",
          "group-data-[disabled]:text-icons-disabled group-disabled:text-icons-disabled group-aria-disabled:text-icons-disabled",
          invertWhenSelected &&
            "theme-v2:group-data-[selected]:text-icons-primary-inverted theme-v2:group-data-[state=checked]:text-icons-primary-inverted",
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
