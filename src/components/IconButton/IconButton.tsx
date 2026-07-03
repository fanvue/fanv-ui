import * as React from "react";
import { cn } from "../../utils/cn";
import { Count, type CountSize } from "../Count/Count";

/**
 * Visual style variant of the icon button.
 *
 * V2 types (square): `primary`, `secondary`, `tertiary`, `outline`, `error`,
 * `white`, `black`. `primary`, `secondary`, `tertiary` and `outline` honour the
 * {@link IconButtonProps.negative} prop.
 *
 * Legacy types (circular, retained for backward compatibility): `brand`,
 * `contrast`, `messaging`, `navTray`, `tertiaryDestructive`, `stop`,
 * `microphone`.
 */
export type IconButtonVariant =
  | "primary"
  | "secondary"
  | "tertiary"
  | "outline"
  | "error"
  | "white"
  | "black"
  | "brand"
  | "contrast"
  | "messaging"
  | "navTray"
  | "tertiaryDestructive"
  | "stop"
  | "microphone";

/** Icon button size in pixels. */
export type IconButtonSize = "24" | "32" | "40" | "48" | "52" | "72";

const iconSizeVariants: Record<IconButtonSize, string> = {
  24: "[&>svg]:size-4",
  32: "[&>svg]:size-4",
  40: "[&>svg]:size-6",
  48: "[&>svg]:size-6",
  52: "[&>svg]:size-7",
  72: "[&>svg]:size-8",
};

const sizeVariants: Record<IconButtonSize, string> = {
  24: "size-6 p-1",
  32: "size-8 p-1.5",
  40: "size-10 p-[10px]",
  48: "size-12 p-3",
  52: "size-[52px] p-2",
  72: "size-[72px] p-4",
};

const countSizeMap: Record<IconButtonSize, CountSize> = {
  24: "16",
  32: "24",
  40: "32",
  48: "32",
  52: "32",
  72: "32",
};

/** V2 variants render as a square (rounded-sm); legacy variants stay circular. */
const SQUARE_VARIANTS = new Set<IconButtonVariant>([
  "primary",
  "secondary",
  "tertiary",
  "outline",
  "error",
  "white",
  "black",
]);

/** Variants that honour the `negative` (dark-surface) treatment. */
const NEGATIVE_AWARE_VARIANTS = new Set<IconButtonVariant>([
  "primary",
  "secondary",
  "tertiary",
  "outline",
]);

const DISABLED_FILL = "bg-buttons-disabled-default text-content-disabled";
const DISABLED_FILL_NEGATIVE = "bg-buttons-disabled-negative text-content-disabled";
const DISABLED_TRANSPARENT = "bg-transparent text-content-disabled";

type VariantClasses = {
  default: string;
  disabled: string;
  negative?: string;
  negativeDisabled?: string;
};

/** V2 icon button styling, mirroring the shared button colour tokens. */
const V2_VARIANT_CLASSES: Record<string, VariantClasses> = {
  primary: {
    default:
      "bg-buttons-primary-default text-content-primary-inverted hover:bg-buttons-primary-hover not-disabled:active:bg-buttons-primary-hover",
    disabled: DISABLED_FILL,
    negative:
      "bg-buttons-primary-negative-default text-content-primary hover:bg-buttons-primary-negative-hover not-disabled:active:bg-buttons-primary-negative-hover",
    negativeDisabled: DISABLED_FILL_NEGATIVE,
  },
  secondary: {
    default:
      "bg-buttons-secondary-default text-content-primary hover:bg-buttons-secondary-hover not-disabled:active:bg-buttons-secondary-hover",
    disabled: DISABLED_FILL,
    negative:
      "bg-buttons-secondary-negative-default text-content-primary-inverted hover:bg-buttons-secondary-negative-hover not-disabled:active:bg-buttons-secondary-negative-hover",
    negativeDisabled: DISABLED_FILL_NEGATIVE,
  },
  tertiary: {
    default:
      "bg-transparent text-content-primary hover:bg-buttons-tertiary-hover not-disabled:active:bg-buttons-tertiary-hover",
    disabled: DISABLED_TRANSPARENT,
    negative:
      "bg-transparent text-content-primary-inverted hover:bg-buttons-tertiary-negative-hover not-disabled:active:bg-buttons-tertiary-negative-hover",
    negativeDisabled: DISABLED_TRANSPARENT,
  },
  outline: {
    default:
      "border border-buttons-outline-default bg-transparent text-content-primary hover:bg-buttons-outline-hover not-disabled:active:bg-buttons-outline-hover",
    disabled: "border border-buttons-disabled-default bg-transparent text-content-disabled",
    negative:
      "border border-buttons-outline-negative-default bg-transparent text-content-primary-inverted hover:bg-buttons-outline-negative-hover not-disabled:active:bg-buttons-outline-negative-hover",
    negativeDisabled:
      "border border-buttons-disabled-negative bg-transparent text-content-disabled",
  },
  error: {
    default:
      "bg-buttons-error-default text-content-always-white hover:bg-buttons-error-hover not-disabled:active:bg-buttons-error-hover",
    disabled: DISABLED_FILL,
  },
  white: {
    default:
      "bg-buttons-always-white-default text-content-always-black hover:bg-buttons-always-white-hover not-disabled:active:bg-buttons-always-white-hover",
    disabled: DISABLED_FILL,
  },
  black: {
    default:
      "bg-buttons-always-black-default text-content-always-white hover:bg-buttons-always-black-hover not-disabled:active:bg-buttons-always-black-hover",
    disabled: DISABLED_FILL,
  },
};

