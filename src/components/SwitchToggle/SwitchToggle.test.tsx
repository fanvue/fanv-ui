import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { SwitchToggle } from "./SwitchToggle";

const defaultOptions: [{ label: string; value: string }, { label: string; value: string }] = [
  { label: "Net", value: "net" },
  { label: "Gross", value: "gross" },
];

describe("SwitchToggle", () => {
  describe("API", () => {
    it("applies custom className", () => {
      const { container } = render(
        <SwitchToggle className="custom-class" options={defaultOptions} aria-label="Toggle" />,
      );
      expect(container.firstChild).toHaveClass("custom-class");
    });

    it("selects first option by default (uncontrolled)", () => {
      render(<SwitchToggle options={defaultOptions} aria-label="Toggle" />);
      const radios = screen.getAllByRole("radio");
      expect(radios[0]).toBeChecked();
      expect(radios[1]).not.toBeChecked();
    });

    it("supports defaultValue", () => {
      render(<SwitchToggle options={defaultOptions} defaultValue="gross" aria-label="Toggle" />);
      const radios = screen.getAllByRole("radio");
      expect(radios[0]).not.toBeChecked();
      expect(radios[1]).toBeChecked();
    });

    it("can be controlled", () => {
      const { rerender } = render(
        <SwitchToggle options={defaultOptions} value="net" aria-label="Toggle" />,
      );
      const radios = screen.getAllByRole("radio");
      expect(radios[0]).toBeChecked();

      rerender(<SwitchToggle options={defaultOptions} value="gross" aria-label="Toggle" />);
      expect(radios[0]).not.toBeChecked();
      expect(radios[1]).toBeChecked();
    });

    it("calls onChange when toggled", async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(<SwitchToggle options={defaultOptions} onChange={handleChange} aria-label="Toggle" />);
      await user.click(screen.getByText("Gross"));
      expect(handleChange).toHaveBeenCalledWith("gross");
    });

    it("disables interaction when disabled", async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(
        <SwitchToggle
          disabled
          options={defaultOptions}
          onChange={handleChange}
          aria-label="Toggle"
        />,
      );
      await user.click(screen.getByText("Gross"));
      expect(handleChange).not.toHaveBeenCalled();
    });

    it("forwards ref", () => {
      const ref = React.createRef<HTMLDivElement>();
      render(<SwitchToggle ref={ref} options={defaultOptions} aria-label="Toggle" />);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });

  describe("accessibility", () => {
    it("has no accessibility violations", async () => {
      const { container } = render(
        <SwitchToggle options={defaultOptions} aria-label="Toggle view" />,
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
