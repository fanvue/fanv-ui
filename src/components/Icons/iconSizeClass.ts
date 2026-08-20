import type { IconSize } from "./types";

/**
 * Tailwind box class for each authored icon size. Shared by {@link BaseIcon} and
 * the animated icons in `src/components/AnimatedIcons` so an animated icon always
 * occupies exactly the same box as its static twin.
 *
 * Internal — not exported from the package.
 */
export const ICON_SIZE_CLASS: Record<IconSize, string> = {
  16: "size-4",
  24: "size-6",
  32: "size-8",
};
