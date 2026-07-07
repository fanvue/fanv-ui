import * as DialogPrimitive from "@radix-ui/react-dialog";
import * as React from "react";
import { cn } from "../../utils/cn";
import { useSuppressClickAfterDrag } from "../../utils/useSuppressClickAfterDrag";
import { IconButton } from "../IconButton/IconButton";
import { ArrowLeftIcon } from "../Icons/ArrowLeftIcon";
import { CloseIcon } from "../Icons/CloseIcon";

/** Props for the {@link Dialog} root component. */
export interface DialogProps extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Root> {
  /** Controlled open state. When provided, you must also supply `onOpenChange`. */
  open?: boolean;
  /** Called when the open state changes. Required when `open` is controlled. */
  onOpenChange?: (open: boolean) => void;
  /** The open state of the dialog when it is initially rendered (uncontrolled). */
  defaultOpen?: boolean;
}

/** Root component that manages open/close state for a dialog. */
export const Dialog = DialogPrimitive.Root;

/** Props for the {@link DialogTrigger} component. */
export type DialogTriggerProps = React.ComponentPropsWithoutRef<typeof DialogPrimitive.Trigger>;

/**
 * The element that opens the dialog when clicked.
 *
 * On touch / pen, a press-and-release that crosses a small movement threshold
 * is treated as a drag and the resulting synthetic click is suppressed —
 * defends against Android Chrome opening the dialog on a scroll-drag-end.
 */
export const DialogTrigger = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Trigger>,
  DialogTriggerProps
>((props, ref) => <DialogPrimitive.Trigger ref={ref} {...useSuppressClickAfterDrag(props)} />);
DialogTrigger.displayName = "DialogTrigger";

/** Convenience alias for Radix `Dialog.Close`. Closes the dialog when clicked. */
export const DialogClose = DialogPrimitive.Close;

/** Props for the {@link DialogClose} component. */
export type DialogCloseProps = React.ComponentPropsWithoutRef<typeof DialogPrimitive.Close>;

export interface DialogOverlayProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay> {}

/**
 * Semi-transparent backdrop rendered behind the dialog content.
 * Rendered by {@link DialogContent}; portaled to `document.body` when {@link DialogContent} `portal` is true.
 */
export const DialogOverlay = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Overlay>,
  DialogOverlayProps
>(({ className, style, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0 fixed inset-0 bg-background-overlay-default data-[state=closed]:animate-out data-[state=open]:animate-in",
      className,
    )}
    style={{ zIndex: "var(--fanvue-ui-portal-z-index, 50)", ...style }}
    {...props}
  />
));
DialogOverlay.displayName = "DialogOverlay";

export interface DialogContentProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> {
  /**
   * Width preset for the dialog.
   * - `"sm"` — 400px max-width (confirmations, simple forms)
   * - `"md"` — 440px max-width (default, standard dialogs)
   * - `"lg"` — 600px max-width (complex content, tables)
   *
   * @default "md"
   */
  size?: "sm" | "md" | "lg";
  /** When true, renders overlay automatically. @default true */
  overlay?: boolean;
  /**
   * When true, teleports overlay and panel to `document.body`.
   * When false, renders inline in the React tree (useful inside theme providers or scoped containers).
   * @default true
   */
  portal?: boolean;
  /** Show the v2 mobile sheet pull handle. Only rendered when `mobilePresentation` is `"sheet"`. @default true */
  showMobileHandle?: boolean;
  /**
   * How the dialog presents below the `sm` breakpoint.
   * - `"sheet"` — bottom sheet pinned to the viewport bottom edge (default)
   * - `"card"` — centered floating card per the v2-modal confirmation spec:
   *   16px side margins, 24px padding, 32px radius on all corners, no pull handle
   *
   * @default "sheet"
   */
  mobilePresentation?: "sheet" | "card";
}

