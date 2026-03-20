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
          <span id={labelId} className="typography-semibold-body-lg shrink-0 text-content-primary">
            {label}
          </span>
        )}
        {minLabel && (
          <span className="typography-regular-body-md shrink-0 text-content-secondary">
            {minLabel}
          </span>
        )}
        {children}
        {maxLabel && (
          <span className="typography-regular-body-md shrink-0 text-content-secondary">
            {maxLabel}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-3">
      {label && (
        <span id={labelId} className="typography-semibold-body-lg text-content-primary">
          {label}
        </span>
      )}
      {(minLabel || maxLabel) && (
        <div className="flex w-full items-start justify-between typography-regular-body-md text-content-secondary">
          {minLabel && <span>{minLabel}</span>}
          {maxLabel && <span className="ml-auto">{maxLabel}</span>}
        </div>
      )}
      {children}
    </div>
  );
}
