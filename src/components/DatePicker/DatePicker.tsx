import { forwardRef, useEffect, useRef } from "react";
import {
  type ChevronProps,
  type DateRange,
  type DayButtonProps,
  DayPicker,
  type DayPickerProps,
  type DayProps,
  type Modifiers,
  type MonthGridProps,
  type WeekdayProps,
  type WeekdaysProps,
  type WeekProps,
  type WeeksProps,
} from "react-day-picker";
import { cn } from "../../utils/cn";
import type { OmitDistributed } from "../../utils/types";
import { Button } from "../Button/Button";
import { ChevronLeftIcon } from "../Icons/ChevronLeftIcon";
import { ChevronRightIcon } from "../Icons/ChevronRightIcon";

export type { DateRange }; // Needed by consumers when passing props

/** Layout variant — single or side-by-side month display. */
export type DatePickerVariant = "single" | "double";

/** Props specific to the DatePicker wrapper (not inherited from react-day-picker). */
export interface DatePickerOwnProps {
  /** Display one month or two side-by-side. @default "single" */
  variant?: DatePickerVariant;
  /** Callback fired when the Apply button is clicked. */
  onApply?: () => void;
  /** Callback fired when the Cancel button is clicked. */
  onCancel?: () => void;
  /** Label for the cancel button. @default "Cancel" */
  cancelLabel?: string;
  /** Label for the apply button. @default "Apply" */
  applyLabel?: string;
  /** Whether to render the cancel / apply footer buttons. @default true */
  showFooter?: boolean;
  /** Additional CSS class name for the outer container. */
  className?: string;
}

function Day({ day, modifiers, className, ...divProps }: DayProps) {
  const { range_start, range_end, range_middle } = modifiers;
  const isSingleDayRange = range_start && range_end;
  const inRange = (range_start || range_end || range_middle) && !isSingleDayRange;

  return (
    <div
      className={cn(
        className,
        inRange && "bg-inputs-calendar-range",
        inRange && range_start && "rounded-l-sm",
        inRange && range_end && "rounded-r-sm",
      )}
      {...divProps}
    />
  );
}

function DayButton({ day, modifiers, className, ...buttonProps }: DayButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (modifiers.focused) ref.current?.focus();
  }, [modifiers.focused]);

  const isSelected = modifiers.selected && !modifiers.range_middle;

  return (
    <button
      ref={ref}
      type="button"
      className={cn(
        "relative z-10 inline-flex size-10 cursor-pointer items-center justify-center rounded-sm text-content-primary",
        "transition-colors hover:bg-inputs-calendar-range not-disabled:active:bg-inputs-calendar-range",
        "focus-visible:shadow-focus-ring focus-visible:outline-none",
        "disabled:cursor-not-allowed",
        isSelected ? "typography-body-small-14px-semibold" : "typography-body-small-14px-regular",
        modifiers.today &&
          !isSelected &&
          "bg-inputs-calendar-today text-content-always-white hover:bg-inputs-calendar-today",
        isSelected &&
          "bg-inputs-calendar-selected text-content-primary-inverted hover:bg-inputs-calendar-selected",
        modifiers.range_middle && "bg-transparent hover:bg-transparent",
        modifiers.disabled &&
          "bg-inputs-calendar-disabled text-content-disabled hover:bg-inputs-calendar-disabled",
        modifiers.outside && "pointer-events-none text-content-disabled",
      )}
      {...buttonProps}
    />
  );
}

/** Combined props — own DatePicker options plus all react-day-picker props (except `numberOfMonths`). */
export type DatePickerProps = DatePickerOwnProps &
  OmitDistributed<DayPickerProps, "numberOfMonths">;

/**
 * A calendar date picker supporting single-date and date-range selection with
 * optional side-by-side month display and footer action buttons.
 *
 * Built on top of [react-day-picker](https://react-day-picker.js.org/) — all
 * `DayPickerProps` (except `numberOfMonths`) are forwarded.
 *
 * @example
 * ```tsx
 * <DatePicker
 *   mode="range"
 *   variant="double"
 *   selected={range}
 *   onSelect={setRange}
 *   onApply={save}
 *   onCancel={close}
 * />
 * ```
 */
