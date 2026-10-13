import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { Tabs } from "./Tabs";
import { TabsContent } from "./TabsContent";
import { TabsList } from "./TabsList";
import { TabsOverflow, TabsOverflowItem } from "./TabsOverflow";
import { TabsTrigger } from "./TabsTrigger";

type Props = {
  value?: string;
  onValueChange?: (value: string) => void;
  overflow?: string[];
  activationMode?: "automatic" | "manual";
};

function OverflowTabs({
  value = "all",
  onValueChange = () => {},
  overflow = ["tips", "purchases"],
  activationMode,
}: Props) {
  return (
    <Tabs value={value} onValueChange={onValueChange} activationMode={activationMode}>
      <TabsList appearance="pill" aria-label="Categories">
        <TabsTrigger value="all">All</TabsTrigger>
        <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
        <TabsOverflow label="More" value={value} onValueChange={onValueChange}>
          {overflow.map((item) => (
            <TabsOverflowItem key={item} value={item}>
              {item === "tips" ? "Tips" : "Purchases"}
            </TabsOverflowItem>
          ))}
        </TabsOverflow>
      </TabsList>
    </Tabs>
  );
}

describe("TabsOverflow", () => {
  describe("API", () => {
    it("joins the tab row so arrow keys reach it", async () => {
      const user = userEvent.setup();
      render(<OverflowTabs />);
      screen.getByRole("tab", { name: "Subscriptions" }).focus();
      await user.keyboard("{ArrowRight}");
      expect(screen.getByRole("tab", { name: "More" })).toHaveFocus();
    });

    it("is not selected while a row tab is active", () => {
      render(<OverflowTabs value="all" />);
      expect(screen.getByRole("tab", { name: "More" })).toHaveAttribute("aria-selected", "false");
    });

    it("does not point aria-controls at a panel while no item is active", () => {
      render(<OverflowTabs value="all" />);
      expect(screen.getByRole("tab", { name: "More" })).not.toHaveAttribute("aria-controls");
    });

    it("is selected and shows the item's label while an overflow item is active", () => {
      render(<OverflowTabs value="tips" />);
      const tab = screen.getByRole("tab", { name: "Tips" });
      expect(tab).toHaveAttribute("aria-selected", "true");
      expect(tab).toHaveAttribute("data-state", "active");
      expect(screen.queryByRole("tab", { name: "More" })).not.toBeInTheDocument();
    });

    it("opens the menu on click without changing the selection", async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      render(<OverflowTabs onValueChange={onValueChange} />);
      await user.click(screen.getByRole("tab", { name: "More" }));
      expect(await screen.findByRole("menu")).toBeInTheDocument();
      expect(onValueChange).not.toHaveBeenCalled();
    });

    it("opens the menu with Enter without changing the selection", async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      render(<OverflowTabs onValueChange={onValueChange} activationMode="manual" />);
      screen.getByRole("tab", { name: "More" }).focus();
      await user.keyboard("{Enter}");
      expect(await screen.findByRole("menu")).toBeInTheDocument();
      expect(onValueChange).not.toHaveBeenCalled();
    });

    it("does not select anything when automatic activation focuses it", async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      render(<OverflowTabs onValueChange={onValueChange} value="subscriptions" />);
      screen.getByRole("tab", { name: "Subscriptions" }).focus();
      await user.keyboard("{ArrowRight}");
      expect(screen.getByRole("tab", { name: "More" })).toHaveFocus();
      expect(onValueChange).not.toHaveBeenCalled();
    });

    it("selects an item and closes the menu", async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      render(<OverflowTabs onValueChange={onValueChange} />);
      await user.click(screen.getByRole("tab", { name: "More" }));
      await user.click(await screen.findByRole("menuitemradio", { name: "Purchases" }));
      expect(onValueChange).toHaveBeenCalledWith("purchases");
      await waitFor(() => expect(screen.queryByRole("menu")).not.toBeInTheDocument());
    });

    it("marks the active item in the menu", async () => {
      const user = userEvent.setup();
      render(<OverflowTabs value="tips" />);
      await user.click(screen.getByRole("tab", { name: "Tips" }));
      expect(await screen.findByRole("menuitemradio", { name: "Tips" })).toHaveAttribute(
        "aria-checked",
        "true",
      );
    });

    it("returns focus to the tab when Escape closes the menu", async () => {
      const user = userEvent.setup();
      render(<OverflowTabs activationMode="manual" />);
      const more = screen.getByRole("tab", { name: "More" });
      more.focus();
      await user.keyboard("{Enter}");
      await screen.findByRole("menu");
      await user.keyboard("{Escape}");
      await waitFor(() => expect(screen.queryByRole("menu")).not.toBeInTheDocument());
      expect(more).toHaveFocus();
    });

    it("renders nothing when there are no overflow items", () => {
      render(<OverflowTabs overflow={[]} />);
      expect(screen.queryByRole("tab", { name: "More" })).not.toBeInTheDocument();
      expect(screen.getAllByRole("tab")).toHaveLength(2);
    });

    it("stays closed when its items come back after emptying while open", async () => {
      const user = userEvent.setup();
      const { rerender } = render(<OverflowTabs />);
      await user.click(screen.getByRole("tab", { name: "More" }));
      await screen.findByRole("menu");
      rerender(<OverflowTabs overflow={[]} />);
      await waitFor(() => expect(screen.queryByRole("menu")).not.toBeInTheDocument());
      rerender(<OverflowTabs />);
      expect(screen.getByRole("tab", { name: "More" })).toBeInTheDocument();
      expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    });

    it("forwards ref to the tab", () => {
      const ref = React.createRef<HTMLButtonElement>();
      render(
        <Tabs value="a">
          <TabsList>
            <TabsTrigger value="a">A</TabsTrigger>
            <TabsOverflow ref={ref} label="More" value="a" onValueChange={() => {}}>
              <TabsOverflowItem value="b">B</TabsOverflowItem>
            </TabsOverflow>
          </TabsList>
        </Tabs>,
      );
      expect(ref.current).toHaveAttribute("role", "tab");
    });
  });

  describe("accessibility", () => {
    it("has no accessibility violations", async () => {
      const { container } = render(
        <Tabs value="all">
          <TabsList appearance="pill" aria-label="Categories">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsOverflow label="More" value="all" onValueChange={() => {}}>
              <TabsOverflowItem value="tips">Tips</TabsOverflowItem>
            </TabsOverflow>
          </TabsList>
          <TabsContent value="all">All panel</TabsContent>
          <TabsContent value="tips" forceMount>
            Tips panel
          </TabsContent>
        </Tabs>,
      );
      expect(await axe(container)).toHaveNoViolations();
    });
  });
});
