import * as React from "react";

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

/**
 * The 3D brand icon: the rounded square with a radial gradient face, a gradient rim, and an
 * extruded "F" lifted off it by five stacked green drop shadows.
 *
 * Two things about the geometry are worth knowing before changing it. The icon occupies
 * 0-80 in the viewBox while the shadow reaches well past 80 on both axes, so the SVG is
 * `overflow-visible` and the element's own box is the icon alone, not the icon plus shadow.
 * A parent with `overflow-hidden` will clip the shadow. The filter region is deliberately
 * far larger than Figma's exported one so the shadow survives at every size.
 *
 * Gradient and filter ids are namespaced per instance so several logos on one page do not
 * collide. Figma also exports a duplicate of the "F" filled black at 1% opacity over an
 * already near-black shape; it is imperceptible and doubles the largest path in the file,
 * so it is omitted here.
 */
export const Logo3dIcon = ({ className }: { className?: string }) => {
  const ns = React.useId().replace(/:/g, "");
  const filterId = `logo3d-shadow-${ns}`;
  const faceId = `logo3d-face-${ns}`;
  const rimId = `logo3d-rim-${ns}`;
  const markId = `logo3d-mark-${ns}`;

  return (
    <svg
      viewBox="0 0 80 80"
      fill="none"
      overflow="visible"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
      data-testid="logo-icon"
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
          x="0"
          y="0"
          width="160"
          height="160"
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
  );
};

Logo3dIcon.displayName = "Logo3dIcon";
