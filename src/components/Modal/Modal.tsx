import * as DialogPrimitive from "@radix-ui/react-dialog";
import * as React from "react";
import { cn } from "../../utils/cn";
import {
  Dialog,
  DialogClose,
  DialogContent,
  type DialogContentProps,
  DialogDescription,
  type DialogDescriptionProps,
  DialogFooter,
  DialogOverlay,
  type DialogOverlayProps,
  DialogTitle,
  type DialogTitleProps,
  DialogTrigger,
  type DialogTriggerProps,
} from "../Dialog/Dialog";
import { IconButton } from "../IconButton/IconButton";
import { CloseIcon } from "../Icons/CloseIcon";

/**
 * Root for the V2 modal. Manages open/close state.
 *
 * Use this for action sheets and selection lists. Confirmation copy with
 * footer buttons belongs in {@link Dialog}.
 */
export const Modal = Dialog;

/** Props for the {@link Modal} root component. */
export type ModalProps = React.ComponentPropsWithoutRef<typeof DialogPrimitive.Root>;

/**
 * The element that opens the modal when clicked.
 *
 * On touch / pen, a press-and-release that crosses a small movement threshold
 * is treated as a drag and the resulting synthetic click is suppressed.
 */
export const ModalTrigger = DialogTrigger;

/** Props for the {@link ModalTrigger} component. */
export type ModalTriggerProps = DialogTriggerProps;

/** Convenience alias for Radix `Dialog.Close`. Closes the modal when chosen. */
export const ModalClose = DialogClose;

/** Props for the {@link ModalClose} component. */
export type ModalCloseProps = React.ComponentPropsWithoutRef<typeof DialogPrimitive.Close>;

/**
 * Semi-transparent backdrop rendered behind the modal.
 * Rendered by {@link ModalContent}; portaled to `document.body` when {@link ModalContent} `portal` is true.
 */
export const ModalOverlay = DialogOverlay;

/** Props for the {@link ModalOverlay} component. */
export type ModalOverlayProps = DialogOverlayProps;

export interface ModalContentProps
  extends Omit<DialogContentProps, "mobilePresentation" | "showMobileHandle"> {
  /**
   * Mobile presentation below `sm`. From `sm` up both render as a centered card.
   *
   * - `"menu"` — floating card inset 16px from the sides and bottom, for action and selection lists
   * - `"sheet"` — edge-to-edge bottom sheet with a pull handle, for forms with a {@link ModalFooter}
   *
   * @default "menu"
   */
  variant?: "menu" | "sheet";
}

/**
 * The V2 modal panel, built on {@link DialogContent}'s bottom-sheet/centered-card
 * presentation rather than a second copy of it. Radius and padding come from
 * the modal theme tokens (`--color-modal-radius`, `--color-modal-padding-mobile`,
 * `--color-modal-padding-desktop`), overriding Dialog's own card sizing so
 * light and dark stay in sync.
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
  React.ComponentRef<typeof DialogContent>,
  ModalContentProps
>(({ className, variant = "menu", ...props }, ref) => (
  <DialogContent
    ref={ref}
    mobilePresentation={variant === "sheet" ? "sheet" : "card"}
    showMobileHandle={variant === "sheet"}
    className={cn(
      "gap-2 p-[var(--color-modal-padding-mobile)] sm:rounded-[var(--color-modal-radius)] sm:p-[var(--color-modal-padding-desktop)]",
      variant === "sheet"
        ? cn(
            "rounded-t-[var(--color-modal-radius)] pt-3",
            "pb-[calc(var(--color-modal-padding-mobile)+env(safe-area-inset-bottom,0px))]",
          )
        : cn(
            "top-auto bottom-[calc(1rem+env(safe-area-inset-bottom,0px))] translate-y-0 rounded-[var(--color-modal-radius)]",
            "sm:top-1/2 sm:bottom-auto sm:-translate-y-1/2",
          ),
      className,
    )}
    {...props}
  />
));
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

/**
 * Accessible title for the modal. Render inside {@link ModalHeader}
 * or directly within {@link ModalContent}.
 */
export const ModalTitle = DialogTitle;

/** Props for the {@link ModalTitle} component. */
export type ModalTitleProps = DialogTitleProps;

/** Accessible description for the modal. Rendered as secondary text. */
export const ModalDescription = DialogDescription;

/** Props for the {@link ModalDescription} component. */
export type ModalDescriptionProps = DialogDescriptionProps;

export interface ModalBodyProps extends React.HTMLAttributes<HTMLDivElement> {}

/**
 * Action list (or other content) under the header.
 *
 * Unlike {@link DialogBody}, this carries no padding of its own: ModalContent's
 * own padding already frames the whole panel, and stacking a second inset here
 * is exactly the bug that doubled the mobile card's bottom gap on Dialog
 * (ENG-14961) — see Dialog.tsx's DialogBody for the fix.
 */
export const ModalBody = React.forwardRef<HTMLDivElement, ModalBodyProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-1 flex-col overflow-y-auto", className)} {...props} />
  ),
);
ModalBody.displayName = "ModalBody";

export interface ModalFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

/**
 * Action row pinned under a scrolling {@link ModalBody}, e.g. Reset and Apply.
 * Children share the row equally.
 */
export const ModalFooter = React.forwardRef<HTMLDivElement, ModalFooterProps>(
  ({ className, ...props }, ref) => (
    <DialogFooter ref={ref} className={cn("pt-2", className)} {...props} />
  ),
);
ModalFooter.displayName = "ModalFooter";

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
