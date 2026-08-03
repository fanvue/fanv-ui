import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { AiButton } from "./AiButton";

describe("AiButton", () => {
  describe("API", () => {
    it("renders the label", () => {
      render(<AiButton label="Analyse" />);
      expect(screen.getByRole("button")).toHaveTextContent("Analyse");
    });

    it("names the button from the label rather than its split letters", () => {
      render(<AiButton label="Analyse" />);
      expect(screen.getByRole("button", { name: "Analyse" })).toBeInTheDocument();
    });

    it("names the button from the active label while active", () => {
      render(<AiButton label="Analyse" activeLabel="Analysing" active />);
      expect(screen.getByRole("button", { name: "Analysing" })).toBeInTheDocument();
    });

    it("prefers an explicit aria-label", () => {
      render(<AiButton label="Analyse" aria-label="Analyse earnings" />);
      expect(screen.getByRole("button", { name: "Analyse earnings" })).toBeInTheDocument();
    });

    it("falls back to the label when no active label is given", () => {
      render(<AiButton label="Analyse" active />);
      expect(screen.getByRole("button", { name: "Analyse" })).toBeInTheDocument();
    });

    it("marks itself busy only while active", () => {
      const { rerender } = render(<AiButton label="Analyse" />);
      expect(screen.getByRole("button")).not.toHaveAttribute("aria-busy");
      rerender(<AiButton label="Analyse" active />);
      expect(screen.getByRole("button")).toHaveAttribute("aria-busy", "true");
    });

    it("defaults to type=button so it never submits a surrounding form", () => {
      render(<AiButton label="Analyse" />);
      expect(screen.getByRole("button")).toHaveAttribute("type", "button");
    });

    it("forwards ref to the button element", () => {
      const ref = React.createRef<HTMLButtonElement>();
      render(<AiButton label="Analyse" ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    });

    it("applies custom className and spreads HTML attributes", () => {
      render(<AiButton label="Analyse" className="custom" data-x="y" />);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("custom");
      expect(button).toHaveAttribute("data-x", "y");
    });

    it("composes the AI surface with the interactive layer", () => {
      render(<AiButton label="Analyse" />);
      expect(screen.getByRole("button")).toHaveClass("fv-ai-surface", "fv-ai-button");
    });

    it("carries no border of its own, so it cannot double the surface ring", () => {
      render(<AiButton label="Analyse" />);
      expect(screen.getByRole("button")).not.toHaveClass("border");
    });
  });

  describe("interaction", () => {
    it("calls onClick", async () => {
      const onClick = vi.fn();
      render(<AiButton label="Analyse" onClick={onClick} />);
      await userEvent.click(screen.getByRole("button"));
      expect(onClick).toHaveBeenCalledOnce();
    });

    it("does not call onClick when disabled", async () => {
      const onClick = vi.fn();
      render(<AiButton label="Analyse" onClick={onClick} disabled />);
      await userEvent.click(screen.getByRole("button"));
      expect(onClick).not.toHaveBeenCalled();
    });
  });

  describe("sheen tracking", () => {
    // jsdom reports a zero-sized rect for every element, so the percentage has to
    // be driven off a stubbed rect to mean anything.
    const stubWidth = (button: HTMLElement, left: number, width: number) => {
      vi.spyOn(button, "getBoundingClientRect").mockReturnValue({
        left,
        width,
      } as DOMRect);
    };

    it("points the sheen at the cursor", () => {
      render(<AiButton label="Analyse" />);
      const button = screen.getByRole("button");
      stubWidth(button, 100, 200);

      fireEvent.pointerMove(button, { clientX: 150 });

      expect(button.style.getPropertyValue("--fv-ai-x")).toBe("25%");
    });

    it("recentres the sheen once the pointer leaves", () => {
      render(<AiButton label="Analyse" />);
      const button = screen.getByRole("button");
      stubWidth(button, 0, 100);

      fireEvent.pointerMove(button, { clientX: 80 });
      expect(button.style.getPropertyValue("--fv-ai-x")).toBe("80%");

      fireEvent.pointerLeave(button);
      expect(button.style.getPropertyValue("--fv-ai-x")).toBe("");
    });

    it("still calls the caller's pointer handlers", () => {
      const onPointerMove = vi.fn();
      const onPointerLeave = vi.fn();
      render(
        <AiButton label="Analyse" onPointerMove={onPointerMove} onPointerLeave={onPointerLeave} />,
      );
      const button = screen.getByRole("button");
      stubWidth(button, 0, 100);

      fireEvent.pointerMove(button, { clientX: 10 });
      fireEvent.pointerLeave(button);

      expect(onPointerMove).toHaveBeenCalledOnce();
      expect(onPointerLeave).toHaveBeenCalledOnce();
    });
  });

  describe("letters", () => {
    it("staggers each letter's animation by its index", () => {
      render(<AiButton label="Ana" />);
      const letters = screen
        .getByRole("button")
        .querySelectorAll<HTMLElement>("[aria-hidden='true'] > span");
      expect(letters[0]).toHaveStyle({ animationDelay: "0s" });
      expect(letters[1]).toHaveStyle({ animationDelay: "0.08s" });
      expect(letters[2]).toHaveStyle({ animationDelay: "0.16s" });
    });

    it("keeps whitespace between words", () => {
      render(<AiButton label="A B" />);
      expect(screen.getByRole("button")).toHaveTextContent("A B");
    });

    it("stops shimmering and stops lighting up on hover once disabled", () => {
      render(<AiButton label="Ana" disabled />);
      const letter = screen
        .getByRole("button")
        .querySelector<HTMLElement>("[aria-hidden='true'] > span");
      expect(letter).not.toHaveClass("[animation:fv-ai-letter_2s_ease-in-out_infinite]");
      expect(letter).not.toHaveClass("group-hover/ai:text-content-primary");
    });

    it("still shimmers when enabled", () => {
      render(<AiButton label="Ana" />);
      const letter = screen
        .getByRole("button")
        .querySelector<HTMLElement>("[aria-hidden='true'] > span");
      expect(letter).toHaveClass("[animation:fv-ai-letter_2s_ease-in-out_infinite]");
    });
  });

  describe("accessibility", () => {
    it("shows a focus ring, not only the sheen", () => {
      render(<AiButton label="Analyse" />);
      expect(screen.getByRole("button")).toHaveClass("focus-visible:shadow-focus-ring");
    });

    it("has no accessibility violations", async () => {
      const { container } = render(<AiButton label="Analyse" activeLabel="Analysing" />);
      expect(await axe(container)).toHaveNoViolations();
    });

    it("has no accessibility violations while active", async () => {
      const { container } = render(<AiButton label="Analyse" activeLabel="Analysing" active />);
      expect(await axe(container)).toHaveNoViolations();
    });
  });
});
