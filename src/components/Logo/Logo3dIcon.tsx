import * as React from "react";
import { cn } from "../../utils/cn";
import type { LogoSize } from "./Logo";

const ICON_BG_PATH =
  "M0 23.0438C0 10.3171 10.3171 0 23.0438 0H56.9562C69.6829 0 80 10.3171 80 23.0438V56.9562C80 69.6829 69.6829 80 56.9562 80H23.0438C10.3171 80 0 69.6829 0 56.9562V23.0438Z";
const ICON_STROKE_PATH =
  "M23.0439 0.480469H56.9561C69.4177 0.480469 79.5195 10.5823 79.5195 23.0439V56.9561C79.5195 69.4177 69.4177 79.5195 56.9561 79.5195H23.0439C10.5823 79.5195 0.480469 69.4177 0.480469 56.9561V23.0439C0.480469 10.5823 10.5823 0.480469 23.0439 0.480469Z";
const ICON_F_PATH =
  "M25.1836 62.7333C23.4703 62.7333 22.6369 61.2634 22.9866 59.7236C23.4412 57.6238 25.813 51.3944 24.0297 48.5946C21.4073 44.5 14.8834 45.095 13.4148 42.9952C12.3564 41.4542 13.2996 39.9549 14.7639 39.0755C18.0507 36.9757 24.4144 37.5707 30.6033 33.4411C34.0299 31.2013 37.1768 26.6517 38.96 23.922C41.4775 20.0723 42.5615 19.2674 47.8412 19.2674H66.3336C69.246 19.2674 70.158 24.2124 65.4055 24.7561C64.1818 24.896 60.9183 25.386 56.2679 25.9459C51.8273 26.5059 41.967 27.8416 45.8482 34.176C48.7503 37.5007 54.8693 37.0807 56.2679 39.0755C57.2796 40.4563 56.3846 41.925 55.2831 42.6306C51.9614 44.7304 44.8692 44.5 38.6803 48.5946C34.4844 51.3944 31.0724 57.6238 29.6738 59.7236C28.6598 61.2634 26.9319 62.7333 25.2186 62.7333H25.1836Z";

/**
 * The white sheen along the "F". Figma keeps it as a separate `stroke-wrapper` layer holding
 * two strokes of this path, one bright radial catching the upper-left edge and one tighter,
 * dimmer one on the lower-right, each softened by a 0.125 blur. The path is authored in its
 * own space, so it is translated into the icon's.
 */
const SHEEN_PATH =
  "M35.1289 0.5H53.6211C54.913 0.50009 55.7831 1.59667 55.7812 2.79004C55.7803 3.37956 55.5637 3.98463 55.0752 4.47559C54.5862 4.96701 53.8087 5.3593 52.6641 5.49023C52.0487 5.56064 50.9224 5.71923 49.376 5.92871C47.8265 6.13861 45.8489 6.4009 43.5254 6.68066H43.5244C41.3126 6.95956 37.6956 7.43662 35.1182 8.65234C33.83 9.25996 32.7564 10.0719 32.2725 11.1787C31.7813 12.3023 31.9256 13.6615 32.9229 15.2891L32.9336 15.3076L32.9473 15.3232C34.4541 17.0493 36.7816 17.7901 38.8438 18.3486C39.8881 18.6315 40.858 18.8657 41.6611 19.1543C42.469 19.4446 43.0484 19.7705 43.3506 20.2012V20.2021L43.3535 20.2061C43.8056 20.8231 43.8288 21.4456 43.6211 22.001C43.4089 22.5682 42.9508 23.0723 42.4355 23.4023C41.6374 23.9066 40.6009 24.2784 39.3789 24.6143C38.1546 24.9507 36.7761 25.2437 35.2852 25.6045C32.3169 26.3228 28.962 27.2971 25.8301 29.3691H25.8291C23.6925 30.7948 21.7689 33.0825 20.2119 35.2588C18.6601 37.428 17.4365 39.5411 16.7529 40.5674L16.752 40.5684C16.2594 41.3163 15.5941 42.0459 14.8486 42.5859C14.1014 43.1272 13.292 43.4658 12.5059 43.4658H12.4707C11.6928 43.4657 11.1355 43.136 10.8057 42.6484C10.4715 42.1545 10.3557 41.475 10.5176 40.7617L10.5186 40.7588C10.6301 40.2436 10.8594 39.4743 11.1201 38.543C11.379 37.6183 11.6645 36.5469 11.8799 35.4521C12.095 34.3585 12.2425 33.2319 12.2207 32.1963C12.1989 31.1638 12.0086 30.1977 11.5283 29.4434L11.5273 29.4424C10.162 27.3106 7.79153 26.4151 5.64746 25.7891C4.55906 25.4713 3.54552 25.2274 2.69434 24.9268C1.94734 24.6628 1.38279 24.3734 1.04004 24L0.907227 23.835C0.427176 23.1353 0.407978 22.4656 0.661133 21.8672C0.888078 21.3308 1.34183 20.8358 1.92285 20.4375L2.17969 20.2725L2.18555 20.2686C2.9743 19.7646 3.95913 19.4161 5.10645 19.1143C6.25684 18.8116 7.53869 18.5636 8.9375 18.2461C11.7223 17.614 14.8966 16.7221 18.0293 14.6318L18.0283 14.6309C21.5049 12.3577 24.6782 7.76408 26.457 5.04102C27.7175 3.11358 28.5882 2.00133 29.7725 1.35254C30.9573 0.703524 32.491 0.5 35.1289 0.5Z";
