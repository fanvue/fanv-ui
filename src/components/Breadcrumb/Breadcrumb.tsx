import { Slot } from "@radix-ui/react-slot";
import * as React from "react";
import { cn } from "../../utils/cn";
import { ChevronRightIcon } from "../Icons/ChevronRightIcon";

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
 *   <BreadcrumbList>
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
  /** Custom separator element rendered between items. @default ChevronRightIcon */
  separator?: React.ReactNode;
}

/**
 * Ordered list container for breadcrumb items. Automatically injects a
 * separator between each child item.
 */
export const BreadcrumbList = React.forwardRef<HTMLOListElement, BreadcrumbListProps>(
  ({ className, children, separator, ...props }, ref) => {
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
      <ol ref={ref} className={cn("flex flex-wrap items-center gap-2", className)} {...props}>
        {withSeparators}
      </ol>
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
    return (
      <Comp
        ref={ref}
        className={cn(
          "typography-regular-body-sm rounded-[2px] text-content-secondary underline-offset-2 transition-colors hover:text-content-primary hover:underline focus-visible:shadow-focus-ring focus-visible:outline-none",
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
  ({ className, ...props }, ref) => (
    <span
      ref={ref}
      aria-current="page"
      className={cn("typography-semibold-body-sm text-content-primary", className)}
      {...props}
    />
  ),
);

BreadcrumbPage.displayName = "BreadcrumbPage";

export interface BreadcrumbSeparatorProps extends React.ComponentPropsWithoutRef<"li"> {}

/**
 * Visual separator rendered between breadcrumb items.
 * Renders a right-pointing chevron icon and is hidden from assistive technology.
 */
export const BreadcrumbSeparator = React.forwardRef<HTMLLIElement, BreadcrumbSeparatorProps>(
  ({ className, children, ...props }, ref) => (
    <li
      ref={ref}
      aria-hidden="true"
      className={cn("flex items-center text-content-secondary", className)}
      {...props}
    >
      {children ?? <ChevronRightIcon className="size-4" />}
    </li>
  ),
);

BreadcrumbSeparator.displayName = "BreadcrumbSeparator";
