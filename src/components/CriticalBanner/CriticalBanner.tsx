import * as React from "react";
import { cn } from "../../utils/cn";
import { Button, type ButtonProps } from "../Button/Button";
import { WarningIcon } from "../Icons/WarningIcon";

/**
 * Placement of the call-to-action relative to the message.
 *
 * - `"trailing"` keeps the action inline, aligned to the end of the banner.
 * - `"under"` stacks the action beneath the message (use when the CTA label is
 *   too long to sit comfortably on the same line).
 */
export type CriticalBannerLayout = "trailing" | "under";

export interface CriticalBannerProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  /** Body copy describing the blocking situation. */
  children: React.ReactNode;
  /** Placement of the call-to-action relative to the message. @default "trailing" */
  layout?: CriticalBannerLayout;
  /** Optional bold heading shown above the body copy. */
  title?: React.ReactNode;
  /** Leading icon. Overrides the default filled warning icon. */
  icon?: React.ReactNode;
  /** Label for the built-in white call-to-action button. Ignored when `action` is set. */
  ctaLabel?: React.ReactNode;
  /** Props forwarded to the built-in call-to-action button (e.g. `onClick`, `asChild`). */
  ctaProps?: Omit<ButtonProps, "variant" | "size" | "children">;
  /** Custom action node rendered in place of the built-in call-to-action button. */
  action?: React.ReactNode;
}

function CriticalBannerCta({
  ctaLabel,
  ctaProps,
}: {
  ctaLabel: React.ReactNode;
  ctaProps?: CriticalBannerProps["ctaProps"];
}) {
  return (
    <Button
      variant="white"
      size="40"
      {...ctaProps}
      className={cn(
        "text-alerts-critical-banner-background hover:text-alerts-critical-banner-background active:text-alerts-critical-banner-background",
        ctaProps?.className,
      )}
    >
      {ctaLabel}
    </Button>
  );
}

/**
 * A full-width, high-priority banner reserved for situations that block or
 * significantly impact a user's ability to use the platform — account
 * suspensions, blocking payment failures, identity verification requirements,
 * or critical security notices. It sits at the very top of a page and is
 * intentionally disruptive, so use it sparingly; for non-blocking messaging use
 * {@link Alert} or {@link Banner} instead.
 *
 * Renders with `role="alert"` so assistive technology conveys its urgency;
 * override `role` for a less assertive treatment when appropriate.
 *
 * @example
 * ```tsx
 * <CriticalBanner
 *   title="Payment failed"
 *   layout="trailing"
 *   ctaLabel="Update payment"
 *   ctaProps={{ onClick: handleUpdate }}
 * >
 *   We couldn't process your last payment. Update your details to keep your account active.
 * </CriticalBanner>
 * ```
 */
export const CriticalBanner = React.forwardRef<HTMLDivElement, CriticalBannerProps>(
  (
    {
      className,
      children,
      layout = "trailing",
      title,
      icon,
      ctaLabel,
      ctaProps,
      action,
      role = "alert",
      ...props
    },
    ref,
  ) => {
    const hasTitle = title !== undefined && title !== null && title !== false;
    const isUnder = layout === "under";

    const cta =
      action ??
      (ctaLabel !== undefined && ctaLabel !== null && ctaLabel !== false ? (
        <CriticalBannerCta ctaLabel={ctaLabel} ctaProps={ctaProps} />
      ) : null);

    const iconNode = (
      <span className="shrink-0 text-alerts-critical-banner-icons" aria-hidden="true">
        {icon ?? <WarningIcon filled size={32} />}
      </span>
    );

    const textColumn = (
      <div className="flex min-w-0 flex-col gap-1 break-words pt-1 text-alerts-critical-banner-content">
        {hasTitle && <div className="typography-header-heading-xs">{title}</div>}
        <div className="typography-body-default-16px-regular">{children}</div>
      </div>
    );

    if (isUnder) {
      return (
        <div
          ref={ref}
          role={role}
          className={cn(
            "flex w-full min-w-[260px] items-start gap-4 rounded-md bg-alerts-critical-banner-background p-6",
            className,
          )}
          {...props}
        >
          {iconNode}
          <div className="flex min-w-0 flex-1 flex-col items-start gap-6">
            {textColumn}
            {cta !== null && <div className="shrink-0">{cta}</div>}
          </div>
        </div>
      );
    }

    return (
      <div
        ref={ref}
        role={role}
        className={cn(
          "flex w-full min-w-[260px] items-center gap-6 rounded-md bg-alerts-critical-banner-background p-6",
          className,
        )}
        {...props}
      >
        <div className="flex min-w-0 flex-1 items-start gap-4">
          {iconNode}
          {textColumn}
        </div>
        {cta !== null && <div className="shrink-0">{cta}</div>}
      </div>
    );
  },
);

CriticalBanner.displayName = "CriticalBanner";
