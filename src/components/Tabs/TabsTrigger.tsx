import * as TabsPrimitive from "@radix-ui/react-tabs";
import * as React from "react";
import { cn } from "../../utils/cn";

/** Props for the {@link TabsTrigger} button component. */
export type TabsTriggerProps = React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>;

/**
 * An interactive tab that activates its associated {@link TabsContent} panel.
 *
 * Renders a `<button>` by default. Pass `asChild` to render the tab as another
 * element — e.g. a router link for navigation tabs (`<TabsTrigger asChild><Link
 * href="…">…</Link></TabsTrigger>`). With `asChild` the child element becomes
 * the tab itself (receiving `role="tab"` and focus management), so the tab
 * stays a single interactive control rather than nesting one inside the other.
 */
export const TabsTrigger = React.forwardRef<
  React.ComponentRef<typeof TabsPrimitive.Trigger>,
  TabsTriggerProps
>(({ className, children, asChild, ...props }, ref) => {
  const label = <span className="min-w-0 truncate">{children}</span>;

  // The `min-w-0 truncate` span keeps long labels ellipsised and lets
  // TabsList measure the active indicator against the label width. With
  // `asChild` the consumer's element becomes the tab, so wrap *its* children
  // in that span (rather than wrapping the element) — the tab stays a single
  // interactive control (no nested link/button) while behaviour matches the
  // default button tab.
  const content =
    asChild && React.isValidElement(children)
      ? React.cloneElement(
          children,
          undefined,
          <span className="min-w-0 truncate">
            {(children.props as { children?: React.ReactNode }).children}
          </span>,
        )
      : label;

  return (
    <TabsPrimitive.Trigger
      ref={ref}
      asChild={asChild}
      className={cn(
        "inline-flex min-w-0 items-center justify-center",
        "typography-body-default-16px-semibold cursor-pointer",
        "motion-safe:transition-colors motion-safe:duration-150 motion-safe:ease-in-out",
        "data-[orientation=horizontal]:px-4 data-[orientation=horizontal]:py-3",
        "data-[orientation=vertical]:justify-start data-[orientation=vertical]:px-4 data-[orientation=vertical]:py-3",
        "data-[state=active]:text-content-primary",
        "data-[state=inactive]:text-content-tertiary",
        "data-[state=active]:hover:text-content-primary/70",
        "data-[state=inactive]:hover:text-content-primary",
        "data-[state=active]:active:text-content-primary/70",
        "data-[state=inactive]:active:text-content-primary",
        "data-disabled:pointer-events-none",
        "data-disabled:data-[state=active]:text-content-tertiary",
        "data-disabled:data-[state=inactive]:text-neutral-alphas-200",
        "focus-visible:shadow-focus-ring focus-visible:outline-none",
        className,
      )}
      {...props}
    >
      {content}
    </TabsPrimitive.Trigger>
  );
});

TabsTrigger.displayName = "TabsTrigger";
