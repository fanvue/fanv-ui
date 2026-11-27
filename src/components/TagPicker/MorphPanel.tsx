import * as React from "react";
import { cn } from "../../utils/cn";

const EASE = "cubic-bezier(0.32, 0.72, 0, 1)";
const DURATION_MS = 300;

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
  );
}

/** Props for {@link MorphPanel}. */
interface MorphPanelProps {
  /** Which view is showing, in navigation order: a higher step is deeper. */
  step: number;
  children: React.ReactNode;
}

/**
 * Animates between the picker's views. The panel morphs from its old height to the new view's
 * height, and the new view fades in sliding from the right when going deeper or from the left when
 * going back. With reduced motion the views swap instantly.
 */
export function MorphPanel({ step, children }: MorphPanelProps) {
  const outer = React.useRef<HTMLDivElement>(null);
  const lastHeight = React.useRef<number | null>(null);
  const lastStep = React.useRef(step);
  const animating = React.useRef(false);
  const direction = step >= lastStep.current ? "forward" : "back";

  React.useLayoutEffect(() => {
    const el = outer.current;
    if (!el) return;
    const from = lastHeight.current;
    const changed = lastStep.current !== step;
    lastStep.current = step;
    if (!changed || from === null || prefersReducedMotion()) {
      if (!animating.current) lastHeight.current = el.getBoundingClientRect().height;
      return;
    }
    el.style.height = "";
    const to = el.getBoundingClientRect().height;
    if (Math.abs(to - from) < 1) {
      lastHeight.current = to;
      return;
    }
    animating.current = true;
    el.style.height = `${from}px`;
    el.getBoundingClientRect();
    el.style.transition = `height ${DURATION_MS}ms ${EASE}`;
    el.style.height = `${to}px`;
    const done = () => {
      el.style.transition = "";
      el.style.height = "";
      animating.current = false;
      lastHeight.current = el.getBoundingClientRect().height;
    };
    const timer = window.setTimeout(done, DURATION_MS + 50);
    return () => window.clearTimeout(timer);
  });

  return (
    <div ref={outer} data-morph-panel="" className="flex min-h-0 flex-col overflow-hidden">
      <div
        key={step}
        data-direction={direction}
        className={cn(
          "fade-in-0 flex min-h-0 animate-in flex-col duration-300 motion-reduce:animate-none",
          direction === "forward" ? "slide-in-from-right-8" : "slide-in-from-left-8",
        )}
      >
        {children}
      </div>
    </div>
  );
}
