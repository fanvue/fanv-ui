import * as React from "react";
import { cn } from "../../utils/cn";
import { InfoCircleIcon } from "../Icons/InfoCircleIcon";
import { Switch, type SwitchSize } from "../Switch/Switch";

export type SwitchFieldOrientation = "right" | "left";

export interface SwitchFieldProps
  extends Omit<React.ComponentPropsWithoutRef<typeof Switch>, "size" | "className"> {
  /** Position of the switch relative to the label */
  orientation?: SwitchFieldOrientation;
  /** Size variant of the switch and text */
  size?: SwitchSize;
  /** Label text displayed next to the switch */
  label?: string;
  /** Helper text displayed below the label */
  helperText?: string;
  /** Info tooltip text displayed on hover of the info icon */
  infoText?: string;
  /** Additional className for the wrapper */
  className?: string;
}

export const SwitchField = React.forwardRef<React.ComponentRef<typeof Switch>, SwitchFieldProps>(
  (
    {
      className,
      orientation = "right",
      size = "default",
      label,
      helperText,
      infoText,
      disabled,
      id: propId,
      ...props
    },
    ref,
  ) => {
    const generatedId = React.useId();
    const id = propId ?? generatedId;
    const helperTextId = helperText ? `${id}-helper` : undefined;

    const switchElement = (
      <Switch
        ref={ref}
        id={id}
        size={size}
        disabled={disabled}
        aria-describedby={helperTextId}
        {...props}
      />
    );

    const labelContent = (label || helperText) && (
      <div
        className={cn(
          "flex min-w-0 flex-1 flex-col items-start",
          size === "default" ? "gap-1" : "gap-0.5",
        )}
      >
        {label && (
          <div className="flex items-center gap-1">
            <label
              htmlFor={id}
              className={cn(
                "cursor-pointer select-none font-semibold text-body-100", // !TODO https://linear.app/fanvue/issue/ENG-7301/swap-out-typography-tailwind-utility-classes
                disabled && "cursor-not-allowed text-disabled-100",
                size === "default" ? "text-base leading-normal" : "text-sm leading-snug",
              )}
            >
              {label}
            </label>
            {infoText && (
              <span className="group relative flex shrink-0 pt-0.5">
                <InfoCircleIcon className="size-5 text-body-200" />
                <span className="pointer-events-none absolute top-full left-1/2 mt-1 -translate-x-1/2 rounded-lg bg-neutral-400 px-3 py-1.5 text-body-white-solid-constant text-xs leading-none opacity-0 transition-opacity group-hover:opacity-100">
                  {/*!TODO Replace with Tooltip once built
                  https://linear.app/fanvue/issue/ENG-7226/component-library-tooltip-component */}
                  {infoText}
                </span>
              </span>
            )}
          </div>
        )}
        {helperText && (
          <span
            id={helperTextId}
            className={cn(
              "text-body-200", // !TODO https://linear.app/fanvue/issue/ENG-7301/swap-out-typography-tailwind-utility-classes
              disabled && "text-disabled-100",
              size === "default" ? "text-sm leading-snug" : "text-xs leading-snug",
            )}
          >
            {helperText}
          </span>
        )}
      </div>
    );

    return (
      <div className={cn("flex items-start gap-2", disabled && "cursor-not-allowed", className)}>
        {orientation === "left" && switchElement}
        {labelContent}
        {orientation === "right" && switchElement}
      </div>
    );
  },
);

SwitchField.displayName = "SwitchField";
