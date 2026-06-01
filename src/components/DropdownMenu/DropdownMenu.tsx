import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { useControllableState } from "@radix-ui/react-use-controllable-state";
import * as React from "react";
import { cn } from "../../utils/cn";
import { FLOATING_CONTENT_COLLISION_PADDING } from "../../utils/floatingContentCollisionPadding";
import { IconButton } from "../IconButton/IconButton";
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

/** Props for the {@link DropdownMenu} root component. */
export interface DropdownMenuProps
  extends React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Root> {}

/** Root component that manages open/close state for a dropdown menu. */
export function DropdownMenu({
  open: openProp,
  defaultOpen,
  onOpenChange,
  children,
  ...props
}: DropdownMenuProps) {
  const [open = false, setOpen] = useControllableState({
    prop: openProp,
    defaultProp: defaultOpen ?? false,
    onChange: onOpenChange,
  });

  return (
    <ToggleOpenContext.Provider value={setOpen}>
      <DropdownMenuPrimitive.Root open={open} onOpenChange={setOpen} {...props}>
        {children}
      </DropdownMenuPrimitive.Root>
    </ToggleOpenContext.Provider>
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
  const toggleOpen = React.useContext(ToggleOpenContext);
  const tapRef = React.useRef<ActiveTap | null>(null);

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
      collisionPadding = FLOATING_CONTENT_COLLISION_PADDING,
      ...props
    },
    ref,
  ) => (
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
      />
    </DropdownMenuPrimitive.Portal>
  ),
);
DropdownMenuContent.displayName = "DropdownMenuContent";

/** Props for the {@link DropdownMenuGroup} component. */
export type DropdownMenuGroupProps = React.ComponentPropsWithoutRef<
  typeof DropdownMenuPrimitive.Group
>;

/** Groups related menu items. Accepts an optional `DropdownMenuLabel`. */
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
>(({ className, position = "default", ...props }, ref) => (
  <DropdownMenuPrimitive.Label
    ref={ref}
    className={cn(
      "typography-description-12px-regular flex items-center px-3 text-content-secondary",
      position === "top" ? "py-2" : "pb-2 pt-4",
      className,
    )}
    {...props}
  />
));
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

const ITEM_SELECTED_TYPOGRAPHY: Record<"40" | "32", string> = {
  "40": "typography-body-default-16px-semibold",
  "32": "typography-body-small-14px-semibold",
};

export interface DropdownMenuItemProps
  extends React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> {
  /** Height of the menu item row. @default "40" */
  size?: DropdownMenuItemSize;
  /** Applies the destructive (error) treatment. Use for irreversible actions. @default false */
  destructive?: boolean;
  /** Icon (or other node) rendered before the label. */
  leadingIcon?: React.ReactNode;
  /** Icon (or other node) rendered after the label. */
  trailingIcon?: React.ReactNode;
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
      trailingIcon,
      selected,
      className,
      children,
      asChild,
      ...props
    },
    ref,
  ) => {
    const normalizedSize = SIZE_NORMALIZED[size];
    const itemClassName = cn(
      "flex w-full cursor-pointer items-center gap-2 rounded-xs px-3 outline-none",
      ITEM_SIZE_CLASSES[normalizedSize],
      "data-[highlighted]:bg-neutral-alphas-50",
      "data-[disabled]:cursor-not-allowed data-[disabled]:text-content-disabled",
      destructive && "text-error-content",
      selected && [
        "bg-buttons-primary-default text-content-primary-inverted",
        "data-[highlighted]:bg-buttons-primary-default",
        ITEM_SELECTED_TYPOGRAPHY[normalizedSize],
      ],
      className,
    );

    if (asChild) {
      return (
        <DropdownMenuPrimitive.Item ref={ref} asChild className={itemClassName} {...props}>
          {children}
        </DropdownMenuPrimitive.Item>
      );
    }

    return (
      <DropdownMenuPrimitive.Item ref={ref} className={itemClassName} {...props}>
        {leadingIcon}
        <span className="min-w-0 flex-1 truncate">{children}</span>
        {trailingIcon}
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
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Separator
    ref={ref}
    className={cn("my-1 h-px bg-neutral-alphas-200", className)}
    {...props}
  />
));
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
        "data-[state=checked]:bg-buttons-primary-default data-[state=checked]:text-content-primary-inverted",
        "data-[state=checked]:data-[highlighted]:bg-buttons-primary-default",
        className,
      )}
      {...props}
    >
      <span
        className={cn(
          "mt-1 flex size-4 shrink-0 items-center justify-center rounded-full border border-icons-primary",
          "group-data-[disabled]:border-content-disabled",
          "group-data-[state=checked]:border-icons-primary-inverted",
        )}
        aria-hidden="true"
      >
        <DropdownMenuPrimitive.ItemIndicator asChild>
          <span className="size-2 rounded-full bg-content-primary-inverted" />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      <span className="flex min-w-0 flex-1 flex-col gap-1">
        <span className="typography-body-default-16px-semibold truncate">{children}</span>
        {helper && (
          <span
            className={cn(
              "typography-description-12px-regular text-content-secondary",
              "group-data-[state=checked]:text-content-primary-inverted",
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
