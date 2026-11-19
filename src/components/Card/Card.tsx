import * as React from "react";
import { cn } from "../../utils/cn";

/** Visual hierarchy of the card. Primary is for prominent, content-carrying cards; secondary for supporting cards within denser layouts. */
export type CardHierarchy = "primary" | "secondary";

/** Structural type of the card. `default` has header, content and footer; `header-only` drops the footer; `container` is a bare surface. */
export type CardType = "default" | "header-only" | "container";

/**
 * Legacy visual style variant.
 * @deprecated Use {@link CardHierarchy} via the `hierarchy` prop instead. Retained for backwards compatibility.
 */
export type CardVariant = "outlined" | "elevated" | "filled" | "ghost";

interface CardContextValue {
  hierarchy: CardHierarchy;
  type: CardType;
}

const CardContext = React.createContext<CardContextValue>({
  hierarchy: "primary",
  type: "default",
});

const useCardContext = () => React.useContext(CardContext);

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Visual hierarchy of the card. @default "primary" */
  hierarchy?: CardHierarchy;
  /** Structural type of the card. @default "default" */
  type?: CardType;
  /** When `true`, applies the hover treatment for clickable cards. @default false */
  interactive?: boolean;
  /**
   * Legacy visual style variant.
   * @deprecated Use `hierarchy` instead. When set, the card keeps its legacy V1 appearance for backwards compatibility.
   */
  variant?: CardVariant;
  /** When `true`, the card will take the full width of its container. @default true */
  fullWidth?: boolean;
  /** When `true`, removes all internal padding. @default false */
  noPadding?: boolean;
}

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Icon element displayed at the trailing end of the header. */
  action?: React.ReactNode;
}

export interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}

export interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}

export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {}

export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

const LEGACY_VARIANT_CLASSES: Record<CardVariant, string> = {
  outlined: "border border-neutral-alphas-200 bg-surface-primary shadow-sm",
  elevated: "border border-neutral-alphas-200 bg-surface-primary shadow-md",
  filled: "bg-surface-secondary",
  ghost: "bg-transparent",
};

const HIERARCHY_CLASSES: Record<CardHierarchy, string> = {
  primary: "rounded-lg border border-border-primary bg-surface-primary",
  secondary: "rounded-md border border-border-strong bg-surface-secondary shadow-sm",
};

const INTERACTIVE_CLASSES =
  "isolate cursor-pointer after:pointer-events-none after:absolute after:inset-0 after:-z-10 after:bg-content-primary after:opacity-0 after:transition-opacity after:content-[''] hover:after:opacity-5";

/**
 * A composable card component built on the V2 design system. Compose it with
 * {@link CardHeader}, {@link CardTitle}, {@link CardDescription},
 * {@link CardContent}, and {@link CardFooter} for structured layouts.
 *
 * The `hierarchy` prop drives the surface treatment (Primary vs Secondary) and
 * the `type` prop drives the internal spacing (Default / Header Only / Container).
 *
 * @example
 * ```tsx
 * <Card hierarchy="primary">
 *   <CardHeader action={<HomeIcon className="size-5" />}>
 *     <CardTitle>Card title</CardTitle>
 *     <CardDescription>Card description text</CardDescription>
 *   </CardHeader>
 *   <CardContent>Content goes here</CardContent>
 *   <CardFooter>
 *     <Button variant="secondary">Label</Button>
 *     <Button variant="primary">Label</Button>
 *   </CardFooter>
 * </Card>
 * ```
 */
export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      hierarchy = "primary",
      type = "default",
      interactive = false,
      variant,
      fullWidth = true,
      noPadding = false,
      children,
      ...props
    },
    ref,
  ) => {
    const isLegacy = variant !== undefined;
    const padding = noPadding
      ? undefined
      : isLegacy
        ? "p-4"
        : hierarchy === "secondary"
          ? "p-4"
          : "p-6";

    const contextValue = React.useMemo<CardContextValue>(
      () => ({ hierarchy, type }),
      [hierarchy, type],
    );

    return (
      <CardContext.Provider value={contextValue}>
        <div
          ref={ref}
          className={cn(
            "relative flex flex-col overflow-hidden",
            isLegacy
              ? cn("rounded-md", LEGACY_VARIANT_CLASSES[variant])
              : HIERARCHY_CLASSES[hierarchy],
            padding,
            fullWidth && "w-full",
            interactive && INTERACTIVE_CLASSES,
            className,
          )}
          {...props}
        >
          {children}
        </div>
      </CardContext.Provider>
    );
  },
);
Card.displayName = "Card";

/**
 * Header section of a {@link Card}. Renders a flex row with text content
 * on the left and an optional trailing action element (e.g. icon) on the right.
 */
export const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, action, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("flex min-h-8 items-center gap-2", className)} {...props}>
        <div className="min-w-0 flex-1">{children}</div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
    );
  },
);
CardHeader.displayName = "CardHeader";

/** Title element rendered inside a {@link CardHeader}. Adapts its type scale to the card `hierarchy`. */
export const CardTitle = React.forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ className, children, ...props }, ref) => {
    const { hierarchy } = useCardContext();
    return (
      <h3
        ref={ref}
        className={cn(
          hierarchy === "secondary"
            ? "typography-body-small-14px-regular"
            : "typography-header-heading-xs",
          "text-content-primary",
          className,
        )}
        {...props}
      >
        {children}
      </h3>
    );
  },
);
CardTitle.displayName = "CardTitle";

/** Description text rendered below the {@link CardTitle} inside a {@link CardHeader}. */
export const CardDescription = React.forwardRef<HTMLParagraphElement, CardDescriptionProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <p
        ref={ref}
        className={cn("typography-description-12px-regular text-content-secondary", className)}
        {...props}
      >
        {children}
      </p>
    );
  },
);
CardDescription.displayName = "CardDescription";

/**
 * Flexible content area of a {@link Card}. Its vertical padding follows the card
 * `type`: `default` pads top and bottom, `header-only` pads only the top, and
 * `container` removes the built-in padding entirely.
 */
export const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, children, ...props }, ref) => {
    const { type } = useCardContext();
    const padding = type === "container" ? undefined : type === "header-only" ? "pt-6" : "py-6";
    return (
      <div ref={ref} className={cn("flex-1", padding, className)} {...props}>
        {children}
      </div>
    );
  },
);
CardContent.displayName = "CardContent";

/** Footer section of a {@link Card}. Renders children in a horizontal row with a gap. */
export const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("flex w-full items-center gap-2", className)} {...props}>
        {children}
      </div>
    );
  },
);
CardFooter.displayName = "CardFooter";
