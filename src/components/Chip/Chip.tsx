import { Slot, Slottable } from "@radix-ui/react-slot";
import * as React from "react";
import { cn } from "../../utils/cn";

export type ChipVariant = "rounded" | "square" | "dark";
export type ChipSize = "32" | "40";

export interface ChipProps extends React.HTMLAttributes<HTMLElement> {
  /** Visual shape variant of the chip */
  variant?: ChipVariant;
  /** Size of the chip */
  size?: ChipSize;
  /** Whether the chip is in a selected state */
  selected?: boolean;
  /** Whether the chip is disabled */
  disabled?: boolean;
  /** Show left status dot */
  leftDot?: boolean;
  /** Left icon element */
  leftIcon?: React.ReactNode;
  /** Right icon element */
  rightIcon?: React.ReactNode;
  /** Notification badge content (e.g., "99+"). Passed as a string for i18n support. */
  notificationLabel?: string;
  /** Click handler — when provided, the chip renders as a `<button>` for accessibility */
  onClick?: React.MouseEventHandler<HTMLElement>;
  /** Render as a different element using Radix Slot */
  asChild?: boolean;
}

export const Chip = React.forwardRef<HTMLButtonElement, ChipProps>(
  (
    {
      className,
      variant = "rounded",
      size = "32",
      selected = false,
      disabled = false,
      leftDot = false,
      leftIcon,
      rightIcon,
      notificationLabel,
      onClick,
      asChild = false,
      children,
      ...props
    },
    ref,
    // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: Variant-heavy UI component
  ) => {
    const isInteractive = !!onClick && !asChild;
    const Comp = asChild ? Slot : isInteractive ? "button" : "span";
    const isDark = variant === "dark";

    return (
      <Comp
        ref={ref}
        data-testid="chip"
        className={cn(
          "typography-caption-semibold relative inline-flex items-center gap-2 px-3 transition-colors",
          // Shape
          variant === "square" ? "rounded-lg" : "rounded-full",
          // Size
          size === "32" && "h-8 py-1",
          size === "40" && "h-10 py-2.5",
          // Variant colors
          isDark && "bg-background-800 text-body-white-solid-constant",
          !isDark && selected && "bg-brand-green-50 text-neutral-400",
          !isDark && !selected && "bg-neutral-100 text-neutral-400",
          // Hover
          isInteractive &&
            !disabled &&
            !isDark &&
            selected &&
            "hover:bg-brand-green-500 hover:text-body-black-solid-constant",
          isInteractive && !disabled && !isDark && !selected && "hover:bg-hover-400",
          // Focus
          "focus-visible:shadow-focus-ring focus-visible:outline-none",
          // Disabled
          disabled && isDark && "pointer-events-none opacity-50",
          disabled && !isDark && "pointer-events-none text-neutral-300",
          className,
        )}
        {...(isInteractive && {
          type: "button" as const,
          disabled,
          "aria-pressed": selected,
          onClick,
        })}
        {...(!isInteractive && disabled && { "aria-disabled": true })}
        {...(selected && { "data-selected": "" })}
        {...props}
      >
        {leftDot && <span className="size-2 shrink-0 rounded-full bg-current" aria-hidden="true" />}
        {leftIcon && (
          <span className="flex size-5 shrink-0 items-center justify-center" aria-hidden="true">
            {leftIcon}
          </span>
        )}
        <Slottable>{children}</Slottable>
        {rightIcon && (
          <span className="flex size-5 shrink-0 items-center justify-center" aria-hidden="true">
            {rightIcon}
          </span>
        )}
        {notificationLabel && (
          <span className="typography-caption-semibold absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-body-100 px-1 text-body-300">
            {notificationLabel}
          </span>
        )}
      </Comp>
    );
  },
);

Chip.displayName = "Chip";
