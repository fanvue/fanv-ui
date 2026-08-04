/** Props for {@link ChartAreaGradientDefs}. */
export interface ChartAreaGradientDefsProps {
  /**
   * Namespace for the generated gradient ids. SVG ids are document-global, so this
   * has to be unique per chart on the page — pass a `React.useId()`.
   */
  idPrefix: string;
  /**
   * Series to emit a gradient for. Each resolves `var(--color-<key>)`, the custom
   * property {@link ChartStyle} already publishes from the chart config, so the
   * gradient tracks whatever colour that series is given.
   */
  seriesKeys: readonly string[];
  /**
   * Opacity where the fill meets the line, fading to nothing at the baseline.
   * @default 0.3
   */
  topOpacity?: number;
}

/** The `fill` value for a series' gradient, as emitted by {@link ChartAreaGradientDefs}. */
export const chartAreaGradientFill = (idPrefix: string, seriesKey: string) =>
  `url(#${idPrefix}-${seriesKey})`;

/**
 * One vertical gradient per series, for the area fills on a line or area chart:
 * the series colour where it meets its line, fading out towards the baseline.
 *
 * Render it inside the chart — SVG resolves `url(#…)` against the document, but the
 * `defs` must be part of the chart's own SVG for recharts to keep it mounted — and
 * fill each `Area` with {@link chartAreaGradientFill}. Do not also set
 * `fillOpacity`: it multiplies the gradient's own alpha and flattens it.
 *
 * A flat translucent fill is what this replaces. Two of them overlapping read as a
 * third colour, and the eye cannot tell which series is in front; a fade keeps each
 * series legible where they cross and puts the weight on the line.
 *
 * @example
 * ```tsx
 * const gradientId = React.useId();
 *
 * <AreaChart data={rows}>
 *   <ChartAreaGradientDefs idPrefix={gradientId} seriesKeys={seriesKeys} />
 *   {seriesKeys.map((key) => (
 *     <Area key={key} dataKey={key} stroke={`var(--color-${key})`}
 *           fill={chartAreaGradientFill(gradientId, key)} />
 *   ))}
 * </AreaChart>
 * ```
 */
export const ChartAreaGradientDefs = ({
  idPrefix,
  seriesKeys,
  topOpacity = 0.3,
}: ChartAreaGradientDefsProps) => (
  <defs>
    {seriesKeys.map((key) => (
      <linearGradient
        key={key}
        id={`${idPrefix}-${key}`}
        // Top to bottom in the plot's own space, so the fade follows the value axis
        // rather than the shape of the series.
        x1="0"
        y1="0"
        x2="0"
        y2="1"
      >
        <stop offset="0%" stopColor={`var(--color-${key})`} stopOpacity={topOpacity} />
        <stop offset="100%" stopColor={`var(--color-${key})`} stopOpacity={0} />
      </linearGradient>
    ))}
  </defs>
);
