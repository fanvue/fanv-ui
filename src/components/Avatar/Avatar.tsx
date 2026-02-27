import * as AvatarPrimitive from "@radix-ui/react-avatar";
import * as React from "react";
import { cn } from "../../utils/cn";

/** Allowed pixel sizes for the avatar. */
export type AvatarSize = 16 | 24 | 32 | 40 | 48 | 64 | 88 | 148;

const AvatarContext = React.createContext<{ size: AvatarSize; NSFWShow: boolean }>({
  size: 40,
  NSFWShow: false,
});

const STATUS_POSITIONS: Record<AvatarSize, { top: number; right: number }> = {
  16: { top: -4, right: -4 },
  24: { top: -3, right: -3 },
  32: { top: -2, right: -2 },
  40: { top: -1, right: -1 },
  48: { top: 0, right: 0 },
  64: { top: 2, right: 2 },
  88: { top: 6, right: 6 },
  148: { top: 15, right: 15 },
};

/** Shared avatar styling props. */
interface AvatarStyleProps {
  /** Pixel size of the avatar. @default 40 */
  size?: AvatarSize;
  /** Whether to show the online-status indicator dot. @default false */
  onlineIndicator?: boolean;
  /** Whether to show the platinum gradient border ring. @default false */
  platinumShow?: boolean;
  /** Whether to apply the NSFW blur filter over the image. @default false */
  NSFWShow?: boolean;
}

/** Props for the low-level {@link AvatarRoot} compound component. */
export interface AvatarRootProps
  extends React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>,
    AvatarStyleProps {}

/**
 * Low-level avatar root for custom compositions. Provides size context to
 * child `AvatarImage` and `AvatarFallback` components.
 *
 * Prefer the higher-level {@link Avatar} component for most use cases.
 */
const AvatarRoot = React.forwardRef<
  React.ComponentRef<typeof AvatarPrimitive.Root>,
  AvatarRootProps
>(
  (
    {
      className,
      size = 40,
      onlineIndicator = false,
      platinumShow = false,
      NSFWShow = false,
      children,
      ...props
    },
    ref,
  ) => {
    const statusPosition = STATUS_POSITIONS[size];

    return (
      <AvatarContext.Provider value={{ size, NSFWShow }}>
        <div className="relative inline-flex">
          <AvatarPrimitive.Root
            ref={ref}
            data-testid="avatar"
            className={cn(
              "relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-neutral-100",
              size === 16 && "size-4 text-[10px]",
              size === 24 && "size-6 text-xs",
              size === 32 && "size-8 text-xs",
              size === 40 && "size-10 text-sm",
              size === 48 && "size-12 text-base",
              size === 64 && "size-16 text-xl",
              size === 88 && "size-[88px] text-2xl",
              size === 148 && "size-[148px] text-4xl",
              className,
            )}
            {...props}
          >
            {children}
          </AvatarPrimitive.Root>
          {platinumShow && (
            <div
              className="pointer-events-none absolute inset-0 rounded-full"
              style={{
                background: `linear-gradient(143deg, #504F54 0%, #B1B1B1 20.3154%, #13181C 37.3727%, #C6C6C8 58.8154%, #FFFFFF 69.3154%, #0C0F14 81.3154%, #696A6E 100%)`,
                WebkitMask: "radial-gradient(circle closest-side, transparent 96%, black 96%)",
                mask: "radial-gradient(circle closest-side, transparent 96%, black 96%)",
              }}
              aria-hidden="true"
            />
          )}
          {onlineIndicator && (
            <span
              className="absolute size-3 rounded-full border-2 border-background-150 bg-brand-green-500"
              style={{
                top: `${statusPosition.top}px`,
                right: `${statusPosition.right}px`,
              }}
              aria-hidden="true"
            />
          )}
        </div>
      </AvatarContext.Provider>
    );
  },
);

AvatarRoot.displayName = "AvatarRoot";

/** Props for the {@link AvatarImage} compound component. */
export interface AvatarImageProps
  extends React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image> {}

/** Renders the avatar image. Automatically applies the NSFW blur when enabled on the parent `AvatarRoot`. */
const AvatarImage = React.forwardRef<
  React.ComponentRef<typeof AvatarPrimitive.Image>,
  AvatarImageProps
>(({ className, ...props }, ref) => {
  const { NSFWShow } = React.useContext(AvatarContext);
  return (
    <AvatarPrimitive.Image
      ref={ref}
      className={cn("size-full bg-neutral-200 object-cover", NSFWShow && "blur-md", className)}
      {...props}
    />
  );
});

AvatarImage.displayName = "AvatarImage";

/** Props for the {@link AvatarFallback} compound component. */
export interface AvatarFallbackProps
  extends React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback> {}

/** Renders fallback content (e.g. initials or an icon) when the avatar image has not loaded. */
const AvatarFallback = React.forwardRef<
  React.ComponentRef<typeof AvatarPrimitive.Fallback>,
  AvatarFallbackProps
>(({ className, children, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      "flex size-full items-center justify-center bg-neutral-200 font-semibold text-neutral-400 uppercase leading-none",
      className,
    )}
    delayMs={0}
    {...props}
  >
    {children}
  </AvatarPrimitive.Fallback>
));

AvatarFallback.displayName = "AvatarFallback";

export interface AvatarProps
  extends React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>,
    AvatarStyleProps {
  /** URL of the avatar image. */
  src?: string;
  /** Alt text for the avatar image. @default "Avatar" */
  alt?: string;
  /** Fallback content rendered when the image has not loaded (e.g. initials or an icon). */
  fallback?: React.ReactNode;
}

/**
 * Displays a user avatar with optional online indicator, platinum border, and
 * NSFW blur. Pass `src` and `fallback` for the simple API, or compose your own
 * layout with `AvatarRoot`, `AvatarImage`, and `AvatarFallback` as children.
 *
 * @example
 * ```tsx
 * <Avatar src="/photo.jpg" alt="Jane Doe" fallback="JD" size={48} />
 * ```
 */
export const Avatar = React.forwardRef<
  React.ComponentRef<typeof AvatarPrimitive.Root>,
  AvatarProps
>(
  (
    {
      className,
      size = 40,
      src,
      alt,
      fallback,
      onlineIndicator = false,
      platinumShow = false,
      NSFWShow = false,
      children,
      ...props
    },
    ref,
  ) => {
    const rootProps = {
      ref,
      size,
      onlineIndicator,
      platinumShow,
      NSFWShow,
      className,
      ...props,
    };

    if (children) {
      return <AvatarRoot {...rootProps}>{children}</AvatarRoot>;
    }

    return (
      <AvatarRoot {...rootProps}>
        {src && <AvatarImage src={src} alt={alt ?? "Avatar"} />}
        <AvatarFallback>{fallback}</AvatarFallback>
      </AvatarRoot>
    );
  },
);

Avatar.displayName = "Avatar";

export { AvatarRoot, AvatarImage, AvatarFallback };
