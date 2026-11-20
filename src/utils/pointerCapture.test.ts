import { describe, expect, it, vi } from "vitest";
import { capturePointer, releasePointer } from "./pointerCapture";

const notFound = () => {
  throw new DOMException("No active pointer with the given id is found.", "NotFoundError");
};

describe("pointerCapture", () => {
  it("captures the pointer on the element", () => {
    const element = document.createElement("div");
    element.setPointerCapture = vi.fn();
    capturePointer(element, 7);
    expect(element.setPointerCapture).toHaveBeenCalledWith(7);
  });

  it("does not throw when the pointer is no longer active", () => {
    const element = document.createElement("div");
    element.setPointerCapture = vi.fn(notFound);
    element.releasePointerCapture = vi.fn(notFound);
    expect(() => capturePointer(element, 7)).not.toThrow();
    expect(() => releasePointer(element, 7)).not.toThrow();
    expect(element.setPointerCapture).toHaveBeenCalledWith(7);
    expect(element.releasePointerCapture).toHaveBeenCalledWith(7);
  });
});
