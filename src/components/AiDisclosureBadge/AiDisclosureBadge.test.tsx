import { render, screen } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { AiDisclosureBadge } from "./AiDisclosureBadge";

describe("AiDisclosureBadge", () => {
  const paths = (container: HTMLElement) => [...container.querySelectorAll("path")];

  describe("API", () => {
    it("applies custom className", () => {
      const { container } = render(<AiDisclosureBadge className="custom-class" />);
      expect(container.querySelector("svg")).toHaveClass("custom-class");
    });

    it("has a default size that className can override", () => {
      const { container: base } = render(<AiDisclosureBadge />);
      expect(base.querySelector("svg")).toHaveClass("size-4");

      const { container: sized } = render(<AiDisclosureBadge className="size-10" />);
      expect(sized.querySelector("svg")).toHaveClass("size-10");
    });

    it("forwards ref", () => {
      const ref = createRef<SVGSVGElement>();
      render(<AiDisclosureBadge ref={ref} />);
      expect(ref.current).toBeInstanceOf(SVGSVGElement);
    });
  });

  describe("tones", () => {
    it("paints a dark disc with light glyphs by default", () => {
      const [disc, glyph] = paths(render(<AiDisclosureBadge />).container);
      expect(disc).toHaveClass("fill-buttons-always-black-default");
      expect(glyph).toHaveClass("fill-content-always-white");
    });

    it("swaps disc and glyph colours for the light tone", () => {
      const [disc, glyph] = paths(render(<AiDisclosureBadge tone="light" />).container);
      expect(disc).toHaveClass("fill-buttons-always-white-default");
      expect(glyph).toHaveClass("fill-content-always-black");
    });

    it("uses the half-opacity overlay fill for the transparent tone", () => {
      const [disc, glyph] = paths(render(<AiDisclosureBadge tone="transparent" />).container);
      expect(disc).toHaveClass("fill-background-overlay-default");
      expect(glyph).toHaveClass("fill-content-always-white");
    });

    it("keeps the palette fixed rather than following the inherited text colour", () => {
      const { container } = render(<AiDisclosureBadge />);
      for (const path of paths(container)) {
        expect(path).not.toHaveClass("fill-current");
        expect(path).not.toHaveAttribute("fill");
      }
    });
  });

  describe("accessibility", () => {
    it("is decorative by default", () => {
      const { container } = render(<AiDisclosureBadge />);
      expect(container.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
    });

    it("can be named for standalone use", () => {
      render(<AiDisclosureBadge aria-hidden={false} role="img" aria-label="AI generated" />);
      expect(screen.getByRole("img")).toHaveAccessibleName("AI generated");
    });

    it("has no accessibility violations when named", async () => {
      const { container } = render(
        <AiDisclosureBadge aria-hidden={false} role="img" aria-label="AI generated" />,
      );
      expect(await axe(container)).toHaveNoViolations();
    });
  });
});
