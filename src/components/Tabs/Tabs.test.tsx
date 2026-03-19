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
