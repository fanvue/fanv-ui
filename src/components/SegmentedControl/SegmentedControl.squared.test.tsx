import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { ListViewIcon } from "../Icons/ListViewIcon";
import { SegmentedControl } from "./SegmentedControl";

const rangeOptions = [
  { label: "7 days", value: "7" },
  { label: "30 days", value: "30" },
  { label: "90 days", value: "90" },
];

describe("SegmentedControl squared appearance", () => {
  it("renders one radio per option with the first selected", () => {
    render(
      <SegmentedControl appearance="squared" options={rangeOptions} aria-label="Date range" />,
    );
    const radios = screen.getAllByRole("radio");
    expect(radios).toHaveLength(3);
    expect(radios[0]).toHaveAttribute("aria-checked", "true");
    expect(screen.getByRole("radio", { name: "30 days" })).toHaveAttribute("aria-checked", "false");
  });

  it("selects via click and the keyboard", async () => {
    const onChange = vi.fn();
    render(
      <SegmentedControl
        appearance="squared"
        options={rangeOptions}
        onChange={onChange}
        aria-label="Date range"
      />,
    );
    await userEvent.click(screen.getByRole("radio", { name: "30 days" }));
    expect(onChange).toHaveBeenLastCalledWith("30");
    expect(screen.getByRole("radio", { name: "30 days" })).toHaveAttribute("aria-checked", "true");
    await userEvent.keyboard("{ArrowRight}");
    expect(onChange).toHaveBeenLastCalledWith("90");
    expect(screen.getByRole("radio", { name: "90 days" })).toHaveFocus();
  });

  it("does not select when disabled", async () => {
    const onChange = vi.fn();
    render(
      <SegmentedControl
        appearance="squared"
        options={rangeOptions}
        onChange={onChange}
        disabled
        aria-label="Date range"
      />,
    );
    await userEvent.click(screen.getByRole("radio", { name: "30 days" }));
    expect(onChange).not.toHaveBeenCalled();
  });

  describe("collapsible", () => {
    let warn: ReturnType<typeof vi.spyOn>;

    beforeEach(() => {
      warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    });

    afterEach(() => {
      warn.mockRestore();
    });

    it("warns and stays a radiogroup, because squared has no collapsed form", () => {
      render(
        <SegmentedControl
          appearance="squared"
          collapsible
          options={[
            { label: "List view", value: "list", icon: <ListViewIcon size={16} /> },
            { label: "Grid view", value: "grid", icon: <ListViewIcon size={16} /> },
          ]}
          aria-label="View"
        />,
      );
      expect(warn).toHaveBeenCalledWith(
        'SegmentedControl: `collapsible` is only supported for the "plain" and "brand" appearances; ignoring it.',
      );
      expect(screen.getByRole("radiogroup", { name: "View" })).toBeInTheDocument();
      expect(screen.getAllByRole("radio")).toHaveLength(2);
    });
  });

  it("has no accessibility violations", async () => {
    const { container } = render(
      <SegmentedControl appearance="squared" options={rangeOptions} aria-label="Date range" />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
