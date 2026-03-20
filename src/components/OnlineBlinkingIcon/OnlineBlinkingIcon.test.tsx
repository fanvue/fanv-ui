import { render, screen } from "@testing-library/react";
import * as React from "react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { OnlineBlinkingIcon } from "./OnlineBlinkingIcon";

describe("OnlineBlinkingIcon", () => {
  describe("API", () => {
    it("renders without errors", () => {
      const { container } = render(<OnlineBlinkingIcon />);
      expect(container.firstElementChild).toBeInTheDocument();
    });

    it("applies custom className", () => {
      render(<OnlineBlinkingIcon data-testid="icon" className="custom" />);
      expect(screen.getByTestId("icon")).toHaveClass("custom");
    });

    it("sets aria-hidden to true", () => {
      render(<OnlineBlinkingIcon data-testid="icon" />);
      expect(screen.getByTestId("icon")).toHaveAttribute("aria-hidden", "true");
    });

    it("forwards ref correctly", () => {
      const ref = React.createRef<HTMLSpanElement>();
      render(<OnlineBlinkingIcon ref={ref} data-testid="icon" />);
      expect(ref.current).toBe(screen.getByTestId("icon"));
    });

    it("renders sm size by default", () => {
      render(<OnlineBlinkingIcon data-testid="icon" />);
      expect(screen.getByTestId("icon")).toHaveClass("h-2", "w-2");
    });

    it("renders md size", () => {
      render(<OnlineBlinkingIcon data-testid="icon" size="md" />);
      expect(screen.getByTestId("icon")).toHaveClass("h-3", "w-3");
    });

    it("spreads additional HTML attributes", () => {
      render(<OnlineBlinkingIcon data-testid="icon" data-custom="value" />);
      expect(screen.getByTestId("icon")).toHaveAttribute("data-custom", "value");
    });

    it("ping element does not overflow beyond parent bounds", () => {
      const { container } = render(<OnlineBlinkingIcon />);
      const ping = container.querySelector(".animate-ping");
      expect(ping).toHaveClass("inset-0");
    });
  });

  describe("accessibility", () => {
    it("has no accessibility violations", async () => {
      const { container } = render(<OnlineBlinkingIcon />);
      expect(await axe(container)).toHaveNoViolations();
    });
  });
});
