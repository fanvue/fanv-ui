import * as React from "react";
import { cn } from "@/utils/cn";

/** Horizontal padding preset for the screen header shell. */
export type ScreenHeaderDevice = "desktop" | "mobile";

/** Background treatment for the shell (e.g. frosted bar over imagery). */
export type ScreenHeaderSurface = "default" | "frosted";

export interface ScreenHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Horizontal / vertical padding preset. @default "mobile" */
  device?: ScreenHeaderDevice;
  /** Background blur and translucent fill when `frosted`. @default "default" */
  surface?: ScreenHeaderSurface;
}

export interface ScreenHeaderToolbarProps extends React.HTMLAttributes<HTMLDivElement> {}

export interface ScreenHeaderTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}

export interface ScreenHeaderActionsProps extends React.HTMLAttributes<HTMLDivElement> {}

export interface ScreenHeaderGreetingProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Primary line (e.g. “Hello, [Name]”). */
  greetingTitle: React.ReactNode;
  /** Secondary line (e.g. “Profile”). */
  greetingSubtitle?: React.ReactNode;
}

export interface ScreenHeaderStepsProps extends React.FieldsetHTMLAttributes<HTMLFieldSetElement> {
  /** Number of segments. */
  total: number;
  /** Zero-based index of the filled segment. */
  activeIndex: number;
  /** Legend text for the fieldset. @default "Step progress" */
  progressLabel?: string;
}

export interface ScreenHeaderDotIndicatorsProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Number of dots. */
  count: number;
  /** Zero-based index of the active dot. */
  activeIndex: number;
}

export interface ScreenHeaderOnboardingRowProps extends React.HTMLAttributes<HTMLDivElement> {}

/**
 * Shell for mobile-first screen top bars (Figma “Header”). Compose with
 * {@link ScreenHeaderToolbar}, {@link ScreenHeaderTitle}, {@link ScreenHeaderActions},
 * {@link ScreenHeaderSteps}, and {@link ScreenHeaderDotIndicators}.
 *
 * @example
 * ```tsx
 * <ScreenHeader device="mobile">
 *   <ScreenHeaderToolbar>
 *     <ScreenHeaderTitle className="min-w-0 flex-1">Home</ScreenHeaderTitle>
 *     <ScreenHeaderActions>
 *       <IconButton variant="tertiary" size="32" icon={<SearchIcon />} aria-label="Search" />
 *     </ScreenHeaderActions>
 *   </ScreenHeaderToolbar>
 * </ScreenHeader>
 * ```
 */
export const ScreenHeader = React.forwardRef<HTMLDivElement, ScreenHeaderProps>(
  ({ className, device = "desktop", surface = "default", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex min-h-16 w-full flex-wrap items-center gap-2",
          device === "desktop" ? "px-6 py-4" : "p-4",
          surface === "frosted" &&
            "bg-surface-container/80 backdrop-blur-[20px] supports-[backdrop-filter]:bg-surface-container/60",
          className,
        )}
        {...props}
      />
    );
  },
);
ScreenHeader.displayName = "ScreenHeader";

/**
 * Single-row toolbar: place {@link ScreenHeaderTitle} and {@link ScreenHeaderActions} as children.
 */
export const ScreenHeaderToolbar = React.forwardRef<HTMLDivElement, ScreenHeaderToolbarProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("flex w-full min-w-0 items-center gap-2", className)}
        {...props}
      />
    );
  },
);
ScreenHeaderToolbar.displayName = "ScreenHeaderToolbar";

/** Bold title line (heading-2 scale). */
export const ScreenHeaderTitle = React.forwardRef<HTMLHeadingElement, ScreenHeaderTitleProps>(
  ({ className, ...props }, ref) => {
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
  },
);
ScreenHeaderTitle.displayName = "ScreenHeaderTitle";

/** Trailing icon buttons or controls in a {@link ScreenHeaderToolbar}. */
export const ScreenHeaderActions = React.forwardRef<HTMLDivElement, ScreenHeaderActionsProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("flex shrink-0 items-center gap-2", className)} {...props} />
    );
  },
);
ScreenHeaderActions.displayName = "ScreenHeaderActions";

/**
 * Two-line greeting block (e.g. home dashboard).
 */
export const ScreenHeaderGreeting = React.forwardRef<HTMLDivElement, ScreenHeaderGreetingProps>(
  ({ className, greetingTitle, greetingSubtitle, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("flex min-w-0 flex-1 flex-col items-start gap-0.5", className)}
        {...props}
      >
        <p className="typography-bold-heading-xs w-full min-w-0 text-foreground-default leading-[26px]">
          {greetingTitle}
        </p>
        {greetingSubtitle !== undefined && greetingSubtitle !== null && (
          <p className="typography-regular-body-md text-foreground-secondary">{greetingSubtitle}</p>
        )}
      </div>
    );
  },
);
ScreenHeaderGreeting.displayName = "ScreenHeaderGreeting";

/**
 * Segmented horizontal progress (Figma “Page Ticker”).
 */
export const ScreenHeaderSteps = React.forwardRef<HTMLFieldSetElement, ScreenHeaderStepsProps>(
  ({ className, total, activeIndex, progressLabel = "Step progress", ...props }, ref) => {
    const safeTotal = Math.max(0, Math.floor(total));
    const safeActive = Math.min(Math.max(0, Math.floor(activeIndex)), Math.max(0, safeTotal - 1));

    return (
      <fieldset
        ref={ref}
        className={cn("m-0 flex w-full min-w-0 flex-1 gap-2 border-0 px-4 py-2.5", className)}
        {...props}
      >
        <legend className="sr-only">{progressLabel}</legend>
        {Array.from({ length: safeTotal }, (_, i) => (
          <div
            // biome-ignore lint/suspicious/noArrayIndexKey: fixed segment count; order is stable
            key={i}
            className={cn(
              "h-1 min-h-px min-w-0 flex-1 rounded-2xl",
              i === safeActive ? "bg-neutral-solid" : "bg-neutral-100",
            )}
          />
        ))}
      </fieldset>
    );
  },
);
ScreenHeaderSteps.displayName = "ScreenHeaderSteps";

/**
 * Row of pagination dots (e.g. under a centered title).
 */
export const ScreenHeaderDotIndicators = React.forwardRef<
  HTMLDivElement,
  ScreenHeaderDotIndicatorsProps
>(({ className, count, activeIndex, ...props }, ref) => {
  const safeCount = Math.max(0, Math.floor(count));
  const safeActive = Math.min(Math.max(0, Math.floor(activeIndex)), Math.max(0, safeCount - 1));

  return (
    <div ref={ref} className={cn("flex items-center justify-center gap-1.5", className)} {...props}>
      {Array.from({ length: safeCount }, (_, i) => (
        <span
          // biome-ignore lint/suspicious/noArrayIndexKey: fixed dot count; order is stable
          key={i}
          role="presentation"
          className={cn(
            "size-2 shrink-0 rounded-full",
            i === safeActive ? "bg-foreground-default" : "bg-neutral-200",
          )}
        />
      ))}
    </div>
  );
});
ScreenHeaderDotIndicators.displayName = "ScreenHeaderDotIndicators";

/**
 * Full-width row for centered title + dots with edge chevrons (onboarding carousel).
 */
export const ScreenHeaderOnboardingRow = React.forwardRef<
  HTMLDivElement,
  ScreenHeaderOnboardingRowProps
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("flex w-full min-w-0 flex-1 items-center justify-between px-4 py-3", className)}
      {...props}
    />
  );
});
ScreenHeaderOnboardingRow.displayName = "ScreenHeaderOnboardingRow";
