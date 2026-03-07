import { render, screen } from "@testing-library/react";
import * as React from "react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { Skeleton } from "./Skeleton";

describe("Skeleton", () => {
  describe("API", () => {
    it("renders with default props", () => {
      render(<Skeleton />);
      const el = screen.getByTestId("skeleton");
      expect(el).toBeInTheDocument();
      expect(el.tagName).toBe("SPAN");
    });

    it("applies custom className", () => {
      render(<Skeleton className="custom" />);
      expect(screen.getByTestId("skeleton")).toHaveClass("custom");
    });

    it("forwards ref correctly", () => {
      const ref = React.createRef<HTMLSpanElement>();
      render(<Skeleton ref={ref} />);
      expect(ref.current).toBe(screen.getByTestId("skeleton"));
    });

    it("applies width and height as pixels when given numbers", () => {
      render(<Skeleton width={200} height={40} />);
      const el = screen.getByTestId("skeleton");
      expect(el.style.width).toBe("200px");
      expect(el.style.height).toBe("40px");
    });

    it("applies width and height as strings when given strings", () => {
      render(<Skeleton width="100%" height="2rem" />);
      const el = screen.getByTestId("skeleton");
      expect(el.style.width).toBe("100%");
      expect(el.style.height).toBe("2rem");
    });

    it("renders text variant with rounded corners and vertical margin", () => {
      render(<Skeleton variant="text" />);
      const el = screen.getByTestId("skeleton");
      expect(el).toHaveClass("rounded");
      expect(el).toHaveClass("my-0.5");
    });

    it("renders circular variant with full rounding", () => {
      render(<Skeleton variant="circular" width={40} height={40} />);
      expect(screen.getByTestId("skeleton")).toHaveClass("rounded-full");
    });

    it("renders rectangular variant without rounding", () => {
      render(<Skeleton variant="rectangular" />);
      const el = screen.getByTestId("skeleton");
      expect(el).not.toHaveClass("rounded");
      expect(el).not.toHaveClass("rounded-full");
      expect(el).not.toHaveClass("rounded-lg");
    });

    it("renders rounded variant with large rounding", () => {
      render(<Skeleton variant="rounded" />);
      expect(screen.getByTestId("skeleton")).toHaveClass("rounded-lg");
    });

    it("applies pulse animation by default", () => {
      render(<Skeleton />);
      expect(screen.getByTestId("skeleton")).toHaveClass("animate-pulse");
    });

    it("applies wave animation class", () => {
      render(<Skeleton animation="wave" />);
      const el = screen.getByTestId("skeleton");
      expect(el).toHaveClass("fv-skeleton-wave");
      expect(el).not.toHaveClass("animate-pulse");
    });

    it("disables animation when animation is false", () => {
      render(<Skeleton animation={false} />);
      const el = screen.getByTestId("skeleton");
      expect(el).not.toHaveClass("animate-pulse");
      expect(el).not.toHaveClass("fv-skeleton-wave");
    });

    it("renders children invisibly when provided", () => {
      render(
        <Skeleton>
          <div data-testid="child">Content</div>
        </Skeleton>,
      );
      const el = screen.getByTestId("skeleton");
      expect(el).toHaveClass("relative", "overflow-hidden");
      expect(screen.getByTestId("child")).toBeInTheDocument();
    });

    it("merges custom style with size styles", () => {
      render(<Skeleton width={100} style={{ opacity: 0.5 }} />);
      const el = screen.getByTestId("skeleton");
      expect(el.style.width).toBe("100px");
      expect(el.style.opacity).toBe("0.5");
    });

    it("spreads additional HTML attributes", () => {
      render(<Skeleton data-custom="value" />);
      expect(screen.getByTestId("skeleton")).toHaveAttribute("data-custom", "value");
    });
  });

  describe("accessibility", () => {
    it("has aria-hidden true", () => {
      render(<Skeleton />);
      expect(screen.getByTestId("skeleton")).toHaveAttribute("aria-hidden", "true");
    });

    it("has no accessibility violations", async () => {
      const { container } = render(<Skeleton width={200} height={20} />);
      expect(await axe(container)).toHaveNoViolations();
    });

    it("has no accessibility violations with circular variant", async () => {
      const { container } = render(<Skeleton variant="circular" width={40} height={40} />);
      expect(await axe(container)).toHaveNoViolations();
    });
  });
});
