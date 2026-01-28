import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, expect } from "vitest";
import * as matchers from "vitest-axe/matchers";

expect.extend(matchers);
afterEach(() => cleanup());

declare module "vitest" {
  interface Assertion<T> {
    toHaveNoViolations(): T;
  }
}
