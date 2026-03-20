import * as React from "react";
import { cn } from "@/utils/cn";
import type { IconProps } from "./types";

const LOGO_FILE = "fanvue-logo-glass-levitating.svg";

function fanvueLogoGlassLevitatingSrc(): string {
  const u = import.meta.url;
  const slash = u.lastIndexOf("/");
  return `${u.slice(0, slash + 1)}${LOGO_FILE}`;
}

/**
 * Fanvue “glass levitating” mark (Figma Basic Profile User). Raster artwork is
 * shipped as a sibling `.svg` file next to the built module.
 */
export const FanvueLogoGlassLevitatingIcon = React.forwardRef<SVGSVGElement, IconProps>(
  ({ className, ...props }, ref) => (
    <svg
      ref={ref}
      viewBox="0 0 46 41"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={cn("size-6 inline-block shrink-0", className)}
      {...props}
    >
      <image
        href={fanvueLogoGlassLevitatingSrc()}
        width={46}
        height={41}
        preserveAspectRatio="xMidYMid meet"
      />
    </svg>
  ),
);

FanvueLogoGlassLevitatingIcon.displayName = "FanvueLogoGlassLevitatingIcon";
