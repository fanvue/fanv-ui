import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { StepperStep } from "./StepperStep";

describe("StepperStep", () => {
  describe("API", () => {
    it("applies custom className", () => {
      render(<StepperStep data-testid="step" className="custom-class" />);
      expect(screen.getByTestId("step")).toHaveClass("custom-class");
    });

    it("renders step number for active state", () => {
      render(<StepperStep state="active" stepNumber={2} />);
      expect(screen.getByText("2")).toBeInTheDocument();
    });

    it("renders step number for upcoming state", () => {
      render(<StepperStep state="upcoming" stepNumber={3} />);
      expect(screen.getByText("3")).toBeInTheDocument();
    });

    it("renders check icon instead of number for completed state", () => {
      const { container } = render(<StepperStep state="completed" stepNumber={1} />);
      expect(container.querySelector("svg")).toBeInTheDocument();
      expect(screen.queryByText("1")).not.toBeInTheDocument();
    });

    it("renders title when provided", () => {
      render(<StepperStep title="Account" />);
      expect(screen.getByText("Account")).toBeInTheDocument();
    });

    it("renders description when provided", () => {
      render(<StepperStep title="Account" description="Create your account" />);
      expect(screen.getByText("Create your account")).toBeInTheDocument();
    });

    it("does not render labels section when neither title nor description given", () => {
      const { container } = render(
        <StepperStep data-testid="step" state="active" stepNumber={1} />,
      );
      const step = screen.getByTestId("step");
      expect(step.children).toHaveLength(1);
      expect(container.querySelector("span.typography-regular-body-md")).not.toBeInTheDocument();
    });

    it("forwards ref", () => {
      const ref = { current: null } as React.RefObject<HTMLDivElement | null>;
      render(<StepperStep ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });

  describe("accessibility", () => {
    it("has no accessibility violations", async () => {
      const { container } = render(<StepperStep state="active" stepNumber={1} title="Step 1" />);
      expect(await axe(container)).toHaveNoViolations();
    });

    it("marks indicator as aria-hidden", () => {
      const { container } = render(<StepperStep state="active" stepNumber={1} />);
      const indicator = container.querySelector('[aria-hidden="true"]');
      expect(indicator).toBeInTheDocument();
    });
  });
});
