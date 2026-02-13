import { fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { DatePicker } from "./DatePicker";

const DEFAULT_MONTH = new Date(2026, 1);

describe("DatePicker", () => {
  describe("API", () => {
    it("applies custom className to container", () => {
      const { container } = render(
        <DatePicker defaultMonth={DEFAULT_MONTH} className="custom-class" />,
      );
      expect(container.firstChild).toHaveClass("custom-class");
    });

    it("calls onApply when Apply button is clicked", () => {
      const onApply = vi.fn();
      render(<DatePicker defaultMonth={DEFAULT_MONTH} onApply={onApply} />);
      fireEvent.click(screen.getByText("Apply"));
      expect(onApply).toHaveBeenCalledOnce();
    });

    it("calls onCancel when Cancel button is clicked", () => {
      const onCancel = vi.fn();
      render(<DatePicker defaultMonth={DEFAULT_MONTH} onCancel={onCancel} />);
      fireEvent.click(screen.getByText("Cancel"));
      expect(onCancel).toHaveBeenCalledOnce();
    });

    it("renders custom button labels", () => {
      render(
        <DatePicker defaultMonth={DEFAULT_MONTH} cancelLabel="Discard" applyLabel="Confirm" />,
      );
      expect(screen.getByText("Discard")).toBeInTheDocument();
      expect(screen.getByText("Confirm")).toBeInTheDocument();
    });

    it("hides footer when showFooter is false", () => {
      render(<DatePicker defaultMonth={DEFAULT_MONTH} showFooter={false} />);
      expect(screen.queryByText("Cancel")).not.toBeInTheDocument();
      expect(screen.queryByText("Apply")).not.toBeInTheDocument();
    });

    it("renders two months when type is double", () => {
      render(<DatePicker defaultMonth={DEFAULT_MONTH} type="double" />);
      expect(screen.getByText("Feb 2026")).toBeInTheDocument();
      expect(screen.getByText("Mar 2026")).toBeInTheDocument();
    });

    it("forwards ref to outer container", () => {
      const ref = vi.fn();
      render(<DatePicker defaultMonth={DEFAULT_MONTH} ref={ref} />);
      expect(ref).toHaveBeenCalledWith(expect.any(HTMLDivElement));
    });
  });

  describe("controlled selection", () => {
    it("updates controlled value via onSelect callback", () => {
      const onSelect = vi.fn();
      render(
        <DatePicker
          mode="single"
          defaultMonth={DEFAULT_MONTH}
          selected={new Date(2026, 1, 10)}
          onSelect={onSelect}
          showFooter={false}
        />,
      );

      fireEvent.click(screen.getByText("22"));
      expect(onSelect).toHaveBeenCalledOnce();

      const [selectedDate] = onSelect.mock.calls[0] as [Date];
      expect(selectedDate.getDate()).toBe(22);
      expect(selectedDate.getMonth()).toBe(1);
      expect(selectedDate.getFullYear()).toBe(2026);
    });
  });

  describe("composition: input trigger", () => {
    function DatePickerWithInput() {
      const [open, setOpen] = useState(false);
      const [selected, setSelected] = useState<Date | undefined>();

      return (
        <div>
          <input
            data-testid="date-input"
            placeholder="Select a date"
            readOnly
            value={
              selected
                ? selected.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })
                : ""
            }
            onClick={() => setOpen(true)}
          />
          {open && (
            <DatePicker
              mode="single"
              defaultMonth={DEFAULT_MONTH}
              selected={selected}
              onSelect={setSelected}
              onApply={() => setOpen(false)}
              onCancel={() => {
                setSelected(undefined);
                setOpen(false);
              }}
            />
          )}
        </div>
      );
    }

    it("opens picker on input click and closes on apply", () => {
      render(<DatePickerWithInput />);
      expect(screen.queryByRole("grid")).not.toBeInTheDocument();
      fireEvent.click(screen.getByTestId("date-input"));
      expect(screen.getByRole("grid")).toBeInTheDocument();

      fireEvent.click(screen.getByText("15"));
      fireEvent.click(screen.getByText("Apply"));
      expect(screen.queryByRole("grid")).not.toBeInTheDocument();
      const input = screen.getByTestId("date-input") as HTMLInputElement;
      expect(input.value).toContain("15");
      expect(input.value).toContain("2026");
    });

    it("clears selection and closes on cancel", () => {
      render(<DatePickerWithInput />);

      fireEvent.click(screen.getByTestId("date-input"));
      fireEvent.click(screen.getByText("15"));

      fireEvent.click(screen.getByText("Cancel"));
      expect(screen.queryByRole("grid")).not.toBeInTheDocument();

      const input = screen.getByTestId("date-input") as HTMLInputElement;
      expect(input.value).toBe("");
    });
  });

  describe("range selection", () => {
    it("moves the nearest boundary when clicking inside a complete range", () => {
      const onSelect = vi.fn();
      // Range: 5th – 15th Feb 2026
      render(
        <DatePicker
          mode="range"
          defaultMonth={DEFAULT_MONTH}
          selected={{ from: new Date(2026, 1, 5), to: new Date(2026, 1, 15) }}
          onSelect={onSelect}
          showFooter={false}
        />,
      );

      // Click the 6th (closer to start=5 than end=15) → should move start to 6th
      fireEvent.click(screen.getByText("6"));
      expect(onSelect).toHaveBeenCalledOnce();

      const [range] = onSelect.mock.calls[0] as [{ from: Date; to: Date }];
      expect(range.from.getDate()).toBe(6);
      expect(range.to.getDate()).toBe(15);
    });

    it("moves the end boundary when clicked date is closer to end", () => {
      const onSelect = vi.fn();
      // Range: 5th – 15th Feb 2026
      render(
        <DatePicker
          mode="range"
          defaultMonth={DEFAULT_MONTH}
          selected={{ from: new Date(2026, 1, 5), to: new Date(2026, 1, 15) }}
          onSelect={onSelect}
          showFooter={false}
        />,
      );

      // Click the 14th (closer to end=15 than start=5) → should move end to 14th
      fireEvent.click(screen.getByText("14"));
      expect(onSelect).toHaveBeenCalledOnce();

      const [range] = onSelect.mock.calls[0] as [{ from: Date; to: Date }];
      expect(range.from.getDate()).toBe(5);
      expect(range.to.getDate()).toBe(14);
    });
  });

  describe("accessibility", () => {
    it("has no accessibility violations", async () => {
      const { container } = render(<DatePicker defaultMonth={DEFAULT_MONTH} />);
      expect(await axe(container)).toHaveNoViolations();
    });

    it("has no accessibility violations in range mode", async () => {
      const { container } = render(
        <DatePicker
          mode="range"
          defaultMonth={DEFAULT_MONTH}
          selected={{ from: new Date(2026, 1, 19), to: new Date(2026, 1, 25) }}
        />,
      );
      expect(await axe(container)).toHaveNoViolations();
    });
  });
});
