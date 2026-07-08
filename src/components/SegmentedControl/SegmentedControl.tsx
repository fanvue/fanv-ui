import * as React from "react";
import { cn } from "../../utils/cn";

/** Height of the segmented control in pixels. */
export type SegmentedControlSize = "32" | "40" | "48";

/**
 * Segment layout.
 * - `"hug"`: each segment is sized to its content.
 * - `"fill"`: the control spans the full width of its container and each segment grows equally.
 */
export type SegmentedControlVariant = "hug" | "fill";

/**
 * Visual style of the control.
 * - `"pill"`: the container has a muted background and the selected segment shows a filled pill (default).
 * - `"plain"`: no container or selected-pill background; segments are bare content and selection is
 *   communicated by color alone. Designed for icon-only toggles (e.g. a list/grid view switch).
 */
export type SegmentedControlAppearance = "pill" | "plain";

/** Describes one selectable segment. */
export interface SegmentedControlOption {
  /**
   * Display label for the segment. When `icon` is provided, the segment renders icon-only and
   * this value is used as its accessible name (applied as `aria-label`) instead of visible text.
   */
  label: string;
  /** Value identifier returned via `onChange`. */
  value: string;
  /**
   * Icon to render instead of the visible label. When set, the segment renders icon-only and
   * `label` becomes required as its accessible name — it is applied as `aria-label` and no
   * visible text is rendered.
   */
  icon?: React.ReactNode;
}

export interface SegmentedControlProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  /** Height of the control in pixels. @default "32" */
  size?: SegmentedControlSize;
  /** Segment layout. @default "hug" */
  variant?: SegmentedControlVariant;
  /** Visual style of the control. @default "pill" */
  appearance?: SegmentedControlAppearance;
  /** The selectable segments. Designed for two or three mutually exclusive options. */
  options: SegmentedControlOption[];
  /** Currently selected value (controlled). */
  value?: string;
  /** Initially selected value (uncontrolled). Defaults to the first option. */
  defaultValue?: string;
  /** Callback fired when the selected value changes. */
  onChange?: (value: string) => void;
  /** Whether the control is disabled. @default false */
  disabled?: boolean;
}

/** Padding and typography per size. Combined with the container's `p-1` these hit the 32/40/48px heights. */
const sizeClasses: Record<SegmentedControlSize, string> = {
  "32": "px-2 py-1 typography-description-12px-semibold",
  "40": "px-3 py-1.75 typography-body-small-14px-semibold",
  "48": "px-4 py-2 typography-body-default-16px-semibold",
};

function warnMissingAccessibleName(ariaLabel?: string, ariaLabelledBy?: string) {
  if (process.env.NODE_ENV !== "production") {
    if (!ariaLabel && !ariaLabelledBy) {
      console.warn(
        "SegmentedControl: no accessible name provided. Pass an `aria-label` or `aria-labelledby` prop.",
      );
    }
  }
}

function warnMissingOptionAccessibleName(options: SegmentedControlOption[]) {
  if (process.env.NODE_ENV !== "production") {
    for (const option of options) {
      if (option.icon && !option.label?.trim()) {
        console.warn(
          `SegmentedControl: icon-only segment "${option.value}" is missing a non-empty \`label\` to use as its accessible name.`,
        );
      }
    }
  }
}

function getSegmentClassName({
  appearance,
  size,
  variant,
  isSelected,
  disabled,
}: {
  appearance: SegmentedControlAppearance;
  size: SegmentedControlSize;
  variant: SegmentedControlVariant;
  isSelected: boolean;
  disabled: boolean;
}) {
  return cn(
    "relative inline-flex min-w-0 cursor-pointer items-center justify-center rounded-full",
    "motion-safe:transition-colors motion-safe:duration-150 motion-safe:ease-in-out",
    "focus-visible:shadow-focus-ring focus-visible:outline-none",
    variant === "fill" ? "flex-1" : "shrink-0",
    appearance === "plain"
      ? cn(
          // Padding + negative margin enlarge the hit target without changing the
          // visual footprint, which must stay glyph-only to match the design.
          "-m-1 p-1",
          isSelected ? "text-icons-primary" : "text-icons-tertiary hover:text-icons-primary",
        )
      : cn(
          sizeClasses[size],
          isSelected
            ? "bg-buttons-primary-default text-content-primary-inverted shadow-sm"
            : "text-content-primary hover:bg-buttons-switch-hover",
        ),
    disabled && "pointer-events-none",
  );
}

