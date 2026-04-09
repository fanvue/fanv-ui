import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { HomeIcon } from "../Icons/HomeIcon";
import { SearchIcon } from "../Icons/SearchIcon";
import { BottomNavigation } from "./BottomNavigation";
import { BottomNavigationAction } from "./BottomNavigationAction";

function renderNav(props?: {
  value?: string;
  onValueChange?: (v: string) => void;
  hideOnDesktop?: boolean;
}) {
  const onValueChange = props?.onValueChange ?? vi.fn();
  return {
    onValueChange,
    ...render(
      <BottomNavigation
        value={props?.value ?? "home"}
        onValueChange={onValueChange}
        aria-label="Main navigation"
        hideOnDesktop={props?.hideOnDesktop}
      >
        <BottomNavigationAction value="home" icon={<HomeIcon />} label="Home" />
        <BottomNavigationAction value="search" icon={<SearchIcon />} label="Search" />
        <BottomNavigationAction value="profile" icon={<HomeIcon />} label="Profile" />
      </BottomNavigation>,
    ),
  };
}

describe("BottomNavigation", () => {
  describe("API", () => {
    it("renders all actions", () => {
      renderNav();
      expect(screen.getAllByRole("button")).toHaveLength(3);
    });

    it("marks the selected action as active", () => {
      renderNav({ value: "search" });
      const searchBtn = screen.getByRole("button", { name: /search/i });
      expect(searchBtn).toHaveAttribute("data-state", "active");
      expect(searchBtn).toHaveAttribute("aria-current", "page");
    });

    it("marks non-selected actions as inactive", () => {
      renderNav({ value: "home" });
      const searchBtn = screen.getByRole("button", { name: /search/i });
      expect(searchBtn).toHaveAttribute("data-state", "inactive");
      expect(searchBtn).not.toHaveAttribute("aria-current");
    });

    it("calls onValueChange when an action is clicked", async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      renderNav({ value: "home", onValueChange });
      await user.click(screen.getByRole("button", { name: /search/i }));
      expect(onValueChange).toHaveBeenCalledWith("search");
    });

    it("renders inside a nav landmark", () => {
      renderNav();
      expect(screen.getByRole("navigation")).toBeInTheDocument();
    });

    it("applies custom className to root", () => {
      render(
        <BottomNavigation className="custom-nav" aria-label="Nav">
          <BottomNavigationAction value="a" icon={<HomeIcon />} label="A" />
        </BottomNavigation>,
      );
      expect(screen.getByRole("navigation")).toHaveClass("custom-nav");
    });

    it("applies custom className to action", () => {
      render(
        <BottomNavigation value="a" aria-label="Nav">
          <BottomNavigationAction
            value="a"
            icon={<HomeIcon />}
            label="A"
            className="custom-action"
          />
        </BottomNavigation>,
      );
      expect(screen.getByRole("button")).toHaveClass("custom-action");
    });

    it("forwards ref to root nav element", () => {
      const ref = React.createRef<HTMLElement>();
      render(
        <BottomNavigation ref={ref} aria-label="Nav">
          <BottomNavigationAction value="a" icon={<HomeIcon />} label="A" />
        </BottomNavigation>,
      );
      expect(ref.current).toBeInstanceOf(HTMLElement);
      expect(ref.current?.tagName).toBe("NAV");
    });

    it("forwards ref to action button", () => {
      const ref = React.createRef<HTMLButtonElement>();
      render(
        <BottomNavigation value="a" aria-label="Nav">
          <BottomNavigationAction ref={ref} value="a" icon={<HomeIcon />} label="A" />
        </BottomNavigation>,
      );
      expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    });
  });

  describe("aria-label", () => {
    it("applies label prop as aria-label on actions", () => {
      renderNav();
      const buttons = screen.getAllByRole("button");
      expect(buttons[0]).toHaveAttribute("aria-label", "Home");
      expect(buttons[1]).toHaveAttribute("aria-label", "Search");
    });
  });

  describe("badge", () => {
    it("renders a badge on an action", () => {
      render(
        <BottomNavigation value="home" aria-label="Nav">
          <BottomNavigationAction
            value="home"
            icon={<HomeIcon />}
            label="Home"
            badge={<span data-testid="badge-count">3</span>}
          />
        </BottomNavigation>,
      );
      expect(screen.getByTestId("badge-count")).toBeInTheDocument();
    });

    it("does not add aria-hidden to the badge wrapper", () => {
      render(
        <BottomNavigation value="home" aria-label="Nav">
          <BottomNavigationAction
            value="home"
            icon={<HomeIcon />}
            label="Home"
            badge={<span data-testid="badge-count">3</span>}
          />
        </BottomNavigation>,
      );
      const badge = screen.getByTestId("badge-count");
      expect(badge.parentElement).not.toHaveAttribute("aria-hidden");
    });
  });

  describe("asChild", () => {
    it("renders as child element when asChild is true", () => {
      render(
        <BottomNavigation value="home" aria-label="Nav">
          <BottomNavigationAction value="home" icon={<HomeIcon />} label="Home" asChild>
            <a href="/home">Home</a>
          </BottomNavigationAction>
        </BottomNavigation>,
      );
      const link = screen.getByRole("link");
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute("href", "/home");
      expect(link).toHaveAttribute("data-state", "active");
    });

    it("renders icon and label inside the slotted child", () => {
      render(
        <BottomNavigation value="home" aria-label="Nav">
          <BottomNavigationAction value="home" icon={<HomeIcon />} label="Home" asChild>
            <a href="/home">Home</a>
          </BottomNavigationAction>
        </BottomNavigation>,
      );
      const link = screen.getByRole("link");
      expect(link.querySelector("svg")).toBeInTheDocument();
      expect(link).toHaveTextContent("Home");
    });

    it("calls onValueChange when asChild action is clicked", async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      render(
        <BottomNavigation value="home" onValueChange={onValueChange} aria-label="Nav">
          <BottomNavigationAction value="search" icon={<SearchIcon />} label="Search" asChild>
            <a href="/search">Search</a>
          </BottomNavigationAction>
        </BottomNavigation>,
      );
      await user.click(screen.getByRole("link"));
      expect(onValueChange).toHaveBeenCalledWith("search");
    });
  });

  describe("hideOnDesktop", () => {
    it("applies md:hidden class when hideOnDesktop is true", () => {
      renderNav({ hideOnDesktop: true });
      expect(screen.getByRole("navigation")).toHaveClass("md:hidden");
    });

    it("does not apply md:hidden class by default", () => {
      renderNav();
      expect(screen.getByRole("navigation")).not.toHaveClass("md:hidden");
    });
  });

  describe("keyboard navigation", () => {
    it("allows tabbing between actions", async () => {
      const user = userEvent.setup();
      renderNav();
      const buttons = screen.getAllByRole("button");
      buttons[0]?.focus();
      expect(buttons[0]).toHaveFocus();
      await user.tab();
      expect(buttons[1]).toHaveFocus();
      await user.tab();
      expect(buttons[2]).toHaveFocus();
    });
  });

  describe("z-index", () => {
    it("uses CSS variable for z-index", () => {
      renderNav();
      const nav = screen.getByRole("navigation");
      expect(nav.style.zIndex).toBe("var(--fanvue-ui-portal-z-index, 50)");
    });
  });

  describe("accessibility", () => {
    it("has no accessibility violations", async () => {
      const { container } = renderNav();
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("marks icon containers as aria-hidden", () => {
      const { container } = renderNav();
      const hiddenIcons = container.querySelectorAll('[aria-hidden="true"]');
      expect(hiddenIcons.length).toBeGreaterThan(0);
    });
  });
});