/** Legacy (pre-V2) icon button styling, kept for backward compatibility. */
const LEGACY_VARIANT_CLASSES: Record<string, string> = {
  brand:
    "bg-content-always-black text-brand-primary-default hover:bg-brand-primary-default hover:text-content-always-black not-disabled:active:bg-brand-primary-default not-disabled:active:text-content-always-black disabled:opacity-50",
  contrast:
    "bg-transparent text-content-always-white hover:bg-brand-primary-muted not-disabled:active:bg-brand-primary-muted disabled:opacity-50",
  messaging:
    "bg-content-always-black text-brand-primary-default hover:bg-brand-primary-default hover:text-content-always-black not-disabled:active:bg-brand-primary-default not-disabled:active:text-content-always-black disabled:opacity-50",
  navTray:
    "bg-transparent text-content-primary hover:bg-brand-primary-muted not-disabled:active:bg-brand-primary-muted disabled:opacity-50",
  tertiaryDestructive:
    "bg-transparent text-error-content hover:bg-brand-primary-muted not-disabled:active:bg-brand-primary-muted disabled:opacity-50",
  stop: "bg-buttons-primary-default text-content-primary-inverted hover:bg-buttons-brand-default hover:text-content-always-black not-disabled:active:bg-buttons-brand-default not-disabled:active:text-content-always-black disabled:opacity-50",
  microphone:
    "bg-buttons-primary-default text-content-primary-inverted hover:bg-buttons-brand-default hover:text-content-always-black not-disabled:active:bg-buttons-brand-default not-disabled:active:text-content-always-black disabled:opacity-50",
};

function getVariantClasses(
  variant: IconButtonVariant,
  negative: boolean,
  disabled: boolean,
): string {
  const v2 = V2_VARIANT_CLASSES[variant];
  if (v2) {
    const isNegative = NEGATIVE_AWARE_VARIANTS.has(variant) && negative;
    if (disabled) return (isNegative && v2.negativeDisabled) || v2.disabled;
    return (isNegative && v2.negative) || v2.default;
  }
  return LEGACY_VARIANT_CLASSES[variant] ?? "";
}

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual style variant of the icon button. @default "primary" */
  variant?: IconButtonVariant;
  /** Size of the button in pixels. @default "40" */
  size?: IconButtonSize;
  /** Icon element to render inside the button. */
  icon: React.ReactNode;
  /**
   * Forces the dark-surface treatment regardless of theme. Only honoured on the
   * `primary`, `secondary`, `tertiary`, and `outline` variants. @default false
   */
  negative?: boolean;
  /** When provided, displays a {@link Count} badge at the top-right corner. */
  counterValue?: number;
}

/**
 * A square button containing only an icon (legacy variants remain circular).
 * Use when an action can be represented by an icon alone (e.g. close, send).
 * Always pair with an `aria-label` for accessibility.
 *
 * @example
 * ```tsx
 * <IconButton icon={<CloseIcon />} aria-label="Close" variant="tertiary" />
 * ```
 */
export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "40",
      icon,
      counterValue,
      negative = false,
      disabled = false,
      ...props
    },
    ref,
  ) => {
    if (process.env.NODE_ENV !== "production") {
      if (!props["aria-label"] && !props["aria-labelledby"] && !props.title) {
        console.warn(
          "IconButton: No accessible name provided. Add an `aria-label`, `aria-labelledby`, or `title` prop so screen readers can announce this button.",
        );
      }
    }

    return (
      <button
        ref={ref}
        type="button"
        data-testid="icon-button"
        disabled={disabled}
        className={cn(
          "relative inline-flex shrink-0 items-center justify-center focus-visible:outline-none",
          "cursor-pointer transition-all duration-150 ease-in-out disabled:cursor-default",
          "focus-visible:shadow-focus-ring",
          SQUARE_VARIANTS.has(variant) ? "rounded-sm" : "rounded-full",
          sizeVariants[size],
          getVariantClasses(variant, negative, disabled),
          className,
        )}
        {...props}
      >
        <span
          className={cn("flex shrink-0 items-center justify-center", iconSizeVariants[size])}
          aria-hidden="true"
        >
          {icon}
        </span>

        {counterValue !== undefined && (
          <Count
            value={counterValue}
            variant="alert"
            size={countSizeMap[size]}
            className="absolute -top-0.5 -right-0.5"
          />
        )}
      </button>
    );
  },
);

IconButton.displayName = "IconButton";
