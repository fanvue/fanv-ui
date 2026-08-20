#!/usr/bin/env node
/**
 * Regenerates src/components/AnimatedIcons/AnimatedIcons.test.tsx from
 * scripts/animated-icons.manifest.json.
 *
 * The point of these tests is the 1:1 contract: an animated icon must occupy the
 * same box as the static icon of the same name, because it is published under
 * that name and swapped in by changing an import path. So every icon is rendered
 * next to its static twin and the box classes are compared.
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

const body = `import { render } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
${staticImports}
${imports}

/** The \`size-*\` box class an icon renders with, e.g. \`size-6\`. */
function boxClass(container: HTMLElement) {
  const classes = container.querySelector("svg")?.getAttribute("class") ?? "";
  return classes.split(/\\s+/).find((c) => /^size-/.test(c));
}

const animatedIcons = [
${entries}
];

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

      it("exposes imperative animation controls via controlRef", () => {
        const controlRef = createRef<{
          startAnimation: () => void;
          stopAnimation: () => void;
        }>();
        render(<Component controlRef={controlRef} />);
        expect(typeof controlRef.current?.startAnimation).toBe("function");
        expect(typeof controlRef.current?.stopAnimation).toBe("function");
      });

      it("has no accessibility violations", async () => {
        const { container } = render(
          <Component role="img" aria-label={name} aria-hidden={false} />,
        );
        expect(await axe(container)).toHaveNoViolations();
      });
    });
  }

  describe("stays 1:1 with the static icon of the same name", () => {
    for (const { name, Component, Static, propBased } of animatedIcons) {
      if (propBased) {
        it(\`\${name} matches its static twin's box at every size\`, () => {
          for (const size of [16, 24, 32] as const) {
            const animated = render(<Component size={size} />);
            const original = render(<Static size={size} />);
            expect(boxClass(animated.container)).toBe(boxClass(original.container));
          }
        });
      } else {
        it(\`\${name} matches its static twin's default box\`, () => {
          const animated = render(<Component />);
          const original = render(<Static />);
          expect(boxClass(animated.container)).toBe(boxClass(original.container));
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
