import { render, screen } from "@testing-library/react";
import * as React from "react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { TrendPill } from "./TrendPill";

describe("TrendPill", () => {
  describe("API", () => {
    it("renders the label", () => {
      render(<TrendPill label="$240 vs Jun" trend="positive" />);
      expect(screen.getByText("$240 vs Jun")).toBeInTheDocument();
    });

    it("uses the success surface when positive", () => {
      render(<TrendPill label="up" trend="positive" />);
      expect(screen.getByTestId("pill")).toHaveClass("bg-success-surface", "text-success-content");
    });

    it("uses the error surface when negative", () => {
      render(<TrendPill label="down" trend="negative" />);
      expect(screen.getByTestId("pill")).toHaveClass("bg-error-surface", "text-error-content");
    });

    it("swaps the glyph with the direction", () => {
      const { container, rerender } = render(<TrendPill label="up" trend="positive" />);
      const positiveGlyph = container.querySelector("svg")?.outerHTML;

      rerender(<TrendPill label="down" trend="negative" />);
      expect(container.querySelector("svg")?.outerHTML).not.toBe(positiveGlyph);
    });

    it("forwards ref and spreads HTML attributes", () => {
      const ref = React.createRef<HTMLSpanElement>();
      render(<TrendPill ref={ref} label="up" trend="positive" data-x="y" />);
      expect(ref.current).toBeInstanceOf(HTMLSpanElement);
      expect(screen.getByTestId("pill")).toHaveAttribute("data-x", "y");
    });
  });

  describe("accessibility", () => {
    it("has no accessibility violations", async () => {
      const { container } = render(<TrendPill label="$240 vs Jun" trend="positive" />);
      expect(await axe(container)).toHaveNoViolations();
    });
  });
});
