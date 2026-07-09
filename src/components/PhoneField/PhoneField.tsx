import * as React from "react";
import { cn } from "../../utils/cn";
import { ChevronDownIcon } from "../Icons/ChevronDownIcon";

/** Phone field height in pixels. */
export type PhoneFieldSize = "48" | "40" | "32";

export interface PhoneFieldProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size" | "prefix"> {
  /** Label text displayed above the input. Also used as the accessible name. */
  label?: string;
  /** Helper text displayed below the input. Replaced by `errorMessage` when `error` is `true`. */
  helperText?: string;
  /** Height of the phone field in pixels. @default "48" */
  size?: PhoneFieldSize;
  /** Whether the field is in an error state. @default false */
  error?: boolean;
  /** Error message displayed below the input. Shown instead of `helperText` when `error` is `true`. */
  errorMessage?: string;
  /** Dial code of the selected country, shown before the number (e.g. `"+39"`). */
  dialCode?: React.ReactNode;
  /** Flag of the selected country, rendered in the country selector (e.g. an image or flag icon). */
  flag?: React.ReactNode;
  /** Fired when the country selector (flag + chevron) is activated. Open the country picker here. */
  onCountrySelect?: () => void;
  /** Accessible name for the country selector button. @default "Select country" */
  countryButtonLabel?: string;
  /** Whether the field stretches to fill its container width. @default false */
  fullWidth?: boolean;
}

const CONTAINER_HEIGHT: Record<PhoneFieldSize, string> = {
  "48": "h-12",
  "40": "h-10",
  "32": "h-8",
};

const CONTAINER_PADDING_X: Record<PhoneFieldSize, string> = {
  "48": "px-4",
  "40": "px-4",
  "32": "px-3",
};

const INPUT_TYPOGRAPHY: Record<PhoneFieldSize, string> = {
  "48": "typography-body-default-16px-regular autofill-body-lg",
  "40": "typography-body-default-16px-regular autofill-body-lg",
  "32": "typography-body-small-14px-regular autofill-body-md",
};

const PREFIX_TYPOGRAPHY: Record<PhoneFieldSize, string> = {
  "48": "typography-body-default-16px-regular",
  "40": "typography-body-default-16px-regular",
  "32": "typography-body-small-14px-regular",
};

function getContainerClassName(size: PhoneFieldSize, error: boolean, disabled?: boolean) {
  return cn(
    "relative flex items-center gap-2 overflow-hidden rounded-sm border bg-inputs-inputs-primary has-focus-visible:shadow-focus-ring has-focus-visible:outline-none motion-safe:transition-colors",
    CONTAINER_PADDING_X[size],
    CONTAINER_HEIGHT[size],
    error ? "border-error-content" : "border-border-primary",
    !disabled && !error && "hover:border-neutral-alphas-400",
    disabled && "opacity-50",
  );
}

function warnMissingAccessibleName(label?: string, ariaLabel?: string, ariaLabelledBy?: string) {
  if (process.env.NODE_ENV !== "production") {
    if (!label && !ariaLabel && !ariaLabelledBy) {
      console.warn(
        "PhoneField: no accessible name provided. Pass a `label`, `aria-label`, or `aria-labelledby` prop.",
      );
    }
  }
}

function PhoneFieldHelperText({
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
        "typography-description-12px-regular pt-2",
        error ? "text-error-content" : "text-content-tertiary",
      )}
    >
      {children}
    </p>
  );
}

/**
 * A phone number input with a country selector (flag + chevron), a fixed dial
 * code prefix, and a `tel` input. The country picker itself is owned by the
 * consumer: pass the selected country's `flag` and `dialCode`, and open your
 * picker from `onCountrySelect`.
 *
 * Provide at least one of `label`, `aria-label`, or `aria-labelledby` for
 * accessibility — a console warning is emitted in development if none are set.
 *
 * @example
 * ```tsx
 * <PhoneField
 *   label="Phone number"
 *   flag={<img src={italyFlag} alt="" />}
 *   dialCode="+39"
 *   onCountrySelect={openCountryPicker}
 *   value={number}
 *   onChange={(e) => setNumber(e.target.value)}
 * />
 * ```
 */
export const PhoneField = React.forwardRef<HTMLInputElement, PhoneFieldProps>(
  (
    {
      label,
      helperText,
      size = "48",
      error = false,
      errorMessage,
      dialCode,
      flag,
      onCountrySelect,
      countryButtonLabel = "Select country",
      className,
      id,
      disabled,
      fullWidth = false,
      type = "tel",
      ...props
    },
    ref,
  ) => {
    const generatedId = React.useId();
    const inputId = id || generatedId;
    const helperTextId = `${inputId}-helper`;
    const dialCodeId = `${inputId}-dial-code`;
    const bottomText = error && errorMessage ? errorMessage : helperText;

    const describedBy =
      [dialCode != null ? dialCodeId : null, bottomText ? helperTextId : null]
        .filter(Boolean)
        .join(" ") || undefined;

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
            className="typography-description-12px-semibold pb-2 text-content-primary"
          >
            {label}
          </label>
        )}

        <div className={getContainerClassName(size, error, disabled)}>
          <button
            type="button"
            onClick={onCountrySelect}
            disabled={disabled}
            aria-label={countryButtonLabel}
            className="flex shrink-0 items-center gap-1 rounded-2xs focus-visible:shadow-focus-ring focus-visible:outline-none disabled:cursor-not-allowed"
          >
            {flag != null && (
              <span className="flex size-6 shrink-0 items-center justify-center overflow-hidden rounded-full">
                {flag}
              </span>
            )}
            <ChevronDownIcon size={16} className="shrink-0 text-content-secondary" />
          </button>

          {dialCode != null && (
            <span
              id={dialCodeId}
              className={cn(
                "shrink-0 select-none whitespace-nowrap text-content-primary",
                PREFIX_TYPOGRAPHY[size],
              )}
            >
              {dialCode}
            </span>
          )}

          <input
            ref={ref}
            id={inputId}
            type={type}
            inputMode="tel"
            disabled={disabled}
            aria-describedby={describedBy}
            aria-invalid={error || undefined}
            className={cn(
              "h-full min-w-0 flex-1 bg-transparent text-content-primary no-underline placeholder:text-content-tertiary focus:outline-none disabled:cursor-not-allowed",
              INPUT_TYPOGRAPHY[size],
            )}
            {...props}
          />
        </div>

        {bottomText && (
          <PhoneFieldHelperText id={helperTextId} error={error}>
            {bottomText}
          </PhoneFieldHelperText>
        )}
      </div>
    );
  },
);

PhoneField.displayName = "PhoneField";
