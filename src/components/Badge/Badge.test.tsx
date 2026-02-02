import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { Badge } from "./Badge";

describe("Badge", () => {
  it("renders children correctly", () => {
    render(<Badge>Test Badge</Badge>);
    expect(screen.getByText("Test Badge")).toBeInTheDocument();
  });

  it("renders with Default type", () => {
    render(<Badge>Default</Badge>);
    const badge = screen.getByText("Default").closest("span");
    expect(badge).toHaveClass("bg-neutral-100");
  });

  it("renders with Dark type", () => {
    render(<Badge type="Dark">Dark</Badge>);
    const badge = screen.getByText("Dark").closest("span");
    expect(badge).toHaveClass("bg-background-800");
    expect(badge).toHaveClass("text-body-300");
  });

  it("renders Dark dot with correct color (white)", () => {
    const { container } = render(<Badge type="Dark">Dark</Badge>);
    const dot = container.querySelector('[aria-hidden="true"].rounded-full');
    expect(dot).toHaveClass("bg-body-300");
  });

  it("renders with Success type", () => {
    render(<Badge type="Success">Success</Badge>);
    const badge = screen.getByText("Success").closest("span");
    expect(badge).toHaveClass("text-neutral-400");
  });

  it("renders with Brand type", () => {
    render(<Badge type="Brand">Brand</Badge>);
    const badge = screen.getByText("Brand").closest("span");
    expect(badge).toHaveClass("bg-brand-green-500");
  });

  it("renders leftDot by default", () => {
    const { container } = render(<Badge>With Dot</Badge>);
    const dot = container.querySelector('[aria-hidden="true"].rounded-full');
    expect(dot).toBeInTheDocument();
  });

  it("hides leftDot when leftDot is false", () => {
    const { container } = render(<Badge leftDot={false}>No Dot</Badge>);
    const dot = container.querySelector('[aria-hidden="true"].rounded-full');
    expect(dot).not.toBeInTheDocument();
  });

  it("renders dot on the left (before text)", () => {
    const { container } = render(<Badge>Left Dot</Badge>);
    const badge = container.querySelector("span");
    const dot = badge?.querySelector('[aria-hidden="true"].rounded-full');

    // Dot should exist and be before the text content in DOM order
    expect(dot).toBeInTheDocument();

    // Get all child nodes of the badge and verify dot appears before text
    const badgeHTML = badge?.innerHTML || "";
    const dotIndex = badgeHTML.indexOf('aria-hidden="true"');
    const textIndex = badgeHTML.indexOf("Left Dot");

    expect(dotIndex).toBeGreaterThan(-1);
    expect(textIndex).toBeGreaterThan(-1);
    expect(dotIndex).toBeLessThan(textIndex);
  });

  it("renders left icon when provided", () => {
    render(
      <Badge leftIcon={<span data-testid="left-icon">L</span>} leftDot={false}>
        With Icon
      </Badge>,
    );
    expect(screen.getByTestId("left-icon")).toBeInTheDocument();
  });

  it("renders right icon when provided", () => {
    render(
      <Badge rightIcon={<span data-testid="right-icon">R</span>} leftDot={false}>
        With Icon
      </Badge>,
    );
    expect(screen.getByTestId("right-icon")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(<Badge className="custom-class">Custom</Badge>);
    const badge = screen.getByText("Custom").closest("span");
    expect(badge).toHaveClass("custom-class");
  });

  describe("asChild", () => {
    it("renders as a Slot when asChild is true", () => {
      render(
        <Badge asChild>
          <a href="/test">Link Badge</a>
        </Badge>,
      );
      const link = screen.getByRole("link", { name: /Link Badge/i });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute("href", "/test");
    });
  });

  describe("accessibility", () => {
    it("has no accessibility violations", async () => {
      const { container } = render(<Badge>Accessible Badge</Badge>);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("marks decorative elements as aria-hidden", () => {
      const { container } = render(
        <Badge leftIcon={<span>icon</span>} rightIcon={<span>icon</span>}>
          Badge
        </Badge>,
      );
      const hiddenElements = container.querySelectorAll('[aria-hidden="true"]');
      // Should have dot + left icon wrapper + right icon wrapper
      expect(hiddenElements.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe("all type variants", () => {
    const types = [
      "Default",
      "Dark",
      "Success",
      "Warning",
      "Error",
      "Special",
      "Info",
      "Online",
      "Brand",
      "Pink",
      "Brand light",
      "Pink light",
    ] as const;

    it.each(types)("renders %s type without errors", (type) => {
      render(<Badge type={type}>{type}</Badge>);
      expect(screen.getByText(type)).toBeInTheDocument();
    });
  });
});
