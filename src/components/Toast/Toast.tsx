import * as ToastPrimitive from "@radix-ui/react-toast";
import * as React from "react";
import { cn } from "../../utils/cn";
import { Avatar } from "../Avatar/Avatar";
import { Button } from "../Button/Button";
import { IconButton } from "../IconButton/IconButton";
import { CloseIcon } from "../Icons/Close";
import { ErrorIcon } from "../Icons/Error";
import { InfoIcon } from "../Icons/Info";
import { SuccessIcon } from "../Icons/Success";
import { WarningIcon } from "../Icons/Warning";

export enum toastVariants {
  info = "info",
  warning = "warning",
  success = "success",
  error = "error",
  messageToast = "messageToast",
}

export type ToastVariant = keyof typeof toastVariants;

// Override "title" prop to allow React.ReactNode instead of string | undefined
export interface ToastProps
  extends Omit<Omit<React.ComponentPropsWithoutRef<typeof ToastPrimitive.Root>, "type">, "title"> {
  /** Variant of the toast */
  variant?: ToastVariant;
  /** Toast title */
  title?: string;
  /** Toast description/message */
  description?: React.ReactNode;
  /** Action button label */
  actionLabel?: string;
  /** Action button click handler */
  onActionClick?: () => void;
  /** Show close button */
  showClose?: boolean;
  /** Avatar image source */
  avatarSrc?: string;
  /** Avatar alt text */
  avatarAlt?: string;
  /** Avatar fallback text */
  avatarFallback?: string;
}

export interface ToastProviderProps extends ToastPrimitive.ToastProviderProps {}
export interface ToastViewportProps
  extends React.ComponentPropsWithoutRef<typeof ToastPrimitive.Viewport> {}

export const ToastProvider: React.FC<ToastProviderProps> = ToastPrimitive.Provider;

export const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitive.Viewport>,
  ToastViewportProps
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Viewport
    ref={ref}
    className={cn(
      "fixed top-0 right-0 z-100 flex max-h-screen w-full flex-col-reverse gap-3 p-4 sm:top-auto sm:right-0 sm:bottom-0 sm:flex-col md:max-w-[420px]",
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
          "data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-bottom-full data-[state=open]:sm:slide-in-from-top-full data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-(--radix-toast-swipe-end-x) data-[swipe=move]:translate-x-(--radix-toast-swipe-move-x) data-[state=closed]:animate-out data-[state=open]:animate-in data-[swipe=end]:animate-out data-[swipe=move]:transition-none",
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
              <ToastPrimitive.Title className="font-semibold text-sm leading-normal">
                {title}
              </ToastPrimitive.Title>
            )}
            {description && (
              <ToastPrimitive.Description className="mt-1 font-normal text-sm leading-normal opacity-90">
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
              aria-label="Close notification"
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
