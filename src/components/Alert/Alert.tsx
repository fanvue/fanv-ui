import * as React from "react";
import { cn } from "../../utils/cn";
import { Button } from "../Button/Button";
import { CheckCircleIcon } from "../Icons/CheckCircleIcon";
import { CrossIcon } from "../Icons/CrossIcon";
import { ErrorCircleIcon } from "../Icons/ErrorCircleIcon";
import { InfoCircleIcon } from "../Icons/InfoCircleIcon";
import { WarningTriangleIcon } from "../Icons/WarningTriangleIcon";

/** Visual style variant of the alert. */
export type AlertVariant = "info" | "success" | "warning" | "error" | "neutral";

const DEFAULT_ICONS: Record<AlertVariant, React.ReactNode> = {
  info: <InfoCircleIcon />,
  success: <CheckCircleIcon />,
  warning: <WarningTriangleIcon />,
  error: <ErrorCircleIcon />,
  neutral: <InfoCircleIcon />,
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
  /** Inline link/CTA text shown beneath the description. When set, a styled link is rendered. */
  linkText?: string;
  /** Destination for the inline link. Renders an anchor when provided, otherwise a button. */
  linkHref?: string;
  /** Click handler for the inline link. */
  onLinkClick?: React.MouseEventHandler<HTMLElement>;
}

const CLOSE_BUTTON_CLASSES: Record<AlertVariant, string> = {
  info: "hover:bg-info-content/10 active:bg-info-content/20 text-info-content motion-safe:transition-colors motion-safe:duration-150",
  success:
    "hover:bg-success-content/10 active:bg-success-content/20 text-success-content motion-safe:transition-colors motion-safe:duration-150",
  warning:
    "hover:bg-warning-content/10 active:bg-warning-content/20 text-warning-content motion-safe:transition-colors motion-safe:duration-150",
  error:
    "hover:bg-error-content/10 active:bg-error-content/20 text-error-content motion-safe:transition-colors motion-safe:duration-150",
  neutral:
    "hover:bg-content-secondary/10 active:bg-content-secondary/20 text-content-secondary motion-safe:transition-colors motion-safe:duration-150",
};

const LINK_CLASSES: Record<AlertVariant, string> = {
  info: "text-alerts-info-prompt-content-info",
  success: "text-alerts-info-prompt-content-success",
  warning: "text-alerts-info-prompt-content-warning",
  error: "text-alerts-info-prompt-content-error",
  neutral: "text-content-secondary",
};

/**
 * Displays a contextual feedback message to the user.
 *
 * Supports `info`, `success`, `warning`, `error`, and `neutral` variants with a
 * default icon per variant, optional title, description, dismiss button, and an
 * optional inline link.
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
 *
 * @example
 * ```tsx
 * <Alert variant="neutral" title="Heads up" linkText="Learn more" linkHref="/docs">
 *   A general notice with no specific sentiment.
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
      linkText,
      linkHref,
      onLinkClick,
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
          "grid gap-x-3 rounded-xs p-4 text-sm leading-[18px]",
          resolvedIcon && closable && "grid-cols-[auto_1fr_auto]",
          resolvedIcon && !closable && "grid-cols-[auto_1fr]",
          !resolvedIcon && closable && "grid-cols-[1fr_auto]",
          !resolvedIcon && !closable && "grid-cols-[1fr]",
          title && children ? "items-start" : "items-center",
          variant === "info" && "bg-info-surface text-info-content",
          variant === "success" && "bg-success-surface text-success-content",
          variant === "warning" && "bg-warning-surface text-warning-content",
          variant === "error" && "bg-error-surface text-error-content",
          variant === "neutral" &&
            "bg-alerts-info-prompt-background-neutral text-alerts-info-prompt-icon-neutral",
          className,
        )}
        {...props}
      >
        {resolvedIcon && (
          <span className="flex shrink-0 items-start h-full" aria-hidden="true">
            {resolvedIcon}
          </span>
        )}

        <div className="flex min-w-0 flex-col gap-2">
          {title && (
            <div className="typography-body-small-14px-semibold text-content-primary">{title}</div>
          )}
          <div className="typography-body-small-14px-regular text-content-primary">{children}</div>
          {linkText &&
            (linkHref ? (
              <a
                href={linkHref}
                onClick={onLinkClick}
                className={cn(
                  "typography-body-small-14px-semibold w-fit cursor-pointer underline underline-offset-2",
                  LINK_CLASSES[variant],
                )}
              >
                {linkText}
              </a>
            ) : (
              <button
                type="button"
                onClick={onLinkClick}
                className={cn(
                  "typography-body-small-14px-semibold w-fit cursor-pointer underline underline-offset-2",
                  LINK_CLASSES[variant],
                )}
              >
                {linkText}
              </button>
            ))}
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
