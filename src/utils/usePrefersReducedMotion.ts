import * as React from "react";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

/**
 * jsdom does not implement `matchMedia`, and neither does a server render, so
 * both entry points below have to tolerate its absence rather than assume a
 * browser. `getSnapshot` runs during render, so an unguarded call would throw
 * rather than degrade.
 */
const isSupported = () => typeof window !== "undefined" && typeof window.matchMedia === "function";

const subscribe = (onStoreChange: () => void) => {
  if (!isSupported()) {
    return () => {};
  }
  const mq = window.matchMedia(REDUCED_MOTION_QUERY);
  mq.addEventListener("change", onStoreChange);
  return () => mq.removeEventListener("change", onStoreChange);
};

const getSnapshot = () => (isSupported() ? window.matchMedia(REDUCED_MOTION_QUERY).matches : false);

const getServerSnapshot = () => false;

/**
 * Whether the user has asked for reduced motion.
 *
 * Reads the media query during render via `useSyncExternalStore` rather than
 * syncing it into state from an effect. The effect-based version always returned
 * `false` on the first render and corrected itself afterwards, so someone with
 * reduced motion on could catch one animated frame before it settled. This is
 * also the version that behaves correctly under concurrent rendering, where an
 * effect-based subscription can read a stale value.
 */
export function usePrefersReducedMotion(): boolean {
  return React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
