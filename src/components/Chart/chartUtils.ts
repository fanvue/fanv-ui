import type { ChartConfig, ChartThemeKey } from "./types";

export const THEMES: Record<ChartThemeKey, string> = { light: "", dark: ".dark" };

export function filterVisiblePayload<T extends { type?: string }>(items: readonly T[]): T[] {
  return items.filter((item) => item.type !== "none");
}

/**
 * Resolves the {@link ChartConfig} entry for a given tooltip/legend payload
 * item. Recharts wraps the original data point inside `payload.payload` —
 * this function checks both levels before falling back to a direct `key` lookup.
 */
export function resolveConfigEntry(config: ChartConfig, payload: unknown, key: string) {
  if (typeof payload !== "object" || payload === null) return undefined;

  const p = payload as Record<string, unknown>;
  const nested =
    typeof p.payload === "object" && p.payload !== null
      ? (p.payload as Record<string, unknown>)
      : undefined;

  let configKey = key;

  if (key in p && typeof p[key] === "string") {
    configKey = p[key] as string;
  } else if (nested && key in nested && typeof nested[key] === "string") {
    configKey = nested[key] as string;
  }

  return config[configKey] ?? config[key];
}
