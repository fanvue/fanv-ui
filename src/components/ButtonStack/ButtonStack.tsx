import * as React from "react";
import { cn } from "../../utils/cn";

/** Layout orientation of the buttons within a {@link ButtonStack}. */
export type ButtonStackDirection = "horizontal" | "vertical";

export interface ButtonStackProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Layout orientation. `horizontal` places buttons side by side with equal
   * widths for primary + secondary action pairs; `vertical` stacks them
   * full-width for mobile screens and narrow panels.
   * @default "horizontal"
   */
  direction?: ButtonStackDirection;
  /** Buttons to arrange — typically two {@link Button} elements. */
  children: React.ReactNode;
}

/**
 * A layout helper that arranges action buttons either side by side
 * (`horizontal`) or stacked (`vertical`). Compose it with {@link Button}
 * children rather than reimplementing button styles.
 *
 * In `horizontal` mode each child stretches to an equal width; in `vertical`
 * mode each child spans the full width of the container. Buttons keep their
 * own sizing, so pass a matching `size` to each child for consistent heights.
 *
 * @example
 * ```tsx
 * <ButtonStack direction="horizontal">
 *   <Button variant="outline">Cancel</Button>
 *   <Button variant="primary">Confirm</Button>
 * </ButtonStack>
 * ```
 */
export const ButtonStack = React.forwardRef<HTMLDivElement, ButtonStackProps>(
  ({ direction = "horizontal", className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex gap-2",
          direction === "horizontal" && "flex-row [&>*]:min-w-0 [&>*]:flex-1",
          direction === "vertical" && "flex-col [&>*]:w-full",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);

ButtonStack.displayName = "ButtonStack";
