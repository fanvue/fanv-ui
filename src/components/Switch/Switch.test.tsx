import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { Switch } from "./Switch";

describe("Switch", () => {
  describe("API", () => {
    it("applies custom className", () => {
      render(<Switch className="custom-class" aria-label="Toggle" />);
      const switchEl = screen.getByRole("switch");
      expect(switchEl).toHaveClass("custom-class");
    });

    it("can be controlled", () => {
      const { rerender } = render(<Switch checked={false} aria-label="Toggle" />);
      const switchEl = screen.getByRole("switch");
      expect(switchEl).toHaveAttribute("data-state", "unchecked");

      rerender(<Switch checked={true} aria-label="Toggle" />);
      expect(switchEl).toHaveAttribute("data-state", "checked");
    });

    it("calls onCheckedChange when toggled", async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(<Switch onCheckedChange={handleChange} aria-label="Toggle" />);
      await user.click(screen.getByRole("switch"));
      expect(handleChange).toHaveBeenCalledWith(true);
    });

    it("disables interaction when disabled", async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(<Switch disabled onCheckedChange={handleChange} aria-label="Toggle" />);
      const switchEl = screen.getByRole("switch");
      expect(switchEl).toBeDisabled();
      await user.click(switchEl);
      expect(handleChange).not.toHaveBeenCalled();
    });

    it("forwards ref", () => {
      const ref = React.createRef<HTMLButtonElement>();
      render(<Switch ref={ref} aria-label="Toggle" />);
      expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    });
  });

  describe("accessibility", () => {
    it("has no accessibility violations", async () => {
      const { container } = render(<Switch aria-label="Toggle feature" />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
