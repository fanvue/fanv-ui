import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import * as React from "react";
import { cn } from "../../utils/cn";
import { CheckIcon } from "../Icons/CheckIcon";
import { MinusIcon } from "../Icons/MinusIcon";

/**
 * Size variant for the checkbox.
 *
 * - `"20"` (default) — 20px box, body-lg label.
 * - `"16"` — 16px box, body-md label, used in compact contexts like data tables.
 * - `"default"` and `"small"` are legacy aliases retained for back-compat
 *   (`"default"` → `"20"`, `"small"` → `"20"` with smaller label typography).
 */
export type CheckboxSize =
  | "20"
  | "16"
  /** @deprecated Use `"20"` instead. */
  | "default"
  /** @deprecated Use `"20"` (the smaller-typography variant remains via `"small"`). */
  | "small";

const BOX_SIZE_CLASS: Record<"20" | "16", string> = {
  "20": "size-5",
  "16": "size-4",
};

const INDICATOR_SIZE_CLASS: Record<"20" | "16", string> = {
  "20": "size-3",
  "16": "size-2.5",
};

export interface CheckboxProps
  extends Omit<React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>, "asChild"> {
  /** Size variant. @default "20" */
  size?: CheckboxSize;
  /** Label text displayed next to the checkbox. */
  label?: string;
  /** Descriptive text displayed below the label. */
  helperText?: string;
}

/**
 * A checkbox input with optional label and helper text. Supports checked,
 * unchecked, and indeterminate states.
 *
 * The ref type is intentionally `HTMLInputElement` (not `HTMLButtonElement`) for
 * form-library compatibility — libraries like react-hook-form call `register()`
 * which expects an `HTMLInputElement` ref. A hidden `<input>` is synced to the
 * Radix checkbox state via `useImperativeHandle`.
 *
 * @example
 * ```tsx
 * <Checkbox label="Accept terms" helperText="Required to continue" />
 * ```
 */
export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, size = "20", label, helperText, disabled, name, ...props }, ref) => {
    const id = React.useId();
    const helperTextId = helperText ? `${id}-helper` : undefined;
    const hasLabel = Boolean(label || helperText);
    const boxSize: "20" | "16" = size === "16" ? "16" : "20";
    const useSmallLabelTypography = size === "small";

    if (
      process.env.NODE_ENV !== "production" &&
      !label &&
      !props["aria-label"] &&
      !props["aria-labelledby"]
    ) {
      console.warn(
        "Checkbox: No accessible name provided. Add a `label`, `aria-label`, or `aria-labelledby` prop so screen readers can announce this checkbox.",
      );
    }

    // Hidden input for form library compatibility (e.g. react-hook-form register)
    const inputRef = React.useRef<HTMLInputElement>(null);
    React.useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

    const handleCheckedChange = (value: boolean | "indeterminate") => {
      const checked = value === true;
      if (inputRef.current) {
        inputRef.current.checked = checked;
        inputRef.current.dispatchEvent(new Event("change", { bubbles: true }));
      }
      props.onCheckedChange?.(value);
    };

    const checkboxElement = (
      <span
        className={cn(
          "relative inline-flex shrink-0",
          BOX_SIZE_CLASS[boxSize],
          // Alignment when used with label
          label && (helperText ? "mt-1" : "mt-0.5"),
        )}
      >
        <input
          ref={inputRef}
          type="checkbox"
          name={name}
          disabled={disabled}
          aria-hidden
          tabIndex={-1}
          onChange={() => {}}
          className="pointer-events-none absolute size-px overflow-hidden opacity-0"
          style={{ clip: "rect(0,0,0,0)" }}
        />
        <CheckboxPrimitive.Root
          id={id}
          disabled={disabled}
          aria-describedby={helperTextId}
          data-testid="checkbox"
          {...props}
          onCheckedChange={handleCheckedChange}
          className={cn(
            // Base styles
            "flex items-center justify-center rounded border",
            BOX_SIZE_CLASS[boxSize],
            "transition-[border-color,background-color,color,box-shadow] duration-150",
            // Default state
            "border-content-primary bg-transparent text-transparent",
            // Checked state
            "data-[state=checked]:border-content-primary data-[state=checked]:bg-content-primary data-[state=checked]:text-content-primary-inverted",
            // Indeterminate state
            "data-[state=indeterminate]:border-content-primary data-[state=indeterminate]:bg-content-primary data-[state=indeterminate]:text-content-primary-inverted",
            // Hover & active state
            "hover:ring-2 hover:ring-brand-primary-default group-hover:ring-2 group-hover:ring-brand-primary-default",
            "not-disabled:active:ring-2 not-disabled:active:ring-brand-primary-default",
            // Focus state
            "focus-visible:shadow-focus-ring focus-visible:outline-none",
            // Disabled state
            "disabled:cursor-not-allowed disabled:border-neutral-alphas-600 disabled:ring-0 disabled:group-hover:ring-0",
            "disabled:data-[state=checked]:border-neutral-alphas-600 disabled:data-[state=checked]:bg-neutral-alphas-600 disabled:data-[state=checked]:text-content-tertiary",
            !hasLabel && className,
          )}
        >
          <CheckboxPrimitive.Indicator
            forceMount
            className={cn(
              "flex items-center justify-center text-content-primary-inverted",
              INDICATOR_SIZE_CLASS[boxSize],
              "data-[state=unchecked]:invisible",
            )}
          >
            {props.checked === "indeterminate" ? <MinusIcon /> : <CheckIcon />}
          </CheckboxPrimitive.Indicator>
        </CheckboxPrimitive.Root>
      </span>
    );

    if (!hasLabel) {
      return checkboxElement;
    }

    return (
      <div
        className={cn(
          "inline-flex flex-col gap-0.5",
          disabled && "is-disabled cursor-not-allowed",
          className,
        )}
      >
        <div className="group inline-flex items-start gap-2">
          {checkboxElement}
          {label && (
            <label
              htmlFor={id}
              className={cn(
                "cursor-pointer select-none text-content-primary",
                "group-has-disabled:cursor-not-allowed group-has-disabled:text-content-tertiary",
                useSmallLabelTypography
                  ? "typography-body-small-14px-semibold"
                  : "typography-body-default-16px-semibold",
              )}
            >
              {label}
            </label>
          )}
        </div>
        {helperText && (
          <span
            id={helperTextId}
            className={cn(
              "ml-7 text-content-secondary",
              "in-[.is-disabled]:cursor-not-allowed in-[.is-disabled]:text-content-tertiary",
              useSmallLabelTypography
                ? "typography-description-12px-regular"
                : "typography-body-small-14px-regular",
            )}
          >
            {helperText}
          </span>
        )}
      </div>
    );
  },
);

Checkbox.displayName = "Checkbox";
