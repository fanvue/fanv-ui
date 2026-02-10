import * as React from "react";
import { cn } from "../../utils/cn";
import { Button } from "../Button/Button";
import { CrossIcon } from "../Icons/CrossIcon";

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
          {title && <div className="typography-body-2-semibold text-body-100">{title}</div>}
          <div className="typography-body-2-regular text-body-200">{children}</div>
        </div>

        {closable && (
          <Button
            variant="tertiary"
            size="24"
            onClick={onClose}
            className="self-start"
            aria-label="Close alert"
          >
            <CrossIcon />
          </Button>
        )}
      </div>
    );
  },
);

Alert.displayName = "Alert";
