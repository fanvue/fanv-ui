import * as React from "react";
import { cn } from "../../utils/cn";

export type AlertVariant = "info" | "success" | "warning" | "error";

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Visual style variant of the alert (matches Figma "Variant" property) */
  variant?: AlertVariant;
  /** Optional title text (bold) */
  title?: string;
  /** Left icon element */
  icon?: React.ReactNode;
  /** Show close button */
  closable?: boolean;
  /** Callback when close button is clicked */
  onClose?: () => void;
}

export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  (
    { className, variant = "info", title, icon, closable = false, onClose, children, ...props },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        role="alert"
        data-testid="alert"
        className={cn(
          "grid gap-x-3 rounded-lg p-4 text-sm leading-[18px]",
          icon && closable && "grid-cols-[auto_1fr_auto]",
          icon && !closable && "grid-cols-[auto_1fr]",
          !icon && closable && "grid-cols-[1fr_auto]",
          !icon && !closable && "grid-cols-[1fr]",
          title && children ? "items-start" : "items-center",
          variant === "info" && "bg-info-50 text-info-500",
          variant === "success" && "bg-success-50 text-success-500",
          variant === "warning" && "bg-warning-50 text-warning-500",
          variant === "error" && "bg-error-50 text-error-500",
          className,
        )}
        {...props}
      >
        {icon && (
          <span className="flex shrink-0 items-start" aria-hidden="true">
            {icon}
          </span>
        )}

        <div className="flex min-w-0 flex-col gap-2">
          {title && <div className="font-semibold text-body-100">{title}</div>}
          <div className="font-normal text-body-200">{children}</div>
        </div>

        {closable && (
          <button
            type="button"
            onClick={onClose}
            className="flex shrink-0 cursor-pointer touch-manipulation items-start justify-center self-start rounded-full p-1 text-body-100 transition-all duration-150 hover:scale-110 hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-body-100 focus-visible:ring-offset-2"
            aria-label="Close alert"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="size-5"
              aria-hidden="true"
            >
              <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
            </svg>
          </button>
        )}
      </div>
    );
  },
);

Alert.displayName = "Alert";
