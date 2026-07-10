import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { useControllableState } from "@radix-ui/react-use-controllable-state";
import * as React from "react";
import { cn } from "../../utils/cn";
import { FLOATING_CONTENT_COLLISION_PADDING } from "../../utils/floatingContentCollisionPadding";
import { Drawer, DrawerContent, DrawerTrigger } from "../Drawer/Drawer";
import { IconButton } from "../IconButton/IconButton";
import { CheckIcon } from "../Icons/CheckIcon";
import { CloseIcon } from "../Icons/CloseIcon";
import { SearchIcon } from "../Icons/SearchIcon";

// Movement, in CSS px, above which a touch press-and-release counts as a drag.
const TAP_MOVEMENT_THRESHOLD_PX = 10;

// Keys that the menu must keep handling even when focus is inside a child
// input — arrows move the highlight into the list, Tab leaves the menu, and
// Enter / Escape close it.
const NAVIGATION_KEYS = new Set([
  "ArrowDown",
  "ArrowUp",
  "ArrowLeft",
  "ArrowRight",
  "Escape",
  "Tab",
  "Enter",
]);

type ActiveTap = {
  pointerId: number;
  x: number;
  y: number;
  movedPastThreshold: boolean;
};

// Lets DropdownMenuTrigger toggle the menu directly so it can gate on touch
// movement — see radix-ui/primitives#1912.
const ToggleOpenContext = React.createContext<
  ((updater: (prev: boolean) => boolean) => void) | null
>(null);

/**
 * How a {@link DropdownMenu} presents its content.
 * - `"menu"` (default) — a Radix-positioned panel anchored to the trigger.
 * - `"sheet"` — a bottom drawer (via {@link Drawer}), for mobile/touch viewports.
 *
 * The viewport decision belongs to the consumer (it owns the breakpoint
 * source of truth), so pass e.g. `variant={isDesktop ? "menu" : "sheet"}`.
 */
export type DropdownMenuVariant = "menu" | "sheet";

const DropdownMenuVariantContext = React.createContext<DropdownMenuVariant>("menu");

/** Props for the {@link DropdownMenu} root component. */
export interface DropdownMenuProps
  extends React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Root> {
  /** How the menu presents its content. @default "menu" */
  variant?: DropdownMenuVariant;
}

/** Root component that manages open/close state for a dropdown menu. */
export function DropdownMenu({
  open: openProp,
  defaultOpen,
  onOpenChange,
  variant = "menu",
  children,
  ...props
}: DropdownMenuProps) {
  const [open = false, setOpen] = useControllableState({
    prop: openProp,
    defaultProp: defaultOpen ?? false,
    onChange: onOpenChange,
  });

  if (variant === "sheet") {
    return (
      <DropdownMenuVariantContext.Provider value="sheet">
        <ToggleOpenContext.Provider value={setOpen}>
          <Drawer open={open} onOpenChange={setOpen}>
            {children}
          </Drawer>
        </ToggleOpenContext.Provider>
      </DropdownMenuVariantContext.Provider>
    );
  }

  return (
    <DropdownMenuVariantContext.Provider value="menu">
      <ToggleOpenContext.Provider value={setOpen}>
        <DropdownMenuPrimitive.Root open={open} onOpenChange={setOpen} {...props}>
          {children}
        </DropdownMenuPrimitive.Root>
      </ToggleOpenContext.Provider>
    </DropdownMenuVariantContext.Provider>
  );
}

/** Props for the {@link DropdownMenuTrigger} component. */
export type DropdownMenuTriggerProps = React.ComponentPropsWithoutRef<
  typeof DropdownMenuPrimitive.Trigger
>;

/**
 * The element that toggles the dropdown menu when clicked.
 *
 * On touch devices, the menu only opens if the press-and-release stays within
 * a small movement threshold. A drag that incidentally ends over the trigger
 * (common when scrolling a feed on Android Chrome) is ignored. Mouse and
 * keyboard interactions are unchanged.
 */
export const DropdownMenuTrigger = React.forwardRef<
  React.ComponentRef<typeof DropdownMenuPrimitive.Trigger>,
  DropdownMenuTriggerProps
