import * as React from "react";
import { cn } from "../../utils/cn";
import { Button, type ButtonProps } from "../Button/Button";

/** Visual style variant of the subscribe button. Mirrors the V2 Subscribe Button "Type" set (`brand` is Figma's "Upsell"). */
export type SubscribeButtonVariant = "primary" | "secondary" | "tertiary" | "outline" | "brand";

/** Height of the subscribe button in pixels. */
export type SubscribeButtonSize = "48" | "40" | "32";

export interface SubscribeButtonProps
  extends Omit<
    ButtonProps,
    "variant" | "size" | "price" | "discount" | "leftIcon" | "rightIcon" | "asChild"
  > {
  /** Visual style variant. `brand` is the Figma "Upsell" (green) type. @default "primary" */
  variant?: SubscribeButtonVariant;
  /** Height of the button in pixels. @default "48" */
  size?: SubscribeButtonSize;
  /** Current price shown on the trailing side (e.g. `"$9.99/mo"`). */
  price: string;
  /** Previous price rendered struck-through before {@link SubscribeButtonProps.price}. */
  discount?: string;
  /** Leading action label. @default "Join now" */
  children?: React.ReactNode;
}

const OLD_PRICE_TYPOGRAPHY: Record<SubscribeButtonSize, string> = {
  "48": "typography-body-small-14px-regular",
  "40": "typography-body-small-14px-regular",
  "32": "typography-description-12px-regular",
};

function warnMissingAccessibleName(hasTextLabel: boolean, ariaLabel?: string) {
  if (process.env.NODE_ENV !== "production" && !hasTextLabel && !ariaLabel) {
    console.warn(
      "SubscribeButton: no accessible name could be derived from a string `children`. Pass an `aria-label` so the action and price are announced.",
    );
  }
}

/**
 * A subscription / purchase button pairing an action label with the current
 * price and an optional struck-through previous price. Built on {@link Button},
 * so it inherits the same variants, sizes, `negative` dark-surface treatment,
 * `fullWidth`, loading, and disabled behaviour.
 *
 * The accessible name defaults to the label plus pricing (e.g. `"Join now, $9.99,
 * was $19.99"`); pass `aria-label` to override.
 *
 * @example
 * ```tsx
 * <SubscribeButton price="$9.99/mo" discount="$19.99" variant="brand" fullWidth>
 *   Join now
 * </SubscribeButton>
 * ```
 */
export const SubscribeButton = React.forwardRef<HTMLButtonElement, SubscribeButtonProps>(
  ({ variant = "primary", size = "48", price, discount, children = "Join now", ...props }, ref) => {
    const labelText = typeof children === "string" ? children : undefined;
    warnMissingAccessibleName(Boolean(labelText?.trim()), props["aria-label"]);

    const accessibleName =
      props["aria-label"] ??
      [labelText, price, discount ? `was ${discount}` : null].filter(Boolean).join(", ");

    return (
      <Button ref={ref} variant={variant} size={size} {...props} aria-label={accessibleName}>
        <span className="min-w-0 flex-1 truncate text-left">{children}</span>
        <span className="flex shrink-0 items-center gap-2" aria-hidden="true">
          {discount && (
            <span className={cn(OLD_PRICE_TYPOGRAPHY[size], "line-through")}>{discount}</span>
          )}
          <span>{price}</span>
        </span>
      </Button>
    );
  },
);

SubscribeButton.displayName = "SubscribeButton";
