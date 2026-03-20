import * as React from "react";
import { cn } from "../../utils/cn";

/** Layout preset for horizontal padding on the header bar. */
export type MainContainerHeaderDevice = "desktop" | "mobile";

export interface MainContainerHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Horizontal padding preset. @default "desktop" */
  device?: MainContainerHeaderDevice;
}

export interface MainContainerHeaderStartProps extends React.HTMLAttributes<HTMLDivElement> {}

export interface MainContainerHeaderEndProps extends React.HTMLAttributes<HTMLDivElement> {}

export interface MainContainerHeaderTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}

/**
 * Top bar for a main content area: bottom border, vertical centering, and
 * optional {@link MainContainerHeaderStart} / {@link MainContainerHeaderEnd}
 * regions. Compose with {@link Avatar}, {@link Badge}, {@link Button},
 * {@link IconButton}, and {@link MainContainerHeaderTitle}.
 *
 * @example
 * ```tsx
 * <MainContainerHeader className="max-w-xl">
 *   <MainContainerHeaderStart>
 *     <Avatar src={src} alt="User" fallback="U" onlineIndicator />
 *     <MainContainerHeaderTitle>Title</MainContainerHeaderTitle>
 *   </MainContainerHeaderStart>
 *   <MainContainerHeaderEnd>
 *     <IconButton variant="tertiary" size="32" icon={<MoreIcon />} aria-label="More" />
 *   </MainContainerHeaderEnd>
 * </MainContainerHeader>
 * ```
 */
export const MainContainerHeader = React.forwardRef<HTMLDivElement, MainContainerHeaderProps>(
  ({ className, device = "desktop", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex min-h-16 w-full items-center justify-between border-neutral-200 border-b",
          device === "mobile" ? "p-4" : "px-6 py-4",
          className,
        )}
        {...props}
      />
    );
  },
);
MainContainerHeader.displayName = "MainContainerHeader";

/**
 * Leading cluster inside {@link MainContainerHeader} (avatar, title, badges).
 */
export const MainContainerHeaderStart = React.forwardRef<
  HTMLDivElement,
  MainContainerHeaderStartProps
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("flex min-h-0 min-w-0 flex-1 items-center gap-3", className)}
      {...props}
    />
  );
});
MainContainerHeaderStart.displayName = "MainContainerHeaderStart";

/**
 * Trailing actions inside {@link MainContainerHeader}, right-aligned.
 */
export const MainContainerHeaderEnd = React.forwardRef<HTMLDivElement, MainContainerHeaderEndProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("flex min-h-0 min-w-0 flex-1 items-center justify-end gap-2", className)}
        {...props}
      />
    );
  },
);
MainContainerHeaderEnd.displayName = "MainContainerHeaderEnd";

/**
 * Primary title line for {@link MainContainerHeaderStart}.
 */
export const MainContainerHeaderTitle = React.forwardRef<
  HTMLHeadingElement,
  MainContainerHeaderTitleProps
>(({ className, ...props }, ref) => {
  return (
    <h2
      ref={ref}
      className={cn(
        "typography-bold-heading-xs min-w-0 shrink truncate text-foreground-default leading-[26px]",
        className,
      )}
      {...props}
    />
  );
});
MainContainerHeaderTitle.displayName = "MainContainerHeaderTitle";
