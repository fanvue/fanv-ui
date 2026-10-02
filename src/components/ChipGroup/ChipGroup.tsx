import * as React from "react";
import { cn } from "../../utils/cn";

export interface ChipGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Wrap chips across lines; when `false` they stay on one horizontally scrolling line. @default false */
  wrapped?: boolean;
  /** Chips to lay out, typically {@link Chip} elements. */
  children: React.ReactNode;
}

/**
 * A layout container for a collection of {@link Chip} elements, spaced by the
 * `spacing-horizontal-group-chip-chip` token. Renders with `role="group"`, so
 * pass `aria-label` or `aria-labelledby` to describe what the chips control.
 *
 * @example
 * ```tsx
 * <ChipGroup aria-label="Categories" wrapped>
 *   <Chip selected onClick={toggle}>Music</Chip>
 *   <Chip onClick={toggle}>Fitness</Chip>
 * </ChipGroup>
 * ```
 */
export const ChipGroup = React.forwardRef<HTMLDivElement, ChipGroupProps>(
  ({ wrapped = false, className, children, ...props }, ref) => {
    return (
      // biome-ignore lint/a11y/useSemanticElements: <fieldset> is for form controls and its default min-width breaks horizontal scrolling
      <div
        ref={ref}
        role="group"
        className={cn(
          "flex items-center gap-x-(--spacing-horizontal-group-chip-chip)",
          wrapped && "flex-wrap gap-y-(--spacing-vertical-group-chip-chip)",
          !wrapped &&
            "flex-nowrap overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden [&>*]:shrink-0",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);

ChipGroup.displayName = "ChipGroup";
