import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useSuppressClickAfterDrag } from "./useSuppressClickAfterDrag";

function Probe({ onClick }: { onClick: () => void }) {
  const handlers = useSuppressClickAfterDrag({ onClick });
  return (
    <button type="button" {...handlers}>
      probe
    </button>
  );
}

describe("useSuppressClickAfterDrag", () => {
  it("fires onClick for a stationary touch tap", () => {
    const onClick = vi.fn();
    render(<Probe onClick={onClick} />);
    const button = screen.getByRole("button");
    fireEvent.pointerDown(button, {
      pointerType: "touch",
      pointerId: 1,
      clientX: 10,
      clientY: 10,
    });
    fireEvent.pointerUp(button, {
      pointerType: "touch",
      pointerId: 1,
      clientX: 12,
      clientY: 11,
    });
    fireEvent.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("suppresses onClick when the touch pointer moves past the threshold", () => {
    const onClick = vi.fn();
    render(<Probe onClick={onClick} />);
    const button = screen.getByRole("button");
    fireEvent.pointerDown(button, {
      pointerType: "touch",
      pointerId: 1,
      clientX: 0,
      clientY: 0,
    });
    fireEvent.pointerMove(button, {
      pointerType: "touch",
      pointerId: 1,
      clientX: 0,
      clientY: 100,
    });
    fireEvent.pointerUp(button, {
      pointerType: "touch",
      pointerId: 1,
      clientX: 0,
      clientY: 100,
    });
    fireEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("fires onClick for a mouse click regardless of pointermove distance", () => {
    const onClick = vi.fn();
    render(<Probe onClick={onClick} />);
    const button = screen.getByRole("button");
    fireEvent.pointerDown(button, {
      pointerType: "mouse",
      pointerId: 1,
      clientX: 0,
      clientY: 0,
    });
    fireEvent.pointerMove(button, {
      pointerType: "mouse",
      pointerId: 1,
      clientX: 0,
      clientY: 200,
    });
    fireEvent.pointerUp(button, {
      pointerType: "mouse",
      pointerId: 1,
      clientX: 0,
      clientY: 200,
    });
    fireEvent.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("treats stylus (pen) input the same as touch", () => {
    const onClick = vi.fn();
    render(<Probe onClick={onClick} />);
    const button = screen.getByRole("button");
    fireEvent.pointerDown(button, {
      pointerType: "pen",
      pointerId: 1,
      clientX: 0,
      clientY: 0,
    });
    fireEvent.pointerMove(button, {
      pointerType: "pen",
      pointerId: 1,
      clientX: 0,
      clientY: 50,
    });
    fireEvent.pointerUp(button, {
      pointerType: "pen",
      pointerId: 1,
      clientX: 0,
      clientY: 50,
    });
    fireEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("resets state on pointercancel so the next gesture is independent", () => {
    const onClick = vi.fn();
    render(<Probe onClick={onClick} />);
    const button = screen.getByRole("button");
    fireEvent.pointerDown(button, {
      pointerType: "touch",
      pointerId: 1,
      clientX: 0,
      clientY: 0,
    });
    fireEvent.pointerMove(button, {
      pointerType: "touch",
      pointerId: 1,
      clientX: 0,
      clientY: 100,
    });
    fireEvent.pointerCancel(button, {
      pointerType: "touch",
      pointerId: 1,
      clientX: 0,
      clientY: 100,
    });
    // Cancelled gesture's stray click should not suppress because tap state was cleared.
    fireEvent.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("isolates state across pointerIds (other-finger move does not count)", () => {
    const onClick = vi.fn();
    render(<Probe onClick={onClick} />);
    const button = screen.getByRole("button");
    fireEvent.pointerDown(button, {
      pointerType: "touch",
      pointerId: 1,
      clientX: 0,
      clientY: 0,
    });
    // A second finger drags past the threshold — must not influence finger 1's classification.
    fireEvent.pointerMove(button, {
      pointerType: "touch",
      pointerId: 2,
      clientX: 0,
      clientY: 100,
    });
    fireEvent.pointerUp(button, {
      pointerType: "touch",
      pointerId: 1,
      clientX: 1,
      clientY: 1,
    });
    fireEvent.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("forwards consumer pointer handlers", () => {
    const onPointerDown = vi.fn();
    const onPointerMove = vi.fn();
    const onPointerCancel = vi.fn();
    function Wrapper() {
      const handlers = useSuppressClickAfterDrag({
        onPointerDown,
        onPointerMove,
        onPointerCancel,
        onClick: () => {},
      });
      return (
        <button type="button" {...handlers}>
          probe
        </button>
      );
    }
    render(<Wrapper />);
    const button = screen.getByRole("button");
    fireEvent.pointerDown(button, {
      pointerType: "touch",
      pointerId: 1,
      clientX: 0,
      clientY: 0,
    });
    fireEvent.pointerMove(button, {
      pointerType: "touch",
      pointerId: 1,
      clientX: 1,
      clientY: 1,
    });
    fireEvent.pointerCancel(button, { pointerType: "touch", pointerId: 1 });
    expect(onPointerDown).toHaveBeenCalledTimes(1);
    expect(onPointerMove).toHaveBeenCalledTimes(1);
    expect(onPointerCancel).toHaveBeenCalledTimes(1);
  });
});
