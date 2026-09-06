import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { Slot } from "@radix-ui/react-slot";
import * as React from "react";
import { cn } from "../../utils/cn";
import { CheckIcon } from "../Icons/CheckIcon";
import { DropdownMenuVariantContext, ToggleOpenContext } from "./context";

/** Vertical placement of a {@link DropdownMenuLabel} within its group. */
export type DropdownMenuLabelPosition = "default" | "top";

/** Props for the {@link DropdownMenuLabel} component. */
export interface DropdownMenuLabelProps
  extends React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label> {
  /**
   * Vertical placement within the surrounding group. `"top"` is used for the
   * first label directly under a header; `"default"` adds extra top padding to
   * separate it from preceding items. @default "default"
   */
  position?: DropdownMenuLabelPosition;
}

/** A non-interactive label that groups related items within a menu. */
export const DropdownMenuLabel = React.forwardRef<
  React.ComponentRef<typeof DropdownMenuPrimitive.Label>,
  DropdownMenuLabelProps
>(({ className, position = "default", ...props }, ref) => {
  const variant = React.useContext(DropdownMenuVariantContext);
  const labelClassName = cn(
    "typography-description-12px-regular flex items-center px-3 text-content-secondary",
    position === "top" ? "py-2" : "pt-4 pb-2",
    className,
  );

  // DropdownMenuPrimitive.Label requires Radix menu context, unavailable when
  // the sheet variant renders inside a Drawer (Dialog) instead.
  if (variant === "sheet") {
    return <div ref={ref} className={labelClassName} {...props} />;
  }

  return <DropdownMenuPrimitive.Label ref={ref} className={labelClassName} {...props} />;
});
DropdownMenuLabel.displayName = "DropdownMenuLabel";

/**
 * Height preset for a dropdown menu item.
 *
 * `"40"` (default) and `"32"` are the v2 numeric tokens that mirror the Figma
 * design system. `"sm"` and `"md"` are deprecated aliases retained for
 * backwards compatibility — `"sm"` maps to `"32"`, `"md"` maps to `"40"`.
 */
export type DropdownMenuItemSize =
  | "40"
  | "32"
  /** @deprecated Use `"32"` instead. */
  | "sm"
  /** @deprecated Use `"40"` instead. */
  | "md";

const SIZE_NORMALIZED: Record<DropdownMenuItemSize, "40" | "32"> = {
  "40": "40",
  md: "40",
  "32": "32",
  sm: "32",
};

const ITEM_SIZE_CLASSES: Record<"40" | "32", string> = {
  "40": "min-h-10 py-2 typography-body-default-16px-regular",
  "32": "min-h-8 py-[7px] typography-body-small-14px-regular",
};

/*
 * 14px at both heights. `V2 Menu Item` draws the count as `Body Small 14px/Regular`
 * in `content-tertiary` (node `21542:8629`), and the 40 row previously stepped up to
 * 16px — which also put the count's line box at 24px against the two-line layout's
 * 18px title leading.
 *
 * Only the 40 row is drawn in Figma: the component set's variants are Type and State
 * with no size axis. The 32 row is ours, and 14px matches the body type it already
 * uses, so both entries agree by construction rather than by design reference.
 */
const ITEM_COUNT_TYPOGRAPHY: Record<"40" | "32", string> = {
  "40": "typography-body-small-14px-regular",
  "32": "typography-body-small-14px-regular",
};

// Background alone can't reliably tell "selected" apart from a
// hovered-but-unselected row across every theme/contrast combination (see the
// neutral-alphas fix on itemClassName below) — pair it with an explicit
// indicator, matching SelectItem's check indicator for the same V2 Menu Item
// spec.
function SelectedCheckIndicator({ hasDescription }: { hasDescription: boolean }) {
  return (
    <CheckIcon
      className={cn(
        "size-4 shrink-0 text-content-primary",
        // The two-line layout switches the row to `items-start`, which would hang
        // the tick off the title's line. A leading icon or avatar belongs there —
        // it labels the title — but the tick is a property of the whole row, so it
        // centres against both lines. {@link SelectItem} already does this.
        hasDescription && "self-center",
      )}
    />
  );
}

export interface DropdownMenuItemProps
  extends React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> {
  /** Height of the menu item row. @default "40" */
  size?: DropdownMenuItemSize;
  /** Applies the destructive (error) treatment. Use for irreversible actions. @default false */
  destructive?: boolean;
  /** Icon (or other node) rendered before the label. Ignored when {@link DropdownMenuItemProps.avatar} is set. */
  leadingIcon?: React.ReactNode;
  /**
   * Leading avatar rendered in place of {@link DropdownMenuItemProps.leadingIcon},
   * for rows that represent a person or account. Pass an `Avatar` sized to `24`.
   * Takes precedence over `leadingIcon`.
   */
  avatar?: React.ReactNode;
  /**
   * Icon (or other node) rendered after the label. When
   * {@link DropdownMenuItemProps.selected} is true and no `trailingIcon` is
   * given, the built-in selected check indicator renders in this slot
   * instead — pass a `trailingIcon` to use a custom selected indicator (e.g.
   * a themed tick) rather than the default one.
   */
  trailingIcon?: React.ReactNode;
  /** Trailing count or number (e.g. an unread total) rendered before {@link DropdownMenuItemProps.trailingIcon}. */
  count?: React.ReactNode;
  /**
   * Optional secondary text rendered on a second line below the label. When
   * provided, the row switches to a two-line layout and the leading/trailing
   * icons align to the title line (top) rather than the row's vertical centre.
   */
  description?: React.ReactNode;
  /** Marks the item as the current selection in a single-select menu. @default false */
  selected?: boolean;
}

