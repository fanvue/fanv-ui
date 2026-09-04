import * as React from "react";
import { cn } from "../../utils/cn";
import type { LogoSize } from "./Logo";

const ICON_BG_PATH =
  "M0 23.0438C0 10.3171 10.3171 0 23.0438 0H56.9562C69.6829 0 80 10.3171 80 23.0438V56.9562C80 69.6829 69.6829 80 56.9562 80H23.0438C10.3171 80 0 69.6829 0 56.9562V23.0438Z";
const ICON_STROKE_PATH =
  "M23.0439 0.480469H56.9561C69.4177 0.480469 79.5195 10.5823 79.5195 23.0439V56.9561C79.5195 69.4177 69.4177 79.5195 56.9561 79.5195H23.0439C10.5823 79.5195 0.480469 69.4177 0.480469 56.9561V23.0439C0.480469 10.5823 10.5823 0.480469 23.0439 0.480469Z";
const ICON_F_PATH =
  "M25.1836 62.7333C23.4703 62.7333 22.6369 61.2634 22.9866 59.7236C23.4412 57.6238 25.813 51.3944 24.0297 48.5946C21.4073 44.5 14.8834 45.095 13.4148 42.9952C12.3564 41.4542 13.2996 39.9549 14.7639 39.0755C18.0507 36.9757 24.4144 37.5707 30.6033 33.4411C34.0299 31.2013 37.1768 26.6517 38.96 23.922C41.4775 20.0723 42.5615 19.2674 47.8412 19.2674H66.3336C69.246 19.2674 70.158 24.2124 65.4055 24.7561C64.1818 24.896 60.9183 25.386 56.2679 25.9459C51.8273 26.5059 41.967 27.8416 45.8482 34.176C48.7503 37.5007 54.8693 37.0807 56.2679 39.0755C57.2796 40.4563 56.3846 41.925 55.2831 42.6306C51.9614 44.7304 44.8692 44.5 38.6803 48.5946C34.4844 51.3944 31.0724 57.6238 29.6738 59.7236C28.6598 61.2634 26.9319 62.7333 25.2186 62.7333H25.1836Z";

const SHADOW_LAYERS = [
  { dx: 0.824742, dy: 1.64948, blur: 1.64948, opacity: 0.78 },
  { dx: 4.12371, dy: 4.94845, blur: 3.29897, opacity: 0.68 },
  { dx: 9.07216, dy: 11.5464, blur: 4.53608, opacity: 0.4 },
  { dx: 16.4948, dy: 20.6186, blur: 5.36082, opacity: 0.12 },
  { dx: 26.3918, dy: 32.1649, blur: 5.7732, opacity: 0.01 },
];

const SHADOW_RGB = "0 0 0 0 0.054902 0 0 0 0 0.784314 0 0 0 0 0.2";
const ALPHA_MATRIX = "0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0";

const GLOW_RGB = "92, 238, 116";
const GLOW_ALPHAS = [0.08, 0.07, 0.04, 0.01];
const GLOW_BY_SIZE = {
  base: [
    { y: 2.667, blur: 2.667 },
    { y: 10.667, blur: 5.333 },
    { y: 24, blur: 8 },
    { y: 40, blur: 9.333 },
  ],
  "80": [
    { y: 3.333, blur: 3.333 },
    { y: 13.333, blur: 6.667 },
    { y: 30, blur: 10 },
    { y: 50, blur: 11.667 },
  ],
};

/**
 * The 3D brand icon: a rounded square with a radial gradient face and a gradient rim, an
 * extruded "F" lifted off it by five stacked drop shadows, and a soft green glow cast
 * beneath the whole mark.
 *
 * Three details are load-bearing and easy to break.
 *
 * The filter region is Figma's exact box, not a generous one. It begins barely above and
 * left of the "F", which clips the blur tail on that side and leaves the bright face
 * showing right at the mark's top edge. That clipped edge is the highlight that reads as
 * the "F" catching light; widening the region bleeds shadow over it and flattens it away.
 *
 * `isolate` is required, not decorative: the face gradient blends with `mix-blend-mode:
 * lighten`, and without a stacking context of its own it composites against the page behind
 * instead of the base green, which washes the face out.
 *
 * The mark is clipped to its own box, matching Figma, so the inner shadow never escapes.
 * The green glow is a CSS drop-shadow on the wrapper, so it paints outside the box and is
 * the one part that a parent with `overflow-hidden` will cut off.
 *
 * The glow does not scale with the icon. Figma authored it at 64px, scaled it up by 1.25
 * for the 80px mark, and left it untouched for 48, 32 and 24, so those four share one set
 * of values. Both sets are Figma's own numbers rather than a multiplier, which keeps the
 * emitted CSS free of float noise. The outermost layer is exported at zero opacity and is
 * omitted.
 */
