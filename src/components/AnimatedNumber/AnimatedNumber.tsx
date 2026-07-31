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
    // Read the previous value inside the effect rather than depending on it, so
    // a re-render mid-animation does not restart the tween from the current
    // frame's position.
    const fromRef = React.useRef(value);

    React.useEffect(() => {
      const from = fromRef.current;
      if (from === value || durationMs === 0) {
        fromRef.current = value;
        setDisplayValue(value);
        return;
      }

      let frame = 0;
      let start: number | undefined;

      const step = (now: number) => {
        start ??= now;
        const progress = Math.min((now - start) / durationMs, 1);
        setDisplayValue(from + (value - from) * easeOutCubic(progress));
        if (progress < 1) {
          frame = requestAnimationFrame(step);
        } else {
          fromRef.current = value;
        }
      };

      frame = requestAnimationFrame(step);
      return () => {
        cancelAnimationFrame(frame);
        fromRef.current = value;
      };
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

    // The first measurement goes from `auto` to a pixel width, which must not
    // transition or every mount animates its own box in from the wrong size —
    // visible whenever a loading skeleton swaps to a rolling number.
    const hasMeasured = boxWidth !== undefined;

    React.useLayoutEffect(() => {
      if (!display) {
        return;
      }
      const measured = contentRef.current?.scrollWidth;
      if (measured) {
        setBoxWidth(measured);
      }
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
