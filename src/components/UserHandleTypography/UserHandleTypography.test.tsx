import { render, screen } from "@testing-library/react";
import * as React from "react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { UserHandleTypography } from "./UserHandleTypography";

describe("UserHandleTypography", () => {
  describe("API", () => {
    it("prefixes the handle with an @ symbol", () => {
      render(<UserHandleTypography>fit_aitana</UserHandleTypography>);
      expect(screen.getByText("@fit_aitana")).toBeInTheDocument();
    });

    it("applies the muted, truncated secondary typography", () => {
      render(<UserHandleTypography data-testid="handle">fit_aitana</UserHandleTypography>);
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
        <UserHandleTypography data-testid="handle" className="custom">
          fit_aitana
        </UserHandleTypography>,
      );
      expect(screen.getByTestId("handle")).toHaveClass("custom");
    });

    it("spreads additional HTML attributes", () => {
      render(
        <UserHandleTypography data-testid="handle" data-custom="x">
          fit_aitana
        </UserHandleTypography>,
      );
      expect(screen.getByTestId("handle")).toHaveAttribute("data-custom", "x");
    });

    it("forwards ref to the root element", () => {
      const ref = React.createRef<HTMLSpanElement>();
      render(<UserHandleTypography ref={ref}>fit_aitana</UserHandleTypography>);
      expect(ref.current).toBeInstanceOf(HTMLSpanElement);
    });
  });

  describe("accessibility", () => {
    it("has no accessibility violations", async () => {
      const { container } = render(<UserHandleTypography>fit_aitana</UserHandleTypography>);
      expect(await axe(container)).toHaveNoViolations();
    });
  });
});
