import * as TabsPrimitive from "@radix-ui/react-tabs";
import * as React from "react";
import { cn } from "../../utils/cn";

/** Breakpoint values for responsive props. */
type Breakpoint = "sm" | "md" | "lg" | "xl";

/** Visual style of a {@link TabsList}. */
export type TabsListAppearance = "underline" | "pill";

/** Height in pixels of each tab in a pill {@link TabsList}. */
export type TabsListPillSize = "32" | "36";

export const TabsAppearanceContext = React.createContext<{
  appearance: TabsListAppearance;
  size: TabsListPillSize;
}>({ appearance: "underline", size: "32" });

type TabBox = { left: number; top: number; width: number; height: number };

const PILL_EASE = "cubic-bezier(0.22, 1, 0.36, 1)";
const PILL_STEP_MS = 360;
const PILL_STEP_MS_TOUCH = 200;
const PILL_EXTRA_STEP_MS = 220;
const PILL_MAX_MS = 1000;
/** Share of a slide by which the eased pill has covered 80% of the way, so the label recolours under it. */
const PILL_ARRIVAL_SHARE = 0.27;

function pillStepMs(canHover: boolean) {
  return canHover ? PILL_STEP_MS : PILL_STEP_MS_TOUCH;
}

function pillSlideMs(distance: number, canHover: boolean) {
  if (!canHover) return PILL_STEP_MS_TOUCH;
  return Math.min(PILL_STEP_MS + Math.max(distance - 1, 0) * PILL_EXTRA_STEP_MS, PILL_MAX_MS);
}

const prefersReducedMotion = () =>
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;

function measureTabs(list: HTMLElement, observer: ResizeObserver | null) {
  const boxes = new Map<Element, TabBox>();
  const order = new Map<Element, number>();
  for (const tab of list.querySelectorAll<HTMLElement>('[role="tab"]')) {
    observer?.observe(tab);
    order.set(tab, order.size);
    boxes.set(tab, {
      left: tab.offsetLeft,
      top: tab.offsetTop,
      width: tab.offsetWidth,
      height: tab.offsetHeight,
    });
  }
  return { boxes, order };
}

