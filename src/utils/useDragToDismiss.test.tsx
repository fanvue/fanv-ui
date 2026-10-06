import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { shouldDismissDrag, useDragToDismiss } from "./useDragToDismiss";

describe("shouldDismissDrag", () => {
  it("dismisses past a quarter of the sheet height", () => {
    expect(shouldDismissDrag({ offset: 100, height: 400, velocity: 0 })).toBe(true);
  });

  it("snaps back below a quarter of the sheet height", () => {
    expect(shouldDismissDrag({ offset: 99, height: 400, velocity: 0 })).toBe(false);
  });

  it("dismisses on a fast downward flick at a short distance", () => {
    expect(shouldDismissDrag({ offset: 20, height: 400, velocity: 0.5 })).toBe(true);
  });

  it("snaps back on a slow short drag", () => {
    expect(shouldDismissDrag({ offset: 20, height: 400, velocity: 0.49 })).toBe(false);
  });

  it("never dismisses an upward drag", () => {
    expect(shouldDismissDrag({ offset: -200, height: 400, velocity: 2 })).toBe(false);
  });
});

function Probe({
  onDismiss,
  scrollTop = 0,
  state,
}: {
  onDismiss: () => void;
  scrollTop?: number;
  state?: "open" | "closed";
}) {
  const handlers = useDragToDismiss({ enabled: true, onDismiss }, {});
  return (
    <div data-testid="sheet" data-state={state} {...handlers}>
      <div
        data-testid="scroller"
        ref={(node) => {
          if (node) node.scrollTop = scrollTop;
        }}
      >
        content
      </div>
      <input aria-label="field" />
    </div>
  );
}

function drag(target: HTMLElement, sheet: HTMLElement, to: number) {
  fireEvent.pointerDown(target, { pointerId: 1, button: 0, clientX: 0, clientY: 0 });
  fireEvent.pointerMove(sheet, { pointerId: 1, clientX: 0, clientY: to / 2 });
  fireEvent.pointerMove(sheet, { pointerId: 1, clientX: 0, clientY: to });
  fireEvent.pointerUp(sheet, { pointerId: 1, clientX: 0, clientY: to });
}

function timedDrag(sheet: HTMLElement, holdBeforeReleaseMs: number) {
  vi.useFakeTimers();
  fireEvent.pointerDown(sheet, { pointerId: 1, button: 0, clientX: 0, clientY: 0 });
  vi.advanceTimersByTime(10);
  fireEvent.pointerMove(sheet, { pointerId: 1, clientX: 0, clientY: 20 });
  vi.advanceTimersByTime(10);
  fireEvent.pointerMove(sheet, { pointerId: 1, clientX: 0, clientY: 40 });
  vi.advanceTimersByTime(holdBeforeReleaseMs);
  fireEvent.pointerUp(sheet, { pointerId: 1, clientX: 0, clientY: 40 });
  vi.useRealTimers();
}

function nextFrame() {
  return new Promise((resolve) => requestAnimationFrame(resolve));
}

function touchMove(sheet: HTMLElement, clientY: number) {
  return fireEvent.touchMove(sheet, { touches: [{ clientX: 0, clientY }] });
}

function mockHeight(element: HTMLElement, height: number) {
  vi.spyOn(element, "getBoundingClientRect").mockReturnValue({ height } as DOMRect);
}

