import * as DialogPrimitive from "@radix-ui/react-dialog";
import * as React from "react";
import { cn } from "../../utils/cn";
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

/** The element that opens the dialog when clicked. */
export const DialogTrigger = DialogPrimitive.Trigger;

/** Convenience alias for Radix `Dialog.Close`. Closes the dialog when clicked. */
export const DialogClose = DialogPrimitive.Close;

/** Props for the {@link DialogClose} component. */
export type DialogCloseProps = React.ComponentPropsWithoutRef<typeof DialogPrimitive.Close>;

export interface DialogOverlayProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay> {}

/**
 * Semi-transparent backdrop rendered behind the dialog content.
 * Rendered inside a portal automatically by {@link DialogContent}.
 */
export const DialogOverlay = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Overlay>,
  DialogOverlayProps
>(({ className, style, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0 fixed inset-0 bg-surface-backdrop data-[state=closed]:animate-out data-[state=open]:animate-in",
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
}

const SIZE_CLASSES: Record<NonNullable<DialogContentProps["size"]>, string> = {
  sm: "sm:max-w-[400px]",
  md: "sm:max-w-[440px]",
  lg: "sm:max-w-[600px]",
};

/**
 * The dialog panel rendered inside a portal. Includes the overlay by default.
 *
 * On mobile viewports (<640px), the dialog slides up from the bottom as a sheet
 * with top-only border radius. On larger viewports it renders centered with
 * full border radius.
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
>(({ className, children, size = "md", overlay = true, style, ...props }, ref) => (
  <DialogPrimitive.Portal>
    {overlay && <DialogOverlay />}
    <DialogPrimitive.Content
      ref={ref}
      style={{ zIndex: "var(--fanvue-ui-portal-z-index, 50)", ...style }}
      className={cn(
        // Base
        "fixed flex flex-col overflow-hidden bg-surface-modal shadow-lifted focus:outline-none",
        // Mobile: bottom sheet
        "inset-x-0 bottom-0 max-h-[85vh] w-full rounded-t-3xl",
        // Animation (shared)
        "data-[state=open]:fade-in-0 data-[state=open]:animate-in",
        "data-[state=closed]:fade-out-0 data-[state=closed]:animate-out",
        // Mobile: slide up from bottom
        "data-[state=open]:slide-in-from-bottom-full",
        "data-[state=closed]:slide-out-to-bottom-full",
        // Desktop: centered dialog
        "sm:inset-auto sm:top-1/2 sm:left-1/2 sm:max-h-[85vh] sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-3xl",
        // Desktop: scale in/out (cancel mobile slide)
        "sm:data-[state=open]:slide-in-from-bottom-0 sm:data-[state=open]:zoom-in-95",
        "sm:data-[state=closed]:slide-out-to-bottom-0 sm:data-[state=closed]:zoom-out-95",
        // Duration
        "duration-200",
        // Size
        SIZE_CLASSES[size],
        className,
      )}
      {...props}
    >
      {children}
    </DialogPrimitive.Content>
  </DialogPrimitive.Portal>
));
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
const HEADER_ICON_BTN =
  "flex shrink-0 cursor-pointer items-center justify-center rounded-full p-1.5 text-foreground-default hover:bg-neutral-100 dark:hover:bg-neutral-800 focus-visible:shadow-focus-ring focus-visible:outline-none disabled:opacity-50 disabled:cursor-not-allowed";

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
        className={cn("flex h-16 shrink-0 items-center gap-2 px-6 py-4", className)}
        {...props}
      >
        {shouldShowBack && (
          <button
            type="button"
            onClick={onBack}
            disabled={!onBack}
            className={HEADER_ICON_BTN}
            aria-label={backLabel}
          >
            <ArrowLeftIcon className="size-5" />
          </button>
        )}
        <div className="min-w-0 flex-1">{children}</div>
        {showClose && (
          <DialogPrimitive.Close className={HEADER_ICON_BTN} aria-label={closeLabel}>
            <CloseIcon className="size-5" />
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
    className={cn("typography-bold-heading-xs truncate text-foreground-default", className)}
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
    className={cn("typography-regular-body-lg text-foreground-secondary", className)}
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
    <div ref={ref} className={cn("flex-1 overflow-y-auto px-6 py-4", className)} {...props} />
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
      className={cn(
        "flex shrink-0 items-center gap-3 px-6 pt-3 pb-6",
        "[&>*]:min-w-0 [&>*]:flex-1",
        className,
      )}
      {...props}
    />
  ),
);
DialogFooter.displayName = "DialogFooter";