/**
 * A compact selector for choosing between two or three mutually exclusive
 * options where the choice affects the content immediately below it. Use
 * instead of tabs when the options are more like settings or filters than
 * navigation, such as toggling a list/grid view or a monthly/annual price.
 *
 * Rendered as a `radiogroup` with roving-tabindex keyboard navigation. Supports
 * both controlled and uncontrolled usage.
 *
 * @example
 * ```tsx
 * <SegmentedControl
 *   options={[
 *     { label: "Net", value: "net" },
 *     { label: "Gross", value: "gross" },
 *   ]}
 *   value={amount}
 *   onChange={setAmount}
 *   aria-label="Amount type"
 * />
 * ```
 *
 * @example Icon-only segments (e.g. a list/grid view toggle)
 * ```tsx
 * <SegmentedControl
 *   appearance="plain"
 *   options={[
 *     { label: "List view", value: "list", icon: <ListViewIcon size={16} /> },
 *     { label: "Grid view", value: "grid", icon: <GridViewIcon size={16} /> },
 *   ]}
 *   value={view}
 *   onChange={setView}
 *   aria-label="View"
 * />
 * ```
 */
export const SegmentedControl = React.forwardRef<HTMLDivElement, SegmentedControlProps>(
  (
    {
      className,
      size = "32",
      variant = "hug",
      appearance = "pill",
      options,
      value: controlledValue,
      defaultValue,
      onChange,
      disabled = false,
      ...props
    },
    ref,
  ) => {
    warnMissingAccessibleName(props["aria-label"], props["aria-labelledby"]);
    warnMissingOptionAccessibleName(options);

    // Tracks selection for uncontrolled usage; ignored when `value` prop is provided
    const [internalValue, setInternalValue] = React.useState(defaultValue ?? options[0]?.value);
    const isControlled = controlledValue !== undefined;
    const currentValue = isControlled ? controlledValue : internalValue;
    const anySelected = options.some((o) => o.value === currentValue);
    const buttonRefs = React.useRef<(HTMLButtonElement | null)[]>([]);

    const handleSelect = (optionValue: string) => {
      if (disabled || optionValue === currentValue) return;
      if (!isControlled) {
        setInternalValue(optionValue);
      }
      onChange?.(optionValue);
    };

    const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
      const nextIndex =
        e.key === "ArrowRight" || e.key === "ArrowDown"
          ? (index + 1) % options.length
          : e.key === "ArrowLeft" || e.key === "ArrowUp"
            ? (index - 1 + options.length) % options.length
            : null;
      if (nextIndex === null) return;
      e.preventDefault();
      const nextOption = options[nextIndex] as SegmentedControlOption;
      handleSelect(nextOption.value);
      buttonRefs.current[nextIndex]?.focus();
    };

    return (
      <div
        ref={ref}
        role="radiogroup"
        className={cn(
          "relative items-center rounded-full",
          variant === "fill" ? "flex w-full" : "inline-flex",
          appearance === "plain" ? "gap-2" : "bg-surface-tertiary p-1",
          disabled && "cursor-not-allowed opacity-50",
          className,
        )}
        {...props}
      >
        {options.map((option, index) => {
          const isSelected = currentValue === option.value;
          return (
            // biome-ignore lint/a11y/useSemanticElements: native radio inputs only allow Tab-focus on the checked item; buttons with roving tabindex give full keyboard navigation
            <button
              key={option.value}
              ref={(el) => {
                buttonRefs.current[index] = el;
              }}
              type="button"
              role="radio"
              aria-checked={isSelected}
              tabIndex={isSelected || (!anySelected && index === 0) ? 0 : -1}
              disabled={disabled}
              aria-label={option.icon ? option.label : undefined}
              onClick={() => handleSelect(option.value)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className={getSegmentClassName({ appearance, size, variant, isSelected, disabled })}
            >
              {option.icon ? (
                <span className="flex shrink-0 items-center justify-center" aria-hidden="true">
                  {option.icon}
                </span>
              ) : (
                <span className="min-w-0 truncate">{option.label}</span>
              )}
            </button>
          );
        })}
      </div>
    );
  },
);

SegmentedControl.displayName = "SegmentedControl";
