import * as React from "react";
import { cn } from "../../utils/cn";
import { Button } from "../Button/Button";
import { CrossIcon } from "../Icons/CrossIcon";

export type SnackbarVariant = "default" | "vipEarn" | "welcome";

export interface SnackbarProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  /** Snackbar layout variant */
  variant?: SnackbarVariant;
  /** Left icon element */
  icon?: React.ReactNode;
  /** Title text */
  title?: React.ReactNode;
  /** Description text */
  description?: React.ReactNode;
  /** Whether to show the actions section */
  showActions?: boolean;
  /** Primary CTA label (renders a default Button) */
  primaryLabel?: string;
  /** Primary CTA click handler (used with primaryLabel) */
  primaryOnClick?: () => void;
  /** Custom element to render as primary CTA (overrides primaryLabel/primaryOnClick) */
  primarySlot?: React.ReactNode;
  /** Secondary CTA label (renders a default Button) */
  secondaryLabel?: string;
  /** Secondary CTA click handler (used with secondaryLabel) */
  secondaryOnClick?: () => void;
  /** Custom element to render as secondary CTA (overrides secondaryLabel/secondaryOnClick) */
  secondarySlot?: React.ReactNode;
  /** Show close button */
  closable?: boolean;
  /** Close button click handler */
  onClose?: () => void;
}

function CloseButton({ onClose, className }: { onClose?: () => void; className?: string }) {
  return (
    <Button
      variant="tertiary"
      size="24"
      onClick={onClose}
      className={cn("h-auto shrink-0", className)}
      aria-label="Close snackbar"
    >
      <CrossIcon />
    </Button>
  );
}

/**
 * Resolves a CTA slot. If a custom slot is provided it takes precedence,
 * otherwise a default Button is rendered from label + onClick.
 */
function resolveCtaSlot(
  slot: React.ReactNode | undefined,
  label: string | undefined,
  onClick: (() => void) | undefined,
  buttonProps: React.ComponentProps<typeof Button>,
): React.ReactNode | null {
  if (slot) return slot;
  if (label) {
    return (
      <Button onClick={onClick} {...buttonProps}>
        {label}
      </Button>
    );
  }
  return null;
}

function VipEarnContent({
  icon,
  title,
  description,
  showActions,
  primarySlot,
  primaryLabel,
  primaryOnClick,
}: Pick<
  SnackbarProps,
  | "icon"
  | "title"
  | "description"
  | "showActions"
  | "primarySlot"
  | "primaryLabel"
  | "primaryOnClick"
>) {
  const primary = resolveCtaSlot(primarySlot, primaryLabel, primaryOnClick, {
    variant: "text",
    size: "24",
  });

  return (
    <>
      {icon && (
        <span className="flex shrink-0" aria-hidden="true">
          {icon}
        </span>
      )}
      <div className="flex min-w-0 flex-1 flex-col gap-4">
        <div className="flex flex-col">
          {title && <p className="typography-body-1-semibold text-body-100 leading-6">{title}</p>}
          {description && <p className="typography-body-2-regular text-body-200">{description}</p>}
        </div>
        {showActions && primary && <div className="self-start">{primary}</div>}
      </div>
    </>
  );
}

function WelcomeContent({
  title,
  description,
  showActions,
  primarySlot,
  primaryLabel,
  primaryOnClick,
  secondarySlot,
  secondaryLabel,
  secondaryOnClick,
}: Pick<
  SnackbarProps,
  | "title"
  | "description"
  | "showActions"
  | "primarySlot"
  | "primaryLabel"
  | "primaryOnClick"
  | "secondarySlot"
  | "secondaryLabel"
  | "secondaryOnClick"
>) {
  const primary = resolveCtaSlot(primarySlot, primaryLabel, primaryOnClick, {
    variant: "primary",
  });
  const secondary = resolveCtaSlot(secondarySlot, secondaryLabel, secondaryOnClick, {
    variant: "secondary",
  });

  return (
    <>
      <div className="flex flex-col items-center gap-2 px-8 text-center text-body-100">
        {title && <p className="typography-heading-4 text-body-100">{title}</p>}
        {description && <p className="typography-body-2-regular text-body-200">{description}</p>}
      </div>
      {showActions && (primary || secondary) && (
        <div className="flex w-full flex-col gap-4 px-8 sm:flex-row sm:*:flex-1">
          {secondary}
          {primary}
        </div>
      )}
    </>
  );
}

