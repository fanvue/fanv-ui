import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuHeader,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  type DropdownMenuReorderDetail,
  DropdownMenuReorderGroup,
  DropdownMenuReorderItem,
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
    it("sits the avatar, count and icons on a two-line row's title line", () => {
      renderMenu(
        <DropdownMenuItem
          avatar={<span data-testid="avatar">A</span>}
          count="12"
          description="Product designer"
        >
          Alex Smith
        </DropdownMenuItem>,
      );
      // 18px is the title's leading; a `pt-1` nudge would sit them 3px low.
      expect(screen.getByTestId("avatar").parentElement).toHaveClass("h-[18px]");
      expect(screen.getByText("12")).toHaveClass("h-[18px]");
      expect(screen.getByText("12")).not.toHaveClass("pt-1");
    });

    it("leaves a single-line row's siblings vertically centred by the row", () => {
      renderMenu(
        <DropdownMenuItem avatar={<span data-testid="avatar">A</span>} count="12">
          Alex Smith
        </DropdownMenuItem>,
      );
      expect(screen.getByTestId("avatar").parentElement).not.toHaveClass("h-[18px]");
      expect(screen.getByText("12")).not.toHaveClass("h-[18px]");
    });

    it("gives the panel the 12px menu radius, not the 8px row radius", () => {
      renderMenu(<DropdownMenuItem>Item</DropdownMenuItem>);
      const panel = screen.getByRole("menu");
      expect(panel).toHaveClass("rounded-sm");
      expect(panel).not.toHaveClass("rounded-xs");
      expect(panel).not.toHaveClass("rounded-lg");
    });

    // Each of these three drifted from the design unnoticed, so they are asserted
    // rather than left to the eye. Node references are in the component.
    it("gives a menu item the 12px row radius", () => {
      renderMenu(<DropdownMenuItem>Item</DropdownMenuItem>);
      const item = screen.getByRole("menuitem");
      expect(item).toHaveClass("rounded-sm");
      expect(item).not.toHaveClass("rounded-xs");
    });

    it("keeps the 8px radius on a radio item, which the design draws differently", () => {
      renderMenu(
        <DropdownMenuRadioGroup value="a">
          <DropdownMenuRadioItem value="a">A</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>,
      );
      const item = screen.getByRole("menuitemradio");
      expect(item).toHaveClass("rounded-xs");
      expect(item).not.toHaveClass("rounded-sm");
    });

    it("indents a radio item the same as any other row", () => {
      renderMenu(
        <DropdownMenuRadioGroup value="a">
          <DropdownMenuRadioItem value="a">A</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>,
      );
      const item = screen.getByRole("menuitemradio");
      expect(item).toHaveClass("px-3");
      expect(item).not.toHaveClass("px-4");
    });

    it("draws the count at 14px at both row heights", () => {
      renderMenu(
        <>
          <DropdownMenuItem size="40" count="12">
            Forty
          </DropdownMenuItem>
          <DropdownMenuItem size="32" count="34">
            Thirty two
          </DropdownMenuItem>
        </>,
      );
      expect(screen.getByText("12")).toHaveClass("typography-body-small-14px-regular");
      expect(screen.getByText("12")).not.toHaveClass("typography-body-default-16px-regular");
      expect(screen.getByText("34")).toHaveClass("typography-body-small-14px-regular");
    });

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

    // The pointer-dismissal path (no focus ring left on the trigger) can't be
    // driven in jsdom: a modal menu sets pointer-events:none on the body, and
    // Radix's dismissal never completes from synthesised events. This covers the
    // regression that broke it — the props spread replacing our handler.
    it("composes a consumer's onCloseAutoFocus rather than replacing it", async () => {
      const onCloseAutoFocus = vi.fn();
      const user = userEvent.setup();
      render(
        <DropdownMenu defaultOpen>
          <DropdownMenuTrigger>trigger</DropdownMenuTrigger>
          <DropdownMenuContent onCloseAutoFocus={onCloseAutoFocus}>
            <DropdownMenuItem>Item</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>,
      );

      await user.keyboard("{Escape}");
      await waitFor(() => expect(onCloseAutoFocus).toHaveBeenCalled());
      expect(screen.getByRole("button", { name: "trigger" })).toHaveFocus();
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

    it("focuses the search input on open when autoFocus is set", async () => {
      renderMenu(
        <>
          <DropdownMenuHeader type="search" searchProps={{ autoFocus: true }} />
          <DropdownMenuItem>Item</DropdownMenuItem>
        </>,
      );

      await waitFor(() => expect(screen.getByRole("searchbox")).toHaveFocus());
    });

    it("leaves the search input unfocused when autoFocus is not set", async () => {
      renderMenu(
        <>
          <DropdownMenuHeader type="search" />
          <DropdownMenuItem>Item</DropdownMenuItem>
        </>,
      );

      await waitFor(() => expect(screen.getByRole("menuitem", { name: "Item" })).toBeVisible());
      expect(screen.getByRole("searchbox")).not.toHaveFocus();
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

describe("DropdownMenuCheckboxItem", () => {
  it("does not shade a row just because it is checked", () => {
    renderMenu(
      <>
        <DropdownMenuCheckboxItem checked>@sofiabloom</DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem checked={false}>@aria.lane</DropdownMenuCheckboxItem>
      </>,
    );

    // A menu that opens fully selected would otherwise render every row shaded.
    for (const name of ["@sofiabloom", "@aria.lane"]) {
      const row = screen.getByRole("menuitemcheckbox", { name });
      expect(row.className).not.toContain("data-[state=checked]:bg-");
    }
  });

  describe("accessibility", () => {
    it("has no a11y violations", async () => {
      const { container } = renderMenu(
        <>
          <DropdownMenuCheckboxItem checked helper="Helper text">
            @sofiabloom
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem checked={false}>@aria.lane</DropdownMenuCheckboxItem>
        </>,
      );
      expect(await axe(container)).toHaveNoViolations();
    });
  });

  describe("API", () => {
    it("exposes the menuitemcheckbox role and reflects checked state", () => {
      renderMenu(
        <>
          <DropdownMenuCheckboxItem checked={false}>One</DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem checked>Two</DropdownMenuCheckboxItem>
        </>,
      );
      const items = screen.getAllByRole("menuitemcheckbox");
      expect(items[0]).toHaveAttribute("data-state", "unchecked");
      expect(items[1]).toHaveAttribute("data-state", "checked");
    });

    it("renders the helper text when provided", () => {
      renderMenu(
        <DropdownMenuCheckboxItem checked helper="Managed creator">
          @novaknight
        </DropdownMenuCheckboxItem>,
      );
      expect(screen.getByText("Managed creator")).toBeInTheDocument();
    });

    it("renders a leading avatar when provided", () => {
      renderMenu(
        <DropdownMenuCheckboxItem checked avatar={<span data-testid="avatar" />}>
          @miarivers
        </DropdownMenuCheckboxItem>,
      );
      expect(screen.getByTestId("avatar")).toBeInTheDocument();
    });

    it("calls onCheckedChange when toggled", async () => {
      const onCheckedChange = vi.fn();
      renderMenu(
        <DropdownMenuCheckboxItem checked={false} onCheckedChange={onCheckedChange}>
          @lunavale
        </DropdownMenuCheckboxItem>,
      );
      await userEvent.click(screen.getByRole("menuitemcheckbox"));
      expect(onCheckedChange).toHaveBeenCalledWith(true);
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

  it("forwards onCloseAutoFocus to the sheet's dialog content", async () => {
    // Regression guard: `onCloseAutoFocus` and `onPointerDownOutside` are
    // destructured for the popper branch's focus-ring handling, which takes them
    // out of the spread. The sheet branch has to re-attach them — consumers
    // stack sheets on `onCloseAutoFocus` to know a nested sheet has finished
    // animating out, and dropping it fails silently.
    const user = userEvent.setup();
    const onCloseAutoFocus = vi.fn();
    render(
      <DropdownMenu variant="sheet" defaultOpen={false}>
        <DropdownMenuTrigger>trigger</DropdownMenuTrigger>
        <DropdownMenuContent onCloseAutoFocus={onCloseAutoFocus}>
          <DropdownMenuItem>Item 1</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    );
    await user.click(screen.getByText("trigger"));
    await user.click(screen.getByRole("option", { name: "Item 1" }));
    await waitFor(() => expect(onCloseAutoFocus).toHaveBeenCalled());
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

  it("composes a consumer onClick with the internal select-and-close handler on a sheet item", async () => {
    // Regression guard: an explicit onClick after {...props} in the sheet
    // branch silently overwrote a consumer-supplied onClick instead of
    // composing with it.
    const user = userEvent.setup();
    const onClick = vi.fn();
    const onSelect = vi.fn();
    render(
      <DropdownMenu variant="sheet" defaultOpen={false}>
        <DropdownMenuTrigger>trigger</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={onClick} onSelect={onSelect}>
            Item 1
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    );
    await user.click(screen.getByText("trigger"));
    await user.click(screen.getByRole("option", { name: "Item 1" }));
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("skips the internal select-and-close handler when a consumer onClick calls preventDefault", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn((event: React.MouseEvent) => event.preventDefault());
    const onSelect = vi.fn();
    render(
      <DropdownMenu variant="sheet" defaultOpen={false}>
        <DropdownMenuTrigger>trigger</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={onClick} onSelect={onSelect}>
            Item 1
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    );
    await user.click(screen.getByText("trigger"));
    await user.click(screen.getByRole("option", { name: "Item 1" }));
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onSelect).not.toHaveBeenCalled();
    expect(screen.getByRole("dialog")).toBeInTheDocument();
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

describe("DropdownMenuHeader actions", () => {
  it("renders custom actions before the close button", () => {
    renderMenu(
      <DropdownMenuHeader
        title="All Folders"
        actions={
          <button type="button" data-testid="done">
            Done
          </button>
        }
      />,
    );
    const done = screen.getByTestId("done");
    const close = screen.getByLabelText("Close menu");
    expect(done.parentElement).toBe(close.parentElement);
    expect(done.compareDocumentPosition(close) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it("renders actions without a close button when showClose is false", () => {
    renderMenu(
      <DropdownMenuHeader
        title="All Folders"
        showClose={false}
        actions={
          <button type="button" data-testid="done">
            Done
          </button>
        }
      />,
    );
    expect(screen.getByTestId("done")).toBeInTheDocument();
    expect(screen.queryByLabelText("Close menu")).not.toBeInTheDocument();
  });
});

function mockRect(element: Element, top: number, height = 40, width = 240) {
  return vi.spyOn(element, "getBoundingClientRect").mockReturnValue({
    top,
    bottom: top + height,
    height,
    left: 0,
    right: width,
    width,
    x: 0,
    y: top,
    toJSON: () => ({}),
  } as DOMRect);
}

function mockLayout(container: HTMLElement) {
  const group = container.querySelector('[role="group"]');
  if (group === null) throw new Error("group not rendered");
  mockRect(group, 0, 120);
  const rows = Array.from(group.children).filter(
    (child) => child.tagName === "DIV" && !child.hasAttribute("data-reorder-indicator"),
  );
  rows.forEach((row, index) => {
    mockRect(row, index * 40);
  });
  return rows as HTMLElement[];
}

const mousePress = { pointerId: 1, pointerType: "mouse", button: 0, clientX: 10, clientY: 20 };

/** Lifts the first row and drags it to `clientY` without releasing. */
function liftRow(row: HTMLElement, clientY: number) {
  fireEvent.pointerDown(row, mousePress);
  fireEvent.pointerMove(row, { pointerId: 1, clientX: 10, clientY });
}

describe("DropdownMenuReorderGroup", () => {
  function ReorderDemo({
    onReorder,
    disabledValue,
  }: {
    onReorder?: (values: string[], detail: DropdownMenuReorderDetail) => void;
    disabledValue?: string;
  }) {
    const [values, setValues] = React.useState(["Alpha", "Beta", "Gamma"]);
    return (
      <DropdownMenuReorderGroup
        values={values}
        onReorder={(next, detail) => {
          setValues(next);
          onReorder?.(next, detail);
        }}
        aria-label="Reorder sections"
      >
        {values.map((value) => (
          <DropdownMenuReorderItem
            key={value}
            value={value}
            disabled={value === disabledValue}
            dragHandleLabel={`Reorder ${value}`}
          >
            {value}
          </DropdownMenuReorderItem>
        ))}
      </DropdownMenuReorderGroup>
    );
  }

  describe("accessibility", () => {
    it("has no violations standalone", async () => {
      const { container } = render(<ReorderDemo />);
      expect(await axe(container)).toHaveNoViolations();
    });

    it("has no violations inside an open menu", async () => {
      const { container } = renderMenu(<ReorderDemo />);
      expect(await axe(container)).toHaveNoViolations();
    });
  });

  describe("keyboard", () => {
    it("moves the item down on ArrowDown and announces the move", () => {
      const onReorder = vi.fn();
      render(<ReorderDemo onReorder={onReorder} />);
      const handle = screen.getByRole("button", { name: "Reorder Alpha" });
      fireEvent.keyDown(handle, { key: "ArrowDown" });
      expect(onReorder).toHaveBeenCalledWith(["Beta", "Alpha", "Gamma"], {
        value: "Alpha",
        label: "Alpha",
        from: 0,
        to: 1,
        total: 3,
      });
      expect(screen.getByRole("status")).toHaveTextContent("Alpha moved to position 2 of 3");
    });

    it("moves the item up on ArrowUp", () => {
      const onReorder = vi.fn();
      render(<ReorderDemo onReorder={onReorder} />);
      fireEvent.keyDown(screen.getByRole("button", { name: "Reorder Gamma" }), {
        key: "ArrowUp",
      });
      expect(onReorder).toHaveBeenCalledWith(["Alpha", "Gamma", "Beta"], expect.anything());
    });

    it("ignores moves past the ends of the list", () => {
      const onReorder = vi.fn();
      render(<ReorderDemo onReorder={onReorder} />);
      fireEvent.keyDown(screen.getByRole("button", { name: "Reorder Alpha" }), {
        key: "ArrowUp",
      });
      fireEvent.keyDown(screen.getByRole("button", { name: "Reorder Gamma" }), {
        key: "ArrowDown",
      });
      expect(onReorder).not.toHaveBeenCalled();
    });

    it("disables the handle of a disabled item", () => {
      render(<ReorderDemo disabledValue="Beta" />);
      expect(screen.getByRole("button", { name: "Reorder Beta" })).toBeDisabled();
    });
  });

  describe("pointer drag", () => {
    it("reorders after dragging a row past the next row's midpoint", () => {
      const onReorder = vi.fn();
      const { container } = render(<ReorderDemo onReorder={onReorder} />);
      const rows = mockLayout(container);
      fireEvent.pointerDown(rows[0] as HTMLElement, {
        pointerId: 1,
        pointerType: "mouse",
        button: 0,
        clientX: 10,
        clientY: 20,
      });
      fireEvent.pointerMove(rows[0] as HTMLElement, { pointerId: 1, clientX: 10, clientY: 70 });
      fireEvent.pointerUp(rows[0] as HTMLElement, { pointerId: 1, clientX: 10, clientY: 70 });
      expect(onReorder).toHaveBeenCalledWith(["Beta", "Alpha", "Gamma"], expect.anything());
    });

    it("shows the floating copy while lifted and clears it on drop", () => {
      const { container } = render(<ReorderDemo />);
      const rows = mockLayout(container);
      fireEvent.pointerDown(rows[0] as HTMLElement, {
        pointerId: 1,
        pointerType: "mouse",
        button: 0,
        clientX: 10,
        clientY: 20,
      });
      fireEvent.pointerMove(rows[0] as HTMLElement, { pointerId: 1, clientX: 10, clientY: 100 });
      expect(rows[0]).toHaveAttribute("data-dragging");
      fireEvent.pointerUp(rows[0] as HTMLElement, { pointerId: 1, clientX: 10, clientY: 100 });
      expect(rows[0]).not.toHaveAttribute("data-dragging");
    });

    it("does not reorder when the pointer never leaves the lift threshold", () => {
      const onReorder = vi.fn();
      const { container } = render(<ReorderDemo onReorder={onReorder} />);
      const rows = mockLayout(container);
      fireEvent.pointerDown(rows[0] as HTMLElement, {
        pointerId: 1,
        pointerType: "mouse",
        button: 0,
        clientX: 10,
        clientY: 20,
      });
      fireEvent.pointerMove(rows[0] as HTMLElement, { pointerId: 1, clientX: 11, clientY: 21 });
      fireEvent.pointerUp(rows[0] as HTMLElement, { pointerId: 1, clientX: 11, clientY: 21 });
      expect(onReorder).not.toHaveBeenCalled();
    });

    it("cancels the drag on Escape without reordering", () => {
      const onReorder = vi.fn();
      const { container } = render(<ReorderDemo onReorder={onReorder} />);
      const rows = mockLayout(container);
      fireEvent.pointerDown(rows[0] as HTMLElement, {
        pointerId: 1,
        pointerType: "mouse",
        button: 0,
        clientX: 10,
        clientY: 20,
      });
      fireEvent.pointerMove(rows[0] as HTMLElement, { pointerId: 1, clientX: 10, clientY: 70 });
      fireEvent.keyDown(document.body, { key: "Escape" });
      fireEvent.pointerUp(rows[0] as HTMLElement, { pointerId: 1, clientX: 10, clientY: 70 });
      expect(onReorder).not.toHaveBeenCalled();
      expect(rows[0]).not.toHaveAttribute("data-dragging");
    });

    it("ignores drags starting on a disabled row", () => {
      const onReorder = vi.fn();
      const { container } = render(<ReorderDemo onReorder={onReorder} disabledValue="Alpha" />);
      const rows = mockLayout(container);
      fireEvent.pointerDown(rows[0] as HTMLElement, {
        pointerId: 1,
        pointerType: "mouse",
        button: 0,
        clientX: 10,
        clientY: 20,
      });
      fireEvent.pointerMove(rows[0] as HTMLElement, { pointerId: 1, clientX: 10, clientY: 70 });
      fireEvent.pointerUp(rows[0] as HTMLElement, { pointerId: 1, clientX: 10, clientY: 70 });
      expect(onReorder).not.toHaveBeenCalled();
    });
  });
});

describe("DropdownMenuReorderGroup API", () => {
  type Folder = { id: string; name: string };
  const FOLDERS: Folder[] = [
    { id: "f1", name: "Alpha" },
    { id: "f2", name: "Beta" },
    { id: "f3", name: "Gamma" },
  ];

  function FolderDemo({
    onReorder,
    getAnnouncement,
    instructions,
  }: Pick<
    React.ComponentProps<typeof DropdownMenuReorderGroup>,
    "onReorder" | "getAnnouncement" | "instructions"
  >) {
    const [folders, setFolders] = React.useState(FOLDERS);
    return (
      <DropdownMenuReorderGroup
        values={folders.map((folder) => folder.id)}
        onReorder={(next, detail) => {
          setFolders(next.flatMap((id) => folders.filter((folder) => folder.id === id)));
          onReorder(next, detail);
        }}
        getAnnouncement={getAnnouncement}
        instructions={instructions}
        aria-label="Reorder folders"
      >
        {folders.map((folder) => (
          <DropdownMenuReorderItem
            key={folder.id}
            value={folder.id}
            label={folder.name}
            dragHandleLabel={`Reorder ${folder.name}`}
            trailing={<span data-testid={`count-${folder.id}`}>12</span>}
          >
            {folder.name}
          </DropdownMenuReorderItem>
        ))}
      </DropdownMenuReorderGroup>
    );
  }

  it("reports the moved item's value, label and indices alongside the new order", () => {
    const onReorder = vi.fn();
    render(<FolderDemo onReorder={onReorder} />);
    fireEvent.keyDown(screen.getByRole("button", { name: "Reorder Gamma" }), { key: "ArrowUp" });
    expect(onReorder).toHaveBeenCalledWith(["f1", "f3", "f2"], {
      value: "f3",
      label: "Gamma",
      from: 2,
      to: 1,
      total: 3,
    });
  });

  it("announces with the item's label rather than its value", () => {
    render(<FolderDemo onReorder={vi.fn()} />);
    fireEvent.keyDown(screen.getByRole("button", { name: "Reorder Alpha" }), { key: "ArrowDown" });
    expect(screen.getByRole("status")).toHaveTextContent("Alpha moved to position 2 of 3");
  });

  it("uses a custom announcement builder", () => {
    render(
      <FolderDemo
        onReorder={vi.fn()}
        getAnnouncement={({ label, to, total }) => `${label} ist jetzt ${to + 1} von ${total}`}
      />,
    );
    fireEvent.keyDown(screen.getByRole("button", { name: "Reorder Alpha" }), { key: "ArrowDown" });
    expect(screen.getByRole("status")).toHaveTextContent("Alpha ist jetzt 2 von 3");
  });

  it("reports the detail after a pointer drop too", () => {
    const onReorder = vi.fn();
    const { container } = render(<FolderDemo onReorder={onReorder} />);
    const rows = mockLayout(container);
    liftRow(rows[0] as HTMLElement, 70);
    fireEvent.pointerUp(rows[0] as HTMLElement, { pointerId: 1, clientX: 10, clientY: 70 });
    expect(onReorder).toHaveBeenCalledWith(["f2", "f1", "f3"], {
      value: "f1",
      label: "Alpha",
      from: 0,
      to: 1,
      total: 3,
    });
  });

  it("renders the trailing slot in the row and mirrors it in the floating copy", () => {
    const { container } = render(<FolderDemo onReorder={vi.fn()} />);
    expect(screen.getByTestId("count-f1")).toBeInTheDocument();
    const rows = mockLayout(container);
    liftRow(rows[0] as HTMLElement, 70);
    const ghost = document.querySelector("[data-reorder-ghost]");
    expect(ghost).not.toBeNull();
    expect(ghost?.querySelector('[data-testid="count-f1"]')).not.toBeNull();
    fireEvent.pointerUp(rows[0] as HTMLElement, { pointerId: 1, clientX: 10, clientY: 70 });
  });

  it("describes every handle with the reorder instructions", () => {
    render(<FolderDemo onReorder={vi.fn()} />);
    const handle = screen.getByRole("button", { name: "Reorder Alpha" });
    expect(handle).toHaveAccessibleDescription(
      "Press the up and down arrow keys to move this item.",
    );
  });

  it("accepts localised instructions", () => {
    render(<FolderDemo onReorder={vi.fn()} instructions="Flèches haut/bas pour déplacer." />);
    expect(screen.getByRole("button", { name: "Reorder Beta" })).toHaveAccessibleDescription(
      "Flèches haut/bas pour déplacer.",
    );
  });
});

describe("DropdownMenuReorderGroup drag performance", () => {
  function Demo({ values }: { values: string[] }) {
    return (
      <DropdownMenuReorderGroup values={values} onReorder={vi.fn()} aria-label="Reorder">
        {values.map((value) => (
          <DropdownMenuReorderItem key={value} value={value} dragHandleLabel={`Reorder ${value}`}>
            {value}
          </DropdownMenuReorderItem>
        ))}
      </DropdownMenuReorderGroup>
    );
  }

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("measures the rows once at lift, not on every pointer move", () => {
    const { container } = render(<Demo values={["A", "B", "C"]} />);
    const group = container.querySelector('[role="group"]') as HTMLElement;
    const rows = mockLayout(container);
    const groupSpy = vi.spyOn(group, "getBoundingClientRect");
    const rowSpies = rows.map((row) => vi.spyOn(row, "getBoundingClientRect"));
    liftRow(rows[0] as HTMLElement, 70);
    for (const clientY of [72, 80, 95, 110]) {
      fireEvent.pointerMove(rows[0] as HTMLElement, { pointerId: 1, clientX: 10, clientY });
    }
    expect(groupSpy).toHaveBeenCalledTimes(1);
    // The lifted row is read once for its grab offset and once in the batch.
    expect(rowSpies[0]).toHaveBeenCalledTimes(2);
    expect(rowSpies[1]).toHaveBeenCalledTimes(1);
    expect(rowSpies[2]).toHaveBeenCalledTimes(1);
    fireEvent.pointerUp(rows[0] as HTMLElement, { pointerId: 1, clientX: 10, clientY: 110 });
  });

  it("moves the floating copy with a transform written outside React", () => {
    const { container } = render(<Demo values={["A", "B", "C"]} />);
    const rows = mockLayout(container);
    liftRow(rows[0] as HTMLElement, 70);
    const ghost = document.querySelector<HTMLElement>("[data-reorder-ghost]");
    expect(ghost).not.toBeNull();
    // Grabbed 10px in and 20px down from the row's corner at (0, 0).
    expect(ghost?.style.transform).toBe("translate3d(0px, 50px, 0)");
    expect(ghost?.style.left).toBe("");
    fireEvent.pointerMove(rows[0] as HTMLElement, { pointerId: 1, clientX: 30, clientY: 90 });
    expect(ghost?.style.transform).toBe("translate3d(20px, 70px, 0)");
    fireEvent.pointerUp(rows[0] as HTMLElement, { pointerId: 1, clientX: 30, clientY: 90 });
    expect(document.querySelector("[data-reorder-ghost]")).toBeNull();
  });

  it("commits to React only when the drop index changes, not on every move", () => {
    const commits = vi.fn();
    const values = ["A", "B", "C"];
    const { container } = render(
      <React.Profiler id="reorder" onRender={commits}>
        <Demo values={values} />
      </React.Profiler>,
    );
    const rows = mockLayout(container);
    liftRow(rows[0] as HTMLElement, 70);
    commits.mockClear();
    // Still between B's and C's midpoints: same drop index, nothing to commit.
    for (const clientY of [72, 80, 95]) {
      fireEvent.pointerMove(rows[0] as HTMLElement, { pointerId: 1, clientX: 10, clientY });
    }
    expect(commits).not.toHaveBeenCalled();
    // Past C's midpoint (100): one commit for the indicator.
    fireEvent.pointerMove(rows[0] as HTMLElement, { pointerId: 1, clientX: 10, clientY: 105 });
    expect(commits).toHaveBeenCalledTimes(1);
    fireEvent.pointerUp(rows[0] as HTMLElement, { pointerId: 1, clientX: 10, clientY: 105 });
  });

  it("does not start a frame loop when nothing can scroll", () => {
    const raf = vi.spyOn(window, "requestAnimationFrame");
    const { container } = render(<Demo values={["A", "B", "C"]} />);
    const rows = mockLayout(container);
    liftRow(rows[0] as HTMLElement, 70);
    fireEvent.pointerMove(rows[0] as HTMLElement, { pointerId: 1, clientX: 10, clientY: 115 });
    expect(raf).not.toHaveBeenCalled();
    fireEvent.pointerUp(rows[0] as HTMLElement, { pointerId: 1, clientX: 10, clientY: 115 });
  });

  describe("inside a scrollable container", () => {
    function renderScrollable() {
      const frames: FrameRequestCallback[] = [];
      vi.spyOn(window, "requestAnimationFrame").mockImplementation((callback) => {
        frames.push(callback);
        return frames.length;
      });
      vi.spyOn(window, "cancelAnimationFrame").mockImplementation(() => {});
      const utils = render(
        <div data-testid="scroller" style={{ overflowY: "auto" }}>
          <Demo values={["A", "B", "C"]} />
        </div>,
      );
      const scroller = screen.getByTestId("scroller");
      Object.defineProperty(scroller, "scrollHeight", { value: 400, configurable: true });
      Object.defineProperty(scroller, "clientHeight", { value: 120, configurable: true });
      Object.defineProperty(scroller, "scrollTop", {
        value: 0,
        writable: true,
        configurable: true,
      });
      mockRect(scroller, 0, 120);
      const rows = mockLayout(utils.container);
      return { ...utils, scroller, rows, frames };
    }

    it("moves the drop target when the container scrolls under a stationary pointer", () => {
      const { container, scroller, rows } = renderScrollable();
      // Pointer at y=50 sits just under row B's midpoint gap: drop index 1,
      // which is the source row's own slot, so no indicator.
      liftRow(rows[0] as HTMLElement, 50);
      expect(container.querySelector("[data-reorder-indicator]")).toBeNull();
      // Scrolling 40px moves the rows up under the pointer: it now sits past
      // row C's midpoint (original 100), drop index 2.
      scroller.scrollTop = 40;
      fireEvent.scroll(scroller);
      const indicator = container.querySelector<HTMLElement>("[data-reorder-indicator]");
      expect(indicator).not.toBeNull();
      expect(indicator?.style.top).toBe("80px");
      // Rows were not re-measured for the scroll: the cached edges were reused.
      fireEvent.pointerUp(rows[0] as HTMLElement, { pointerId: 1, clientX: 10, clientY: 50 });
    });

    it("auto-scrolls only while the pointer is in an edge zone", () => {
      const { scroller, rows, frames } = renderScrollable();
      liftRow(rows[0] as HTMLElement, 60);
      expect(frames).toHaveLength(0);
      // 110 is inside the 32px bottom zone of a container ending at 120.
      fireEvent.pointerMove(rows[0] as HTMLElement, { pointerId: 1, clientX: 10, clientY: 110 });
      expect(frames).toHaveLength(1);
      frames[0]?.(0);
      expect(scroller.scrollTop).toBeGreaterThan(0);
      // Each frame re-queues while the pointer stays in the zone...
      expect(frames).toHaveLength(2);
      // ...and stops as soon as it leaves.
      fireEvent.pointerMove(rows[0] as HTMLElement, { pointerId: 1, clientX: 10, clientY: 60 });
      const before = scroller.scrollTop;
      frames[1]?.(0);
      expect(scroller.scrollTop).toBe(before);
      expect(frames).toHaveLength(2);
      fireEvent.pointerUp(rows[0] as HTMLElement, { pointerId: 1, clientX: 10, clientY: 60 });
    });
  });
});

describe("DropdownMenuReorderGroup drag lifecycle", () => {
  function Demo({ values, onReorder }: { values: string[]; onReorder?: () => void }) {
    return (
      <DropdownMenuReorderGroup
        values={values}
        onReorder={onReorder ?? vi.fn()}
        aria-label="Reorder"
      >
        {values.map((value) => (
          <DropdownMenuReorderItem key={value} value={value} dragHandleLabel={`Reorder ${value}`}>
            {value}
          </DropdownMenuReorderItem>
        ))}
      </DropdownMenuReorderGroup>
    );
  }

  it("commits the drop from a pointerup the row never receives", () => {
    const onReorder = vi.fn();
    const { container } = render(<Demo values={["A", "B", "C"]} onReorder={onReorder} />);
    const rows = mockLayout(container);
    liftRow(rows[0] as HTMLElement, 70);
    fireEvent.pointerUp(window, { pointerId: 1 });
    expect(onReorder).toHaveBeenCalledWith(["B", "A", "C"], expect.anything());
    expect(rows[0]).not.toHaveAttribute("data-dragging");
    expect(document.querySelector("[data-reorder-ghost]")).toBeNull();
  });

  it("cancels the drag when the lifted item leaves the list", () => {
    const { container, rerender } = render(<Demo values={["A", "B", "C"]} />);
    const rows = mockLayout(container);
    liftRow(rows[0] as HTMLElement, 70);
    expect(document.querySelector("[data-reorder-ghost]")).not.toBeNull();
    rerender(<Demo values={["B", "C"]} />);
    expect(document.querySelector("[data-reorder-ghost]")).toBeNull();
    expect(container.querySelector("[data-reorder-indicator]")).toBeNull();
    // A later Escape reaches the menu again rather than being swallowed.
    const escapeNotSwallowed = fireEvent.keyDown(document.body, { key: "Escape" });
    expect(escapeNotSwallowed).toBe(true);
  });

  it("ignores a second pointer while a drag is in flight", () => {
    const onReorder = vi.fn();
    const { container } = render(<Demo values={["A", "B", "C"]} onReorder={onReorder} />);
    const rows = mockLayout(container);
    liftRow(rows[0] as HTMLElement, 70);
    fireEvent.pointerDown(rows[2] as HTMLElement, { ...mousePress, pointerId: 2, clientY: 100 });
    fireEvent.pointerMove(rows[2] as HTMLElement, { pointerId: 2, clientX: 10, clientY: 20 });
    fireEvent.pointerUp(rows[2] as HTMLElement, { pointerId: 2, clientX: 10, clientY: 20 });
    expect(onReorder).not.toHaveBeenCalled();
    fireEvent.pointerUp(rows[0] as HTMLElement, { pointerId: 1, clientX: 10, clientY: 70 });
    expect(onReorder).toHaveBeenCalledWith(["B", "A", "C"], expect.anything());
  });

  it("lets Escape through while a row is pressed but not yet lifted", () => {
    const { container } = render(<Demo values={["A", "B", "C"]} />);
    const rows = mockLayout(container);
    fireEvent.pointerDown(rows[0] as HTMLElement, mousePress);
    expect(fireEvent.keyDown(document.body, { key: "Escape" })).toBe(true);
    fireEvent.pointerUp(rows[0] as HTMLElement, { pointerId: 1, clientX: 10, clientY: 20 });
  });

  it("does not take the pointer from a control inside the row", () => {
    const onReorder = vi.fn();
    const onClick = vi.fn();
    const values = ["A", "B", "C"];
    const { container } = render(
      <DropdownMenuReorderGroup values={values} onReorder={onReorder} aria-label="Reorder">
        {values.map((value) => (
          <DropdownMenuReorderItem
            key={value}
            value={value}
            dragHandleLabel={`Reorder ${value}`}
            trailing={
              <button type="button" onClick={onClick}>
                More {value}
              </button>
            }
          >
            {value}
          </DropdownMenuReorderItem>
        ))}
      </DropdownMenuReorderGroup>,
    );
    const rows = mockLayout(container);
    const more = screen.getByRole("button", { name: "More A" });
    expect(fireEvent.pointerDown(more, mousePress)).toBe(true);
    fireEvent.pointerMove(more, { pointerId: 1, clientX: 10, clientY: 70 });
    fireEvent.pointerUp(more, { pointerId: 1, clientX: 10, clientY: 70 });
    fireEvent.click(more);
    expect(onReorder).not.toHaveBeenCalled();
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(rows[0]).not.toHaveAttribute("data-dragging");
  });

  it("leaves a second pointer's default alone while a drag is in flight", () => {
    const { container } = render(<Demo values={["A", "B", "C"]} />);
    const rows = mockLayout(container);
    liftRow(rows[0] as HTMLElement, 70);
    const handleC = screen.getByRole("button", { name: "Reorder C" });
    const notPrevented = fireEvent.pointerDown(handleC, {
      pointerId: 2,
      pointerType: "touch",
      clientX: 5,
      clientY: 100,
    });
    expect(notPrevented).toBe(true);
    fireEvent.pointerUp(rows[0] as HTMLElement, { pointerId: 1, clientX: 10, clientY: 70 });
  });

  it("focuses the grip on a plain click so the arrow keys work next", () => {
    const { container } = render(<Demo values={["A", "B", "C"]} />);
    mockLayout(container);
    const handle = screen.getByRole("button", { name: "Reorder B" });
    fireEvent.pointerDown(handle, { ...mousePress, clientY: 60 });
    fireEvent.pointerUp(handle, { pointerId: 1, clientX: 10, clientY: 60 });
    expect(handle).toHaveFocus();
  });

  it("drops at either end of the list", () => {
    const onReorder = vi.fn();
    const { container, rerender } = render(<Demo values={["A", "B", "C"]} onReorder={onReorder} />);
    let rows = mockLayout(container);
    liftRow(rows[0] as HTMLElement, 115);
    fireEvent.pointerUp(rows[0] as HTMLElement, { pointerId: 1, clientX: 10, clientY: 115 });
    expect(onReorder).toHaveBeenLastCalledWith(["B", "C", "A"], expect.objectContaining({ to: 2 }));
    rerender(<Demo values={["A", "B", "C"]} onReorder={onReorder} />);
    rows = mockLayout(container);
    fireEvent.pointerDown(rows[2] as HTMLElement, { ...mousePress, clientY: 100 });
    fireEvent.pointerMove(rows[2] as HTMLElement, { pointerId: 1, clientX: 10, clientY: 5 });
    fireEvent.pointerUp(rows[2] as HTMLElement, { pointerId: 1, clientX: 10, clientY: 5 });
    expect(onReorder).toHaveBeenLastCalledWith(["C", "A", "B"], expect.objectContaining({ to: 0 }));
  });

  it("removes its window listeners when the group unmounts mid-drag", () => {
    const { container, unmount } = render(<Demo values={["A", "B", "C"]} />);
    const rows = mockLayout(container);
    liftRow(rows[0] as HTMLElement, 70);
    unmount();
    expect(document.querySelector("[data-reorder-ghost]")).toBeNull();
    // Escape is no longer swallowed by a dead drag.
    expect(fireEvent.keyDown(document.body, { key: "Escape" })).toBe(true);
  });
});

describe("DropdownMenu keyboard reachability of non-item controls", () => {
  function ReorderRows({ values }: { values: string[] }) {
    return (
      <DropdownMenuReorderGroup values={values} onReorder={vi.fn()} aria-label="Reorder">
        {values.map((value) => (
          <DropdownMenuReorderItem key={value} value={value} dragHandleLabel={`Reorder ${value}`}>
            {value}
          </DropdownMenuReorderItem>
        ))}
      </DropdownMenuReorderGroup>
    );
  }

  // jsdom schedules requestAnimationFrame on a ~16ms timer, so waiting one
  // frame is the only way to see what the group's focus effect decided.
  const nextFrame = () =>
    new Promise<void>((resolve) => {
      requestAnimationFrame(() => resolve());
    });

  it("focuses the first handle when a menu opens straight into a reorder group", async () => {
    renderMenu(<ReorderRows values={["A", "B"]} />);
    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Reorder A" })).toHaveFocus();
    });
  });

  it("leaves focus with Radix when the menu also has items", async () => {
    renderMenu(
      <>
        <DropdownMenuItem>Item</DropdownMenuItem>
        <ReorderRows values={["A", "B"]} />
      </>,
    );
    await nextFrame();
    await nextFrame();
    expect(screen.getByRole("button", { name: "Reorder A" })).not.toHaveFocus();
    expect(screen.getByRole("menu")).toHaveFocus();
  });

  it("cycles Tab through header actions and reorder handles inside a menu", async () => {
    const user = userEvent.setup();
    renderMenu(
      <>
        <DropdownMenuHeader
          title="Folders"
          showClose={false}
          actions={<button type="button">Done</button>}
        />
        <ReorderRows values={["A", "B"]} />
      </>,
    );
    const done = screen.getByRole("button", { name: "Done" });
    const handleA = screen.getByRole("button", { name: "Reorder A" });
    const handleB = screen.getByRole("button", { name: "Reorder B" });
    await waitFor(() => expect(handleA).toHaveFocus());
    await user.tab();
    expect(handleB).toHaveFocus();
    await user.tab();
    expect(done).toHaveFocus();
    await user.tab();
    expect(handleA).toHaveFocus();
    await user.tab({ shift: true });
    expect(done).toHaveFocus();
  });

  it("reaches header actions by Tab from a menu item", async () => {
    const user = userEvent.setup();
    renderMenu(
      <>
        <DropdownMenuHeader
          title="Folders"
          showClose={false}
          actions={<button type="button">Add</button>}
        />
        <DropdownMenuItem>First</DropdownMenuItem>
        <DropdownMenuItem>Second</DropdownMenuItem>
      </>,
    );
    await user.keyboard("{ArrowDown}");
    expect(screen.getByRole("menuitem", { name: "First" })).toHaveFocus();
    await user.tab();
    expect(screen.getByRole("button", { name: "Add" })).toHaveFocus();
  });

  it("includes the search input and close button in the Tab cycle", async () => {
    const user = userEvent.setup();
    renderMenu(
      <>
        <DropdownMenuHeader type="search" searchProps={{ "aria-label": "Search" }} />
        <DropdownMenuItem>First</DropdownMenuItem>
      </>,
    );
    await user.tab();
    expect(screen.getByRole("searchbox", { name: "Search" })).toHaveFocus();
    await user.tab();
    expect(screen.getByRole("button", { name: "Close menu" })).toHaveFocus();
    await user.tab();
    expect(screen.getByRole("searchbox", { name: "Search" })).toHaveFocus();
  });

  it("brings Tab back to the first handle when focus has fallen to the body", async () => {
    renderMenu(<ReorderRows values={["A", "B"]} />);
    const handleA = screen.getByRole("button", { name: "Reorder A" });
    await waitFor(() => expect(handleA).toHaveFocus());
    handleA.blur();
    expect(document.body).toHaveFocus();
    const notPrevented = fireEvent.keyDown(document.body, { key: "Tab" });
    expect(notPrevented).toBe(false);
    expect(handleA).toHaveFocus();
  });
});

describe("DropdownMenuHeader back button", () => {
  it("renders a back button before the title when onBack is provided", () => {
    const onBack = vi.fn();
    renderMenu(<DropdownMenuHeader title="Search" onBack={onBack} backLabel="Stop searching" />);
    const back = screen.getByRole("button", { name: "Stop searching" });
    fireEvent.click(back);
    expect(onBack).toHaveBeenCalledTimes(1);
    const header = back.closest("div[class*='flex-col']");
    expect(header?.textContent?.indexOf("Search")).toBeGreaterThan(-1);
  });

  it("renders no back button by default", () => {
    renderMenu(<DropdownMenuHeader title="Sort by" />);
    expect(screen.queryByRole("button", { name: "Back" })).toBeNull();
  });

  it("has no a11y violations with back button, actions and a reorder group", async () => {
    const { container } = renderMenu(
      <>
        <DropdownMenuHeader
          title="Folders"
          onBack={() => {}}
          actions={<button type="button">Done</button>}
        />
        <DropdownMenuReorderGroup values={["A"]} onReorder={vi.fn()} aria-label="Reorder">
          <DropdownMenuReorderItem value="A" dragHandleLabel="Reorder A" trailing={<span>3</span>}>
            A
          </DropdownMenuReorderItem>
        </DropdownMenuReorderGroup>
      </>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
