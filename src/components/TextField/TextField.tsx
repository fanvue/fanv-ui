import * as React from "react";
import { cn } from "../../utils/cn";

export type TextFieldSize = "48" | "40" | "32";

export interface TextFieldProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size" | "prefix"> {
  /** Label text displayed above the input */
  label?: string;
  /** Helper text displayed below the input */
  helperText?: string;
  /** Size variant of the text field */
  size?: TextFieldSize;
  /** Error state of the text field */
  error?: boolean;
  /** Error message displayed below the input. Overrides helper text when error is true. */
  errorMessage?: string;
  /** Icon displayed on the left side of the input */
  leftIcon?: React.ReactNode;
  /** Icon displayed on the right side of the input */
  rightIcon?: React.ReactNode;
  /** Whether the text field should take the full width of its container */
  fullWidth?: boolean;
}

export const TextField = React.forwardRef<HTMLInputElement, TextFieldProps>(
  (
    {
      label,
      helperText,
      size = "48",
      error = false,
      errorMessage,
      leftIcon,
      rightIcon,
      className,
      id,
      disabled,
      fullWidth = false,
      ...props
    },
    ref,
  ) => {
    const generatedId = React.useId();
    const inputId = id || generatedId;
    const helperTextId = `${inputId}-helper`;

    return (
      <div className={cn("flex flex-col", fullWidth ? "w-full" : "", className)}>
        <label htmlFor={inputId} className="flex flex-col">
          {label && (
            <span className="typography-caption-semibold px-1 pt-1 pb-2 text-body-100">
              {label}
            </span>
          )}

          <div
            className={cn(
              "flex cursor-text items-center gap-2 rounded-[12px] bg-neutral-100 px-4 transition-colors focus-within:border focus-within:border-neutral-400 hover:border hover:border-neutral-400",
              size === "48" && "h-12 py-3",
              size === "40" && "h-10 py-2",
              size === "32" && "h-8 p-2",
              error && "border border-error-500",
              disabled && "cursor-not-allowed opacity-50",
            )}
          >
            {leftIcon && (
              <div className="flex size-5 shrink-0 items-center justify-center text-body-200">
                {leftIcon}
              </div>
            )}

            <input
              ref={ref}
              id={inputId}
              disabled={disabled}
              aria-label={!label ? "Text field" : undefined}
              aria-describedby={helperText || errorMessage ? helperTextId : undefined}
              aria-invalid={error ? true : undefined}
              className={cn(
                "typography-body-1-regular flex-1 bg-transparent text-body-200 placeholder:text-body-200 placeholder:opacity-40 focus:outline-none disabled:cursor-not-allowed",
              )}
              {...props}
            />

            {rightIcon && (
              <div className="flex size-5 shrink-0 items-center justify-center text-body-200">
                {rightIcon}
              </div>
            )}
          </div>
        </label>

        {(helperText || errorMessage) && (
          <p
            id={helperTextId}
            className={cn(
              "typography-caption-regular px-2 pt-1",
              error ? "text-error-500" : "text-body-200",
            )}
          >
            {error && errorMessage ? errorMessage : helperText}
          </p>
        )}
      </div>
    );
  },
);

TextField.displayName = "TextField";
