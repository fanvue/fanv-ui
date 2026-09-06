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
export const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup;

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
 * underneath the title.
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
        // `DropdownMenuCheckboxItem` in the same menu.
        "group flex w-full cursor-pointer items-start gap-3 rounded-xs px-3 py-2 outline-none",
        "data-[highlighted]:bg-neutral-alphas-50",
        "data-[disabled]:cursor-not-allowed data-[disabled]:text-content-disabled",
        // See DropdownMenuItem above: bg-interaction-hover aliases to the same
        // token as the plain hover background, so it can't distinguish the
        // checked state from an unchecked-but-hovered row.
        "data-[state=checked]:bg-neutral-alphas-100",
        "data-[state=checked]:data-[highlighted]:bg-neutral-alphas-200",
        className,
      )}
      {...props}
    >
      <span
        className={cn(
          "mt-1 flex size-4 shrink-0 items-center justify-center rounded-full border border-icons-primary",
          "group-data-[disabled]:border-content-disabled",
        )}
        aria-hidden="true"
      >
        <DropdownMenuPrimitive.ItemIndicator asChild>
          <span className="size-2 rounded-full bg-content-primary" />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      <span className="flex min-w-0 flex-1 flex-col gap-1">
        <span className="typography-body-default-16px-semibold truncate">{children}</span>
        {helper && (
          <span
            className={cn(
              "typography-description-12px-regular text-content-secondary",
              "group-data-[disabled]:text-content-disabled",
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
        "group flex w-full cursor-pointer items-center gap-3 rounded-xs px-3 py-2 outline-none",
        // Checked state is carried by the tick alone. A background here would
        // leave every selected row shaded, which reads as "all highlighted" on
        // a menu that starts fully selected.
        "data-[highlighted]:bg-neutral-alphas-50",
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
        )}
        aria-hidden="true"
      >
        <DropdownMenuPrimitive.ItemIndicator asChild>
          <TickIcon className="size-4 text-content-primary-inverted" />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {avatar && <span className="shrink-0">{avatar}</span>}
      <span className="flex min-w-0 flex-1 flex-col gap-1">
        <span className="typography-body-default-16px-semibold truncate">{children}</span>
        {helper && (
          <span
            className={cn(
              "typography-description-12px-regular text-content-secondary",
              "group-data-[disabled]:text-content-disabled",
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
