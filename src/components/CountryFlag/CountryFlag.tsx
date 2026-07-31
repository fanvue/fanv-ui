import * as React from "react";
import { cn } from "../../utils/cn";
import { type CountryFlagCode, FLAG_SHAPES, type FlagShape } from "./flagShapes";

const SIZE_CLASS = {
  16: "size-4",
  20: "size-5",
  24: "size-6",
  32: "size-8",
} as const;

/** Rendered edge length in px. */
export type CountryFlagSize = keyof typeof SIZE_CLASS;

/** Props for {@link CountryFlag}. */
export interface CountryFlagProps extends Omit<React.SVGProps<SVGSVGElement>, "children"> {
  /**
   * Two-letter country code, case-insensitive (e.g. `"US"`, `"nl"`). Codes we
   * hold no artwork for render nothing, so a live feed of country codes can be
   * passed straight through.
   */
  country: string;
  /** Rendered edge length in px. Defaults to 20, the size the designs use. */
  size?: CountryFlagSize;
  /**
   * Accessible name, e.g. the country's translated name. Leave unset when the
   * flag sits next to that name anyway — it is then hidden from assistive tech
   * rather than read out twice.
   */
  label?: string;
}

const renderShape = (shape: FlagShape, index: number) => {
  switch (shape.tag) {
    case "path":
      return <path key={index} fill={shape.fill} d={shape.d} />;
    case "circle":
      return <circle key={index} fill={shape.fill} cx={shape.cx} cy={shape.cy} r={shape.r} />;
    case "rect":
      return (
        <rect
          key={index}
          fill={shape.fill}
          x={shape.x}
          y={shape.y}
          width={shape.width}
          height={shape.height}
          rx={shape.rx}
          ry={shape.ry}
        />
      );
    case "ellipse":
      return (
        <ellipse
          key={index}
          fill={shape.fill}
          cx={shape.cx}
          cy={shape.cy}
          rx={shape.rx}
          ry={shape.ry}
        />
      );
  }
};

/**
 * A country's flag, drawn as a circle. Use it wherever a row is keyed by
 * country — a demographics breakdown, a country picker, the country selector on
 * `PhoneField`.
 *
 * Prefer this to a flag emoji: emoji flags fall back to bare letter pairs on
 * Windows, where the fonts carry no flag glyphs.
 *
 * @example
 * ```tsx
 * <CountryFlag country="US" label="United States" />
 * ```
 */
export const CountryFlag = React.forwardRef<SVGSVGElement, CountryFlagProps>(
  ({ country, size = 20, label, className, ...props }, ref) => {
    const generatedId = React.useId();
    // Several flags share a page, so the clipping mask needs an id of its own.
    // Strip the colons React 18's `useId` produces — a url(#...) reference
    // can't carry them.
    const maskId = `country-flag-${generatedId.replace(/:/g, "")}`;

    const shapes = FLAG_SHAPES[country.toLowerCase() as CountryFlagCode];
    if (!shapes) return null;

    return (
      <svg
        ref={ref}
        viewBox="0 0 512 512"
        className={cn("shrink-0", SIZE_CLASS[size], className)}
        role={label ? "img" : undefined}
        aria-hidden={label ? undefined : true}
        {...props}
      >
        {label && <title>{label}</title>}
        <mask id={maskId}>
          <circle cx="256" cy="256" r="256" fill="#fff" />
        </mask>
        <g mask={`url(#${maskId})`}>{shapes.map(renderShape)}</g>
      </svg>
    );
  },
);

CountryFlag.displayName = "CountryFlag";
