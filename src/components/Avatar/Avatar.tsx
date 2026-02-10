import * as AvatarPrimitive from "@radix-ui/react-avatar";
import * as React from "react";
import { cn } from "../../utils/cn";

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

/** Shared avatar styling props */
interface AvatarStyleProps {
  /** Size variant of the avatar (matches Figma "Size" property) */
  size?: AvatarSize;
  /** Show online status indicator */
  onlineIndicator?: boolean;
  /** Show platinum gradient border (matches Figma "Platinum show" property) */
  platinumShow?: boolean;
  /** Show NSFW blur filter (matches Figma "NSFW show" property) */
  NSFWShow?: boolean;
}

export interface AvatarRootProps
  extends React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>,
    AvatarStyleProps {}

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
              size === 16 && "typography-caption-semibold size-4",
              size === 24 && "typography-caption-semibold size-6",
              size === 32 && "typography-body-2-semibold size-8",
              size === 40 && "typography-body-1-semibold size-10",
              size === 48 && "typography-heading-4 size-12",
              size === 64 && "typography-heading-3 size-16",
              size === 88 && "typography-heading-2 size-[88px]",
              size === 148 && "typography-heading-1 size-[148px]",
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

export interface AvatarImageProps
  extends React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image> {}

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

export interface AvatarFallbackProps
  extends React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback> {}

const AvatarFallback = React.forwardRef<
  React.ComponentRef<typeof AvatarPrimitive.Fallback>,
  AvatarFallbackProps
>(({ className, children, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      "flex size-full items-center justify-center bg-neutral-200 text-neutral-400 uppercase leading-none",
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
  /** URL of the avatar image */
  src?: string;
  /** Alt text for the avatar image */
  alt?: string;
  /** Fallback content (initials, icon, etc.) */
  fallback?: React.ReactNode;
}

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
