#!/usr/bin/env node
/**
 * Regenerates src/components/Icons/Icons.test.tsx from the set of .tsx files
 * in src/components/Icons/ plus the prop-based icons listed in
 * scripts/icons.manifest.json. Run after adding or removing icons.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..");
const ICONS_DIR = path.join(REPO_ROOT, "src/components/Icons");
const OUT = path.join(ICONS_DIR, "Icons.test.tsx");
const MANIFEST_PATH = path.join(__dirname, "icons.manifest.json");

const manifest = fs.existsSync(MANIFEST_PATH)
  ? JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf8"))
  : { icons: [] };
const propBased = new Map(manifest.icons.map((i) => [i.name, i]));

const files = fs
  .readdirSync(ICONS_DIR)
  .filter((f) => f.endsWith(".tsx") && !f.endsWith(".test.tsx"))
  .map((f) => f.replace(/\.tsx$/, ""))
  .filter((n) => n !== "BaseIcon")
  .sort();

const imports = files.map((n) => `import { ${n} } from "./${n}";`).join("\n");

const legacyEntries = files
  .filter((n) => !propBased.has(n))
  .map((n) => `  { name: ${JSON.stringify(n)}, Component: ${n} },`)
  .join("\n");

const propBasedEntries = files
  .filter((n) => propBased.has(n))
  .map((n) => {
    const m = propBased.get(n);
    return `  { name: ${JSON.stringify(n)}, Component: ${n}, hasFilled: ${m.hasFilled} },`;
  })
  .join("\n");

const body = `import { render } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
${imports}

const legacyIcons = [
${legacyEntries}
];

const propBasedIcons = [
${propBasedEntries}
];

describe("Icons", () => {
  for (const { name, Component } of [...legacyIcons, ...propBasedIcons]) {
    describe(name, () => {
      it("renders an SVG element", () => {
        const { container } = render(<Component />);
        expect(container.querySelector("svg")).toBeInTheDocument();
      });

      it("applies aria-hidden by default", () => {
        const { container } = render(<Component />);
        expect(container.querySelector("svg")).toHaveAttribute(
          "aria-hidden",
          "true",
        );
      });

      it("allows aria-hidden override for standalone usage", () => {
        const { container } = render(
          <Component aria-hidden={false} role="img" aria-label="example" />,
        );
        expect(container.querySelector("svg")).toHaveAttribute(
          "aria-hidden",
          "false",
        );
      });

      it("has a default size class", () => {
        const { container } = render(<Component />);
        expect(container.querySelector("svg")?.getAttribute("class")).toMatch(
          /size-\\d/,
        );
      });

      it("allows size override via className", () => {
        const { container } = render(<Component className="size-10" />);
        expect(container.querySelector("svg")).toHaveClass("size-10");
      });

      it("applies custom className", () => {
        const { container } = render(<Component className="custom-icon" />);
        expect(container.querySelector("svg")).toHaveClass("custom-icon");
      });

      it("forwards ref", () => {
        const ref = createRef<SVGSVGElement>();
        render(<Component ref={ref} />);
        expect(ref.current).toBeInstanceOf(SVGSVGElement);
      });

      it("has no accessibility violations", async () => {
        const { container } = render(
          <Component role="img" aria-label={name} aria-hidden={false} />,
        );
        expect(await axe(container)).toHaveNoViolations();
      });
    });
  }

  for (const { name, Component, hasFilled } of propBasedIcons) {
    describe(\`\${name} (prop-based)\`, () => {
      it("renders each size with a matching viewBox", () => {
        for (const size of [16, 24, 32] as const) {
          const { container } = render(<Component size={size} />);
          const svg = container.querySelector("svg");
          expect(svg).toHaveAttribute("viewBox", \`0 0 \${size} \${size}\`);
        }
      });

      if (hasFilled) {
        it("renders different geometry for filled vs outlined in at least one size", () => {
          const diffs = ([16, 24, 32] as const).map((size) => {
            const { container: outlined } = render(<Component size={size} />);
            const { container: filled } = render(<Component size={size} filled />);
            const o = outlined.querySelector("svg")?.innerHTML ?? "";
            const f = filled.querySelector("svg")?.innerHTML ?? "";
            return o !== "" && f !== "" && o !== f;
          });
          expect(diffs.some(Boolean)).toBe(true);
        });
      } else {
        it("accepts the filled prop without error (variant unavailable)", () => {
          const { container } = render(<Component filled />);
          expect(container.querySelector("svg")).toBeInTheDocument();
        });
      }
    });
  }
});
`;

fs.writeFileSync(OUT, body);
console.log(
  `Wrote tests for ${files.length} icons (${propBasedEntries ? propBasedEntries.split("\n").length : 0} prop-based) to ${OUT}`,
);

const { spawnSync } = await import("node:child_process");
const result = spawnSync("pnpm", ["biome", "check", OUT, "--write"], {
  cwd: REPO_ROOT,
  stdio: "inherit",
});
if (result.status !== 0 && result.status !== 1) {
  console.error("biome format pass failed with status", result.status);
  process.exit(result.status ?? 1);
}
