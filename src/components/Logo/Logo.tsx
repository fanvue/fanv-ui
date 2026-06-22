import * as React from "react";
import { cn } from "../../utils/cn";
import { AGENCIES_ICON_SVG } from "./agenciesIcon";

const getLogoColors = (color: LogoColor, variant: LogoVariant) => {
  if (color === "fullColour") {
    return {
      icon: "var(--color-brand-primary-default)",
      iconInner: "var(--primitives-color-gray-black)",
      textClass: "",
    };
  }

  if (color === "decolour") {
    return {
      iconClass: "fill-[#151515] dark:fill-[#ffffff]",
      iconInnerClass: "fill-[#ffffff] dark:fill-[#151515]",
      textClass: "",
    };
  }

  if (color === "whiteAlways") {
    return {
      icon:
        variant === "icon"
          ? "var(--primitives-color-gray-white)"
          : "var(--color-brand-primary-default)",
      iconInner: "var(--primitives-color-gray-black)",
      textClass: "text-content-always-white",
    };
  }

  if (color === "blackAlways") {
    return {
      icon:
        variant === "icon"
          ? "var(--primitives-color-gray-black)"
          : "var(--color-brand-primary-default)",
      iconInner:
        variant === "icon"
          ? "var(--primitives-color-gray-white)"
          : "var(--primitives-color-gray-black)",
      textClass: "text-content-always-black",
    };
  }

  return {
    icon: "var(--color-brand-primary-default)",
    iconInner: "var(--primitives-color-gray-black)",
    textClass: "",
  };
};

/** Layout variant of the logo. */
export type LogoVariant = "full" | "icon" | "wordmark" | "portrait";
/** Colour scheme of the logo. */
export type LogoColor = "fullColour" | "decolour" | "whiteAlways" | "blackAlways";
/** Sub-brand version of the logo. */
export type LogoVersion = "default" | "agencies";
/** Height of the logo in pixels. Both icon and wordmark scale proportionally. */
export type LogoSize = "16" | "20" | "24" | "32" | "40" | "48" | "64";

const sizeClasses: Record<LogoSize, string> = {
  "16": "h-4",
  "20": "h-5",
  "24": "h-6",
  "32": "h-8",
  "40": "h-10",
  "48": "h-12",
  "64": "h-16",
};

export interface LogoProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Layout variant of the logo. @default "full" */
  variant?: LogoVariant;
  /** Colour scheme of the logo. @default "fullColour" */
  color?: LogoColor;
  /** Sub-brand version of the logo. @default "default" */
  version?: LogoVersion;
  /** Height of the logo in pixels. @default "32" (or "40" when `variant="icon"`) */
  size?: LogoSize;
  /**
   * Accessible label for the logo. Required when `variant` is `"icon"` and
   * the logo is used inside interactive contexts (links, buttons).
   *
   * @example "Fanvue home"
   */
  "aria-label"?: string;
}

const ICON_BG_PATH =
  "M0 11.2339C0 5.02957 5.02957 0 11.2339 0H27.7661C33.9704 0 39 5.02957 39 11.2339V27.7661C39 33.9704 33.9704 39 27.7661 39H11.2339C5.02957 39 0 33.9704 0 27.7661V11.2339Z";
const ICON_F_PATH =
  "M12.277 30.5825C11.4418 30.5825 11.0355 29.8659 11.2059 29.1153C11.4275 28.0916 12.5838 25.0548 11.7145 23.6899C10.4361 21.6938 7.25562 21.9838 6.5397 20.9602C6.02371 20.2089 6.48355 19.478 7.19738 19.0493C8.79967 18.0257 11.902 18.3157 14.9191 16.3025C16.5895 15.2106 18.1237 12.9927 18.993 11.662C20.2203 9.78527 20.7487 9.39287 23.3226 9.39287H32.3376C33.7574 9.39287 34.202 11.8036 31.8852 12.0686C31.2886 12.1368 29.6977 12.3757 27.4306 12.6487C25.2658 12.9216 20.4589 13.5728 22.351 16.6608C23.7658 18.2816 26.7488 18.0769 27.4306 19.0493C27.9238 19.7225 27.4875 20.4384 26.9505 20.7824C25.3311 21.8061 21.8737 21.6938 18.8566 23.6899C16.8111 25.0548 15.1478 28.0916 14.4659 29.1153C13.9716 29.8659 13.1293 30.5825 12.294 30.5825H12.277Z";

