import * as TabsPrimitive from "@radix-ui/react-tabs";
import * as React from "react";
import { cn } from "../../utils/cn";
import { TabsAppearanceContext } from "./TabsList";

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
 *
 * Inside a `TabsList appearance="pill"` the tab takes the pill styling.
 */
export const TabsTrigger = React.forwardRef<
  React.ComponentRef<typeof TabsPrimitive.Trigger>,
  TabsTriggerProps
>(({ className, children, asChild, ...props }, ref) => {
  const { appearance, size } = React.useContext(TabsAppearanceContext);
  const labelClassName = cn("min-w-0 truncate", appearance === "pill" && "flex items-center gap-2");
  const label = <span className={labelClassName}>{children}</span>;

  // The `min-w-0 truncate` span keeps long labels ellipsised. With `asChild`
  // the consumer's element becomes the tab, so wrap *its* children in that
  // span (rather than wrapping the element) — the tab stays a single
  // interactive control (no nested link/button) while behaviour matches the
  // default button tab.
  const content =
    asChild && React.isValidElement(children)
      ? React.cloneElement(
          children,
          undefined,
          <span className={labelClassName}>
            {(children.props as { children?: React.ReactNode }).children}
          </span>,
        )
      : label;

  return (
    <TabsPrimitive.Trigger
      ref={ref}
      asChild={asChild}
      className={cn(
        "inline-flex min-w-0 cursor-pointer items-center justify-center",
        "motion-safe:transition-colors motion-safe:duration-150 motion-safe:ease-in-out",
        "data-disabled:pointer-events-none",
        "focus-visible:shadow-focus-ring focus-visible:outline-none",
        appearance === "pill"
          ? [
              "relative z-0 shrink-0 gap-2 rounded-full px-4 data-pill:z-10",
              size === "36" ? "h-9" : "h-8",
              "typography-body-small-14px-semibold",
              "motion-safe:duration-[160ms] data-pill:motion-safe:delay-(--pill-arrive)",
              "text-content-secondary data-pill:text-content-primary-inverted",
              "not-data-pill:hover:text-content-primary",
              "data-disabled:data-[state=inactive]:text-neutral-alphas-200",
            ]
          : [
              "typography-body-default-16px-semibold",
              "data-[orientation=horizontal]:px-4 data-[orientation=horizontal]:py-3",
              "data-[orientation=vertical]:justify-start data-[orientation=vertical]:px-4 data-[orientation=vertical]:py-3",
              "data-[state=active]:text-content-primary",
              "data-[state=inactive]:text-content-tertiary",
              "data-[state=active]:hover:text-content-primary/70",
              "data-[state=inactive]:hover:text-content-primary",
              "data-[state=active]:active:text-content-primary/70",
              "data-[state=inactive]:active:text-content-primary",
              "data-disabled:data-[state=active]:text-content-tertiary",
              "data-disabled:data-[state=inactive]:text-neutral-alphas-200",
            ],
        className,
      )}
      {...props}
    >
      {content}
    </TabsPrimitive.Trigger>
  );
});

TabsTrigger.displayName = "TabsTrigger";
