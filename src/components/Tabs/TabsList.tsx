import * as TabsPrimitive from "@radix-ui/react-tabs";
import * as React from "react";
import { cn } from "../../utils/cn";

/** Breakpoint values for responsive props. */
type Breakpoint = "sm" | "md" | "lg" | "xl";

const alignLeftClasses: Record<Breakpoint | "always", string> = {
  always: "[&>[role=tab]]:flex-initial",
  sm: "[&>[role=tab]]:sm:flex-initial",
  md: "[&>[role=tab]]:md:flex-initial",
  lg: "[&>[role=tab]]:lg:flex-initial",
  xl: "[&>[role=tab]]:xl:flex-initial",
};

function getLayoutClass(
  variant: "fill" | "hug" | undefined,
  fullWidth: boolean,
  alignLeft?: boolean | Breakpoint,
): string {
  if (variant === "hug") return "inline-flex";
  if (variant === "fill") return "flex w-full [&>[role=tab]]:flex-1";

  if (!fullWidth) return "inline-flex";

  const base = "flex w-full [&>[role=tab]]:flex-1";
  if (alignLeft === true) return `${base} ${alignLeftClasses.always}`;
  if (typeof alignLeft === "string") return `${base} ${alignLeftClasses[alignLeft]}`;
  return base;
}

/** Props for the {@link TabsList} component. */
export type TabsListProps = React.ComponentPropsWithoutRef<typeof TabsPrimitive.List> & {
  /** When `true` (the default), the tab list spans the full width of its container and each tab grows equally. Set to `false` for inline sizing. */
  fullWidth?: boolean;
  /**
   * Controls tab alignment within a full-width container.
   * - `false` (default): tabs spread evenly
   * - `true`: tabs left-aligned, sized to content
   * - `"md"` (breakpoint): spread on mobile, left-aligned at breakpoint and up
   */
  alignLeft?: boolean | Breakpoint;
  /** Explicit layout variant. `"hug"` sizes the list to its content; `"fill"` stretches it full-width with equal-width tabs. Takes precedence over `fullWidth`/`alignLeft`. */
  variant?: "fill" | "hug";
  /**
   * Drops the leading padding on the first tab so its label sits flush with the
   * list's left edge, lining it up with page content above or below the bar
   * (a heading, for instance) rather than being indented by the tab's own
   * padding. Spacing between tabs is unaffected. Pair with `alignLeft` or
   * `variant="hug"`. @default false
   */
  flushLeft?: boolean;
  /**
   * Scrolls the row horizontally when the tabs don't fit, instead of letting
   * them compress. By default a tab may shrink until its label ellipsises,
   * which on a narrow viewport can truncate every label at once; here each tab
   * keeps its natural width and the overflow scrolls. The scrollbar itself is
   * hidden — the clipped tab at the edge is the affordance.
   *
   * Because the tabs are content-sized, they no longer spread to fill the row:
   * a set that does fit sits left-aligned, as with `alignLeft`.
   *
   * Horizontal orientation only: a vertical list already grows downwards.
   * @default false
   */
  scrollable?: boolean;
};

/** Container for {@link TabsTrigger} elements. Renders a sliding active-tab indicator that animates between tabs. */
export const TabsList = React.forwardRef<
  React.ComponentRef<typeof TabsPrimitive.List>,
  TabsListProps
>(
  (
    {
      className,
      children,
      fullWidth = true,
      alignLeft,
      variant,
      flushLeft = false,
      scrollable = false,
      ...props
    },
    ref,
  ) => {
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
        indicator.style.background =
          "linear-gradient(180deg, var(--color-buttons-tertiary-default) 0%, var(--color-tab-active) 50%, var(--color-buttons-tertiary-default) 100%)";
        indicator.style.inset = `0 -1px auto auto`;
        indicator.style.width = "1px";
        indicator.style.height = `${activeTab.offsetHeight}px`;
        indicator.style.transform = `translateY(${activeTab.offsetTop}px)`;
      } else {
        indicator.style.background =
          "linear-gradient(90deg, var(--color-buttons-tertiary-default) 0%, var(--color-tab-active) 50%, var(--color-buttons-tertiary-default) 100%)";
        const textSpan = activeTab.querySelector("span");
        const target = textSpan ?? activeTab;
        const textWidth = target.getBoundingClientRect().width;
        // Anchor to where the label actually sits, not to the tab's centre. The two
        // only coincide when the tab's horizontal padding is symmetric, which
        // `flushLeft` breaks by dropping `pl` on the first tab: the tab's centre then
        // sits `pr / 2` to the right of the label's. Measured as a difference of two
        // rects so it stays correct while a `scrollable` list is scrolled.
        const textOffsetInTab =
          target === activeTab
            ? 0
            : target.getBoundingClientRect().left - activeTab.getBoundingClientRect().left;
        const indicatorLeft = activeTab.offsetLeft + textOffsetInTab;
        indicator.style.inset = "auto auto 0 0";
        indicator.style.height = "1px";
        indicator.style.width = `${textWidth}px`;
        indicator.style.transform = `translateX(${indicatorLeft}px)`;
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

      let cancelled = false;
      if (document.fonts?.status !== "loaded") {
        document.fonts?.ready.then(() => {
          if (!cancelled) updateIndicator();
        });
      }

      return () => {
        cancelled = true;
        mutationObserver.disconnect();
        resizeObserver.disconnect();
      };
    }, [updateIndicator]);

    return (
      <TabsPrimitive.List
        ref={innerRef}
        className={cn(
          // `isolate` scopes the active indicator's `z-10` to a local stacking
          // context. Without it, `relative` alone creates no stacking context, so
          // the indicator escapes and paints above page chrome (e.g. the header).
          "relative isolate",
          getLayoutClass(variant, fullWidth, alignLeft),
          // Horizontal only: in the vertical orientation the leading padding is
          // the row's left inset, not a label offset, so zeroing it would pull
          // the first label out of line with the others.
          flushLeft && "data-[orientation=horizontal]:[&>[role=tab]:first-child]:pl-0",
          // `flex-none` is what stops the tabs compressing — without it they
          // share the row and never overflow, so there is nothing to scroll.
          // The scrollbar is hidden in both engines: Firefox reads
          // `scrollbar-width`, WebKit and Blink the pseudo-element.
          scrollable &&
            "data-[orientation=horizontal]:overflow-x-auto data-[orientation=horizontal]:[scrollbar-width:none] data-[orientation=horizontal]:[&::-webkit-scrollbar]:hidden data-[orientation=horizontal]:[&>[role=tab]]:flex-none",
          "data-[orientation=horizontal]:items-center data-[orientation=horizontal]:shadow-[inset_0_-1px_0_0_var(--color-border-primary)]",
          "data-[orientation=vertical]:flex-col data-[orientation=vertical]:shadow-[inset_-1px_0_0_0_var(--color-border-primary)]",
          className,
        )}
        {...props}
      >
        {children}
        <span
          ref={indicatorRef}
          aria-hidden
          className="pointer-events-none absolute z-10 rounded-full motion-safe:transition-[transform,width,height] motion-safe:duration-200 motion-safe:ease-in-out"
          style={{ opacity: 0 }}
        />
      </TabsPrimitive.List>
    );
  },
);

TabsList.displayName = "TabsList";
