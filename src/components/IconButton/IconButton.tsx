import * as React from "react";
import { cn } from "../../utils/cn";
import { Count, type CountSize } from "../Count/Count";

const iconButtonVariants = {
  primary:
    "bg-buttons-primary text-content-primary-inverted hover:bg-buttons-primary-hover not-disabled:active:bg-buttons-primary-hover disabled:opacity-50 focus-visible:shadow-focus-ring",
  secondary:
    "bg-neutral-alphas-50 text-icons-primary hover:bg-brand-primary-muted not-disabled:active:bg-brand-primary-muted disabled:opacity-50 focus-visible:shadow-focus-ring",
  tertiary:
    "bg-transparent text-content-primary hover:bg-brand-primary-muted not-disabled:active:bg-brand-primary-muted disabled:opacity-50 focus-visible:shadow-focus-ring",
  brand:
    "bg-content-on-brand text-brand-primary-default hover:bg-brand-primary-default hover:text-content-on-brand not-disabled:active:bg-brand-primary-default not-disabled:active:text-content-on-brand disabled:opacity-50 focus-visible:shadow-focus-ring",
  contrast:
    "bg-transparent text-content-on-brand-inverted hover:bg-brand-primary-muted not-disabled:active:bg-brand-primary-muted disabled:opacity-50 focus-visible:shadow-focus-ring",
  messaging:
    "bg-content-on-brand text-brand-primary-default hover:bg-brand-primary-default hover:text-content-on-brand not-disabled:active:bg-brand-primary-default not-disabled:active:text-content-on-brand disabled:opacity-50 focus-visible:shadow-focus-ring",
  navTray:
    "bg-transparent text-content-primary hover:bg-brand-primary-muted not-disabled:active:bg-brand-primary-muted disabled:opacity-50 focus-visible:shadow-focus-ring",
  tertiaryDestructive:
    "bg-transparent text-error-content hover:bg-brand-primary-muted not-disabled:active:bg-brand-primary-muted disabled:opacity-50 focus-visible:shadow-focus-ring",
  stop: "bg-buttons-primary text-content-primary-inverted hover:bg-buttons-brand hover:text-content-on-brand not-disabled:active:bg-buttons-brand not-disabled:active:text-content-on-brand disabled:opacity-50 focus-visible:shadow-focus-ring",
  microphone:
    "bg-buttons-primary text-content-primary-inverted hover:bg-buttons-brand hover:text-content-on-brand not-disabled:active:bg-buttons-brand not-disabled:active:text-content-on-brand disabled:opacity-50 focus-visible:shadow-focus-ring",
};

const iconSizeVariants = {
  24: "[&>svg]:size-4",
  32: "[&>svg]:size-5",
  40: "[&>svg]:size-6",
  52: "[&>svg]:size-7",
  72: "[&>svg]:size-8",
} as const;

const sizeVariants = {
  24: "size-6 p-1",
  32: "size-8 p-1.5",
  40: "size-10 p-[10px]",
  52: "size-[52px] p-2",
  72: "size-[72px] p-4",
} as const;

const countSizeMap: Record<string, CountSize> = {
  24: "16",
  32: "24",
  40: "32",
  52: "32",
  72: "32",
};

/** Visual style variant of the icon button. */
export type IconButtonVariant =
  | "primary"
  | "secondary"
  | "tertiary"
  | "brand"
  | "contrast"
  | "messaging"
  | "navTray"
  | "tertiaryDestructive"
  | "stop"
  | "microphone";

/** Icon button size in pixels. */
export type IconButtonSize = "24" | "32" | "40" | "52" | "72";

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual style variant of the icon button. @default "primary" */
  variant?: IconButtonVariant;
  /** Size of the button in pixels. @default "40" */
  size?: IconButtonSize;
  /** Icon element to render inside the button. */
  icon: React.ReactNode;
  /** When provided, displays a {@link Count} badge at the top-right corner (tertiary & navTray variants only). */
  counterValue?: number;
}

/**
 * A circular button containing only an icon. Use when an action can be
 * represented by an icon alone (e.g. close, send, mic). Pair with an
 * `aria-label` for accessibility.
 *
 * @example
 * ```tsx
 * <IconButton icon={<CloseIcon />} aria-label="Close" variant="tertiary" />
 * ```
 */
export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    { className, variant = "primary", size = "40", icon, counterValue, disabled = false, ...props },
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
          // Base styles
          "relative inline-flex shrink-0 items-center justify-center focus-visible:outline-none",
          "cursor-pointer rounded-full transition-all duration-150 ease-in-out disabled:cursor-default",
          // Size variants
          sizeVariants[size],
          // Variant styles
          iconButtonVariants[variant],
          // Manual CSS overrides
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
