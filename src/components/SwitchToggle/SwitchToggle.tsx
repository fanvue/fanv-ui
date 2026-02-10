import * as React from "react";
import { cn } from "../../utils/cn";

export type SwitchToggleSize = "24" | "32" | "40";

export interface SwitchToggleOption {
  /** Display label for the option */
  label: string;
  /** Value identifier for the option */
  value: string;
}

export interface SwitchToggleProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  /** Size variant */
  size?: SwitchToggleSize;
  /** The two options to toggle between */
  options: [SwitchToggleOption, SwitchToggleOption];
  /** Currently selected value */
  value?: string;
  /** Default selected value (uncontrolled) */
  defaultValue?: string;
  /** Callback when the selected value changes */
  onChange?: (value: string) => void;
  /** Whether the toggle is disabled */
  disabled?: boolean;
}

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
    const groupName = React.useId();
    // Tracks selection for uncontrolled usage; ignored when `value` prop is provided
    const [internalValue, setInternalValue] = React.useState(defaultValue ?? options[0].value);
    const isControlled = controlledValue !== undefined;
    const currentValue = isControlled ? controlledValue : internalValue;
    const isSecondSelected = currentValue === options[1].value;

    const sizeClass =
      size === "24"
        ? "px-2 py-1 typography-caption-semibold"
        : size === "32"
          ? "px-3 py-1.75 typography-body-2-semibold"
          : "h-10 px-4 py-2.25 typography-button-small";

    const handleSelect = (optionValue: string) => {
      if (disabled) return;
      if (!isControlled) {
        setInternalValue(optionValue);
      }
      onChange?.(optionValue);
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
        {options.map((option) => {
          const optionId = `${groupName}-${option.value}`;
          return (
            <label
              key={option.value}
              htmlFor={optionId}
              className={cn(
                "relative z-10 inline-flex shrink-0 cursor-pointer items-center justify-center rounded-full border border-transparent text-body-100",
                "has-focus-visible:shadow-focus-ring has-focus-visible:outline-none",
                disabled && "pointer-events-none",
                sizeClass,
              )}
            >
              <input
                id={optionId}
                type="radio"
                name={groupName}
                value={option.value}
                checked={currentValue === option.value}
                disabled={disabled}
                onChange={() => handleSelect(option.value)}
                className="sr-only"
              />
              {option.label}
            </label>
          );
        })}
      </div>
    );
  },
);

SwitchToggle.displayName = "SwitchToggle";
