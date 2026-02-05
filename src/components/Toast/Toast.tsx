import * as ToastPrimitive from "@radix-ui/react-toast";
import * as React from "react";
import { cn } from "../../utils/cn";
import { ErrorIcon } from "../Icons/Error";
import { InfoIcon } from "../Icons/Info";
import { SuccessIcon } from "../Icons/Success";
import { WarningIcon } from "../Icons/Warning";

const toastVariants = {
  state: {
    Info: "border-none text-body-100",
    Warning: "border-none text-body-100",
    Success: "border-none text-body-100",
    Error: "border-none text-body-100",
  },
  iconColor: {
    Info: "text-info-500",
    Warning: "text-warning-500",
    Success: "text-success-500",
    Error: "text-error-500",
  },
} as const;

export type ToastState = keyof typeof toastVariants.state;

// Override "title" prop to allow React.ReactNode instead of string | undefined
export interface ToastProps
  extends Omit<Omit<React.ComponentPropsWithoutRef<typeof ToastPrimitive.Root>, "type">, "title"> {
  /** Visual state variant of the toast */
  state?: ToastState;
  /** Toast title */
  title?: string;
  /** Toast description/message */
  description?: React.ReactNode;
  /** Action button element */
  action?: React.ReactNode;
  /** Show close button */
  showClose?: boolean;
  /** Avatar element */
  avatar?: React.ReactNode;
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

const StateIcon = ({ state }: { state: ToastState }) => {
  const iconClass = cn("h-5 w-5 shrink-0", toastVariants.iconColor[state]);

  switch (state) {
    case "Info":
      return <InfoIcon className={iconClass} />;
    case "Warning":
      return <WarningIcon className={iconClass} />;
    case "Success":
      return <SuccessIcon className={iconClass} />;
    case "Error":
      return <ErrorIcon className={iconClass} />;
  }
};

export const Toast = React.forwardRef<React.ComponentRef<typeof ToastPrimitive.Root>, ToastProps>(
  (
    {
      className,
      state = "Info",
      title,
      description,
      action,
      showClose = true,
      avatar,
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
          "group pointer-events-auto relative flex w-full items-start gap-3 overflow-hidden rounded-lg border-l-4 p-4 shadow-lg transition-all",
          // Dark mode
          "dark:border-opacity-100",
          // Animation
          "data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-bottom-full data-[state=open]:sm:slide-in-from-top-full data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-(--radix-toast-swipe-end-x) data-[swipe=move]:translate-x-(--radix-toast-swipe-move-x) data-[state=closed]:animate-out data-[state=open]:animate-in data-[swipe=end]:animate-out data-[swipe=move]:transition-none",
          // Variant styles
          toastVariants.state[state],
          // Manual CSS overrides
          className,
        )}
        {...props}
      >
        <StateIcon state={state} />
        <div className="flex flex-1 flex-col gap-1">
          {title && (
            <ToastPrimitive.Title className="font-semibold text-sm leading-normal">
              {title}
            </ToastPrimitive.Title>
          )}
          {description && (
            <ToastPrimitive.Description className="font-normal text-sm leading-normal opacity-90">
              {description}
            </ToastPrimitive.Description>
          )}
          {children}
        </div>
        {action && <ToastPrimitive.Action altText="Action">{action}</ToastPrimitive.Action>}
        {showClose && (
          <ToastPrimitive.Close className="absolute top-2 right-2 rounded-md p-1 opacity-70 transition-opacity hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-4 w-4"
              aria-hidden="true"
            >
              <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
            </svg>
            <span className="sr-only">Close</span>
          </ToastPrimitive.Close>
        )}
      </ToastPrimitive.Root>
    );
  },
);

Toast.displayName = "Toast";
