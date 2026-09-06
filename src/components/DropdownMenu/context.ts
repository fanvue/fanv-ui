import * as React from "react";

// Lets DropdownMenuTrigger toggle the menu directly so it can gate on touch
// movement — see radix-ui/primitives#1912.
export const ToggleOpenContext = React.createContext<
  ((updater: (prev: boolean) => boolean) => void) | null
>(null);

/**
 * How a {@link DropdownMenu} presents its content.
 * - `"menu"` (default) — a Radix-positioned panel anchored to the trigger.
 * - `"sheet"` — a bottom drawer (via {@link Drawer}), for mobile/touch viewports.
 *
 * The viewport decision belongs to the consumer (it owns the breakpoint
 * source of truth), so pass e.g. `variant={isDesktop ? "menu" : "sheet"}`.
 */
export type DropdownMenuVariant = "menu" | "sheet";

export const DropdownMenuVariantContext = React.createContext<DropdownMenuVariant>("menu");
