import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { useControllableState } from "@radix-ui/react-use-controllable-state";
import * as React from "react";
import { cn } from "../../utils/cn";
import { FLOATING_CONTENT_COLLISION_PADDING } from "../../utils/floatingContentCollisionPadding";

// Pointer displacement, in CSS pixels, above which a press-and-release on the
// trigger is treated as a drag (not a tap). Sits below Chromium's 15px scroll
// slop with headroom for finger jitter.
const TAP_MOVEMENT_THRESHOLD_PX = 10;

type ActiveTap = {
  pointerId: number;
  x: number;
  y: number;
  movedPastThreshold: boolean;
};

/**
 * Lets {@link DropdownMenuTrigger} read open state and toggle the menu so it
 * can apply a touch-tap movement gate. Radix's `DropdownMenuTrigger` opens on
 * `pointerdown` with no `pointerType` guard, so a scroll-drag that incidentally
 * releases over the trigger on Android Chrome opens the menu and traps the
 * user — see https://github.com/radix-ui/primitives/issues/1912.
 */
const DropdownMenuOpenContext = React.createContext<{
  openRef: React.MutableRefObject<boolean>;
  setOpen: (next: boolean) => void;
} | null>(null);

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

  // Mirror to a ref so the trigger's pointerup handler reads the latest open
  // state even if a parent re-render between pointerdown and pointerup left
  // the originally captured context value stale.
  const openRef = React.useRef(open);
  openRef.current = open;

  const ctxValue = React.useMemo(
    () => ({ openRef, setOpen: (next: boolean) => setOpen(next) }),
    [setOpen],
  );

  return (
    <DropdownMenuOpenContext.Provider value={ctxValue}>
      <DropdownMenuPrimitive.Root open={open} onOpenChange={setOpen} {...props}>
        {children}
      </DropdownMenuPrimitive.Root>
    </DropdownMenuOpenContext.Provider>
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
  const ctx = React.useContext(DropdownMenuOpenContext);
  const tapRef = React.useRef<ActiveTap | null>(null);

  // Used outside our DropdownMenu wrapper — fall through to Radix defaults.
  if (ctx === null) {
    return <DropdownMenuPrimitive.Trigger {...props} ref={ref} />;
  }

  return (
    <DropdownMenuPrimitive.Trigger
      {...props}
      ref={ref}
      onPointerDown={(event) => {
        props.onPointerDown?.(event);
        if (event.pointerType === "mouse" || props.disabled) return;
        // setPointerCapture ensures pointerup/cancel fire on this element even
        // if the finger drifts off — without it, drag-off leaves stale tap
        // state that mis-classifies the next press.
        try {
          event.currentTarget.setPointerCapture(event.pointerId);
        } catch {
          // Older browsers may reject an unknown pointerId. Safe to ignore.
        }
        tapRef.current = {
          pointerId: event.pointerId,
          x: event.clientX,
          y: event.clientY,
          movedPastThreshold: false,
        };
        // composeEventHandlers in Radix short-circuits when our handler
        // preventDefaults, suppressing the open-on-pointerdown path.
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
          ctx.setOpen(!ctx.openRef.current);
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
          "w-max min-w-(--radix-dropdown-menu-trigger-width) max-w-(--radix-dropdown-menu-content-available-width) overflow-y-auto rounded-xs border border-neutral-alphas-200 bg-bg-primary p-1 shadow-lg",
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

/** Props for the {@link DropdownMenuLabel} component. */
export interface DropdownMenuLabelProps
  extends React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label> {}

/** A label for a group of items. Not focusable or selectable. */
export const DropdownMenuLabel = React.forwardRef<
  React.ComponentRef<typeof DropdownMenuPrimitive.Label>,
  DropdownMenuLabelProps
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Label
    ref={ref}
    className={cn("typography-medium-body-xs px-2 py-1.5 text-content-secondary", className)}
    {...props}
  />
));
DropdownMenuLabel.displayName = "DropdownMenuLabel";

/** Available sizes for a dropdown menu item. */
export type DropdownMenuItemSize = "sm" | "md";

export interface DropdownMenuItemProps
  extends React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> {
  /** Height of the menu item row. @default "sm" */
  size?: DropdownMenuItemSize;
  /** Whether the item uses destructive (error) styling. */
  destructive?: boolean;
  /** Icon rendered before the label. */
  leadingIcon?: React.ReactNode;
  /** Icon rendered after the label. */
  trailingIcon?: React.ReactNode;
  /** Whether the item is in a selected state. */
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
      size = "sm",
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
    const itemClassName = cn(
      "flex w-full cursor-pointer items-center gap-1 rounded px-2 outline-none",
      "data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50",
      "data-[highlighted]:bg-neutral-alphas-100",
      size === "sm" ? "min-h-[34px] py-1" : "min-h-[40px] py-1.5",
      size === "sm" ? "typography-medium-body-sm" : "typography-medium-body-md",
      destructive && "text-error-content",
      selected && "bg-success-surface",
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
        <span className="flex-1">{children}</span>
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
