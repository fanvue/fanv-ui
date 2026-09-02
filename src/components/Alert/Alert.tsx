import { Slot } from "@radix-ui/react-slot";
import * as React from "react";
import { cn } from "../../utils/cn";
import { Button, type ButtonProps } from "../Button/Button";
import { IconButton } from "../IconButton/IconButton";
import { AlertIcon } from "../Icons/AlertIcon";
import { CloseIcon } from "../Icons/CloseIcon";
import { InfoIcon } from "../Icons/InfoIcon";
import { TickCircleIcon } from "../Icons/TickCircleIcon";
import { WarningIcon } from "../Icons/WarningIcon";

/** Visual style variant of the alert. */
export type AlertVariant = "info" | "success" | "warning" | "error" | "neutral";

/**
 * Placement of the call-to-action relative to the message.
 *
 * - `"under"` stacks the action beneath the description. Use it when the CTA
 *   label is long or the alert is narrow.
 * - `"trailing"` keeps the action inline with the message, which keeps the
 *   alert compact and works best with short labels.
 */
export type AlertLayout = "under" | "trailing";

/**
 * Per-variant default icon, mapped to the Iconography components the design
 * uses at `Size=16, Fill=Yes`. Note the design's naming: its Error variant
 * takes `Iconography / Warning` and its Warning variant takes
 * `Iconography / Alert`, which reads backwards but is what the node specifies.
 *
 * These carry dedicated 16px geometry, unlike the `*CircleIcon` set they
 * replace, whose 20px art had to be scaled down.
 */
const DEFAULT_ICONS: Record<AlertVariant, React.ReactNode> = {
  info: <InfoIcon size={16} filled />,
  success: <TickCircleIcon size={16} filled />,
  warning: <AlertIcon size={16} filled />,
  error: <WarningIcon size={16} filled />,
  neutral: <InfoIcon size={16} filled />,
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
  /** Placement of the call-to-action relative to the message. @default "under" */
  layout?: AlertLayout;
  /**
   * Label for a built-in call-to-action button, the button form of the CTA.
   * Use it when the alert asks the user to do something specific — activating a
   * feature, or completing setup — rather than pointing at more detail. Ignored
   * when `action` is set.
   */
  ctaLabel?: React.ReactNode;
  /**
   * Props forwarded to the built-in call-to-action button (e.g. `onClick`).
   * `variant` and `size` default to `secondary`/`32` and can be overridden.
   *
   * The stacked CTA is `w-full sm:w-fit`. To override the width, match the
   * modifier chain — a bare `w-auto` replaces `w-full` but leaves `sm:w-fit`
   * in place, so pass `sm:` variants too.
   */
  ctaProps?: Omit<ButtonProps, "children" | "asChild">;
}

/**
 * Title and description colour. The design binds both to
 * `Color/Alerts/Info Prompt/Content/<variant>`, and Neutral to
 * `Color/Content/Secondary` — not to `content-primary`, which reads as plain
 * black on the tinted surface.
 */
const MESSAGE_CLASSES: Record<AlertVariant, string> = {
  info: "text-alerts-info-prompt-content-info",
  success: "text-alerts-info-prompt-content-success",
  warning: "text-alerts-info-prompt-content-warning",
  error: "text-alerts-info-prompt-content-error",
  neutral: "text-content-secondary",
};

/**
 * Surface fill and icon colour, both read from the component's own design
 * variables: `Color/Alerts/Info Prompt/Background/<variant>` and
 * `Color/Alerts/Info Prompt/Icon/<variant>`.
 *
 * The `text-*` here is inherited by the icon only — the message sets its own
 * colour via {@link MESSAGE_CLASSES}. It matters that this reads the dedicated
 * icon tokens rather than the generic `*-content` ones: those agree only for
 * info, and they carry no dark-mode inversion, where the alert tokens step
 * from `*-600` in light to `*-400` in dark as the design specifies.
 */
const SURFACE_CLASSES: Record<AlertVariant, string> = {
  info: "bg-alerts-info-prompt-background-info text-alerts-info-prompt-icon-info",
  success: "bg-alerts-info-prompt-background-success text-alerts-info-prompt-icon-success",
  warning: "bg-alerts-info-prompt-background-warning text-alerts-info-prompt-icon-warning",
  error: "bg-alerts-info-prompt-background-error text-alerts-info-prompt-icon-error",
  neutral: "bg-alerts-info-prompt-background-neutral text-alerts-info-prompt-icon-neutral",
};

/**
 * CTA link treatment. The node's CTA is a `V2 Link` instance whose text binds
 * `Color/Buttons/Link/Primary/Default`, with no per-variant override on any of
 * the five — so the link takes the standard link colour rather than the alert's
 * own content tint. These are the same tokens the {@link Link} component
 * applies, including the hover step.
 */
