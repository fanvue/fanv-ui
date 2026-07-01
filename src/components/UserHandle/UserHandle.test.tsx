import { render, screen } from "@testing-library/react";
import * as React from "react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { UserHandle } from "./UserHandle";

describe("UserHandle", () => {
  describe("API", () => {
    it("prefixes the handle with an @ symbol", () => {
      render(<UserHandle>fit_aitana</UserHandle>);
      expect(screen.getByText("@fit_aitana")).toBeInTheDocument();
    });

    it("applies the muted, truncated secondary typography", () => {
      render(<UserHandle data-testid="handle">fit_aitana</UserHandle>);
      const el = screen.getByTestId("handle");
      expect(el.tagName).toBe("SPAN");
      expect(el).toHaveClass(
        "block",
        "truncate",
        "max-w-full",
        "typography-body-small-14px-regular",
        "text-content-secondary",
      );
    });

    it("applies custom className", () => {
      render(
        <UserHandle data-testid="handle" className="custom">
          fit_aitana
        </UserHandle>,
      );
      expect(screen.getByTestId("handle")).toHaveClass("custom");
    });

    it("spreads additional HTML attributes", () => {
      render(
        <UserHandle data-testid="handle" data-custom="x">
          fit_aitana
        </UserHandle>,
      );
      expect(screen.getByTestId("handle")).toHaveAttribute("data-custom", "x");
    });

    it("forwards ref to the root element", () => {
      const ref = React.createRef<HTMLSpanElement>();
      render(<UserHandle ref={ref}>fit_aitana</UserHandle>);
      expect(ref.current).toBeInstanceOf(HTMLSpanElement);
    });
  });

  describe("accessibility", () => {
    it("has no accessibility violations", async () => {
      const { container } = render(<UserHandle>fit_aitana</UserHandle>);
      expect(await axe(container)).toHaveNoViolations();
    });
  });
});
