import { render, screen } from "@testing-library/react";
import * as React from "react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { Button, type ButtonVariant } from "./Button";

const ALL_VARIANTS: ButtonVariant[] = [
  "primary",
  "secondary",
  "tertiary",
  "outline",
  "upsell",
  "error",
  "ai",
  "alwaysWhite",
  "alwaysBlack",
];

describe("ButtonV2", () => {
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

    it("disables button when loading is true", () => {
      render(<Button loading>Loading</Button>);
      expect(screen.getByRole("button")).toBeDisabled();
    });

    it("preserves accessible name when loading", () => {
      render(<Button loading>Submit</Button>);
      const button = screen.getByRole("button", { name: "Submit" });
      expect(button).toHaveAttribute("aria-busy", "true");
    });

    it("disables button when disabled prop is true", () => {
      render(<Button disabled>Disabled</Button>);
      expect(screen.getByRole("button")).toBeDisabled();
    });

    it("shows loading spinner when loading is true", () => {
      const { container } = render(<Button loading>Loading</Button>);
      expect(container.querySelector("svg")).toBeInTheDocument();
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

    it("does not nest interactive elements when asChild + loading", () => {
      const { container } = render(
        <Button asChild loading>
          <a href="/test">Link Button</a>
        </Button>,
      );
      expect(container.querySelector("a")).toBeInTheDocument();
      expect(container.querySelector(".sr-only")).not.toBeInTheDocument();
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

  describe("variants", () => {
    it.each(ALL_VARIANTS)("renders the %s variant", (variant) => {
      render(<Button variant={variant}>Label</Button>);
      expect(screen.getByRole("button", { name: "Label" })).toBeInTheDocument();
    });

    it("applies negative styling to negative-aware variants", () => {
      render(
        <Button variant="primary" negative>
          Label
        </Button>,
      );
      const button = screen.getByRole("button", { name: "Label" });
      expect(button.className).toContain("buttons-primary-negative-default");
    });

    it("ignores negative on variants that do not support it", () => {
      render(
        <Button variant="error" negative>
          Label
        </Button>,
      );
      const button = screen.getByRole("button", { name: "Label" });
      expect(button.className).toContain("buttons-error-default");
      expect(button.className).not.toContain("negative");
    });

    it("applies disabled styling that overrides variant colour", () => {
      render(
        <Button variant="primary" disabled>
          Label
        </Button>,
      );
      const button = screen.getByRole("button", { name: "Label" });
      expect(button.className).toContain("buttons-disabled-default");
      expect(button.className).toContain("text-content-disabled");
    });

    it("applies negative-disabled styling for negative-aware variants", () => {
      render(
        <Button variant="outline" negative disabled>
          Label
        </Button>,
      );
      const button = screen.getByRole("button", { name: "Label" });
      expect(button.className).toContain("border-buttons-disabled-negative");
      expect(button.className).toContain("text-content-disabled");
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

    it.each(ALL_VARIANTS)("has no accessibility violations for the %s variant", async (variant) => {
      const { container } = render(<Button variant={variant}>{variant} Button</Button>);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
