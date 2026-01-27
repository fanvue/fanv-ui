import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { Button } from "./Button";

describe("Button", () => {
  it("renders children correctly", () => {
    render(<Button>Hello World</Button>);
    expect(screen.getByRole("button", { name: "Hello World" })).toBeInTheDocument();
  });

  it("handles click events", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(<Button onClick={handleClick}>Click me</Button>);
    await user.click(screen.getByRole("button"));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("is disabled when disabled prop is true", () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("is disabled when loading", () => {
    render(<Button loading>Loading</Button>);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<Button>Accessible</Button>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  describe("asChild", () => {
    it("renders as a Slot when asChild is true", () => {
      render(
        <Button asChild>
          <a href="/test">Link Button</a>
        </Button>,
      );
      const link = screen.getByRole("link", { name: "Link Button" });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute("href", "/test");
    });

    it("sets aria-disabled on Slot when disabled", () => {
      render(
        <Button asChild disabled>
          <a href="/test">Disabled Link</a>
        </Button>,
      );
      const link = screen.getByRole("link", { name: "Disabled Link" });
      expect(link).toHaveAttribute("aria-disabled", "true");
    });
  });

  describe("icons", () => {
    it("renders left icon when not loading", () => {
      render(<Button leftIcon={<span data-testid="left-icon">L</span>}>With Icon</Button>);
      expect(screen.getByTestId("left-icon")).toBeInTheDocument();
    });

    it("renders right icon when not loading", () => {
      render(<Button rightIcon={<span data-testid="right-icon">R</span>}>With Icon</Button>);
      expect(screen.getByTestId("right-icon")).toBeInTheDocument();
    });

    it("hides icons when loading", () => {
      render(
        <Button
          loading
          leftIcon={<span data-testid="left-icon">L</span>}
          rightIcon={<span data-testid="right-icon">R</span>}
        >
          Loading
        </Button>,
      );
      expect(screen.queryByTestId("left-icon")).not.toBeInTheDocument();
      expect(screen.queryByTestId("right-icon")).not.toBeInTheDocument();
    });
  });

  describe("variants and sizes", () => {
    it("applies fullWidth class when fullWidth is true", () => {
      render(<Button fullWidth>Full Width</Button>);
      expect(screen.getByRole("button")).toHaveClass("w-full");
    });
  });
});
