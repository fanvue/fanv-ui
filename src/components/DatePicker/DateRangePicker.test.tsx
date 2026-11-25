import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it } from "vitest";
import { Button } from "../Button/Button";
import type { DateRangeValue } from "./DateRangePanel";
import { DateRangePicker } from "./DateRangePicker";

const PRESETS = [
  { id: "all", label: "All time" },
  { id: "7d", label: "Last 7 days" },
];

const FEBRUARY = new Date(2026, 1);

function Harness() {
  const [value, setValue] = useState<DateRangeValue>({ type: "preset", presetId: "all" });
  return (
    <DateRangePicker
      presets={PRESETS}
      customRangeLabel="Custom range"
      value={value}
      onValueChange={setValue}
      calendarProps={{ startMonth: FEBRUARY, endMonth: FEBRUARY }}
    >
      <Button>Date</Button>
    </DateRangePicker>
  );
}

describe("DateRangePicker", () => {
  it("opens from the trigger", async () => {
    render(<Harness />);
    expect(screen.queryByRole("button", { name: "Last 7 days" })).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Date" }));
    expect(screen.getByRole("button", { name: "Last 7 days" })).toBeInTheDocument();
  });

  it("closes after a preset pick and returns focus to the trigger", async () => {
    render(<Harness />);
    await userEvent.click(screen.getByRole("button", { name: "Date" }));
    await userEvent.click(screen.getByRole("button", { name: "Last 7 days" }));
    expect(screen.queryByRole("button", { name: "Last 7 days" })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Date" })).toHaveFocus();
  });

  it("closes after Apply on a custom range", async () => {
    render(<Harness />);
    await userEvent.click(screen.getByRole("button", { name: "Date" }));
    await userEvent.click(screen.getByRole("button", { name: "Custom range" }));
    await userEvent.click(screen.getByRole("button", { name: /February 10th/ }));
    await userEvent.click(screen.getByRole("button", { name: /February 12th/ }));
    await userEvent.click(screen.getByRole("button", { name: "Apply" }));
    expect(screen.queryByRole("button", { name: "Apply" })).not.toBeInTheDocument();
  });

  it("closes after Cancel on the calendar", async () => {
    render(<Harness />);
    await userEvent.click(screen.getByRole("button", { name: "Date" }));
    await userEvent.click(screen.getByRole("button", { name: "Custom range" }));
    await userEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(screen.queryByRole("button", { name: "Cancel" })).not.toBeInTheDocument();
  });

  it("drops an unapplied start on Escape and reopens on the applied value", async () => {
    render(<Harness />);
    await userEvent.click(screen.getByRole("button", { name: "Date" }));
    await userEvent.click(screen.getByRole("button", { name: "Custom range" }));
    await userEvent.click(screen.getByRole("button", { name: /February 10th/ }));
    await userEvent.keyboard("{Escape}");
    await userEvent.click(screen.getByRole("button", { name: "Date" }));
    expect(screen.getByRole("button", { name: "All time" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.queryByRole("button", { name: "Apply" })).not.toBeInTheDocument();
  });
});
