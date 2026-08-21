#!/usr/bin/env node
/**
 * Regenerates src/components/AnimatedIcons/AnimatedIcons.test.tsx from
 * scripts/animated-icons.manifest.json.
 *
 * These tests exist to hold two contracts that are otherwise only promises:
 *
 * 1. The icon animates. Every icon is hovered and its DOM is compared before and
 *    after, then again after the pointer leaves. Asserting the *shape* of the
 *    `controlRef` handle is not enough — a handle whose variant label does not
 *    exist is a function that does nothing, and Motion reports that silently.
 * 2. It is a drop-in for the static icon of the same name: same box class, same
 *    full class list, and the same effective stroke weight at every size.
 *
 * Run via `pnpm icons:animated` (or directly after editing the generator).
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..");
const MANIFEST_PATH = path.join(__dirname, "animated-icons.manifest.json");
const OUT = path.join(REPO_ROOT, "src/components/AnimatedIcons/AnimatedIcons.test.tsx");

const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf8"));
const icons = manifest.icons;

const imports = icons.map((i) => `import { ${i.name} } from "./${i.name}";`).join("\n");
const staticImports = icons
  .map((i) => `import { ${i.name} as Static${i.name} } from "../Icons/${i.name}";`)
  .join("\n");

const entries = icons
  .map(
    (i) =>
      `  { name: ${JSON.stringify(i.name)}, Component: ${i.name}, Static: Static${i.name}, propBased: ${i.propBased} },`,
  )
  .join("\n");

const body = `import { fireEvent, render, waitFor } from "@testing-library/react";
import type * as React from "react";
import { createRef } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
${staticImports}
${imports}

/** The \`size-*\` box class an icon renders with, e.g. \`size-6\`. */
function boxClass(container: HTMLElement) {
  const classes = container.querySelector("svg")?.getAttribute("class") ?? "";
  return classes.split(/\\s+/).find((c) => /^size-/.test(c));
}

/** Every class an icon renders with, order-independent. */
function classList(container: HTMLElement) {
  const classes = container.querySelector("svg")?.getAttribute("class") ?? "";
  return classes.split(/\\s+/).filter(Boolean).sort();
}

/**
 * Stroke width relative to the coordinate space it is drawn in.
 *
 * The rendered weight is \`strokeWidth * boxPx / viewBox\`, and both icons of a pair
 * render in the same box (asserted separately), so this ratio is what has to match.
 * The static icons stroke their paths; the animated ones stroke the root \`<svg>\`.
 */
function strokeRatio(container: HTMLElement) {
  const svg = container.querySelector("svg");
  const viewBox = svg?.getAttribute("viewBox")?.trim().split(/\\s+/)[3];
  const strokeWidth =
    svg?.getAttribute("stroke-width") ??
    svg?.querySelector("[stroke-width]")?.getAttribute("stroke-width");
  if (!viewBox || !strokeWidth) return null;
  return Number((Number(strokeWidth) / Number(viewBox)).toFixed(4));
}

/** Attributes Motion animates directly rather than through inline style. */
const ANIMATABLE_ATTRS = [
  "d",
  "opacity",
  "stroke-width",
  "stroke-dasharray",
  "stroke-dashoffset",
  "transform",
  "x",
  "y",
  "x1",
  "x2",
  "y1",
  "y2",
  "cx",
  "cy",
  "r",
  "points",
];

/**
 * Read an animatable attribute, collapsing the representations Motion leaves
 * behind once an element is back at rest.
 *
 * Motion writes its own bookkeeping when it takes an element over — a literal
 * \`undefined\`, a fully-drawn \`stroke-dasharray\` of \`1 1\` with zero offset from
 * normalised \`pathLength\`, an explicit \`opacity: 1\` — and does not clean it up.
 * Only the *resting* values are collapsed, so a mid-animation value still reads as
 * a change.
 */
function restingAttr(el: Element, name: string) {
  const raw = el.getAttribute(name);
  if (raw === null || raw === "undefined") return "";
  if (name === "opacity" && Number(raw) === 1) return "";
  if (name === "stroke-dasharray" && /^1(\\.0+)?\\s+1(\\.0+)?$/.test(raw.trim())) return "";
  if (name === "stroke-dashoffset" && Number(raw) === 0) return "";
  return raw;
}

