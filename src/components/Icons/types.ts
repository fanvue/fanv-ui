import type * as React from "react";

export interface IconProps extends React.SVGAttributes<SVGSVGElement> {
  /** Size in Tailwind spacing units (1 unit = 4px). e.g. size={5} = 20px */
  size?: number;
}
