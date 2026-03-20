import * as React from "react";
import { cn } from "../../utils/cn";
import { Badge } from "../Badge/Badge";
import { Button } from "../Button/Button";
import { ArrowRightIcon } from "../Icons/ArrowRightIcon";

/** Gradient variant of the banner. */
export type BannerVariant = "primary" | "secondary" | "tertiary";

const VARIANT_GRADIENTS: Record<BannerVariant, string> = {
  primary: "from-[var(--primitives-color-green-50)] to-[var(--primitives-color-purple-50)]",
  secondary: "from-[var(--primitives-color-purple-50)] to-[var(--primitives-color-pink-50)]",
  tertiary: "from-[var(--primitives-color-pink-50)] to-[var(--primitives-color-info-50)]",
};

export interface BannerProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Gradient variant controlling the background colours. @default "primary" */
  variant?: BannerVariant;
  /** Text rendered inside a `Badge` at the top of the banner. */
  badgeLabel?: string;
  /** Primary heading displayed below the badge. Rendered as an `<h3>`. */
  heading?: React.ReactNode;
  /** Supporting copy displayed below the heading. */
  description?: React.ReactNode;
  /**
   * Call-to-action button config. Renders a text-style `Button` with an arrow icon.
   * Pass `icon` to override the default `ArrowRightIcon`.
   */
  cta?: { label: string; onClick: () => void; icon?: React.ReactNode };
}

/**
 * Force light-mode semantic tokens on the Banner since its gradient
 * backgrounds are always light regardless of the current colour scheme.
 */
const LIGHT_MODE_OVERRIDES: React.CSSProperties = {
  "--color-content-primary": "#151515ff",
  "--color-content-secondary": "#404040ff",
  "--color-neutral-alphas-100": "#1515150a",
} as React.CSSProperties;

/**
 * A promotional banner card with gradient backgrounds, optional badge,
 * heading, description, and call-to-action button.
 *
 * @example
 * ```tsx
 * <Banner
 *   variant="primary"
 *   badgeLabel="New"
 *   heading="Boost your earnings"
 *   description="Try our latest feature to grow faster."
 *   cta={{ label: "Learn more", onClick: handleClick }}
 * />
 * ```
 */
export const Banner = React.forwardRef<HTMLDivElement, BannerProps>(
  (
    { className, variant = "primary", badgeLabel, heading, description, cta, style, ...props },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col items-start gap-2 overflow-hidden rounded-2xl bg-gradient-to-br p-3 text-content-primary",
          VARIANT_GRADIENTS[variant],
          className,
        )}
        style={{ ...LIGHT_MODE_OVERRIDES, ...style }}
        {...props}
      >
        {badgeLabel && <Badge>{badgeLabel}</Badge>}
        {heading && <h3 className="typography-semibold-body-md">{heading}</h3>}
        {description && <p className="typography-regular-body-sm">{description}</p>}
        {cta && (
          <Button
            variant="text"
            onClick={cta.onClick}
            size="24"
            rightIcon={cta.icon ?? <ArrowRightIcon />}
          >
            {cta.label}
          </Button>
        )}
      </div>
    );
  },
);

Banner.displayName = "Banner";
