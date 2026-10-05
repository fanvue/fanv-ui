import { render, screen } from "@testing-library/react";
import * as React from "react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { LiveStatus } from "./LiveStatus";

describe("LiveStatus", () => {
  describe("API", () => {
    it("shows the default label for each variant", () => {
      const { rerender } = render(<LiveStatus />);
      expect(screen.getByText("LIVE")).toBeInTheDocument();
      rerender(<LiveStatus variant="ended" />);
      expect(screen.getByText("LIVE ended")).toBeInTheDocument();
    });

    it("lets children override the label", () => {
      render(<LiveStatus>EN DIRECT</LiveStatus>);
      expect(screen.getByText("EN DIRECT")).toBeInTheDocument();
      expect(screen.queryByText("LIVE")).not.toBeInTheDocument();
    });

    it("hides the dot indicator from assistive tech", () => {
      const { container } = render(<LiveStatus />);
      expect(container.querySelector('[aria-hidden="true"]')).toBeInTheDocument();
    });

    it("applies the live glow only to the live variant", () => {
      const { rerender } = render(<LiveStatus data-testid="status" />);
      expect(screen.getByTestId("status")).toHaveClass("shadow-live-glow");
      rerender(<LiveStatus data-testid="status" variant="ended" />);
      expect(screen.getByTestId("status")).not.toHaveClass("shadow-live-glow");
    });

    it("applies custom className and forwards ref", () => {
      const ref = React.createRef<HTMLSpanElement>();
      render(<LiveStatus ref={ref} className="custom" />);
      expect(ref.current).toHaveClass("custom");
    });
  });

  describe("accessibility", () => {
    it("has no accessibility violations", async () => {
      const { container } = render(
        <div>
          <LiveStatus />
          <LiveStatus variant="ended" />
        </div>,
      );
      expect(await axe(container)).toHaveNoViolations();
    });
  });
});
