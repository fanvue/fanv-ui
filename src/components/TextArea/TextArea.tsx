import * as React from "react";
import { cn } from "../../utils/cn";
import { CloseIcon } from "../Icons/CloseIcon";

/** Text area height in pixels. */
export type TextAreaSize = "48" | "40" | "32";

export interface TextAreaProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "size"> {
  /** Label text displayed above the textarea. Also used as the accessible name. */
  label?: string;
  /** Helper text displayed below the textarea. Replaced by `errorMessage` when `error` is `true`. */
  helperText?: string;
  /** Minimum height of the text area in pixels. @default "48" */
  size?: TextAreaSize;
  /** Whether the text area is in an error state. @default false */
  error?: boolean;
  /** Error message displayed below the textarea. Shown instead of `helperText` when `error` is `true`. */
  errorMessage?: string;
  /** Whether the text area stretches to fill its container width. @default false */
  fullWidth?: boolean;
  /** Whether to show a clear button when text is present. @default false */
  showClearButton?: boolean;
  /** Callback fired when the clear button is clicked. */
  onClear?: () => void;
}

const CONTAINER_MIN_HEIGHT: Record<TextAreaSize, string> = {
  "48": "min-h-12",
  "40": "min-h-10",
  "32": "min-h-8",
};

const TEXTAREA_SIZE_CLASSES: Record<TextAreaSize, string> = {
  "48": "py-3 typography-body-1-regular",
  "40": "py-2 typography-body-1-regular",
  "32": "py-2 typography-body-2-regular",
};

const PADDING_HORIZONTAL: Record<TextAreaSize, string> = {
  "48": "px-4",
  "40": "px-4",
  "32": "px-3",
};

const PADDING_RIGHT_WITH_CLEAR: Record<TextAreaSize, string> = {
  "48": "pr-11",
  "40": "pr-11",
  "32": "pr-10",
};

const CLEAR_BUTTON_RIGHT: Record<TextAreaSize, string> = {
  "48": "right-4 top-3",
  "40": "right-4 top-2",
  "32": "right-3 top-2",
};

function getContainerClassName(size: TextAreaSize, error: boolean, disabled?: boolean) {
  return cn(
    "relative rounded-xl border bg-neutral-100 has-focus-visible:shadow-focus-ring has-focus-visible:outline-none motion-safe:transition-colors",
    error ? "border-error-500" : "border-transparent",
    !disabled && !error && "hover:border-neutral-400",
    CONTAINER_MIN_HEIGHT[size],
    disabled && "opacity-50",
  );
}

function getTextareaClassName(size: TextAreaSize, hasClearButton: boolean) {
  return cn(
    "min-h-[80px] w-full resize-y rounded-xl bg-transparent text-body-100 no-underline placeholder:text-body-200 placeholder:opacity-40 focus:outline-none disabled:cursor-not-allowed",
    TEXTAREA_SIZE_CLASSES[size],
    PADDING_HORIZONTAL[size],
    hasClearButton ? PADDING_RIGHT_WITH_CLEAR[size] : "",
  );
}

function TextAreaHelperText({
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
        "TextArea: no accessible name provided. Pass a `label`, `aria-label`, or `aria-labelledby` prop.",
      );
    }
  }
}

/**
 * A multi-line text input with optional label, helper/error text, and clear button.
 *
 * Provide at least one of `label`, `aria-label`, or `aria-labelledby` for
 * accessibility — a console warning is emitted in development if none are set.
 *
 * @example
 * ```tsx
 * <TextArea
 *   label="Description"
 *   placeholder="Enter your description..."
 *   showClearButton
 *   error={!!descError}
 *   errorMessage={descError}
 * />
 * ```
 */
export const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (
    {
      label,
      helperText,
      size = "48",
      error = false,
      errorMessage,
      className,
      id,
      disabled,
      fullWidth = false,
      showClearButton = false,
      onClear,
      value,
      onChange,
      ...props
    },
    ref,
  ) => {
    const generatedId = React.useId();
    const inputId = id || generatedId;
    const helperTextId = `${inputId}-helper`;
    const bottomText = error && errorMessage ? errorMessage : helperText;
    const hasValue = value !== undefined && value !== null && value !== "";
    const showClear = showClearButton && hasValue && !disabled;

    warnMissingAccessibleName(label, props["aria-label"], props["aria-labelledby"]);

    const handleClear = () => {
      if (onClear) {
        onClear();
      }
      // If there's an onChange handler, simulate a change event with empty value
      if (onChange) {
        const syntheticEvent = {
          target: { value: "" },
          currentTarget: { value: "" },
        } as React.ChangeEvent<HTMLTextAreaElement>;
        onChange(syntheticEvent);
      }
    };

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
          <textarea
            ref={ref}
            id={inputId}
            disabled={disabled}
            aria-describedby={bottomText ? helperTextId : undefined}
            aria-invalid={error || undefined}
            className={getTextareaClassName(size, showClear)}
            value={value}
            onChange={onChange}
            {...props}
          />

          {showClear && (
            <button
              type="button"
              onClick={handleClear}
              aria-label="Clear text"
              tabIndex={-1}
              className={cn(
                "absolute flex size-5 shrink-0 items-center justify-center text-body-200 transition-colors hover:text-body-100 focus:outline-none",
                CLEAR_BUTTON_RIGHT[size],
              )}
            >
              <CloseIcon />
            </button>
          )}
        </div>

        {bottomText && (
          <TextAreaHelperText id={helperTextId} error={error}>
            {bottomText}
          </TextAreaHelperText>
        )}
      </div>
    );
  },
);

TextArea.displayName = "TextArea";
