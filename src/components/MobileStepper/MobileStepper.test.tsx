import { render, screen } from "@testing-library/react";
import * as React from "react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { MobileStepper } from "./MobileStepper";

describe("MobileStepper", () => {
  describe("API", () => {
    it("applies custom className", () => {
      const { container } = render(<MobileStepper steps={5} activeStep={0} className="custom" />);
      expect(container.firstChild).toHaveClass("custom");
    });

    it("forwards ref correctly", () => {
      const ref = React.createRef<HTMLElement>();
      render(<MobileStepper ref={ref} steps={5} activeStep={0} />);
      expect(ref.current).toBeInstanceOf(HTMLElement);
    });

    it("renders back and next button slots", () => {
      render(
        <MobileStepper
          steps={5}
          activeStep={2}
          backButton={<button type="button">Back</button>}
          nextButton={<button type="button">Next</button>}
        />,
      );
      expect(screen.getByRole("button", { name: "Back" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Next" })).toBeInTheDocument();
    });

    it("does not render button wrappers when slots are omitted", () => {
      const { container } = render(<MobileStepper steps={5} activeStep={0} />);
      const children = container.firstChild?.childNodes;
      expect(children).toHaveLength(1);
    });

    it("clamps activeStep to valid range (lower bound)", () => {
      render(<MobileStepper steps={5} activeStep={-3} variant="text" />);
      expect(screen.getByRole("status")).toHaveTextContent("1 / 5");
    });

    it("clamps activeStep to valid range (upper bound)", () => {
      render(<MobileStepper steps={5} activeStep={99} variant="text" />);
      expect(screen.getByRole("status")).toHaveTextContent("5 / 5");
    });

    it("applies bottom position styling", () => {
      const { container } = render(<MobileStepper steps={5} activeStep={0} position="bottom" />);
      expect(container.firstChild).toHaveClass("fixed");
      expect(container.firstChild).toHaveClass("bottom-0");
    });

    it("defaults to static position", () => {
      const { container } = render(<MobileStepper steps={5} activeStep={0} />);
      expect(container.firstChild).not.toHaveClass("fixed");
    });

    it("spreads additional HTML attributes", () => {
      render(<MobileStepper steps={3} activeStep={0} data-testid="stepper" />);
      expect(screen.getByTestId("stepper")).toBeInTheDocument();
    });
  });

  describe("wrapper element", () => {
    it("renders a nav when buttons are present", () => {
      render(
        <MobileStepper
          steps={5}
          activeStep={0}
          backButton={<button type="button">Back</button>}
          nextButton={<button type="button">Next</button>}
        />,
      );
      expect(screen.getByRole("navigation")).toBeInTheDocument();
    });

    it("renders a fieldset when no buttons are present", () => {
      const { container } = render(<MobileStepper steps={5} activeStep={0} />);
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper.tagName).toBe("FIELDSET");
      expect(wrapper).toHaveAttribute("aria-label", "Progress");
    });

    it("renders a nav when only backButton is present", () => {
      render(
        <MobileStepper steps={5} activeStep={0} backButton={<button type="button">Back</button>} />,
      );
      expect(screen.getByRole("navigation")).toBeInTheDocument();
    });
  });

  describe("dots variant", () => {
    it("renders a dot for each step", () => {
      const { container } = render(<MobileStepper steps={6} activeStep={0} variant="dots" />);
      const dots = container.querySelectorAll('[aria-hidden="true"]');
      expect(dots).toHaveLength(6);
    });

    it("marks the active dot with data-state=active", () => {
      const { container } = render(<MobileStepper steps={4} activeStep={2} variant="dots" />);
      const dots = container.querySelectorAll('[aria-hidden="true"]');
      expect(dots[2]).toHaveAttribute("data-state", "active");
    });

    it("marks completed dots with data-state=completed", () => {
      const { container } = render(<MobileStepper steps={4} activeStep={2} variant="dots" />);
      const dots = container.querySelectorAll('[aria-hidden="true"]');
      expect(dots[0]).toHaveAttribute("data-state", "completed");
      expect(dots[1]).toHaveAttribute("data-state", "completed");
    });

    it("marks future dots with data-state=incomplete", () => {
      const { container } = render(<MobileStepper steps={4} activeStep={2} variant="dots" />);
      const dots = container.querySelectorAll('[aria-hidden="true"]');
      expect(dots[3]).toHaveAttribute("data-state", "incomplete");
    });

    it("sets data-state on dots", () => {
      const { container } = render(<MobileStepper steps={4} activeStep={2} variant="dots" />);
      const dots = container.querySelectorAll('[aria-hidden="true"]');
      expect(dots[0]).toHaveAttribute("data-state", "completed");
      expect(dots[1]).toHaveAttribute("data-state", "completed");
      expect(dots[2]).toHaveAttribute("data-state", "active");
      expect(dots[3]).toHaveAttribute("data-state", "incomplete");
    });

    it("has progressbar role with correct aria values", () => {
      render(<MobileStepper steps={5} activeStep={2} variant="dots" />);
      const progressbar = screen.getByRole("progressbar");
      expect(progressbar).toHaveAttribute("aria-valuenow", "3");
      expect(progressbar).toHaveAttribute("aria-valuemin", "1");
      expect(progressbar).toHaveAttribute("aria-valuemax", "5");
    });

    it("has aria-valuetext on the progressbar", () => {
      render(<MobileStepper steps={5} activeStep={2} variant="dots" />);
      const progressbar = screen.getByRole("progressbar");
      expect(progressbar).toHaveAttribute("aria-valuetext", "Step 3 of 5");
    });

    it("wraps indicator in an output with aria-live", () => {
      render(<MobileStepper steps={5} activeStep={2} variant="dots" />);
      expect(screen.getByRole("status")).toBeInTheDocument();
    });
  });

  describe("progress variant", () => {
    it("renders a progress bar", () => {
      render(<MobileStepper steps={5} activeStep={2} variant="progress" />);
      expect(screen.getByRole("progressbar")).toBeInTheDocument();
    });

    it("calculates correct progress value", () => {
      render(<MobileStepper steps={5} activeStep={2} variant="progress" />);
      const progressbar = screen.getByRole("progressbar");
      expect(progressbar).toHaveAttribute("aria-valuenow", "50");
    });

    it("shows 0% at first step", () => {
      render(<MobileStepper steps={5} activeStep={0} variant="progress" />);
      const progressbar = screen.getByRole("progressbar");
      expect(progressbar).toHaveAttribute("aria-valuenow", "0");
    });

    it("shows 100% at last step", () => {
      render(<MobileStepper steps={5} activeStep={4} variant="progress" />);
      const progressbar = screen.getByRole("progressbar");
      expect(progressbar).toHaveAttribute("aria-valuenow", "100");
    });

    it("shows 100% for a single step", () => {
      render(<MobileStepper steps={1} activeStep={0} variant="progress" />);
      const progressbar = screen.getByRole("progressbar");
      expect(progressbar).toHaveAttribute("aria-valuenow", "100");
    });

    it("wraps indicator in an output with aria-live", () => {
      render(<MobileStepper steps={5} activeStep={2} variant="progress" />);
      expect(screen.getByRole("status")).toBeInTheDocument();
    });

    it("passes aria-valuetext to the progress bar", () => {
      render(<MobileStepper steps={5} activeStep={2} variant="progress" />);
      const progressbar = screen.getByRole("progressbar");
      expect(progressbar).toHaveAttribute("aria-valuetext", "Step 3 of 5");
    });
  });

  describe("text variant", () => {
    it("renders step text with default format", () => {
      render(<MobileStepper steps={5} activeStep={2} variant="text" />);
      expect(screen.getByRole("status")).toHaveTextContent("3 / 5");
    });

    it("uses 1-indexed display for active step", () => {
      render(<MobileStepper steps={3} activeStep={0} variant="text" />);
      expect(screen.getByRole("status")).toHaveTextContent("1 / 3");
    });

    it("accepts custom formatText function", () => {
      render(
        <MobileStepper
          steps={8}
          activeStep={3}
          variant="text"
          formatText={(active, total) => `Step ${active} of ${total}`}
        />,
      );
      expect(screen.getByRole("status")).toHaveTextContent("Step 4 of 8");
    });

    it("has aria-live for screen reader announcements", () => {
      render(<MobileStepper steps={5} activeStep={2} variant="text" />);
      expect(screen.getByRole("status")).toHaveAttribute("aria-live", "polite");
    });
  });

  describe("edge cases", () => {
    it("handles steps=0 without crashing", () => {
      const { container } = render(<MobileStepper steps={0} activeStep={0} variant="dots" />);
      const dots = container.querySelectorAll('[aria-hidden="true"]');
      expect(dots).toHaveLength(1);
    });

    it("handles steps=0 with text variant", () => {
      render(<MobileStepper steps={0} activeStep={0} variant="text" />);
      expect(screen.getByRole("status")).toHaveTextContent("1 / 1");
    });

    it("handles steps=0 with progress variant", () => {
      render(<MobileStepper steps={0} activeStep={0} variant="progress" />);
      const progressbar = screen.getByRole("progressbar");
      expect(progressbar).toHaveAttribute("aria-valuenow", "100");
    });

    it("handles negative steps", () => {
      render(<MobileStepper steps={-5} activeStep={0} variant="text" />);
      expect(screen.getByRole("status")).toHaveTextContent("1 / 1");
    });
  });

  describe("accessibility", () => {
    it("has no violations (dots variant)", async () => {
      const { container } = render(
        <MobileStepper
          steps={5}
          activeStep={2}
          variant="dots"
          backButton={<button type="button">Back</button>}
          nextButton={<button type="button">Next</button>}
        />,
      );
      expect(await axe(container)).toHaveNoViolations();
    });

    it("has no violations (progress variant)", async () => {
      const { container } = render(
        <MobileStepper
          steps={5}
          activeStep={2}
          variant="progress"
          backButton={<button type="button">Back</button>}
          nextButton={<button type="button">Next</button>}
        />,
      );
      expect(await axe(container)).toHaveNoViolations();
    });

    it("has no violations (text variant)", async () => {
      const { container } = render(
        <MobileStepper
          steps={5}
          activeStep={2}
          variant="text"
          backButton={<button type="button">Back</button>}
          nextButton={<button type="button">Next</button>}
        />,
      );
      expect(await axe(container)).toHaveNoViolations();
    });

    it("has no violations (no buttons)", async () => {
      const { container } = render(<MobileStepper steps={5} activeStep={2} variant="dots" />);
      expect(await axe(container)).toHaveNoViolations();
    });

    it("uses custom ariaLabel", () => {
      render(
        <MobileStepper
          steps={5}
          activeStep={0}
          ariaLabel="Fortschritt"
          backButton={<button type="button">Back</button>}
        />,
      );
      expect(screen.getByRole("navigation")).toHaveAttribute("aria-label", "Fortschritt");
    });

    it("defaults aria-label to Progress", () => {
      render(
        <MobileStepper steps={5} activeStep={0} backButton={<button type="button">Back</button>} />,
      );
      expect(screen.getByRole("navigation")).toHaveAttribute("aria-label", "Progress");
    });

    it("does not duplicate aria-label between nav and progressbar", () => {
      render(
        <MobileStepper
          steps={5}
          activeStep={2}
          variant="dots"
          backButton={<button type="button">Back</button>}
        />,
      );
      const nav = screen.getByRole("navigation");
      const progressbar = screen.getByRole("progressbar");
      expect(nav).toHaveAttribute("aria-label", "Progress");
      expect(progressbar).toHaveAttribute("aria-label", "Step progress");
    });

    it("uses custom stepProgressLabel on dots variant", () => {
      render(
        <MobileStepper
          steps={5}
          activeStep={2}
          variant="dots"
          stepProgressLabel="Schrittfortschritt"
        />,
      );
      const progressbar = screen.getByRole("progressbar");
      expect(progressbar).toHaveAttribute("aria-label", "Schrittfortschritt");
    });

    it("uses custom stepProgressLabel on progress variant", () => {
      render(
        <MobileStepper
          steps={5}
          activeStep={2}
          variant="progress"
          stepProgressLabel="Schrittfortschritt"
        />,
      );
      const progressbar = screen.getByRole("progressbar");
      expect(progressbar).toHaveAttribute("aria-label", "Schrittfortschritt");
    });

    it("uses custom formatStepLabel for aria-valuetext", () => {
      render(
        <MobileStepper
          steps={5}
          activeStep={2}
          variant="dots"
          formatStepLabel={(active, total) => `Schritt ${active} von ${total}`}
        />,
      );
      const progressbar = screen.getByRole("progressbar");
      expect(progressbar).toHaveAttribute("aria-valuetext", "Schritt 3 von 5");
    });
  });
});