function DefaultContent({
  children,
  showActions,
  primarySlot,
  primaryLabel,
  primaryOnClick,
  secondarySlot,
  secondaryLabel,
  secondaryOnClick,
}: Pick<
  SnackbarProps,
  | "children"
  | "showActions"
  | "primarySlot"
  | "primaryLabel"
  | "primaryOnClick"
  | "secondarySlot"
  | "secondaryLabel"
  | "secondaryOnClick"
>) {
  const primary = resolveCtaSlot(primarySlot, primaryLabel, primaryOnClick, {
    variant: "primary",
    size: "40",
  });
  const secondary = resolveCtaSlot(secondarySlot, secondaryLabel, secondaryOnClick, {
    variant: "tertiary",
    size: "40",
  });

  return (
    <>
      <div className="typography-body-1-medium flex min-w-0 flex-1 items-center self-stretch text-body-100">
        {children}
      </div>
      {showActions && (primary || secondary) && (
        <div className="flex shrink-0 items-start gap-2">
          {primary}
          {secondary}
        </div>
      )}
    </>
  );
}

export const Snackbar = React.forwardRef<HTMLDivElement, SnackbarProps>(
  (
    {
      className,
      variant = "default",
      icon,
      title,
      description,
      showActions = true,
      primaryLabel,
      primaryOnClick,
      primarySlot,
      secondaryLabel,
      secondaryOnClick,
      secondarySlot,
      closable = false,
      onClose,
      children,
      ...props
    },
    ref,
  ) => {
    return (
      /* biome-ignore lint/a11y/useSemanticElements: output cannot contain div children; browsers would break the wrapper. */
      <div
        ref={ref}
        role="status"
        data-testid="snackbar"
        className={cn(
          "flex gap-4 rounded-2xl",
          (variant === "default" || variant === "vipEarn") &&
            "border border-neutral-50 bg-background-200 p-4 backdrop-blur-md",
          variant === "default" && "flex-wrap items-start",
          variant === "vipEarn" && "items-start",
          variant === "welcome" &&
            "relative flex-col items-center bg-background-inverse-solid py-6",
          className,
        )}
        {...props}
      >
        {variant === "vipEarn" && (
          <VipEarnContent
            icon={icon}
            title={title}
            description={description}
            showActions={showActions}
            primarySlot={primarySlot}
            primaryLabel={primaryLabel}
            primaryOnClick={primaryOnClick}
          />
        )}
        {variant === "welcome" && (
          <WelcomeContent
            title={title}
            description={description}
            showActions={showActions}
            primarySlot={primarySlot}
            primaryLabel={primaryLabel}
            primaryOnClick={primaryOnClick}
            secondarySlot={secondarySlot}
            secondaryLabel={secondaryLabel}
            secondaryOnClick={secondaryOnClick}
          />
        )}
        {variant === "default" && (
          <DefaultContent
            showActions={showActions}
            primarySlot={primarySlot}
            primaryLabel={primaryLabel}
            primaryOnClick={primaryOnClick}
            secondarySlot={secondarySlot}
            secondaryLabel={secondaryLabel}
            secondaryOnClick={secondaryOnClick}
          >
            {children}
          </DefaultContent>
        )}
        {closable && (
          <CloseButton
            onClose={onClose}
            className={variant === "welcome" ? "absolute top-2 right-2" : undefined}
          />
        )}
      </div>
    );
  },
);

Snackbar.displayName = "Snackbar";
