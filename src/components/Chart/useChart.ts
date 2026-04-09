import * as React from "react";
import type { ChartConfig } from "./types";

type ChartContextValue = {
  config: ChartConfig;
};

export const ChartContext = React.createContext<ChartContextValue | null>(null);

/** Access the nearest {@link ChartContainer}'s config. Throws if used outside a chart. */
export function useChart(): ChartContextValue {
  const ctx = React.useContext(ChartContext);
  if (!ctx) {
    throw new Error("useChart must be used within a <ChartContainer />");
  }
  return ctx;
}
