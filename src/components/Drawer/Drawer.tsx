import * as DialogPrimitive from "@radix-ui/react-dialog";
import * as React from "react";
import { cn } from "../../utils/cn";
import { IconButton } from "../IconButton/IconButton";
import { CloseIcon } from "../Icons/CloseIcon";

/** The side from which the drawer slides in. */
export type DrawerPosition = "left" | "right" | "top" | "bottom";

/** Size presets for the drawer panel. Maps to max-width (left/right) or max-height (top/bottom). */
export type DrawerSize = "sm" | "md" | "lg" | "full";

/**
 * Props for the {@link Drawer} root component.
 *
 * Inherits `open`, `onOpenChange`, and `defaultOpen` from Radix Dialog.Root.
 *
 * The Radix `modal` prop (default `true`) can also be passed to create a
 * non-modal drawer — useful for persistent side navigation that does not
 * block interaction with the rest of the page.
 *
 * **`overlay` behaviour:** When `overlay` is `false`, the component
 * automatically sets `modal={false}` on the underlying Radix Dialog.Root.
 * A modal dialog without a visible overlay is confusing because focus is
 * still trapped and scroll is blocked even though the page appears
 * interactive. Passing `modal={true}` explicitly will override this.
 */
export interface DrawerProps extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Root> {
  /**
   * Whether the default {@link DrawerOverlay} is rendered.
   * When `false`, `modal` is automatically set to `false` as well
   * (unless explicitly overridden) so focus-trap and scroll-lock are disabled.
   * @default true
   */
  overlay?: boolean;
}

const DrawerContext = React.createContext<{ overlay: boolean }>({ overlay: true });

/**
 * Root component that manages open/close state for a drawer.
 * Wraps Radix Dialog.Root.
 *
 * @example
 * ```tsx
 * <Drawer>
 *   <DrawerTrigger>Open</DrawerTrigger>
 *   <DrawerContent position="right">
 *     <DrawerHeader>
 *       <DrawerTitle>Settings</DrawerTitle>
 *       <DrawerDescription>Adjust your preferences.</DrawerDescription>
 *     </DrawerHeader>
 *     <p>Content goes here.</p>
 *     <DrawerFooter>
 *       <DrawerClose>Done</DrawerClose>
 *     </DrawerFooter>
 *   </DrawerContent>
 * </Drawer>
 * ```
 */
export function Drawer({ overlay = true, modal, children, ...props }: DrawerProps) {
  const resolvedModal = modal ?? (overlay ? undefined : false);
  return (
    <DrawerContext.Provider value={{ overlay }}>
      <DialogPrimitive.Root modal={resolvedModal} {...props}>
        {children}
      </DialogPrimitive.Root>
    </DrawerContext.Provider>
  );
}
Drawer.displayName = "Drawer";

/** Props for the {@link DrawerTrigger} component. */
export type DrawerTriggerProps = React.ComponentPropsWithoutRef<typeof DialogPrimitive.Trigger>;

/** The element that opens the drawer when clicked. */
export const DrawerTrigger = DialogPrimitive.Trigger;
DrawerTrigger.displayName = "DrawerTrigger";

/** Props for the {@link DrawerClose} component. */
export type DrawerCloseProps = React.ComponentPropsWithoutRef<typeof DialogPrimitive.Close>;

/** Closes the drawer when clicked. Can be placed anywhere inside the drawer. */
export const DrawerClose = DialogPrimitive.Close;
DrawerClose.displayName = "DrawerClose";

/** Props for the {@link DrawerOverlay} component. */
export interface DrawerOverlayProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay> {}

/**
 * A translucent backdrop rendered behind the drawer content.
 * Clicking the overlay closes the drawer by default.
 */
export const DrawerOverlay = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Overlay>,
  DrawerOverlayProps
