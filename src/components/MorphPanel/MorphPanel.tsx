import * as React from "react";
import { cn } from "../../utils/cn";
import { usePrefersReducedMotion } from "../../utils/usePrefersReducedMotion";

const EASE = "cubic-bezier(0.32, 0.72, 0, 1)";
const DURATION_MS = 300;

type MorphDirection = "forward" | "back";

/** Props for {@link MorphPanel}. */
export interface MorphPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Which view is showing, in navigation order: a higher step is deeper. Changing it plays the
   * transition; the view's own content changing does not.
   */
  step: number;
}

/**
 * Animates a panel between views, such as the steps of a dialog or the sub-views of a sheet.
 *
 * When `step` changes, the panel morphs from its old height to the new view's height over 300ms,
 * and the new view fades in sliding from the right when going deeper (a higher step) or from the
 * left when going back. With reduced motion the views swap instantly. The first view appears
 * without a transition, so the panel's own entrance animation plays alone.
 *
 * {@link DialogContent} and {@link DrawerContent} wrap their children in one when given a `step`.
 *
 * @example
 * ```tsx
 * <MorphPanel step={view === "list" ? 0 : 1}>
 *   {view === "list" ? <List /> : <Details />}
 * </MorphPanel>
 * ```
 */
export const MorphPanel = React.forwardRef<HTMLDivElement, MorphPanelProps>(
  ({ step, className, children, ...props }, ref) => {
    const outer = React.useRef<HTMLDivElement>(null);
    React.useImperativeHandle(ref, () => outer.current as HTMLDivElement);
    const reducedMotion = usePrefersReducedMotion();
    const [nav, setNav] = React.useState<{ step: number; direction: MorphDirection | null }>({
      step,
      direction: null,
    });
    if (nav.step !== step) {
      setNav({ step, direction: step > nav.step ? "forward" : "back" });
    }
    const lastHeight = React.useRef<number | null>(null);
    const morphedStep = React.useRef(step);
    const timer = React.useRef<number | undefined>(undefined);

    React.useLayoutEffect(() => {
      const el = outer.current;
      if (!el) return;
      if (morphedStep.current === step) {
        if (timer.current === undefined) lastHeight.current = el.getBoundingClientRect().height;
        return;
      }
      morphedStep.current = step;
      const from = lastHeight.current;
      window.clearTimeout(timer.current);
      timer.current = undefined;
      el.style.transition = "";
      el.style.height = "";
      const to = el.getBoundingClientRect().height;
      lastHeight.current = to;
      if (reducedMotion || from === null) {
        el.style.overflow = "";
        return;
      }
      el.style.overflow = "hidden";
      if (Math.abs(to - from) >= 1) {
        el.style.height = `${from}px`;
        el.getBoundingClientRect();
        el.style.transition = `height ${DURATION_MS}ms ${EASE}`;
        el.style.height = `${to}px`;
      }
      timer.current = window.setTimeout(() => {
        el.style.transition = "";
        el.style.height = "";
        el.style.overflow = "";
        timer.current = undefined;
        lastHeight.current = el.getBoundingClientRect().height;
      }, DURATION_MS + 50);
    });

    React.useEffect(() => {
      const el = outer.current;
      if (!el || typeof ResizeObserver === "undefined") return;
      const observer = new ResizeObserver(() => {
        if (timer.current === undefined) lastHeight.current = el.getBoundingClientRect().height;
      });
      observer.observe(el);
      return () => {
        observer.disconnect();
        window.clearTimeout(timer.current);
      };
    }, []);

    const animate = nav.direction !== null && !reducedMotion;
    return (
      <div
        ref={outer}
        data-morph-panel=""
        className={cn("flex min-h-0 flex-auto flex-col", className)}
        {...props}
      >
        <div
          key={step}
          data-direction={nav.direction ?? undefined}
          className={cn(
            "flex min-h-0 flex-auto flex-col",
            animate && "fade-in-0 animate-in duration-300",
            animate &&
              (nav.direction === "forward" ? "slide-in-from-right-8" : "slide-in-from-left-8"),
          )}
        >
          {children}
        </div>
      </div>
    );
  },
);
MorphPanel.displayName = "MorphPanel";

/** Wraps a modal's children in a {@link MorphPanel} when it has a `step`, and leaves them as they are otherwise. */
export function withMorphPanel(step: number | undefined, children: React.ReactNode) {
  return step === undefined ? children : <MorphPanel step={step}>{children}</MorphPanel>;
}
