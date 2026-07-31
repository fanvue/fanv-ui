import * as React from "react";
import { cn } from "@/utils/cn";
import { usePrefersReducedMotion } from "@/utils/usePrefersReducedMotion";

/** How a value change is animated. */
export type AnimatedNumberVariant =
  /**
   * Per-digit odometer: each digit column slides to its new value and the box
   * width eases when the digit count changes. Reads as mechanical, so it suits
   * a single headline figure rather than a grid of them.
   */
  | "roll"
  /**
   * Interpolates the value and re-formats it each frame, so the whole number
   * counts from old to new. Calmer than `roll` when several figures on a page
   * change at once.
   */
  | "count";

/** Props for {@link AnimatedNumber}. */
export interface AnimatedNumberProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, "children"> {
  /** The value to display. Animates whenever this changes. */
  value: number;
  /**
   * Turns the value into the displayed string. Receives interpolated values in
   * the `count` variant, so it must handle non-integers.
   * @default String(Math.round(value))
   */
  format?: (value: number) => string;
  /** Which animation to run. @default "count" */
  variant?: AnimatedNumberVariant;
  /** Animation duration in milliseconds. @default 500 */
  durationMs?: number;
}

const DEFAULT_DURATION_MS = 500;

const defaultFormat = (value: number) => String(Math.round(value));

/** Decelerating ease, so the value settles rather than stopping abruptly. */
const easeOutCubic = (t: number) => 1 - (1 - t) ** 3;

const DIGITS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

const isDigit = (char: string) => char >= "0" && char <= "9";

/**
 * Animates a number when its value changes, either by rolling each digit like
 * an odometer or by counting through the intermediate values.
 *
 * Both variants collapse to an instant swap under
 * `prefers-reduced-motion: reduce`.
 *
 * The rolling variant stacks all ten digits in each column, so the visual is
 * hidden from assistive technology and the formatted value is exposed once as
 * text instead.
 *
 * @example
 * ```tsx
 * // Headline figure
 * <AnimatedNumber value={totalGross} format={formatPrice} variant="roll" />
 *
 * // Supporting figure
 * <AnimatedNumber value={activeFans} variant="count" />
 * ```
 */
export const AnimatedNumber = React.forwardRef<HTMLSpanElement, AnimatedNumberProps>(
  (
    {
      value,
      format = defaultFormat,
      variant = "count",
      durationMs = DEFAULT_DURATION_MS,
      className,
      ...props
    },
    ref,
  ) => {
    const reducedMotion = usePrefersReducedMotion();

    if (variant === "roll") {
      return (
        <RollingNumber
          ref={ref}
          value={value}
          format={format}
          durationMs={reducedMotion ? 0 : durationMs}
          className={className}
          {...props}
        />
      );
    }

    return (
      <CountingNumber
        ref={ref}
        value={value}
        format={format}
        durationMs={reducedMotion ? 0 : durationMs}
        className={className}
        {...props}
      />
    );
  },
);

AnimatedNumber.displayName = "AnimatedNumber";

type VariantProps = Omit<AnimatedNumberProps, "variant" | "format" | "durationMs"> & {
  format: (value: number) => string;
  durationMs: number;
};

const CountingNumber = React.forwardRef<HTMLSpanElement, VariantProps>(
  ({ value, format, durationMs, className, ...props }, ref) => {
    const [displayValue, setDisplayValue] = React.useState(value);
    // Tracks what is on screen, so an interrupted tween resumes from there. Storing
    // the abandoned *target* instead would start the next tween from a number that
    // was never displayed, which shows as a jump to the old target before counting
    // on — a refetch or filter change landing mid-animation is enough to hit it.
    const displayRef = React.useRef(value);

    React.useEffect(() => {
      const from = displayRef.current;
      if (from === value || durationMs === 0) {
        displayRef.current = value;
        setDisplayValue(value);
        return;
      }

      let frame = 0;
      let start: number | undefined;

      const step = (now: number) => {
        start ??= now;
        const progress = Math.min((now - start) / durationMs, 1);
        const next = from + (value - from) * easeOutCubic(progress);
        displayRef.current = next;
        setDisplayValue(next);
        if (progress < 1) {
          frame = requestAnimationFrame(step);
        }
      };

      frame = requestAnimationFrame(step);
      return () => cancelAnimationFrame(frame);
    }, [value, durationMs]);

    return (
      <span ref={ref} className={cn("tabular-nums", className)} {...props}>
        {format(displayValue)}
      </span>
    );
  },
);

