import { act, fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { TooltipLabel } from "./TooltipLabel";

/**
 * A tap, as the browser sequences it. `focused` reflects whether the label
 * already has focus: after the first tap it does, so no further focus event
 * fires and the tap alone has to drive the tooltip.
 */
const tap = (trigger: HTMLElement, { focused = false }: { focused?: boolean } = {}) => {
  fireEvent.pointerDown(trigger, { pointerType: "touch" });
  fireEvent.pointerUp(trigger, { pointerType: "touch" });
  if (!focused) fireEvent.focus(trigger);
  fireEvent.click(trigger, { detail: 1 });
};

/**
 * Dismissing by tapping the page, which leaves the label focused. Radix attaches
 * its outside-pointerdown listener in a deferred task so the tap that opened the
 * tooltip cannot immediately dismiss it, so wait for that before tapping.
 */
const tapOutside = async () => {
  await act(() => new Promise((resolve) => setTimeout(resolve, 0)));
  fireEvent.pointerDown(document.body, { pointerType: "touch" });
  fireEvent.pointerUp(document.body, { pointerType: "touch" });
  // For touch, Radix holds the outside dismissal back until the click that
  // follows the pointerdown, so the tooltip is not dismissed without it.
  fireEvent.click(document.body, { detail: 1 });
};

const isTooltipVisible = () => screen.queryAllByText("Explains it").length > 0;

describe("TooltipLabel", () => {
  it("has no accessibility violations", async () => {
    const { container } = render(<TooltipLabel tooltip="Explains it">Revenue</TooltipLabel>);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("takes its accessible name from the visible label", () => {
    render(<TooltipLabel tooltip="Explains it">Revenue</TooltipLabel>);
    expect(screen.getByRole("button", { name: "Revenue" })).toBeInTheDocument();
  });

  it("marks the label with a dashed underline rather than an icon", () => {
    render(<TooltipLabel tooltip="Explains it">Revenue</TooltipLabel>);
    const trigger = screen.getByRole("button", { name: "Revenue" });
    expect(trigger.querySelector("span")?.className).toContain("bg-repeat-x");
    expect(trigger.querySelector("svg")).toBeNull();
  });

  it("draws the dash on the label text, not the trigger box", () => {
    render(<TooltipLabel tooltip="Explains it">Revenue</TooltipLabel>);
    const trigger = screen.getByRole("button", { name: "Revenue" });
    const label = trigger.querySelector("span");
    // The button is block-level and stretches to its container, so a dash painted
    // on it runs the width of the row instead of the word. It belongs on the
    // inline span, which is only ever as wide as the text.
    expect(label?.textContent).toBe("Revenue");
    expect(label?.className).toContain("bg-repeat-x");
    expect(trigger.className).not.toContain("bg-repeat-x");
    // And the trigger itself hugs the label, so hover does not answer across the row.
    expect(trigger.className).toContain("w-fit");
  });

  it("anchors the dash pattern to the left edge so it does not clip mid-dash", () => {
    render(<TooltipLabel tooltip="Explains it">Revenue</TooltipLabel>);
    const label = screen.getByRole("button", { name: "Revenue" }).querySelector("span");
    expect(label?.className).toContain("bg-bottom-left");
    // Not the bare `bg-bottom`, which centres the tile and lays the pattern out
    // from the middle outward.
    expect(label?.className).not.toMatch(/\bbg-bottom(?![\w-])/);
  });

  it("stays open after a tap, rather than flashing", () => {
    render(<TooltipLabel tooltip="Explains it">Revenue</TooltipLabel>);
    tap(screen.getByRole("button", { name: "Revenue" }));
    expect(isTooltipVisible()).toBe(true);
  });

  it("reopens on a second tap after being dismissed", async () => {
    render(<TooltipLabel tooltip="Explains it">Revenue</TooltipLabel>);
    const trigger = screen.getByRole("button", { name: "Revenue" });

    tap(trigger);
    expect(isTooltipVisible()).toBe(true);

    await tapOutside();
    expect(isTooltipVisible()).toBe(false);

    // The label still holds focus here, so there is no focus event left to open
    // the tooltip — the tap has to do it.
    tap(trigger, { focused: true });
    expect(isTooltipVisible()).toBe(true);
  });

  it("closes when the open tooltip's label is tapped again", () => {
    render(<TooltipLabel tooltip="Explains it">Revenue</TooltipLabel>);
    const trigger = screen.getByRole("button", { name: "Revenue" });

    tap(trigger);
    expect(isTooltipVisible()).toBe(true);

    tap(trigger, { focused: true });
    expect(isTooltipVisible()).toBe(false);
  });

  it("still lets a mouse click dismiss the tooltip", () => {
    render(<TooltipLabel tooltip="Explains it">Revenue</TooltipLabel>);
    const trigger = screen.getByRole("button", { name: "Revenue" });
    fireEvent.pointerDown(trigger, { pointerType: "mouse" });
    fireEvent.pointerUp(trigger, { pointerType: "mouse" });
    fireEvent.focus(trigger);
    fireEvent.click(trigger, { detail: 1 });
    expect(screen.queryByText("Explains it")).not.toBeInTheDocument();
  });

  it("still calls a caller's own click and pointerdown handlers", () => {
    const onClick = vi.fn();
    const onPointerDown = vi.fn();
    render(
      <TooltipLabel tooltip="Explains it" onClick={onClick} onPointerDown={onPointerDown}>
        Revenue
      </TooltipLabel>,
    );
    tap(screen.getByRole("button", { name: "Revenue" }));
    expect(onClick).toHaveBeenCalledOnce();
    expect(onPointerDown).toHaveBeenCalledOnce();
  });

  it("forwards className and button attributes", () => {
    render(
      <TooltipLabel tooltip="Explains it" className="w-full" data-testid="label">
        Revenue
      </TooltipLabel>,
    );
    const trigger = screen.getByRole("button", { name: "Revenue" });
    expect(trigger.className).toContain("w-full");
    expect(trigger).toHaveAttribute("data-testid", "label");
  });
});
