import { render, screen } from "@testing-library/react";
import * as React from "react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { Loader } from "./Loader";

describe("Loader", () => {
  describe("API", () => {
    it("renders with default props", () => {
      const { container } = render(<Loader />);
      expect(container.firstElementChild).toBeInTheDocument();
      expect(container.firstElementChild?.tagName).toBe("DIV");
    });

    it("applies custom className", () => {
      const { container } = render(<Loader className="custom" />);
      expect(container.firstElementChild).toHaveClass("custom");
    });

    it("forwards ref correctly", () => {
      const ref = React.createRef<HTMLDivElement>();
      const { container } = render(<Loader ref={ref} />);
      expect(ref.current).toBe(container.firstElementChild);
    });

    it("spreads additional HTML attributes", () => {
      const { container } = render(<Loader data-custom="value" />);
      expect(container.firstElementChild).toHaveAttribute("data-custom", "value");
    });

    it("renders nothing when show is false", () => {
      const { container } = render(<Loader show={false} />);
      expect(container.firstElementChild).toBeNull();
    });

    it("renders when show is true", () => {
      const { container } = render(<Loader show />);
      expect(container.firstElementChild).toBeInTheDocument();
    });

    it("applies default minHeight of 100%", () => {
      const { container } = render(<Loader />);
      expect((container.firstElementChild as HTMLElement).style.minHeight).toBe("100%");
    });

    it("applies minHeight as pixels when given a number", () => {
      const { container } = render(<Loader minHeight={200} />);
      expect((container.firstElementChild as HTMLElement).style.minHeight).toBe("200px");
    });

    it("applies minHeight as string when given a string", () => {
      const { container } = render(<Loader minHeight="50vh" />);
      expect((container.firstElementChild as HTMLElement).style.minHeight).toBe("50vh");
    });

    it("centers horizontally when centerX is true", () => {
      const { container } = render(<Loader centerX />);
      const output = container.querySelector("output");
      expect(output).toHaveClass("left-1/2", "-translate-x-1/2");
    });

    it("centers vertically when centerY is true", () => {
      const { container } = render(<Loader centerY />);
      const output = container.querySelector("output");
      expect(output).toHaveClass("top-1/2", "-translate-y-1/2");
    });

    it("centers both axes when center is true", () => {
      const { container } = render(<Loader center />);
      const output = container.querySelector("output");
      expect(output).toHaveClass("left-1/2", "-translate-x-1/2");
      expect(output).toHaveClass("top-1/2", "-translate-y-1/2");
    });

    it("does not apply centering classes by default", () => {
      const { container } = render(<Loader />);
      const output = container.querySelector("output");
      expect(output).not.toHaveClass("left-1/2");
      expect(output).not.toHaveClass("top-1/2");
    });
  });

  describe("accessibility", () => {
    it("has an accessible label on the output element", () => {
      render(<Loader />);
      expect(screen.getByRole("status")).toHaveAccessibleName("loading");
    });

    it("applies custom aria-label", () => {
      render(<Loader ariaLabel="Please wait" />);
      expect(screen.getByRole("status")).toHaveAccessibleName("Please wait");
    });

    it("has no accessibility violations", async () => {
      const { container } = render(<Loader />);
      expect(await axe(container)).toHaveNoViolations();
    });

    it("has no accessibility violations when centered", async () => {
      const { container } = render(<Loader center minHeight={200} />);
      expect(await axe(container)).toHaveNoViolations();
    });
  });
});