export const DatePicker = forwardRef<HTMLDivElement, DatePickerProps>(
  (
    {
      variant = "single",
      onApply,
      onCancel,
      cancelLabel = "Cancel",
      applyLabel = "Apply",
      showFooter = true,
      className,
      formatters,
      ...dayPickerProps
    },
    ref,
  ) => {
    const numberOfMonths = variant === "double" ? 2 : 1;
    const isMulti = numberOfMonths > 1;

    // Wrap onSelect for range mode: when clicking inside a complete range,
    // move the nearest boundary instead of always resetting the end date.
    const resolvedDayPickerProps = (() => {
      if (dayPickerProps.mode !== "range") return dayPickerProps;

      const { selected, onSelect } = dayPickerProps as {
        selected?: DateRange;
        onSelect?: (
          range: DateRange | undefined,
          triggerDate: Date,
          modifiers: Modifiers,
          e: React.MouseEvent | React.KeyboardEvent,
        ) => void;
      };

      if (!onSelect || !selected?.from || !selected?.to) return dayPickerProps;

      const { from, to } = selected;

      return {
        ...dayPickerProps,
        onSelect: (
          range: DateRange | undefined,
          triggerDate: Date,
          modifiers: Modifiers,
          e: React.MouseEvent | React.KeyboardEvent,
        ) => {
          const clickedTime = triggerDate.getTime();
          const fromTime = from.getTime();
          const toTime = to.getTime();

          if (clickedTime > fromTime && clickedTime < toTime) {
            if (clickedTime - fromTime <= toTime - clickedTime) {
              onSelect({ from: triggerDate, to }, triggerDate, modifiers, e);
            } else {
              onSelect({ from, to: triggerDate }, triggerDate, modifiers, e);
            }
            return;
          }

          onSelect(range, triggerDate, modifiers, e);
        },
      } as typeof dayPickerProps;
    })();

    return (
      <div
        ref={ref}
        className={cn(
          "inline-flex flex-col rounded-xl border border-modal-stroke bg-modal-background p-6 shadow-blur-menu backdrop-blur-sm",
          className,
        )}
      >
        <DayPicker
          showOutsideDays
          numberOfMonths={numberOfMonths}
          formatters={{
            formatCaption: (date: Date) =>
              date.toLocaleDateString("en-US", { month: "long", year: "numeric" }),
            ...formatters,
          }}
          classNames={{
            root: "w-full",
            months: cn("relative flex", isMulti && "gap-6"),
            month: "flex flex-1 flex-col",
            month_caption: "mb-4 flex h-8 items-center justify-center",
            caption_label: "typography-body-default-16px-regular text-content-primary",
            nav: "absolute inset-x-0 top-0 z-20 flex justify-between",
            button_previous:
              "pointer-events-auto inline-flex size-8 cursor-pointer items-center justify-center rounded-full bg-buttons-secondary-default text-content-primary transition-colors hover:bg-buttons-secondary-hover focus-visible:shadow-focus-ring focus-visible:outline-none disabled:cursor-not-allowed disabled:bg-buttons-disabled-default disabled:text-content-disabled [&>svg]:size-4",
            button_next:
              "pointer-events-auto inline-flex size-8 cursor-pointer items-center justify-center rounded-full bg-buttons-secondary-default text-content-primary transition-colors hover:bg-buttons-secondary-hover focus-visible:shadow-focus-ring focus-visible:outline-none disabled:cursor-not-allowed disabled:bg-buttons-disabled-default disabled:text-content-disabled [&>svg]:size-4",
            month_grid: "w-full",
            weekdays: "flex",
            weekday:
              "flex h-[30px] w-10 flex-1 items-center justify-center typography-body-small-14px-regular text-content-secondary",
            week: "flex",
            day: "relative flex w-10 flex-1 items-center justify-center",
            hidden: "hidden",
          }}
          components={{
            /**
             * !NOTE: We're unable to use semantic elements for the grid due to rdp, as such we've disabled the a11y lint rules for these elements in biome.json.
             */
            Chevron: ({ orientation }: ChevronProps) =>
              orientation === "left" ? <ChevronLeftIcon /> : <ChevronRightIcon />,
            MonthGrid: (props: MonthGridProps) => <div role="grid" {...props} />,
            Weekdays: (props: WeekdaysProps) => <div role="row" {...props} />,
            Weekday: (props: WeekdayProps) => <div role="columnheader" {...props} />,
            Weeks: (props: WeeksProps) => <div role="rowgroup" {...props} />,
            Week: ({ week, ...props }: WeekProps) => <div role="row" {...props} />,
            Day,
            DayButton,
          }}
          {...resolvedDayPickerProps}
        />

        {showFooter && (
          <div className="flex gap-2 pt-6">
            <Button variant="outline" size="40" className="flex-1" onClick={onCancel}>
              {cancelLabel}
            </Button>
            <Button variant="primary" size="40" className="flex-1" onClick={onApply}>
              {applyLabel}
            </Button>
          </div>
        )}
      </div>
    );
  },
);

DatePicker.displayName = "DatePicker";
