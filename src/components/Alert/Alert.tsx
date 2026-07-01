import { Slot } from "@radix-ui/react-slot";
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
  /**
   * Composable action slot rendered beneath the description, outside the
   * `role="alert"` live region. Pass your own element (an `<a>`, a `next/link`
   * `<Link>`, or a `<Button>`) and it receives the variant-appropriate link
   * styling via the Radix `Slot` pattern while remaining a real link/button.
   */
  action?: React.ReactNode;
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
 * optional composable `action` slot.
 *
 * Each variant renders a default icon automatically. Pass a custom `icon` to
 * override, or `icon={null}` to hide the icon entirely.
 *
 * Only the title and description live inside the `role="alert"` live region.
 * The icon, `action`, and close button are rendered outside it so interactive
 * controls are announced and navigated consistently by screen readers.
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
 * <Alert variant="neutral" title="Heads up" action={<a href="/docs">Learn more</a>}>
 *   A general notice with no specific sentiment.
 * </Alert>
 * ```
 *
 * @example
 * ```tsx
 * import Link from "next/link";
 *
 * <Alert variant="info" title="Update available" action={<Link href="/changelog">See what's new</Link>}>
 *   A new version is ready to install.
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
      action,
      children,
      ...props
    },
    ref,
  ) => {
    const resolvedIcon = icon === null ? null : (icon ?? DEFAULT_ICONS[variant]);

    return (
      <div
        ref={ref}
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
          <div role="alert" className="flex flex-col gap-2">
            {title && (
              <div className="typography-body-small-14px-semibold text-content-primary">
                {title}
              </div>
            )}
            <div className="typography-body-small-14px-regular text-content-primary">
              {children}
            </div>
          </div>
          {action && (
            <Slot
              className={cn(
                "typography-body-small-14px-semibold w-fit cursor-pointer underline underline-offset-2",
                LINK_CLASSES[variant],
              )}
            >
              {action}
            </Slot>
          )}
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
