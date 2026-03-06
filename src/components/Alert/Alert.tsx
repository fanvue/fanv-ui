import * as React from "react";
import { cn } from "../../utils/cn";
import { Button } from "../Button/Button";
import { CheckCircleIcon } from "../Icons/CheckCircleIcon";
import { CrossIcon } from "../Icons/CrossIcon";
import { ErrorCircleIcon } from "../Icons/ErrorCircleIcon";
import { InfoCircleIcon } from "../Icons/InfoCircleIcon";
import { WarningTriangleIcon } from "../Icons/WarningTriangleIcon";

/** Visual style variant of the alert. */
export type AlertVariant = "info" | "success" | "warning" | "error";

const DEFAULT_ICONS: Record<AlertVariant, React.ReactNode> = {
  info: <InfoCircleIcon />,
  success: <CheckCircleIcon />,
  warning: <WarningTriangleIcon />,
  error: <ErrorCircleIcon />,
};

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Visual style variant of the alert. @default "info" */
  variant?: AlertVariant;
  /** Optional title text displayed in bold above the description. */
  title?: string;
  /** Custom icon override. Pass `null` to hide the icon entirely. Each variant shows a default icon when left `undefined`. */
  icon?: React.ReactNode | null;
  /** Whether to show the close button. @default false */
  closable?: boolean;
  /** Callback fired when the close button is clicked. */
  onClose?: () => void;
  /** Accessible label for the close button. @default "Close alert" */
  closeLabel?: string;
}

const CLOSE_BUTTON_CLASSES: Record<AlertVariant, string> = {
  info: "hover:bg-info-default active:bg-info-default text-info-default motion-safe:transition-colors motion-safe:duration-150",
  success:
    "hover:bg-success-default active:bg-success-default text-success-default motion-safe:transition-colors motion-safe:duration-150",
  warning:
    "hover:bg-warning-default active:bg-warning-default text-warning-default motion-safe:transition-colors motion-safe:duration-150",
  error:
    "hover:bg-error-default active:bg-error-default text-error-default motion-safe:transition-colors motion-safe:duration-150",
};

/**
 * Displays a contextual feedback message to the user.
 *
 * Supports `info`, `success`, `warning`, and `error` variants with a default
 * icon per variant, optional title, description, and dismiss button.
 *
 * Each variant renders a default icon automatically. Pass a custom `icon` to
 * override, or `icon={null}` to hide the icon entirely.
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
    const resolvedIcon = icon === null ? null : (icon ?? DEFAULT_ICONS[variant]);

    return (
      <div
        ref={ref}
        role="alert"
        data-testid="alert"
        className={cn(
          "grid gap-x-3 rounded-lg p-4 text-sm leading-[18px]",
          resolvedIcon && closable && "grid-cols-[auto_1fr_auto]",
          resolvedIcon && !closable && "grid-cols-[auto_1fr]",
          !resolvedIcon && closable && "grid-cols-[1fr_auto]",
          !resolvedIcon && !closable && "grid-cols-[1fr]",
          title && children ? "items-start" : "items-center",
          variant === "info" && "bg-info-background text-info-default",
          variant === "success" && "bg-success-background text-success-default",
          variant === "warning" && "bg-warning-background text-warning-default",
          variant === "error" && "bg-error-background text-error-default",
          className,
        )}
        {...props}
      >
        {resolvedIcon && (
          <span className="flex shrink-0 items-start" aria-hidden="true">
            {resolvedIcon}
          </span>
        )}

        <div className="flex min-w-0 flex-col gap-2">
          {title && (
            <div className="typography-semibold-body-md text-foreground-default">{title}</div>
          )}
          <div className="typography-regular-body-md text-foreground-secondary">{children}</div>
        </div>

        {closable && (
          <Button
            variant="tertiary"
            size="24"
            onClick={onClose}
            className={cn("self-start px-0", CLOSE_BUTTON_CLASSES[variant])}
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