const SIZE_CLASSES: Record<NonNullable<DialogContentProps["size"]>, string> = {
  sm: "sm:max-w-[400px]",
  md: "sm:max-w-[440px]",
  lg: "sm:max-w-[600px]",
};

/**
 * The dialog panel. Includes the overlay by default and portals to `document.body` by default.
 *
 * Set `portal={false}` to keep overlay and content in the DOM subtree of the parent `Dialog`.
 * `fixed` positioning still applies; ancestors with `transform` or `overflow` may affect layout.
 *
 * On mobile viewports (<640px), the dialog slides up from the bottom as a sheet
 * with top-only border radius by default; pass `mobilePresentation="card"` to
 * render a centered floating card instead (used for small confirmation dialogs).
 * On larger viewports it renders centered with full border radius.
 *
 * @example
 * ```tsx
 * <Dialog>
 *   <DialogTrigger asChild>
 *     <Button>Open</Button>
 *   </DialogTrigger>
 *   <DialogContent>
 *     <DialogHeader>
 *       <DialogTitle>Title</DialogTitle>
 *     </DialogHeader>
 *     <DialogBody>Content here</DialogBody>
 *     <DialogFooter>
 *       <DialogClose asChild>
 *         <Button variant="secondary">Cancel</Button>
 *       </DialogClose>
 *       <Button>Accept</Button>
 *     </DialogFooter>
 *   </DialogContent>
 * </Dialog>
 * ```
 */
export const DialogContent = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Content>,
  DialogContentProps
>(
  (
    {
      className,
      children,
      size = "md",
      overlay = true,
      portal = true,
      showMobileHandle = true,
      mobilePresentation = "sheet",
      style,
      onOpenAutoFocus,
      ...props
    },
    ref,
  ) => {
    const content = (
      <>
        {overlay && <DialogOverlay />}
        <DialogPrimitive.Content
          ref={ref}
          style={{ zIndex: "var(--fanvue-ui-portal-z-index, 50)", ...style }}
          onOpenAutoFocus={(e) => {
            if (onOpenAutoFocus) {
              onOpenAutoFocus(e);
              return;
            }
            e.preventDefault();
            (e.currentTarget as HTMLElement).focus();
          }}
          className={cn(
            "fixed flex flex-col overflow-hidden border border-modal-stroke bg-modal-background shadow-blur-menu backdrop-blur-[4px] focus:outline-none",
            "data-[state=open]:fade-in-0 data-[state=open]:animate-in",
            "data-[state=closed]:fade-out-0 data-[state=closed]:animate-out",
            mobilePresentation === "card"
              ? // Floating confirmation card (v2-modal): 16px side margins, vertically centered, 32px radius
                cn(
                  "inset-x-4 top-1/2 max-h-[85vh] -translate-y-1/2 rounded-xl p-6",
                  "data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95",
                  "sm:inset-x-auto",
                )
              : // Bottom sheet pinned to the viewport bottom edge
                cn(
                  "inset-x-0 bottom-0 max-h-[85vh] w-full rounded-t-xl p-4 pt-3",
                  "data-[state=open]:slide-in-from-bottom-full",
                  "data-[state=closed]:slide-out-to-bottom-full",
                  "sm:data-[state=open]:slide-in-from-bottom-0 sm:data-[state=open]:zoom-in-95",
                  "sm:data-[state=closed]:slide-out-to-bottom-0 sm:data-[state=closed]:zoom-out-95",
                ),
            "sm:inset-auto sm:top-1/2 sm:left-1/2 sm:max-h-[85vh] sm:w-full sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-lg sm:p-6",
            "duration-200",
            SIZE_CLASSES[size],
            className,
          )}
          {...props}
        >
          {showMobileHandle && mobilePresentation === "sheet" && (
            <div
              aria-hidden="true"
              className="mb-3 h-1 w-8 shrink-0 self-center rounded-full bg-icons-tertiary sm:hidden"
            />
          )}
          {children}
        </DialogPrimitive.Content>
      </>
    );

    return portal ? <DialogPrimitive.Portal>{content}</DialogPrimitive.Portal> : content;
  },
);
DialogContent.displayName = "DialogContent";

