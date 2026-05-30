import * as React from "react";
import { cn } from "@/utils/cn";

export interface AgentPanelFlairProps extends React.ComponentPropsWithoutRef<"div"> {}

/**
 * Decorative background for the Creator Agent panel: an animated green aurora
 * glowing in from the top-right corner, behind a theme-aware frosted-glass layer.
 *
 * Purely presentational — it is `aria-hidden` and `pointer-events-none`, and
 * renders no interactive or textual content. Position it behind your content by
 * placing it as the first child of a `relative` container (optionally lowering
 * its stacking order with a `-z-*` className). The frosted glass uses the
 * `bg-primary` token, so it adapts to light and dark themes automatically.
 *
 * @example
 * ```tsx
 * <div className="relative overflow-hidden">
 *   <AgentPanelFlair className="-z-10" />
 *   <YourPanelContent />
 * </div>
 * ```
 */
export const AgentPanelFlair = React.forwardRef<HTMLDivElement, AgentPanelFlairProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
      {...props}
    >
      {/* Animated green aurora glowing from the top-right corner */}
      <div className="agent-panel-flair-aurora absolute inset-0 blur-[30px]" />
      {/* Frosted glass softens the aurora and keeps content legible (theme-aware) */}
      <div className="absolute inset-0 bg-bg-primary/45 backdrop-blur-[110px]" />
    </div>
  ),
);

AgentPanelFlair.displayName = "AgentPanelFlair";
