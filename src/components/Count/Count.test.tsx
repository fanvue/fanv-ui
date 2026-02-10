import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { Count } from "./Count";

describe("Count", () => {
  describe("API", () => {
    it("applies custom className", () => {
      render(<Count value={5} className="custom-class" />);
      const count = screen.getByText("5");
      expect(count).toHaveClass("custom-class");
    });

    it("renders as a Slot when asChild is true", () => {
      render(
        <Count value={5} asChild>
          <a href="/notifications">5</a>
        </Count>,
      );
      const link = screen.getByRole("link");
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute("href", "/notifications");
    });

    it("forwards ref correctly", () => {
      const ref = { current: null };
      render(<Count value={5} ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLElement);
    });
  });

  describe("value display", () => {
    it("displays values over max as 'max+'", () => {
      render(<Count value={150} max={99} />);
      expect(screen.getByText("99+")).toBeInTheDocument();
    });

    it("displays custom max value correctly", () => {
      render(<Count value={1000} max={500} />);
      expect(screen.getByText("500+")).toBeInTheDocument();
    });

    it("does not render when value is 0", () => {
      const { container } = render(<Count value={0} />);
      expect(container.firstChild).toBeNull();
    });

    it("renders when value is 0 and children are provided", () => {
      render(<Count value={0}>Zero</Count>);
      expect(screen.getByText("Zero")).toBeInTheDocument();
    });

    it("displays custom content when children are provided", () => {
      render(<Count>NEW</Count>);
      expect(screen.getByText("NEW")).toBeInTheDocument();
    });

    it("renders with both value and children (children take precedence)", () => {
      render(<Count value={100}>Custom</Count>);
      expect(screen.getByText("Custom")).toBeInTheDocument();
      expect(screen.queryByText("100")).not.toBeInTheDocument();
    });
  });

  describe("accessibility", () => {
    it("has no accessibility violations", async () => {
      const { container } = render(<Count value={5} />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("has no accessibility violations with custom content", async () => {
      const { container } = render(<Count>NEW</Count>);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("edge cases", () => {
    it("handles negative values gracefully", () => {
      render(<Count value={-5} />);
      expect(screen.getByText("-5")).toBeInTheDocument();
    });

    it("handles very large numbers with max", () => {
      render(<Count value={99999} max={999} />);
      expect(screen.getByText("999+")).toBeInTheDocument();
    });
  });
});
