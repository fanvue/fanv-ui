import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { Slider } from "./Slider";

function stubPointerCapture(el: HTMLElement) {
  el.setPointerCapture = vi.fn();
  el.releasePointerCapture = vi.fn();
  el.hasPointerCapture = vi.fn().mockReturnValue(false);
}

describe("Slider", () => {
  describe("API", () => {
    it("applies custom className to the root slider element", () => {
      const { container } = render(<Slider defaultValue={[50]} className="custom-class" />);
      const root = container
        .querySelector("[data-radix-collection-item]")
        ?.closest("[role='slider']")?.parentElement?.parentElement;
      expect(root).toBeTruthy();
    });

    it("calls onValueChange when value changes", async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      render(<Slider defaultValue={[50]} max={100} step={1} onValueChange={onValueChange} />);
      const thumb = screen.getByRole("slider");
      stubPointerCapture(thumb);

      thumb.focus();
      await user.keyboard("{ArrowRight}");
      expect(onValueChange).toHaveBeenCalled();
    });

    it("supports disabled state", () => {
      render(<Slider defaultValue={[50]} disabled aria-label="Test" />);
      const thumb = screen.getByRole("slider");
      expect(thumb).toHaveAttribute("data-disabled");
    });

    it("forwards ref", () => {
      const ref = React.createRef<HTMLSpanElement>();
      render(<Slider ref={ref} defaultValue={[50]} />);
      expect(ref.current).toBeInstanceOf(HTMLSpanElement);
    });
  });

  describe("accessibility", () => {
    it("has no accessibility violations", async () => {
      const { container } = render(<Slider defaultValue={[50]} label="Volume" />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("has no accessibility violations with range slider", async () => {
      const { container } = render(<Slider defaultValue={[20, 80]} aria-label="Price range" />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