/** The flat brand icon (rounded square + "F" knockout), coloured per scheme. */
const FlatIconSVG = ({
  className,
  color,
  variant,
}: {
  className?: string;
  color: LogoColor;
  variant: LogoVariant;
}) => {
  const colors = getLogoColors(color, variant);
  return (
    <svg
      viewBox="0 0 39 39"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
      data-testid="logo-icon"
    >
      <path
        d={ICON_BG_PATH}
        {...(color === "decolour" ? { className: colors.iconClass } : { fill: colors.icon })}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d={ICON_F_PATH}
        {...(color === "decolour"
          ? { className: colors.iconInnerClass }
          : { fill: colors.iconInner })}
      />
    </svg>
  );
};

/**
 * The glossy "Fanvue Agencies" gradient icon. Injected as markup so its gradients and
 * blend-mode gloss render intact; `isolate` keeps the blend from reaching the page, and
 * ids are namespaced per instance so multiple logos on a page don't collide.
 */
const AgenciesIconSVG = ({ className }: { className?: string }) => {
  const ns = React.useId().replace(/:/g, "");
  const html = React.useMemo(
    () =>
      AGENCIES_ICON_SVG.replace(/id="([a-z]+)"/g, `id="$1${ns}"`)
        .replace(/url\(#([a-z]+)\)/g, `url(#$1${ns})`)
        .replace(/href="#([a-z]+)"/g, `href="#$1${ns}"`),
    [ns],
  );
  return (
    <span
      className={cn("inline-block aspect-square isolate", className)}
      aria-hidden="true"
      data-testid="logo-icon"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: static asset, ids namespaced per instance
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

const WordmarkSVG = ({ className }: { className?: string }) => {
  return (
    <svg
      viewBox="0 0 128 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
      data-testid="logo-wordmark"
    >
      <path
        d="M89.0679 20.1823C89.0679 23.4373 90.1256 25.553 93.0961 25.553C95.9847 25.553 98.1815 23.0304 98.1815 17.7818V8.01701H102.902V29.0523H98.2629V25.3495C97.1238 27.75 95.2114 29.6218 91.9566 29.6218C86.464 29.6218 84.3888 26.0006 84.3888 21.1589V8.01701H89.0679V20.1823ZM116.586 7.44485C123.787 7.44485 126.717 12.9782 126.757 18.9592C126.757 19.1627 126.757 19.4883 126.716 19.8544H110.523C110.889 23.5569 113.249 25.8353 116.586 25.8353C118.986 25.8353 121.02 24.8995 121.752 22.8245H126.432C125.211 27.0966 121.59 29.6192 116.586 29.6192C110.279 29.6192 106.007 25.1028 106.007 18.4707C106.007 12.0829 110.483 7.44485 116.586 7.44485ZM29.0135 7.40527C35.971 7.40527 37.8834 11.5958 37.8834 16.112V24.2089C37.8834 25.7957 37.965 27.8301 38.2091 29.0508H33.408C33.3266 28.237 33.2858 27.4232 33.2858 26.5688V25.5922H33.2451C32.5534 27.301 30.7633 29.5795 26.5726 29.5796C21.8122 29.5796 19.1673 26.6501 19.1673 23.3137C19.1674 17.4955 26.2876 17.0073 29.3391 16.5191C32.0245 16.1122 33.2451 15.5831 33.2451 13.7929C33.2451 12.1248 31.6581 11.067 29.0949 11.067C26.8165 11.067 25.1484 12.3691 24.6601 14.4441H20.1846C20.7135 11.1078 23.5208 7.40535 29.0135 7.40527ZM66.6676 8.01701C68.4577 13.5504 70.2072 18.8399 71.9568 24.3326H71.9973C73.5435 19.2874 75.4559 13.5911 77.2055 8.01701H82.2099C79.606 15.0559 77.0835 22.0134 74.5202 29.0523H69.312L61.6223 8.01701H66.6676ZM18.3094 4.15021H4.92328V12.2878H17.2107V16.3973H4.92328V29.0508H0V0H18.3094V4.15021ZM52.6473 7.44485C58.099 7.44493 60.2147 11.066 60.2147 15.9077V29.0497H55.536V16.8839C55.536 13.629 54.437 11.5133 51.5078 11.5133C48.5783 11.5133 46.4216 14.036 46.4216 19.2845V29.0497H41.7024V8.01436H46.3406V11.7168C47.4392 9.31627 49.3921 7.44485 52.6473 7.44485ZM33.3265 17.0886C32.879 18.2685 31.7802 19.2856 28.1997 19.9773C25.3111 20.5062 23.8464 21.4015 23.8464 23.1509C23.8464 24.8191 25.2704 26.04 27.7523 26.04C30.5597 26.04 33.3265 24.2902 33.3265 19.2857V17.0886ZM116.586 11.1066C113.249 11.1066 111.011 13.263 110.564 16.5179H122.119C121.834 13.5071 120.085 11.1066 116.586 11.1066Z"
        fill="currentColor"
      />
    </svg>
  );
};

/**
 * The "Fanvue Agencies" lockup: the wordmark with a right-aligned AGENCIES sub-label.
 * Anchoring the column's font-size to the icon height (1em) sizes the wordmark (0.75em)
 * and label (0.25em) in `em`, so both scale with `size`. `padTop` adds the 0.125em that
 * centres the 0.75em wordmark against the full-height icon in the horizontal lockup.
 */
const AgenciesWordmark = ({
  size,
  color,
  textClass,
  padTop,
}: {
  size: LogoSize;
  color: LogoColor;
  textClass: string;
  padTop: boolean;
}) => (
  <div
    className={cn("inline-flex flex-col items-end", padTop && "pt-[0.125em]")}
    style={{ fontSize: `${size}px` }}
  >
    <WordmarkSVG className={cn("h-[0.75em] w-auto", textClass)} />
    <span
      className="font-bold uppercase leading-none"
      style={{
        color: color === "decolour" ? "currentColor" : "var(--primitives-color-purple-300)",
        fontSize: "0.25em",
        letterSpacing: "0.05em",
        marginTop: "0.06em",
      }}
    >
      AGENCIES
    </span>
  </div>
);

/**
 * The Fanvue brand logo. Supports full (icon + wordmark), icon-only, wordmark-only, and
 * portrait (stacked) layouts with multiple colour schemes. `version="agencies"` renders the
 * sub-brand lockup: a glossy purple icon and an "AGENCIES" label beneath the wordmark.
 *
 * @example
 * ```tsx
 * <Logo variant="full" color="fullColour" />
 * <Logo variant="full" version="agencies" />
 * ```
 */
export const Logo = React.forwardRef<HTMLDivElement, LogoProps>(
  (
    { className, variant = "full", color = "fullColour", version = "default", size, ...props },
    ref,
  ) => {
    const colors = getLogoColors(color, variant);
    const isAgencies = version === "agencies";
    const isAgenciesFull = isAgencies && variant === "full";
    const showIcon = variant === "full" || variant === "icon" || variant === "portrait";
    const showWordmark = variant === "full" || variant === "wordmark" || variant === "portrait";
    const resolvedSize = size ?? (variant === "icon" ? "40" : "32");
    const sizeClass = sizeClasses[resolvedSize];

    const ariaProps = props["aria-label"] ? { role: "img" as const } : {};
    // The glossy icon only has a purple treatment; decolour falls back to the flat mono icon.
    const useGlossyIcon = isAgencies && color !== "decolour";

    return (
      <div
        ref={ref}
        data-testid="logo"
        className={cn(
          "inline-flex text-content-primary",
          // Agencies full lockup aligns the icon and wordmark by their centres while the
          // AGENCIES label hangs below; every other case centres the row.
          isAgenciesFull ? "items-start" : "items-center",
          variant === "portrait" ? "flex-col gap-2" : "flex-row",
          variant === "full" && "gap-2",
          className,
        )}
        {...ariaProps}
        {...props}
      >
        {showIcon &&
          (useGlossyIcon ? (
            <AgenciesIconSVG className={cn("w-auto shrink-0", sizeClass)} />
          ) : (
            <FlatIconSVG
              className={cn("w-auto shrink-0", sizeClass)}
              color={color}
              variant={variant}
            />
          ))}
        {showWordmark &&
          (isAgencies ? (
            <AgenciesWordmark
              size={resolvedSize}
              color={color}
              textClass={colors.textClass}
              padTop={isAgenciesFull}
            />
          ) : (
            <WordmarkSVG className={cn("w-auto", sizeClass, colors.textClass)} />
          ))}
      </div>
    );
  },
);

Logo.displayName = "Logo";
