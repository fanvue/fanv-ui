import * as React from "react";
import { cn } from "../../utils/cn";
import { InfoCircleIcon } from "../Icons/InfoCircleIcon";
import { Switch, type SwitchSize } from "../Switch/Switch";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../Tooltip/Tooltip";

/** Side on which the switch toggle is positioned relative to the label. */
export type SwitchFieldOrientation = "right" | "left";

export interface SwitchFieldProps
  extends Omit<React.ComponentPropsWithoutRef<typeof Switch>, "size" | "className"> {
  /** Side on which the switch is placed relative to the label. @default "right" */
  orientation?: SwitchFieldOrientation;
  /** Size variant of the switch and accompanying text. @default "default" */
  size?: SwitchSize;
  /** Label text displayed next to the switch. */
  label?: string;
  /** Descriptive text displayed below the label. */
  helperText?: string;
  /** Tooltip text shown when hovering the info icon next to the label. */
  infoText?: string;
  /** Accessible label for the info tooltip trigger button. Override for i18n.
   * @default "More information"
   */
  infoLabel?: string;
  /** Additional CSS class name for the outer wrapper. */
  className?: string;
}

/**
 * A labelled switch field with optional helper text and info tooltip. Composes
 * the {@link Switch} component with a `<label>` and description.
 *
 * @example
 * ```tsx
 * <SwitchField
 *   label="Notifications"
 *   helperText="Receive push notifications"
 *   checked={enabled}
 *   onCheckedChange={setEnabled}
 * />
 * ```
 */
export const SwitchField = React.forwardRef<React.ComponentRef<typeof Switch>, SwitchFieldProps>(
  (
    {
      className,
      orientation = "right",
      size = "default",
      label,
      helperText,
      infoText,
      infoLabel = "More information",
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
                "cursor-pointer select-none text-body-100",
                disabled && "cursor-not-allowed text-disabled-100",
                size === "default" ? "typography-body-1-semibold" : "typography-body-2-semibold",
              )}
            >
              {label}
            </label>
            {infoText && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button type="button" aria-label={infoLabel} className="flex shrink-0 pt-0.5">
                      <InfoCircleIcon aria-hidden="true" className="size-5 text-body-200" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">{infoText}</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        )}
        {helperText && (
          <span
            id={helperTextId}
            className={cn(
              "text-body-200", // !TODO https://linear.app/fanvue/issue/ENG-7301/swap-out-typography-tailwind-utility-classes
              disabled && "text-disabled-100",
              size === "default" ? "typography-body-2-regular" : "typography-caption-regular",
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
