import * as ToastPrimitive from "@radix-ui/react-toast";
import * as React from "react";
import { cn } from "../../utils/cn";

const toastVariants = {
  state: {
    Info: "border-info-500 bg-info-50 text-body-100",
    Warning: "border-warning-500 bg-warning-50 text-body-100",
    Success: "border-success-500 bg-success-50 text-body-100",
    Error: "border-error-500 bg-error-50 text-body-100",
  },
  iconColor: {
    Info: "text-info-500",
    Warning: "text-warning-500",
    Success: "text-success-500",
    Error: "text-error-500",
  },
} as const;

export type ToastState = keyof typeof toastVariants.state;

export interface ToastProps
  extends Omit<React.ComponentPropsWithoutRef<typeof ToastPrimitive.Root>, "type"> {
  /** Visual state variant of the toast */
  state?: ToastState;
  /** Toast title */
  title?: React.ReactNode;
  /** Toast description/message */
  description?: React.ReactNode;
  /** Action button element */
  action?: React.ReactNode;
  /** Show close button */
  showClose?: boolean;
}

export interface ToastProviderProps extends ToastPrimitive.ToastProviderProps {}
export interface ToastViewportProps
  extends React.ComponentPropsWithoutRef<typeof ToastPrimitive.Viewport> {}

export const ToastProvider = ToastPrimitive.Provider;

export const ToastViewport = React.forwardRef<
  React.ComponentRef<typeof ToastPrimitive.Viewport>,
  ToastViewportProps
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Viewport
    ref={ref}
    className={cn(
      "fixed top-0 right-0 z-[100] flex max-h-screen w-full flex-col-reverse gap-3 p-4 sm:top-auto sm:right-0 sm:bottom-0 sm:flex-col md:max-w-[420px]",
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
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className={iconClass}
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z"
            clipRule="evenodd"
          />
        </svg>
      );
    case "Warning":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className={iconClass}
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z"
            clipRule="evenodd"
          />
        </svg>
      );
    case "Success":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className={iconClass}
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
            clipRule="evenodd"
          />
        </svg>
      );
    case "Error":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className={iconClass}
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z"
            clipRule="evenodd"
          />
        </svg>
      );
  }
};

export const Toast = React.forwardRef<React.ComponentRef<typeof ToastPrimitive.Root>, ToastProps>(
  (
    { className, state = "Info", title, description, action, showClose = true, children, ...props },
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
          "data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-bottom-full data-[state=open]:sm:slide-in-from-top-full data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[state=closed]:animate-out data-[state=open]:animate-in data-[swipe=end]:animate-out data-[swipe=move]:transition-none",
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
