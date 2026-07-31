import * as React from "react";
import { cn } from "../../utils/cn";
import { ProgressBar } from "../ProgressBar/ProgressBar";

/** Props for {@link Demographics}. */
export interface DemographicsProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  /** Row label, e.g. a country name. Pass a translated string for i18n. */
  label: React.ReactNode;
  /** Share of the total, 0–100. Drives the bar and is announced to assistive tech. */
  value: number;
  /** Formatted share shown at the end of the row, e.g. `"52.6%"`. */
  formattedValue: React.ReactNode;
  /** Leading 20px glyph — a flag for a country row. */
  icon?: React.ReactNode;
}

/**
 * One row of a breakdown: a leading glyph and label, its share at the far end,
 * and a bar underneath. Stack these to show how a total splits across
 * categories — the top-countries breakdown on the insights dashboard, and the
 * same list expanded inside a dialog.
 *
 * @example
 * ```tsx
 * <Demographics
 *   icon={<span aria-hidden>🇺🇸</span>}
 *   label="United States"
 *   value={52.6}
 *   formattedValue="52.6%"
 * />
 * ```
 */
export const Demographics = React.forwardRef<HTMLDivElement, DemographicsProps>(
  ({ label, value, formattedValue, icon, className, ...props }, ref) => (
    <div ref={ref} className={cn("flex w-full flex-col gap-2", className)} {...props}>
      <div className="flex w-full items-center justify-between gap-2">
        <span className="flex min-w-0 items-center gap-2">
          {icon && <span className="flex size-5 shrink-0 items-center justify-center">{icon}</span>}
          <span className="typography-body-small-14px-semibold truncate text-content-primary">
            {label}
          </span>
        </span>
        <span className="typography-body-small-14px-regular shrink-0 text-content-primary">
          {formattedValue}
        </span>
      </div>
      <ProgressBar
        variant="sky"
        size="medium"
        value={value}
        ariaLabel={typeof label === "string" ? label : undefined}
      />
    </div>
  ),
);

Demographics.displayName = "Demographics";
