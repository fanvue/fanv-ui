import * as React from "react";
import { cn } from "../../utils/cn";
import { Count, type CountSize } from "../Count/Count";

/**
 * Visual style variant of the icon button.
 *
 * V2 types: `primary`, `secondary`, `tertiary`, `outline`, `error`, `white`,
 * `black`. `primary`, `secondary`, `tertiary` and `outline` honour the
 * {@link IconButtonProps.negative} prop. Their shape is size-driven — squared at
 * the `24` size, circular otherwise.
 *
 * Legacy types (circular at all sizes, retained for backward compatibility):
 * `brand`, `contrast`, `messaging`, `navTray`, `tertiaryDestructive`, `stop`,
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
  40: "[&>svg]:size-4",
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

/**
 * V2 type-system variants. Their shape is size-driven (see {@link IconButton}):
 * the `24` size is squared (`rounded-xs`), every larger size stays circular.
 * Legacy variants remain circular at all sizes.
 */
const V2_VARIANTS = new Set<IconButtonVariant>([
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

const DISABLED_FILL = "disabled:bg-buttons-disabled-default disabled:text-content-disabled";
const DISABLED_FILL_NEGATIVE =
  "disabled:bg-buttons-disabled-negative disabled:text-content-disabled";
const DISABLED_TRANSPARENT = "disabled:text-content-disabled";

type VariantClasses = {
  default: string;
  disabled: string;
  negative?: string;
  negativeDisabled?: string;
};

/**
 * V2 icon button styling, mirroring the shared button colour tokens. The
 * disabled treatment is expressed with the CSS `disabled:` variant (not the
 * `disabled` prop) so an ancestor `<fieldset disabled>` is styled too; hover is
 * guarded with `not-disabled:` so it never fights the disabled state.
 */
const V2_VARIANT_CLASSES: Record<string, VariantClasses> = {
  primary: {
    default:
      "bg-buttons-primary-default text-content-primary-inverted not-disabled:hover:bg-buttons-primary-hover not-disabled:active:bg-buttons-primary-hover",
    disabled: DISABLED_FILL,
    negative:
      "bg-buttons-primary-negative-default text-content-primary not-disabled:hover:bg-buttons-primary-negative-hover not-disabled:active:bg-buttons-primary-negative-hover",
    negativeDisabled: DISABLED_FILL_NEGATIVE,
  },
  secondary: {
    default:
      "bg-buttons-secondary-default text-content-primary not-disabled:hover:bg-buttons-secondary-hover not-disabled:active:bg-buttons-secondary-hover",
    disabled: DISABLED_FILL,
    negative:
      "bg-buttons-secondary-negative-default text-content-primary-inverted not-disabled:hover:bg-buttons-secondary-negative-hover not-disabled:active:bg-buttons-secondary-negative-hover",
    negativeDisabled: DISABLED_FILL_NEGATIVE,
  },
  tertiary: {
    default:
      "bg-transparent text-content-primary not-disabled:hover:bg-buttons-tertiary-hover not-disabled:active:bg-buttons-tertiary-hover",
    disabled: DISABLED_TRANSPARENT,
    negative:
      "bg-transparent text-content-primary-inverted not-disabled:hover:bg-buttons-tertiary-negative-hover not-disabled:active:bg-buttons-tertiary-negative-hover",
    negativeDisabled: DISABLED_TRANSPARENT,
  },
  outline: {
    default:
      "border border-buttons-outline-default bg-transparent text-content-primary not-disabled:hover:bg-buttons-outline-hover not-disabled:active:bg-buttons-outline-hover",
    disabled: "disabled:border-buttons-disabled-default disabled:text-content-disabled",
    negative:
      "border border-buttons-outline-negative-default bg-transparent text-content-primary-inverted not-disabled:hover:bg-buttons-outline-negative-hover not-disabled:active:bg-buttons-outline-negative-hover",
    negativeDisabled: "disabled:border-buttons-disabled-negative disabled:text-content-disabled",
  },
  error: {
    default:
      "bg-buttons-error-default text-content-always-white not-disabled:hover:bg-buttons-error-hover not-disabled:active:bg-buttons-error-hover",
    disabled: DISABLED_FILL,
  },
  white: {
    default:
      "bg-buttons-always-white-default text-content-always-black not-disabled:hover:bg-buttons-always-white-hover not-disabled:active:bg-buttons-always-white-hover",
    disabled: DISABLED_FILL,
  },
  black: {
    default:
      "bg-buttons-always-black-default text-content-always-white not-disabled:hover:bg-buttons-always-black-hover not-disabled:active:bg-buttons-always-black-hover",
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

function getVariantClasses(variant: IconButtonVariant, negative: boolean): string {
  const v2 = V2_VARIANT_CLASSES[variant];
  if (v2) {
    const isNegative = NEGATIVE_AWARE_VARIANTS.has(variant) && negative;
    const base = (isNegative && v2.negative) || v2.default;
    const disabledClasses = (isNegative && v2.negativeDisabled) || v2.disabled;
    return cn(base, disabledClasses);
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
 * A button containing only an icon. Use when an action can be represented by an
 * icon alone (e.g. close, send). Always pair with an `aria-label` for
 * accessibility.
 *
 * Shape follows the V2 spec: the `24` size is squared (`rounded-xs`), every
 * larger size is circular. Legacy variants stay circular at all sizes.
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
          V2_VARIANTS.has(variant) && size === "24" ? "rounded-xs" : "rounded-full",
          sizeVariants[size],
          getVariantClasses(variant, negative),
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