export const Logo3dIcon = ({ className, size }: { className?: string; size: LogoSize }) => {
  const ns = React.useId().replace(/:/g, "");
  const filterId = `logo3d-shadow-${ns}`;
  const faceId = `logo3d-face-${ns}`;
  const rimId = `logo3d-rim-${ns}`;
  const markId = `logo3d-mark-${ns}`;

  const glow = (size === "80" ? GLOW_BY_SIZE["80"] : GLOW_BY_SIZE.base)
    .map(({ y, blur }, i) => `drop-shadow(0 ${y}px ${blur}px rgba(${GLOW_RGB}, ${GLOW_ALPHAS[i]}))`)
    .join(" ");

  return (
    <span
      className={cn("isolate inline-block overflow-hidden", className)}
      style={{ filter: glow }}
      aria-hidden="true"
      data-testid="logo-icon"
    >
      <svg
        viewBox="0 0 80 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="block size-full"
        aria-hidden="true"
      >
        <path d={ICON_BG_PATH} fill="#49F264" />
        <path d={ICON_BG_PATH} fill={`url(#${faceId})`} style={{ mixBlendMode: "lighten" }} />
        <path d={ICON_STROKE_PATH} stroke={`url(#${rimId})`} strokeWidth="0.96016" />
        <g filter={`url(#${filterId})`}>
          <path fillRule="evenodd" clipRule="evenodd" d={ICON_F_PATH} fill={`url(#${markId})`} />
        </g>
        <defs>
          <filter
            id={filterId}
            x="10.4884"
            y="17.6179"
            width="96.1936"
            height="88.8267"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            {SHADOW_LAYERS.map((layer, i) => (
              <React.Fragment key={layer.opacity}>
                <feColorMatrix
                  in="SourceAlpha"
                  type="matrix"
                  values={ALPHA_MATRIX}
                  result="hardAlpha"
                />
                <feOffset dx={layer.dx} dy={layer.dy} />
                <feGaussianBlur stdDeviation={layer.blur} />
                <feColorMatrix type="matrix" values={`${SHADOW_RGB} 0 0 0 ${layer.opacity} 0`} />
                <feBlend
                  mode="normal"
                  in2={i === 0 ? "BackgroundImageFix" : `shadow${i}`}
                  result={`shadow${i + 1}`}
                />
              </React.Fragment>
            ))}
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2={`shadow${SHADOW_LAYERS.length}`}
              result="shape"
            />
          </filter>
          <radialGradient
            id={faceId}
            cx="0"
            cy="0"
            r="1"
            gradientUnits="userSpaceOnUse"
            gradientTransform="translate(40.4124 0) rotate(90) scale(59.7938 77.0544)"
          >
            <stop stopColor="#80F593" />
            <stop offset="1" stopColor="#49F264" />
          </radialGradient>
          <linearGradient id={rimId} x1="40" y1="0" x2="40" y2="80" gradientUnits="userSpaceOnUse">
            <stop stopColor="#ACF6B9" />
            <stop offset="1" stopColor="#0EC833" />
          </linearGradient>
          <linearGradient
            id={markId}
            x1="40.8533"
            y1="19.2674"
            x2="40.8533"
            y2="62.7333"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#151515" />
            <stop offset="1" stopColor="#151515" stopOpacity="0.7" />
          </linearGradient>
        </defs>
      </svg>
    </span>
  );
};

Logo3dIcon.displayName = "Logo3dIcon";
