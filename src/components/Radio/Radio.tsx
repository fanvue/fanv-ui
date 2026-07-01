import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import * as React from "react";
import { cn } from "../../utils/cn";

/** Placement of the radio button relative to its label. */
export type RadioLayout = "leading" | "trailing";

export interface RadioProps
  extends Omit<React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>, "asChild"> {
  /** Size variant controlling label and helper text typography. @default "default" */
  size?: "default" | "small";
  /** Label text displayed next to the radio button. */
  label?: string;
  /** Descriptive text displayed below the label. */
  helperText?: string;
  /**
   * Placement of the radio button. `"leading"` renders it before the label;
   * `"trailing"` pushes it to the far end of the row (for list rows). @default "leading"
   */
  layout?: RadioLayout;
  /**
   * Optional avatar shown alongside the label, for options that represent a
   * person or account. Pass an {@link Avatar} sized to `32`.
   */
  avatar?: React.ReactNode;
}

/**
 * A single radio option within a {@link RadioGroup}. Supports leading or
 * trailing button placement, an optional avatar, a label, and helper text.
 *
 * @example
 * ```tsx
 * <RadioGroup value={value} onValueChange={setValue}>
 *   <Radio value="a" label="Option A" />
 *   <Radio value="b" label="Option B" layout="trailing" />
 * </RadioGroup>
 * ```
 */
export const Radio = React.forwardRef<
  React.ComponentRef<typeof RadioGroupPrimitive.Item>,
  RadioProps
>(
  (
    { className, size = "default", label, helperText, layout = "leading", avatar, id, ...props },
    ref,
  ) => {
    const generatedId = React.useId();
    const inputId = id || generatedId;
    const helperTextId = `${inputId}-helper`;
    const hasContent = Boolean(label || helperText || avatar);

    const button = (
      <RadioGroupPrimitive.Item
        ref={ref}
        id={inputId}
        data-testid="radio"
        aria-describedby={helperText ? helperTextId : undefined}
        className={cn(
          "relative h-4 w-4 shrink-0 cursor-pointer appearance-none rounded-full border border-content-primary bg-transparent transition-colors hover:bg-brand-primary-muted focus-visible:shadow-focus-ring focus-visible:outline-none not-disabled:active:bg-brand-primary-muted disabled:cursor-not-allowed disabled:border-neutral-alphas-600 disabled:bg-transparent data-[state=checked]:border-content-primary data-[state=checked]:bg-transparent",
          hasContent && (avatar ? "mt-2" : "mt-1"),
        )}
        {...props}
      >
        <RadioGroupPrimitive.Indicator className="absolute inset-0 flex items-center justify-center">
          <span className="size-2 rounded-full bg-content-primary group-has-disabled:bg-neutral-alphas-600" />
        </RadioGroupPrimitive.Indicator>
      </RadioGroupPrimitive.Item>
    );

    const content = hasContent && (
      <div className="flex min-w-0 flex-1 items-start gap-3">
        {avatar && (
          <span className="shrink-0 group-has-disabled:opacity-60" aria-hidden="true">
            {avatar}
          </span>
        )}
        {(label || helperText) && (
          <div className={cn("flex flex-col gap-0.5", avatar && "pt-1")}>
            {label && (
              <label
                htmlFor={inputId}
                className={cn(
                  "cursor-pointer select-none text-content-primary group-has-disabled:cursor-not-allowed group-has-disabled:text-content-tertiary",
                  size === "small"
                    ? "typography-body-small-14px-semibold"
                    : "typography-body-default-16px-semibold",
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
                  size === "small"
                    ? "typography-body-small-14px-semibold"
                    : "typography-description-12px-regular",
                )}
              >
                {helperText}
              </span>
            )}
          </div>
        )}
      </div>
    );

    return (
      <div className={cn("group flex w-full items-start gap-3", className)}>
        {layout === "leading" && button}
        {content}
        {layout === "trailing" && button}
      </div>
    );
  },
);

Radio.displayName = "Radio";
