import * as React from "react";

/**
 * Tracks whether the browser tab is visible (`document.visibilityState === "visible"`).
 * Cycling animations use this to pause while the document is hidden so timers do not queue
 * many swaps while the user is away.
 */
export function usePageVisibility(): boolean {
  const [visible, setVisible] = React.useState(true);

  React.useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }
    const update = () => {
      setVisible(document.visibilityState === "visible");
    };
    update();
    document.addEventListener("visibilitychange", update);
    return () => document.removeEventListener("visibilitychange", update);
  }, []);

  return visible;
}