>((props, ref) => {
  const variant = React.useContext(DropdownMenuVariantContext);
  const toggleOpen = React.useContext(ToggleOpenContext);
  const tapRef = React.useRef<ActiveTap | null>(null);

  // The sheet variant opens a Drawer (Dialog), which already suppresses
  // scroll-drag-end synthetic clicks itself — no need for the touch-tap gating below.
  if (variant === "sheet") {
    return <DrawerTrigger {...props} ref={ref} />;
  }

  // Used outside our DropdownMenu wrapper — fall through to Radix defaults.
  if (toggleOpen === null) {
    return <DropdownMenuPrimitive.Trigger {...props} ref={ref} />;
  }

  return (
    <DropdownMenuPrimitive.Trigger
      {...props}
      ref={ref}
      onPointerDown={(event) => {
        props.onPointerDown?.(event);
        if (event.pointerType === "mouse" || props.disabled) return;
        // Keep pointerup / pointercancel on this element if the finger drifts off.
        // Optional because jsdom (used in tests) doesn't implement it.
        event.currentTarget.setPointerCapture?.(event.pointerId);
        tapRef.current = {
          pointerId: event.pointerId,
          x: event.clientX,
          y: event.clientY,
          movedPastThreshold: false,
        };
        // preventDefault stops Radix's pointerdown open path via composeEventHandlers.
        event.preventDefault();
      }}
      onPointerMove={(event) => {
        props.onPointerMove?.(event);
        const tap = tapRef.current;
        if (tap === null || event.pointerId !== tap.pointerId || tap.movedPastThreshold) {
          return;
        }
        const dx = event.clientX - tap.x;
        const dy = event.clientY - tap.y;
        if (Math.hypot(dx, dy) > TAP_MOVEMENT_THRESHOLD_PX) {
          tap.movedPastThreshold = true;
        }
      }}
      onPointerUp={(event) => {
        props.onPointerUp?.(event);
        const tap = tapRef.current;
        if (tap === null || event.pointerId !== tap.pointerId) return;
        const wasDrag = tap.movedPastThreshold;
        tapRef.current = null;
        if (!wasDrag && !props.disabled) {
          toggleOpen((prev) => !prev);
        }
      }}
      onPointerCancel={(event) => {
        props.onPointerCancel?.(event);
        const tap = tapRef.current;
        if (tap !== null && event.pointerId === tap.pointerId) {
          tapRef.current = null;
        }
      }}
    />
  );
});
DropdownMenuTrigger.displayName = "DropdownMenuTrigger";

/** Props for the {@link DropdownMenuContent} component. */
export interface DropdownMenuContentProps
  extends React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content> {}

/**
 * The positioned content panel rendered inside a portal.
 *
 * Override the portal z-index per-instance via `style={{ zIndex: 1500 }}` or
 * globally with the `--fanvue-ui-portal-z-index` CSS custom property.
 *
 * @example
 * ```tsx
 * <DropdownMenu>
 *   <DropdownMenuTrigger asChild>
 *     <Button>Open</Button>
 *   </DropdownMenuTrigger>
 *   <DropdownMenuContent>
 *     <DropdownMenuItem>Option 1</DropdownMenuItem>
 *     <DropdownMenuItem>Option 2</DropdownMenuItem>
 *   </DropdownMenuContent>
 * </DropdownMenu>
 * ```
 */
export const DropdownMenuContent = React.forwardRef<
  React.ComponentRef<typeof DropdownMenuPrimitive.Content>,
  DropdownMenuContentProps
>(
  (
    {
      className,
      style,
      sideOffset = 4,
      // Radix defaults `avoidCollisions` to true, so passing `collisionPadding`
      // is enough to keep the menu flipping/shifting to stay on screen — no
      // hand-rolled reposition logic needed.
      collisionPadding = FLOATING_CONTENT_COLLISION_PADDING,
      children,
      ...props
    },
    ref,
  ) => {
    const variant = React.useContext(DropdownMenuVariantContext);

    if (variant === "sheet") {
      return (
        <DrawerContent
          position="bottom"
          variant="sheet"
          className={cn("flex flex-col gap-1 p-1", className)}
        >
          {children}
        </DrawerContent>
      );
    }

    return (
      <DropdownMenuPrimitive.Portal>
        <DropdownMenuPrimitive.Content
          ref={ref}
          sideOffset={sideOffset}
          collisionPadding={collisionPadding}
          className={cn(
            "w-max min-w-(--radix-dropdown-menu-trigger-width) max-w-(--radix-dropdown-menu-content-available-width) overflow-y-auto rounded-sm border border-neutral-alphas-200 bg-surface-primary p-1 text-content-primary shadow-lg",
            "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
            "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
            "data-[side=top]:slide-in-from-bottom-2 data-[side=bottom]:slide-in-from-top-2",
            "data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2",
            className,
          )}
          style={{
            zIndex: "var(--fanvue-ui-portal-z-index, 50)",
            maxHeight: "var(--radix-dropdown-menu-content-available-height)",
            ...style,
          }}
          {...props}
        >
          {children}
        </DropdownMenuPrimitive.Content>
      </DropdownMenuPrimitive.Portal>
    );
  },
);
DropdownMenuContent.displayName = "DropdownMenuContent";

