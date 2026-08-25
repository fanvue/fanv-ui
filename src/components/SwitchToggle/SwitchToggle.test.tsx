import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { SwitchToggle } from "./SwitchToggle";

describe("SwitchToggle", () => {
  describe("API", () => {
    it("applies custom className", () => {
      render(<SwitchToggle label="Filter" className="custom-class" />);
      expect(screen.getByRole("button")).toHaveClass("custom-class");
    });

    it("uses the label as the accessible name", () => {
      render(<SwitchToggle label="Hide sold out" />);
      expect(screen.getByRole("button", { name: "Hide sold out" })).toBeInTheDocument();
    });

    it("renders an unpressed toggle button by default", () => {
      render(<SwitchToggle label="Filter" />);
      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("aria-pressed", "false");
      expect(button).toHaveAttribute("data-state", "off");
      expect(button).toHaveAttribute("type", "button");
    });

    it("respects defaultPressed when uncontrolled", () => {
      render(<SwitchToggle label="Filter" defaultPressed />);
      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("aria-pressed", "true");
      expect(button).toHaveAttribute("data-state", "on");
    });

    it("can be controlled", () => {
      const { rerender } = render(<SwitchToggle label="Filter" pressed={false} />);
      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("aria-pressed", "false");

      rerender(<SwitchToggle label="Filter" pressed={true} />);
      expect(button).toHaveAttribute("aria-pressed", "true");
      expect(button).toHaveAttribute("data-state", "on");
    });

    it("does not move a controlled value on its own", async () => {
      const user = userEvent.setup();
      const onPressedChange = vi.fn();
      render(<SwitchToggle label="Filter" pressed={false} onPressedChange={onPressedChange} />);
      const button = screen.getByRole("button");

      await user.click(button);

      expect(onPressedChange).toHaveBeenCalledWith(true);
      expect(button).toHaveAttribute("aria-pressed", "false");
    });

    it("toggles on click and reports the next state", async () => {
      const user = userEvent.setup();
      const onPressedChange = vi.fn();
      render(<SwitchToggle label="Filter" onPressedChange={onPressedChange} />);
      const button = screen.getByRole("button");

      await user.click(button);
      expect(onPressedChange).toHaveBeenLastCalledWith(true);
      expect(button).toHaveAttribute("aria-pressed", "true");

      await user.click(button);
      expect(onPressedChange).toHaveBeenLastCalledWith(false);
      expect(button).toHaveAttribute("aria-pressed", "false");
    });

    it("still calls a supplied onClick", async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();
      render(<SwitchToggle label="Filter" onClick={onClick} />);
      await user.click(screen.getByRole("button"));
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it("forwards ref", () => {
      const ref = React.createRef<HTMLButtonElement>();
      render(<SwitchToggle label="Filter" ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    });
  });

  describe("keyboard", () => {
    it("toggles with Enter and Space", async () => {
      const user = userEvent.setup();
      render(<SwitchToggle label="Filter" />);
      const button = screen.getByRole("button");

      await user.tab();
      expect(button).toHaveFocus();

      await user.keyboard("{Enter}");
      expect(button).toHaveAttribute("aria-pressed", "true");

      await user.keyboard(" ");
      expect(button).toHaveAttribute("aria-pressed", "false");
    });
  });

  describe("size", () => {
    it.each([
      ["24", "h-6"],
      ["32", "h-8"],
      ["40", "h-10"],
    ] as const)("renders the %s size at %s", (size, heightClass) => {
      render(<SwitchToggle label="Filter" size={size} />);
      expect(screen.getByRole("button")).toHaveClass(heightClass);
    });
  });

  describe("icons", () => {
    const glyphCount = (container: HTMLElement) => container.querySelectorAll("svg").length;

    it("shows neither glyph by default", () => {
      const { container } = render(<SwitchToggle label="Filter" />);
      expect(glyphCount(container)).toBe(0);
    });

    it("toggles the two glyphs independently", () => {
      const { container, rerender } = render(<SwitchToggle label="Filter" showLeftIcon />);
      expect(glyphCount(container)).toBe(1);

      rerender(<SwitchToggle label="Filter" showRightIcon />);
      expect(glyphCount(container)).toBe(1);

      rerender(<SwitchToggle label="Filter" showLeftIcon showRightIcon />);
      expect(glyphCount(container)).toBe(2);

      rerender(<SwitchToggle label="Filter" />);
      expect(glyphCount(container)).toBe(0);
    });

    it("puts the glyphs on the correct sides of the label", () => {
      const { container } = render(<SwitchToggle label="Filter" showLeftIcon showRightIcon />);
      const children = Array.from(
        (container.firstElementChild as HTMLElement).children,
      ) as HTMLElement[];
      expect(children).toHaveLength(3);
      expect(children[0]?.querySelector("svg")).toBeInTheDocument();
      expect(children[1]?.textContent).toBe("Filter");
      expect(children[2]?.querySelector("svg")).toBeInTheDocument();
    });

    it("keeps glyphs out of the accessible name", () => {
      render(<SwitchToggle label="Earnings" showLeftIcon showRightIcon />);
      expect(screen.getByRole("button", { name: "Earnings" })).toBeInTheDocument();
    });
  });

  describe("variant", () => {
    it("pins a single fixed sparkle on the ai variant", () => {
      const { container } = render(<SwitchToggle variant="ai" label="Smart replies" />);
      const children = Array.from(
        (container.firstElementChild as HTMLElement).children,
      ) as HTMLElement[];
      expect(container.querySelectorAll("svg")).toHaveLength(1);
      expect(children).toHaveLength(2);
      expect(children[0]?.querySelector("svg")).toBeInTheDocument();
      expect(children[1]?.textContent).toBe("Smart replies");
    });

    it("fills green and paints a masked three-stop gradient ring when pressed", () => {
      render(<SwitchToggle variant="ai" label="Smart replies" defaultPressed />);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("bg-buttons-ai-default");
      expect(button.className).toContain(
        "linear-gradient(90deg,var(--color-buttons-ai-stroke-end)_0%,var(--color-buttons-ai-stroke-start)_50%,var(--color-buttons-ai-stroke-end)_100%)",
      );
      expect(button.className).toContain("content-box_exclude");
      expect(button).not.toHaveClass("bg-buttons-switch-active");
    });

    it("carries no ai fill while unpressed", () => {
      render(<SwitchToggle variant="ai" label="Smart replies" />);
      expect(screen.getByRole("button").className).not.toContain(
        "var(--color-buttons-ai-stroke-start)",
      );
    });

    it("darkens and inverts its label when the default variant is pressed", () => {
      render(<SwitchToggle label="Filter" defaultPressed />);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("bg-buttons-switch-active");
      expect(button).toHaveClass("text-content-primary-inverted");
    });
  });

  describe("disabled", () => {
    it("does not toggle when disabled", async () => {
      const user = userEvent.setup();
      const onPressedChange = vi.fn();
      render(<SwitchToggle label="Filter" disabled onPressedChange={onPressedChange} />);
      const button = screen.getByRole("button");

      expect(button).toBeDisabled();
      await user.click(button);

      expect(onPressedChange).not.toHaveBeenCalled();
      expect(button).toHaveAttribute("aria-pressed", "false");
    });

    it("drops the pressed fill so the disabled treatment reads as unavailable", () => {
      render(<SwitchToggle label="Filter" disabled defaultPressed />);
      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("aria-pressed", "true");
      expect(button).toHaveClass("text-content-disabled");
      expect(button).not.toHaveClass("bg-buttons-switch-active");
    });
  });

  describe("accessibility", () => {
    it("has no accessibility violations", async () => {
      const { container } = render(<SwitchToggle label="Hide sold out" />);
      expect(await axe(container)).toHaveNoViolations();
    });

    it("has no accessibility violations when pressed and disabled", async () => {
      const { container } = render(
        <SwitchToggle variant="ai" label="Smart replies" defaultPressed disabled />,
      );
      expect(await axe(container)).toHaveNoViolations();
    });
  });
});
