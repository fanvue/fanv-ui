import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { MorphPanel } from "./MorphPanel";

function view() {
  return screen.getByText(/view/);
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("MorphPanel", () => {
  it("slides a deeper view in from the right", () => {
    const { rerender } = render(<MorphPanel step={0}>view 0</MorphPanel>);
    rerender(<MorphPanel step={1}>view 1</MorphPanel>);
    expect(view()).toHaveAttribute("data-direction", "forward");
  });

  it("slides a shallower view in from the left", () => {
    const { rerender } = render(<MorphPanel step={2}>view 2</MorphPanel>);
    rerender(<MorphPanel step={0}>view 0</MorphPanel>);
    expect(view()).toHaveAttribute("data-direction", "back");
  });

  it("remounts the content when the step changes, so it animates in again", () => {
    const { rerender } = render(<MorphPanel step={0}>view 0</MorphPanel>);
    const first = view();
    rerender(<MorphPanel step={1}>view 1</MorphPanel>);
    expect(view()).not.toBe(first);
    expect(view()).toHaveTextContent("view 1");
  });

  it("animates the height from the old view to the new one", () => {
    const heights = [120, 300];
    const spy = vi
      .spyOn(HTMLElement.prototype, "getBoundingClientRect")
      .mockImplementation(() => ({ height: heights.shift() ?? 300 }) as DOMRect);
    const { rerender, container } = render(<MorphPanel step={0}>view 0</MorphPanel>);
    rerender(<MorphPanel step={1}>view 1</MorphPanel>);
    const panel = container.firstElementChild as HTMLElement;
    expect(panel.style.height).toBe("300px");
    expect(panel.style.transition).toContain("height 300ms");
    spy.mockRestore();
  });

  it("swaps instantly with reduced motion", () => {
    vi.stubGlobal("matchMedia", (query: string) => ({ matches: query.includes("reduce") }));
    const heights = [120, 300];
    const spy = vi
      .spyOn(HTMLElement.prototype, "getBoundingClientRect")
      .mockImplementation(() => ({ height: heights.shift() ?? 300 }) as DOMRect);
    const { rerender, container } = render(<MorphPanel step={0}>view 0</MorphPanel>);
    rerender(<MorphPanel step={1}>view 1</MorphPanel>);
    const panel = container.firstElementChild as HTMLElement;
    expect(view()).toHaveTextContent("view 1");
    expect(panel.style.height).toBe("");
    expect(panel.style.transition).toBe("");
    spy.mockRestore();
  });
});
