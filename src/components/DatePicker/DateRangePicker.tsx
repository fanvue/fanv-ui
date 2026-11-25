import { forwardRef, useState } from "react";
import {
  Popover,
  PopoverContent,
  type PopoverContentProps,
  PopoverTrigger,
} from "../Popover/Popover";
import { DateRangePanel, type DateRangePanelProps } from "./DateRangePanel";

/** Props for {@link DateRangePicker}. */
export interface DateRangePickerProps
  extends Omit<DateRangePanelProps, "confirmCustomRange" | "className"> {
  /** The trigger element, rendered as the popover trigger. */
  children: React.ReactElement;
  /** Controlled open state. Leave unset for an uncontrolled popover. */
  open?: boolean;
  /** Called when the popover opens or closes. */
  onOpenChange?: (open: boolean) => void;
  /** Props for the popover content, such as `align`. */
  contentProps?: Omit<PopoverContentProps, "children">;
}

/**
 * A {@link DateRangePanel} in a popover under a caller-supplied trigger.
 * It closes after a preset pick, Apply and Cancel. Closing any other way drops an unapplied range.
 *
 * @example
 * ```tsx
 * <DateRangePicker presets={presets} customRangeLabel="Custom range" value={value} onValueChange={setValue}>
 *   <TableToolbarAction>Date</TableToolbarAction>
 * </DateRangePicker>
 * ```
 */
export const DateRangePicker = forwardRef<HTMLDivElement, DateRangePickerProps>(
  (
    {
      children,
      open: openProp,
      onOpenChange,
      contentProps,
      onValueChange,
      onCancel,
      ...panelProps
    },
    ref,
  ) => {
    const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
    const isControlled = openProp !== undefined;
    const open = isControlled ? openProp : uncontrolledOpen;

    const setOpen = (next: boolean) => {
      if (!isControlled) setUncontrolledOpen(next);
      onOpenChange?.(next);
    };

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>{children}</PopoverTrigger>
        <PopoverContent ref={ref} {...contentProps}>
          <DateRangePanel
            {...panelProps}
            onValueChange={(next) => {
              onValueChange(next);
              setOpen(false);
            }}
            onCancel={() => {
              onCancel?.();
              setOpen(false);
            }}
          />
        </PopoverContent>
      </Popover>
    );
  },
);

DateRangePicker.displayName = "DateRangePicker";
