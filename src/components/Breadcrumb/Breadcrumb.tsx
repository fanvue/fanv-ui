import { Slot } from "@radix-ui/react-slot";
import * as React from "react";
import { cn } from "../../utils/cn";

/** Text size preset controlling the typography of the whole breadcrumb trail. @default "12px" */
export type BreadcrumbSize = "12px" | "14px" | "16px";

const regularTypographyBySize: Record<BreadcrumbSize, string> = {
  "12px": "typography-description-12px-regular",
  "14px": "typography-body-small-14px-regular",
  "16px": "typography-body-default-16px-regular",
};

const semiboldTypographyBySize: Record<BreadcrumbSize, string> = {
  "12px": "typography-description-12px-semibold",
  "14px": "typography-body-small-14px-semibold",
  "16px": "typography-body-default-16px-semibold",
};

const BreadcrumbSizeContext = React.createContext<BreadcrumbSize>("12px");

const useBreadcrumbSize = () => React.useContext(BreadcrumbSizeContext);

export interface BreadcrumbProps extends React.ComponentPropsWithoutRef<"nav"> {
  /** Accessible label for the breadcrumb navigation landmark. @default "breadcrumb" */
  "aria-label"?: string;
}

/**
 * Root navigation wrapper for the breadcrumb trail.
 *
 * @example
 * ```tsx
 * <Breadcrumb>
 *   <BreadcrumbList size="14px">
 *     <BreadcrumbItem><BreadcrumbLink href="/">Home</BreadcrumbLink></BreadcrumbItem>
 *     <BreadcrumbSeparator />
 *     <BreadcrumbItem><BreadcrumbPage>Current Page</BreadcrumbPage></BreadcrumbItem>
 *   </BreadcrumbList>
 * </Breadcrumb>
 * ```
 */
export const Breadcrumb = React.forwardRef<HTMLElement, BreadcrumbProps>(
  ({ "aria-label": ariaLabel = "breadcrumb", ...props }, ref) => (
    <nav ref={ref} aria-label={ariaLabel} {...props} />
  ),
);

Breadcrumb.displayName = "Breadcrumb";

export interface BreadcrumbListProps extends React.ComponentPropsWithoutRef<"ol"> {
  /** Custom separator element rendered between items. @default "/" */
  separator?: React.ReactNode;
  /** Text size preset applied to every item in the trail. @default "12px" */
  size?: BreadcrumbSize;
}

/**
 * Ordered list container for breadcrumb items. Automatically injects a
 * separator between each child item and shares the trail {@link BreadcrumbSize}
 * with its descendants.
 */
export const BreadcrumbList = React.forwardRef<HTMLOListElement, BreadcrumbListProps>(
  ({ className, children, separator, size = "12px", ...props }, ref) => {
    const items = React.Children.toArray(children);
    const withSeparators = items.flatMap((child, index) => {
      const childKey = React.isValidElement(child) ? child.key : index;
      return index === 0
        ? [child]
        : [
            <BreadcrumbSeparator key={`sep-before-${childKey}`}>{separator}</BreadcrumbSeparator>,
            child,
          ];
    });

    return (
      <BreadcrumbSizeContext.Provider value={size}>
        <ol ref={ref} className={cn("flex flex-wrap items-center gap-2", className)} {...props}>
          {withSeparators}
        </ol>
      </BreadcrumbSizeContext.Provider>
    );
  },
);

BreadcrumbList.displayName = "BreadcrumbList";

export interface BreadcrumbItemProps extends React.ComponentPropsWithoutRef<"li"> {}

/**
 * List item wrapper for a single breadcrumb entry or separator.
 */
export const BreadcrumbItem = React.forwardRef<HTMLLIElement, BreadcrumbItemProps>(
  ({ className, ...props }, ref) => (
    <li ref={ref} className={cn("inline-flex items-center gap-2", className)} {...props} />
  ),
);

BreadcrumbItem.displayName = "BreadcrumbItem";

export interface BreadcrumbLinkProps extends React.ComponentPropsWithoutRef<"a"> {
  /** Render the link as a child element (e.g. a router `Link`). @default false */
  asChild?: boolean;
}

/**
 * Anchor element for a non-current breadcrumb step. Supports `asChild` for
 * router-aware link components.
 */
export const BreadcrumbLink = React.forwardRef<HTMLAnchorElement, BreadcrumbLinkProps>(
  ({ asChild = false, className, ...props }, ref) => {
    const Comp = asChild ? Slot : "a";
    const size = useBreadcrumbSize();
    return (
      <Comp
        ref={ref}
        className={cn(
          regularTypographyBySize[size],
          "rounded-[2px] text-content-secondary underline-offset-2 transition-colors hover:text-content-primary hover:underline focus-visible:shadow-focus-ring focus-visible:outline-none",
          className,
        )}
        {...props}
      />
    );
  },
);

BreadcrumbLink.displayName = "BreadcrumbLink";

export interface BreadcrumbPageProps extends React.ComponentPropsWithoutRef<"span"> {}

/**
 * Non-interactive label representing the current page in the breadcrumb trail.
 */
export const BreadcrumbPage = React.forwardRef<HTMLSpanElement, BreadcrumbPageProps>(
  ({ className, ...props }, ref) => {
    const size = useBreadcrumbSize();
    return (
      <span
        ref={ref}
        aria-current="page"
        className={cn(semiboldTypographyBySize[size], "text-content-primary", className)}
        {...props}
      />
    );
  },
);

BreadcrumbPage.displayName = "BreadcrumbPage";

export interface BreadcrumbSeparatorProps extends React.ComponentPropsWithoutRef<"li"> {}

/**
 * Visual separator rendered between breadcrumb items.
 * Renders a `/` glyph by default and is hidden from assistive technology.
 */
export const BreadcrumbSeparator = React.forwardRef<HTMLLIElement, BreadcrumbSeparatorProps>(
  ({ className, children, ...props }, ref) => {
    const size = useBreadcrumbSize();
    return (
      <li
        ref={ref}
        aria-hidden="true"
        className={cn(
          "flex items-center text-content-secondary",
          regularTypographyBySize[size],
          className,
        )}
        {...props}
      >
        {children ?? "/"}
      </li>
    );
  },
);

BreadcrumbSeparator.displayName = "BreadcrumbSeparator";
