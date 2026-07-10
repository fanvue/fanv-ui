import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
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

    it("feature item (avatar + count + description) has no a11y violations", async () => {
      const { container } = renderMenu(
        <DropdownMenuItem
          avatar={<span aria-hidden="true">A</span>}
          count="12"
          description="Product designer"
        >
          Alex Smith
        </DropdownMenuItem>,
      );
      expect(await axe(container)).toHaveNoViolations();
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

    it("renders selected state with the subtle highlight treatment", () => {
      renderMenu(
        <DropdownMenuItem selected data-testid="item">
          Item
        </DropdownMenuItem>,
      );
      const item = screen.getByTestId("item");
      expect(item).toHaveClass("bg-neutral-alphas-100");
      expect(item).not.toHaveClass("text-content-primary-inverted");
    });

    it("keeps a distinct selected highlight when the item is also keyboard/mouse-highlighted", () => {
      // Regression guard: bg-interaction-hover aliases to the same token as the
      // plain hover background (data-[highlighted]:bg-neutral-alphas-50), so a
      // selected+highlighted row must use a darker step of the neutral-alphas
      // ramp or it becomes visually indistinguishable from an unselected hover.
      renderMenu(
        <DropdownMenuItem selected data-testid="item">
          Item
        </DropdownMenuItem>,
      );
      const item = screen.getByTestId("item");
      expect(item.className).toContain("data-[highlighted]:bg-neutral-alphas-200");
      expect(item.className).not.toContain("data-[highlighted]:bg-neutral-alphas-50");
    });

    it("renders a check indicator on the selected item, not just a background change", () => {
      // Regression guard: a background-only signal for "selected" isn't
      // guaranteed to read as distinct from the hover background in every
      // theme/contrast combination — pair it with an explicit indicator, same
      // as SelectItem and DropdownMenuRadioItem already do.
      renderMenu(
        <>
          <DropdownMenuItem selected data-testid="selected-item">
            Selected
          </DropdownMenuItem>
          <DropdownMenuItem data-testid="unselected-item">Unselected</DropdownMenuItem>
        </>,
      );
      expect(screen.getByTestId("selected-item").querySelector("svg")).toBeInTheDocument();
      expect(screen.getByTestId("unselected-item").querySelector("svg")).not.toBeInTheDocument();
    });

    it("renders a caller-supplied trailingIcon instead of the built-in check indicator when selected", () => {
      // Regression guard: a caller may pass its own trailing icon to signal
      // selection (e.g. ChatInput's themed tick). That custom icon must win
      // the trailing slot rather than being silently replaced by the
      // built-in SelectedCheckIndicator.
      renderMenu(
        <DropdownMenuItem
          selected
          trailingIcon={<span data-testid="caller-trailing-icon">T</span>}
          data-testid="item"
        >
          Item
        </DropdownMenuItem>,
      );
      const item = screen.getByTestId("item");
      expect(screen.getByTestId("caller-trailing-icon")).toBeInTheDocument();
      expect(item.querySelectorAll("svg")).toHaveLength(0);
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

    it("renders the avatar in place of the leading icon", () => {
      renderMenu(
        <DropdownMenuItem
          avatar={<span data-testid="avatar">A</span>}
          leadingIcon={<span data-testid="lead">L</span>}
        >
          Jane Doe
        </DropdownMenuItem>,
      );
      expect(screen.getByTestId("avatar")).toBeInTheDocument();
      expect(screen.queryByTestId("lead")).not.toBeInTheDocument();
    });

    it("tightens padding so a 24px avatar keeps the 32px row height", () => {
      renderMenu(
        <DropdownMenuItem size="32" avatar={<span data-testid="avatar">A</span>} data-testid="item">
          Jane Doe
        </DropdownMenuItem>,
      );
      const item = screen.getByTestId("item");
      expect(item).toHaveClass("min-h-8", "py-1");
      expect(item).not.toHaveClass("py-[7px]");
    });

    it("renders the trailing count", () => {
      renderMenu(<DropdownMenuItem count="12">Messages</DropdownMenuItem>);
      expect(screen.getByText("12")).toBeInTheDocument();
    });

    it("renders a two-line layout with top-aligned icons when description is set", () => {
      renderMenu(
        <DropdownMenuItem description="Fast and versatile" data-testid="item">
          Claude Sonnet 4.6
        </DropdownMenuItem>,
      );
      const item = screen.getByTestId("item");
      expect(item).toHaveClass("items-start");
      expect(item).not.toHaveClass("items-center");
      expect(screen.getByText("Claude Sonnet 4.6")).toBeInTheDocument();
      expect(screen.getByText("Fast and versatile")).toBeInTheDocument();
    });

    it("keeps the single-line layout when no description is set", () => {
      renderMenu(<DropdownMenuItem data-testid="item">Claude Sonnet 4.6</DropdownMenuItem>);
      expect(screen.getByTestId("item")).toHaveClass("items-center");
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

    it("keeps focus on the search input while typing characters", async () => {
      const user = userEvent.setup();
      const SearchDemo = () => {
        const [query, setQuery] = React.useState("");
        const items = ["Apple", "Apricot", "Banana"].filter((name) =>
          name.toLowerCase().includes(query.toLowerCase()),
        );
        return (
          <DropdownMenu defaultOpen>
            <DropdownMenuTrigger>trigger</DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuHeader
                type="search"
                searchProps={{ value: query, onChange: setQuery }}
              />
              {items.map((name) => (
                <DropdownMenuItem key={name}>{name}</DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      };
      render(<SearchDemo />);
      const input = screen.getByRole("searchbox");
      input.focus();
      await user.keyboard("ap");
      expect(input).toHaveValue("ap");
      expect(document.activeElement).toBe(input);
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

    it("dismisses an uncontrolled menu when the close button is activated", async () => {
      const user = userEvent.setup();
      render(
        <DropdownMenu defaultOpen>
          <DropdownMenuTrigger>trigger</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuHeader title="Sort" closeLabel="Close" />
            <DropdownMenuItem>Item</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>,
      );
      expect(screen.getByRole("menu")).toBeInTheDocument();
      await user.click(screen.getByRole("button", { name: "Close" }));
      expect(screen.queryByRole("menu")).not.toBeInTheDocument();
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

    it("keeps a distinct checked highlight when the item is also keyboard/mouse-highlighted", () => {
      // Regression guard: bg-interaction-hover aliases to the same token as the
      // plain hover background, so checked must use a darker neutral-alphas step
      // (via a higher-specificity compound selector) or it becomes visually
      // indistinguishable from unchecked on hover.
      renderMenu(
        <DropdownMenuRadioGroup value="two">
          <DropdownMenuRadioItem value="one">One</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="two">Two</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>,
      );
      const checkedItem = screen.getByRole("menuitemradio", { name: /Two/ });
      expect(checkedItem.className).toContain(
        "data-[state=checked]:data-[highlighted]:bg-neutral-alphas-200",
      );
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

describe("DropdownMenu sheet variant", () => {
  it("opens a bottom drawer instead of a Radix menu", async () => {
    const user = userEvent.setup();
    render(
      <DropdownMenu variant="sheet" defaultOpen={false}>
        <DropdownMenuTrigger>trigger</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Item 1</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    );
    await user.click(screen.getByText("trigger"));
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Item 1" })).toBeInTheDocument();
  });

  it("selects an item, calls onSelect, and closes the sheet", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(
      <DropdownMenu variant="sheet" defaultOpen={false}>
        <DropdownMenuTrigger>trigger</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onSelect={onSelect}>Item 1</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    );
    await user.click(screen.getByText("trigger"));
    await user.click(screen.getByRole("option", { name: "Item 1" }));
    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("does not close the sheet or fire selection when the item is disabled", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(
      <DropdownMenu variant="sheet" defaultOpen={false}>
        <DropdownMenuTrigger>trigger</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onSelect={onSelect} disabled>
            Item 1
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    );
    await user.click(screen.getByText("trigger"));
    await user.click(screen.getByRole("option", { name: "Item 1" }));
    expect(onSelect).not.toHaveBeenCalled();
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("marks the selected item via aria-selected", async () => {
    const user = userEvent.setup();
    render(
      <DropdownMenu variant="sheet" defaultOpen={false}>
        <DropdownMenuTrigger>trigger</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem selected>Item 1</DropdownMenuItem>
          <DropdownMenuItem selected={false}>Item 2</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    );
    await user.click(screen.getByText("trigger"));
    expect(screen.getByRole("option", { name: "Item 1" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("option", { name: "Item 2" })).toHaveAttribute(
      "aria-selected",
      "false",
    );
  });

  it("renders a native <hr> separator without requiring Radix menu context", async () => {
    const user = userEvent.setup();
    render(
      <DropdownMenu variant="sheet" defaultOpen={false}>
        <DropdownMenuTrigger>trigger</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Item 1</DropdownMenuItem>
          <DropdownMenuSeparator data-testid="separator" />
          <DropdownMenuItem>Item 2</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    );
    await user.click(screen.getByText("trigger"));
    expect(screen.getByTestId("separator").tagName).toBe("HR");
  });

  it("renders a plain title (not a Radix label) without requiring menu context", async () => {
    const user = userEvent.setup();
    render(
      <DropdownMenu variant="sheet" defaultOpen={false}>
        <DropdownMenuTrigger>trigger</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Group title</DropdownMenuLabel>
          <DropdownMenuItem>Item 1</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    );
    await user.click(screen.getByText("trigger"));
    expect(screen.getByText("Group title")).toBeInTheDocument();
  });

  it("renders asChild via Slot instead of Radix's menu-context Item, without crashing", async () => {
    // Regression guard: DropdownMenuItem previously fell through to
    // DropdownMenuPrimitive.Item asChild whenever asChild was true, even in
    // the sheet variant, which never mounts a Radix menu Root/Content
    // ancestor — that primitive throws without menu context.
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(
      <DropdownMenu variant="sheet" defaultOpen={false}>
        <DropdownMenuTrigger>trigger</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem asChild onSelect={onSelect} selected>
            <a href="/settings">Settings</a>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    );
    await user.click(screen.getByText("trigger"));
    const link = screen.getByRole("option", { name: "Settings" });
    expect(link.tagName).toBe("A");
    expect(link).toHaveAttribute("aria-selected", "true");
    await user.click(link);
    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("passes a real Event to onSelect, not a fake partial shape", async () => {
    // Regression guard: a hand-built object cast to Event only had
    // preventDefault/currentTarget/target — any handler calling another
    // Event API method (stopPropagation, composedPath, etc.) would throw.
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(
      <DropdownMenu variant="sheet" defaultOpen={false}>
        <DropdownMenuTrigger>trigger</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onSelect={onSelect}>Item 1</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    );
    await user.click(screen.getByText("trigger"));
    await user.click(screen.getByRole("option", { name: "Item 1" }));
    const receivedEvent = onSelect.mock.calls[0]?.[0];
    expect(receivedEvent).toBeInstanceOf(Event);
    expect(() => (receivedEvent as Event).stopPropagation()).not.toThrow();
  });

  it("prevents the default action of a disabled asChild item's click (e.g. link navigation)", async () => {
    // Regression guard: the disabled guard used to return early without
    // calling preventDefault, so a disabled asChild link still navigated.
    // fireEvent's return value is false when preventDefault was called by any
    // listener during dispatch — the same signal the browser uses to decide
    // whether to run the click's default action.
    const user = userEvent.setup();
    render(
      <DropdownMenu variant="sheet" defaultOpen={false}>
        <DropdownMenuTrigger>trigger</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem asChild disabled>
            <a href="/settings">Settings</a>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    );
    await user.click(screen.getByText("trigger"));
    const notCancelled = fireEvent.click(screen.getByRole("option", { name: "Settings" }));
    expect(notCancelled).toBe(false);
  });

  it("blocks selection on a disabled asChild item despite no native disabled semantics", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(
      <DropdownMenu variant="sheet" defaultOpen={false}>
        <DropdownMenuTrigger>trigger</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem asChild onSelect={onSelect} disabled>
            <a href="/settings">Settings</a>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    );
    await user.click(screen.getByText("trigger"));
    const link = screen.getByRole("option", { name: "Settings" });
    expect(link).toHaveAttribute("aria-disabled", "true");
    await user.click(link);
    expect(onSelect).not.toHaveBeenCalled();
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("forwards passthrough HTML props (id, data-*, aria-*, style, onKeyDown) on a sheet item", async () => {
    // Regression guard: the sheet-variant branch only wired up a handful of
    // explicit props, silently dropping everything else a consumer passes.
    const user = userEvent.setup();
    const onKeyDown = vi.fn();
    render(
      <DropdownMenu variant="sheet" defaultOpen={false}>
        <DropdownMenuTrigger>trigger</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            id="item-1"
            data-testid="item"
            aria-keyshortcuts="Ctrl+1"
            style={{ color: "red" }}
            onKeyDown={onKeyDown}
          >
            Item 1
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    );
    await user.click(screen.getByText("trigger"));
    const item = screen.getByTestId("item");
    expect(item).toHaveAttribute("id", "item-1");
    expect(item).toHaveAttribute("aria-keyshortcuts", "Ctrl+1");
    expect(item).toHaveStyle({ color: "rgb(255, 0, 0)" });
    item.focus();
    await user.keyboard("{Enter}");
    expect(onKeyDown).toHaveBeenCalled();
  });

  it("forwards ref, style, and passthrough HTML props on a sheet content panel", async () => {
    // Regression guard: the sheet-variant DropdownMenuContent branch dropped
    // ref, style, and {...props} entirely, only passing className through.
    const user = userEvent.setup();
    const ref = React.createRef<HTMLDivElement>();
    render(
      <DropdownMenu variant="sheet" defaultOpen={false}>
        <DropdownMenuTrigger>trigger</DropdownMenuTrigger>
        <DropdownMenuContent
          ref={ref}
          data-testid="content"
          style={{ color: "red" }}
          id="content-1"
        >
          <DropdownMenuItem>Item 1</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    );
    await user.click(screen.getByText("trigger"));
    const content = screen.getByTestId("content");
    expect(content).toHaveAttribute("id", "content-1");
    expect(content).toHaveStyle({ color: "rgb(255, 0, 0)" });
    expect(ref.current).toBe(content);
  });

  it("visually marks a disabled asChild item via aria-disabled styling", async () => {
    // Regression guard: disabled asChild items in the sheet variant have no
    // data-disabled or native disabled attribute for the CSS to key off, so
    // they rendered with no visual disabled treatment at all.
    const user = userEvent.setup();
    render(
      <DropdownMenu variant="sheet" defaultOpen={false}>
        <DropdownMenuTrigger>trigger</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem asChild disabled>
            <a href="/settings">Settings</a>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    );
    await user.click(screen.getByText("trigger"));
    const link = screen.getByRole("option", { name: "Settings" });
    expect(link).toHaveClass("aria-disabled:text-content-disabled");
  });
});
