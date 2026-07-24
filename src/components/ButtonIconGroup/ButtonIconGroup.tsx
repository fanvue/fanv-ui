import * as React from "react";
import { cn } from "../../utils/cn";

/** Orientation of the icon button cluster. */
export type ButtonIconGroupOrientation = "horizontal" | "vertical";

// Roles whose ARIA semantics include an orientation. For these we mirror the
// visual orientation so assistive tech isn't given the spec default
// (horizontal) when the cluster is stacked vertically.
const ORIENTATION_AWARE_ROLES = new Set<string>([
  "toolbar",
  "menu",
  "menubar",
  "listbox",
  "radiogroup",
  "tablist",
  "tree",
]);

export interface ButtonIconGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Direction the icon buttons flow in. Use `vertical` for side rails and
   * stacked media controls. @default "horizontal"
   */
  orientation?: ButtonIconGroupOrientation;
  /**
   * The icon buttons to cluster together. Compose {@link IconButton} elements
   * here; the group only handles layout and spacing.
   */
  children: React.ReactNode;
}

/**
 * A pre-composed cluster of {@link IconButton}s for toolbars and action rows
 * (media controls, editing tools, content action bars). Items are spaced with a
 * fixed 4px gap and stay individually rounded — this is a spaced group, not a
 * segmented/joined control.
 *
 * Exposes `role="group"` by default; pass an `aria-label` or `aria-labelledby`
 * to describe the cluster for assistive technology.
 *
 * This is a presentational layout primitive: it does not implement
 * roving-tabindex / arrow-key focus management. `role` is overridable, but if
 * you set an interactive-widget role such as `role="toolbar"` you own the
 * keyboard behaviour that role implies. For orientation-aware roles the
 * `aria-orientation` is synced to `orientation` automatically.
 *
 * @example
 * ```tsx
 * <ButtonIconGroup aria-label="Media controls">
 *   <IconButton variant="tertiary" size="48" icon={<PlayIcon />} aria-label="Play" />
 *   <IconButton variant="tertiary" size="48" icon={<ForwardIcon />} aria-label="Skip" />
 * </ButtonIconGroup>
 * ```
 */
export const ButtonIconGroup = React.forwardRef<HTMLDivElement, ButtonIconGroupProps>(
  ({ className, orientation = "horizontal", role = "group", children, ...props }, ref) => {
    const supportsOrientation = typeof role === "string" && ORIENTATION_AWARE_ROLES.has(role);
    // Spread rather than a static attribute so the value is only present for
    // orientation-aware roles (a bare div/group role does not support it).
    const orientationProps = supportsOrientation ? { "aria-orientation": orientation } : {};
    return (
      <div
        ref={ref}
        role={role}
        {...orientationProps}
        data-testid="button-icon-group"
        data-orientation={orientation}
        className={cn(
          "inline-flex items-center gap-1",
          orientation === "vertical" && "flex-col",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);

ButtonIconGroup.displayName = "ButtonIconGroup";