/**
 * An individual item within a {@link DropdownMenuContent}.
 *
 * @example
 * ```tsx
 * <DropdownMenuItem>Edit profile</DropdownMenuItem>
 * <DropdownMenuItem destructive>Delete</DropdownMenuItem>
 * <DropdownMenuItem leadingIcon={<EditIcon />}>Edit</DropdownMenuItem>
 *
 * // Feature-rich row with an avatar and a trailing count
 * <DropdownMenuItem avatar={<Avatar size={24} src={src} />} count="12">
 *   Jane Doe
 * </DropdownMenuItem>
 *
 * // As a link
 * <DropdownMenuItem asChild>
 *   <a href="/settings">Settings</a>
 * </DropdownMenuItem>
 * ```
 */
export const DropdownMenuItem = React.forwardRef<
  React.ComponentRef<typeof DropdownMenuPrimitive.Item>,
  DropdownMenuItemProps
>(
  (
    {
      size = "40",
      destructive,
      leadingIcon,
      avatar,
      trailingIcon,
      count,
      description,
      selected,
      className,
      children,
      asChild,
      onSelect,
      disabled,
      ...props
    },
    ref,
  ) => {
    const variant = React.useContext(DropdownMenuVariantContext);
    const toggleOpen = React.useContext(ToggleOpenContext);
    const normalizedSize = SIZE_NORMALIZED[size];
    const hasDescription = description != null;
    const hasAvatar = avatar != null;
    const itemClassName = cn(
      // `text-start` because the sheet variant renders the row as a <button>,
      // whose UA-centred text misaligned it from the popper variant's rows.
      "group flex w-full cursor-pointer gap-2 rounded-sm px-3 text-start outline-none",
      hasDescription ? "items-start" : "items-center",
      // The sheet's header runs the full width of the panel, so its rows have to
      // come in off the edge themselves — 12px here on the panel's own 4px is the
      // design's 16px. `w-auto` lets the column stretch them to the space left
      // over; `w-full` plus a margin would overflow.
      variant === "sheet" && "mx-3 w-auto",
      ITEM_SIZE_CLASSES[normalizedSize],
      // A 24px avatar would push the compact 32px row past its height with the
      // default padding; tighten it so the avatar variant keeps the 32px contract.
      hasAvatar && !hasDescription && normalizedSize === "32" && "py-1",
      "data-[highlighted]:bg-neutral-alphas-50",
      "data-[disabled]:cursor-not-allowed data-[disabled]:text-content-disabled",
      "disabled:cursor-not-allowed disabled:text-content-disabled",
      // Sheet-variant asChild items are marked disabled via aria-disabled
      // (see below), not the native disabled attribute or Radix's
      // data-disabled — neither selector above matches them.
      "aria-disabled:cursor-not-allowed aria-disabled:text-content-disabled",
      destructive && "text-error-content",
      // bg-interaction-hover aliases to the same token as the plain hover
      // background above, so a selected row would be indistinguishable from a
      // hovered-but-unselected one. Use the next step up the neutral-alphas
      // ramp instead (still a subtle overlay, not the heavy filled style).
      selected && ["bg-neutral-alphas-100", "data-[highlighted]:bg-neutral-alphas-200"],
      className,
    );

    // In the two-line (description) layout everything beside the title sits on
    // the title's line, not the centre of the two-line block. A box the height of
    // that line centres each sibling on it whatever its own size — a 16px icon, a
    // 24px avatar, or the count's larger text box. The height is the title's, from
    // `typography-body-small-14px-semibold`; a `pt-*` nudge cannot do this because
    // the correct offset differs per sibling, and the previous `pt-1` was computed
    // against the single-line title's 24px leading, leaving all four 3px low.
    const iconAlignClassName = hasDescription ? "flex h-[18px] shrink-0 items-center" : null;

    const countNode = count != null && (
      <span
        className={cn(
          "shrink-0 tabular-nums",
          iconAlignClassName,
          ITEM_COUNT_TYPOGRAPHY[normalizedSize],
          destructive ? "text-error-content" : "text-content-tertiary",
          "group-data-[disabled]:text-content-disabled",
        )}
      >
        {count}
      </span>
    );

    // A caller-supplied trailingIcon always wins the trailing slot — some
    // consumers pass their own selected indicator (e.g. a themed tick) and
    // rely on it being shown as-is rather than replaced. Only fall back to
    // the built-in check indicator when selected and no trailingIcon is given.
    const trailingNode =
      trailingIcon != null ? (
        hasDescription ? (
          <span className={iconAlignClassName!}>{trailingIcon}</span>
        ) : (
          trailingIcon
        )
      ) : (
        selected && <SelectedCheckIndicator hasDescription={hasDescription} />
      );

    const itemChildren = (
      <>
        {avatar != null ? (
          <span className={cn("shrink-0", iconAlignClassName)}>{avatar}</span>
        ) : (
          leadingIcon != null &&
          (hasDescription ? (
            <span className={iconAlignClassName!}>{leadingIcon}</span>
          ) : (
            leadingIcon
          ))
        )}
        {hasDescription ? (
          <span className="flex min-w-0 flex-1 flex-col gap-0.5">
            {/*
             * The two-line row sets its own title type rather than inheriting the
             * row's: `V2 Menu Item` pairs a 14px semibold title with the 14px
             * regular description below it, where a single-line row's title is the
             * size's own 16px regular. It also settles the row's height — 18 + 2 +
             * 18 of text inside `py-2` is the design's 54px.
             */}
            <span className="typography-body-small-14px-semibold truncate">{children}</span>
            <span className="typography-body-small-14px-regular truncate text-content-secondary">
              {description}
            </span>
          </span>
        ) : (
          <span className="min-w-0 flex-1 truncate">{children}</span>
        )}
        {countNode}
        {trailingNode}
      </>
    );

    // The sheet variant renders inside a Drawer (Dialog), not a Radix menu, so
    // DropdownMenuPrimitive.Item (which requires menu context) can't be used —
    // render a plain option element with equivalent selection semantics instead.
    // asChild goes through the same Slot primitive Radix's own Item uses
    // internally, so a custom element (e.g. a link) gets the option
    // role/handlers merged onto it without needing menu context.
    if (variant === "sheet") {
      const Comp = asChild ? Slot : "button";
      // Pull the consumer's onClick out of the passthrough spread so the
      // handler below can compose with it instead of the spread order
      // silently overwriting it (an explicit onClick after {...props} always
      // wins over the spread's).
      const { onClick: consumerOnClick, ...restProps } =
        props as React.ComponentPropsWithoutRef<"button">;
      const sheetSpecificProps = !asChild
        ? { type: "button" as const, disabled }
        : disabled
          ? { "aria-disabled": true }
          : {};
      return (
        <Comp
          ref={ref as React.Ref<HTMLButtonElement>}
          {...restProps}
          {...sheetSpecificProps}
          role="option"
          aria-selected={selected}
          className={itemClassName}
          onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
            // A native <button disabled> already blocks its click event, but
            // asChild's element (e.g. a link) has no such enforcement — guard
            // explicitly, and prevent the click's default action (e.g. anchor
            // navigation) since aria-disabled alone doesn't stop it.
            if (disabled) {
              event.preventDefault();
              return;
            }
            consumerOnClick?.(event);
            if (event.defaultPrevented) return;
            // Pass the real native event through, not a fake partial shape —
            // handlers that call any Event API beyond preventDefault (e.g.
            // stopPropagation, composedPath) need it to actually exist. It's
            // still live (currentTarget/target are valid) since we're inside
            // the same synchronous click handler that produced it.
            onSelect?.(event.nativeEvent);
            if (!event.nativeEvent.defaultPrevented) toggleOpen?.(() => false);
          }}
        >
          {asChild ? children : itemChildren}
        </Comp>
      );
    }

    if (asChild) {
      return (
        <DropdownMenuPrimitive.Item
          ref={ref}
          asChild
          className={itemClassName}
          disabled={disabled}
          onSelect={onSelect}
          {...props}
        >
          {children}
        </DropdownMenuPrimitive.Item>
      );
    }

    return (
      <DropdownMenuPrimitive.Item
        ref={ref}
        className={itemClassName}
        disabled={disabled}
        onSelect={onSelect}
        {...props}
      >
        {itemChildren}
      </DropdownMenuPrimitive.Item>
    );
  },
);
DropdownMenuItem.displayName = "DropdownMenuItem";

/** Props for the {@link DropdownMenuSeparator} component. */
export interface DropdownMenuSeparatorProps
  extends React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator> {}

/** Visual separator between groups of items. */
export const DropdownMenuSeparator = React.forwardRef<
  React.ComponentRef<typeof DropdownMenuPrimitive.Separator>,
  DropdownMenuSeparatorProps
>(({ className, ...props }, ref) => {
  const variant = React.useContext(DropdownMenuVariantContext);
  const separatorClassName = cn("my-1 h-px bg-neutral-alphas-200", className);

  // DropdownMenuPrimitive.Separator requires Radix menu context, unavailable
  // when the sheet variant renders inside a Drawer (Dialog) instead. <hr> is a
  // native separator, so it needs no ARIA role.
  if (variant === "sheet") {
    return <hr ref={ref as React.Ref<HTMLHRElement>} className={separatorClassName} {...props} />;
  }

  return <DropdownMenuPrimitive.Separator ref={ref} className={separatorClassName} {...props} />;
});
DropdownMenuSeparator.displayName = "DropdownMenuSeparator";
