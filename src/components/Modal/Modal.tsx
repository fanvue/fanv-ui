import * as DialogPrimitive from "@radix-ui/react-dialog";
import * as React from "react";
import { cn } from "../../utils/cn";
import { useSuppressClickAfterDrag } from "../../utils/useSuppressClickAfterDrag";
import { IconButton } from "../IconButton/IconButton";
import { CloseIcon } from "../Icons/CloseIcon";

/** Props for the {@link Modal} root component. */
export interface ModalProps extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Root> {
  /** Controlled open state. When provided, you must also supply `onOpenChange`. */
  open?: boolean;
  /** Called when the open state changes. Required when `open` is controlled. */
  onOpenChange?: (open: boolean) => void;
  /** The open state of the modal when it is initially rendered (uncontrolled). */
  defaultOpen?: boolean;
}

/**
 * Root for the V2 modal. Manages open/close state.
 *
 * Use this for action sheets and selection lists. Confirmation copy with
 * footer buttons belongs in {@link Dialog}.
 */
export const Modal = DialogPrimitive.Root;

/** Props for the {@link ModalTrigger} component. */
export type ModalTriggerProps = React.ComponentPropsWithoutRef<typeof DialogPrimitive.Trigger>;

/**
 * The element that opens the modal when clicked.
 *
 * On touch / pen, a press-and-release that crosses a small movement threshold
 * is treated as a drag and the resulting synthetic click is suppressed.
 */
export const ModalTrigger = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Trigger>,
  ModalTriggerProps
>((props, ref) => <DialogPrimitive.Trigger ref={ref} {...useSuppressClickAfterDrag(props)} />);
ModalTrigger.displayName = "ModalTrigger";

/** Convenience alias for Radix `Dialog.Close`. Closes the modal when clicked. */
export const ModalClose = DialogPrimitive.Close;

/** Props for the {@link ModalClose} component. */
export type ModalCloseProps = React.ComponentPropsWithoutRef<typeof DialogPrimitive.Close>;

export interface ModalOverlayProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay> {}

/**
 * Semi-transparent backdrop rendered behind the modal.
 * Rendered by {@link ModalContent}; portaled to `document.body` when {@link ModalContent} `portal` is true.
 */
export const ModalOverlay = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Overlay>,
  ModalOverlayProps
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
ModalOverlay.displayName = "ModalOverlay";

export interface ModalContentProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> {
  /**
   * Width preset from the `sm` breakpoint up.
   * - `"sm"` — 400px max-width
   * - `"md"` — 440px max-width (default)
   * - `"lg"` — 600px max-width
   *
   * @default "md"
   */
  size?: "sm" | "md" | "lg";
  /** When true, renders overlay automatically. @default true */
  overlay?: boolean;
  /**
   * When true, teleports overlay and panel to `document.body`.
   * When false, renders inline in the React tree.
   * @default true
   */
  portal?: boolean;
  /** Props forwarded to the default {@link ModalOverlay} when `overlay` is `true`. */
  overlayProps?: ModalOverlayProps;
}

const SIZE_CLASSES: Record<NonNullable<ModalContentProps["size"]>, string> = {
  sm: "sm:max-w-[400px]",
  md: "sm:max-w-[440px]",
  lg: "sm:max-w-[600px]",
};

/**
 * The V2 modal panel.
 *
 * Below `sm` it is a bottom sheet. From `sm` up it is a centered card. Radius
 * and padding come from the modal theme tokens (`--color-modal-radius`,
 * `--color-modal-padding-mobile`, `--color-modal-padding-desktop`) so light
 * and dark stay in sync.
 *
 * @example
 * ```tsx
 * <Modal>
 *   <ModalTrigger asChild>
 *     <Button>Open</Button>
 *   </ModalTrigger>
 *   <ModalContent>
 *     <ModalHeader>
 *       <ModalTitle>Top Spenders</ModalTitle>
 *     </ModalHeader>
 *     <ModalBody>
 *       <ModalItem>Message List</ModalItem>
 *     </ModalBody>
 *   </ModalContent>
 * </Modal>
 * ```
 */
export const ModalContent = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Content>,
  ModalContentProps
>(
  (
    {
      className,
      children,
      size = "md",
      overlay = true,
      portal = true,
      overlayProps,
      style,
      onOpenAutoFocus,
      ...props
    },
    ref,
  ) => {
    const content = (
      <>
        {overlay && <ModalOverlay {...overlayProps} />}
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
            "fixed flex flex-col gap-2 overflow-hidden border border-modal-stroke bg-modal-background shadow-blur-menu backdrop-blur-[4px] focus:outline-none",
            "rounded-t-[var(--color-modal-radius)] p-[var(--color-modal-padding-mobile)]",
            "pb-[calc(var(--color-modal-padding-mobile)+env(safe-area-inset-bottom,0px))]",
            "dialog-max-h-dynamic inset-x-0 bottom-0 w-full",
            "data-[state=open]:fade-in-0 data-[state=open]:slide-in-from-bottom-full data-[state=open]:animate-in",
            "data-[state=closed]:fade-out-0 data-[state=closed]:slide-out-to-bottom-full data-[state=closed]:animate-out",
            "sm:data-[state=open]:slide-in-from-bottom-0 sm:data-[state=open]:zoom-in-95",
            "sm:data-[state=closed]:slide-out-to-bottom-0 sm:data-[state=closed]:zoom-out-95",
            "sm:dialog-max-h-dynamic sm:inset-auto sm:top-1/2 sm:bottom-auto sm:left-1/2 sm:w-full sm:-translate-x-1/2 sm:-translate-y-1/2",
            "sm:rounded-[var(--color-modal-radius)] sm:p-[var(--color-modal-padding-desktop)]",
            "duration-200",
            SIZE_CLASSES[size],
            className,
          )}
          {...props}
        >
          {children}
        </DialogPrimitive.Content>
      </>
    );

    return portal ? <DialogPrimitive.Portal>{content}</DialogPrimitive.Portal> : content;
  },
);
ModalContent.displayName = "ModalContent";

