import { createContext, forwardRef, useContext, useEffect, useRef } from "react";
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

/** Day button size in pixels. It also scales the navigation, caption, padding and footer buttons. */
export type DatePickerSize = "40" | "32";

/** Props specific to the DatePicker wrapper (not inherited from react-day-picker). */
export interface DatePickerOwnProps {
  /** Display one month or two side-by-side. @default "single" */
  variant?: DatePickerVariant;
  /**
   * Day button size in pixels. It also scales the navigation, caption, padding and footer buttons.
   * Use `"32"` for compact surfaces such as toolbar popovers.
   * @default "40"
   */
  size?: DatePickerSize;
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

const DatePickerSizeContext = createContext<DatePickerSize>("40");

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
  const size = useContext(DatePickerSizeContext);

  useEffect(() => {
    if (modifiers.focused) ref.current?.focus();
  }, [modifiers.focused]);

  const isSelected = modifiers.selected && !modifiers.range_middle;

  return (
    <button
      ref={ref}
      type="button"
      className={cn(
        "relative z-10 inline-flex cursor-pointer items-center justify-center rounded-sm text-content-primary",
        "transition-colors hover:bg-inputs-calendar-range not-disabled:active:bg-inputs-calendar-range",
        "focus-visible:shadow-focus-ring focus-visible:outline-none",
        "disabled:cursor-not-allowed",
        size === "40" && "size-10",
        size === "32" && "size-8",
        size === "40" &&
          (isSelected
            ? "typography-body-small-14px-semibold"
            : "typography-body-small-14px-regular"),
        size === "32" &&
          (isSelected
            ? "typography-description-12px-semibold"
            : "typography-description-12px-regular"),
        modifiers.today &&
          !isSelected &&
          "bg-inputs-calendar-today ring-1 ring-inputs-calendar-today-stroke hover:bg-inputs-calendar-today",
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
      size = "40",
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
    const isCompact = size === "32";
    const navButtonClassName = cn(
      "pointer-events-auto inline-flex cursor-pointer items-center justify-center rounded-full bg-buttons-secondary-default text-content-primary transition-colors hover:bg-buttons-secondary-hover focus-visible:shadow-focus-ring focus-visible:outline-none disabled:cursor-not-allowed disabled:bg-buttons-disabled-default disabled:text-content-disabled [&>svg]:size-4",
      isCompact ? "size-6" : "size-8",
    );

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
      <DatePickerSizeContext.Provider value={size}>
        <div
          ref={ref}
          className={cn(
            "inline-flex flex-col rounded-xl border border-modal-stroke bg-modal-background shadow-blur-menu backdrop-blur-sm",
            isCompact ? "p-4" : "p-6",
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
              month_caption: cn(
                "flex items-center justify-center",
                isCompact ? "mb-2 h-6" : "mb-4 h-8",
              ),
              caption_label: cn(
                "text-content-primary",
                isCompact
                  ? "typography-body-small-14px-regular"
                  : "typography-body-default-16px-regular",
              ),
              nav: "absolute inset-x-0 top-0 z-20 flex justify-between",
              button_previous: navButtonClassName,
              button_next: navButtonClassName,
              month_grid: "w-full",
              weekdays: "flex",
              weekday: cn(
                "flex flex-1 items-center justify-center text-content-secondary",
                isCompact
                  ? "typography-description-12px-regular h-6 w-8"
                  : "typography-body-small-14px-regular h-7.5 w-10",
              ),
              week: "flex",
              day: "relative flex flex-1 items-center justify-center p-0.5",
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
            <div className={cn("flex gap-2", isCompact ? "pt-4" : "pt-6")}>
              <Button variant="outline" size={size} className="flex-1" onClick={onCancel}>
                {cancelLabel}
              </Button>
              <Button variant="primary" size={size} className="flex-1" onClick={onApply}>
                {applyLabel}
              </Button>
            </div>
          )}
        </div>
      </DatePickerSizeContext.Provider>
    );
  },
);

DatePicker.displayName = "DatePicker";
