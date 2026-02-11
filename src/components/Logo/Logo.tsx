import * as React from "react";
import { cn } from "../../utils/cn";

const getLogoColors = (color: LogoColor, type: LogoType) => {
  if (color === "fullColour") {
    return {
      icon: "var(--color-brand-green-500)",
      iconInner: "var(--color-body-black-solid-constant)",
      textClass: "", // Uses parent's text-body-900 dark:text-body-100
    };
  }

  if (color === "decolour") {
    return {
      iconClass: "fill-[#151515] dark:fill-[#ffffff]",
      iconInnerClass: "fill-[#ffffff] dark:fill-[#151515]",
      textClass: "", // Uses parent's text-body-900 dark:text-body-100
    };
  }

  if (color === "whiteAlways") {
    return {
      icon:
        type === "icon" ? "var(--color-body-white-solid-constant)" : "var(--color-brand-green-500)",
      iconInner: "var(--color-body-black-solid-constant)",
      textClass: "text-body-white-solid-constant",
    };
  }

  if (color === "blackAlways") {
    return {
      icon:
        type === "icon" ? "var(--color-body-black-solid-constant)" : "var(--color-brand-green-500)",
      iconInner:
        type === "icon"
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

export type LogoType = "full" | "icon" | "wordmark" | "portrait";
export type LogoColor = "fullColour" | "decolour" | "whiteAlways" | "blackAlways";

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

const WordmarkSVG = ({ className }: { className?: string }) => {
  return (
    <svg
      width="128"
      height="30"
      viewBox="0 0 128 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
      data-testid="logo-wordmark"
    >
      <path
        d="M4.29144 15.2807V29.5588H10.4278V15.2807H16.0428V10.0668H10.4278V8.18181C10.4278 7.35294 10.6684 6.69786 11.1497 6.21658C11.631 5.73529 12.2861 5.49465 13.115 5.49465C13.5695 5.49465 13.9572 5.57486 14.2781 5.73529C14.6257 5.86898 14.9331 6.06951 15.2005 6.33689L19.0508 2.48663C18.3021 1.71123 17.4198 1.10963 16.4037 0.681819C15.4144 0.227273 14.2513 0 12.9144 0C11.1497 0 9.62566 0.374331 8.34224 1.12299C7.05882 1.84492 6.05615 2.84759 5.33422 4.13102C4.63903 5.3877 4.29144 6.80481 4.29144 8.38235V10.0668H0V15.2807H4.29144Z"
        fill="currentColor"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M112.349 28.7166C114.006 29.5722 115.891 30 118.004 30C119.635 30 121.132 29.7193 122.496 29.1578C123.859 28.5963 125.022 27.754 125.985 26.631L122.616 23.262C122.028 23.9305 121.346 24.4385 120.571 24.7861C119.795 25.107 118.926 25.2674 117.964 25.2674C116.921 25.2674 116.012 25.0535 115.236 24.6257C114.488 24.1711 113.899 23.5428 113.472 22.7406C113.337 22.4624 113.225 22.166 113.135 21.8515L127.108 21.8182C127.215 21.3102 127.282 20.869 127.308 20.4947C127.362 20.0936 127.389 19.7193 127.389 19.3717C127.389 17.4733 126.961 15.7888 126.105 14.3182C125.276 12.8476 124.127 11.6979 122.656 10.869C121.185 10.0401 119.488 9.62568 117.562 9.62568C115.584 9.62568 113.806 10.0669 112.228 10.9492C110.651 11.8316 109.394 13.0481 108.458 14.5989C107.549 16.123 107.095 17.861 107.095 19.8128C107.095 21.7647 107.562 23.516 108.498 25.0668C109.434 26.6176 110.718 27.8342 112.349 28.7166ZM113.138 17.6391C113.218 17.3577 113.316 17.093 113.431 16.8449C113.833 16.0428 114.381 15.4278 115.076 15C115.798 14.5455 116.64 14.3182 117.603 14.3182C118.512 14.3182 119.274 14.5187 119.889 14.9198C120.53 15.2941 121.012 15.8556 121.333 16.6043C121.467 16.9061 121.575 17.243 121.658 17.615L113.138 17.6391Z"
        fill="currentColor"
      />
      <path
        d="M90.6482 28.9171C92.0386 29.639 93.6295 30 95.421 30C97.2124 30 98.7899 29.639 100.154 28.9171C101.517 28.1684 102.587 27.1524 103.362 25.869C104.138 24.5588 104.525 23.0481 104.525 21.3369V10.0668H98.3889V21.2968C98.3889 22.3128 98.1215 23.115 97.5867 23.7032C97.052 24.2647 96.33 24.5454 95.421 24.5454C94.7792 24.5454 94.2311 24.4118 93.7766 24.1444C93.322 23.877 92.9744 23.5027 92.7338 23.0214C92.5199 22.5401 92.4129 21.9652 92.4129 21.2968V10.0668H86.2766V21.377C86.2766 23.0615 86.6643 24.5588 87.4397 25.869C88.2151 27.1524 89.2846 28.1684 90.6482 28.9171Z"
        fill="currentColor"
      />
      <path
        d="M71.3524 29.5588L63.0904 10.0668H69.708L73.8792 22.1333L78.0503 10.0668H84.5476L76.2856 29.5588H71.3524Z"
        fill="currentColor"
      />
      <path
        d="M55.1386 18.4492V29.5588H61.2749V17.0855C61.2749 15.7486 60.9541 14.5187 60.3124 13.3957C59.6707 12.2727 58.7883 11.377 57.6653 10.7085C56.5691 10.0134 55.299 9.66576 53.8552 9.66576C52.3578 9.66576 51.0076 9.98662 49.8044 10.6283C49.2874 10.8986 48.8195 11.2204 48.4006 11.5939V10.0668H42.2642V29.5588H48.4006V18.4492C48.4006 17.7807 48.5477 17.1925 48.8418 16.6845C49.1359 16.1497 49.537 15.7486 50.045 15.4813C50.553 15.1872 51.1413 15.0401 51.8097 15.0401C52.7723 15.0401 53.561 15.3609 54.176 16.0027C54.8177 16.6176 55.1386 17.4331 55.1386 18.4492Z"
        fill="currentColor"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M26.5533 29.9599C24.7619 29.9599 23.1576 29.5187 21.7405 28.6363C20.3501 27.754 19.2405 26.5508 18.4116 25.0267C17.6094 23.5027 17.2084 21.7647 17.2084 19.8128C17.2084 17.8609 17.6094 16.123 18.4116 14.5989C19.2405 13.0749 20.3501 11.8716 21.7405 10.9893C23.1576 10.1069 24.7619 9.66576 26.5533 9.66576C27.8635 9.66576 29.0399 9.91977 30.0827 10.4278C30.7839 10.7608 31.3988 11.1801 31.9276 11.6855V10.0668H37.9437V29.5588H31.9276V27.9791C31.4153 28.4634 30.8137 28.8697 30.1228 29.1978C29.0533 29.7059 27.8635 29.9599 26.5533 29.9599ZM27.7966 24.4251C29.1068 24.4251 30.1629 23.9973 30.9651 23.1417C31.7672 22.2593 32.1683 21.1497 32.1683 19.8128C32.1683 18.9037 31.9811 18.1016 31.6068 17.4064C31.2592 16.7112 30.7512 16.1765 30.0827 15.8021C29.441 15.4011 28.6923 15.2005 27.8367 15.2005C26.9811 15.2005 26.2191 15.4011 25.5506 15.8021C24.9089 16.1765 24.3875 16.7112 23.9865 17.4064C23.6121 18.1016 23.425 18.9037 23.425 19.8128C23.425 20.6952 23.6121 21.4839 23.9865 22.1791C24.3608 22.8743 24.8822 23.4224 25.5506 23.8235C26.2191 24.2246 26.9677 24.4251 27.7966 24.4251Z"
        fill="currentColor"
      />
    </svg>
  );
};

export const Logo = React.forwardRef<HTMLDivElement, LogoProps>(
  ({ className, type = "full", color = "fullColour", ...props }, ref) => {
    const colors = getLogoColors(color, type);
    const showIcon = type === "full" || type === "icon" || type === "portrait";
    const showWordmark = type === "full" || type === "wordmark" || type === "portrait";

    // When aria-label is provided, add role="img" for proper accessibility
    const ariaProps = props["aria-label"] ? { role: "img" as const } : {};

    return (
      <div
        ref={ref}
        data-testid="logo"
        className={cn(
          "inline-flex items-center text-body-900 dark:text-body-100",
          type === "portrait" ? "flex-col" : "flex-row",
          type === "full" && "gap-2",
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
            className={cn("shrink-0", type === "icon" ? "h-10 w-10" : "h-8 w-8")}
            aria-hidden="true"
            data-testid="logo-icon"
          >
            <path
              d="M0 11.2339C0 5.02957 5.02957 0 11.2339 0H27.7661C33.9704 0 39 5.02957 39 11.2339V27.7661C39 33.9704 33.9704 39 27.7661 39H11.2339C5.02957 39 0 33.9704 0 27.7661V11.2339Z"
              {...(color === "decolour" ? { className: colors.iconClass } : { fill: colors.icon })}
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M12.277 30.5825C11.4418 30.5825 11.0355 29.8659 11.2059 29.1153C11.4275 28.0916 12.5838 25.0548 11.7145 23.6899C10.4361 21.6938 7.25562 21.9838 6.5397 20.9602C6.02371 20.2089 6.48355 19.478 7.19738 19.0493C8.79967 18.0257 11.902 18.3157 14.9191 16.3025C16.5895 15.2106 18.1237 12.9927 18.993 11.662C20.2203 9.78527 20.7487 9.39287 23.3226 9.39287H32.3376C33.7574 9.39287 34.202 11.8036 31.8852 12.0686C31.2886 12.1368 29.6977 12.3757 27.4306 12.6487C25.2658 12.9216 20.4589 13.5728 22.351 16.6608C23.7658 18.2816 26.7488 18.0769 27.4306 19.0493C27.9238 19.7225 27.4875 20.4384 26.9505 20.7824C25.3311 21.8061 21.8737 21.6938 18.8566 23.6899C16.8111 25.0548 15.1478 28.0916 14.4659 29.1153C13.9716 29.8659 13.1293 30.5825 12.294 30.5825H12.277Z"
              {...(color === "decolour"
                ? { className: colors.iconInnerClass }
                : { fill: colors.iconInner })}
            />
          </svg>
        )}
        {showWordmark && <WordmarkSVG className={cn(colors.textClass)} />}
      </div>
    );
  },
);

Logo.displayName = "Logo";
