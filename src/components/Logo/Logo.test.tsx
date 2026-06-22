import { render } from "@testing-library/react";
import * as React from "react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { Logo } from "./Logo";

describe("Logo", () => {
  describe("API", () => {
    it("applies custom className", () => {
      const { container } = render(<Logo className="custom-class" />);
      const logo = container.querySelector('[data-testid="logo"]');
      expect(logo).toHaveClass("custom-class");
    });

    it("forwards ref correctly", () => {
      const ref = React.createRef<HTMLDivElement>();
      render(<Logo ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });

  describe("Type variants", () => {
    it("renders full type with both icon and wordmark", () => {
      const { container } = render(<Logo variant="full" />);
      const logo = container.querySelector('[data-testid="logo"]');
      const svg = logo?.querySelector('[data-testid="logo-icon"]');
      const text = logo?.querySelector('[data-testid="logo-wordmark"]');

      expect(svg).toBeInTheDocument();
      expect(text).toBeInTheDocument();
    });

    it("renders icon type with only icon", () => {
      const { container } = render(<Logo variant="icon" />);
      const logo = container.querySelector('[data-testid="logo"]');
      const svg = logo?.querySelector("svg");
      const text = logo?.querySelector("span");

      expect(svg).toBeInTheDocument();
      expect(text).not.toBeInTheDocument();
    });

    it("renders wordmark type with only text", () => {
      const { container } = render(<Logo variant="wordmark" />);
      const logo = container.querySelector('[data-testid="logo"]');
      const svg = logo?.querySelector('[data-testid="logo-icon"]');
      const text = logo?.querySelector('[data-testid="logo-wordmark"]');

      expect(svg).not.toBeInTheDocument();
      expect(text).toBeInTheDocument();
    });

    it("applies size class to both icon and wordmark", () => {
      const { container } = render(<Logo variant="full" size="48" />);
      const icon = container.querySelector('[data-testid="logo-icon"]');
      const wordmark = container.querySelector('[data-testid="logo-wordmark"]');

      expect(icon).toHaveClass("h-12");
      expect(wordmark).toHaveClass("h-12");
    });

    it("defaults to size 32 for full variant", () => {
      const { container } = render(<Logo />);
      const icon = container.querySelector('[data-testid="logo-icon"]');
      expect(icon).toHaveClass("h-8");
    });

    it("defaults to size 40 for icon variant", () => {
      const { container } = render(<Logo variant="icon" />);
      const icon = container.querySelector('[data-testid="logo-icon"]');
      expect(icon).toHaveClass("h-10");
    });

    it("renders agencies version with icon, wordmark and AGENCIES label", () => {
      const { container } = render(<Logo version="agencies" />);
      const logo = container.querySelector('[data-testid="logo"]');
      const icon = logo?.querySelector('[data-testid="logo-icon"]');
      const wordmark = logo?.querySelector('[data-testid="logo-wordmark"]');

      expect(icon).toBeInTheDocument();
      expect(wordmark).toBeInTheDocument();
      expect(logo).toHaveTextContent("AGENCIES");
    });

    it("renders agencies icon-only with no wordmark or label", () => {
      const { container } = render(<Logo variant="icon" version="agencies" />);
      const logo = container.querySelector('[data-testid="logo"]');
      expect(logo?.querySelector('[data-testid="logo-icon"]')).toBeInTheDocument();
      expect(logo?.querySelector('[data-testid="logo-wordmark"]')).not.toBeInTheDocument();
      expect(logo).not.toHaveTextContent("AGENCIES");
    });

    it("uses the flat monochrome icon for agencies decolour", () => {
      const { container } = render(<Logo version="agencies" color="decolour" />);
      const icon = container.querySelector('[data-testid="logo-icon"]');
      expect(icon?.tagName.toLowerCase()).toBe("svg");
      expect(icon?.querySelector("path")?.getAttribute("class")).toContain("fill-[#151515]");
    });

    it("namespaces glossy icon ids so two logos on a page don't collide", () => {
      const { container } = render(
        <>
          <Logo version="agencies" />
          <Logo version="agencies" />
        </>,
      );
      const ids = Array.from(container.querySelectorAll('[data-testid="logo-icon"]')).map(
        (icon) => icon.querySelector("linearGradient")?.id,
      );
      expect(ids[0]).toBeTruthy();
      expect(ids[0]).not.toBe(ids[1]);
    });

    it("renders portrait type with both icon and wordmark in column", () => {
      const { container } = render(<Logo variant="portrait" />);
      const logo = container.querySelector('[data-testid="logo"]');
      const svg = logo?.querySelector('[data-testid="logo-icon"]');
      const text = logo?.querySelector('[data-testid="logo-wordmark"]');

      expect(svg).toBeInTheDocument();
      expect(text).toBeInTheDocument();
      expect(logo).toHaveClass("flex-col");
    });
  });

  describe("accessibility", () => {
    it("has no accessibility violations", async () => {
      const { container } = render(<Logo />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("marks icon as aria-hidden", () => {
      const { container } = render(<Logo />);
      const svg = container.querySelector("svg");
      expect(svg).toHaveAttribute("aria-hidden", "true");
    });

    it("supports aria-label for icon-only variant", () => {
      const { container } = render(<Logo variant="icon" aria-label="Fanvue home" />);
      const logo = container.querySelector('[data-testid="logo"]');
      expect(logo).toHaveAttribute("aria-label", "Fanvue home");
    });

    it("adds role='img' when aria-label is provided", () => {
      const { container } = render(<Logo variant="icon" aria-label="Fanvue home" />);
      const logo = container.querySelector('[data-testid="logo"]');
      expect(logo).toHaveAttribute("role", "img");
    });

    it("does not add role when aria-label is not provided", () => {
      const { container } = render(<Logo variant="icon" />);
      const logo = container.querySelector('[data-testid="logo"]');
      expect(logo).not.toHaveAttribute("role");
    });

    it("has no accessibility violations with icon-only variant and aria-label", async () => {
      const { container } = render(<Logo variant="icon" aria-label="Fanvue home" />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("has no accessibility violations for agencies version", async () => {
      const { container } = render(<Logo version="agencies" />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
