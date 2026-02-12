import * as React from "react";
import { cn } from "../../utils/cn";
import { Count } from "../Count/Count";

const iconButtonVariants = {
  primary:
    "bg-neutral-400 text-body-300 hover:bg-hover-100 disabled:opacity-50 focus-visible:shadow-focus-ring",
  secondary:
    "bg-neutral-100 text-neutral-400 hover:bg-neutral-200 disabled:opacity-50 focus-visible:shadow-focus-ring",
  tertiary:
    "bg-transparent text-neutral-400 hover:bg-hover-300 disabled:opacity-50 focus-visible:shadow-focus-ring active:bg-brand-green-50",
  brand:
    "bg-body-black-solid-constant text-brand-green-500 hover:bg-brand-green-500 hover:text-body-black-solid-constant disabled:opacity-50 focus-visible:shadow-focus-ring",
  contrast:
    "bg-transparent text-body-white-solid-constant disabled:opacity-50 focus-visible:shadow-focus-ring",
  messaging:
    "bg-body-black-solid-constant text-brand-green-500 hover:bg-brand-green-500 hover:text-body-black-solid-constant disabled:opacity-50 focus-visible:shadow-focus-ring",
  navTray:
    "bg-transparent text-neutral-400 disabled:opacity-50 focus-visible:shadow-focus-ring active:bg-brand-green-50",
  tertiaryDestructive:
    "bg-transparent text-error-500 hover:bg-hover-300 disabled:opacity-50 focus-visible:shadow-focus-ring",
  stop: "bg-neutral-400 text-body-300 hover:bg-brand-green-500 hover:text-body-black-solid-constant disabled:opacity-50 focus-visible:shadow-focus-ring",
  microphone:
    "bg-neutral-400 text-body-300 hover:bg-brand-green-500 hover:text-body-black-solid-constant disabled:opacity-50 focus-visible:shadow-focus-ring",
};

const iconSizeVariants = {
  24: "[&>svg]:size-4",
  32: "[&>svg]:size-5",
  40: "[&>svg]:size-6",
  52: "[&>svg]:size-7",
  72: "[&>svg]:size-8",
} as const;

const sizeVariants = {
  24: "p-1",
  32: "p-1.5",
  40: "p-[10px]",
  52: "p-2",
  72: "p-4",
} as const;

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

export type IconButtonSize = "24" | "32" | "40" | "52" | "72";

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual style variant of the icon button */
  variant?: IconButtonVariant;
  /** Size of the button */
  size?: IconButtonSize;
  /** Icon element to display */
  icon: React.ReactNode;
  /** Counter value to display */
  counterValue?: number;
}

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

        {counterValue !== undefined && (variant === "tertiary" || variant === "navTray") && (
          <div className="absolute top-0 right-0">
            <Count value={counterValue} />
          </div>
        )}
      </button>
    );
  },
);

IconButton.displayName = "IconButton";