/**
 * A comparable picture of everything an animation can move.
 *
 * \`transform-box\`/\`transform-origin\`, an identity \`transform\` and a resting
 * \`opacity: 1\` are normalised away for the same reason as {@link restingAttr}.
 */
function frame(container: HTMLElement) {
  return [...container.querySelectorAll("svg, svg *")]
    .map((el) => {
      const style = (el.getAttribute("style") ?? "")
        .replace(/transform:\\s*none;?/g, "")
        .replace(/transform-(box|origin):[^;]*;?/g, "")
        .replace(/opacity:\\s*1(\\.0+)?;?/g, "")
        .replace(/\\s+/g, " ")
        .trim();
      const attrs = ANIMATABLE_ATTRS.map((a) => restingAttr(el, a)).join(",");
      return \`\${el.tagName}|\${style}|\${attrs}\`;
    })
    .join("\\n");
}

/**
 * Wait until the DOM stops moving, then return that frame.
 *
 * Used instead of a fixed delay because the resting state is not always the
 * mount state: several icons declare a resting variant that sets more than
 * \`initial\` does, so the DOM after settling legitimately differs from the DOM
 * before anything was ever played. What has to hold is that rest is *stable* and
 * *reproducible*, which is what the hover test asserts.
 */
async function settle(container: HTMLElement) {
  let previous = frame(container);
  // Three identical samples, not one: a staggered icon's delay window reads as
  // finished while the animation is still running.
  let quiet = 0;
  for (let i = 0; i < 80; i++) {
    await new Promise((resolve) => setTimeout(resolve, 50));
    const next = frame(container);
    quiet = next === previous ? quiet + 1 : 0;
    previous = next;
    if (quiet >= 3) return next;
  }
  return previous;
}

/** Report reduced motion for the duration of a test. */
function stubReducedMotion(matches: boolean) {
  vi.stubGlobal(
    "matchMedia",
    vi.fn().mockImplementation((query: string) => ({
      matches,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  );
}

const animatedIcons = [
${entries}
];

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("AnimatedIcons", () => {
  for (const { name, Component } of animatedIcons) {
    describe(name, () => {
      it("renders an SVG element", () => {
        const { container } = render(<Component />);
        expect(container.querySelector("svg")).toBeInTheDocument();
      });

      it("renders a single element with no wrapper", () => {
        const { container } = render(<Component />);
        expect(container.children).toHaveLength(1);
        expect(container.firstElementChild?.tagName.toLowerCase()).toBe("svg");
      });

      it("applies aria-hidden by default", () => {
        const { container } = render(<Component />);
        expect(container.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
      });

      it("allows aria-hidden override for standalone usage", () => {
        const { container } = render(
          <Component aria-hidden={false} role="img" aria-label="example" />,
        );
        expect(container.querySelector("svg")).toHaveAttribute("aria-hidden", "false");
      });

      it("applies custom className", () => {
        const { container } = render(<Component className="custom-icon" />);
        expect(container.querySelector("svg")).toHaveClass("custom-icon");
      });

      it("allows size override via className", () => {
        const { container } = render(<Component className="size-10" />);
        expect(container.querySelector("svg")).toHaveClass("size-10");
      });

      it("forwards ref to the svg element", () => {
        const ref = createRef<SVGSVGElement>();
        render(<Component ref={ref} />);
        expect(ref.current).toBeInstanceOf(SVGSVGElement);
      });

      it("keeps a caller's style prop alongside its own", () => {
        const { container } = render(<Component style={{ color: "rgb(1, 2, 3)" }} />);
        expect(container.querySelector("svg")).toHaveStyle({ color: "rgb(1, 2, 3)" });
      });

      it("animates on hover and settles back on leave", async () => {
        const { container } = render(<Component />);
        const svg = container.querySelector("svg") as SVGSVGElement;
        const mounted = frame(container);

        // An icon whose variant labels do not match what the hook plays renders
        // as a static SVG and fails here.
        fireEvent.mouseEnter(svg);
        await waitFor(() => expect(frame(container)).not.toBe(mounted), { timeout: 3000 });

        fireEvent.mouseLeave(svg);
        const rested = await settle(container);

        // Rest must be reproducible: nothing sticks mid-animation or drifts.
        fireEvent.mouseEnter(svg);
        await waitFor(() => expect(frame(container)).not.toBe(rested), { timeout: 3000 });

        fireEvent.mouseLeave(svg);
        expect(await settle(container)).toBe(rested);
      });

      it("gets its hover trigger back when controlRef goes away", async () => {
        const controlRef = createRef<{
          startAnimation: () => void;
          stopAnimation: () => void;
        }>();
        const { container, rerender } = render(<Component controlRef={controlRef} />);
        const svg = container.querySelector("svg") as SVGSVGElement;
        const rest = frame(container);

        rerender(<Component />);
        fireEvent.mouseEnter(svg);
        await waitFor(() => expect(frame(container)).not.toBe(rest), { timeout: 3000 });
      });

      it("stands down its hover trigger while a controlRef drives it", async () => {
        const controlRef = createRef<{
          startAnimation: () => void;
          stopAnimation: () => void;
        }>();
        const { container } = render(<Component controlRef={controlRef} />);
        const svg = container.querySelector("svg") as SVGSVGElement;
        const rest = frame(container);

        fireEvent.mouseEnter(svg);
        await new Promise((resolve) => setTimeout(resolve, 100));
        expect(frame(container)).toBe(rest);

        controlRef.current?.startAnimation();
        await waitFor(() => expect(frame(container)).not.toBe(rest), { timeout: 3000 });
      });

      it("exposes imperative animation controls via controlRef", () => {
        const controlRef = createRef<{
          startAnimation: () => void;
          stopAnimation: () => void;
        }>();
        render(<Component controlRef={controlRef} />);
        expect(typeof controlRef.current?.startAnimation).toBe("function");
        expect(typeof controlRef.current?.stopAnimation).toBe("function");
      });

      it("stays still when the user has asked for reduced motion", async () => {
        stubReducedMotion(true);
        const { container } = render(<Component />);
        const svg = container.querySelector("svg") as SVGSVGElement;
        const rest = frame(container);

        fireEvent.mouseEnter(svg);
        await new Promise((resolve) => setTimeout(resolve, 100));
        expect(frame(container)).toBe(rest);
      });

      it("has no accessibility violations", async () => {
        const { container } = render(
          <Component role="img" aria-label={name} aria-hidden={false} />,
        );
        expect(await axe(container)).toHaveNoViolations();
      });
    });
  }

  describe("stays a drop-in for the static icon of the same name", () => {
    for (const { name, Component, Static, propBased } of animatedIcons) {
      if (propBased) {
        const Sized = Component as React.ComponentType<{ size: 16 | 24 | 32 }>;
        const StaticSized = Static as React.ComponentType<{ size: 16 | 24 | 32 }>;

        it(\`\${name} matches its static twin's box, classes and stroke weight at every size\`, () => {
          for (const size of [16, 24, 32] as const) {
            const animated = render(<Sized size={size} />);
            const original = render(<StaticSized size={size} />);
            expect(boxClass(animated.container)).toBe(boxClass(original.container));
            expect(classList(animated.container)).toEqual(classList(original.container));
            const staticRatio = strokeRatio(original.container);
            // Fill-only static artwork has no stroke to match.
            if (staticRatio !== null) {
              expect(strokeRatio(animated.container)).toBe(staticRatio);
            }
          }
        });
      } else {
        const Legacy = Component as React.ComponentType<Record<string, never>>;
        const StaticLegacy = Static as React.ComponentType<Record<string, never>>;

        it(\`\${name} matches its static twin's box, classes and stroke weight\`, () => {
          const animated = render(<Legacy />);
          const original = render(<StaticLegacy />);
          expect(boxClass(animated.container)).toBe(boxClass(original.container));
          expect(classList(animated.container)).toEqual(classList(original.container));
          const staticRatio = strokeRatio(original.container);
          if (staticRatio !== null) {
            expect(strokeRatio(animated.container)).toBe(staticRatio);
          }
        });
      }
    }
  });
});
`;

fs.writeFileSync(OUT, body);
console.log(`Wrote tests for ${icons.length} animated icons to ${OUT}`);

const { spawnSync } = await import("node:child_process");
const result = spawnSync("pnpm", ["biome", "check", OUT, "--write"], {
  cwd: REPO_ROOT,
  stdio: "inherit",
});
if (result.status !== 0 && result.status !== 1) {
  console.error("biome format pass failed with status", result.status);
  process.exit(result.status ?? 1);
}
