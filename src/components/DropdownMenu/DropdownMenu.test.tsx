import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type * as React from "react";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
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
      renderMenu(<DropdownMenuItem>Hidden</DropdownMenuItem>, { defaultOpen: false });
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
      expect(screen.getByTestId("item")).toHaveClass("text-error-default");
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

    it("renders sm size by default", () => {
      renderMenu(<DropdownMenuItem data-testid="item">Item</DropdownMenuItem>);
      expect(screen.getByTestId("item")).toHaveClass("min-h-[34px]");
    });

    it("renders md size", () => {
      renderMenu(
        <DropdownMenuItem size="md" data-testid="item">
          Item
        </DropdownMenuItem>,
      );
      expect(screen.getByTestId("item")).toHaveClass("min-h-[40px]");
    });

    it("renders selected state", () => {
      renderMenu(
        <DropdownMenuItem selected data-testid="item">
          Item
        </DropdownMenuItem>,
      );
      expect(screen.getByTestId("item")).toHaveClass("bg-success-background");
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
      expect(screen.getByRole("menuitem")).toHaveClass("text-error-default");
    });
  });
});
