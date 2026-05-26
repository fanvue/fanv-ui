import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type * as React from "react";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuHeader,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./DropdownMenu";

function renderMenu(ui: React.ReactNode, { defaultOpen = true } = {}) {
  return render(
    <DropdownMenu defaultOpen={defaultOpen}>
      <DropdownMenuTrigger>trigger</DropdownMenuTrigger>
      <DropdownMenuContent aria-label="Actions">{ui}</DropdownMenuContent>
    </DropdownMenu>,
  );
}

describe("DropdownMenu", () => {
  describe("accessibility", () => {
    it("has no accessibility violations", async () => {
      const { container } = renderMenu(<DropdownMenuItem>Item 1</DropdownMenuItem>);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("API", () => {
    it("does not render content when closed", () => {
      renderMenu(<DropdownMenuItem>Hidden</DropdownMenuItem>, {
        defaultOpen: false,
      });
      expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    });

    it("renders menu items", () => {
      renderMenu(
        <>
          <DropdownMenuItem>First</DropdownMenuItem>
          <DropdownMenuItem>Second</DropdownMenuItem>
        </>,
      );
      expect(screen.getByText("First")).toBeInTheDocument();
      expect(screen.getByText("Second")).toBeInTheDocument();
    });

    it("calls onOpenChange on Escape key", async () => {
      const user = userEvent.setup();
      const onOpenChange = vi.fn();
      render(
        <DropdownMenu defaultOpen onOpenChange={onOpenChange}>
          <DropdownMenuTrigger>trigger</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Item</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>,
      );
      await user.keyboard("{Escape}");
      expect(onOpenChange).toHaveBeenCalledWith(false);
    });

    it("applies custom className to content", () => {
      render(
        <DropdownMenu defaultOpen>
          <DropdownMenuTrigger>trigger</DropdownMenuTrigger>
          <DropdownMenuContent className="custom-class" data-testid="content">
            <DropdownMenuItem>Item</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>,
      );
      expect(screen.getByTestId("content")).toHaveClass("custom-class");
    });

    it("spreads HTML attributes on content", () => {
      render(
        <DropdownMenu defaultOpen>
          <DropdownMenuTrigger>trigger</DropdownMenuTrigger>
          <DropdownMenuContent data-testid="content" id="my-menu">
            <DropdownMenuItem>Item</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>,
      );
      expect(screen.getByTestId("content")).toHaveAttribute("id", "my-menu");
    });

    it("uses aria-label from consumer", () => {
      render(
        <DropdownMenu defaultOpen>
          <DropdownMenuTrigger>trigger</DropdownMenuTrigger>
          <DropdownMenuContent aria-label="File actions">
            <DropdownMenuItem>Item</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>,
      );
      expect(screen.getByRole("menu")).toHaveAttribute("aria-label", "File actions");
    });

    it("opens on trigger click", async () => {
      const user = userEvent.setup();
      render(
        <DropdownMenu>
          <DropdownMenuTrigger>Open</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Item</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>,
      );
      expect(screen.queryByRole("menu")).not.toBeInTheDocument();
      await user.click(screen.getByRole("button", { name: "Open" }));
      expect(screen.getByRole("menu")).toBeInTheDocument();
    });
  });

  describe("controlled mode", () => {
    it("respects open and onOpenChange", async () => {
      const user = userEvent.setup();
      const onOpenChange = vi.fn();
      const { rerender } = render(
        <DropdownMenu open={false} onOpenChange={onOpenChange}>
          <DropdownMenuTrigger>trigger</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Item</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>,
      );
      expect(screen.queryByRole("menu")).not.toBeInTheDocument();
      await user.click(screen.getByRole("button"));
      expect(onOpenChange).toHaveBeenCalledWith(true);

      rerender(
        <DropdownMenu open onOpenChange={onOpenChange}>
          <DropdownMenuTrigger>trigger</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Item</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>,
      );
      expect(screen.getByRole("menu")).toBeInTheDocument();
    });
  });

  // Regression coverage for the Android Chrome scroll-drag bug: Radix opens
  // DropdownMenu on pointerdown with no pointerType guard, so a drag that
  // incidentally releases over the trigger opens the menu and traps the
  // user. The wrapper only toggles the menu on a stationary touch tap.
  // https://github.com/radix-ui/primitives/issues/1912
  describe("touch tap gate", () => {
    it("opens when a touch press releases close to its start (stationary tap)", () => {
      const onOpenChange = vi.fn();
      render(
        <DropdownMenu onOpenChange={onOpenChange}>
          <DropdownMenuTrigger>trigger</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Item</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>,
      );
      const trigger = screen.getByRole("button");
      fireEvent.pointerDown(trigger, {
        pointerType: "touch",
        clientX: 100,
        clientY: 100,
      });
      fireEvent.pointerUp(trigger, {
        pointerType: "touch",
        clientX: 102,
        clientY: 101,
      });
      expect(onOpenChange).toHaveBeenCalledWith(true);
    });

    it("does not open when the touch pointer moves past the threshold (scroll-drag)", () => {
      const onOpenChange = vi.fn();
      render(
        <DropdownMenu onOpenChange={onOpenChange}>
          <DropdownMenuTrigger>trigger</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Item</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>,
      );
      const trigger = screen.getByRole("button");
      fireEvent.pointerDown(trigger, {
        pointerType: "touch",
        clientX: 100,
        clientY: 100,
      });
      fireEvent.pointerMove(trigger, {
        pointerType: "touch",
        clientX: 100,
        clientY: 200,
      });
      fireEvent.pointerUp(trigger, {
        pointerType: "touch",
        clientX: 100,
        clientY: 200,
      });
      expect(onOpenChange).not.toHaveBeenCalled();
      expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    });

    it("does not open when the touch interaction is cancelled mid-gesture", () => {
      const onOpenChange = vi.fn();
      render(
        <DropdownMenu onOpenChange={onOpenChange}>
          <DropdownMenuTrigger>trigger</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Item</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>,
      );
      const trigger = screen.getByRole("button");
      fireEvent.pointerDown(trigger, {
        pointerType: "touch",
        clientX: 100,
        clientY: 100,
      });
      fireEvent.pointerCancel(trigger, {
        pointerType: "touch",
        clientX: 100,
        clientY: 100,
      });
      fireEvent.pointerUp(trigger, {
        pointerType: "touch",
        clientX: 100,
        clientY: 100,
      });
      expect(onOpenChange).not.toHaveBeenCalled();
    });

    it("does not toggle a disabled trigger on touch", () => {
      const onOpenChange = vi.fn();
      render(
        <DropdownMenu onOpenChange={onOpenChange}>
          <DropdownMenuTrigger disabled>trigger</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Item</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>,
      );
      const trigger = screen.getByRole("button");
      fireEvent.pointerDown(trigger, {
        pointerType: "touch",
        clientX: 100,
        clientY: 100,
      });
      fireEvent.pointerUp(trigger, {
        pointerType: "touch",
        clientX: 100,
        clientY: 100,
      });
      expect(onOpenChange).not.toHaveBeenCalled();
    });

    it("treats stylus (pen) input the same as touch", () => {
      const onOpenChange = vi.fn();
      render(
        <DropdownMenu onOpenChange={onOpenChange}>
          <DropdownMenuTrigger>trigger</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Item</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>,
      );
      const trigger = screen.getByRole("button");
      fireEvent.pointerDown(trigger, {
        pointerType: "pen",
        clientX: 50,
        clientY: 50,
      });
      fireEvent.pointerMove(trigger, {
        pointerType: "pen",
        clientX: 50,
        clientY: 200,
      });
      fireEvent.pointerUp(trigger, {
        pointerType: "pen",
        clientX: 50,
        clientY: 200,
      });
      expect(onOpenChange).not.toHaveBeenCalled();
    });

    it("forwards consumer pointer handlers", () => {
      const onPointerDown = vi.fn();
      const onPointerUp = vi.fn();
      render(
        <DropdownMenu>
          <DropdownMenuTrigger onPointerDown={onPointerDown} onPointerUp={onPointerUp}>
            trigger
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Item</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>,
      );
      const trigger = screen.getByRole("button");
      fireEvent.pointerDown(trigger, {
        pointerType: "touch",
        clientX: 0,
        clientY: 0,
      });
      fireEvent.pointerUp(trigger, {
        pointerType: "touch",
        clientX: 0,
        clientY: 0,
      });
      expect(onPointerDown).toHaveBeenCalledTimes(1);
      expect(onPointerUp).toHaveBeenCalledTimes(1);
    });

    it("opens via keyboard activation (Enter)", async () => {
      const user = userEvent.setup();
      const onOpenChange = vi.fn();
      render(
        <DropdownMenu onOpenChange={onOpenChange}>
          <DropdownMenuTrigger>trigger</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Item</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>,
      );
      screen.getByRole("button").focus();
      await user.keyboard("{Enter}");
      expect(onOpenChange).toHaveBeenCalledWith(true);
    });

    it("mouse interactions remain unguarded (opens on pointerdown)", () => {
      const onOpenChange = vi.fn();
      render(
        <DropdownMenu onOpenChange={onOpenChange}>
          <DropdownMenuTrigger>trigger</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Item</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>,
      );
      const trigger = screen.getByRole("button");
      // Radix opens DropdownMenu on pointerdown for mouse. The gate must not
      // interfere with this path.
      fireEvent.pointerDown(trigger, {
        pointerType: "mouse",
        clientX: 10,
        clientY: 10,
        button: 0,
      });
      expect(onOpenChange).toHaveBeenCalledWith(true);
    });

    it("isolates state across pointerIds (other-finger up does not toggle)", () => {
      const onOpenChange = vi.fn();
      render(
        <DropdownMenu onOpenChange={onOpenChange}>
          <DropdownMenuTrigger>trigger</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Item</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>,
      );
      const trigger = screen.getByRole("button");
      fireEvent.pointerDown(trigger, {
        pointerType: "touch",
        pointerId: 1,
        clientX: 0,
        clientY: 0,
      });
      // A different pointer releasing on the trigger must not consume the
      // active tap state — common with two-finger interactions.
      fireEvent.pointerUp(trigger, {
        pointerType: "touch",
        pointerId: 2,
        clientX: 0,
        clientY: 0,
      });
      expect(onOpenChange).not.toHaveBeenCalled();
      // The original pointer can still complete a tap and open the menu.
      fireEvent.pointerUp(trigger, {
        pointerType: "touch",
        pointerId: 1,
        clientX: 1,
        clientY: 1,
      });
      expect(onOpenChange).toHaveBeenCalledWith(true);
    });

    it("calls setPointerCapture on touch pointerdown so drag-off still hits the trigger", () => {
      // jsdom doesn't implement setPointerCapture; install it so we can spy.
      const setPointerCapture = vi.fn();
      (HTMLElement.prototype as { setPointerCapture: (id: number) => void }).setPointerCapture =
        setPointerCapture;
      render(
        <DropdownMenu>
          <DropdownMenuTrigger>trigger</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Item</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>,
      );
      fireEvent.pointerDown(screen.getByRole("button"), {
        pointerType: "touch",
        pointerId: 5,
        clientX: 0,
        clientY: 0,
      });
      expect(setPointerCapture).toHaveBeenCalledWith(5);
    });
  });
});

describe("DropdownMenuSeparator", () => {
  it("renders a separator", () => {
    renderMenu(
      <>
        <DropdownMenuItem>Above</DropdownMenuItem>
        <DropdownMenuSeparator data-testid="sep" />
        <DropdownMenuItem>Below</DropdownMenuItem>
      </>,
    );
    expect(screen.getByTestId("sep")).toHaveAttribute("role", "separator");
  });
});

describe("DropdownMenuLabel", () => {
  it("renders a non-interactive label", () => {
    renderMenu(
      <DropdownMenuGroup>
        <DropdownMenuLabel>Section</DropdownMenuLabel>
        <DropdownMenuItem>Item</DropdownMenuItem>
      </DropdownMenuGroup>,
    );
    expect(screen.getByText("Section")).toBeInTheDocument();
  });
});

describe("DropdownMenuItem", () => {
  describe("API", () => {
    it("applies destructive styling", () => {
      renderMenu(
        <DropdownMenuItem destructive data-testid="item">
          Delete
        </DropdownMenuItem>,
      );
      expect(screen.getByTestId("item")).toHaveClass("text-error-content");
    });

    it("does not fire onSelect when disabled", async () => {
      const user = userEvent.setup();
      const onSelect = vi.fn();
      renderMenu(
        <DropdownMenuItem disabled onSelect={onSelect} data-testid="item">
          Disabled
        </DropdownMenuItem>,
      );
      await user.click(screen.getByTestId("item"));
      expect(onSelect).not.toHaveBeenCalled();
    });

    it("renders size 40 by default", () => {
      renderMenu(<DropdownMenuItem data-testid="item">Item</DropdownMenuItem>);
      expect(screen.getByTestId("item")).toHaveClass("min-h-10");
    });

    it("renders size 32", () => {
      renderMenu(
        <DropdownMenuItem size="32" data-testid="item">
          Item
        </DropdownMenuItem>,
      );
      expect(screen.getByTestId("item")).toHaveClass("min-h-8");
    });

    it("maps deprecated size sm to 32", () => {
      renderMenu(
        <DropdownMenuItem size="sm" data-testid="item">
          Item
        </DropdownMenuItem>,
      );
      expect(screen.getByTestId("item")).toHaveClass("min-h-8");
    });

    it("maps deprecated size md to 40", () => {
      renderMenu(
        <DropdownMenuItem size="md" data-testid="item">
          Item
        </DropdownMenuItem>,
      );
      expect(screen.getByTestId("item")).toHaveClass("min-h-10");
    });

    it("renders selected state with v2 filled treatment", () => {
      renderMenu(
        <DropdownMenuItem selected data-testid="item">
          Item
        </DropdownMenuItem>,
      );
      const item = screen.getByTestId("item");
      expect(item).toHaveClass("bg-buttons-primary");
      expect(item).toHaveClass("text-content-primary-inverted");
    });

    it("renders leading and trailing icons", () => {
      renderMenu(
        <DropdownMenuItem
          leadingIcon={<span data-testid="lead">L</span>}
          trailingIcon={<span data-testid="trail">T</span>}
        >
          Item
        </DropdownMenuItem>,
      );
      expect(screen.getByTestId("lead")).toBeInTheDocument();
      expect(screen.getByTestId("trail")).toBeInTheDocument();
    });

    it("fires onSelect on click", async () => {
      const user = userEvent.setup();
      const onSelect = vi.fn();
      renderMenu(
        <DropdownMenuItem onSelect={onSelect} data-testid="item">
          Click me
        </DropdownMenuItem>,
      );
      await user.click(screen.getByTestId("item"));
      expect(onSelect).toHaveBeenCalledTimes(1);
    });
  });

  describe("asChild", () => {
    it("renders child element with menuitem props", () => {
      renderMenu(
        <DropdownMenuItem asChild>
          <a href="/settings">Settings</a>
        </DropdownMenuItem>,
      );
      const link = screen.getByRole("menuitem");
      expect(link.tagName).toBe("A");
      expect(link).toHaveAttribute("href", "/settings");
    });

    it("applies className to child element", () => {
      renderMenu(
        <DropdownMenuItem asChild destructive>
          <a href="/delete">Delete</a>
        </DropdownMenuItem>,
      );
      expect(screen.getByRole("menuitem")).toHaveClass("text-error-content");
    });
  });
});

describe("DropdownMenuHeader", () => {
  describe("accessibility", () => {
    it("default header has no a11y violations", async () => {
      const { container } = renderMenu(
        <>
          <DropdownMenuHeader title="Sort by" onClose={() => {}} />
          <DropdownMenuItem>Item</DropdownMenuItem>
        </>,
      );
      expect(await axe(container)).toHaveNoViolations();
    });

    it("search header has no a11y violations", async () => {
      const { container } = renderMenu(
        <>
          <DropdownMenuHeader
            type="search"
            searchProps={{ placeholder: "Find\u2026" }}
            onClose={() => {}}
          />
          <DropdownMenuItem>Item</DropdownMenuItem>
        </>,
      );
      expect(await axe(container)).toHaveNoViolations();
    });
  });

  describe("API", () => {
    it("renders the title when type is default", () => {
      renderMenu(
        <>
          <DropdownMenuHeader title="Sort by" />
          <DropdownMenuItem>Item</DropdownMenuItem>
        </>,
      );
      expect(screen.getByText("Sort by")).toBeInTheDocument();
    });

    it("prefers children over title when both are provided", () => {
      renderMenu(
        <>
          <DropdownMenuHeader title="Title">Custom</DropdownMenuHeader>
          <DropdownMenuItem>Item</DropdownMenuItem>
        </>,
      );
      expect(screen.getByText("Custom")).toBeInTheDocument();
      expect(screen.queryByText("Title")).not.toBeInTheDocument();
    });

    it("renders a search input when type is search", () => {
      renderMenu(
        <>
          <DropdownMenuHeader
            type="search"
            searchProps={{ placeholder: "Find people", "aria-label": "Find" }}
          />
          <DropdownMenuItem>Item</DropdownMenuItem>
        </>,
      );
      const input = screen.getByRole("searchbox", { name: "Find" });
      expect(input).toHaveAttribute("placeholder", "Find people");
    });

    it("fires onChange when the search input value changes", async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      renderMenu(
        <>
          <DropdownMenuHeader type="search" searchProps={{ onChange }} />
          <DropdownMenuItem>Item</DropdownMenuItem>
        </>,
      );
      const input = screen.getByRole("searchbox");
      await user.type(input, "ab");
      expect(onChange).toHaveBeenCalledWith("a");
      expect(onChange).toHaveBeenLastCalledWith("ab");
    });

    it("fires onClose when the close button is activated", async () => {
      const user = userEvent.setup();
      const onClose = vi.fn();
      renderMenu(
        <>
          <DropdownMenuHeader title="Sort" onClose={onClose} closeLabel="Close" />
          <DropdownMenuItem>Item</DropdownMenuItem>
        </>,
      );
      await user.click(screen.getByRole("button", { name: "Close" }));
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it("hides the close button when showClose is false", () => {
      renderMenu(
        <>
          <DropdownMenuHeader title="Sort" showClose={false} />
          <DropdownMenuItem>Item</DropdownMenuItem>
        </>,
      );
      expect(screen.queryByRole("button", { name: /close/i })).not.toBeInTheDocument();
    });
  });
});

describe("DropdownMenuRadioItem", () => {
  describe("accessibility", () => {
    it("has no a11y violations", async () => {
      const { container } = renderMenu(
        <DropdownMenuRadioGroup value="one">
          <DropdownMenuRadioItem value="one" helper="Helper text">
            Option one
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="two">Option two</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>,
      );
      expect(await axe(container)).toHaveNoViolations();
    });
  });

  describe("API", () => {
    it("renders the helper text when provided", () => {
      renderMenu(
        <DropdownMenuRadioGroup value="one">
          <DropdownMenuRadioItem value="one" helper="Most recent first">
            Newest
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>,
      );
      expect(screen.getByText("Most recent first")).toBeInTheDocument();
    });

    it("marks the active value as checked", () => {
      renderMenu(
        <DropdownMenuRadioGroup value="two">
          <DropdownMenuRadioItem value="one">One</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="two">Two</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>,
      );
      const items = screen.getAllByRole("menuitemradio");
      expect(items[0]).toHaveAttribute("data-state", "unchecked");
      expect(items[1]).toHaveAttribute("data-state", "checked");
    });

    it("calls onValueChange when an item is selected", async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      renderMenu(
        <DropdownMenuRadioGroup value="one" onValueChange={onValueChange}>
          <DropdownMenuRadioItem value="one">One</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="two">Two</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>,
      );
      await user.click(screen.getByRole("menuitemradio", { name: /Two/ }));
      expect(onValueChange).toHaveBeenCalledWith("two");
    });

    it("does not fire selection when disabled", async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      renderMenu(
        <DropdownMenuRadioGroup value="one" onValueChange={onValueChange}>
          <DropdownMenuRadioItem value="one">One</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="two" disabled>
            Two
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>,
      );
      await user.click(screen.getByRole("menuitemradio", { name: /Two/ }));
      expect(onValueChange).not.toHaveBeenCalled();
    });
  });
});
