import { render, screen } from "@testing-library/react";
import * as React from "react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { Skeleton } from "./Skeleton";

const getSkeleton = (container: HTMLElement) => container.firstElementChild as HTMLElement;

describe("Skeleton", () => {
  describe("API", () => {
    it("renders with default props", () => {
      const { container } = render(<Skeleton />);
      const el = getSkeleton(container);
      expect(el).toBeInTheDocument();
      expect(el.tagName).toBe("SPAN");
    });

    it("applies custom className", () => {
      const { container } = render(<Skeleton className="custom" />);
      expect(getSkeleton(container)).toHaveClass("custom");
    });

    it("forwards ref correctly", () => {
      const ref = React.createRef<HTMLSpanElement>();
      const { container } = render(<Skeleton ref={ref} />);
      expect(ref.current).toBe(getSkeleton(container));
    });

    it("applies width and height as pixels when given numbers", () => {
      const { container } = render(<Skeleton width={200} height={40} />);
      const el = getSkeleton(container);
      expect(el.style.width).toBe("200px");
      expect(el.style.height).toBe("40px");
    });

    it("applies width and height as strings when given strings", () => {
      const { container } = render(<Skeleton width="100%" height="2rem" />);
      const el = getSkeleton(container);
      expect(el.style.width).toBe("100%");
      expect(el.style.height).toBe("2rem");
    });

    it("renders text variant with rounded corners and vertical margin", () => {
      const { container } = render(<Skeleton variant="text" />);
      const el = getSkeleton(container);
      expect(el).toHaveClass("rounded");
      expect(el).toHaveClass("my-0.5");
    });

    it("renders circular variant with full rounding", () => {
      const { container } = render(<Skeleton variant="circular" width={40} height={40} />);
      expect(getSkeleton(container)).toHaveClass("rounded-full");
    });

    it("renders rectangular variant without rounding", () => {
      const { container } = render(<Skeleton variant="rectangular" />);
      const el = getSkeleton(container);
      expect(el).not.toHaveClass("rounded");
      expect(el).not.toHaveClass("rounded-full");
      expect(el).not.toHaveClass("rounded-lg");
    });

    it("renders rounded variant with large rounding", () => {
      const { container } = render(<Skeleton variant="rounded" />);
      expect(getSkeleton(container)).toHaveClass("rounded-lg");
    });

    it("applies pulse animation by default", () => {
      const { container } = render(<Skeleton />);
      expect(getSkeleton(container)).toHaveClass("animate-pulse");
    });

    it("applies wave animation class", () => {
      const { container } = render(<Skeleton animation="wave" />);
      const el = getSkeleton(container);
      expect(el).toHaveClass("fv-skeleton-wave");
      expect(el).not.toHaveClass("animate-pulse");
    });

    it("disables animation when animation is false", () => {
      const { container } = render(<Skeleton animation={false} />);
      const el = getSkeleton(container);
      expect(el).not.toHaveClass("animate-pulse");
      expect(el).not.toHaveClass("fv-skeleton-wave");
    });

    it("renders children invisibly when provided", () => {
      render(
        <Skeleton>
          <div data-testid="child">Content</div>
        </Skeleton>,
      );
      expect(screen.getByTestId("child")).toBeInTheDocument();
      expect(screen.getByTestId("child").parentElement).toHaveClass("relative", "overflow-hidden");
    });

    it("merges custom style with size styles", () => {
      const { container } = render(<Skeleton width={100} style={{ opacity: 0.5 }} />);
      const el = getSkeleton(container);
      expect(el.style.width).toBe("100px");
      expect(el.style.opacity).toBe("0.5");
    });

    it("spreads additional HTML attributes", () => {
      const { container } = render(<Skeleton data-custom="value" />);
      expect(getSkeleton(container)).toHaveAttribute("data-custom", "value");
    });

    it("applies default 1em height for text variant without explicit height", () => {
      const { container } = render(<Skeleton variant="text" />);
      expect(getSkeleton(container)).toHaveClass("h-[1em]");
    });

    it("does not apply default height for text variant when height is provided", () => {
      const { container } = render(<Skeleton variant="text" height={24} />);
      expect(getSkeleton(container)).not.toHaveClass("h-[1em]");
    });

    it("does not apply default height for text variant when children are provided", () => {
      const { container } = render(
        <Skeleton variant="text">
          <span>child</span>
        </Skeleton>,
      );
      expect(getSkeleton(container)).not.toHaveClass("h-[1em]");
    });

    it("has an opaque background using color-mix", () => {
      const { container } = render(<Skeleton />);
      expect(getSkeleton(container).className).toContain("bg-[color-mix(");
    });
  });

  describe("accessibility", () => {
    it("has aria-hidden true", () => {
      const { container } = render(<Skeleton />);
      expect(getSkeleton(container)).toHaveAttribute("aria-hidden", "true");
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
