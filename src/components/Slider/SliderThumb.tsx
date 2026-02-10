import * as SliderPrimitive from "@radix-ui/react-slider";
import * as React from "react";
import { cn } from "../../utils/cn";

interface SliderThumbProps {
  showTooltip: boolean;
  formatTooltip?: (value: number) => string;
  index: number;
  "aria-label"?: string;
  "aria-labelledby"?: string;
}

export function SliderThumb({
  showTooltip,
  formatTooltip,
  index,
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
        "flex size-6 items-center justify-center rounded-full border border-neutral-100 bg-background-inverse-solid shadow-sm",
        "transition-shadow duration-150",
        "hover:ring-2 hover:ring-brand-green-500",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-purple-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background-inverse-solid",
        "data-disabled:cursor-not-allowed",
      )}
    >
      <span className="block size-3 rounded-full bg-brand-green-500 shadow-[inset_0px_1px_2px_0px_rgba(0,0,0,0.1)]" />

      {showTooltip && (
        <span
          role="tooltip"
          data-slider-tooltip
          className="typography-caption-semibold pointer-events-none absolute bottom-full mb-2 rounded-3xl bg-background-solid px-2 py-1 text-background-inverse-solid shadow-sm"
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