describe("useDragToDismiss", () => {
  it("follows the pointer while dragging down", () => {
    render(<Probe onDismiss={vi.fn()} />);
    const sheet = screen.getByTestId("sheet");
    fireEvent.pointerDown(sheet, { pointerId: 1, button: 0, clientX: 0, clientY: 0 });
    fireEvent.pointerMove(sheet, { pointerId: 1, clientX: 0, clientY: 40 });
    expect(sheet.style.transform).toBe("translate3d(0, 40px, 0)");
  });

  it("dismisses when released past the threshold", () => {
    const onDismiss = vi.fn();
    render(<Probe onDismiss={onDismiss} />);
    const sheet = screen.getByTestId("sheet");
    mockHeight(sheet, 400);
    drag(sheet, sheet, 150);
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it("snaps back when released short of the threshold", () => {
    const onDismiss = vi.fn();
    render(<Probe onDismiss={onDismiss} />);
    const sheet = screen.getByTestId("sheet");
    mockHeight(sheet, 400);
    timedDrag(sheet, 300);
    expect(onDismiss).not.toHaveBeenCalled();
    expect(sheet.style.transform).toBe("");
  });

  it("dismisses on a fast flick", () => {
    const onDismiss = vi.fn();
    render(<Probe onDismiss={onDismiss} />);
    const sheet = screen.getByTestId("sheet");
    mockHeight(sheet, 400);
    timedDrag(sheet, 5);
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it("does not start a drag from scrolled content", () => {
    const onDismiss = vi.fn();
    render(<Probe onDismiss={onDismiss} scrollTop={20} />);
    const sheet = screen.getByTestId("sheet");
    mockHeight(sheet, 400);
    drag(screen.getByTestId("scroller"), sheet, 300);
    expect(onDismiss).not.toHaveBeenCalled();
    expect(sheet.style.transform).toBe("");
  });

  it("does not start a drag from a form field", () => {
    const onDismiss = vi.fn();
    render(<Probe onDismiss={onDismiss} />);
    const sheet = screen.getByTestId("sheet");
    mockHeight(sheet, 400);
    drag(screen.getByLabelText("field"), sheet, 300);
    expect(onDismiss).not.toHaveBeenCalled();
  });

  it("snaps back when the sheet stays open after a dismiss", async () => {
    render(<Probe onDismiss={vi.fn()} state="open" />);
    const sheet = screen.getByTestId("sheet");
    mockHeight(sheet, 400);
    drag(sheet, sheet, 150);
    await nextFrame();
    expect(sheet.style.transform).toBe("");
  });

  it("keeps its offset while the sheet closes after a dismiss", async () => {
    render(<Probe onDismiss={vi.fn()} state="closed" />);
    const sheet = screen.getByTestId("sheet");
    mockHeight(sheet, 400);
    drag(sheet, sheet, 150);
    await nextFrame();
    expect(sheet.style.transform).toBe("translate3d(0, 150px, 0)");
  });

  it("blocks native scrolling on a downward touch move", () => {
    render(<Probe onDismiss={vi.fn()} />);
    const sheet = screen.getByTestId("sheet");
    fireEvent.pointerDown(sheet, { pointerId: 1, button: 0, clientX: 0, clientY: 0 });
    expect(touchMove(sheet, 20)).toBe(false);
  });

  it("leaves an upward touch move to native scrolling", () => {
    render(<Probe onDismiss={vi.fn()} />);
    const sheet = screen.getByTestId("sheet");
    fireEvent.pointerDown(sheet, { pointerId: 1, button: 0, clientX: 0, clientY: 0 });
    expect(touchMove(sheet, -20)).toBe(true);
  });

  it("stops blocking native scrolling once the pointer is released", () => {
    render(<Probe onDismiss={vi.fn()} />);
    const sheet = screen.getByTestId("sheet");
    fireEvent.pointerDown(sheet, { pointerId: 1, button: 0, clientX: 0, clientY: 0 });
    fireEvent.pointerUp(sheet, { pointerId: 1, clientX: 0, clientY: 0 });
    expect(touchMove(sheet, 20)).toBe(true);
  });

  it("stops blocking native scrolling after a sideways drag", () => {
    render(<Probe onDismiss={vi.fn()} />);
    const sheet = screen.getByTestId("sheet");
    fireEvent.pointerDown(sheet, { pointerId: 1, button: 0, clientX: 0, clientY: 0 });
    fireEvent.pointerMove(sheet, { pointerId: 1, clientX: 40, clientY: 10 });
    expect(touchMove(sheet, 20)).toBe(true);
  });
});
