import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { describe, expect, it } from "vitest";
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
      // long labels ellipsise and TabsList can measure the indicator width.
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
