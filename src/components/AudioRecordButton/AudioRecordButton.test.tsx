import { fireEvent, render, screen } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { AudioRecordButton, type AudioRecordButtonStatus } from "./AudioRecordButton";

describe("AudioRecordButton", () => {
  describe("API", () => {
    it("applies a custom className", () => {
      render(<AudioRecordButton className="custom" />);
      expect(screen.getByRole("button")).toHaveClass("custom");
    });

    it("forwards the ref", () => {
      const ref = createRef<HTMLButtonElement>();
      render(<AudioRecordButton ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    });

    it("falls back to a status-aware accessible name", () => {
      const { rerender } = render(<AudioRecordButton status="idle" />);
      expect(screen.getByRole("button", { name: "Record" })).toBeInTheDocument();

      rerender(<AudioRecordButton status="recording" />);
      expect(screen.getByRole("button", { name: "Stop recording" })).toBeInTheDocument();
    });

    it("prefers an explicit aria-label", () => {
      render(<AudioRecordButton status="recording" aria-label="End voice note" />);
      expect(screen.getByRole("button", { name: "End voice note" })).toBeInTheDocument();
    });

    it("fires onClick in both states", () => {
      const onClick = vi.fn();
      const { rerender } = render(<AudioRecordButton status="idle" onClick={onClick} />);
      fireEvent.click(screen.getByRole("button"));
      rerender(<AudioRecordButton status="recording" onClick={onClick} />);
      fireEvent.click(screen.getByRole("button"));
      expect(onClick).toHaveBeenCalledTimes(2);
    });

    it("applies the destructive treatment while recording", () => {
      render(<AudioRecordButton status="recording" />);
      expect(screen.getByRole("button")).toHaveClass("bg-buttons-error-default");
    });
  });

  describe("accessibility", () => {
    it.each<AudioRecordButtonStatus>([
      "idle",
      "recording",
    ])("has no accessibility violations in the %s state", async (status) => {
      const { container } = render(<AudioRecordButton status={status} />);
      expect(await axe(container)).toHaveNoViolations();
    });
  });
});
