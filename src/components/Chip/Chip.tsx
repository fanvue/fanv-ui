import { Slot, Slottable } from "@radix-ui/react-slot";
import * as React from "react";
import { cn } from "../../utils/cn";
import { Count, type CountVariant } from "../Count/Count";

/** Visual variant of the chip. */
export type ChipVariant = "rounded" | "square" | "dark";
/** Height of the chip in pixels. */
export type ChipSize = "32" | "40";

export interface ChipProps extends React.HTMLAttributes<HTMLElement> {
  /** Visual variant of the chip. @default "rounded" */
  variant?: ChipVariant;
  /** Height of the chip in pixels. @default "32" */
  size?: ChipSize;
  /** Whether the chip is in a selected (pressed) state. @default false */
  selected?: boolean;
  /** Whether the chip is disabled. @default false */
  disabled?: boolean;
  /** Whether to show a coloured status dot at the leading edge. @default false */
  leftDot?: boolean;
  /**
   * Whether the chip uses a dashed border for add/create affordances.
   * When `selected`, it becomes a subtle filled state with a solid border.
   * Has no effect when `variant="dark"`.
   * @default false
   */
  dotted?: boolean;
  /** Icon element displayed before the label. */
  leftIcon?: React.ReactNode;
  /** Icon element displayed after the label. */
  rightIcon?: React.ReactNode;
  /** Notification badge content (e.g. `"99+"`). Passed as a string for i18n support. */
  notificationLabel?: string;
  /** Numeric value for the notification badge. Uses the `Count` component for overflow formatting. Takes precedence over `notificationLabel` when both are provided. */
  notificationCount?: number;
  /** Maximum value before the badge shows overflow (e.g. `"9+"`). Only applies when `notificationCount` is set. @default 99 */
  notificationMax?: number;
  /** Colour variant of the notification badge. @default "brand" */
  notificationVariant?: CountVariant;
  /** Click handler — when provided, the chip renders as a `<button>` for accessibility. */
  onClick?: React.MouseEventHandler<HTMLElement>;
  /** Merge props onto a child element instead of rendering a wrapper. @default false */
  asChild?: boolean;
}

/**
 * A compact element for filters, tags, or toggleable actions. When an `onClick`
 * handler is provided, the chip renders as an interactive `<button>` with
 * `aria-pressed` support.
 *
 * @example
 * ```tsx
 * <Chip selected onClick={toggle}>Music</Chip>
 * ```
 */
export const Chip = React.forwardRef<HTMLButtonElement, ChipProps>(
  (
    {
      className,
      variant = "rounded",
      size = "32",
      selected = false,
      disabled = false,
      leftDot = false,
      dotted = false,
      leftIcon,
      rightIcon,
      notificationLabel,
      notificationCount,
      notificationMax,
      notificationVariant = "brand",
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

    // The dashed border is drawn as an SVG so the dash length matches the design
    // spec (8/8 for the 40px square, 6/6 otherwise). CSS `border-dashed` only
    // renders browser-default dash lengths, which are too short. The stroke colour
    // is driven by `currentColor`, and `group-hover`/`group-active` react to the
    // chip's interactive states. Rendered only in the default (non-`asChild`) path.
    const showDottedBorder = !isDark && dotted && !selected && !asChild;
    const dottedBorder = showDottedBorder ? (
      <svg
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-0 size-full overflow-visible",
          disabled ? "text-buttons-chip-disabled" : "text-buttons-chip-dotted-default",
          isInteractive &&
            !disabled &&
            "group-hover:text-buttons-chip-dotted-hover-stroke group-active:text-buttons-chip-dotted-hover-stroke",
        )}
      >
        <rect
          x="0.5"
          y="0.5"
          rx={variant === "square" ? 7.5 : size === "40" ? 19.5 : 15.5}
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          strokeDasharray={variant === "square" && size === "40" ? "8 8" : "6 6"}
          style={{ width: "calc(100% - 1px)", height: "calc(100% - 1px)" }}
        />
      </svg>
    ) : null;

    return (
      <Comp
        ref={ref}
        data-testid="chip"
        className={cn(
          "relative inline-flex min-w-0 items-center justify-center whitespace-nowrap motion-safe:transition-colors motion-safe:duration-150",
          // Shape
          variant === "square" ? "rounded-xs" : "rounded-full",
          // Size (32px uses 12px text, 40px uses 14px text per the design spec)
          size === "32" && "typography-description-12px-semibold h-8 py-1",
          size === "40" && "typography-body-small-14px-semibold h-10 py-2.5",
          // Variant colors
          isDark && "bg-neutral-alphas-600 text-content-always-white",
          !isDark && selected && !dotted && "bg-buttons-chip-active text-content-primary-inverted",
          // Active + dotted is a subtle filled state with a solid (non-dashed) border.
          !isDark &&
            selected &&
            dotted &&
            "border border-border-primary border-solid bg-inputs-inputs-primary text-content-primary",
          !isDark && !selected && !dotted && "bg-buttons-chip-default text-content-primary",
          // Dotted (non-selected): the dashed border is drawn via SVG (`dottedBorder`).
          // `group` lets that SVG react to hover/active. `asChild` keeps a CSS dashed
          // border fallback since the SVG is only rendered in the default path.
          !isDark && !selected && dotted && "bg-transparent text-content-primary",
          !isDark && !selected && dotted && !asChild && "group",
          asChild &&
            !isDark &&
            !selected &&
            dotted &&
            (disabled
              ? "border border-buttons-chip-disabled border-dashed"
              : "border border-buttons-chip-dotted-default border-dashed"),
          // Interactive
          isInteractive && !disabled && "cursor-pointer",
          isInteractive &&
            !disabled &&
            !isDark &&
            !selected &&
            !dotted &&
            "hover:bg-buttons-chip-hover",
          isInteractive &&
            !disabled &&
            !isDark &&
            !selected &&
            dotted &&
            "hover:bg-neutral-alphas-50 active:bg-neutral-alphas-50",
          // Focus
          "focus-visible:shadow-focus-ring focus-visible:outline-none",
          // Disabled
          disabled && isDark && "pointer-events-none opacity-50",
          disabled && !isDark && "pointer-events-none text-content-disabled",
          // Solid (non-dotted) disabled chips get a muted fill; dotted ones stay
          // transparent with their dashed border (drawn via SVG).
          disabled && !isDark && !dotted && "bg-buttons-chip-disabled",
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
        {asChild ? (
          <Slottable>{children}</Slottable>
        ) : (
          <>
            {dottedBorder}
            <span className="flex min-w-0 items-center gap-0.5 overflow-hidden px-3">
              {leftDot && (
                <span className="size-2 shrink-0 rounded-full bg-current" aria-hidden="true" />
              )}
              {leftIcon && (
                <span className="flex shrink-0 items-center justify-center" aria-hidden="true">
                  {leftIcon}
                </span>
              )}
              <span className="min-w-0 truncate">{children}</span>
              {rightIcon && (
                <span
                  className="flex size-5 shrink-0 items-center justify-center"
                  aria-hidden="true"
                >
                  {rightIcon}
                </span>
              )}
            </span>
            <Count
              variant={notificationVariant}
              size="16"
              className="absolute -top-1 -right-1"
              value={notificationCount ?? 0}
              max={notificationMax}
            >
              {notificationCount == null ? notificationLabel : undefined}
            </Count>
          </>
        )}
      </Comp>
    );
  },
);

Chip.displayName = "Chip";
