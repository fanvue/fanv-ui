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
    it("renders Full type with both icon and wordmark", () => {
      const { container } = render(<Logo type="Full" />);
      const logo = container.querySelector('[data-testid="logo"]');
      const svg = logo?.querySelector("svg");
      const text = logo?.querySelector("span");

      expect(svg).toBeInTheDocument();
      expect(text).toBeInTheDocument();
      expect(text).toHaveTextContent("fanvue");
    });

    it("renders Icon type with only icon", () => {
      const { container } = render(<Logo type="Icon" />);
      const logo = container.querySelector('[data-testid="logo"]');
      const svg = logo?.querySelector("svg");
      const text = logo?.querySelector("span");

      expect(svg).toBeInTheDocument();
      expect(text).not.toBeInTheDocument();
    });

    it("renders Wordmark type with only text", () => {
      const { container } = render(<Logo type="Wordmark" />);
      const logo = container.querySelector('[data-testid="logo"]');
      const svg = logo?.querySelector("svg");
      const text = logo?.querySelector("span");

      expect(svg).not.toBeInTheDocument();
      expect(text).toBeInTheDocument();
      expect(text).toHaveTextContent("fanvue");
    });

    it("renders Portrait type with both icon and wordmark in column", () => {
      const { container } = render(<Logo type="Portrait" />);
      const logo = container.querySelector('[data-testid="logo"]');
      const svg = logo?.querySelector("svg");
      const text = logo?.querySelector("span");

      expect(svg).toBeInTheDocument();
      expect(text).toBeInTheDocument();
      expect(text).toHaveTextContent("fanvue");
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
      const { container } = render(<Logo type="Icon" aria-label="Fanvue home" />);
      const logo = container.querySelector('[data-testid="logo"]');
      expect(logo).toHaveAttribute("aria-label", "Fanvue home");
    });

    it("adds role='img' when aria-label is provided", () => {
      const { container } = render(<Logo type="Icon" aria-label="Fanvue home" />);
      const logo = container.querySelector('[data-testid="logo"]');
      expect(logo).toHaveAttribute("role", "img");
    });

    it("does not add role when aria-label is not provided", () => {
      const { container } = render(<Logo type="Icon" />);
      const logo = container.querySelector('[data-testid="logo"]');
      expect(logo).not.toHaveAttribute("role");
    });

    it("has no accessibility violations with icon-only variant and aria-label", async () => {
      const { container } = render(<Logo type="Icon" aria-label="Fanvue home" />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
