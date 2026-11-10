import { type ClassValue, clsx } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * The kit's `typography-*` utilities each set font size, weight and line height,
 * so they conflict with each other: registering them as one class group lets a
 * consumer's `typography-*` replace a component's default instead of both
 * applying and leaving the result to stylesheet order.
 */
const twMerge = extendTailwindMerge({
  extend: { classGroups: { typography: [{ typography: [() => true] }] } },
});

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
