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
  const { range_start, range_end } = modifiers;
  const isSingleDayRange = range_start && range_end;

  return (
    <div
      className={cn(
        className,
        (range_start || range_end) && !isSingleDayRange && "from-50% from-transparent to-50%",
        range_start && !isSingleDayRange && "bg-linear-to-r to-brand-green-50",
        range_end && !isSingleDayRange && "bg-linear-to-l to-brand-green-50",
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

  return (
    <button
      ref={ref}
      type="button"
      className={cn(
        "relative z-10 inline-flex size-10 cursor-pointer items-center justify-center rounded-lg",
        "typography-body-2-regular",
        "transition-colors hover:bg-brand-green-50",
        "focus-visible:outline-none focus-visible:outline-offset-[-2px] focus-visible:ring-2 focus-visible:ring-brand-purple-500",
        "disabled:cursor-not-allowed disabled:opacity-50",
        modifiers.today && !modifiers.selected && "border border-brand-green-500",
        modifiers.selected && !modifiers.range_middle
          ? "bg-brand-green-500 text-body-black-solid-constant hover:bg-brand-green-500"
          : "text-body-100",
        modifiers.range_middle && "rounded-none bg-transparent",
        modifiers.outside && "pointer-events-none opacity-50",
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
 *   type="double"
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
          "inline-flex flex-col rounded-2xl border border-neutral-200 bg-background-inverse-solid shadow-[0px_6px_12px_0px_rgba(0,0,0,0.1)] backdrop-blur-sm",
          className,
        )}
      >
        <DayPicker
          showOutsideDays
          numberOfMonths={numberOfMonths}
          formatters={{
            formatCaption: (date: Date) =>
              date.toLocaleDateString("en-US", { month: "short", year: "numeric" }),
            ...formatters,
          }}
          classNames={{
            root: "w-full",
            months: "relative flex",
            month: "flex flex-1 flex-col",
            month_caption: cn("flex items-center py-4", isMulti ? "justify-center px-2" : "px-5"),
            caption_label: "typography-body-1-semibold text-body-100",
            nav: cn(
              "absolute top-4 z-20 flex",
              isMulti ? "pointer-events-none inset-x-3 justify-between" : "right-3 gap-1",
            ),
            button_previous:
              "pointer-events-auto inline-flex size-8 cursor-pointer items-center justify-center rounded-full text-body-100 transition-colors hover:bg-brand-green-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-purple-500 disabled:cursor-not-allowed disabled:opacity-50", // !TODO https://linear.app/fanvue/issue/ENG-7301/swap-out-typography-tailwind-utility-classes
            button_next:
              "pointer-events-auto inline-flex size-8 cursor-pointer items-center justify-center rounded-full text-body-100 transition-colors hover:bg-brand-green-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-purple-500 disabled:cursor-not-allowed disabled:opacity-50", // !TODO https://linear.app/fanvue/issue/ENG-7301/swap-out-typography-tailwind-utility-classes
            month_grid: cn("mb-4", isMulti ? "mx-2" : "mx-4"),
            weekdays: "flex",
            weekday:
              "flex h-[30px] w-10 flex-1 items-center justify-center typography-body-2-regular text-body-200",
            week: "flex overflow-hidden rounded-lg",
            day: "relative flex w-10 flex-1 items-center justify-center",
            range_middle: "bg-brand-green-50",
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
          <div className="flex gap-4 px-5 pb-4">
            <Button variant="secondary" size="40" className="flex-1" onClick={onCancel}>
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