CountingNumber.displayName = "AnimatedNumber.Counting";

const RollingNumber = React.forwardRef<HTMLSpanElement, VariantProps>(
  ({ value, format, durationMs, className, ...props }, ref) => {
    const display = format(value);
    const characters = React.useMemo(() => Array.from(display), [display]);

    // Lock the box to its measured width so a change in digit count eases
    // instead of snapping: `width: auto` cannot be transitioned.
    const contentRef = React.useRef<HTMLSpanElement>(null);
    const [boxWidth, setBoxWidth] = React.useState<number>();

    // On the render where the width is still `auto` there is nothing to
    // transition from, so the duration is zeroed. This is belt-and-braces rather
    // than load-bearing: `auto` to a length is not interpolatable, so no
    // transition would run either way.
    const hasMeasured = boxWidth !== undefined;

    // Re-measure rather than measuring once per `display`: the box is
    // `overflow-hidden`, so a web font landing after the first measurement leaves
    // the locked width too narrow for the wider glyphs and clips the number until
    // the value next changes, which for a headline figure may be never. Observing
    // covers a container change too. Same approach as `useCyclingTextTrackWidth`.
    React.useLayoutEffect(() => {
      const node = contentRef.current;
      if (!node || !display) {
        return;
      }

      const measure = () => {
        const measured = node.scrollWidth;
        if (measured) {
          setBoxWidth(measured);
        }
      };

      measure();

      if (typeof ResizeObserver === "undefined") {
        return;
      }
      const observer = new ResizeObserver(measure);
      observer.observe(node);
      return () => observer.disconnect();
    }, [display]);

    return (
      <span
        ref={ref}
        className={cn("inline-flex overflow-hidden tabular-nums", className)}
        style={{
          width: boxWidth,
          transitionProperty: "width",
          transitionDuration: hasMeasured ? `${durationMs}ms` : "0ms",
          transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
        }}
        {...props}
      >
        {/* The digit columns list 0-9 apiece, which assistive tech would read
            out in full, so expose the formatted value as text instead. */}
        <span className="sr-only">{display}</span>
        <span ref={contentRef} aria-hidden className="inline-flex whitespace-pre">
          {characters.map((char, index) =>
            isDigit(char) ? (
              <span
                // biome-ignore lint/suspicious/noArrayIndexKey: a column is a position in the number, so it must keep its identity (and animate) when its digit changes
                key={`digit-${index}`}
                className="relative inline-block overflow-hidden"
                style={{ height: "1em", lineHeight: "1em" }}
              >
                <span
                  className="flex flex-col"
                  style={{
                    transform: `translateY(-${Number(char) * 10}%)`,
                    transitionProperty: "transform",
                    transitionDuration: `${durationMs}ms`,
                    transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
                  }}
                >
                  {DIGITS.map((digit) => (
                    <span key={digit} style={{ height: "1em", lineHeight: "1em" }}>
                      {digit}
                    </span>
                  ))}
                </span>
              </span>
            ) : (
              // biome-ignore lint/suspicious/noArrayIndexKey: same positional identity as the digit columns
              <span key={`separator-${index}`}>{char}</span>
            ),
          )}
        </span>
      </span>
    );
  },
);

RollingNumber.displayName = "AnimatedNumber.Rolling";
