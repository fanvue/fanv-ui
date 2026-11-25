import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import * as React from "react";
import { cn } from "../../utils/cn";
import { TickIcon } from "../Icons/TickIcon";

/** Props for the {@link DropdownMenuRadioGroup} component. */
export interface DropdownMenuRadioGroupProps
  extends React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.RadioGroup> {}

/**
 * Groups {@link DropdownMenuRadioItem} children so they behave as a
 * single-select set. Controlled via `value`/`onValueChange`.
 *
 * @example
 * ```tsx
 * <DropdownMenuRadioGroup value={sort} onValueChange={setSort}>
 *   <DropdownMenuRadioItem value="newest">Newest first</DropdownMenuRadioItem>
 *   <DropdownMenuRadioItem value="oldest">Oldest first</DropdownMenuRadioItem>
 * </DropdownMenuRadioGroup>
 * ```
 *
 * Requires Radix menu context — not supported inside a `variant="sheet"` menu.
 */
export const DropdownMenuRadioGroup = React.forwardRef<
  React.ComponentRef<typeof DropdownMenuPrimitive.RadioGroup>,
  DropdownMenuRadioGroupProps
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.RadioGroup
    ref={ref}
    className={cn("flex flex-col gap-[3px]", className)}
    {...props}
  />
));
DropdownMenuRadioGroup.displayName = "DropdownMenuRadioGroup";

/**
 * Under the v2 palette a checked radio or checkbox row fills `Menu Item Selected`,
 * which is inverted there, with inverted content, and keeps that fill on hover so
 * the content stays readable.
 */
const CHECKED_V2_ROW =
  "theme-v2:data-[state=checked]:bg-menu-item-selected theme-v2:data-[state=checked]:text-content-primary-inverted theme-v2:data-[state=checked]:data-[highlighted]:bg-menu-item-selected";

/** Height preset for a {@link DropdownMenuRadioItem}. */
export type DropdownMenuRadioItemSize = "40";

export interface DropdownMenuRadioItemProps
  extends React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.RadioItem> {
  /** Optional secondary text shown below the title. */
  helper?: string;
  /** Height of the item row. @default "40" */
  size?: DropdownMenuRadioItemSize;
}

/**
 * A single radio-style choice within a {@link DropdownMenuRadioGroup}. Shows
 * a circular indicator that fills when selected, plus an optional helper line
 * underneath the title. The checked row rests on `Buttons/Navigation/Hover`, and
 * hovering it shows `Interaction/Hover` like any other row. Under the v2 palette
 * the fill is inverted, with inverted content, and stays on hover.
 */
export const DropdownMenuRadioItem = React.forwardRef<
  React.ComponentRef<typeof DropdownMenuPrimitive.RadioItem>,
  DropdownMenuRadioItemProps
>(({ className, children, helper, size: _size = "40", ...props }, ref) => {
  return (
    <DropdownMenuPrimitive.RadioItem
      ref={ref}
      className={cn(
        // `px-3` (12px), not 16px: `V2 Menu Radio Item` is `px-[12px] py-[8px]`
        // (node `7393:62008`), and at 16px a radio row indented 4px further than a
        // `DropdownMenuCheckboxItem` in the same menu. 12px radius and a 40px
        // minimum height, like `DropdownMenuItem`.
        "group flex min-h-10 w-full cursor-pointer gap-3 rounded-sm px-3 py-2 outline-none",
        // A helper line makes it a two-line row aligned to its title; a single
        // line centres in the 40px row like the checkbox and DropdownMenuItem.
        helper ? "items-start" : "items-center",
        "data-[state=checked]:bg-menu-item-selected",
        "data-[highlighted]:bg-interaction-hover",
        "data-[state=checked]:data-[highlighted]:bg-interaction-hover",
        CHECKED_V2_ROW,
        "data-[disabled]:cursor-not-allowed data-[disabled]:text-content-disabled",
        className,
      )}
      {...props}
    >
      <span
        className={cn(
          // In a two-line row `mt-px` centres the 16px circle on the 18px title line.
          helper && "mt-px",
          "flex size-4 shrink-0 items-center justify-center rounded-full border border-icons-primary",
          "group-data-[disabled]:border-content-disabled",
          "theme-v2:group-data-[state=checked]:border-icons-primary-inverted",
        )}
        aria-hidden="true"
      >
        <DropdownMenuPrimitive.ItemIndicator asChild>
          <span className="size-2 rounded-full bg-content-primary theme-v2:bg-icons-primary-inverted" />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      <span className="flex min-w-0 flex-1 flex-col gap-1">
        <span className="typography-body-small-14px-semibold truncate">{children}</span>
        {helper && (
          <span
            className={cn(
              "typography-description-12px-regular text-content-secondary",
              "group-data-[disabled]:text-content-disabled",
              "theme-v2:group-data-[state=checked]:text-content-secondary-inverted",
            )}
          >
            {helper}
          </span>
        )}
      </span>
    </DropdownMenuPrimitive.RadioItem>
  );
});
DropdownMenuRadioItem.displayName = "DropdownMenuRadioItem";

