// Type declarations for the JS build script's exported helpers, so they can be imported
// from TypeScript tests. The script itself runs under plain `node` (build:dictionary).
export function refToVar(inner: string): string;
export function resolveValue(value: unknown): string;
export function getEffectTokens(effectTokens: Record<string, unknown>): string;
export function assertPrimitiveParity(rawTokens: Record<string, unknown>): void;
export function assertNoDanglingVars(css: string): void;
export function buildThemeCss(
  rawTokens: Record<string, unknown>,
  v2Tokens: Record<string, unknown>,
): string;
export const LEGACY_COLOR_ALIASES: Record<string, string>;
export const THEME_V2_FALLBACKS: Record<string, string>;
