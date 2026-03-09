import * as React from "react";
import { cn } from "../../utils/cn";

/** Visual style variant of the card. */
export type CardVariant = "outlined" | "elevated" | "filled" | "ghost";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Visual style variant of the card. @default "outlined" */
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

const VARIANT_CLASSES: Record<CardVariant, string> = {
  outlined: "border border-neutral-200 bg-surface-container shadow-cardsubtle",
  elevated: "border border-neutral-200 bg-surface-container shadow-card",
  filled: "bg-neutral-500",
  ghost: "bg-transparent",
};

/**
 * A composable card component with multiple visual variants. Use with
 * {@link CardHeader}, {@link CardTitle}, {@link CardDescription},
 * {@link CardContent}, and {@link CardFooter} for structured layouts.
 *
 * @example
 * ```tsx
 * <Card variant="outlined">
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
    { className, variant = "outlined", fullWidth = true, noPadding = false, children, ...props },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col rounded-2xl",
          !noPadding && "p-4",
          fullWidth && "w-full",
          VARIANT_CLASSES[variant],
          className,
        )}
        {...props}
      >
        {children}
      </div>
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
      <div ref={ref} className={cn("flex items-start gap-3", className)} {...props}>
        <div className="min-w-0 flex-1">{children}</div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
    );
  },
);
CardHeader.displayName = "CardHeader";

/** Title element rendered inside a {@link CardHeader}. */
export const CardTitle = React.forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <h3
        ref={ref}
        className={cn("typography-semibold-body-lg text-foreground-default", className)}
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
        className={cn("typography-regular-body-sm text-foreground-secondary", className)}
        {...props}
      >
        {children}
      </p>
    );
  },
);
CardDescription.displayName = "CardDescription";

/** Flexible content area of a {@link Card}. Adds vertical padding between header and footer. */
export const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("flex-1 py-4", className)} {...props}>
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
      <div ref={ref} className={cn("flex items-center gap-3", className)} {...props}>
        {children}
      </div>
    );
  },
);
CardFooter.displayName = "CardFooter";