export interface ModalHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Show the close (X) button in the header. @default true */
  showClose?: boolean;
  /** Accessible label for the close button. @default "Close" */
  closeLabel?: string;
}

/**
 * Header bar for the modal. Title on the left, circular close button on the right.
 *
 * @example
 * ```tsx
 * <ModalHeader>
 *   <ModalTitle>Top Spenders</ModalTitle>
 * </ModalHeader>
 * ```
 */
export const ModalHeader = React.forwardRef<HTMLDivElement, ModalHeaderProps>(
  ({ className, children, showClose = true, closeLabel = "Close", ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex shrink-0 items-center justify-end gap-4", className)}
      {...props}
    >
      <div className="flex min-w-0 flex-1 flex-col">{children}</div>
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
  ),
);
ModalHeader.displayName = "ModalHeader";

/** Props for the {@link ModalTitle} component. */
export type ModalTitleProps = React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>;

/**
 * Accessible title for the modal. Render inside {@link ModalHeader}
 * or directly within {@link ModalContent}.
 */
export const ModalTitle = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Title>,
  ModalTitleProps
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn("typography-header-heading-xs text-content-primary", className)}
    {...props}
  />
));
ModalTitle.displayName = "ModalTitle";

/** Props for the {@link ModalDescription} component. */
export type ModalDescriptionProps = React.ComponentPropsWithoutRef<
  typeof DialogPrimitive.Description
>;

/** Accessible description for the modal. Rendered as secondary text. */
export const ModalDescription = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Description>,
  ModalDescriptionProps
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("typography-body-default-16px-regular text-content-secondary", className)}
    {...props}
  />
));
ModalDescription.displayName = "ModalDescription";

export interface ModalBodyProps extends React.HTMLAttributes<HTMLDivElement> {}

/** Action list (or other content) under the header. */
export const ModalBody = React.forwardRef<HTMLDivElement, ModalBodyProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-1 flex-col overflow-y-auto", className)} {...props} />
  ),
);
ModalBody.displayName = "ModalBody";

/**
 * Props for {@link ModalItem}, a V2 modal action row.
 *
 * Standard is the default. `selected` marks the current value. `disabled` greys
 * the row when the action is unavailable. `destructive` is the error treatment
 * for irreversible actions such as delete.
 */
export interface ModalItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Icon rendered before the label. */
  leadingIcon?: React.ReactNode;
  /** Icon rendered after the label. */
  trailingIcon?: React.ReactNode;
  /** Applies the error treatment. Use only for irreversible actions. @default false */
  destructive?: boolean;
  /** Marks the row as the current selection. @default false */
  selected?: boolean;
  /** Close the modal when the row is chosen. @default true */
  closeOnSelect?: boolean;
}

/**
 * A single action row inside a {@link Modal}.
 *
 * 40px min height, 12px horizontal padding, 16px label, optional leading icon.
 * Hover, selected, disabled, and error follow the V2 modal item states.
 *
 * @example
 * ```tsx
 * <ModalItem leadingIcon={<EditIcon size={16} filled />}>Edit List</ModalItem>
 * <ModalItem destructive leadingIcon={<TrashBinIcon className="size-4" />}>
 *   Delete List
 * </ModalItem>
 * ```
 */
export const ModalItem = React.forwardRef<HTMLButtonElement, ModalItemProps>(
  (
    {
      className,
      children,
      leadingIcon,
      trailingIcon,
      destructive = false,
      selected = false,
      closeOnSelect = true,
      disabled,
      type = "button",
      ...props
    },
    ref,
  ) => {
    const item = (
      <button
        ref={ref}
        type={type}
        disabled={disabled}
        aria-pressed={selected || undefined}
        className={cn(
          "flex min-h-10 w-full cursor-pointer items-center gap-2 rounded-sm px-3 py-2 text-start outline-none",
          "typography-body-default-16px-regular text-content-primary",
          "hover:bg-neutral-alphas-50 focus-visible:bg-neutral-alphas-50",
          "disabled:cursor-not-allowed disabled:text-content-disabled disabled:hover:bg-transparent",
          selected && "bg-neutral-alphas-100",
          destructive && "text-error-content",
          className,
        )}
        {...props}
      >
        {leadingIcon ? (
          <span className="inline-flex size-4 shrink-0 items-center justify-center">
            {leadingIcon}
          </span>
        ) : null}
        <span className="min-w-0 flex-1">{children}</span>
        {trailingIcon ? (
          <span className="inline-flex size-4 shrink-0 items-center justify-center">
            {trailingIcon}
          </span>
        ) : null}
      </button>
    );

    if (closeOnSelect && !disabled) {
      return <DialogPrimitive.Close asChild>{item}</DialogPrimitive.Close>;
    }

    return item;
  },
);
ModalItem.displayName = "ModalItem";
