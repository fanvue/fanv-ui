import * as React from "react";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

// jsdom has no `matchMedia`, and `getSnapshot` runs during render, so an
// unguarded call throws rather than degrades.
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
 * Read during render rather than synced into state from an effect: an effect
 * returns `false` on the first render, which lets a reduced-motion user catch one
 * animated frame, and can read a stale value under concurrent rendering.
 */
export function usePrefersReducedMotion(): boolean {
  return React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
