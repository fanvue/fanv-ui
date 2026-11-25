import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { DateRangePanel, type DateRangePanelProps } from "./DateRangePanel";

const PRESETS = [
  { id: "all", label: "All time" },
  { id: "7d", label: "Last 7 days" },
];

const FEBRUARY = new Date(2026, 1);

function renderPanel(props: Partial<DateRangePanelProps> = {}) {
  const onValueChange = vi.fn();
  const onCancel = vi.fn();
  render(
    <DateRangePanel
      presets={PRESETS}
      customRangeLabel="Custom range"
      value={{ type: "preset", presetId: "all" }}
      onValueChange={onValueChange}
      onCancel={onCancel}
      calendarProps={{ startMonth: FEBRUARY, endMonth: FEBRUARY }}
      {...props}
    />,
  );
  return { onValueChange, onCancel };
}

const day = (name: RegExp) => screen.getByRole("button", { name });

describe("DateRangePanel", () => {
  describe("preset list", () => {
    it("emits the preset on click and marks the selected row", async () => {
      const { onValueChange } = renderPanel();
      expect(screen.getByRole("button", { name: "All time" })).toHaveAttribute(
        "aria-pressed",
        "true",
      );
      expect(screen.getByRole("button", { name: "Last 7 days" })).toHaveAttribute(
        "aria-pressed",
        "false",
      );
      await userEvent.click(screen.getByRole("button", { name: "Last 7 days" }));
      expect(onValueChange).toHaveBeenCalledWith({ type: "preset", presetId: "7d" });
    });

    it("moves focus between rows with Tab", async () => {
      renderPanel();
      await userEvent.tab();
      expect(screen.getByRole("button", { name: "All time" })).toHaveFocus();
      await userEvent.tab();
      expect(screen.getByRole("button", { name: "Last 7 days" })).toHaveFocus();
    });
  });

  describe("custom range with confirmation", () => {
    it("drops the draft on Cancel and returns to the list", async () => {
      const { onValueChange, onCancel } = renderPanel();
      await userEvent.click(screen.getByRole("button", { name: "Custom range" }));
      await userEvent.click(day(/February 10th/));
      await userEvent.click(screen.getByRole("button", { name: "Cancel" }));
      expect(onValueChange).not.toHaveBeenCalled();
      expect(onCancel).toHaveBeenCalledOnce();
      expect(screen.getByRole("button", { name: "Last 7 days" })).toBeInTheDocument();
    });

    it("keeps Apply disabled before any day is picked", async () => {
      renderPanel();
      await userEvent.click(screen.getByRole("button", { name: "Custom range" }));
      expect(screen.getByRole("button", { name: "Apply" })).toBeDisabled();
    });

    it("emits a one-day range when Apply follows a single click", async () => {
      const { onValueChange } = renderPanel();
      await userEvent.click(screen.getByRole("button", { name: "Custom range" }));
      await userEvent.click(day(/February 10th/));
      await userEvent.click(screen.getByRole("button", { name: "Apply" }));
      expect(onValueChange).toHaveBeenCalledOnce();
      const [emitted] = onValueChange.mock.calls[0] ?? [];
      expect(emitted.type).toBe("custom");
      expect(emitted.range.from.getDate()).toBe(10);
      expect(emitted.range.to.getDate()).toBe(10);
    });

    it("extends the range with a second click before Apply", async () => {
      const { onValueChange } = renderPanel();
      await userEvent.click(screen.getByRole("button", { name: "Custom range" }));
      await userEvent.click(day(/February 10th/));
      await userEvent.click(day(/February 12th/));
      await userEvent.click(screen.getByRole("button", { name: "Apply" }));
      expect(onValueChange).toHaveBeenCalledOnce();
      const [emitted] = onValueChange.mock.calls[0] ?? [];
      expect(emitted.type).toBe("custom");
      expect(emitted.range.from.getDate()).toBe(10);
      expect(emitted.range.to.getDate()).toBe(12);
    });

    it("opens on the calendar with the applied range when the value is custom", () => {
      renderPanel({
        value: {
          type: "custom",
          range: { from: new Date(2026, 1, 10), to: new Date(2026, 1, 12) },
        },
      });
      expect(screen.getByRole("button", { name: "Apply" })).toBeEnabled();
      expect(screen.queryByRole("button", { name: "All time" })).not.toBeInTheDocument();
    });
  });

  describe("custom range without confirmation", () => {
    it("emits a one-day range on the first click and the longer range on the second", async () => {
      const { onValueChange } = renderPanel({ confirmCustomRange: false });
      await userEvent.click(screen.getByRole("button", { name: "Custom range" }));
      expect(screen.queryByRole("button", { name: "Apply" })).not.toBeInTheDocument();
      expect(screen.queryByRole("button", { name: "Cancel" })).not.toBeInTheDocument();
      await userEvent.click(day(/February 10th/));
      expect(onValueChange).toHaveBeenCalledTimes(1);
      const first = onValueChange.mock.calls[0]?.[0];
      expect(first.range.from.getDate()).toBe(10);
      expect(first.range.to.getDate()).toBe(10);
      await userEvent.click(day(/February 12th/));
      expect(onValueChange).toHaveBeenCalledTimes(2);
      const second = onValueChange.mock.calls[1]?.[0];
      expect(second.range.from.getDate()).toBe(10);
      expect(second.range.to.getDate()).toBe(12);
    });
  });

  describe("accessibility", () => {
    it("has no violations in the list view", async () => {
      const { container } = render(
        <DateRangePanel
          presets={PRESETS}
          customRangeLabel="Custom range"
          value={{ type: "preset", presetId: "all" }}
          onValueChange={() => {}}
          aria-label="Date range"
        />,
      );
      expect(await axe(container)).toHaveNoViolations();
    });

    it("has no violations in the calendar view", async () => {
      const { container } = render(
        <DateRangePanel
          presets={PRESETS}
          customRangeLabel="Custom range"
          value={{
            type: "custom",
            range: { from: new Date(2026, 1, 10), to: new Date(2026, 1, 12) },
          }}
          onValueChange={() => {}}
          calendarProps={{ startMonth: FEBRUARY, endMonth: FEBRUARY }}
        />,
      );
      expect(await axe(container)).toHaveNoViolations();
    });
  });
});
