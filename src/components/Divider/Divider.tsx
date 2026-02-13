import * as SeparatorPrimitive from "@radix-ui/react-separator";
import * as React from "react";
import { cn } from "@/utils/cn";

/** Orientation of the divider line. */
export type DividerOrientation = "horizontal" | "vertical";

export interface DividerProps
  extends React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root> {
  /** Optional centred label text. When provided, the divider renders as two lines with the label between them. */
  label?: string;
}

/**
 * A horizontal separator used to divide content sections. Optionally displays a
 * centred text label between two lines.
 *
 * @example
 * ```tsx
 * <Divider />
 * <Divider label="or" />
 * ```
 */
export const Divider = React.forwardRef<
  React.ElementRef<typeof SeparatorPrimitive.Root>,
  DividerProps
>(({ label, className, ...props }, ref) => {
  if (label !== undefined) {
    return (
      <div
        ref={ref}
        className={cn(`my-2 flex w-full items-center justify-center gap-2`, className)}
      >
        <SeparatorPrimitive.Root
          decorative
          orientation="horizontal"
          className="h-px flex-1 bg-neutral-200"
          {...props}
        />
        <span className="typography-body-2-regular shrink-0 text-body-100">{label}</span>
        <SeparatorPrimitive.Root
          decorative
          orientation="horizontal"
          className="h-px flex-1 bg-neutral-200"
        />
      </div>
    );
  }

  return (
    <SeparatorPrimitive.Root
      ref={ref}
      decorative
      orientation="horizontal"
      className={cn(`mx-auto my-2 h-px w-full bg-neutral-200`, className)}
      {...props}
    />
  );
});

Divider.displayName = "Divider";
