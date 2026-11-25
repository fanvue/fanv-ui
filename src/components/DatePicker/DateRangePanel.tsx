import { forwardRef, useState } from "react";
import type { DateRange, DayPickerProps } from "react-day-picker";
import { cn } from "../../utils/cn";
import { Button } from "../Button/Button";
import { CheckIcon } from "../Icons/CheckIcon";
import { DatePicker } from "./DatePicker";

/** A named preset the caller maps to a date range. The kit does no date maths. */
export interface DateRangePreset {
  /** Stable identifier emitted in `{ type: "preset", presetId }`. */
  id: string;
  /** Visible, already translated label. */
  label: string;
}

/** The applied selection: one of the caller's presets, or an explicit custom range. */
export type DateRangeValue =
  | { type: "preset"; presetId: string }
  | { type: "custom"; range: { from: Date; to: Date } };

/** Calendar options forwarded to the custom range calendar. */
export type DateRangeCalendarProps = Pick<
  DayPickerProps,
  "disabled" | "startMonth" | "endMonth" | "weekStartsOn" | "locale"
>;

/** Props for {@link DateRangePanel}. */
export interface DateRangePanelProps {
  /** Preset rows, in display order. */
  presets: readonly DateRangePreset[];
  /** Label of the row that opens the calendar. */
  customRangeLabel: string;
  /** The applied selection. A custom value opens the panel on the calendar. */
  value: DateRangeValue;
  /** Called with a preset on click, and with a custom range on Apply (or on the second pick when `confirmCustomRange` is false). */
  onValueChange: (value: DateRangeValue) => void;
  /** Label of the Apply button, which is disabled until the draft range has both ends. @default "Apply" */
  applyLabel?: string;
  /** Label of the Cancel button. @default "Cancel" */
  cancelLabel?: string;
  /** Called after Cancel drops the draft and the panel returns to the preset list. */
  onCancel?: () => void;
  /**
   * When `true`, the calendar shows Cancel and Apply. Apply is disabled only while no day is picked,
   * and a single click is a one-day range. When `false`, there is no footer and every selection with
   * both ends emits at once, so the first click emits a one-day range and a second click emits the longer one.
   * @default true
   */
  confirmCustomRange?: boolean;
  /** Bounds, locale and first weekday for the calendar. */
  calendarProps?: DateRangeCalendarProps;
  /** Accessible name of the preset list. */
  "aria-label"?: string;
  /** Additional CSS class name for the root element. */
  className?: string;
}

interface DateRangeRowProps {
  selected: boolean;
  onClick: () => void;
  children: string;
}

function DateRangeRow({ selected, onClick, children }: DateRangeRowProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={cn(
        "typography-body-small-14px-regular flex min-h-8 w-full cursor-pointer items-center gap-2 rounded-sm px-3 py-[7px] text-start outline-none",
        "hover:bg-interaction-hover focus-visible:shadow-focus-ring",
        selected && "bg-buttons-navigation-hover font-semibold",
      )}
    >
      <span className="min-w-0 flex-1 truncate">{children}</span>
      {selected && <CheckIcon className="size-4 shrink-0" aria-hidden />}
    </button>
  );
}

/**
 * A list of date range presets with a "Custom range" row that swaps to a calendar.
 * It renders no popover, so it can sit inside a popover or a phone sheet.
 * The caller maps preset ids to dates.
 *
 * @example
 * ```tsx
 * <DateRangePanel
 *   presets={[{ id: "7d", label: "Last 7 days" }]}
 *   customRangeLabel="Custom range"
 *   value={value}
 *   onValueChange={setValue}
 * />
 * ```
 */
export const DateRangePanel = forwardRef<HTMLDivElement, DateRangePanelProps>(
  (
    {
      presets,
      customRangeLabel,
      value,
      onValueChange,
      applyLabel = "Apply",
      cancelLabel = "Cancel",
      onCancel,
      confirmCustomRange = true,
      calendarProps,
      "aria-label": ariaLabel,
      className,
    },
    ref,
  ) => {
    const appliedRange = value.type === "custom" ? value.range : undefined;
    const [showCalendar, setShowCalendar] = useState(value.type === "custom");
    const [draft, setDraft] = useState<DateRange | undefined>(appliedRange);

    const openCalendar = () => {
      setDraft(appliedRange);
      setShowCalendar(true);
    };

    const handleSelect = (range: DateRange | undefined) => {
      setDraft(range);
      if (!confirmCustomRange && range?.from && range.to) {
        onValueChange({ type: "custom", range: { from: range.from, to: range.to } });
      }
    };

    const apply = () => {
      if (draft?.from && draft.to) {
        onValueChange({ type: "custom", range: { from: draft.from, to: draft.to } });
      }
    };

    const cancel = () => {
      setDraft(undefined);
      setShowCalendar(false);
      onCancel?.();
    };

    return (
      <div ref={ref} className={cn("flex flex-col", className)}>
        {showCalendar ? (
          <>
            <DatePicker
              mode="range"
              variant="single"
              size="32"
              showFooter={false}
              defaultMonth={appliedRange?.from}
              selected={draft}
              onSelect={handleSelect}
              className="rounded-none border-0 bg-transparent p-0 shadow-none backdrop-blur-none"
              {...calendarProps}
            />
            {confirmCustomRange && (
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="secondary" size="32" onClick={cancel}>
                  {cancelLabel}
                </Button>
                <Button
                  variant="primary"
                  size="32"
                  disabled={!draft?.from || !draft.to}
                  onClick={apply}
                >
                  {applyLabel}
                </Button>
              </div>
            )}
          </>
        ) : (
          <fieldset aria-label={ariaLabel} className="m-0 flex min-w-48 flex-col border-0 p-0">
            {presets.map((preset) => (
              <DateRangeRow
                key={preset.id}
                selected={value.type === "preset" && value.presetId === preset.id}
                onClick={() => onValueChange({ type: "preset", presetId: preset.id })}
              >
                {preset.label}
              </DateRangeRow>
            ))}
            <hr className="my-[5px] h-px border-0 bg-neutral-alphas-200" />
            <DateRangeRow selected={value.type === "custom"} onClick={openCalendar}>
              {customRangeLabel}
            </DateRangeRow>
          </fieldset>
        )}
      </div>
    );
  },
);

DateRangePanel.displayName = "DateRangePanel";
