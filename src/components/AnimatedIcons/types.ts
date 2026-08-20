import type * as React from "react";
import type { IconSize } from "../Icons/types";

/**
 * Imperative control for an animated icon, exposed through the `controlRef` prop.
 *
 * Attaching a `controlRef` opts the icon out of its built-in hover trigger, so the
 * animation runs only when you drive it — useful when the hover target is an
 * ancestor (a button, a row) rather than the icon itself.
 *
 * Drive it from focus as well as hover: the icon itself is not focusable, so a
 * keyboard user reaching the button gets no animation from hover alone.
 *
 * @example
 * ```tsx
 * const icon = useRef<AnimatedIconHandle>(null);
 * <button
 *   onMouseEnter={() => icon.current?.startAnimation()}
 *   onMouseLeave={() => icon.current?.stopAnimation()}
 *   onFocus={() => icon.current?.startAnimation()}
 *   onBlur={() => icon.current?.stopAnimation()}
 * >
 *   <HeartIcon controlRef={icon} /> Favourite
 * </button>
 * ```
 */
export interface AnimatedIconHandle {
  /**
   * Play the icon's animation. Does nothing when the user has asked for reduced
   * motion (`prefers-reduced-motion: reduce`).
   */
  startAnimation: () => void;
  /** Return the icon to its resting state. */
  stopAnimation: () => void;
}

/**
 * DOM props Motion reserves for its own animation and gesture handling. They are
 * dropped from the animated icon props so an icon whose whole `<svg>` is a Motion
 * element still accepts the same prop bag as one that only animates its paths.
 * None of them are meaningful on an icon (`values` is an SVG attribute of
 * `<animate>`/`<feColorMatrix>`, never of `<svg>`).
 *
 * Matches Motion's own `validMotionProps` for the props React also defines; the
 * `onAnimation*` props Motion passes straight through are deliberately not listed.
 */
type MotionReservedProps = "onAnimationStart" | "onDrag" | "onDragStart" | "onDragEnd" | "values";

/** Props every animated icon accepts on top of its size/legacy sizing contract. */
interface AnimatedIconBaseProps {
  /**
   * Ref for driving the animation yourself. When set, hovering the icon no longer
   * starts the animation and `onMouseEnter`/`onMouseLeave` are forwarded untouched.
   */
  controlRef?: React.Ref<AnimatedIconHandle>;
}

/**
 * Props for animated twins of prop-based icons. Mirrors `BaseIconProps` minus
 * `filled` — the animated artwork is stroke-only, so there is no filled variant.
 *
 * `size` selects the same box as the static icon of the same name, so swapping
 * `@fanvue/ui` for `@fanvue/ui/animated-icons` never changes layout.
 */
export interface AnimatedIconProps
  extends Omit<React.SVGAttributes<SVGSVGElement>, "size" | MotionReservedProps>,
    AnimatedIconBaseProps {
  /** Pixel size — matches the static icon's box exactly. @default 24 */
  size?: IconSize;
  /**
   * Not available on animated icons: the artwork is stroke-only, so there is no
   * filled variant to swap to. Typed as `never` rather than omitted so passing it
   * through a wrapper's spread fails to compile instead of reaching the DOM.
   */
  filled?: never;
}

/**
 * Props for animated twins of legacy (single-size) icons. Sized via `className`
 * exactly like the static icon, and defaulting to the same box.
 */
export interface AnimatedLegacyIconProps
  extends Omit<React.SVGAttributes<SVGSVGElement>, MotionReservedProps>,
    AnimatedIconBaseProps {
  className?: string;
}
