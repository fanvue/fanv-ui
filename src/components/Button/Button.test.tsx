import { render, screen } from "@testing-library/react";
import * as React from "react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { Button } from "./Button";

describe("Button", () => {
  describe("API", () => {
    it("applies custom className", () => {
      render(<Button className="custom-class">Custom</Button>);
      const button = screen.getByRole("button", { name: "Custom" });
      expect(button).toHaveClass("custom-class");
    });

    it("renders as a Slot when asChild is true", () => {
      render(
        <Button asChild>
          <a href="/test">Link Button</a>
        </Button>,
      );
      const link = screen.getByRole("link", { name: /Link Button/i });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute("href", "/test");
    });

    it("forwards ref correctly", () => {
      const ref = React.createRef<HTMLButtonElement>();
      render(<Button ref={ref}>Button</Button>);
      expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    });

    it("applies active state for switch variant", () => {
      render(
        <Button variant="switch" active>
          Active Switch
        </Button>,
      );
      const button = screen.getByRole("button", { name: "Active Switch" });
      expect(button).toHaveAttribute("data-active", "true");
    });

    it("disables button when loading is true", () => {
      render(<Button loading>Loading</Button>);
      const button = screen.getByRole("button");
      expect(button).toBeDisabled();
    });

    it("preserves accessible name when loading", () => {
      render(<Button loading>Submit</Button>);
      const button = screen.getByRole("button", { name: "Submit" });
      expect(button).toHaveAttribute("aria-busy", "true");
    });

    it("disables button when disabled prop is true", () => {
      render(<Button disabled>Disabled</Button>);
      const button = screen.getByRole("button");
      expect(button).toBeDisabled();
    });

    it("shows loading spinner when loading is true", () => {
      const { container } = render(<Button loading>Loading</Button>);
      const spinner = container.querySelector("svg");
      expect(spinner).toBeInTheDocument();
    });

    it("hides icons when loading is true", () => {
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

    it("marks icon elements as aria-hidden", () => {
      const { container } = render(
        <Button leftIcon={<span>icon</span>} rightIcon={<span>icon</span>}>
          Button
        </Button>,
      );
      const hiddenElements = container.querySelectorAll('[aria-hidden="true"]');
      expect(hiddenElements.length).toBeGreaterThanOrEqual(2);
    });

    it("renders discount with strikethrough and price next to button when provided", () => {
      render(
        <Button discount="$19.99" price="$9.99">
          Subscribe
        </Button>,
      );
      expect(screen.getByText("$19.99")).toHaveClass("line-through");
      expect(screen.getByText("$9.99")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Subscribe" })).toBeInTheDocument();
    });

    it("renders only price when discount is not provided", () => {
      render(<Button price="$9.99">Subscribe</Button>);
      expect(screen.getByText("$9.99")).toBeInTheDocument();
      expect(screen.queryByText("$19.99")).not.toBeInTheDocument();
    });

    it("does not nest interactive elements when asChild + loading", () => {
      const { container } = render(
        <Button asChild loading>
          <a href="/test">Link Button</a>
        </Button>,
      );
      const link = container.querySelector("a");
      expect(link).toBeInTheDocument();
      // Should NOT contain a nested sr-only span wrapping the <a>
      expect(container.querySelector(".sr-only")).not.toBeInTheDocument();
      // Should contain the spinner
      expect(container.querySelector("svg")).toBeInTheDocument();
    });

    it("preserves element type and accessible name when asChild + loading", () => {
      render(
        <Button asChild loading>
          <a href="/test">Link Button</a>
        </Button>,
      );
      const link = screen.getByRole("link", { name: "Link Button" });
      expect(link).toHaveAttribute("href", "/test");
      expect(link).toHaveAttribute("aria-busy", "true");
      expect(link).toHaveAttribute("aria-label", "Link Button");
    });

    it("sets aria-disabled when asChild + loading", () => {
      render(
        <Button asChild loading>
          <a href="/test">Link Button</a>
        </Button>,
      );
      const link = screen.getByRole("link", { name: "Link Button" });
      expect(link).toHaveAttribute("aria-disabled", "true");
    });
  });

  describe("accessibility", () => {
    it("has no accessibility violations", async () => {
      const { container } = render(<Button>Accessible Button</Button>);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("has no accessibility violations when disabled", async () => {
      const { container } = render(<Button disabled>Disabled Button</Button>);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("has no accessibility violations with icons", async () => {
      const { container } = render(
        <Button leftIcon={<span>L</span>} rightIcon={<span>R</span>}>
          Button with Icons
        </Button>,
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("has no accessibility violations when loading", async () => {
      const { container } = render(<Button loading>Loading Button</Button>);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("has no accessibility violations when asChild + loading", async () => {
      const { container } = render(
        <Button asChild loading>
          <a href="/test">Link Button</a>
        </Button>,
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("has no accessibility violations with price and discount", async () => {
      const { container } = render(
        <Button discount="$19.99" price="$9.99">
          Subscribe
        </Button>,
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("has no accessibility violations for all variant types", async () => {
      const variants = [
        "primary",
        "secondary",
        "tertiary",
        "link",
        "brand",
        "destructive",
        "white",
        "switch",
        "tertiaryDestructive",
        "text",
      ] as const;

      for (const variant of variants) {
        const { container } = render(<Button variant={variant}>{variant} Button</Button>);
        const results = await axe(container);
        expect(results).toHaveNoViolations();
      }
    });
  });
});