const SHEEN_OFFSET = "translate(12.709 19.018)";
const SHEEN_BOX = { width: 56.2812, height: 43.9659 };

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
 * extruded "F" lifted off it by five stacked drop shadows, a white sheen along the "F", and
 * a soft green glow cast beneath the whole mark.
 *
 * The SVG filter region is Figma's exact box rather than a generous one, so the inner shadow
 * is clipped exactly where Figma clips it.
 *
 * `isolate` is required, not decorative: the face gradient blends with `mix-blend-mode:
 * lighten`, and without a stacking context of its own it composites against the page behind
 * instead of the base green, which washes the face out.
 *
 * The mark is clipped to its own box, matching Figma, so the inner shadow never escapes.
 * The green glow is a CSS drop-shadow on the wrapper, so it paints outside the box and is
 * the one part that a parent with `overflow-hidden` will cut off.
 *
 * The glow does not scale with the icon, and that is deliberate. Figma authored it at 64px,
 * scaled it by 1.25 for the 80px mark, and applies those same 64px values unchanged at 48,
 * 32 and 24 — the desktop nav uses the full-strength set on a 24px mark. Scaling it down by
 * size made it visibly too weak there, so both sets are Figma's own numbers. The outermost
 * layer is exported at zero opacity and is omitted.
 */
export const Logo3dIcon = ({ className, size }: { className?: string; size: LogoSize }) => {
  const ns = React.useId().replace(/:/g, "");
  const filterId = `logo3d-shadow-${ns}`;
  const faceId = `logo3d-face-${ns}`;
  const rimId = `logo3d-rim-${ns}`;
  const markId = `logo3d-mark-${ns}`;
  const sheenBlurId = `logo3d-sheen-blur-${ns}`;
  const sheenTopId = `logo3d-sheen-top-${ns}`;
  const sheenLowId = `logo3d-sheen-low-${ns}`;

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
        <g transform={SHEEN_OFFSET}>
          <g filter={`url(#${sheenBlurId})`}>
            <path d={SHEEN_PATH} stroke={`url(#${sheenTopId})`} strokeWidth="0.5" />
          </g>
          <g filter={`url(#${sheenBlurId})`}>
            <path d={SHEEN_PATH} stroke={`url(#${sheenLowId})`} strokeWidth="0.5" />
          </g>
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
          <filter
            id={sheenBlurId}
            x="0"
            y="0"
            width={SHEEN_BOX.width}
            height={SHEEN_BOX.height}
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
            <feGaussianBlur stdDeviation="0.125" result="sheenBlur" />
          </filter>
          <radialGradient
            id={sheenTopId}
            cx="0"
            cy="0"
            r="1"
            gradientUnits="userSpaceOnUse"
            gradientTransform="translate(18.7874 13.9827) rotate(-127.349) scale(23.9008 34.223)"
          >
            <stop stopColor="white" stopOpacity="0.95" />
            <stop offset="1" stopColor="white" stopOpacity="0" />
          </radialGradient>
          <radialGradient
            id={sheenLowId}
            cx="0"
            cy="0"
            r="1"
            gradientUnits="userSpaceOnUse"
            gradientTransform="translate(31.2874 25.9827) rotate(59.7436) scale(6.94622 9.94611)"
          >
            <stop stopColor="white" stopOpacity="0.6" />
            <stop offset="1" stopColor="white" stopOpacity="0" />
          </radialGradient>
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
