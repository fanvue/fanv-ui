import type * as React from "react";
import type { BaseIconProps, IconSize } from "../Icons/types";

/**
 * Loader for a Lottie animation JSON. Returning a dynamic `import(...)` lets the
 * underlying chunk be code-split and fetched only on first interaction.
 */
export type LottieAnimationLoader = () => Promise<unknown>;

/**
 * Props shared by every Lottie icon. Mirrors the `*Icon` API so animated
 * variants are drop-in replacements where supported.
 *
 * The icon is decorative by default (`aria-hidden="true"`). Pass `aria-label`
 * (and `role="img"`) when the icon is the only conveyor of meaning.
 */
export interface LottieIconProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, "size"> {
  /** Pixel size — selects the dedicated fallback geometry. @default 24 */
  size?: IconSize;
  /**
   * When `"hover"` (default), the icon plays while the closest interactive
   * ancestor (button/link/etc.) is hovered or focused. When `"manual"`, only
   * the `play` prop drives playback.
   */
  trigger?: "hover" | "manual";
  /**
   * Controlled play state. When set, overrides `trigger` and drives playback
   * directly. Setting `false` resets to frame 0.
   */
  play?: boolean;
}

/**
 * Internal props consumed by the {@link LottieIcon} renderer. Each named icon
 * (e.g. `HomeLottieIcon`) supplies its own `Fallback` and `loadAnimationData`.
 */
export interface InternalLottieIconProps extends LottieIconProps {
  Fallback: React.ComponentType<BaseIconProps>;
  loadAnimationData: LottieAnimationLoader;
}

/** Minimal surface of `lottie-web`'s `AnimationItem` that we depend on. */
export interface LottieAnimationItem {
  destroy: () => void;
  goToAndPlay: (frame: number, isFrame?: boolean) => void;
  goToAndStop: (frame: number, isFrame?: boolean) => void;
}
