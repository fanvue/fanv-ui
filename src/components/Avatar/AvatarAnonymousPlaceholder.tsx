import { cn } from "../../utils/cn";
import { FanvueLogoGlassLevitatingIcon } from "../Icons/FanvueLogoGlassLevitatingIcon";

export interface AvatarAnonymousPlaceholderProps {
  className?: string;
}

/**
 * Fanvue “Basic Profile User” placeholder: neutral circular fill and centered
 * brand mark. Use with {@link Avatar} `anonymousUser`, or inside
 * `AvatarFallback` for compound layouts.
 *
 * @see https://www.figma.com/design/S8zFdcOjt4qN4PrwntuCdt/Fanvue-Library?node-id=15990-684
 */
export function AvatarAnonymousPlaceholder({ className }: AvatarAnonymousPlaceholderProps) {
  return (
    <div className={cn("relative size-full", className)} aria-hidden>
      <div className="absolute inset-0 rounded-full" style={{ backgroundColor: "#EAE9DD" }} />
      <div className="relative flex size-full items-center justify-center">
        <FanvueLogoGlassLevitatingIcon className="pointer-events-none max-h-[46.6%] w-[52.3%]" />
      </div>
    </div>
  );
}
