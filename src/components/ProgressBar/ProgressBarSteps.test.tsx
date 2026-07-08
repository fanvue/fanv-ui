import { render, screen } from "@testing-library/react";
import * as React from "react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { ProgressBarItem } from "./ProgressBarItem";
import { ProgressBarSteps } from "./ProgressBarSteps";

describe("ProgressBarSteps", () => {
  describe("API", () => {
    it("renders one segment per step", () => {
      const { container } = render(<ProgressBarSteps steps={5} value={2} />);
      const track = screen.getByRole("progressbar");
      expect(track.childElementCount).toBe(5);
      expect(container).toBeTruthy();
    });

    it("clamps value to the 0-steps range", () => {
      const { rerender } = render(<ProgressBarSteps steps={4} value={10} />);
      expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "4");

      rerender(<ProgressBarSteps steps={4} value={-2} />);
      expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "0");
    });

    it("treats a steps count below 1 as a single step", () => {
      render(<ProgressBarSteps steps={0} value={0} />);
      expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuemax", "1");
    });

    it("forwards ref correctly", () => {
      const ref = React.createRef<HTMLDivElement>();
      render(<ProgressBarSteps ref={ref} steps={3} value={1} />);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it("applies custom className", () => {
      const { container } = render(
        <ProgressBarSteps steps={3} value={1} className="custom-class" />,
      );
      expect(container.firstChild).toHaveClass("custom-class");
    });
  });

  describe("accessibility", () => {
    it("sets progressbar aria attributes", () => {
      render(<ProgressBarSteps steps={4} value={2} ariaValueText="Step 2 of 4" />);
      const track = screen.getByRole("progressbar");
      expect(track).toHaveAttribute("aria-valuemin", "0");
      expect(track).toHaveAttribute("aria-valuemax", "4");
      expect(track).toHaveAttribute("aria-valuenow", "2");
      expect(track).toHaveAttribute("aria-valuetext", "Step 2 of 4");
    });

    it("uses a custom ariaLabel when provided", () => {
      render(<ProgressBarSteps steps={4} value={2} ariaLabel="Onboarding" />);
      expect(screen.getByRole("progressbar")).toHaveAttribute("aria-label", "Onboarding");
    });

    it("has no accessibility violations", async () => {
      const { container } = render(<ProgressBarSteps steps={4} value={2} />);
      expect(await axe(container)).toHaveNoViolations();
    });
  });
});

describe("ProgressBarItem", () => {
  it("forwards ref and applies custom className", () => {
    const ref = React.createRef<HTMLDivElement>();
    const { container } = render(<ProgressBarItem ref={ref} active className="custom-item" />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(container.firstChild).toHaveClass("custom-item");
  });

  it("uses the active colour when active and the inactive colour otherwise", () => {
    const { container, rerender } = render(<ProgressBarItem active variant="brand" />);
    expect(container.firstChild).toHaveClass("bg-progress-bar-brand-active");

    rerender(<ProgressBarItem variant="brand" />);
    expect(container.firstChild).toHaveClass("bg-progress-bar-brand-inactive");
  });
});
