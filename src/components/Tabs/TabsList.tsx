import * as TabsPrimitive from "@radix-ui/react-tabs";
import * as React from "react";
import { cn } from "../../utils/cn";

/** Props for the {@link TabsList} component. */
export type TabsListProps = React.ComponentPropsWithoutRef<typeof TabsPrimitive.List> & {
  /** When `true`, the tab list spans the full width of its container and each tab grows equally. */
  fullWidth?: boolean;
};

/** Container for {@link TabsTrigger} elements. Renders a sliding active-tab indicator that animates between tabs. */
export const TabsList = React.forwardRef<
  React.ComponentRef<typeof TabsPrimitive.List>,
  TabsListProps
>(({ className, children, fullWidth, ...props }, ref) => {
  const innerRef = React.useRef<HTMLDivElement>(null);
  const indicatorRef = React.useRef<HTMLSpanElement>(null);

  React.useImperativeHandle(ref, () => innerRef.current as HTMLDivElement);

  const updateIndicator = React.useCallback(() => {
    const list = innerRef.current;
    const indicator = indicatorRef.current;
    if (!list || !indicator) return;

    const activeTab = list.querySelector<HTMLElement>('[data-state="active"]');
    if (!activeTab) {
      indicator.style.opacity = "0";
      return;
    }

    const isVertical = list.dataset.orientation === "vertical";

    indicator.style.opacity = "1";

    if (isVertical) {
      indicator.style.inset = `0 0 auto auto`;
      indicator.style.width = "4px";
      indicator.style.height = `${activeTab.offsetHeight}px`;
      indicator.style.transform = `translateY(${activeTab.offsetTop}px)`;
    } else {
      indicator.style.inset = `auto auto 0 0`;
      indicator.style.height = "4px";
      indicator.style.width = `${activeTab.offsetWidth}px`;
      indicator.style.transform = `translateX(${activeTab.offsetLeft}px)`;
    }
  }, []);

  React.useLayoutEffect(() => {
    const list = innerRef.current;
    const indicator = indicatorRef.current;
    if (!list || !indicator) return;

    indicator.style.transitionDuration = "0s";
    updateIndicator();
    indicator.getBoundingClientRect();
    indicator.style.transitionDuration = "";

    const mutationObserver = new MutationObserver(updateIndicator);
    mutationObserver.observe(list, {
      attributes: true,
      attributeFilter: ["data-state"],
      childList: true,
      subtree: true,
    });

    const resizeObserver = new ResizeObserver(updateIndicator);
    resizeObserver.observe(list);

    return () => {
      mutationObserver.disconnect();
      resizeObserver.disconnect();
    };
  }, [updateIndicator]);

  return (
    <TabsPrimitive.List
      ref={innerRef}
      className={cn(
        "relative",
        fullWidth ? "flex w-full [&>[role=tab]]:flex-1" : "inline-flex",
        "data-[orientation=horizontal]:items-center data-[orientation=horizontal]:shadow-[inset_0_-1px_0_0_var(--color-neutral-200)]",
        "data-[orientation=vertical]:flex-col data-[orientation=vertical]:shadow-[inset_-1px_0_0_0_var(--color-neutral-200)]",
        className,
      )}
      {...props}
    >
      {children}
      <span
        ref={indicatorRef}
        aria-hidden
        className="pointer-events-none absolute rounded-full bg-brand-green-500 motion-safe:transition-[transform,width,height] motion-safe:duration-200 motion-safe:ease-in-out"
        style={{ opacity: 0 }}
      />
    </TabsPrimitive.List>
  );
});

TabsList.displayName = "TabsList";
