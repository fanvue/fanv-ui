import { fireEvent, render, screen } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { UploadButton, type UploadButtonStatus } from "./UploadButton";

describe("UploadButton", () => {
  describe("API", () => {
    it("applies a custom className", () => {
      render(<UploadButton className="custom" />);
      expect(screen.getByRole("button")).toHaveClass("custom");
    });

    it("forwards the ref", () => {
      const ref = createRef<HTMLButtonElement>();
      render(<UploadButton ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    });

    it("falls back to a status-aware accessible name", () => {
      const { rerender } = render(<UploadButton status="idle" />);
      expect(screen.getByRole("button", { name: "Upload" })).toBeInTheDocument();

      rerender(<UploadButton status="uploading" />);
      expect(screen.getByRole("button", { name: "Uploading" })).toBeInTheDocument();

      rerender(<UploadButton status="error" />);
      expect(screen.getByRole("button", { name: "Upload failed, try again" })).toBeInTheDocument();
    });

    it("prefers an explicit aria-label", () => {
      render(<UploadButton status="uploading" aria-label="Upload avatar" />);
      expect(screen.getByRole("button", { name: "Upload avatar" })).toBeInTheDocument();
    });

    it("marks the button busy only while uploading", () => {
      const { rerender } = render(<UploadButton status="idle" />);
      expect(screen.getByRole("button")).not.toHaveAttribute("aria-busy");

      rerender(<UploadButton status="uploading" />);
      expect(screen.getByRole("button")).toHaveAttribute("aria-busy", "true");
    });

    it("fires onClick when idle or errored but not while uploading", () => {
      const onClick = vi.fn();
      const { rerender } = render(<UploadButton status="idle" onClick={onClick} />);
      fireEvent.click(screen.getByRole("button"));
      expect(onClick).toHaveBeenCalledTimes(1);

      rerender(<UploadButton status="uploading" onClick={onClick} />);
      fireEvent.click(screen.getByRole("button"));
      expect(onClick).toHaveBeenCalledTimes(1);

      rerender(<UploadButton status="error" onClick={onClick} />);
      fireEvent.click(screen.getByRole("button"));
      expect(onClick).toHaveBeenCalledTimes(2);
    });

    it("applies the destructive treatment in the error state", () => {
      render(<UploadButton status="error" />);
      expect(screen.getByRole("button")).toHaveClass("bg-buttons-error-default");
    });
  });

  describe("accessibility", () => {
    it.each<UploadButtonStatus>([
      "idle",
      "uploading",
      "error",
    ])("has no accessibility violations in the %s state", async (status) => {
      const { container } = render(<UploadButton status={status} />);
      expect(await axe(container)).toHaveNoViolations();
    });
  });
});