function slideFromPrevious(
  list: HTMLElement,
  previous: Map<Element, TabBox>,
  next: Map<Element, TabBox>,
  durationMs: number,
) {
  const moved: HTMLElement[] = [];
  for (const [tab, box] of next) {
    const before = previous.get(tab);
    if (!before || before.left === box.left || !(tab instanceof HTMLElement)) continue;
    tab.style.transition = "none";
    tab.style.transform = `translateX(${before.left - box.left}px)`;
    moved.push(tab);
  }
  if (moved.length === 0) return;
  list.getBoundingClientRect();
  for (const tab of moved) {
    tab.style.transition = `transform ${durationMs}ms var(--pill-ease)`;
    tab.style.transform = "";
    const settle = (event: TransitionEvent) => {
      if (event.propertyName !== "transform") return;
      tab.style.transition = "";
      tab.removeEventListener("transitionend", settle);
    };
    tab.addEventListener("transitionend", settle);
  }
}

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
  /**
   * `"underline"` marks the active tab with a line under the row. `"pill"` sits
   * the tabs in a rounded track, sized to its tabs, and slides a filled pill
   * behind the active one. A pill list is horizontal and ignores `fullWidth`,
   * `alignLeft`, `variant` and `flushLeft`; it scrolls when it doesn't fit.
   * @default "underline"
   */
  appearance?: TabsListAppearance;
  /** Height of each tab in a pill list. Ignored by the underline appearance. @default "32" */
  size?: TabsListPillSize;
  /**
   * Pill only: the pill follows the mouse across the tabs and settles back on the
   * selected one when the pointer leaves. Mouse only, and off when the user prefers
   * reduced motion. @default false
   */
  followHover?: boolean;
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
      appearance = "underline",
      size = "32",
      followHover = false,
      onPointerOver,
      onPointerLeave,
      style,
      ...props
    },
    ref,
  ) => {
    const innerRef = React.useRef<HTMLDivElement>(null);
    const indicatorRef = React.useRef<HTMLSpanElement>(null);

    React.useImperativeHandle(ref, () => innerRef.current as HTMLDivElement);

    const tabBoxes = React.useRef(new Map<Element, TabBox>());
    const resizeObserverRef = React.useRef<ResizeObserver | null>(null);
    const listWidth = React.useRef<number | null>(null);
    const hoveredTab = React.useRef<HTMLElement | null>(null);
    const pillTab = React.useRef<HTMLElement | null>(null);
    const tabOrder = React.useRef(new Map<Element, number>());
    const canHover = React.useRef(false);

    const placePill = React.useCallback((tab: HTMLElement) => {
      const list = innerRef.current;
      const indicator = indicatorRef.current;
      if (!list || !indicator) return;
      const box = tabBoxes.current.get(tab);
      if (!box) return;
      const from = pillTab.current;
      pillTab.current = tab;
      const distance =
        from && from !== tab
          ? Math.abs((tabOrder.current.get(tab) ?? 0) - (tabOrder.current.get(from) ?? 0))
          : 0;
      const slideMs = pillSlideMs(distance, canHover.current);
      list.style.setProperty("--pill-slide", `${slideMs}ms`);
      list.style.setProperty("--pill-arrive", `${Math.round(slideMs * PILL_ARRIVAL_SHARE)}ms`);
      indicator.style.width = `${box.width}px`;
      indicator.style.height = `${box.height}px`;
      indicator.style.transform = `translate(${box.left}px, ${box.top}px)`;
      for (const marked of list.querySelectorAll("[data-pill]")) {
        if (marked !== tab) marked.removeAttribute("data-pill");
      }
      tab.setAttribute("data-pill", "");
    }, []);

    const layoutPill = React.useCallback(
      (list: HTMLElement, indicator: HTMLElement, activeTab: HTMLElement) => {
        indicator.style.background = "var(--color-content-primary)";
        indicator.style.inset = "0 auto auto 0";
        const previous = tabBoxes.current;
        const rowResized = listWidth.current !== null && listWidth.current !== list.offsetWidth;
        listWidth.current = list.offsetWidth;
        const { boxes, order } = measureTabs(list, resizeObserverRef.current);
        tabBoxes.current = boxes;
        tabOrder.current = order;
        if (!rowResized && previous.size > 0 && !prefersReducedMotion()) {
          slideFromPrevious(list, previous, boxes, pillStepMs(canHover.current));
        }
        const hovered = hoveredTab.current;
        placePill(hovered?.isConnected ? hovered : activeTab);
      },
      [placePill],
    );

    const updateIndicator = React.useCallback(() => {
      const list = innerRef.current;
      const indicator = indicatorRef.current;
      if (!list || !indicator) return;

      const activeTab = list.querySelector<HTMLElement>('[data-state="active"]');
      if (!activeTab) {
        indicator.style.opacity = "0";
        list.querySelector("[data-pill]")?.removeAttribute("data-pill");
        return;
      }

      const isVertical = list.dataset.orientation === "vertical";

      indicator.style.opacity = "1";

      if (appearance === "pill") {
        layoutPill(list, indicator, activeTab);
      } else if (isVertical) {
        indicator.style.background =
          "linear-gradient(180deg, var(--color-buttons-tertiary-default) 0%, var(--color-tab-active) 50%, var(--color-buttons-tertiary-default) 100%)";
        indicator.style.inset = `0 -1px auto auto`;
        indicator.style.width = "1px";
        indicator.style.height = `${activeTab.offsetHeight}px`;
        indicator.style.transform = `translateY(${activeTab.offsetTop}px)`;
      } else {
        indicator.style.background =
          "linear-gradient(90deg, var(--color-buttons-tertiary-default) 0%, var(--color-tab-active) 50%, var(--color-buttons-tertiary-default) 100%)";
        indicator.style.inset = "auto auto 0 0";
        indicator.style.height = "1px";
        indicator.style.width = `${activeTab.offsetWidth}px`;
        indicator.style.transform = `translateX(${activeTab.offsetLeft}px)`;
      }
    }, [appearance, layoutPill]);

    const followsHover = appearance === "pill" && followHover;

    const handlePointerOver = (event: React.PointerEvent<HTMLDivElement>) => {
      onPointerOver?.(event);
      if (!followsHover || event.pointerType !== "mouse") return;
      if (prefersReducedMotion()) return;
      const tab = (event.target as Element).closest<HTMLElement>('[role="tab"]');
      if (!tab || tab === hoveredTab.current || !event.currentTarget.contains(tab)) return;
      hoveredTab.current = tab;
      placePill(tab);
    };

    const handlePointerLeave = (event: React.PointerEvent<HTMLDivElement>) => {
      onPointerLeave?.(event);
      if (!hoveredTab.current) return;
      hoveredTab.current = null;
      const activeTab = innerRef.current?.querySelector<HTMLElement>('[data-state="active"]');
      if (activeTab) placePill(activeTab);
    };

    // Radix scrolls a tab into view when it takes focus, and mount is not focus, so
    // URL-driven state can land on a tab that is off to the right with nothing on
    // screen to say so: no indicator, and tab one showing as though it were active.
    // Assigns `scrollLeft` rather than calling `scrollIntoView`, which would also
    // scroll every ancestor and the page with it. Only ever scrolls further right, so
    // re-running it after the webfont settles corrects a short initial scroll without
    // yanking the row back from wherever the user has since dragged it.
    const revealActiveTab = React.useCallback(() => {
      const list = innerRef.current;
      const scrolls = scrollable || appearance === "pill";
      if (!list || !scrolls || list.dataset.orientation === "vertical") return;
      const activeTab = list.querySelector<HTMLElement>('[data-state="active"]');
      if (!activeTab) return;
      const overshoot = activeTab.offsetLeft + activeTab.offsetWidth - list.clientWidth;
      if (overshoot > list.scrollLeft) list.scrollLeft = overshoot;
    }, [scrollable, appearance]);

    React.useLayoutEffect(() => {
      const list = innerRef.current;
      const indicator = indicatorRef.current;
      if (!list || !indicator) return;

      canHover.current = window.matchMedia?.("(hover: hover)").matches ?? false;

      const resizeObserver = new ResizeObserver(updateIndicator);
      resizeObserver.observe(list);
      resizeObserverRef.current = resizeObserver;

      indicator.style.transitionDuration = "0s";
      updateIndicator();
      indicator.getBoundingClientRect();
      indicator.style.transitionDuration = "";
      revealActiveTab();

      const mutationObserver = new MutationObserver(updateIndicator);
      mutationObserver.observe(list, {
        attributes: true,
        attributeFilter: ["data-state"],
        childList: true,
        subtree: true,
      });

      let cancelled = false;
      if (document.fonts?.status !== "loaded") {
        document.fonts?.ready.then(() => {
          if (cancelled) return;
          updateIndicator();
          // The tabs are wider once the real font is in, so the mount-time scroll can
          // fall short of the active tab. Recomputed here against the settled layout.
          revealActiveTab();
        });
      }

      return () => {
        cancelled = true;
        mutationObserver.disconnect();
        resizeObserver.disconnect();
        resizeObserverRef.current = null;
      };
    }, [updateIndicator, revealActiveTab]);

    const isPill = appearance === "pill";
    const listStyle: React.CSSProperties & { "--pill-ease"?: string } = isPill
      ? { "--pill-ease": PILL_EASE, ...style }
      : { ...style };

    return (
      <TabsAppearanceContext.Provider value={{ appearance, size }}>
        <TabsPrimitive.List
          ref={innerRef}
          onPointerOver={handlePointerOver}
          onPointerLeave={handlePointerLeave}
          style={listStyle}
          className={cn(
            // `isolate` scopes the active indicator's `z-10` to a local stacking
            // context. Without it, `relative` alone creates no stacking context, so
            // the indicator escapes and paints above page chrome (e.g. the header).
            "relative isolate",
            isPill
              ? "inline-flex w-fit max-w-full items-center gap-1 overflow-x-auto rounded-full bg-background-secondary p-1 shadow-md [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              : [
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
                ],
            className,
          )}
          {...props}
        >
          {children}
          <span
            ref={indicatorRef}
            aria-hidden
            className={cn(
              "pointer-events-none absolute rounded-full motion-safe:transition-[transform,width,height]",
              isPill
                ? "z-0 motion-safe:duration-(--pill-slide) motion-safe:ease-(--pill-ease)"
                : "z-10 motion-safe:duration-200 motion-safe:ease-in-out",
            )}
            style={{ opacity: 0 }}
          />
        </TabsPrimitive.List>
      </TabsAppearanceContext.Provider>
    );
  },
);

TabsList.displayName = "TabsList";
