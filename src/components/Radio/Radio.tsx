import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import * as React from "react";
import { cn } from "../../utils/cn";

export interface RadioProps
  extends Omit<React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>, "asChild"> {
  /** Size variant controlling label and helper text typography. @default "default" */
  size?: "default" | "small";
  /** Label text displayed next to the radio button. */
  label?: string;
  /** Descriptive text displayed below the label. */
  helperText?: string;
}

/**
 * A single radio option within a {@link RadioGroup}. Includes an optional label
 * and helper text.
 *
 * @example
 * ```tsx
 * <RadioGroup value={value} onValueChange={setValue}>
 *   <Radio value="a" label="Option A" />
 *   <Radio value="b" label="Option B" />
 * </RadioGroup>
 * ```
 */
export const Radio = React.forwardRef<
  React.ComponentRef<typeof RadioGroupPrimitive.Item>,
  RadioProps
>(({ className, size = "default", label, helperText, id, ...props }, ref) => {
  const generatedId = React.useId();
  const inputId = id || generatedId;
  const helperTextId = `${inputId}-helper`;

  return (
    <div className={cn("group inline-flex items-center gap-2", className)}>
      <RadioGroupPrimitive.Item
        ref={ref}
        id={inputId}
        data-testid="radio"
        aria-describedby={helperText ? helperTextId : undefined}
        className={cn(
          "relative h-4 w-4 shrink-0 cursor-pointer appearance-none rounded-full border border-content-primary bg-transparent transition-colors hover:bg-brand-primary-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-interaction-focus focus-visible:ring-offset-2 focus-visible:ring-offset-background-primary not-disabled:active:bg-brand-primary-muted disabled:cursor-not-allowed disabled:border-neutral-alphas-600 disabled:bg-transparent data-[state=checked]:border-content-primary data-[state=checked]:bg-transparent",
          helperText && "mt-1 self-start",
        )}
        {...props}
      >
        <RadioGroupPrimitive.Indicator className="absolute inset-0 flex items-center justify-center">
          <span className="size-2 rounded-full bg-content-primary group-has-disabled:bg-neutral-alphas-600" />
        </RadioGroupPrimitive.Indicator>
      </RadioGroupPrimitive.Item>
      {(label || helperText) && (
        <div className="flex flex-col gap-0.5">
          {label && (
            <label
              htmlFor={inputId}
              className={cn(
                "cursor-pointer select-none text-content-primary group-has-disabled:cursor-not-allowed group-has-disabled:text-content-tertiary",
                size === "small" ? "typography-semibold-body-md" : "typography-semibold-body-lg",
              )}
            >
              {label}
            </label>
          )}
          {helperText && (
            <span
              id={helperTextId}
              className={cn(
                "text-content-secondary group-has-disabled:cursor-not-allowed group-has-disabled:text-content-tertiary",
                size === "small" ? "typography-semibold-body-md" : "typography-regular-body-sm",
              )}
            >
              {helperText}
            </span>
          )}
        </div>
      )}
    </div>
  );
});

Radio.displayName = "Radio";
