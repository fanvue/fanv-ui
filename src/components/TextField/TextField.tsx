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
  /** Fixed, non-editable label pinned inside the left edge of the field — for a prefix such as a currency symbol or country code. */
  leftLabel?: React.ReactNode;
  /** Fixed, non-editable label pinned inside the right edge of the field — for a unit or suffix such as a currency code or domain. */
  rightLabel?: React.ReactNode;
  /** Whether the text field stretches to fill its container width. @default false */
  fullWidth?: boolean;
}

const CONTAINER_HEIGHT: Record<TextFieldSize, string> = {
  "48": "h-12",
  "40": "h-10",
  "32": "h-8",
};

const CONTAINER_PADDING_X: Record<TextFieldSize, string> = {
  "48": "px-4",
  "40": "px-4",
  "32": "px-3",
};

const CONTAINER_GAP: Record<TextFieldSize, string> = {
  "48": "gap-2.5",
  "40": "gap-2.5",
  "32": "gap-2",
};

const INPUT_TYPOGRAPHY: Record<TextFieldSize, string> = {
  "48": "typography-body-default-16px-regular autofill-body-lg",
  "40": "typography-body-default-16px-regular autofill-body-lg",
  "32": "typography-body-small-14px-regular autofill-body-md",
};

const SIDE_LABEL_TYPOGRAPHY: Record<TextFieldSize, string> = {
  "48": "typography-body-default-16px-regular",
  "40": "typography-body-default-16px-regular",
  "32": "typography-body-small-14px-regular",
};

function getContainerClassName(size: TextFieldSize, error: boolean, disabled?: boolean) {
  return cn(
    "relative flex items-center overflow-hidden rounded-sm border bg-inputs-inputs-primary has-focus-visible:shadow-focus-ring has-focus-visible:outline-none motion-safe:transition-colors",
    CONTAINER_PADDING_X[size],
    CONTAINER_GAP[size],
    error ? "border-error-content" : "border-border-primary",
    !disabled && !error && "hover:border-neutral-alphas-400",
    CONTAINER_HEIGHT[size],
    disabled && "opacity-50",
  );
}

function LeadingIcon({ children }: { children?: React.ReactNode }) {
  if (!children) return null;
  return (
    <span className="pointer-events-none flex size-4 shrink-0 items-center justify-center text-content-secondary">
      {children}
    </span>
  );
}

function SideLabel({
  id,
  size,
  align,
  children,
}: {
  id?: string;
  size: TextFieldSize;
  align: "left" | "right";
  children?: React.ReactNode;
}) {
  if (!children) return null;
  return (
    <span
      id={id}
      className={cn(
        "shrink-0 select-none whitespace-nowrap text-content-tertiary",
        align === "right" && "text-right",
        SIDE_LABEL_TYPOGRAPHY[size],
      )}
    >
      {children}
    </span>
  );
}

function TrailingAdornment({
  rightIcon,
  validated,
}: {
  rightIcon?: React.ReactNode;
  validated: boolean;
}) {
  if (!rightIcon && !validated) return null;
  return (
    <span className="flex shrink-0 items-center gap-2 text-content-secondary">
      {rightIcon && (
        <span data-tf-interactive="" className="flex size-4 shrink-0 items-center justify-center">
          {rightIcon}
        </span>
      )}
      {validated && (
        <span className="pointer-events-none flex size-4 shrink-0 items-center justify-center">
          <CheckOutlineIcon className="text-success-content" />
        </span>
      )}
    </span>
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
        "typography-description-12px-regular px-2 pt-2 pb-0.5",
        error ? "text-error-content" : "text-content-secondary",
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
 * A text input field with optional label, helper/error text, icon slots, and side labels.
 *
 * Use `leftLabel` / `rightLabel` for fixed unit or prefix affordances (currency symbol,
 * country code, domain suffix). Provide at least one of `label`, `aria-label`, or
 * `aria-labelledby` for accessibility — a console warning is emitted in development if none are set.
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
 *
 * @example
 * ```tsx
 * <TextField label="Price" leftLabel="$" rightLabel="USD" placeholder="0.00" />
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
      leftLabel,
      rightLabel,
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
    const leftLabelId = `${inputId}-left-label`;
    const rightLabelId = `${inputId}-right-label`;
    const bottomText = error && errorMessage ? errorMessage : helperText;

    const describedBy =
      [
        leftLabel != null ? leftLabelId : null,
        rightLabel != null ? rightLabelId : null,
        bottomText ? helperTextId : null,
      ]
        .filter(Boolean)
        .join(" ") || undefined;

    const innerRef = React.useRef<HTMLInputElement>(null);
    const setRefs = React.useCallback(
      (node: HTMLInputElement | null) => {
        innerRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) (ref as React.MutableRefObject<HTMLInputElement | null>).current = node;
      },
      [ref],
    );

    // Keep clicks on the non-interactive adornments (icons, side labels, padding)
    // focusing the input, matching the old absolute/pointer-events-none layout.
    const handleContainerMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
      if (disabled) return;
      const target = event.target as HTMLElement;
      if (target === innerRef.current) return;
      if (target.closest("[data-tf-interactive]")) return;
      event.preventDefault();
      innerRef.current?.focus();
    };

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

        {/* biome-ignore lint/a11y/noStaticElementInteractions: focus bridge delegates pointer clicks on adornments to the input */}
        <div
          className={getContainerClassName(size, error, disabled)}
          onMouseDown={handleContainerMouseDown}
        >
          <LeadingIcon>{leftIcon}</LeadingIcon>
          <SideLabel id={leftLabelId} size={size} align="left">
            {leftLabel}
          </SideLabel>

          <input
            ref={setRefs}
            id={inputId}
            disabled={disabled}
            aria-describedby={describedBy}
            aria-invalid={error || undefined}
            className={cn(
              "h-full min-w-0 flex-1 bg-transparent text-content-primary no-underline placeholder:text-content-tertiary focus:outline-none disabled:cursor-not-allowed",
              INPUT_TYPOGRAPHY[size],
              "[&[type='search']::-webkit-search-cancel-button]:hidden [&[type='search']::-webkit-search-cancel-button]:appearance-none",
            )}
            {...props}
          />

          <SideLabel id={rightLabelId} size={size} align="right">
            {rightLabel}
          </SideLabel>
          <TrailingAdornment rightIcon={rightIcon} validated={validated} />
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