const LINK_CLASSES = "text-buttons-link-primary-default hover:text-buttons-link-primary-hover";

/**
 * The alert's call-to-action. `action` is the link form: any element passed
 * through receives the variant-appropriate link styling via Radix `Slot` while
 * staying a real link or button. `ctaLabel` is the button form. `action` wins
 * when both are set.
 */
function AlertCta({
  action,
  ctaLabel,
  ctaProps,
  isTrailing,
}: {
  action: React.ReactNode;
  ctaLabel: React.ReactNode;
  ctaProps?: AlertProps["ctaProps"];
  isTrailing: boolean;
}) {
  if (action) {
    return (
      <Slot
        className={cn(
          "typography-body-small-14px-semibold w-fit cursor-pointer underline underline-offset-2",
          isTrailing && "shrink-0",
          LINK_CLASSES,
        )}
      >
        {action}
      </Slot>
    );
  }

  if (ctaLabel === undefined || ctaLabel === null || ctaLabel === false) {
    return null;
  }

  return (
    <Button
      variant="secondary"
      size="32"
      {...ctaProps}
      className={cn(
        // Stacked, the CTA sits in a flex column, which would otherwise stretch
        // it across the whole alert. Fill on mobile, where a full-width button
        // is the easier target, and hug from `sm` (850px) up. Inline, it always
        // hugs so the message keeps the remaining width.
        isTrailing ? "shrink-0" : "w-full sm:w-fit",
        ctaProps?.className,
      )}
    >
      {ctaLabel}
    </Button>
  );
}

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
 *
 * @example
 * The CTA sits under the description by default. `layout="trailing"` keeps it
 * inline with the message, which suits short labels and keeps the alert compact.
 * ```tsx
 * <Alert variant="info" layout="trailing" action={<a href="/docs">Learn more</a>}>
 *   Scheduled posts now publish in your local timezone.
 * </Alert>
 * ```
 *
 * @example
 * `ctaLabel` renders the button form of the CTA instead of a link — use it when
 * the alert asks the user to do something specific.
 * ```tsx
 * <Alert variant="warning" title="Finish setup" layout="trailing" ctaLabel="Verify now" ctaProps={{ onClick: verify }}>
 *   Verify your identity to start receiving payouts.
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
      layout = "under",
      ctaLabel,
      ctaProps,
      children,
      ...props
    },
    ref,
  ) => {
    const resolvedIcon = icon === null ? null : (icon ?? DEFAULT_ICONS[variant]);
    const isTrailing = layout === "trailing";

    return (
      <div
        ref={ref}
        data-testid="alert"
        className={cn(
          // Mirrors the Figma frame: 12px inset with a 16px left inset, 24px
          // from the content row to the close button, `rounded-md` radius.
          "flex items-start gap-6 rounded-md p-3 pl-4 text-sm leading-[18px]",
          SURFACE_CLASSES[variant],
          className,
        )}
        {...props}
      >
        {/*
          Content row. Its 4px inset is what takes the container's 12px up to the
          16px the design specifies around the message, while leaving the close
          button on the container's own 12px. It also puts 28px between the
          message and the close button (this 4px plus the container's 24px gap).
        */}
        <div className="flex min-w-0 flex-1 items-start gap-3 py-1 pr-1">
          {resolvedIcon && (
            // The design's icon slot is 16px, but the default variant icons
            // (InfoCircleIcon and friends) ship at `size-5`, so constrain the
            // glyph here — the same way IconButton sizes its own icon. The 1px
            // top nudge then lands it optically centred on the first 18px line,
            // as in the design's icon-wrapper.
            <span className="flex shrink-0 items-start pt-px [&>svg]:size-4" aria-hidden="true">
              {resolvedIcon}
            </span>
          )}

          <div
            className={cn(
              "flex min-w-0 flex-1",
              isTrailing ? "items-center gap-6" : "flex-col gap-3",
            )}
          >
            <div role="alert" className={cn("flex flex-col gap-1", isTrailing && "min-w-0 flex-1")}>
              {title && (
                <div
                  className={cn("typography-body-small-14px-semibold", MESSAGE_CLASSES[variant])}
                >
                  {title}
                </div>
              )}
              {children ? (
                <div className={cn("typography-body-small-14px-regular", MESSAGE_CLASSES[variant])}>
                  {children}
                </div>
              ) : null}
            </div>
            <AlertCta
              action={action}
              ctaLabel={ctaLabel}
              ctaProps={ctaProps}
              isTrailing={isTrailing}
            />
          </div>
        </div>

        {closable && (
          <IconButton
            variant="secondary"
            size="24"
            onClick={onClose}
            aria-label={closeLabel}
            icon={<CloseIcon size={16} />}
          />
        )}
      </div>
    );
  },
);

Alert.displayName = "Alert";
