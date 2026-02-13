import * as ToastPrimitive from "@radix-ui/react-toast";
import * as React from "react";
import { cn } from "../../utils/cn";
import { Avatar } from "../Avatar/Avatar";
import { Button } from "../Button/Button";
import { IconButton } from "../IconButton/IconButton";
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
      return <InfoIcon className="size-5 text-info-500" />;
    case "warning":
      return <WarningIcon className="size-5 text-warning-500" />;
    case "success":
      return <SuccessIcon className="size-5 text-success-500" />;
    case "error":
      return <ErrorIcon className="size-5 text-error-500" />;
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
          // Base styles
          "group pointer-events-auto relative flex w-full flex-col items-start gap-3 overflow-hidden rounded-lg border-none bg-background-solid p-4 text-background-inverse-solid shadow-lg transition-all",
          // Dark mode
          "dark:border-opacity-100",
          // Animation
          "data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-bottom-full data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-(--radix-toast-swipe-end-x) data-[swipe=move]:translate-x-(--radix-toast-swipe-move-x) data-[state=closed]:animate-out data-[state=open]:animate-in data-[swipe=end]:animate-out data-[swipe=move]:transition-none",
          // Manual CSS overrides
          className,
        )}
        {...props}
      >
        <div className="flex w-full items-center gap-3">
          <div className="self-start">
            {variant === "messageToast" ? (
              avatarSrc && <Avatar src={avatarSrc} alt={avatarAlt} fallback={avatarFallback} />
            ) : (
              <VariantIcon variant={variant} />
            )}
          </div>
          <div className="flex flex-1 flex-col items-start">
            {title && (
              <ToastPrimitive.Title className="typography-body-2-semibold">
                {title}
              </ToastPrimitive.Title>
            )}
            {description && (
              <ToastPrimitive.Description className="typography-body-2-regular mt-1 opacity-90">
                {description}
              </ToastPrimitive.Description>
            )}
            {children}
            {onActionClick && (
              <Button
                variant="secondary"
                // These styles are basically inverted from the selected theme
                className="mt-4 border-body-400 text-body-400"
                size="32"
                onClick={onActionClick}
              >
                {actionLabel ?? "Action"}
              </Button>
            )}
          </div>
        </div>
        {showClose && (
          <ToastPrimitive.Close asChild>
            <IconButton
              icon={<CloseIcon />}
              aria-label={closeLabel}
              // same as the button above
              className="absolute top-2 right-2 text-body-300"
              variant="tertiary"
              size="24"
            />
          </ToastPrimitive.Close>
        )}
      </ToastPrimitive.Root>
    );
  },
);

Toast.displayName = "Toast";
