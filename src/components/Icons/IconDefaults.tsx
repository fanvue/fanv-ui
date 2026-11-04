import * as React from "react";
import type { IconSize } from "./types";

/**
 * Defaults a container applies to the prop-based icons inside it, such as a
 * menu row drawing its icons filled at 16px. An icon's own `filled` and `size`
 * props always win, and a default the icon has no artwork for is skipped.
 * Internal to the package.
 */
export type IconDefaults = { filled?: boolean; size?: IconSize };

/** No defaults. Containers that host their own icons provide it to stop an outer default leaking in. */
export const NO_ICON_DEFAULTS: IconDefaults = {};

export const IconDefaultsContext = React.createContext<IconDefaults>(NO_ICON_DEFAULTS);
