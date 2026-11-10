import * as SliderPrimitive from "@radix-ui/react-slider";
import * as React from "react";
import { cn } from "../../utils/cn";
import { SliderLayout } from "./SliderLayout";
import { SliderThumb } from "./SliderThumb";

/** Position of the slider label relative to the track. */
export type SliderLabelPosition = "top" | "left";

/** Size preset for the track and thumb. */
export type SliderSize = "sm" | "md" | "lg";

/** Colour of the filled range and thumb. */
export type SliderTone = "brand" | "neutral";

const TRACK_SIZE_CLASSES: Record<SliderSize, string> = {
  sm: "h-2",
  md: "h-3",
  lg: "h-4",
};

const TRACK_TONE_CLASSES: Record<SliderTone, string> = {
  brand: "bg-surface-secondary",
  neutral: "bg-[var(--primitives-color-gray-200)] dark:bg-surface-secondary",
};

const RANGE_TONE_CLASSES: Record<SliderTone, string> = {
  brand: "bg-brand-primary-default",
  neutral: "bg-inputs-slider-active",
};

export interface SliderProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>,
    "asChild" | "children"
  > {
  /** Label text displayed alongside the slider. */
  label?: string;
  /** Position of the label relative to the slider track. @default "top" */
  labelPosition?: SliderLabelPosition;
  /** Text shown at the minimum end of the track. */
  minLabel?: string;
  /** Text shown at the maximum end of the track. */
  maxLabel?: string;
  /**
   * Size of the track and thumb.
   *
   * - `sm` – 8px track, 16px thumb
   * - `md` – 12px track, 24px thumb
   * - `lg` – 16px track, 32px thumb
   *
   * @default "md"
   */
  size?: SliderSize;
  /**
   * Colour of the filled range and thumb.
   *
   * - `brand` – brand green range, white thumb with a green dot
   * - `neutral` – range and solid thumb in the primary button colour (black in
   *   light mode, white in dark mode), on a grey track that stays visible on
   *   dialog surfaces
   *
   * @default "brand"
   */
  tone?: SliderTone;
  /** Whether to show a tooltip with the current value above the thumb. @default false */
  showTooltip?: boolean;
  /** Custom formatter for the tooltip value (e.g. to add units or format numbers). */
  formatTooltip?: (value: number) => string;
}

/**
 * A range input for selecting one or more numeric values along a track.
 * Supports single and multi-thumb modes, optional labels, and a value tooltip.
 *
 * Built on Radix UI `Slider`.
 *
 * @example
 * ```tsx
 * <Slider
 *   label="Volume"
 *   min={0}
 *   max={100}
 *   defaultValue={[50]}
 *   showTooltip
 * />
 * <Slider size="lg" tone="neutral" aria-label="Delay" defaultValue={[30]} />
 * ```
 */
export const Slider = React.forwardRef<
  React.ComponentRef<typeof SliderPrimitive.Root>,
  SliderProps
>(
  (
    {
      className,
      label,
      labelPosition = "top",
      size = "md",
      tone = "brand",
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
        <SliderPrimitive.Track
          className={cn(
            "relative w-full overflow-hidden rounded-full border border-border-primary",
            TRACK_SIZE_CLASSES[size],
            TRACK_TONE_CLASSES[tone],
          )}
        >
          <SliderPrimitive.Range
            className={cn("absolute h-full rounded-full", RANGE_TONE_CLASSES[tone])}
          />
        </SliderPrimitive.Track>

        {Array.from({ length: thumbCount }, (_, i) => (
          <SliderThumb
            // biome-ignore lint/suspicious/noArrayIndexKey: thumbs are fixed-count and never reorder
            key={i}
            showTooltip={showTooltip}
            formatTooltip={formatTooltip}
            index={i}
            size={size}
            tone={tone}
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
