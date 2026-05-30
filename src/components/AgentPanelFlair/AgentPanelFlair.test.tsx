import { render, screen } from "@testing-library/react";
import * as React from "react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { AgentPanelFlair } from "./AgentPanelFlair";

describe("AgentPanelFlair", () => {
  describe("API", () => {
    it("applies custom className", () => {
      render(<AgentPanelFlair className="custom" data-testid="flair" />);
      expect(screen.getByTestId("flair")).toHaveClass("custom");
    });

    it("forwards ref to the root element", () => {
      const ref = React.createRef<HTMLDivElement>();
      render(<AgentPanelFlair ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it("is decorative and non-interactive", () => {
      render(<AgentPanelFlair data-testid="flair" />);
      const element = screen.getByTestId("flair");
      expect(element).toHaveAttribute("aria-hidden", "true");
      expect(element).toHaveClass("pointer-events-none");
    });
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<AgentPanelFlair data-testid="flair" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
