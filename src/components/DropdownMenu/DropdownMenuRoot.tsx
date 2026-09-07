import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { useControllableState } from "@radix-ui/react-use-controllable-state";
import * as React from "react";
import { cn } from "../../utils/cn";
import { FLOATING_CONTENT_COLLISION_PADDING } from "../../utils/floatingContentCollisionPadding";
import { Drawer, DrawerContent, DrawerTrigger } from "../Drawer/Drawer";
import { type DropdownMenuVariant, DropdownMenuVariantContext, ToggleOpenContext } from "./context";

// Movement, in CSS px, above which a touch press-and-release counts as a drag.
const TAP_MOVEMENT_THRESHOLD_PX = 10;

// Radix menus swallow Tab (a menu has no tab stops, only items), which strands
// any non-item control rendered inside one — header actions, a search input,
// reorder handles. Containers of such controls carry this attribute and
// `DropdownMenuContent` cycles Tab through the focusable elements inside them.
const TAB_STOPS_ATTRIBUTE = "data-dropdown-menu-tab-stops";
const FOCUSABLE_SELECTOR = "a[href], button, input, select, textarea, [tabindex]";

function getMenuTabStops(content: HTMLElement): HTMLElement[] {
  const stops: HTMLElement[] = [];
  for (const container of content.querySelectorAll<HTMLElement>(`[${TAB_STOPS_ATTRIBUTE}]`)) {
    for (const element of container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)) {
      if (element.tabIndex < 0 || element.matches(":disabled") || element.hidden) continue;
      stops.push(element);
    }
  }
  return stops;
}

// Cycles focus through the menu's tab stops on Tab / Shift+Tab, skipping menu
// items (which keep their arrow-key navigation). Returns without acting when
// the key isn't a plain Tab, came from a nested menu, or there is nothing to
// cycle through — Radix then swallows the key as it always has.
function cycleMenuTabStops(event: React.KeyboardEvent<HTMLElement>): void {
  if (event.key !== "Tab" || event.altKey || event.ctrlKey || event.metaKey) return;
  // A nested menu's keydowns bubble here through React's portal tree; they are
  // the nested menu's to handle.
  const target = event.target as HTMLElement;
  if (target.closest("[data-radix-menu-content]") !== event.currentTarget) return;
  const stops = getMenuTabStops(event.currentTarget);
  if (stops.length === 0) return;
  // Prevented here so Radix's own handler (which would swallow the key) is
  // skipped — Radix composes it after ours and checks `defaultPrevented`.
  event.preventDefault();
  const index = stops.indexOf(target);
  const last = stops.length - 1;
  const next = event.shiftKey
    ? stops[index <= 0 ? last : index - 1]
    : stops[index === -1 || index === last ? 0 : index + 1];
  // Radix's FocusScope also sees this Tab (after us, ignoring
  // `defaultPrevented`), but a menu's scope is trapped without `loop`, so it
  // only prevents the default — it never moves focus itself.
  next?.focus({ preventScroll: true });
}

type ActiveTap = {
  pointerId: number;
  x: number;
  y: number;
  movedPastThreshold: boolean;
};

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
      onPointerDownOutside,
      onCloseAutoFocus,
      onKeyDown,
      children,
      ...props
    },
    ref,
  ) => {
    const variant = React.useContext(DropdownMenuVariantContext);
    // Radix returns focus to the trigger when the menu closes. That is right for
    // the keyboard, but Chrome's :focus-visible heuristic also paints the ring on
    // that programmatic refocus, so dismissing with a click left a focus ring
    // sitting on the trigger. Track pointer dismissals and skip the restore for
    // them only — Escape and Tab still hand focus back with the ring.
    const dismissedByPointer = React.useRef(false);

    if (variant === "sheet") {
      return (
        <DrawerContent
          ref={ref}
          position="bottom"
          // `"sheet"` sits flush to the bottom edge at full width; the design draws
          // this panel inset from all three sides and rounded on every corner, which
          // is `"menu"`. Both carry the same modal surface.
          variant="menu"
          // The design's `blur + shadow/menu` effect is a background blur, and the
          // panel's own fill is opaque — so the blur has to go on the overlay to be
          // visible at all. Scoped here rather than on DrawerOverlay so only menus
          // shown this way blur the page behind them.
          overlayProps={{ className: "backdrop-blur-[8px]" }}
          // `pb-4` gives the design's 16px below the last row. The rows inset
          // themselves horizontally (see the item's `mx-3`) rather than the panel
          // padding doing it, so the header and its rule can still run full width.
          className={cn("flex flex-col gap-1 p-1 pb-4", className)}
          style={style}
          // Both are destructured above for the popper branch's focus-ring
          // handling, which takes them out of `props` — so the sheet branch has
          // to re-attach them or they are silently dropped. `DrawerContent`
          // forwards them to its `DialogPrimitive.Content`, which supports both.
          // Consumers stack sheets on these (a nested sheet's `onCloseAutoFocus`
          // is the only point at which the parent knows the child has finished
          // animating out), so dropping them breaks the flow with no error.
          onPointerDownOutside={onPointerDownOutside}
          onCloseAutoFocus={onCloseAutoFocus}
          onKeyDown={onKeyDown}
          {...props}
        >
          {children}
        </DrawerContent>
      );
    }

    return (
      <DropdownMenuPrimitive.Portal>
        <DropdownMenuPrimitive.Content
          ref={ref}
          onPointerDownOutside={(event) => {
            dismissedByPointer.current = true;
            onPointerDownOutside?.(event);
          }}
          onCloseAutoFocus={(event) => {
            if (dismissedByPointer.current) event.preventDefault();
            dismissedByPointer.current = false;
            onCloseAutoFocus?.(event);
          }}
          onKeyDown={(event) => {
            onKeyDown?.(event);
            if (!event.defaultPrevented) cycleMenuTabStops(event);
          }}
          sideOffset={sideOffset}
          collisionPadding={collisionPadding}
          className={cn(
            // `rounded-sm` (12px) is the panel radius `V2 Menu Dropdown` carries
            // (product file node `7393:62008`). The 8px `rounded-xs` belongs to the
            // rows inside it, not the panel.
            //
            // The `sheet` variant is deliberately not 12px: it renders through
            // `DrawerContent variant="menu"`, whose `MENU_CLASSES` is `rounded-lg`
            // (24px). A bottom sheet is a full-width surface with its own radius,
            // not a scaled-up popper, so the two are meant to differ.
            "w-max min-w-(--radix-dropdown-menu-trigger-width) max-w-(--radix-dropdown-menu-content-available-width) overflow-y-auto rounded-sm border border-border-primary bg-surface-primary p-1 text-content-primary shadow-blur-menu backdrop-blur-[4px]",
            "data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=open]:animate-in",
            "data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=closed]:animate-out",
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
