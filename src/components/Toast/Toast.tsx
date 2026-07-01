import * as ToastPrimitive from "@radix-ui/react-toast";
import * as React from "react";
import { cn } from "../../utils/cn";
import { Avatar } from "../Avatar/Avatar";
import { Button } from "../Button/Button";
import { CloseIcon } from "../Icons/CloseIcon";
import { ErrorIcon } from "../Icons/ErrorIcon";
import { InfoIcon } from "../Icons/InfoIcon";
import { SuccessIcon } from "../Icons/SuccessIcon";
import { WarningIcon } from "../Icons/WarningIcon";

/** Visual/semantic variant of the toast notification. */
export type ToastVariant = "info" | "warning" | "success" | "error" | "messageToast";

export interface ToastProps
  extends Omit<Omit<React.ComponentPropsWithoutRef<typeof ToastPrimitive.Root>, "type">, "title"> {
  /** Visual/semantic variant of the toast. @default "info" */
  variant?: ToastVariant;
  /** Title text displayed in bold at the top of the toast. */
  title?: string;
  /** Description or body content displayed below the title. */
  description?: React.ReactNode;
  /** Label for the optional action button. @default "Action" */
  actionLabel?: string;
  /** Click handler for the action button. When provided, the action button is rendered. */
  onActionClick?: () => void;
  /** Whether to show the close button. @default true */
  showClose?: boolean;
  /** Accessible label for the close button. @default "Close notification" */
  closeLabel?: string;
  /** Avatar image URL (used by the `messageToast` variant). */
  avatarSrc?: string;
  /** Alt text for the avatar image. */
  avatarAlt?: string;
  /** Fallback content for the avatar (e.g. initials). */
  avatarFallback?: string;
}

/** Props for the {@link ToastProvider}. Wraps Radix `Toast.Provider`. */
export interface ToastProviderProps extends ToastPrimitive.ToastProviderProps {}
/** Props for the {@link ToastViewport}. Controls where toasts are rendered on screen. */
export interface ToastViewportProps
  extends React.ComponentPropsWithoutRef<typeof ToastPrimitive.Viewport> {}

/** Provides toast context. Wrap your application (or a subtree) with this provider. */
export const ToastProvider: React.FC<ToastProviderProps> = ToastPrimitive.Provider;

/** Fixed-position container that renders active toasts. Place once at the root of your app. */
export const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitive.Viewport>,
  ToastViewportProps
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Viewport
    ref={ref}
    className={cn(
      "pointer-events-none fixed right-0 bottom-0 z-100 flex max-h-screen w-full flex-col-reverse gap-3 p-4 md:max-w-[420px]",
      className,
    )}
    {...props}
  />
));

ToastViewport.displayName = "ToastViewport";

const VariantIcon = ({ variant }: { variant: ToastVariant }) => {
  switch (variant) {
    case "info":
      return <InfoIcon size={16} filled className="text-alerts-toast-icon-info" />;
    case "warning":
      return <WarningIcon size={16} filled className="text-alerts-toast-icon-warning" />;
    case "success":
      return <SuccessIcon className="size-4 text-alerts-toast-icon-success" />;
    case "error":
      return <ErrorIcon className="size-4 text-alerts-toast-icon-error" />;
  }
};

/**
 * A dismissible notification that appears temporarily. Supports `info`,
 * `warning`, `success`, `error`, and `messageToast` variants with optional
 * action button, close control, and avatar.
 *
 * Use inside a {@link ToastProvider} with a {@link ToastViewport}.
 *
 * @example
 * ```tsx
 * <Toast variant="success" title="Saved" description="Your changes are live." />
 * ```
 */
export const Toast = React.forwardRef<React.ComponentRef<typeof ToastPrimitive.Root>, ToastProps>(
  (
    {
      className,
      variant = "info",
      title,
      description,
      actionLabel,
      onActionClick,
      showClose = true,
      closeLabel = "Close notification",
      avatarSrc,
      avatarAlt,
      avatarFallback,
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <ToastPrimitive.Root
        ref={ref}
        data-testid="toast"
        className={cn(
          "group pointer-events-auto relative flex w-full items-start gap-6 overflow-hidden rounded-md border-none bg-surface-primary-inverted py-3 pr-3 pl-4 text-content-primary-inverted shadow-md transition-all",
          "data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-bottom-full data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-(--radix-toast-swipe-end-x) data-[swipe=move]:translate-x-(--radix-toast-swipe-move-x) data-[state=closed]:animate-out data-[state=open]:animate-in data-[swipe=end]:animate-out data-[swipe=move]:transition-none",
          className,
        )}
        {...props}
      >
        <div className="flex min-w-0 flex-1 items-start gap-3 py-1 pr-1">
          <div className="flex shrink-0 items-center pt-px">
            {variant === "messageToast" ? (
              avatarSrc && <Avatar src={avatarSrc} alt={avatarAlt} fallback={avatarFallback} />
            ) : (
              <VariantIcon variant={variant} />
            )}
          </div>
          <div className="flex min-w-0 flex-1 flex-col items-start gap-4">
            <div className="flex w-full flex-col items-start gap-1">
              {title && (
                <ToastPrimitive.Title className="typography-body-small-14px-semibold">
                  {title}
                </ToastPrimitive.Title>
              )}
              {description && (
                <ToastPrimitive.Description className="typography-body-small-14px-regular">
                  {description}
                </ToastPrimitive.Description>
              )}
              {children}
            </div>
            {onActionClick && (
              <Button variant="outline" negative size="32" onClick={onActionClick}>
                {actionLabel ?? "Action"}
              </Button>
            )}
          </div>
        </div>
        {showClose && (
          <ToastPrimitive.Close asChild>
            <button
              type="button"
              aria-label={closeLabel}
              className="flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-xs bg-buttons-secondary-negative-default text-content-primary-inverted transition-colors hover:bg-buttons-secondary-negative-hover focus-visible:shadow-focus-ring focus-visible:outline-none"
            >
              <CloseIcon size={16} aria-hidden="true" />
            </button>
          </ToastPrimitive.Close>
        )}
      </ToastPrimitive.Root>
    );
  },
);

Toast.displayName = "Toast";
