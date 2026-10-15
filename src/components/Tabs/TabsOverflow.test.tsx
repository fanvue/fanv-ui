import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { describe, expect, it, onTestFinished, vi } from "vitest";
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
        <TabsOverflow label="More">
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

function simulateMenuExitAnimation() {
  const getComputedStyle = window.getComputedStyle.bind(window);
  const spy = vi.spyOn(window, "getComputedStyle").mockImplementation((element, pseudo) => {
    const styles = getComputedStyle(element, pseudo);
    if (!(element instanceof HTMLElement) || element.getAttribute("role") !== "menu") {
      return styles;
    }
    return new Proxy(styles, {
      get: (target, property) => {
        if (property === "animationName") {
          return element.dataset.state === "closed" ? "exit" : "enter";
        }
        const value = Reflect.get(target, property);
        return typeof value === "function" ? value.bind(target) : value;
      },
    });
  });
  onTestFinished(() => spy.mockRestore());
}

function finishMenuExitAnimation(menu: HTMLElement) {
  const event = new Event("animationend", { bubbles: true });
  Object.defineProperty(event, "animationName", { value: "exit" });
  fireEvent(menu, event);
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

    it("stays closed when a consumer prevents the key", async () => {
      const user = userEvent.setup();
      render(
        <Tabs value="a" onValueChange={() => {}} activationMode="manual">
          <TabsList>
            <TabsTrigger value="a">A</TabsTrigger>
            <TabsOverflow label="More" onKeyDown={(event) => event.preventDefault()}>
              <TabsOverflowItem value="b">B</TabsOverflowItem>
            </TabsOverflow>
          </TabsList>
        </Tabs>,
      );
      screen.getByRole("tab", { name: "More" }).focus();
      await user.keyboard("{Enter}");
      expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    });

    it("does not focus More after a second click closes its menu", async () => {
      const user = userEvent.setup({ pointerEventsCheck: 0 });
      const onPointerDown = vi.fn();
      render(
        <Tabs value="a" onValueChange={() => {}}>
          <TabsList>
            <TabsTrigger value="a">A</TabsTrigger>
            <TabsOverflow label="More" onPointerDown={onPointerDown}>
              <TabsOverflowItem value="b">B</TabsOverflowItem>
            </TabsOverflow>
          </TabsList>
        </Tabs>,
      );
      const more = screen.getByRole("tab", { name: "More" });
      await user.click(more);
      await screen.findByRole("menu");
      await user.click(more);
      await waitFor(() => expect(screen.queryByRole("menu")).not.toBeInTheDocument());
      expect(onPointerDown).toHaveBeenCalled();
      expect(more).not.toHaveFocus();
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

    it("keeps the selected tab and its panel when an uncontrolled Tabs focuses it", async () => {
      const user = userEvent.setup();
      render(
        <Tabs defaultValue="all">
          <TabsList appearance="pill">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsOverflow label="More">
              <TabsOverflowItem value="tips">Tips</TabsOverflowItem>
            </TabsOverflow>
          </TabsList>
          <TabsContent value="all">All panel</TabsContent>
          <TabsContent value="tips">Tips panel</TabsContent>
        </Tabs>,
      );
      screen.getByRole("tab", { name: "All" }).focus();
      await user.keyboard("{ArrowRight}");
      expect(screen.getByRole("tab", { name: "All" })).toHaveAttribute("aria-selected", "true");
      expect(screen.getByRole("tabpanel")).toHaveTextContent("All panel");
    });

    it("selects an overflow item in an uncontrolled Tabs", async () => {
      const user = userEvent.setup();
      render(
        <Tabs defaultValue="all">
          <TabsList appearance="pill">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsOverflow label="More">
              <TabsOverflowItem value="tips">Tips</TabsOverflowItem>
            </TabsOverflow>
          </TabsList>
          <TabsContent value="all">All panel</TabsContent>
          <TabsContent value="tips">Tips panel</TabsContent>
        </Tabs>,
      );
      await user.click(screen.getByRole("tab", { name: "More" }));
      await user.click(await screen.findByRole("menuitemradio", { name: "Tips" }));
      expect(screen.getByRole("tab", { name: "Tips" })).toHaveAttribute("aria-selected", "true");
      expect(screen.getByRole("tabpanel")).toHaveTextContent("Tips panel");
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

    it("keeps its label until the menu has finished closing after a pick", async () => {
      simulateMenuExitAnimation();
      const user = userEvent.setup();
      render(
        <Tabs defaultValue="all">
          <TabsList appearance="pill">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsOverflow label="More">
              <TabsOverflowItem value="tips">Tips</TabsOverflowItem>
              <TabsOverflowItem value="purchases">Purchases</TabsOverflowItem>
            </TabsOverflow>
          </TabsList>
        </Tabs>,
      );
      await user.click(screen.getByRole("tab", { name: "More" }));
      await user.click(await screen.findByRole("menuitemradio", { name: "Purchases" }));

      const menu = screen.getByRole("menu", { hidden: true });
      expect(menu).toHaveAttribute("data-state", "closed");
      expect(screen.getByRole("tab", { name: "More", hidden: true })).toHaveAttribute(
        "aria-selected",
        "true",
      );

      finishMenuExitAnimation(menu);
      await waitFor(() => expect(screen.queryByRole("menu", { hidden: true })).toBeNull());
      expect(screen.getByRole("tab", { name: "Purchases" })).toHaveAttribute(
        "aria-selected",
        "true",
      );
    });

    it("keeps the previous item's label while the menu closes after switching items", async () => {
      simulateMenuExitAnimation();
      const user = userEvent.setup();
      render(
        <Tabs defaultValue="tips">
          <TabsList appearance="pill">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsOverflow label="More">
              <TabsOverflowItem value="tips">Tips</TabsOverflowItem>
              <TabsOverflowItem value="purchases">Purchases</TabsOverflowItem>
            </TabsOverflow>
          </TabsList>
        </Tabs>,
      );
      await user.click(screen.getByRole("tab", { name: "Tips" }));
      await user.click(await screen.findByRole("menuitemradio", { name: "Purchases" }));

      const menu = screen.getByRole("menu", { hidden: true });
      expect(screen.getByRole("tab", { name: "Tips", hidden: true })).toBeInTheDocument();

      finishMenuExitAnimation(menu);
      await waitFor(() =>
        expect(screen.getByRole("tab", { name: "Purchases" })).toBeInTheDocument(),
      );
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

    it("leaves focus off the tab after a pointer pick, so no focus ring shows", async () => {
      const user = userEvent.setup();
      render(<OverflowTabs />);
      await user.click(screen.getByRole("tab", { name: "More" }));
      await user.click(await screen.findByRole("menuitemradio", { name: "Purchases" }));
      await waitFor(() => expect(screen.queryByRole("menu")).not.toBeInTheDocument());
      expect(screen.getByRole("tab", { name: "More" })).not.toHaveFocus();
    });

    it("returns focus to the tab after a keyboard pick", async () => {
      const user = userEvent.setup();
      render(<OverflowTabs activationMode="manual" />);
      const more = screen.getByRole("tab", { name: "More" });
      more.focus();
      await user.keyboard("{Enter}");
      await screen.findByRole("menu");
      await user.keyboard("{ArrowDown}{Enter}");
      await waitFor(() => expect(screen.queryByRole("menu")).not.toBeInTheDocument());
      expect(more).toHaveFocus();
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

    it("holds the pill on More while its menu is open, then hands it back on close", async () => {
      const user = userEvent.setup();
      render(
        <Tabs value="all" onValueChange={() => {}}>
          <TabsList appearance="pill" followHover aria-label="Categories">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsOverflow label="More">
              <TabsOverflowItem value="tips">Tips</TabsOverflowItem>
            </TabsOverflow>
          </TabsList>
        </Tabs>,
      );
      const all = screen.getByRole("tab", { name: "All" });
      const more = screen.getByRole("tab", { name: "More" });

      fireEvent.pointerOver(more, { pointerType: "mouse" });
      await user.click(more);
      await screen.findByRole("menu");
      fireEvent.pointerLeave(screen.getByRole("tablist", { hidden: true }));
      await waitFor(() => expect(more).toHaveAttribute("data-pill"));
      expect(all).not.toHaveAttribute("data-pill");

      await user.keyboard("{Escape}");
      await waitFor(() => expect(screen.queryByRole("menu")).not.toBeInTheDocument());
      fireEvent.pointerLeave(screen.getByRole("tablist"));
      await waitFor(() => expect(all).toHaveAttribute("data-pill"));
    });

    it("holds the pill on More when its menu opens from the keyboard", async () => {
      const user = userEvent.setup();
      render(<OverflowTabs activationMode="manual" />);
      const more = screen.getByRole("tab", { name: "More" });
      more.focus();
      await user.keyboard("{Enter}");
      await screen.findByRole("menu");
      await waitFor(() => expect(more).toHaveAttribute("data-pill"));
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
            <TabsOverflow ref={ref} label="More">
              <TabsOverflowItem value="b">B</TabsOverflowItem>
            </TabsOverflow>
          </TabsList>
        </Tabs>,
      );
      expect(ref.current).toHaveAttribute("role", "tab");
    });

    it("applies custom className to the tab", () => {
      render(
        <Tabs value="a">
          <TabsList>
            <TabsTrigger value="a">A</TabsTrigger>
            <TabsOverflow className="custom-overflow" label="More">
              <TabsOverflowItem value="b">B</TabsOverflowItem>
            </TabsOverflow>
          </TabsList>
        </Tabs>,
      );
      expect(screen.getByRole("tab", { name: "More" })).toHaveClass("custom-overflow");
    });
  });

  describe("accessibility", () => {
    it("has no accessibility violations", async () => {
      const { container } = render(
        <Tabs value="all">
          <TabsList appearance="pill" aria-label="Categories">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsOverflow label="More">
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
