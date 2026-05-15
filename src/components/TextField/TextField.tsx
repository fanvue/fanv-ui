import * as React from "react";
import { CheckOutlineIcon } from "@/index";
import { cn } from "../../utils/cn";

/** Text field height in pixels. */
export type TextFieldSize = "48" | "40";

export interface TextFieldProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size" | "prefix"> {
  /** Label text displayed above the input. Also used as the accessible name. */
  label?: string;
  /** Helper text displayed below the input. Replaced by `errorMessage` when `error` is `true`. */
  helperText?: string;
  /** Height of the text field in pixels. @default "48" */
  size?: TextFieldSize;
  /** Whether the text field is in an error state. @default false */
  error?: boolean;
  /** Error message displayed below the input. Shown instead of `helperText` when `error` is `true`. */
  errorMessage?: string;
  /** Whether the text field is validated. @default false */
  validated?: boolean;
  /** Icon element displayed at the left side of the input. */
  leftIcon?: React.ReactNode;
  /** Icon element displayed at the right side of the input. */
  rightIcon?: React.ReactNode;
  /** Whether the text field stretches to fill its container width. @default false */
  fullWidth?: boolean;
}

const CONTAINER_HEIGHT: Record<TextFieldSize, string> = {
  "48": "h-12",
  "40": "h-10",
};

const INPUT_SIZE_CLASSES: Record<TextFieldSize, string> = {
  "48": "py-3 typography-regular-body-lg autofill-body-lg",
  "40": "py-2 typography-regular-body-lg autofill-body-lg",
};

const INPUT_PL: Record<TextFieldSize, { default: string; withIcon: string }> = {
  "48": { default: "pl-4", withIcon: "pl-12" },
  "40": { default: "pl-4", withIcon: "pl-10" },
};

const INPUT_PR: Record<TextFieldSize, { default: string; withIcon: string }> = {
  "48": { default: "pr-4", withIcon: "pr-12" },
  "40": { default: "pr-4", withIcon: "pr-10" },
};

const ICON_INSET: Record<TextFieldSize, string> = {
  "48": "px-4",
  "40": "px-4",
};

const ICON_SIZE: Record<TextFieldSize, string> = {
  "48": "size-6",
  "40": "size-4",
};

function getContainerClassName(size: TextFieldSize, error: boolean, disabled?: boolean) {
  return cn(
    "relative overflow-hidden rounded-sm border bg-surface-inputs has-focus-visible:outline-none motion-safe:transition-colors",
    disabled
      ? "border-transparent bg-surface-inputs-off"
      : error
        ? "border-border-error"
        : "border-border-primary hover:border-interaction-focus has-focus-visible:border-border-selected",
    CONTAINER_HEIGHT[size],
  );
}

function getInputClassName(size: TextFieldSize, hasLeftIcon: boolean, hasRightIcon: boolean) {
  return cn(
    "h-full w-full rounded-sm bg-transparent text-content-primary no-underline placeholder:text-content-tertiary focus:outline-none disabled:cursor-not-allowed disabled:text-content-disabled",
    INPUT_SIZE_CLASSES[size],
    hasLeftIcon ? INPUT_PL[size].withIcon : INPUT_PL[size].default,
    hasRightIcon ? INPUT_PR[size].withIcon : INPUT_PR[size].default,
  );
}

function TextFieldHelperText({
  id,
  error,
  children,
}: {
  id: string;
  error: boolean;
  children: React.ReactNode;
}) {
  return (
    <p
      id={id}
      className={cn(
        "typography-regular-body-sm",
        error ? "text-error-content" : "text-content-tertiary",
      )}
    >
      {children}
    </p>
  );
}

function warnMissingAccessibleName(label?: string, ariaLabel?: string, ariaLabelledBy?: string) {
  if (process.env.NODE_ENV !== "production") {
    if (!label && !ariaLabel && !ariaLabelledBy) {
      console.warn(
        "TextField: no accessible name provided. Pass a `label`, `aria-label`, or `aria-labelledby` prop.",
      );
    }
  }
}

/**
 * A text input field with optional label, helper/error text, and icon slots.
 *
 * Provide at least one of `label`, `aria-label`, or `aria-labelledby` for
 * accessibility — a console warning is emitted in development if none are set.
 *
 * @example
 * ```tsx
 * <TextField
 *   label="Email"
 *   placeholder="you@example.com"
 *   error={!!emailError}
 *   errorMessage={emailError}
 * />
 * ```
 */
export const TextField = React.forwardRef<HTMLInputElement, TextFieldProps>(
  (
    {
      label,
      helperText,
      size = "48",
      error = false,
      errorMessage,
      validated = false,
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
    const bottomText = error && errorMessage ? errorMessage : helperText;
    const iconColor = disabled ? "text-content-disabled" : "text-content-secondary";

    warnMissingAccessibleName(label, props["aria-label"], props["aria-labelledby"]);

    return (
      <div
        className={cn("flex flex-col gap-2", fullWidth && "w-full", className)}
        data-disabled={disabled ? "" : undefined}
        data-error={error ? "" : undefined}
      >
        {label && (
          <label htmlFor={inputId} className="typography-semibold-body-sm text-content-primary">
            {label}
          </label>
        )}

        <div className={getContainerClassName(size, error, disabled)}>
          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            aria-describedby={bottomText ? helperTextId : undefined}
            aria-invalid={error || undefined}
            className={cn(
              getInputClassName(size, !!leftIcon, !!(rightIcon || validated)),
              "[&[type='search']::-webkit-search-cancel-button]:hidden [&[type='search']::-webkit-search-cancel-button]:appearance-none",
            )}
            {...props}
          />

          {leftIcon && (
            <div
              className={cn(
                "pointer-events-none absolute inset-y-0 left-0 flex items-center",
                iconColor,
                ICON_INSET[size],
              )}
            >
              <div className={cn("flex shrink-0 items-center justify-center", ICON_SIZE[size])}>
                {leftIcon}
              </div>
            </div>
          )}

          {(rightIcon || validated) && (
            <div
              className={cn(
                "absolute inset-y-0 right-0 flex items-center gap-2",
                iconColor,
                ICON_INSET[size],
              )}
            >
              {rightIcon && (
                <div className={cn("flex shrink-0 items-center justify-center", ICON_SIZE[size])}>
                  {rightIcon}
                </div>
              )}
              {validated && (
                <div
                  className={cn(
                    "pointer-events-none flex shrink-0 items-center justify-center",
                    ICON_SIZE[size],
                  )}
                >
                  <CheckOutlineIcon className="text-success-content" />
                </div>
              )}
            </div>
          )}
        </div>

        {bottomText && (
          <TextFieldHelperText id={helperTextId} error={error}>
            {bottomText}
          </TextFieldHelperText>
        )}
      </div>
    );
  },
);

TextField.displayName = "TextField";
