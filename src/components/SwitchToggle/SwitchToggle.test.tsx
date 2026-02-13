import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
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
      expect(radios[0]).toHaveAttribute("aria-checked", "true");
      expect(radios[1]).toHaveAttribute("aria-checked", "false");
    });

    it("supports defaultValue", () => {
      render(<SwitchToggle options={defaultOptions} defaultValue="gross" aria-label="Toggle" />);
      const radios = screen.getAllByRole("radio");
      expect(radios[0]).toHaveAttribute("aria-checked", "false");
      expect(radios[1]).toHaveAttribute("aria-checked", "true");
    });

    it("can be controlled", () => {
      const { rerender } = render(
        <SwitchToggle options={defaultOptions} value="net" aria-label="Toggle" />,
      );
      const radios = screen.getAllByRole("radio");
      expect(radios[0]).toHaveAttribute("aria-checked", "true");

      rerender(<SwitchToggle options={defaultOptions} value="gross" aria-label="Toggle" />);
      expect(radios[0]).toHaveAttribute("aria-checked", "false");
      expect(radios[1]).toHaveAttribute("aria-checked", "true");
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

  describe("keyboard navigation", () => {
    it("moves focus and selects with ArrowRight", async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(<SwitchToggle options={defaultOptions} onChange={handleChange} aria-label="Toggle" />);
      const radios = screen.getAllByRole("radio");

      radios[0]?.focus();
      await user.keyboard("{ArrowRight}");

      expect(handleChange).toHaveBeenCalledWith("gross");
      expect(radios[1]).toHaveFocus();
    });

    it("moves focus and selects with ArrowLeft", async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(
        <SwitchToggle
          options={defaultOptions}
          defaultValue="gross"
          onChange={handleChange}
          aria-label="Toggle"
        />,
      );
      const radios = screen.getAllByRole("radio");

      radios[1]?.focus();
      await user.keyboard("{ArrowLeft}");

      expect(handleChange).toHaveBeenCalledWith("net");
      expect(radios[0]).toHaveFocus();
    });

    it("moves focus and selects with ArrowDown", async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(<SwitchToggle options={defaultOptions} onChange={handleChange} aria-label="Toggle" />);
      const radios = screen.getAllByRole("radio");

      radios[0]?.focus();
      await user.keyboard("{ArrowDown}");

      expect(handleChange).toHaveBeenCalledWith("gross");
      expect(radios[1]).toHaveFocus();
    });

    it("moves focus and selects with ArrowUp", async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(
        <SwitchToggle
          options={defaultOptions}
          defaultValue="gross"
          onChange={handleChange}
          aria-label="Toggle"
        />,
      );
      const radios = screen.getAllByRole("radio");

      radios[1]?.focus();
      await user.keyboard("{ArrowUp}");

      expect(handleChange).toHaveBeenCalledWith("net");
      expect(radios[0]).toHaveFocus();
    });

    it("does not fire onChange when clicking the already-selected option", async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(<SwitchToggle options={defaultOptions} onChange={handleChange} aria-label="Toggle" />);

      await user.click(screen.getByText("Net"));

      expect(handleChange).not.toHaveBeenCalled();
    });

    it("does not navigate when disabled", async () => {
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
      const radios = screen.getAllByRole("radio");

      radios[0]?.focus();
      await user.keyboard("{ArrowRight}");

      expect(handleChange).not.toHaveBeenCalled();
      expect(radios[0]).toHaveAttribute("aria-checked", "true");
    });

    it("sets tabIndex={0} on selected and tabIndex={-1} on unselected", () => {
      render(<SwitchToggle options={defaultOptions} aria-label="Toggle" />);
      const radios = screen.getAllByRole("radio");
      expect(radios[0]).toHaveAttribute("tabIndex", "0");
      expect(radios[1]).toHaveAttribute("tabIndex", "-1");
    });

    it("falls back to first option tabbable when value matches neither option", () => {
      render(<SwitchToggle options={defaultOptions} value="stale" aria-label="Toggle" />);
      const radios = screen.getAllByRole("radio");
      expect(radios[0]).toHaveAttribute("tabIndex", "0");
      expect(radios[1]).toHaveAttribute("tabIndex", "-1");
    });
  });

  describe("accessibility", () => {
    let consoleWarnSpy: ReturnType<typeof vi.spyOn>;

    beforeEach(() => {
      consoleWarnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    });

    afterEach(() => {
      consoleWarnSpy.mockRestore();
    });

    it("has no accessibility violations", async () => {
      const { container } = render(
        <SwitchToggle options={defaultOptions} aria-label="Toggle view" />,
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("warns in dev when no accessible name is provided", () => {
      render(<SwitchToggle options={defaultOptions} />);
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining("no accessible name provided"),
      );
    });

    it("does not warn when aria-label is provided", () => {
      render(<SwitchToggle options={defaultOptions} aria-label="Toggle" />);
      expect(consoleWarnSpy).not.toHaveBeenCalled();
    });

    it("does not warn when aria-labelledby is provided", () => {
      render(<SwitchToggle options={defaultOptions} aria-labelledby="external-label" />);
      expect(consoleWarnSpy).not.toHaveBeenCalled();
    });
  });
});
