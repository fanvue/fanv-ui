import type * as React from "react";
import type { SliderLabelPosition } from "./Slider";

interface SliderLayoutProps {
  label?: string;
  labelId: string;
  labelPosition: SliderLabelPosition;
  minLabel?: string;
  maxLabel?: string;
  children: React.ReactNode;
}

export function SliderLayout({
  label,
  labelId,
  labelPosition,
  minLabel,
  maxLabel,
  children,
}: SliderLayoutProps) {
  if (labelPosition === "left") {
    return (
      <div className="flex items-center gap-3">
        {label && (
          <span id={labelId} className="shrink-0 font-semibold text-base text-body-100">
            {label}
          </span>
        )}
        {minLabel && (
          <span className="shrink-0 text-body-200 text-sm leading-[18px]">{minLabel}</span>
        )}
        {children}
        {maxLabel && (
          <span className="shrink-0 text-body-200 text-sm leading-[18px]">{maxLabel}</span>
        )}
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-3">
      {label && (
        <span id={labelId} className="font-semibold text-base text-body-100">
          {label}
        </span>
      )}
      {(minLabel || maxLabel) && (
        <div className="flex w-full items-start justify-between text-body-200 text-sm leading-[18px]">
          {minLabel && <span>{minLabel}</span>}
          {maxLabel && <span className="ml-auto">{maxLabel}</span>}
        </div>
      )}
      {children}
    </div>
  );
}
