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

  describe("3D variant", () => {
    it("renders the icon without a wordmark", () => {
      const { container } = render(<Logo variant="3d" />);
      const logo = container.querySelector('[data-testid="logo"]');
      expect(logo?.querySelector('[data-testid="logo-icon"]')).toBeInTheDocument();
      expect(logo?.querySelector('[data-testid="logo-wordmark"]')).not.toBeInTheDocument();
    });

    it("defaults to size 40 like the icon variant", () => {
      const { container } = render(<Logo variant="3d" />);
      expect(container.querySelector('[data-testid="logo-icon"]')).toHaveClass("h-10");
    });

    it("applies the requested size", () => {
      const { container } = render(<Logo variant="3d" size="24" />);
      expect(container.querySelector('[data-testid="logo-icon"]')).toHaveClass("h-6");
    });

    it("supports the 80 size token", () => {
      const { container } = render(<Logo variant="3d" size="80" />);
      expect(container.querySelector('[data-testid="logo-icon"]')).toHaveClass("h-20");
    });

    it("clips the mark to its own box", () => {
      const { container } = render(<Logo variant="3d" />);
      expect(container.querySelector('[data-testid="logo-icon"]')).toHaveClass("overflow-hidden");
    });

    it("casts the green glow beneath the mark", () => {
      const { container } = render(<Logo variant="3d" size="64" />);
      const icon = container.querySelector('[data-testid="logo-icon"]') as HTMLElement;
      expect(icon.style.filter).toContain("rgba(92, 238, 116, 0.08)");
      expect(icon.style.filter).toContain("drop-shadow(0 2.667px 2.667px");
    });

    it("scales the glow up only for the 80 size", () => {
      const { container } = render(<Logo variant="3d" size="80" />);
      const icon = container.querySelector('[data-testid="logo-icon"]') as HTMLElement;
      expect(icon.style.filter).toContain("drop-shadow(0 3.333px 3.333px");
    });

    it("keeps the glow at full strength for the nav's 24px mark", () => {
      const { container } = render(<Logo variant="3d" size="24" />);
      const icon = container.querySelector('[data-testid="logo-icon"]') as HTMLElement;
      expect(icon.style.filter).toContain("drop-shadow(0 2.667px 2.667px");
      expect(icon.style.filter).toContain("drop-shadow(0 40px 9.333px");
    });

    it("keeps Figma's filter region so the top edge stays crisp", () => {
      const { container } = render(<Logo variant="3d" />);
      const filter = container.querySelector("filter");
      expect(filter).toHaveAttribute("x", "10.4884");
      expect(filter).toHaveAttribute("y", "17.6179");
    });

    it("gives each instance its own gradient and filter ids", () => {
      const { container } = render(
        <>
          <Logo variant="3d" />
          <Logo variant="3d" />
        </>,
      );
      const ids = Array.from(container.querySelectorAll("[id]")).map((el) => el.id);
      expect(ids.length).toBeGreaterThan(0);
      expect(new Set(ids).size).toBe(ids.length);
    });

    it("renders the 3D icon regardless of color and version", () => {
      const { container } = render(<Logo variant="3d" color="decolour" version="agencies" />);
      const icon = container.querySelector('[data-testid="logo-icon"]');
      expect(icon?.querySelector("svg")).toBeInTheDocument();
      expect(icon?.querySelector("filter")).toBeInTheDocument();
    });

    it("positions the sheen into the icon's coordinate space", () => {
      const { container } = render(<Logo variant="3d" />);
      const stroke = container.querySelector('path[stroke-width="0.5"]');
      expect(stroke?.closest("g[transform]")).toHaveAttribute(
        "transform",
        "translate(12.709 19.018)",
      );
    });

    it("draws both sheen strokes over the mark", () => {
      const { container } = render(<Logo variant="3d" />);
      const strokes = container.querySelectorAll('path[stroke-width="0.5"]');
      expect(strokes).toHaveLength(2);
      const stops = Array.from(container.querySelectorAll("stop")).map((s) =>
        s.getAttribute("stop-opacity"),
      );
      expect(stops).toEqual(expect.arrayContaining(["0.95", "0.6"]));
    });

    it("has no accessibility violations with an aria-label", async () => {
      const { container } = render(<Logo variant="3d" aria-label="Fanvue home" />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
