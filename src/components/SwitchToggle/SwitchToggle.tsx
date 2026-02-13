import * as React from "react";
import { cn } from "../../utils/cn";

/** Height of the switch toggle in pixels. */
export type SwitchToggleSize = "24" | "32" | "40";

/** Describes one side of the binary toggle. */
export interface SwitchToggleOption {
  /** Display label for the option. */
  label: string;
  /** Value identifier returned via `onChange`. */
  value: string;
}

export interface SwitchToggleProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  /** Height of the toggle in pixels. @default "24" */
  size?: SwitchToggleSize;
  /** The two options to toggle between (exactly two required). */
  options: [SwitchToggleOption, SwitchToggleOption];
  /** Currently selected value (controlled). */
  value?: string;
  /** Initially selected value (uncontrolled). */
  defaultValue?: string;
  /** Callback fired when the selected value changes. */
  onChange?: (value: string) => void;
  /** Whether the toggle is disabled. @default false */
  disabled?: boolean;
}

function warnMissingAccessibleName(ariaLabel?: string, ariaLabelledBy?: string) {
  if (process.env.NODE_ENV !== "production") {
    if (!ariaLabel && !ariaLabelledBy) {
      console.warn(
        "SwitchToggle: no accessible name provided. Pass an `aria-label` or `aria-labelledby` prop.",
      );
    }
  }
}

/**
 * A binary segmented toggle rendered as a `radiogroup`. The active option is
 * highlighted with a sliding pill indicator. Supports both controlled and
 * uncontrolled usage.
 *
 * @example
 * ```tsx
 * <SwitchToggle
 *   options={[
 *     { label: "Monthly", value: "monthly" },
 *     { label: "Yearly", value: "yearly" },
 *   ]}
 *   value={billing}
 *   onChange={setBilling}
 * />
 * ```
 */
export const SwitchToggle = React.forwardRef<HTMLDivElement, SwitchToggleProps>(
  (
    {
      className,
      size = "24",
      options,
      value: controlledValue,
      defaultValue,
      onChange,
      disabled = false,
      ...props
    },
    ref,
  ) => {
    warnMissingAccessibleName(props["aria-label"], props["aria-labelledby"]);

    // Tracks selection for uncontrolled usage; ignored when `value` prop is provided
    const [internalValue, setInternalValue] = React.useState(defaultValue ?? options[0].value);
    const isControlled = controlledValue !== undefined;
    const currentValue = isControlled ? controlledValue : internalValue;
    const anySelected = options.some((o) => o.value === currentValue);
    const isSecondSelected = currentValue === options[1].value;
    const buttonRefs = React.useRef<(HTMLButtonElement | null)[]>([]);

    const sizeClass =
      size === "24"
        ? "px-2 py-1 typography-caption-semibold"
        : size === "32"
          ? "px-3 py-1.75 typography-body-2-semibold"
          : "h-10 px-4 py-2.25 typography-button-small";

    const handleSelect = (optionValue: string) => {
      if (disabled || optionValue === currentValue) return;
      if (!isControlled) {
        setInternalValue(optionValue);
      }
      onChange?.(optionValue);
    };

    const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
      const nextIndex =
        e.key === "ArrowRight" || e.key === "ArrowDown"
          ? (index + 1) % options.length
          : e.key === "ArrowLeft" || e.key === "ArrowUp"
            ? (index - 1 + options.length) % options.length
            : null;
      if (nextIndex === null) return;
      e.preventDefault();
      const nextOption = options[nextIndex] as (typeof options)[number];
      handleSelect(nextOption.value);
      buttonRefs.current[nextIndex]?.focus();
    };

    return (
      <div
        ref={ref}
        role="radiogroup"
        className={cn(
          "relative inline-grid grid-cols-2 rounded-full border border-neutral-200 p-1",
          disabled && "cursor-not-allowed opacity-50",
          className,
        )}
        {...props}
      >
        <span
          aria-hidden="true"
          className={cn(
            "absolute inset-y-1 left-1 w-[calc(50%-4px)] rounded-full border border-brand-green-500 bg-brand-green-50",
            "motion-safe:transition-transform motion-safe:duration-200 motion-safe:ease-in-out",
            isSecondSelected && "translate-x-full",
          )}
        />
        {options.map((option, index) => {
          const isSelected = currentValue === option.value;
          return (
            // biome-ignore lint/a11y/useSemanticElements: native radio inputs only allow Tab-focus on the checked item; buttons with roving tabindex give full keyboard navigation
            <button
              key={option.value}
              ref={(el) => {
                buttonRefs.current[index] = el;
              }}
              type="button"
              role="radio"
              aria-checked={isSelected}
              tabIndex={isSelected || (!anySelected && index === 0) ? 0 : -1}
              disabled={disabled}
              onClick={() => handleSelect(option.value)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className={cn(
                "relative z-10 inline-flex shrink-0 cursor-pointer items-center justify-center rounded-full border border-transparent text-body-100",
                "focus-visible:shadow-focus-ring focus-visible:outline-none",
                "active:rounded-full active:bg-brand-green-50",
                disabled && "pointer-events-none",
                sizeClass,
              )}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    );
  },
);

SwitchToggle.displayName = "SwitchToggle";
