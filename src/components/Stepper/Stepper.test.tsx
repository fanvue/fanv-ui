import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { Stepper } from "./Stepper";

const STEPS = [
  { title: "Account", description: "Create account" },
  { title: "Profile", description: "Set up profile" },
  { title: "Done", description: "All set" },
];

describe("Stepper", () => {
  describe("API", () => {
    it("applies custom className", () => {
      render(
        <Stepper data-testid="stepper" className="custom-class" activeStep={0} steps={STEPS} />,
      );
      expect(screen.getByTestId("stepper")).toHaveClass("custom-class");
    });

    it("renders all step titles", () => {
      render(<Stepper activeStep={1} steps={STEPS} />);
      expect(screen.getByText("Account")).toBeInTheDocument();
      expect(screen.getByText("Profile")).toBeInTheDocument();
      expect(screen.getByText("Done")).toBeInTheDocument();
    });

    it("marks steps before activeStep as completed", () => {
      const { container } = render(<Stepper activeStep={2} steps={STEPS} />);
      const checkIcons = container.querySelectorAll("svg");
      expect(checkIcons).toHaveLength(2);
    });

    it("renders connector lines between steps", () => {
      const { container } = render(<Stepper activeStep={1} steps={STEPS} />);
      const connectors = container.querySelectorAll('[aria-hidden="true"].h-px');
      expect(connectors).toHaveLength(STEPS.length - 1);
    });

    it("forwards ref", () => {
      const ref = { current: null } as React.RefObject<HTMLDivElement | null>;
      render(<Stepper ref={ref} activeStep={0} steps={STEPS} />);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });

  describe("accessibility", () => {
    it("has no accessibility violations", async () => {
      const { container } = render(<Stepper activeStep={1} steps={STEPS} />);
      expect(await axe(container)).toHaveNoViolations();
    });

    it("has group role with progress label", () => {
      render(<Stepper activeStep={0} steps={STEPS} />);
      const group = screen.getByRole("group", { name: /progress/i });
      expect(group).toBeInTheDocument();
    });
  });
});
