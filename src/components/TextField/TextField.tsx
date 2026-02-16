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

const PADDING_LEFT: Record<TextFieldSize, [base: string, withIcon: string]> = {
  "48": ["pl-4", "pl-11"],
  "40": ["pl-4", "pl-11"],
  "32": ["pl-3", "pl-10"],
};

const PADDING_RIGHT: Record<TextFieldSize, [base: string, withIcon: string]> = {
  "48": ["pr-4", "pr-11"],
  "40": ["pr-4", "pr-11"],
  "32": ["pr-3", "pr-10"],
};

const ICON_LEFT: Record<TextFieldSize, string> = {
  "48": "left-4",
  "40": "left-4",
  "32": "left-3",
};

const ICON_RIGHT: Record<TextFieldSize, string> = {
  "48": "right-4",
  "40": "right-4",
  "32": "right-3",
};

function getContainerClassName(size: TextFieldSize, error: boolean, disabled?: boolean) {
  return cn(
    "relative rounded-xl border bg-neutral-100 has-focus-visible:outline-none motion-safe:transition-colors",
    error ? "border-error-500" : "border-transparent",
    !disabled && !error && "hover:border-neutral-400",
    CONTAINER_HEIGHT[size],
    disabled && "opacity-50",
  );
}

function getInputClassName(size: TextFieldSize, hasLeftIcon: boolean, hasRightIcon: boolean) {
  return cn(
    "h-full w-full rounded-xl bg-transparent text-body-100 no-underline placeholder:text-body-200 placeholder:opacity-40 focus:outline-none disabled:cursor-not-allowed",
    INPUT_SIZE_CLASSES[size],
    PADDING_LEFT[size][hasLeftIcon ? 1 : 0],
    PADDING_RIGHT[size][hasRightIcon ? 1 : 0],
  );
}

const ICON_BASE =
  "pointer-events-none absolute top-1/2 flex size-5 -translate-y-1/2 items-center justify-center text-body-200";

function TextFieldIcon({
  children,
  size,
  side,
}: {
  children: React.ReactNode;
  size: TextFieldSize;
  side: "left" | "right";
}) {
  return (
    <div className={cn(ICON_BASE, side === "left" ? ICON_LEFT[size] : ICON_RIGHT[size])}>
      {children}
    </div>
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
          {leftIcon && (
            <TextFieldIcon size={size} side="left">
              {leftIcon}
            </TextFieldIcon>
          )}

          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            aria-describedby={bottomText ? helperTextId : undefined}
            aria-invalid={error || undefined}
            className={getInputClassName(size, !!leftIcon, !!rightIcon)}
            {...props}
          />

          {rightIcon && (
            <TextFieldIcon size={size} side="right">
              {rightIcon}
            </TextFieldIcon>
          )}
          {validated && (
            <TextFieldIcon size={size} side="right">
              <CheckOutlineIcon className="size-5 text-success-500" />
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
