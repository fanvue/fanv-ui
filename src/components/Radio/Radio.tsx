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
          "relative h-4 w-4 shrink-0 cursor-pointer appearance-none rounded-full border border-body-100 bg-transparent outline-brand-purple-500 transition-colors hover:bg-brand-green-50 not-disabled:active:bg-brand-green-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:border-disabled-400 disabled:bg-transparent data-[state=checked]:border-body-100 data-[state=checked]:bg-transparent dark:border-body-100 dark:disabled:border-disabled-400",
          helperText && "mt-1 self-start",
        )}
        {...props}
      >
        <RadioGroupPrimitive.Indicator className="absolute inset-0 flex items-center justify-center">
          <span className="size-2 rounded-full bg-body-100 group-has-disabled:bg-disabled-400 dark:bg-body-100 dark:group-has-disabled:bg-disabled-400" />
        </RadioGroupPrimitive.Indicator>
      </RadioGroupPrimitive.Item>
      {(label || helperText) && (
        <div className="flex flex-col gap-0.5">
          {label && (
            <label
              htmlFor={inputId}
              className={cn(
                "cursor-pointer select-none text-body-100 group-has-disabled:cursor-not-allowed group-has-disabled:text-disabled-100",
                size === "small" ? "typography-body-2-semibold" : "typography-body-1-semibold",
              )}
            >
              {label}
            </label>
          )}
          {helperText && (
            <span
              id={helperTextId}
              className={cn(
                "text-body-200 group-has-disabled:cursor-not-allowed group-has-disabled:text-disabled-100",
                size === "small" ? "typography-body-2-semibold" : "typography-caption-regular",
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
