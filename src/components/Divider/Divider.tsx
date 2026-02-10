import * as SeparatorPrimitive from "@radix-ui/react-separator";
import * as React from "react";
import { cn } from "@/utils/cn";

export type DividerOrientation = "horizontal" | "vertical";
export type DividerType = "default" | "text";

export interface DividerProps
  extends React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root> {
  /** Custom label to display*/
  label?: string;
}

export const Divider = React.forwardRef<
  React.ElementRef<typeof SeparatorPrimitive.Root>,
  DividerProps
>(({ label, className, ...props }, ref) => {
  if (label !== undefined) {
    return (
      <div className={cn(`my-2 flex w-full items-center justify-center gap-2`, className)}>
        <SeparatorPrimitive.Root
          ref={ref}
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