export interface DropdownMenuCheckboxItemProps
  extends React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.CheckboxItem> {
  /** Optional secondary text shown below the title. */
  helper?: string;
  /** Leading avatar rendered between the checkbox and the title. Render at 32px to match the design. */
  avatar?: React.ReactNode;
}

/**
 * A single multi-select choice within a dropdown menu. Shows a square indicator
 * that fills when checked, an optional leading avatar, and an optional helper
 * line underneath the title.
 *
 * Pair with {@link DropdownMenuHeader} at `type="search"` for filterable menus.
 * Use {@link DropdownMenuRadioItem} instead when only one option may be active.
 *
 * @example
 * ```tsx
 * <DropdownMenuCheckboxItem
 *   checked={selected.has(creator.id)}
 *   onCheckedChange={() => toggle(creator.id)}
 *   avatar={<Avatar size={32} src={creator.avatarUrl} />}
 * >
 *   @sofiabloom
 * </DropdownMenuCheckboxItem>
 * ```
 */
export const DropdownMenuCheckboxItem = React.forwardRef<
  React.ComponentRef<typeof DropdownMenuPrimitive.CheckboxItem>,
  DropdownMenuCheckboxItemProps
>(({ className, children, helper, avatar, ...props }, ref) => {
  return (
    <DropdownMenuPrimitive.CheckboxItem
      ref={ref}
      className={cn(
        "group flex min-h-10 w-full cursor-pointer items-center gap-3 rounded-sm px-3 py-2 outline-none",
        // In the current palette the checked state is carried by the tick alone.
        // A background here would leave every selected row shaded, which reads as
        // "all highlighted" on a menu that starts fully selected. The v2 palette
        // inverts checked rows like every other selected menu row.
        "data-[highlighted]:bg-interaction-hover",
        CHECKED_V2_ROW,
        "data-[disabled]:cursor-not-allowed data-[disabled]:text-content-disabled",
        className,
      )}
      {...props}
    >
      <span
        className={cn(
          "flex size-4 shrink-0 items-center justify-center rounded-2xs border border-icons-primary",
          "group-data-[state=checked]:bg-icons-primary",
          "group-data-[disabled]:border-content-disabled",
          "theme-v2:group-data-[state=checked]:border-icons-primary-inverted theme-v2:group-data-[state=checked]:bg-icons-primary-inverted",
        )}
        aria-hidden="true"
      >
        <DropdownMenuPrimitive.ItemIndicator asChild>
          <TickIcon className="size-4 text-content-primary-inverted theme-v2:text-content-primary" />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {avatar && <span className="shrink-0">{avatar}</span>}
      <span className="flex min-w-0 flex-1 flex-col gap-1">
        <span className="typography-body-small-14px-semibold truncate">{children}</span>
        {helper && (
          <span
            className={cn(
              "typography-description-12px-regular text-content-secondary",
              "group-data-[disabled]:text-content-disabled",
              "theme-v2:group-data-[state=checked]:text-content-secondary-inverted",
            )}
          >
            {helper}
          </span>
        )}
      </span>
    </DropdownMenuPrimitive.CheckboxItem>
  );
});
DropdownMenuCheckboxItem.displayName = "DropdownMenuCheckboxItem";
