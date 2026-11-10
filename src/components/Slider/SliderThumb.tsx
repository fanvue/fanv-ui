import * as SliderPrimitive from "@radix-ui/react-slider";
import * as React from "react";
import { cn } from "../../utils/cn";
import type { SliderSize, SliderTone } from "./Slider";

const THUMB_SIZE_CLASSES: Record<SliderSize, { thumb: string; dot: string }> = {
  sm: { thumb: "size-4", dot: "size-2" },
  md: { thumb: "size-6", dot: "size-3" },
  lg: { thumb: "size-8", dot: "size-4" },
};

const THUMB_TONE_CLASSES: Record<SliderTone, string> = {
  brand: cn(
    "border-border-primary bg-background-primary",
    "hover:ring-brand-primary-default not-data-disabled:active:ring-brand-primary-default",
  ),
  neutral: cn(
    "border-transparent bg-inputs-slider-active",
    "hover:ring-inputs-slider-active not-data-disabled:active:ring-inputs-slider-active",
  ),
};

interface SliderThumbProps {
  showTooltip: boolean;
  formatTooltip?: (value: number) => string;
  index: number;
  size: SliderSize;
  tone: SliderTone;
  "aria-label"?: string;
  "aria-labelledby"?: string;
}

export function SliderThumb({
  showTooltip,
  formatTooltip,
  index,
  size,
  tone,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
}: SliderThumbProps) {
  const thumbRef = React.useCallback(
    (el: HTMLSpanElement | null) => {
      if (!el || !showTooltip) return;
      syncTooltipText(el, formatTooltip);
    },
    [showTooltip, formatTooltip],
  );

  return (
    <SliderPrimitive.Thumb
      ref={thumbRef}
      data-index={index}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      onPointerDown={(e) => {
        if (showTooltip) syncTooltipText(e.currentTarget, formatTooltip);
      }}
      onPointerMove={(e) => {
        if (showTooltip) syncTooltipText(e.currentTarget, formatTooltip);
      }}
      onKeyDown={(e) => {
        if (showTooltip) {
          requestAnimationFrame(() => syncTooltipText(e.currentTarget, formatTooltip));
        }
      }}
      className={cn(
        "flex items-center justify-center rounded-full border shadow-sm",
        "transition-shadow duration-150",
        "hover:ring-2 not-data-disabled:active:ring-2",
        THUMB_SIZE_CLASSES[size].thumb,
        THUMB_TONE_CLASSES[tone],
        "focus-visible:shadow-focus-ring focus-visible:outline-none",
        "data-disabled:cursor-not-allowed",
      )}
    >
      {tone === "brand" && (
        <span
          className={cn(
            "block rounded-full bg-brand-primary-default shadow-[inset_0px_1px_2px_0px_rgba(0,0,0,0.1)]",
            THUMB_SIZE_CLASSES[size].dot,
          )}
        />
      )}

      {showTooltip && (
        <span
          role="tooltip"
          data-slider-tooltip
          className="typography-description-12px-semibold pointer-events-none absolute bottom-full mb-2 rounded-lg bg-surface-primary-inverted px-2 py-1 text-content-primary-inverted shadow-sm"
        />
      )}
    </SliderPrimitive.Thumb>
  );
}

function syncTooltipText(thumb: HTMLElement, formatTooltip?: (value: number) => string) {
  const raw = thumb.getAttribute("aria-valuenow");
  const tooltip = thumb.querySelector<HTMLSpanElement>("[data-slider-tooltip]");
  if (raw == null || !tooltip) return;
  const num = Number(raw);
  tooltip.textContent = formatTooltip ? formatTooltip(num) : String(num);
}
