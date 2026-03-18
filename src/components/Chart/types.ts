import type * as React from "react";

/** Light/dark theme key for chart color resolution. */
export type ChartThemeKey = "light" | "dark";

/**
 * Configuration for a single data series in a chart.
 *
 * Each key in a {@link ChartConfig} record maps to a data key used by Recharts.
 * Provide a human-readable `label` (supports i18n — pass translated strings)
 * and either a single `color` or a `theme` map for light/dark mode.
 */
export type ChartConfigEntry = {
  /** Human-readable label for this series. Pass a translated string for i18n. */
  label?: React.ReactNode;
  /** Optional icon component rendered in tooltips and legends. */
  icon?: React.ComponentType;
  /** Single color for all themes. */
  color?: string;
  /** Per-theme color overrides. Takes precedence over `color` when present. */
  theme?: Record<ChartThemeKey, string>;
};

/**
 * Maps data keys to their display configuration (label, color, icon).
 *
 * @example
 * ```ts
 * const config: ChartConfig = {
 *   revenue: {
 *     label: t("chart.revenue"),
 *     color: "var(--color-special-chart-teal)",
 *   },
 *   subscribers: {
 *     label: t("chart.subscribers"),
 *     theme: { light: "#2563eb", dark: "#60a5fa" },
 *   },
 * };
 * ```
 */
export type ChartConfig = Record<string, ChartConfigEntry>;
