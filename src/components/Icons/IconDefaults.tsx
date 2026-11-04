import * as React from "react";
import type { IconSize } from "./types";

/**
 * Defaults a container applies to the prop-based icons inside it, such as a
 * menu row drawing its icons filled at 16px. An icon's own `filled` and `size`
 * props always win. Internal to the package.
 */
export type IconDefaults = { filled?: boolean; size?: IconSize };

export const IconDefaultsContext = React.createContext<IconDefaults>({});
