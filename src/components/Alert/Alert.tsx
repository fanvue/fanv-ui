import * as React from "react";
import { cn } from "../../utils/cn";
import { Button } from "../Button/Button";
import { CrossIcon } from "../Icons/CrossIcon";

/** Visual style variant of the alert. */
export type AlertVariant = "info" | "success" | "warning" | "error";

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Visual style variant of the alert. @default "info" */
  variant?: AlertVariant;
  /** Optional title text displayed in bold above the description. */
  title?: string;
  /** Icon element displayed at the leading edge of the alert. */
  icon?: React.ReactNode;
  /** Whether to show the close button. @default false */
  closable?: boolean;
  /** Callback fired when the close button is clicked. */
  onClose?: () => void;
  /** Accessible label for the close button. @default "Close alert" */
  closeLabel?: string;
}

const CLOSE_BUTTON_CLASSES: Record<AlertVariant, string> = {
  info: "hover:bg-info-500/10 text-info-500 motion-safe:transition-colors motion-safe:duration-150",
  success:
    "hover:bg-success-500/10 text-success-500 motion-safe:transition-colors motion-safe:duration-150",
  warning:
    "hover:bg-warning-500/10 text-warning-500 motion-safe:transition-colors motion-safe:duration-150",
  error:
    "hover:bg-error-500/10 text-error-500 motion-safe:transition-colors motion-safe:duration-150",
};

/**
 * Displays a contextual feedback message to the user.
 *
 * Supports `info`, `success`, `warning`, and `error` variants with an optional
 * icon, title, description, and dismiss button.
 *
 * @example
 * ```tsx
 * <Alert variant="success" title="Saved" closable onClose={handleClose}>
 *   Your changes have been saved.
 * </Alert>
 * ```
 */
export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  (
    {
      className,
      variant = "info",
      title,
      icon,
      closable = false,
      onClose,
      closeLabel = "Close alert",
      children,
      ...props
    },
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
            className={cn("self-start", CLOSE_BUTTON_CLASSES[variant])}
            aria-label={closeLabel}
          >
            <CrossIcon />
          </Button>
        )}
      </div>
    );
  },
);

Alert.displayName = "Alert";
