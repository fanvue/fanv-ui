import * as React from "react";
import { cn } from "../../utils/cn";

const getLogoColors = (color: LogoColor, type: LogoType) => {
  if (color === "Full colour") {
    return {
      icon: "var(--color-brand-green-500)",
      iconInner: "var(--color-body-black-solid-constant)",
      textClass: "", // Uses parent's text-body-900 dark:text-body-100
    };
  }

  if (color === "Decolour") {
    return {
      iconClass: "fill-[#151515] dark:fill-[#ffffff]",
      iconInnerClass: "fill-[#ffffff] dark:fill-[#151515]",
      textClass: "", // Uses parent's text-body-900 dark:text-body-100
    };
  }

  if (color === "White Always") {
    return {
      icon:
        type === "Icon" ? "var(--color-body-white-solid-constant)" : "var(--color-brand-green-500)",
      iconInner: "var(--color-body-black-solid-constant)",
      textClass: "text-body-white-solid-constant",
    };
  }

  if (color === "Black Always") {
    return {
      icon:
        type === "Icon" ? "var(--color-body-black-solid-constant)" : "var(--color-brand-green-500)",
      iconInner:
        type === "Icon"
          ? "var(--color-body-white-solid-constant)"
          : "var(--color-body-black-solid-constant)",
      textClass: "text-body-black-solid-constant",
    };
  }

  return {
    icon: "var(--color-brand-green-500)",
    iconInner: "var(--color-body-black-solid-constant)",
    textClass: "", // Default to adaptive color
  };
};

export type LogoType = "Full" | "Icon" | "Wordmark" | "Portrait";
export type LogoColor = "Full colour" | "Decolour" | "White Always" | "Black Always";

export interface LogoProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Logo layout type (matches Figma "Type" property) */
  type?: LogoType;
  /** Logo color scheme (matches Figma "Colour" property) */
  color?: LogoColor;
  /**
   * Accessible label for the logo.
   * Required when type="Icon" and used in interactive contexts (links, buttons).
   * @example "Fanvue home" or "Go to homepage"
   */
  "aria-label"?: string;
}

export const Logo = React.forwardRef<HTMLDivElement, LogoProps>(
  ({ className, type = "Full", color = "Full colour", ...props }, ref) => {
    const colors = getLogoColors(color, type);
    const showIcon = type === "Full" || type === "Icon" || type === "Portrait";
    const showWordmark = type === "Full" || type === "Wordmark" || type === "Portrait";

    // When aria-label is provided, add role="img" for proper accessibility
    const ariaProps = props["aria-label"] ? { role: "img" as const } : {};

    return (
      <div
        ref={ref}
        data-testid="logo"
        className={cn(
          "inline-flex items-center text-body-900 dark:text-body-100",
          type === "Portrait" ? "flex-col" : "flex-row",
          type === "Full" && "gap-2",
          className,
        )}
        {...ariaProps}
        {...props}
      >
        {showIcon && (
          <svg
            viewBox="0 0 39 39"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={cn("shrink-0", type === "Icon" ? "h-10 w-10" : "h-8 w-8")}
            aria-hidden="true"
          >
            <path
              d="M0 11.2339C0 5.02957 5.02957 0 11.2339 0H27.7661C33.9704 0 39 5.02957 39 11.2339V27.7661C39 33.9704 33.9704 39 27.7661 39H11.2339C5.02957 39 0 33.9704 0 27.7661V11.2339Z"
              {...(color === "Decolour" ? { className: colors.iconClass } : { fill: colors.icon })}
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M12.277 30.5825C11.4418 30.5825 11.0355 29.8659 11.2059 29.1153C11.4275 28.0916 12.5838 25.0548 11.7145 23.6899C10.4361 21.6938 7.25562 21.9838 6.5397 20.9602C6.02371 20.2089 6.48355 19.478 7.19738 19.0493C8.79967 18.0257 11.902 18.3157 14.9191 16.3025C16.5895 15.2106 18.1237 12.9927 18.993 11.662C20.2203 9.78527 20.7487 9.39287 23.3226 9.39287H32.3376C33.7574 9.39287 34.202 11.8036 31.8852 12.0686C31.2886 12.1368 29.6977 12.3757 27.4306 12.6487C25.2658 12.9216 20.4589 13.5728 22.351 16.6608C23.7658 18.2816 26.7488 18.0769 27.4306 19.0493C27.9238 19.7225 27.4875 20.4384 26.9505 20.7824C25.3311 21.8061 21.8737 21.6938 18.8566 23.6899C16.8111 25.0548 15.1478 28.0916 14.4659 29.1153C13.9716 29.8659 13.1293 30.5825 12.294 30.5825H12.277Z"
              {...(color === "Decolour"
                ? { className: colors.iconInnerClass }
                : { fill: colors.iconInner })}
            />
          </svg>
        )}
        {showWordmark && (
          <span
            className={cn(
              "font-bold leading-none",
              type === "Wordmark" ? "text-[32px]" : "text-[28px]",
              colors.textClass,
            )}
          >
            fanvue
          </span>
        )}
      </div>
    );
  },
);

Logo.displayName = "Logo";
