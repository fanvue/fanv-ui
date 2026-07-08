import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { GridViewIcon } from "../Icons/GridViewIcon";
import { ListViewIcon } from "../Icons/ListViewIcon";
import { SegmentedControl } from "./SegmentedControl";

const twoOptions = [
  { label: "Net", value: "net" },
  { label: "Gross", value: "gross" },
];

const threeOptions = [
  { label: "Net", value: "net" },
  { label: "Gross", value: "gross" },
  { label: "Total", value: "total" },
];

const iconOptions = [
  { label: "List view", value: "list", icon: <ListViewIcon size={16} aria-hidden="true" /> },
  { label: "Grid view", value: "grid", icon: <GridViewIcon size={16} aria-hidden="true" /> },
];

describe("SegmentedControl", () => {
  describe("API", () => {
    it("applies custom className", () => {
      const { container } = render(
        <SegmentedControl className="custom-class" options={twoOptions} aria-label="Amount" />,
      );
      expect(container.firstChild).toHaveClass("custom-class");
    });

    it("renders one radio per option", () => {
      render(<SegmentedControl options={threeOptions} aria-label="Amount" />);
      expect(screen.getAllByRole("radio")).toHaveLength(3);
    });

    it("selects first option by default (uncontrolled)", () => {
      render(<SegmentedControl options={twoOptions} aria-label="Amount" />);
      const radios = screen.getAllByRole("radio");
      expect(radios[0]).toHaveAttribute("aria-checked", "true");
      expect(radios[1]).toHaveAttribute("aria-checked", "false");
    });

    it("supports defaultValue", () => {
      render(<SegmentedControl options={twoOptions} defaultValue="gross" aria-label="Amount" />);
      const radios = screen.getAllByRole("radio");
      expect(radios[0]).toHaveAttribute("aria-checked", "false");
      expect(radios[1]).toHaveAttribute("aria-checked", "true");
    });

    it("can be controlled", () => {
      const { rerender } = render(
        <SegmentedControl options={twoOptions} value="net" aria-label="Amount" />,
      );
      const radios = screen.getAllByRole("radio");
      expect(radios[0]).toHaveAttribute("aria-checked", "true");

      rerender(<SegmentedControl options={twoOptions} value="gross" aria-label="Amount" />);
      expect(radios[0]).toHaveAttribute("aria-checked", "false");
      expect(radios[1]).toHaveAttribute("aria-checked", "true");
    });

    it("calls onChange when a segment is selected", async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(<SegmentedControl options={twoOptions} onChange={handleChange} aria-label="Amount" />);
      await user.click(screen.getByText("Gross"));
      expect(handleChange).toHaveBeenCalledWith("gross");
    });

    it("does not fire onChange when clicking the already-selected segment", async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(<SegmentedControl options={twoOptions} onChange={handleChange} aria-label="Amount" />);
      await user.click(screen.getByText("Net"));
      expect(handleChange).not.toHaveBeenCalled();
    });

    it("disables interaction when disabled", async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(
        <SegmentedControl
          disabled
          options={twoOptions}
          onChange={handleChange}
          aria-label="Amount"
        />,
      );
      await user.click(screen.getByText("Gross"));
      expect(handleChange).not.toHaveBeenCalled();
    });

    it("forwards ref", () => {
      const ref = React.createRef<HTMLDivElement>();
      render(<SegmentedControl ref={ref} options={twoOptions} aria-label="Amount" />);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });

  describe("variants", () => {
    it("applies fill layout to segments", () => {
      render(<SegmentedControl variant="fill" options={twoOptions} aria-label="Amount" />);
      const radios = screen.getAllByRole("radio");
      expect(radios[0]).toHaveClass("flex-1");
    });

    it("applies hug layout to segments by default", () => {
      render(<SegmentedControl options={twoOptions} aria-label="Amount" />);
      const radios = screen.getAllByRole("radio");
      expect(radios[0]).toHaveClass("shrink-0");
    });

    it("applies the typography class for the given size", () => {
      render(<SegmentedControl size="48" options={twoOptions} aria-label="Amount" />);
      const radios = screen.getAllByRole("radio");
      expect(radios[0]).toHaveClass("typography-body-default-16px-semibold");
    });
  });

  describe("icon-only segments", () => {
    it("renders icon-only segments with no visible label text", () => {
      render(<SegmentedControl appearance="plain" options={iconOptions} aria-label="View" />);
      expect(screen.queryByText("List view")).not.toBeInTheDocument();
      expect(screen.queryByText("Grid view")).not.toBeInTheDocument();
      expect(screen.getByRole("radio", { name: "List view" })).toBeInTheDocument();
      expect(screen.getByRole("radio", { name: "Grid view" })).toBeInTheDocument();
    });

    it("uses the label as the aria-label accessible name", () => {
      render(<SegmentedControl appearance="plain" options={iconOptions} aria-label="View" />);
      const radios = screen.getAllByRole("radio");
      expect(radios[0]).toHaveAttribute("aria-label", "List view");
      expect(radios[1]).toHaveAttribute("aria-label", "Grid view");
    });

    it("renders label segments unaffected when mixed with icon segments", () => {
      render(
        <SegmentedControl
          options={[{ label: "Net", value: "net" }, ...iconOptions]}
          aria-label="Mixed"
        />,
      );
      expect(screen.getByText("Net")).toBeInTheDocument();
      expect(screen.getByRole("radio", { name: "List view" })).toBeInTheDocument();
    });

    it("supports uncontrolled selection across icon segments", async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(
        <SegmentedControl
          appearance="plain"
          options={iconOptions}
          onChange={handleChange}
          aria-label="View"
        />,
      );
      await user.click(screen.getByRole("radio", { name: "Grid view" }));
      expect(handleChange).toHaveBeenCalledWith("grid");
    });

    it("supports controlled selection across icon segments", () => {
      const { rerender } = render(
        <SegmentedControl
          appearance="plain"
          options={iconOptions}
          value="list"
          aria-label="View"
        />,
      );
      expect(screen.getByRole("radio", { name: "List view" })).toHaveAttribute(
        "aria-checked",
        "true",
      );

      rerender(
        <SegmentedControl
          appearance="plain"
          options={iconOptions}
          value="grid"
          aria-label="View"
        />,
      );
      expect(screen.getByRole("radio", { name: "Grid view" })).toHaveAttribute(
        "aria-checked",
        "true",
      );
    });

    it("navigates icon segments with the keyboard", async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(
        <SegmentedControl
          appearance="plain"
          options={iconOptions}
          onChange={handleChange}
          aria-label="View"
        />,
      );
      const radios = screen.getAllByRole("radio");

      radios[0]?.focus();
      await user.keyboard("{ArrowRight}");

      expect(handleChange).toHaveBeenCalledWith("grid");
      expect(radios[1]).toHaveFocus();
    });

    it("applies plain appearance without the pill container background", () => {
      const { container } = render(
        <SegmentedControl appearance="plain" options={iconOptions} aria-label="View" />,
      );
      expect(container.firstChild).not.toHaveClass("bg-surface-tertiary");
    });
  });

  describe("keyboard navigation", () => {
    it("moves focus and selects with ArrowRight", async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(<SegmentedControl options={twoOptions} onChange={handleChange} aria-label="Amount" />);
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
        <SegmentedControl
          options={twoOptions}
          defaultValue="gross"
          onChange={handleChange}
          aria-label="Amount"
        />,
      );
      const radios = screen.getAllByRole("radio");

      radios[1]?.focus();
      await user.keyboard("{ArrowLeft}");

      expect(handleChange).toHaveBeenCalledWith("net");
      expect(radios[0]).toHaveFocus();
    });

    it("wraps to the first option from the last with ArrowRight (three options)", async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(
        <SegmentedControl
          options={threeOptions}
          defaultValue="total"
          onChange={handleChange}
          aria-label="Amount"
        />,
      );
      const radios = screen.getAllByRole("radio");

      radios[2]?.focus();
      await user.keyboard("{ArrowRight}");

      expect(handleChange).toHaveBeenCalledWith("net");
      expect(radios[0]).toHaveFocus();
    });

    it("does not navigate when disabled", async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(
        <SegmentedControl
          disabled
          options={twoOptions}
          onChange={handleChange}
          aria-label="Amount"
        />,
      );
      const radios = screen.getAllByRole("radio");

      radios[0]?.focus();
      await user.keyboard("{ArrowRight}");

      expect(handleChange).not.toHaveBeenCalled();
      expect(radios[0]).toHaveAttribute("aria-checked", "true");
    });

    it("sets tabIndex={0} on selected and tabIndex={-1} on unselected", () => {
      render(<SegmentedControl options={threeOptions} aria-label="Amount" />);
      const radios = screen.getAllByRole("radio");
      expect(radios[0]).toHaveAttribute("tabIndex", "0");
      expect(radios[1]).toHaveAttribute("tabIndex", "-1");
      expect(radios[2]).toHaveAttribute("tabIndex", "-1");
    });

    it("falls back to first option tabbable when value matches no option", () => {
      render(<SegmentedControl options={twoOptions} value="stale" aria-label="Amount" />);
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
        <SegmentedControl options={threeOptions} aria-label="Amount type" />,
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("has no accessibility violations with icon-only segments", async () => {
      const { container } = render(
        <SegmentedControl appearance="plain" options={iconOptions} aria-label="View" />,
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("warns in dev when an icon-only segment is missing a label", () => {
      render(
        <SegmentedControl
          appearance="plain"
          options={[
            { label: "", value: "list", icon: <ListViewIcon size={16} aria-hidden="true" /> },
          ]}
          aria-label="View"
        />,
      );
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining('icon-only segment "list" is missing a non-empty `label`'),
      );
    });

    it("does not warn when an icon-only segment has a label", () => {
      render(<SegmentedControl appearance="plain" options={iconOptions} aria-label="View" />);
      expect(consoleWarnSpy).not.toHaveBeenCalled();
    });

    it("warns in dev when no accessible name is provided", () => {
      render(<SegmentedControl options={twoOptions} />);
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining("no accessible name provided"),
      );
    });

    it("does not warn when aria-label is provided", () => {
      render(<SegmentedControl options={twoOptions} aria-label="Amount" />);
      expect(consoleWarnSpy).not.toHaveBeenCalled();
    });

    it("does not warn when aria-labelledby is provided", () => {
      render(<SegmentedControl options={twoOptions} aria-labelledby="external-label" />);
      expect(consoleWarnSpy).not.toHaveBeenCalled();
    });
  });
});
