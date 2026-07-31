import { act, render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

type Listener = () => void;

/**
 * jsdom does not implement `matchMedia`, so every test that needs a value has to
 * install one. `stub` returns a setter so a test can flip the query and fire the
 * change event the same way a browser would.
 */
function stubMatchMedia(initialMatches: boolean) {
  const listeners = new Set<Listener>();
  let matches = initialMatches;

  const matchMedia = vi.fn((query: string) => ({
    // A real MediaQueryList updates `matches` in place, so this has to be a
    // getter rather than a snapshot taken when the list was created.
    get matches() {
      return matches;
    },
    media: query,
    onchange: null,
    addEventListener: (_: string, listener: Listener) => {
      listeners.add(listener);
    },
    removeEventListener: (_: string, listener: Listener) => {
      listeners.delete(listener);
    },
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  }));

  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    writable: true,
    value: matchMedia,
  });

  return {
    matchMedia,
    set(next: boolean) {
      matches = next;
      for (const listener of listeners) listener();
    },
  };
}

/** Records the hook's value on every render, so the first one can be asserted. */
function renderHookValues() {
  const values: boolean[] = [];
  function Probe() {
    values.push(usePrefersReducedMotion());
    return null;
  }
  const result = render(<Probe />);
  return { values, ...result };
}

afterEach(() => {
  Reflect.deleteProperty(window, "matchMedia");
  vi.restoreAllMocks();
});

describe("usePrefersReducedMotion", () => {
  it("returns false when matchMedia is unavailable", () => {
    expect(typeof window.matchMedia).toBe("undefined");
    const { values } = renderHookValues();
    expect(values.every((value) => value === false)).toBe(true);
  });

  it("reports the preference on the very first render, with no false frame", () => {
    stubMatchMedia(true);
    const { values } = renderHookValues();
    // The effect-based version rendered `false` first and corrected itself, which
    // let a reduced-motion user catch one animated frame.
    expect(values[0]).toBe(true);
  });

  it("returns false on the first render when the query does not match", () => {
    stubMatchMedia(false);
    const { values } = renderHookValues();
    expect(values[0]).toBe(false);
  });

  it("updates when the preference changes", () => {
    const mq = stubMatchMedia(false);
    const { values } = renderHookValues();
    expect(values[0]).toBe(false);

    act(() => mq.set(true));
    expect(values.at(-1)).toBe(true);

    act(() => mq.set(false));
    expect(values.at(-1)).toBe(false);
  });

  it("unsubscribes on unmount", () => {
    const mq = stubMatchMedia(false);
    const { unmount } = renderHookValues();
    unmount();
    // A listener left attached would throw on setState after unmount.
    expect(() => act(() => mq.set(true))).not.toThrow();
  });
});
