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
 * - `"24"` — 24px box with an 8px radius (Figma V2 Checkbox Size=24px), 12px gap to the label.
 * - `"default"` and `"small"` are legacy aliases retained for back-compat
 *   (`"default"` → `"20"`, `"small"` → `"20"` with smaller label typography).
 */
export type CheckboxSize =
  | "20"
  | "16"
  | "24"
  /** @deprecated Use `"20"` instead. */
  | "default"
  /** @deprecated Use `"20"` (the smaller-typography variant remains via `"small"`). */
  | "small";

type BoxSize = "20" | "16" | "24";

const BOX_SIZE_CLASS: Record<BoxSize, string> = {
  "20": "size-5",
  "16": "size-4",
  "24": "size-6",
};

const BOX_RADIUS_CLASS: Record<BoxSize, string> = {
  "20": "rounded",
  "16": "rounded",
  "24": "rounded-xs",
};

const INDICATOR_SIZE_CLASS: Record<BoxSize, string> = {
  "20": "size-3",
  "16": "size-2.5",
  "24": "size-4",
};

const LABEL_GAP_CLASS: Record<BoxSize, string> = {
  "20": "gap-2",
  "16": "gap-2",
  "24": "gap-3",
};

/** Helper text indent that lines it up under the label: box width + gap. */
const HELPER_INDENT_CLASS: Record<BoxSize, string> = {
  "20": "ml-7",
  "16": "ml-7",
  "24": "ml-9",
};

/** Trailing placement has the box after the label, so the helper needs no indent. */
const getHelperIndentClass = (boxSize: BoxSize, isTrailing: boolean) =>
  isTrailing ? "" : HELPER_INDENT_CLASS[boxSize];

/** Vertical offset of the box against the first label line. The 24px box matches the 24px line height. */
const BOX_OFFSET_CLASS: Record<BoxSize, { withHelper: string; plain: string }> = {
  "20": { withHelper: "mt-1", plain: "mt-0.5" },
  "16": { withHelper: "mt-1", plain: "mt-0.5" },
  "24": { withHelper: "", plain: "" },
};

/** Legacy `"default"` / `"small"` sizes render the 20px box. */
const resolveBoxSize = (size: CheckboxSize): BoxSize =>
  size === "16" || size === "24" ? size : "20";

/** Where the label sits relative to the box. */
export type CheckboxLabelPlacement = "leading" | "trailing";

export interface CheckboxProps
  extends Omit<React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>, "asChild"> {
  /** Size variant. @default "20" */
  size?: CheckboxSize;
  /**
   * Which side of the label the box sits on. `"leading"` puts the box before the
   * label (the existing behaviour), `"trailing"` puts it after.
   * @default "leading"
   */
  labelPlacement?: CheckboxLabelPlacement;
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
  (
    { className, size = "20", labelPlacement, label, helperText, disabled, name, ...props },
    ref,
  ) => {
    const id = React.useId();
    const helperTextId = helperText ? `${id}-helper` : undefined;
    const hasLabel = Boolean(label || helperText);
    const boxSize = resolveBoxSize(size);
    const isTrailing = labelPlacement === "trailing";
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
          label && BOX_OFFSET_CLASS[boxSize][helperText ? "withHelper" : "plain"],
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
            "flex items-center justify-center border",
            BOX_RADIUS_CLASS[boxSize],
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
        <div
          className={cn(
            "group inline-flex items-start",
            LABEL_GAP_CLASS[boxSize],
            isTrailing && "flex-row-reverse",
          )}
        >
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
              "text-content-secondary",
              // Align the helper under the label: box width + gap (leading only)
              getHelperIndentClass(boxSize, isTrailing),
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
