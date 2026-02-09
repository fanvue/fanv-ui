import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { Badge } from "./Badge";

describe("Badge", () => {
  describe("API", () => {
    it("applies custom className", () => {
      render(<Badge className="custom-class">Custom</Badge>);
      const badge = screen.getByText("Custom").closest("span");
      expect(badge).toHaveClass("custom-class");
    });

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

  describe("leftDot behavior", () => {
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

      expect(dot).toBeInTheDocument();

      const badgeHTML = badge?.innerHTML || "";
      const dotIndex = badgeHTML.indexOf('aria-hidden="true"');
      const textIndex = badgeHTML.indexOf("Left Dot");

      expect(dotIndex).toBeGreaterThan(-1);
      expect(textIndex).toBeGreaterThan(-1);
      expect(dotIndex).toBeLessThan(textIndex);
    });

    it("renders correct dot color for dark variant", () => {
      const { container } = render(<Badge variant="dark">Dark</Badge>);
      const dot = container.querySelector('[aria-hidden="true"].rounded-full');
      expect(dot).toHaveClass("bg-body-300");
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
});
