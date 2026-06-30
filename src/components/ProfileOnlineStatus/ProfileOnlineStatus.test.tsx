import { render, screen } from "@testing-library/react";
import * as React from "react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { ProfileOnlineStatus } from "./ProfileOnlineStatus";

describe("ProfileOnlineStatus", () => {
  describe("API", () => {
    it("renders the default label", () => {
      render(<ProfileOnlineStatus />);
      expect(screen.getByText("Online")).toBeInTheDocument();
    });

    it("renders a custom label", () => {
      render(<ProfileOnlineStatus label="Active now" />);
      expect(screen.getByText("Active now")).toBeInTheDocument();
    });

    it("renders a decorative pulsing indicator", () => {
      const { container } = render(<ProfileOnlineStatus />);
      expect(container.querySelector(".animate-ping")).toBeInTheDocument();
    });

    it("applies custom className", () => {
      render(<ProfileOnlineStatus data-testid="status" className="custom" />);
      expect(screen.getByTestId("status")).toHaveClass("custom");
    });

    it("spreads additional HTML attributes", () => {
      render(<ProfileOnlineStatus data-testid="status" data-custom="x" />);
      expect(screen.getByTestId("status")).toHaveAttribute("data-custom", "x");
    });

    it("forwards ref to the root element", () => {
      const ref = React.createRef<HTMLSpanElement>();
      render(<ProfileOnlineStatus ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLSpanElement);
    });
  });

  describe("accessibility", () => {
    it("has no accessibility violations", async () => {
      const { container } = render(<ProfileOnlineStatus />);
      expect(await axe(container)).toHaveNoViolations();
    });
  });
});
