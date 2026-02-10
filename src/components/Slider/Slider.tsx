import * as SliderPrimitive from "@radix-ui/react-slider";
import * as React from "react";
import { cn } from "../../utils/cn";
import { SliderLayout } from "./SliderLayout";
import { SliderThumb } from "./SliderThumb";

export type SliderLabelPosition = "top" | "left";

export interface SliderProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>,
    "asChild" | "children"
  > {
  /** Label text displayed alongside the slider */
  label?: string;
  /** Position of the label relative to the slider track */
  labelPosition?: SliderLabelPosition;
  /** Text shown at the minimum end of the track */
  minLabel?: string;
  /** Text shown at the maximum end of the track */
  maxLabel?: string;
  /** Whether to show a tooltip with the current value above the thumb */
  showTooltip?: boolean;
  /** Override the displayed tooltip value (e.g. for formatting) */
  formatTooltip?: (value: number) => string;
}

export const Slider = React.forwardRef<
  React.ComponentRef<typeof SliderPrimitive.Root>,
  SliderProps
>(
  (
    {
      className,
      label,
      labelPosition = "top",
      minLabel,
      maxLabel,
      showTooltip = false,
      formatTooltip,
      disabled,
      value,
      defaultValue,
      "aria-label": ariaLabel,
      "aria-labelledby": ariaLabelledBy,
      ...props
    },
    ref,
  ) => {
    const labelId = React.useId();
    const thumbCount = value?.length ?? defaultValue?.length ?? 1;
    const resolvedLabelledBy = ariaLabelledBy ?? (label ? labelId : undefined);
    const resolvedAriaLabel = !resolvedLabelledBy ? ariaLabel : undefined;

    const sliderTrack = (
      <SliderPrimitive.Root
        ref={ref}
        disabled={disabled}
        value={value}
        defaultValue={defaultValue}
        aria-label={resolvedAriaLabel}
        aria-labelledby={resolvedLabelledBy}
        className={cn(
          "group/slider relative flex w-full touch-none select-none items-center",
          disabled && "pointer-events-none opacity-50",
          className,
        )}
        {...props}
      >
        <SliderPrimitive.Track className="relative h-3 w-full overflow-hidden rounded-full border border-neutral-100 bg-neutral-100">
          <SliderPrimitive.Range className="absolute h-full rounded-full bg-brand-green-500" />
        </SliderPrimitive.Track>

        {Array.from({ length: thumbCount }, (_, i) => (
          <SliderThumb
            // biome-ignore lint/suspicious/noArrayIndexKey: thumbs are fixed-count and never reorder
            key={i}
            showTooltip={showTooltip}
            formatTooltip={formatTooltip}
            index={i}
            aria-label={resolvedAriaLabel}
            aria-labelledby={resolvedLabelledBy}
          />
        ))}
      </SliderPrimitive.Root>
    );

    const hasLayout = Boolean(label || minLabel || maxLabel);

    if (!hasLayout) return sliderTrack;

    return (
      <SliderLayout
        label={label}
        labelId={labelId}
        labelPosition={labelPosition}
        minLabel={minLabel}
        maxLabel={maxLabel}
      >
        {sliderTrack}
      </SliderLayout>
    );
  },
);

Slider.displayName = "Slider";