export interface DialogHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Show the close (X) button in the header. @default true */
  showClose?: boolean;
  /** Show a back arrow button on the left side. Defaults to `true` when `onBack` is provided. */
  showBack?: boolean;
  /** Called when the back button is clicked. */
  onBack?: () => void;
  /** Accessible label for the back button. @default "Go back" */
  backLabel?: string;
  /** Accessible label for the close button. @default "Close" */
  closeLabel?: string;
}

/**
 * Header bar for the dialog. Renders the title with an optional back arrow
 * and close button.
 *
 * @example
 * ```tsx
 * <DialogHeader>
 *   <DialogTitle>Settings</DialogTitle>
 * </DialogHeader>
 *
 * <DialogHeader showBack onBack={() => setStep(0)}>
 *   <DialogTitle>Step 2</DialogTitle>
 * </DialogHeader>
 * ```
 */
export const DialogHeader = React.forwardRef<HTMLDivElement, DialogHeaderProps>(
  (
    {
      className,
      children,
      showClose = true,
      showBack,
      onBack,
      backLabel = "Go back",
      closeLabel = "Close",
      ...props
    },
    ref,
  ) => {
    const shouldShowBack = showBack ?? !!onBack;

    return (
      <div
        ref={ref}
        className={cn("flex shrink-0 items-center justify-end gap-4", className)}
        {...props}
      >
        {shouldShowBack && (
          <IconButton
            variant="secondary"
            size="32"
            icon={<ArrowLeftIcon size={16} />}
            onClick={onBack}
            disabled={!onBack}
            aria-label={backLabel}
          />
        )}
        <div className="flex min-w-0 flex-1 flex-col gap-1.5">{children}</div>
        {showClose && (
          <DialogPrimitive.Close asChild>
            <IconButton
              variant="secondary"
              size="32"
              icon={<CloseIcon size={16} />}
              aria-label={closeLabel}
            />
          </DialogPrimitive.Close>
        )}
      </div>
    );
  },
);
DialogHeader.displayName = "DialogHeader";

/** Props for the {@link DialogTitle} component. */
export type DialogTitleProps = React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>;

/**
 * Accessible title for the dialog. Must be rendered inside {@link DialogHeader}
 * or directly within {@link DialogContent}.
 */
export const DialogTitle = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Title>,
  DialogTitleProps
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn("typography-header-heading-xs text-content-primary", className)}
    {...props}
  />
));
DialogTitle.displayName = "DialogTitle";

/** Props for the {@link DialogDescription} component. */
export type DialogDescriptionProps = React.ComponentPropsWithoutRef<
  typeof DialogPrimitive.Description
>;

/** Accessible description for the dialog. Rendered as secondary text. */
export const DialogDescription = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Description>,
  DialogDescriptionProps
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("typography-body-default-16px-regular text-content-secondary", className)}
    {...props}
  />
));
DialogDescription.displayName = "DialogDescription";

export interface DialogBodyProps extends React.HTMLAttributes<HTMLDivElement> {}

/**
 * Scrollable content area (slot) between the header and footer.
 * Grows to fill available space and scrolls when content overflows.
 */
export const DialogBody = React.forwardRef<HTMLDivElement, DialogBodyProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex-1 overflow-y-auto py-4", className)} {...props} />
  ),
);
DialogBody.displayName = "DialogBody";

export interface DialogFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

/**
 * Footer bar for the dialog. Typically contains action buttons.
 * Children are laid out in a horizontal row with equal flex-basis.
 */
export const DialogFooter = React.forwardRef<HTMLDivElement, DialogFooterProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex shrink-0 items-center gap-2", "[&>*]:min-w-0 [&>*]:flex-1", className)}
      {...props}
    />
  ),
);
DialogFooter.displayName = "DialogFooter";
