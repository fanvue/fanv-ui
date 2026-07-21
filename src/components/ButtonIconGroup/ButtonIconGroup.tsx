import * as React from "react";
import { cn } from "../../utils/cn";

/** Orientation of the icon button cluster. */
export type ButtonIconGroupOrientation = "horizontal" | "vertical";

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
 * Exposes `role="group"` by default; pass an `aria-label` (or `aria-labelledby`,
 * or `role="toolbar"`) to describe the cluster for assistive technology.
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
    return (
      <div
        ref={ref}
        role={role}
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
