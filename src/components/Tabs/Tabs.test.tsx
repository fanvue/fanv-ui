import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { Tabs } from "./Tabs";
import { TabsContent } from "./TabsContent";
import { TabsList } from "./TabsList";
import { TabsTrigger } from "./TabsTrigger";

function renderTabs(props?: { defaultValue?: string; disabled?: boolean }) {
  return render(
    <Tabs defaultValue={props?.defaultValue ?? "tab1"}>
      <TabsList>
        <TabsTrigger value="tab1">Tab 1</TabsTrigger>
        <TabsTrigger value="tab2">Tab 2</TabsTrigger>
        <TabsTrigger value="tab3" disabled={props?.disabled}>
          Tab 3
        </TabsTrigger>
      </TabsList>
      <TabsContent value="tab1">Content 1</TabsContent>
      <TabsContent value="tab2">Content 2</TabsContent>
      <TabsContent value="tab3">Content 3</TabsContent>
    </Tabs>,
  );
}

describe("Tabs", () => {
  describe("API", () => {
    it("switches content when clicking a tab", async () => {
      const user = userEvent.setup();
      renderTabs();
      await user.click(screen.getByRole("tab", { name: "Tab 2" }));
      expect(screen.getByText("Content 2")).toBeInTheDocument();
    });

    it("does not switch to a disabled tab", async () => {
      const user = userEvent.setup();
      renderTabs({ disabled: true });
      await user.click(screen.getByRole("tab", { name: "Tab 3" }));
      expect(screen.getByText("Content 1")).toBeInTheDocument();
      expect(screen.queryByText("Content 3")).not.toBeInTheDocument();
    });

    it("applies custom className to TabsList", () => {
      render(
        <Tabs defaultValue="t">
          <TabsList className="custom-list">
            <TabsTrigger value="t">T</TabsTrigger>
          </TabsList>
        </Tabs>,
      );
      expect(screen.getByRole("tablist")).toHaveClass("custom-list");
    });

    it("does not zero the first tab's leading padding by default", () => {
      render(
        <Tabs defaultValue="t">
          <TabsList alignLeft>
            <TabsTrigger value="t">T</TabsTrigger>
          </TabsList>
        </Tabs>,
      );
      expect(screen.getByRole("tablist")).not.toHaveClass(
        "data-[orientation=horizontal]:[&>[role=tab]:first-child]:pl-0",
      );
    });

    it("zeroes the first tab's leading padding when flushLeft is set", () => {
      // Lines the first label up with page content beside the bar; the DS pads
      // every trigger by 16px, which would otherwise indent it.
      render(
        <Tabs defaultValue="t">
          <TabsList alignLeft flushLeft>
            <TabsTrigger value="t">T</TabsTrigger>
          </TabsList>
        </Tabs>,
      );
      expect(screen.getByRole("tablist")).toHaveClass(
        "data-[orientation=horizontal]:[&>[role=tab]:first-child]:pl-0",
      );
    });

    it("sizes the indicator to the full tab width, not the label, even with asymmetric flushLeft padding", () => {
      const rect = (left: number, width: number) =>
        ({
          left,
          width,
          right: left + width,
          top: 0,
          bottom: 0,
          height: 0,
          x: left,
          y: 0,
        }) as DOMRect;

      const original = Element.prototype.getBoundingClientRect;
      Element.prototype.getBoundingClientRect = function () {
        if (this.getAttribute("role") === "tab") return rect(0, 149);
        if (this.closest?.('[role="tab"]')) return rect(0, 133);
        return rect(0, 320);
      };
      Object.defineProperty(HTMLElement.prototype, "offsetLeft", {
        configurable: true,
        get() {
          return 0;
        },
      });
      Object.defineProperty(HTMLElement.prototype, "offsetWidth", {
        configurable: true,
        get() {
          return 149;
        },
      });

      try {
        const { container } = render(
          <Tabs defaultValue="t">
            <TabsList alignLeft flushLeft>
              <TabsTrigger value="t">Manager Insights</TabsTrigger>
            </TabsList>
          </Tabs>,
        );
        const indicator = container.querySelector<HTMLElement>(
          '[role="tablist"] > span:not([role])',
        );
        expect(indicator?.style.width).toBe("149px");
        expect(indicator?.style.transform).toBe("translateX(0px)");
      } finally {
        Element.prototype.getBoundingClientRect = original;
        Reflect.deleteProperty(HTMLElement.prototype, "offsetLeft");
        Reflect.deleteProperty(HTMLElement.prototype, "offsetWidth");
      }
    });

    it("scrolls a scrollable row so an already-active offscreen tab is visible on mount", () => {
      const widths: Record<string, number> = { tab1: 0, tab2: 150, tab3: 300 };
      Object.defineProperty(HTMLElement.prototype, "offsetLeft", {
        configurable: true,
        get(this: HTMLElement) {
          return widths[this.getAttribute("data-testid") ?? ""] ?? 0;
        },
      });
      Object.defineProperty(HTMLElement.prototype, "offsetWidth", {
        configurable: true,
        get() {
          return 150;
        },
      });
      Object.defineProperty(HTMLElement.prototype, "clientWidth", {
        configurable: true,
        get() {
          return 320;
        },
      });

      try {
        render(
          <Tabs defaultValue="tab3">
            <TabsList scrollable>
              <TabsTrigger value="tab1" data-testid="tab1">
                One
              </TabsTrigger>
              <TabsTrigger value="tab2" data-testid="tab2">
                Two
              </TabsTrigger>
              <TabsTrigger value="tab3" data-testid="tab3">
                Three
              </TabsTrigger>
            </TabsList>
          </Tabs>,
        );
        expect(screen.getByRole("tablist").scrollLeft).toBe(130);
      } finally {
        Reflect.deleteProperty(HTMLElement.prototype, "offsetLeft");
        Reflect.deleteProperty(HTMLElement.prototype, "offsetWidth");
        Reflect.deleteProperty(HTMLElement.prototype, "clientWidth");
      }
    });

    it("leaves scrollLeft alone when the active tab already fits", () => {
      Object.defineProperty(HTMLElement.prototype, "offsetLeft", {
        configurable: true,
        get() {
          return 0;
        },
      });
      Object.defineProperty(HTMLElement.prototype, "offsetWidth", {
        configurable: true,
        get() {
          return 150;
        },
      });
      Object.defineProperty(HTMLElement.prototype, "clientWidth", {
        configurable: true,
        get() {
          return 320;
        },
      });

      try {
        render(
          <Tabs defaultValue="tab1">
            <TabsList scrollable>
              <TabsTrigger value="tab1">One</TabsTrigger>
              <TabsTrigger value="tab2">Two</TabsTrigger>
            </TabsList>
          </Tabs>,
        );
        expect(screen.getByRole("tablist").scrollLeft).toBe(0);
      } finally {
        Reflect.deleteProperty(HTMLElement.prototype, "offsetLeft");
        Reflect.deleteProperty(HTMLElement.prototype, "offsetWidth");
        Reflect.deleteProperty(HTMLElement.prototype, "clientWidth");
      }
    });

    it("scrolls rather than compresses the tabs when scrollable is set", () => {
      // `flex-none` is the load-bearing half: tabs that still share the row
      // never overflow, so there would be nothing to scroll.
      render(
        <Tabs defaultValue="t">
          <TabsList scrollable>
            <TabsTrigger value="t">T</TabsTrigger>
          </TabsList>
        </Tabs>,
      );
      const list = screen.getByRole("tablist");
      expect(list).toHaveClass("data-[orientation=horizontal]:overflow-x-auto");
      expect(list).toHaveClass("data-[orientation=horizontal]:[&>[role=tab]]:flex-none");
    });

    it("lets the tabs share the row by default", () => {
      render(
        <Tabs defaultValue="t">
          <TabsList>
            <TabsTrigger value="t">T</TabsTrigger>
          </TabsList>
        </Tabs>,
      );
      expect(screen.getByRole("tablist")).not.toHaveClass(
        "data-[orientation=horizontal]:overflow-x-auto",
      );
    });

    it("isolates the active-indicator z-index in a local stacking context", () => {
      // `isolate` keeps the indicator's z-10 from escaping above page chrome.
      render(
        <Tabs defaultValue="t">
          <TabsList>
            <TabsTrigger value="t">T</TabsTrigger>
          </TabsList>
        </Tabs>,
      );
      expect(screen.getByRole("tablist")).toHaveClass("isolate");
    });

    it("applies custom className to TabsTrigger", () => {
      render(
        <Tabs defaultValue="t">
          <TabsList>
            <TabsTrigger value="t" className="custom-trigger">
              T
            </TabsTrigger>
          </TabsList>
        </Tabs>,
      );
      expect(screen.getByRole("tab")).toHaveClass("custom-trigger");
    });

    it("renders the tab as its child element when asChild (e.g. a link)", () => {
      render(
        <Tabs value="tab1">
          <TabsList>
            <TabsTrigger value="tab1" asChild>
              <a href="/tab1">Tab 1</a>
            </TabsTrigger>
            <TabsTrigger value="tab2" asChild>
              <a href="/tab2">Tab 2</a>
            </TabsTrigger>
          </TabsList>
        </Tabs>,
      );
      // The anchor itself is the tab: it carries role="tab" and keeps its href,
      // so it stays a single interactive control (no nested button/link).
      const tab = screen.getByRole("tab", { name: "Tab 1" });
      expect(tab.tagName).toBe("A");
      expect(tab).toHaveAttribute("href", "/tab1");
      expect(tab).toHaveClass("cursor-pointer");
      // The label is still wrapped in the truncate span (inside the anchor) so
      // long labels ellipsise.
      expect(tab.querySelector("span.truncate")).not.toBeNull();
    });

    it("applies custom className to TabsContent", () => {
      render(
        <Tabs defaultValue="t">
          <TabsList>
            <TabsTrigger value="t">T</TabsTrigger>
          </TabsList>
          <TabsContent value="t" className="custom-content">
            Content
          </TabsContent>
        </Tabs>,
      );
      expect(screen.getByRole("tabpanel")).toHaveClass("custom-content");
    });

    it("forwards ref to TabsList", () => {
      const ref = React.createRef<HTMLDivElement>();
      render(
        <Tabs defaultValue="t">
          <TabsList ref={ref}>
            <TabsTrigger value="t">T</TabsTrigger>
          </TabsList>
        </Tabs>,
      );
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it("forwards ref to TabsTrigger", () => {
      const ref = React.createRef<HTMLButtonElement>();
      render(
        <Tabs defaultValue="t">
          <TabsList>
            <TabsTrigger value="t" ref={ref}>
              T
            </TabsTrigger>
          </TabsList>
        </Tabs>,
      );
      expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    });

    it("is fullWidth by default", () => {
      render(
        <Tabs defaultValue="t">
          <TabsList>
            <TabsTrigger value="t">T</TabsTrigger>
          </TabsList>
        </Tabs>,
      );
      const tablist = screen.getByRole("tablist");
      expect(tablist).toHaveClass("w-full");
      expect(tablist).not.toHaveClass("inline-flex");
    });

    it("renders inline when fullWidth is false", () => {
      render(
        <Tabs defaultValue="t">
          <TabsList fullWidth={false}>
            <TabsTrigger value="t">T</TabsTrigger>
          </TabsList>
        </Tabs>,
      );
      const tablist = screen.getByRole("tablist");
      expect(tablist).toHaveClass("inline-flex");
      expect(tablist).not.toHaveClass("w-full");
    });

    it("renders hug layout when variant is hug", () => {
      render(
        <Tabs defaultValue="t">
          <TabsList variant="hug">
            <TabsTrigger value="t">T</TabsTrigger>
          </TabsList>
        </Tabs>,
      );
      const tablist = screen.getByRole("tablist");
      expect(tablist).toHaveClass("inline-flex");
      expect(tablist).not.toHaveClass("w-full");
    });

    it("renders fill layout when variant is fill", () => {
      render(
        <Tabs defaultValue="t">
          <TabsList variant="fill">
            <TabsTrigger value="t">T</TabsTrigger>
          </TabsList>
        </Tabs>,
      );
      const tablist = screen.getByRole("tablist");
      expect(tablist).toHaveClass("w-full");
      expect(tablist).not.toHaveClass("inline-flex");
    });

    it("forwards ref to TabsContent", () => {
      const ref = React.createRef<HTMLDivElement>();
      render(
        <Tabs defaultValue="t">
          <TabsList>
            <TabsTrigger value="t">T</TabsTrigger>
          </TabsList>
          <TabsContent value="t" ref={ref}>
            Content
          </TabsContent>
        </Tabs>,
      );
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });

  describe("pill appearance", () => {
    function renderPill(defaultValue = "tab1") {
      return render(
        <Tabs defaultValue={defaultValue}>
          <TabsList appearance="pill" aria-label="Categories">
            <TabsTrigger value="tab1">All</TabsTrigger>
            <TabsTrigger value="tab2">Promotions</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Content 1</TabsContent>
          <TabsContent value="tab2">Content 2</TabsContent>
        </Tabs>,
      );
    }

    it("hugs its tabs inside a rounded track without the underline border", () => {
      renderPill();
      const tablist = screen.getByRole("tablist");
      expect(tablist).toHaveClass(
        "inline-flex",
        "w-fit",
        "rounded-full",
        "bg-background-secondary",
      );
      expect(tablist).not.toHaveClass("w-full");
      expect(tablist.className).not.toContain("shadow-[inset_0_-1px_0_0");
    });

    it("ignores the underline layout props", () => {
      render(
        <Tabs defaultValue="t">
          <TabsList appearance="pill" variant="fill" alignLeft>
            <TabsTrigger value="t">T</TabsTrigger>
          </TabsList>
        </Tabs>,
      );
      const tablist = screen.getByRole("tablist");
      expect(tablist).not.toHaveClass("w-full");
      expect(tablist).toHaveClass("w-fit");
    });

    it("styles its triggers as pills with inverted text on the active one", () => {
      renderPill();
      const active = screen.getByRole("tab", { name: "All" });
      const inactive = screen.getByRole("tab", { name: "Promotions" });
      expect(active).toHaveClass("rounded-full", "data-pill:text-content-primary-inverted");
      expect(active).toHaveAttribute("data-pill");
      expect(inactive).not.toHaveAttribute("data-pill");
    });

    it("lays an icon beside its label in a pill tab", () => {
      render(
        <Tabs defaultValue="t">
          <TabsList appearance="pill">
            <TabsTrigger value="t">
              <svg data-testid="icon" />
              All
            </TabsTrigger>
          </TabsList>
        </Tabs>,
      );
      expect(screen.getByTestId("icon").parentElement).toHaveClass("flex", "items-center", "gap-2");
    });

    it("fills the active tab's box with the indicator", () => {
      Object.defineProperties(HTMLElement.prototype, {
        offsetLeft: { configurable: true, get: () => 92 },
        offsetTop: { configurable: true, get: () => 4 },
        offsetWidth: { configurable: true, get: () => 120 },
        offsetHeight: { configurable: true, get: () => 32 },
      });
      try {
        const { container } = renderPill("tab2");
        const indicator = container.querySelector<HTMLElement>(
          '[role="tablist"] > span:not([role])',
        );
        expect(indicator?.style.width).toBe("120px");
        expect(indicator?.style.height).toBe("32px");
        expect(indicator?.style.transform).toBe("translate(92px, 4px)");
        expect(indicator?.style.background).toBe("var(--color-content-primary)");
      } finally {
        for (const key of ["offsetLeft", "offsetTop", "offsetWidth", "offsetHeight"]) {
          Reflect.deleteProperty(HTMLElement.prototype, key);
        }
      }
    });

    it("sizes its tabs to 36px when asked", () => {
      render(
        <Tabs defaultValue="t">
          <TabsList appearance="pill" size="36">
            <TabsTrigger value="t">T</TabsTrigger>
          </TabsList>
        </Tabs>,
      );
      expect(screen.getByRole("tab")).toHaveClass("h-9");
    });

    describe("when a tab resizes", () => {
      type Box = { left: number; width: number };
      function withLayout(boxes: Map<string, Box>, listWidth: { value: number }) {
        const read = (el: HTMLElement, key: keyof Box) =>
          el.getAttribute("role") === "tablist"
            ? key === "width"
              ? listWidth.value
              : 0
            : (boxes.get(el.textContent ?? "")?.[key] ?? 0);
        Object.defineProperties(HTMLElement.prototype, {
          offsetLeft: {
            configurable: true,
            get(this: HTMLElement) {
              return read(this, "left");
            },
          },
          offsetWidth: {
            configurable: true,
            get(this: HTMLElement) {
              return read(this, "width");
            },
          },
          offsetTop: { configurable: true, get: () => 0 },
          offsetHeight: { configurable: true, get: () => 32 },
        });
        return () => {
          for (const key of ["offsetLeft", "offsetWidth", "offsetTop", "offsetHeight"]) {
            Reflect.deleteProperty(HTMLElement.prototype, key);
          }
        };
      }

      function Row({ value }: { value: string }) {
        return (
          <Tabs value={value}>
            <TabsList appearance="pill">
              <TabsTrigger value="a">A</TabsTrigger>
              <TabsTrigger value="b">B</TabsTrigger>
            </TabsList>
          </Tabs>
        );
      }

      it("slides the tabs that moved from where they were, in step with the pill", async () => {
        const boxes = new Map([
          ["A", { left: 0, width: 60 }],
          ["B", { left: 64, width: 60 }],
        ]);
        const listWidth = { value: 300 };
        const restore = withLayout(boxes, listWidth);
        try {
          const { rerender } = render(<Row value="a" />);
          boxes.set("A", { left: 0, width: 100 });
          boxes.set("B", { left: 104, width: 60 });
          rerender(<Row value="b" />);
          const moved = screen.getByRole("tab", { name: "B" });
          await waitFor(() => expect(moved.style.transition).toContain("transform"));
          expect(moved.style.transform).toBe("");
        } finally {
          restore();
        }
      });

      it("leaves the tabs alone when the row itself resizes", async () => {
        const boxes = new Map([
          ["A", { left: 0, width: 60 }],
          ["B", { left: 64, width: 60 }],
        ]);
        const listWidth = { value: 300 };
        const restore = withLayout(boxes, listWidth);
        try {
          const { rerender } = render(<Row value="a" />);
          listWidth.value = 500;
          boxes.set("B", { left: 120, width: 60 });
          rerender(<Row value="b" />);
          await waitFor(() =>
            expect(screen.getByRole("tab", { name: "B" })).toHaveAttribute("data-state", "active"),
          );
          await new Promise((resolve) => setTimeout(resolve, 0));
          expect(screen.getByRole("tab", { name: "B" }).style.transition).toBe("");
        } finally {
          restore();
        }
      });
    });

    describe("followHover", () => {
      function renderFollowing() {
        return render(
          <Tabs defaultValue="tab1">
            <TabsList appearance="pill" followHover aria-label="Categories">
              <TabsTrigger value="tab1">All</TabsTrigger>
              <TabsTrigger value="tab2">Promotions</TabsTrigger>
            </TabsList>
          </Tabs>,
        );
      }

      it("moves the pill to the hovered tab and back to the selected one on leave", () => {
        renderFollowing();
        const all = screen.getByRole("tab", { name: "All" });
        const promotions = screen.getByRole("tab", { name: "Promotions" });

        fireEvent.pointerOver(promotions, { pointerType: "mouse" });
        expect(promotions).toHaveAttribute("data-pill");
        expect(all).not.toHaveAttribute("data-pill");
        expect(all).toHaveAttribute("aria-selected", "true");

        fireEvent.pointerLeave(screen.getByRole("tablist"));
        expect(all).toHaveAttribute("data-pill");
        expect(promotions).not.toHaveAttribute("data-pill");
      });

      it("gives longer jumps more time and lands the label colour with the pill", () => {
        const original = window.matchMedia;
        window.matchMedia = ((query: string) =>
          ({ matches: query === "(hover: hover)" }) as MediaQueryList) as typeof window.matchMedia;
        try {
          render(
            <Tabs defaultValue="a">
              <TabsList appearance="pill" followHover>
                <TabsTrigger value="a">A</TabsTrigger>
                <TabsTrigger value="b">B</TabsTrigger>
                <TabsTrigger value="c">C</TabsTrigger>
                <TabsTrigger value="d">D</TabsTrigger>
              </TabsList>
            </Tabs>,
          );
          const list = screen.getByRole("tablist");

          fireEvent.pointerOver(screen.getByRole("tab", { name: "B" }), { pointerType: "mouse" });
          expect(list.style.getPropertyValue("--pill-slide")).toBe("360ms");
          expect(list.style.getPropertyValue("--pill-arrive")).toBe("0ms");

          fireEvent.pointerOver(screen.getByRole("tab", { name: "D" }), { pointerType: "mouse" });
          expect(list.style.getPropertyValue("--pill-slide")).toBe("580ms");
          expect(list.style.getPropertyValue("--pill-arrive")).toBe("220ms");
        } finally {
          window.matchMedia = original;
        }
      });

      it("takes a single quick step on touch screens", async () => {
        const { rerender } = render(
          <Tabs value="a">
            <TabsList appearance="pill">
              <TabsTrigger value="a">A</TabsTrigger>
              <TabsTrigger value="b">B</TabsTrigger>
              <TabsTrigger value="c">C</TabsTrigger>
            </TabsList>
          </Tabs>,
        );
        rerender(
          <Tabs value="c">
            <TabsList appearance="pill">
              <TabsTrigger value="a">A</TabsTrigger>
              <TabsTrigger value="b">B</TabsTrigger>
              <TabsTrigger value="c">C</TabsTrigger>
            </TabsList>
          </Tabs>,
        );
        const list = screen.getByRole("tablist");
        await waitFor(() => expect(list.style.getPropertyValue("--pill-slide")).toBe("200ms"));
        expect(list.style.getPropertyValue("--pill-arrive")).toBe("0ms");
      });

      it("ignores touch", () => {
        renderFollowing();
        const promotions = screen.getByRole("tab", { name: "Promotions" });
        fireEvent.pointerOver(promotions, { pointerType: "touch" });
        expect(promotions).not.toHaveAttribute("data-pill");
      });

      it("reads no layout while following the pointer", () => {
        renderFollowing();
        const tabs = screen.getAllByRole("tab");
        let reads = 0;
        const keys = ["offsetLeft", "offsetTop", "offsetWidth", "offsetHeight"];
        for (const key of keys) {
          Object.defineProperty(HTMLElement.prototype, key, {
            configurable: true,
            get() {
              reads += 1;
              return 0;
            },
          });
        }
        const rectSpy = vi.spyOn(Element.prototype, "getBoundingClientRect");
        try {
          for (const tab of [...tabs, ...tabs]) {
            fireEvent.pointerOver(tab, { pointerType: "mouse" });
          }
          fireEvent.pointerLeave(screen.getByRole("tablist"));
          expect(reads).toBe(0);
          expect(rectSpy).not.toHaveBeenCalled();
        } finally {
          for (const key of keys) Reflect.deleteProperty(HTMLElement.prototype, key);
          rectSpy.mockRestore();
        }
      });

      it("does nothing unless asked", () => {
        renderPill();
        const promotions = screen.getByRole("tab", { name: "Promotions" });
        fireEvent.pointerOver(promotions, { pointerType: "mouse" });
        expect(promotions).not.toHaveAttribute("data-pill");
      });
    });

    it("moves selection with the arrow keys", async () => {
      const user = userEvent.setup();
      renderPill();
      screen.getByRole("tab", { name: "All" }).focus();
      await user.keyboard("{ArrowRight}");
      expect(screen.getByRole("tab", { name: "Promotions" })).toHaveFocus();
    });

    it("has no accessibility violations", async () => {
      const { container } = renderPill();
      expect(await axe(container)).toHaveNoViolations();
    });
  });

  describe("accessibility", () => {
    it("has no accessibility violations", async () => {
      const { container } = renderTabs();
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("has no accessibility violations for asChild link tabs", async () => {
      // `asChild` must make the link itself the tab (role="tab"), not wrap it in
      // a span — otherwise the link nests inside the tab and axe flags
      // `nested-interactive`. Both panels are mounted so each tab's
      // `aria-controls` resolves.
      const { container } = render(
        <Tabs value="tab1">
          <TabsList aria-label="Sections">
            <TabsTrigger value="tab1" asChild>
              <a href="/tab1">Tab 1</a>
            </TabsTrigger>
            <TabsTrigger value="tab2" asChild>
              <a href="/tab2">Tab 2</a>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Panel 1</TabsContent>
          <TabsContent value="tab2" forceMount>
            Panel 2
          </TabsContent>
        </Tabs>,
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("supports keyboard navigation between tabs", async () => {
      const user = userEvent.setup();
      renderTabs();
      const tab1 = screen.getByRole("tab", { name: "Tab 1" });
      tab1.focus();
      await user.keyboard("{ArrowRight}");
      expect(screen.getByRole("tab", { name: "Tab 2" })).toHaveFocus();
    });
  });
});
