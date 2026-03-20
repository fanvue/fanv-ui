import { cn } from "../../utils/cn";

const LOGO_FILE = "fanvue-logo-glass-levitating.png";

function anonymousPlaceholderLogoSrc(): string {
  const u = import.meta.url;
  const slash = u.lastIndexOf("/");
  return `${u.slice(0, slash + 1)}assets/${LOGO_FILE}`;
}

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
        <img
          src={anonymousPlaceholderLogoSrc()}
          alt=""
          className="pointer-events-none max-h-[46.6%] w-[52.3%] object-contain"
        />
      </div>
    </div>
  );
}
