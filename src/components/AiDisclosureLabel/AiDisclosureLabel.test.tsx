import { render, screen } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { AiDisclosureLabel } from "./AiDisclosureLabel";

describe("AiDisclosureLabel", () => {
  describe("API", () => {
    it("applies custom className", () => {
      render(<AiDisclosureLabel label="Modified" className="custom-class" />);
      expect(screen.getByTestId("ai-disclosure-label")).toHaveClass("custom-class");
    });

    it("forwards ref", () => {
      const ref = createRef<HTMLSpanElement>();
      render(<AiDisclosureLabel label="Modified" ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLSpanElement);
    });
  });

  describe("wording", () => {
    it("renders the caller's wording after the AI mark", () => {
      render(<AiDisclosureLabel label="Modifié" />);
      expect(screen.getByText("AI")).toBeInTheDocument();
      expect(screen.getByText("Modifié")).toBeInTheDocument();
    });

    it("uppercases the wording in CSS so callers pass sentence case", () => {
      render(<AiDisclosureLabel label="Modifié" />);
      expect(screen.getByTestId("ai-disclosure-label")).toHaveClass("uppercase");
    });

    it("tracks each run against its own font size rather than the inherited one", () => {
      render(<AiDisclosureLabel label="Modified" />);
      expect(screen.getByText("AI")).toHaveClass("tracking-[0.1em]");
      expect(screen.getByText("Modified")).toHaveClass("tracking-[0.1em]");
    });
  });

  describe("accessibility", () => {
    it("announces the mark and wording as a separated phrase", () => {
      render(<AiDisclosureLabel label="Generated" />);
      expect(screen.getByRole("img")).toHaveAccessibleName("AI Generated");
    });

    it("carries the translation into the accessible name", () => {
      render(<AiDisclosureLabel label="Modifié" />);
      expect(screen.getByRole("img")).toHaveAccessibleName("AI Modifié");
    });

    it("lets a caller override the accessible name", () => {
      render(<AiDisclosureLabel label="Modifié" aria-label="Retouché par IA" />);
      expect(screen.getByRole("img")).toHaveAccessibleName("Retouché par IA");
    });

    it("has no accessibility violations", async () => {
      const { container } = render(<AiDisclosureLabel label="Generated" />);
      expect(await axe(container)).toHaveNoViolations();
    });
  });

  describe("tones", () => {
    it("paints a dark pill with light text by default", () => {
      render(<AiDisclosureLabel label="Modified" />);
      expect(screen.getByTestId("ai-disclosure-label")).toHaveClass(
        "bg-buttons-always-black-default",
        "text-content-always-white",
      );
    });

    it("inverts pill and text for the light tone", () => {
      render(<AiDisclosureLabel label="Modified" tone="light" />);
      expect(screen.getByTestId("ai-disclosure-label")).toHaveClass(
        "bg-buttons-always-white-default",
        "text-content-always-black",
      );
    });

    it("uses the half-opacity overlay fill for the transparent tone", () => {
      render(<AiDisclosureLabel label="Modified" tone="transparent" />);
      expect(screen.getByTestId("ai-disclosure-label")).toHaveClass(
        "bg-background-overlay-default",
        "text-content-always-white",
      );
    });
  });

  describe("sizes", () => {
    it("defaults to the 20px height", () => {
      render(<AiDisclosureLabel label="Modified" />);
      expect(screen.getByTestId("ai-disclosure-label")).toHaveClass("h-5");
    });

    it.each([
      ["12", "h-3", "text-[8px]", "text-[6px]"],
      ["16", "h-4", "text-[11px]", "text-[8px]"],
      ["20", "h-5", "text-[13px]", "text-[10px]"],
    ] as const)("scales pill, mark and wording together at %s", (size, height, mark, wording) => {
      render(<AiDisclosureLabel label="Modified" size={size} />);
      expect(screen.getByTestId("ai-disclosure-label")).toHaveClass(height);
      expect(screen.getByText("AI")).toHaveClass(mark);
      expect(screen.getByText("Modified")).toHaveClass(wording);
    });

    it("combines a non-default size with a non-default tone", () => {
      render(<AiDisclosureLabel label="Generated" size="12" tone="transparent" />);
      expect(screen.getByTestId("ai-disclosure-label")).toHaveClass(
        "h-3",
        "bg-background-overlay-default",
      );
      expect(screen.getByText("Generated")).toHaveClass("text-[6px]");
    });
  });
});
