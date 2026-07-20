import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { MediaStatusIndicator } from "./MediaStatusIndicator";

describe("MediaStatusIndicator", () => {
  describe("API", () => {
    it("exposes a default per-status accessible label", () => {
      render(<MediaStatusIndicator status="removed" />);
      expect(screen.getByRole("img", { name: "Removed" })).toBeInTheDocument();
    });

    it('defaults to the "default" status', () => {
      render(<MediaStatusIndicator />);
      expect(screen.getByRole("img", { name: "Flagged" })).toBeInTheDocument();
    });

    it("uses a custom label when provided", () => {
      render(<MediaStatusIndicator status="sensitive" label="Hidden content" />);
      expect(screen.getByRole("img", { name: "Hidden content" })).toBeInTheDocument();
    });

    it("lets aria-label take precedence over label", () => {
      render(<MediaStatusIndicator status="removed" label="Ignored" aria-label="Taken down" />);
      expect(screen.getByRole("img", { name: "Taken down" })).toBeInTheDocument();
    });

    it("applies a custom className", () => {
      render(<MediaStatusIndicator className="custom" />);
      expect(screen.getByRole("img")).toHaveClass("custom");
    });

    it("forwards ref to the root element", () => {
      const ref = { current: null as HTMLSpanElement | null };
      render(<MediaStatusIndicator ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLSpanElement);
    });
  });

  describe("accessibility", () => {
    it.each([
      "default",
      "removed",
      "sensitive",
    ] as const)("has no accessibility violations for %s", async (status) => {
      const { container } = render(<MediaStatusIndicator status={status} />);
      expect(await axe(container)).toHaveNoViolations();
    });
  });
});
