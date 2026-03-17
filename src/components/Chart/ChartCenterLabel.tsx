import * as React from "react";

/** Props for {@link ChartCenterLabel}. */
export interface ChartCenterLabelProps
  extends Omit<React.SVGAttributes<SVGTextElement>, "viewBox"> {
  /** Recharts viewBox with center coordinates. */
  viewBox?: { cx?: number; cy?: number; [key: string]: unknown };
  /** Primary value displayed in the center. */
  value: React.ReactNode;
  /** Secondary text below the value. */
  subtitle: React.ReactNode;
  /** Custom className for the value tspan. @default "fill-foreground-default font-bold text-3xl" */
  valueClassName?: string;
}

/**
 * Centered label for radial/pie charts, rendered inside a Recharts `<Label>`.
 *
 * @example
 * ```tsx
 * <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
 *   <Label content={({ viewBox }) => (
 *     <ChartCenterLabel viewBox={viewBox} value="78%" subtitle="Complete" />
 *   )} />
 * </PolarRadiusAxis>
 * ```
 */
export const ChartCenterLabel = React.forwardRef<SVGTextElement, ChartCenterLabelProps>(
  (
    {
      viewBox,
      value,
      subtitle,
      valueClassName = "fill-foreground-default font-bold text-3xl",
      ...props
    },
    ref,
  ) => {
    if (!viewBox || !("cx" in viewBox) || !("cy" in viewBox)) return null;

    return (
      <text
        ref={ref}
        x={viewBox.cx}
        y={viewBox.cy}
        textAnchor="middle"
        dominantBaseline="middle"
        {...props}
      >
        <tspan x={viewBox.cx} y={viewBox.cy} className={valueClassName}>
          {value}
        </tspan>
        <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 24} className="fill-foreground-tertiary">
          {subtitle}
        </tspan>
      </text>
    );
  },
);

ChartCenterLabel.displayName = "ChartCenterLabel";
