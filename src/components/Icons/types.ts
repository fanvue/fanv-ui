import type * as React from "react";

/** Icon component props. Override default size via className (e.g. className="size-6"). */
export type IconProps = React.SVGAttributes<SVGSVGElement> & {
  className?: string;
};
