import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const css = readFileSync(join(process.cwd(), "src/styles/base.css"), "utf-8");

function block(opening: string): string {
  const start = css.indexOf(opening);
  expect(start).toBeGreaterThan(-1);
  let depth = 0;
  for (let i = css.indexOf("{", start); i < css.length; i++) {
    if (css[i] === "{") depth++;
    if (css[i] === "}" && --depth === 0) return css.slice(start, i + 1);
  }
  throw new Error(`Unclosed ${opening}`);
}

const utilityBlock = (name: string) => block(`@utility ${name} {`);

describe("upsell motion", () => {
  it("spins the rim highlight once, only when the user has not asked for reduced motion", () => {
    const shine = utilityBlock("fv-upsell-shine");
    const media = block("@media (prefers-reduced-motion: no-preference)");
    expect(shine).toContain(media);
    expect(media).toMatch(/animation: fv-upsell-spin [^;]* 1;/);
    expect(shine.replace(media, "")).not.toMatch(/animation/);
    expect(shine).not.toMatch(/infinite/);
  });

  it("keeps the static upsell surface free of animation", () => {
    expect(utilityBlock("fv-upsell")).not.toMatch(/animation|transition/);
  });

  it("hides the rim highlight while focused or disabled without replaying it afterwards", () => {
    const shine = utilityBlock("fv-upsell-shine");
    expect(shine).toMatch(/&:focus-visible::after\s*\{\s*visibility: hidden;/);
    expect(shine).not.toMatch(/content: none/);
  });

  it("drops the look when disabled but keeps it on a loading button", () => {
    expect(utilityBlock("fv-upsell")).toMatch(
      /&:disabled:not\(\[aria-busy="true"\]\)\s*\{\s*background-image: none;/,
    );
    expect(utilityBlock("fv-upsell")).toMatch(
      /&:disabled:not\(\[aria-busy="true"\]\)::before\s*\{\s*content: none;/,
    );
    expect(utilityBlock("fv-upsell-shine")).toMatch(
      /&:disabled:not\(\[aria-busy="true"\]\)::after/,
    );
  });

  it("glows without a ring, in brand green on light pages and deep green on dark", () => {
    expect(utilityBlock("fv-upsell")).toMatch(/box-shadow: var\(--fv-upsell-glow\);/);
    expect(css).not.toMatch(/--fv-upsell-ring/);
    expect(block(":root {\n  --fv-upsell-pool")).toMatch(/--fv-upsell-glow:[^;]*green-500/);
    expect(block(".dark {\n  --fv-upsell-glow")).toMatch(
      /--fv-upsell-glow:[^;]*green-800[^;]*green-900/,
    );
  });

  it("reads its colours, glow and timing from upsell tokens rather than primitives", () => {
    for (const name of ["fv-upsell", "fv-upsell-shine"]) {
      const utility = utilityBlock(name);
      expect(utility).toMatch(/var\(--fv-upsell-/);
      expect(utility).not.toMatch(/--primitives-/);
    }
  });

  it("defines every upsell token the utilities read", () => {
    const tokens = block(":root {\n  --fv-upsell-pool");
    for (const token of [
      "--fv-upsell-pool",
      "--fv-upsell-glow",
      "--fv-upsell-shine-color",
      "--fv-upsell-shine-duration",
      "--fv-upsell-shine-easing",
    ]) {
      expect(tokens).toMatch(new RegExp(`${token}:\\s*\\S`));
    }
  });
});