>(({ className, style, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    style={{ zIndex: "var(--fanvue-ui-portal-z-index, 50)", ...style }}
    className={cn(
      "fixed inset-0 bg-surface-backdrop",
      "data-[state=closed]:animate-out data-[state=open]:animate-in",
      "data-[state=closed]:fade-out-0 data-[state=closed]:duration-150 data-[state=closed]:ease-in",
      "data-[state=open]:fade-in-0 data-[state=open]:duration-200 data-[state=open]:ease-out",
      className,
    )}
    {...props}
  />
));
DrawerOverlay.displayName = "DrawerOverlay";

/**
 * Slide-in animation classes keyed by position.
 * Uses Tailwind animate utilities (animate-in / animate-out).
 */
const SLIDE_CLASSES: Record<DrawerPosition, string> = {
  right:
    "inset-y-0 right-0 h-full w-2/3 data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right",
  left: "inset-y-0 left-0 h-full w-2/3 data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left",
  top: "inset-x-0 top-0 w-full data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
  bottom:
    "inset-x-0 bottom-0 w-full rounded-t-lg data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
};

/** Props for the {@link DrawerContent} component. */
export interface DrawerContentProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> {
  /**
   * The edge from which the drawer slides in.
   *
   * Named `position` (rather than `side`) to avoid confusion with the CSS
   * `side` concept used by Radix Popover/Tooltip and to better convey the
   * spatial relationship of the drawer to the viewport.
   *
   * @default "right"
   */
  position?: DrawerPosition;
  /**
   * Controls the maximum extent of the drawer panel.
   * For left/right drawers this sets `max-width`; for top/bottom it sets `max-height`.
   * @default "sm"
   */
  size?: DrawerSize;
  /**
   * Whether to render the default {@link DrawerOverlay} behind the content.
   * Set to `false` to provide your own overlay or omit it entirely.
   *
   * Prefer setting `overlay` on the {@link Drawer} root instead so that
   * `modal` is also adjusted automatically.
   *
   * @default true
   */
  overlay?: boolean;
  /** Props forwarded to the default {@link DrawerOverlay} when `overlay` is `true`. */
  overlayProps?: DrawerOverlayProps;
}

/**
 * The panel that slides in from the chosen edge. Renders inside a portal with
 * an overlay backdrop by default.
 *
 * Includes focus-trap, `aria-describedby`, and Escape-to-close from Radix Dialog.
 */
export const DrawerContent = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Content>,
  DrawerContentProps
>(
  (
    {
      className,
      position = "right",
      size = "sm",
      overlay: overlayProp,
      overlayProps,
      style,
      children,
      ...props
    },
    ref,
  ) => {
    const ctx = React.useContext(DrawerContext);
    const overlay = overlayProp ?? ctx.overlay;
    const isHorizontal = position === "left" || position === "right";
    const sizeClass = isHorizontal
      ? ({ sm: "max-w-sm", md: "max-w-md", lg: "max-w-lg", full: "max-w-full" } as const)[size]
      : (
          {
            sm: "max-h-[24rem]",
            md: "max-h-[28rem]",
            lg: "max-h-[32rem]",
            full: "max-h-full",
          } as const
        )[size];

    return (
      <DialogPrimitive.Portal>
        {overlay && <DrawerOverlay {...overlayProps} />}
        <DialogPrimitive.Content
          ref={ref}
          style={{ zIndex: "calc(var(--fanvue-ui-portal-z-index, 50) + 1)", ...style }}
          className={cn(
            "fixed flex flex-col bg-surface-modal shadow-lifted outline-none backdrop-blur-lg",
            "data-[state=closed]:animate-out data-[state=open]:animate-in",
            "data-[state=closed]:duration-150 data-[state=closed]:ease-in",
            "data-[state=open]:duration-200 data-[state=open]:ease-out",
            SLIDE_CLASSES[position],
            sizeClass,
            className,
          )}
          {...props}
        >
          {children}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    );
  },
);
DrawerContent.displayName = "DrawerContent";

/** Props for the {@link DrawerHeader} component. */
export interface DrawerHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Whether to show a built-in close (X) button. @default true */
  showClose?: boolean;
  /** Accessible label for the close button. @default "Close drawer" */
  closeLabel?: string;
}

/**
 * A semantic header area for the drawer, typically containing a title and description.
 * Renders a built-in close button by default.
 */
export const DrawerHeader = React.forwardRef<HTMLDivElement, DrawerHeaderProps>(
  ({ className, showClose = true, closeLabel = "Close drawer", children, ...props }, ref) => (
    <div ref={ref} className={cn("flex items-start gap-2 p-4", className)} {...props}>
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">{children}</div>
      {showClose && (
        <DialogPrimitive.Close asChild>
          <IconButton
            icon={<CloseIcon />}
            aria-label={closeLabel}
            variant="tertiary"
            size="24"
            className="shrink-0"
          />
        </DialogPrimitive.Close>
      )}
    </div>
  ),
);
DrawerHeader.displayName = "DrawerHeader";

/** Props for the {@link DrawerFooter} component. */
export interface DrawerFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

/** A semantic footer area for the drawer, typically containing action buttons. */
export const DrawerFooter = React.forwardRef<HTMLDivElement, DrawerFooterProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col gap-2 p-4", className)} {...props} />
  ),
);
DrawerFooter.displayName = "DrawerFooter";

/** Props for the {@link DrawerTitle} component. */
export interface DrawerTitleProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title> {}

/** An accessible title for the drawer. Required for screen readers. */
export const DrawerTitle = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Title>,
  DrawerTitleProps
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn("typography-semibold-body-lg truncate text-foreground-default", className)}
    {...props}
  />
));
DrawerTitle.displayName = "DrawerTitle";

/** Props for the {@link DrawerDescription} component. */
export interface DrawerDescriptionProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description> {}

/** An accessible description for the drawer, providing supplementary context. */
export const DrawerDescription = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Description>,
  DrawerDescriptionProps
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("typography-regular-body-md text-foreground-secondary", className)}
    {...props}
  />
));
DrawerDescription.displayName = "DrawerDescription";
