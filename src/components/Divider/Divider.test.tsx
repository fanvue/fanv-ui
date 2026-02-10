import { render, screen } from "@testing-library/react";
import * as React from "react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { Divider } from "./Divider";

describe("Divider", () => {
  describe("API", () => {
    it("applies custom className", () => {
      render(<Divider className="custom" data-testid="divider" />);
      const element = screen.getByTestId("divider");
      expect(element).toHaveClass("custom");
    });

    it("renders horizontal orientation by default", () => {
      render(<Divider data-testid="divider" />);
      const element = screen.getByTestId("divider");
      expect(element).toHaveAttribute("data-orientation", "horizontal");
    });

    it("renders vertical orientation", () => {
      render(<Divider orientation="vertical" data-testid="divider" />);
      const element = screen.getByTestId("divider");
      expect(element).toHaveAttribute("data-orientation", "vertical");
    });

    it("renders as decorative (role=none)", () => {
      render(<Divider data-testid="divider" />);
      const element = screen.getByTestId("divider");
      expect(element).toHaveAttribute("role", "none");
    });

    it("renders text type with custom label", () => {
      render(<Divider label="and" />);
      expect(screen.getByText("and")).toBeInTheDocument();
    });

    it("forwards ref to underlying element", () => {
      const ref = React.createRef<HTMLDivElement>();
      render(<Divider ref={ref} data-testid="divider" />);
      const element = screen.getByTestId("divider");
      expect(ref.current).toBe(element);
    });
  });

  describe("accessibility", () => {
    it("has no accessibility violations", async () => {
      const { container } = render(<Divider />);
      expect(await axe(container)).toHaveNoViolations();
    });

    it("has no accessibility violations with text type", async () => {
      const { container } = render(<Divider label="and" />);
      expect(await axe(container)).toHaveNoViolations();
    });
  });
});
