import * as React from "react";
import { cn } from "../../utils/cn";
import { CloseIcon } from "../Icons/CloseIcon";
import { EyeOffIcon } from "../Icons/EyeOffIcon";
import { FlagIcon } from "../Icons/FlagIcon";

/**
 * State represented by the indicator.
 * - `"default"`: media flagged / pending review (amber).
 * - `"removed"`: media removed for a policy violation (red).
 * - `"sensitive"`: sensitive content hidden behind an overlay (dark).
 */
export type MediaStatusIndicatorStatus = "default" | "removed" | "sensitive";

export interface MediaStatusIndicatorProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, "children"> {
  /** Which media state to represent. @default "default" */
  status?: MediaStatusIndicatorStatus;
  /**
   * Accessible label announced by assistive tech. Defaults to a per-status
   * description; pass your own for localisation or extra context.
   */
  label?: string;
}

type StatusConfig = { container: string; icon: React.ReactNode; label: string };

const STATUS_CONFIG: Record<MediaStatusIndicatorStatus, StatusConfig> = {
  default: {
    container: "bg-warning-surface text-warning-content",
    icon: <FlagIcon size={16} filled />,
    label: "Flagged",
  },
  removed: {
    container: "border border-error-secondary bg-error-negative-content text-content-always-white",
    icon: <CloseIcon size={16} />,
    label: "Removed",
  },
  sensitive: {
    container: "bg-buttons-overlay-default text-content-always-white",
    icon: <EyeOffIcon size={16} filled />,
    label: "Sensitive content",
  },
};

/**
 * A compact circular indicator that surfaces the moderation state of a piece of
 * media — flagged, removed, or sensitive. Typically overlaid on a thumbnail or
 * attachment.
 *
 * Renders as `role="img"` with a descriptive `aria-label`; the inner glyph is
 * decorative.
 *
 * @example
 * ```tsx
 * <MediaStatusIndicator status="sensitive" />
 * <MediaStatusIndicator status="removed" label="Removed for violating guidelines" />
 * ```
 */
export const MediaStatusIndicator = React.forwardRef<HTMLSpanElement, MediaStatusIndicatorProps>(
  ({ status = "default", label, className, ...props }, ref) => {
    const config = STATUS_CONFIG[status];
    return (
      <span
        ref={ref}
        role="img"
        aria-label={props["aria-label"] ?? label ?? config.label}
        className={cn(
          "inline-flex items-center justify-center rounded-full p-2 [&>svg]:size-4",
          config.container,
          className,
        )}
        {...props}
      >
        {config.icon}
      </span>
    );
  },
);

MediaStatusIndicator.displayName = "MediaStatusIndicator";
