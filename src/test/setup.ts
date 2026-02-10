import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, expect } from "vitest";
import * as matchers from "vitest-axe/matchers";

// Polyfill ResizeObserver for Radix UI components that depend on it (e.g. Slider)
if (typeof globalThis.ResizeObserver === "undefined") {
  globalThis.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as unknown as typeof globalThis.ResizeObserver;
}

expect.extend(matchers);
afterEach(() => cleanup());

declare module "vitest" {
  interface Assertion<T> {
    toHaveNoViolations(): T;
  }
}
