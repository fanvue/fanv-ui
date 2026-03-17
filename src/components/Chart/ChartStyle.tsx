import * as React from "react";
import { THEMES } from "./chartUtils";
import type { ChartConfig } from "./types";

/** Props for the scoped CSS variable injector used by {@link ChartContainer}. */
export interface ChartStyleProps {
  /** Unique identifier scoped to the chart instance. */
  id: string;
  /** Chart configuration mapping data keys to colors and themes. */
  config: ChartConfig;
}

/**
 * Injects a scoped `<style>` tag that maps each config entry to a
 * `--color-{key}` CSS custom property, with light/dark theme support.
 *
 * Rendered automatically by {@link ChartContainer} — you rarely need this directly.
 */
export const ChartStyle = React.memo(function ChartStyle({ id, config }: ChartStyleProps) {
  const colorEntries = Object.entries(config).filter(([, entry]) => entry.theme || entry.color);

  if (colorEntries.length === 0) return null;

  const css = Object.entries(THEMES)
    .map(([theme, prefix]) => {
      const vars = colorEntries
        .map(([key, entry]) => {
          const color = entry.theme?.[theme as keyof typeof entry.theme] || entry.color;
          return color ? `  --color-${key}: ${color};` : null;
        })
        .filter(Boolean)
        .join("\n");
      return `${prefix} [data-chart=${id}] {\n${vars}\n}`;
    })
    .join("\n");

  return <style>{css}</style>;
});

ChartStyle.displayName = "ChartStyle";
