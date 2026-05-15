import * as React from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

export function usePrefersReducedMotion(): boolean {
  const subscribe = React.useCallback((onChange: () => void) => {
    if (typeof window === "undefined" || !window.matchMedia) return () => {};
    const mq = window.matchMedia(QUERY);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  const getSnapshot = () => typeof window !== "undefined" && !!window.matchMedia?.(QUERY).matches;
  const getServerSnapshot = () => false;
  return React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
