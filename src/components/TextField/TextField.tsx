import * as React from "react";
import { CheckOutlineIcon } from "@/index";
import { cn } from "../../utils/cn";

/** Text field height in pixels. */
export type TextFieldSize = "48" | "40" | "32";

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
  "32": "h-8",
};

const INPUT_SIZE_CLASSES: Record<TextFieldSize, string> = {
  "48": "py-3 typography-body-1-regular",
  "40": "py-2 typography-body-1-regular",
  "32": "py-2 typography-body-2-regular",
};

const PADDING_HORIZONTAL: Record<TextFieldSize, string> = {
  "48": "px-4",
  "40": "px-4",
  "32": "px-3",
};

const ICON_SPACING: Record<TextFieldSize, string> = {
  "48": "gap-3",
  "40": "gap-3",
  "32": "gap-2",
};

function getContainerClassName(size: TextFieldSize, error: boolean, disabled?: boolean) {
  return cn(
    "flex items-center rounded-xl border bg-neutral-100 has-focus-visible:outline-none motion-safe:transition-colors",
    error ? "border-error-500" : "border-transparent",
    !disabled && !error && "hover:border-neutral-400",
    CONTAINER_HEIGHT[size],
    PADDING_HORIZONTAL[size],
    ICON_SPACING[size],
    disabled && "opacity-50",
  );
}

function getInputClassName(size: TextFieldSize) {
  return cn(
    "h-full flex-1 rounded-xl bg-transparent text-body-100 no-underline placeholder:text-body-200 placeholder:opacity-40 focus:outline-none disabled:cursor-not-allowed",
    INPUT_SIZE_CLASSES[size],
  );
}

function TextFieldIcon({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex size-5 shrink-0 items-center justify-center text-body-200">{children}</div>
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
        "typography-caption-regular px-2 pt-1 pb-0.5",
        error ? "text-error-500" : "text-body-200",
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

    warnMissingAccessibleName(label, props["aria-label"], props["aria-labelledby"]);

    return (
      <div
        className={cn("flex flex-col", fullWidth && "w-full", className)}
        data-disabled={disabled ? "" : undefined}
        data-error={error ? "" : undefined}
      >
        {label && (
          <label
            htmlFor={inputId}
            className="typography-caption-semibold px-1 pt-1 pb-2 text-body-100"
          >
            {label}
          </label>
        )}

        <div className={getContainerClassName(size, error, disabled)}>
          {leftIcon && <TextFieldIcon>{leftIcon}</TextFieldIcon>}

          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            aria-describedby={bottomText ? helperTextId : undefined}
            aria-invalid={error || undefined}
            className={getInputClassName(size)}
            {...props}
          />

          {rightIcon && <TextFieldIcon>{rightIcon}</TextFieldIcon>}
          {validated && (
            <TextFieldIcon>
              <CheckOutlineIcon className="text-success-500" />
            </TextFieldIcon>
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