/** Props for the {@link DropdownMenuGroup} component. */
export type DropdownMenuGroupProps = React.ComponentPropsWithoutRef<
  typeof DropdownMenuPrimitive.Group
>;

/**
 * Groups related menu items. Accepts an optional `DropdownMenuLabel`.
 *
 * Requires Radix menu context — not supported inside a `variant="sheet"` menu.
 */
export const DropdownMenuGroup = DropdownMenuPrimitive.Group;
DropdownMenuGroup.displayName = "DropdownMenuGroup";

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
    position === "top" ? "py-2" : "pb-2 pt-4",
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

const ITEM_COUNT_TYPOGRAPHY: Record<"40" | "32", string> = {
  "40": "typography-body-default-16px-regular",
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
      className={cn("size-4 shrink-0 text-content-primary", hasDescription && "self-start")}
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
      "group flex w-full cursor-pointer gap-2 rounded-xs px-3 outline-none",
      hasDescription ? "items-start" : "items-center",
      ITEM_SIZE_CLASSES[normalizedSize],
      // A 24px avatar would push the compact 32px row past its height with the
      // default padding; tighten it so the avatar variant keeps the 32px contract.
      hasAvatar && !hasDescription && normalizedSize === "32" && "py-1",
      "data-[highlighted]:bg-neutral-alphas-50",
      "data-[disabled]:cursor-not-allowed data-[disabled]:text-content-disabled",
      "disabled:cursor-not-allowed disabled:text-content-disabled",
      destructive && "text-error-content",
      // bg-interaction-hover aliases to the same token as the plain hover
      // background above, so a selected row would be indistinguishable from a
      // hovered-but-unselected one. Use the next step up the neutral-alphas
      // ramp instead (still a subtle overlay, not the heavy filled style).
      selected && ["bg-neutral-alphas-100", "data-[highlighted]:bg-neutral-alphas-200"],
      className,
    );

    // In the two-line (description) layout, icons sit on the title's line.
    // 24px title line-height vs 16px icon → 4px (pt-1) centres the icon on it.
    const iconAlignClassName = hasDescription ? "flex shrink-0 items-center pt-1" : null;

    const countNode = count != null && (
      <span
        className={cn(
          "shrink-0 tabular-nums",
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
          <span className="shrink-0">{avatar}</span>
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
            <span className="truncate">{children}</span>
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
    // render a plain option row with equivalent selection semantics instead.
    if (variant === "sheet" && !asChild) {
      return (
        <button
          ref={ref as React.Ref<HTMLButtonElement>}
          type="button"
          role="option"
          aria-selected={selected}
          disabled={disabled}
          className={itemClassName}
          onClick={(event) => {
            let defaultPrevented = false;
            onSelect?.({
              preventDefault: () => {
                defaultPrevented = true;
              },
              currentTarget: event.currentTarget,
              target: event.target,
            } as unknown as Event);
            if (!defaultPrevented) toggleOpen?.(() => false);
          }}
        >
          {itemChildren}
        </button>
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

/** Header type. `"default"` shows a title; `"search"` shows a search input. */
export type DropdownMenuHeaderType = "default" | "search";

/** Header height preset. Matches the menu item sizing scale. */
export type DropdownMenuHeaderSize = "40" | "32";

/** Search-input configuration for {@link DropdownMenuHeader} when `type="search"`. */
export interface DropdownMenuHeaderSearchProps {
  /** Controlled value of the search input. */
  value?: string;
  /** Uncontrolled default value. */
  defaultValue?: string;
  /** Fires when the input value changes. */
  onChange?: (value: string) => void;
  /** Placeholder text shown when the input is empty. @default "Search…" */
  placeholder?: string;
  /** Accessible label for the search input. @default "Search" */
  "aria-label"?: string;
}

export interface DropdownMenuHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Visual type. `"default"` shows a title; `"search"` shows a search input. @default "default" */
  type?: DropdownMenuHeaderType;
  /** Height preset for the header row. @default "40" */
  size?: DropdownMenuHeaderSize;
  /** Title text shown when `type="default"`. Ignored if `children` is provided. */
  title?: string;
  /** Configuration for the embedded search input when `type="search"`. */
  searchProps?: DropdownMenuHeaderSearchProps;
  /** Whether to render the close icon button on the right. @default true */
  showClose?: boolean;
  /** Fires when the close icon button is activated. */
  onClose?: () => void;
  /** Accessible label for the close button. @default "Close menu" */
  closeLabel?: string;
}

/**
 * Optional header rendered at the top of a {@link DropdownMenuContent}. Use
 * `type="default"` to title the menu, or `type="search"` to embed a search
 * input for filtering long lists.
 *
 * Renders an inset separator beneath the row so it slots cleanly above the
 * first group of items.
 *
 * @example
 * ```tsx
 * <DropdownMenuContent>
 *   <DropdownMenuHeader title="Sort by" onClose={() => setOpen(false)} />
 *   <DropdownMenuItem>Newest</DropdownMenuItem>
 *   <DropdownMenuItem>Oldest</DropdownMenuItem>
 * </DropdownMenuContent>
 * ```
 */
export const DropdownMenuHeader = React.forwardRef<HTMLDivElement, DropdownMenuHeaderProps>(
  (
    {
      type = "default",
      size = "40",
      title,
      searchProps,
      showClose = true,
      onClose,
      closeLabel = "Close menu",
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const titleTypography =
      size === "32"
        ? "typography-body-small-14px-semibold"
        : "typography-body-default-16px-semibold";
    const toggleOpen = React.useContext(ToggleOpenContext);

    const handleClose = () => {
      onClose?.();
      // Also dismiss the Radix menu when used in uncontrolled mode — otherwise
      // the close button would look broken to consumers that don't wire up
      // `open` / `onOpenChange` themselves.
      toggleOpen?.(() => false);
    };

    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col px-1 pt-1 mb-1",
          // Search needs an 8px gap between the input and the divider; the
          // default (title) variant uses 4px because the title baseline sits
          // closer to the divider naturally.
          type === "search" ? "gap-2" : "gap-1",
          className,
        )}
        {...props}
      >
        <div className="flex items-center gap-4 pl-2">
          {type === "default" ? (
            <div className={cn("min-w-0 flex-1 truncate text-content-primary", titleTypography)}>
              {children ?? title}
            </div>
          ) : (
            <SearchInput {...searchProps} />
          )}
          {showClose && (
            <IconButton
              variant="tertiary"
              size="32"
              icon={<CloseIcon />}
              onClick={handleClose}
              aria-label={closeLabel}
            />
          )}
        </div>
        <DropdownMenuSeparator className="my-0" />
      </div>
    );
  },
);
DropdownMenuHeader.displayName = "DropdownMenuHeader";

function SearchInput({
  value,
  defaultValue,
  onChange,
  placeholder = "Search\u2026",
  "aria-label": ariaLabel = "Search",
}: DropdownMenuHeaderSearchProps = {}) {
  return (
    <label
      className={cn(
        "flex min-w-0 flex-1 items-center gap-2 rounded-xs border border-border-primary",
        "bg-neutral-alphas-50 px-3 py-1 text-content-primary",
        "focus-within:shadow-focus-ring focus-within:outline-none",
      )}
    >
      <SearchIcon className="size-4 shrink-0 text-content-tertiary" aria-hidden="true" />
      <input
        type="search"
        className={cn(
          "typography-body-default-16px-regular min-w-0 flex-1 bg-transparent outline-none",
          "placeholder:text-content-tertiary",
        )}
        value={value}
        defaultValue={defaultValue}
        placeholder={placeholder}
        aria-label={ariaLabel}
        onChange={(event) => onChange?.(event.target.value)}
        // Radix DropdownMenu listens for keystrokes on Content for its
        // typeahead (typing letters jumps focus to a matching item). That
        // listener steals focus from the input after the first letter, so we
        // stop character keys from bubbling. Navigation keys (arrows / Tab /
        // Escape / Enter) are still allowed through so the user can leave the
        // input for the list or close the menu. Pointer events are stopped so
        // clicking back into the input doesn't fight the menu's focus
        // management either.
        onKeyDown={(event) => {
          if (!NAVIGATION_KEYS.has(event.key)) event.stopPropagation();
        }}
        onPointerDown={(event) => event.stopPropagation()}
        onMouseDown={(event) => event.stopPropagation()}
      />
    </label>
  );
}

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
        "group flex w-full cursor-pointer items-start gap-3 rounded-xs px-4 py-2 outline-none",
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
