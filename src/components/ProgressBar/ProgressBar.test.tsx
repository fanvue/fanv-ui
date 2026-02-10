import { render, screen } from "@testing-library/react";
import * as React from "react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { ProgressBar } from "./ProgressBar";

describe("ProgressBar", () => {
  describe("API", () => {
    it("applies custom className", () => {
      const { container } = render(<ProgressBar value={50} className="custom-class" />);
      expect(container.firstChild).toHaveClass("custom-class");
    });

    it("forwards ref correctly", () => {
      const ref = React.createRef<HTMLDivElement>();
      render(<ProgressBar ref={ref} value={50} />);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it("clamps value to 0-100 range", () => {
      const { rerender } = render(<ProgressBar value={150} />);
      expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "100");

      rerender(<ProgressBar value={-10} />);
      expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "0");
    });

    it("renders title when provided", () => {
      render(<ProgressBar value={50} title="Upload Progress" />);
      expect(screen.getByText("Upload Progress")).toBeInTheDocument();
    });

    it("renders completion percentage when showCompletion is true", () => {
      render(<ProgressBar value={75} showCompletion />);
      expect(screen.getByText("75%")).toBeInTheDocument();
    });

    it("clamps completion percentage display", () => {
      render(<ProgressBar value={150} showCompletion />);
      expect(screen.getByText("100%")).toBeInTheDocument();
    });

    it("renders steps label when provided", () => {
      render(<ProgressBar value={50} stepsLabel="4/8 steps" />);
      expect(screen.getByText("4/8 steps")).toBeInTheDocument();
    });

    it("renders helper left content", () => {
      render(<ProgressBar value={50} helperLeft="Uploading..." />);
      expect(screen.getByText("Uploading...")).toBeInTheDocument();
    });

    it("renders helper right content", () => {
      render(<ProgressBar value={50} helperRight="50% complete" />);
      expect(screen.getByText("50% complete")).toBeInTheDocument();
    });

    it("renders left icon", () => {
      render(<ProgressBar value={50} leftIcon={<span data-testid="icon">icon</span>} />);
      expect(screen.getByTestId("icon")).toBeInTheDocument();
    });

    it("does not render header or footer when no props provided", () => {
      const { container } = render(<ProgressBar value={50} />);
      const children = container.firstChild?.childNodes;
      expect(children).toHaveLength(1);
    });

    it("accepts ReactNode for content props", () => {
      render(
        <ProgressBar
          value={50}
          title={<strong>Bold Title</strong>}
          stepsLabel={<em>2/4</em>}
          helperLeft={<span data-testid="helper-left">custom</span>}
          helperRight={<span data-testid="helper-right">custom</span>}
        />,
      );
      expect(screen.getByText("Bold Title")).toBeInTheDocument();
      expect(screen.getByText("2/4")).toBeInTheDocument();
      expect(screen.getByTestId("helper-left")).toBeInTheDocument();
      expect(screen.getByTestId("helper-right")).toBeInTheDocument();
    });
  });

  describe("accessibility", () => {
    it("has no accessibility violations", async () => {
      const { container } = render(<ProgressBar value={50} />);
      expect(await axe(container)).toHaveNoViolations();
    });

    it("has no accessibility violations with all options enabled", async () => {
      const { container } = render(
        <ProgressBar
          value={75}
          title="Progress"
          showCompletion
          stepsLabel="3/4 steps"
          helperLeft="Helper"
          helperRight="75%"
          leftIcon={<span>icon</span>}
        />,
      );
      expect(await axe(container)).toHaveNoViolations();
    });

    it("sets correct aria attributes on progressbar", () => {
      render(<ProgressBar value={60} />);
      const progressbar = screen.getByRole("progressbar");
      expect(progressbar).toHaveAttribute("aria-valuenow", "60");
      expect(progressbar).toHaveAttribute("aria-valuemin", "0");
      expect(progressbar).toHaveAttribute("aria-valuemax", "100");
    });

    it("uses custom ariaLabel when provided", () => {
      render(<ProgressBar value={50} ariaLabel="Fortschritt" />);
      expect(screen.getByRole("progressbar")).toHaveAttribute("aria-label", "Fortschritt");
    });

    it("defaults aria-label to 'Progress'", () => {
      render(<ProgressBar value={50} />);
      expect(screen.getByRole("progressbar")).toHaveAttribute("aria-label", "Progress");
    });

    it("marks left icon as aria-hidden", () => {
      const { container } = render(<ProgressBar value={50} leftIcon={<span>icon</span>} />);
      const iconWrapper = container.querySelector('[aria-hidden="true"]');
      expect(iconWrapper).toBeInTheDocument();
    });
  });
});
