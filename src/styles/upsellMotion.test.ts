import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const css = readFileSync(join(process.cwd(), "src/styles/base.css"), "utf-8");

function utilityBlock(name: string): string {
  const start = css.indexOf(`@utility ${name} {`);
  expect(start).toBeGreaterThan(-1);
  let depth = 0;
  for (let i = css.indexOf("{", start); i < css.length; i++) {
    if (css[i] === "{") depth++;
    if (css[i] === "}" && --depth === 0) return css.slice(start, i + 1);
  }
  throw new Error(`Unclosed @utility ${name}`);
}

describe("upsell motion", () => {
  it("spins the rim highlight only when the user has not asked for reduced motion", () => {
    const shine = utilityBlock("fv-upsell-shine");
    const media = shine.indexOf("@media (prefers-reduced-motion: no-preference)");
    expect(media).toBeGreaterThan(-1);
    expect(shine.indexOf("animation: fv-upsell-spin")).toBeGreaterThan(media);
    expect(shine.match(/animation:/g)).toHaveLength(1);
  });

  it("keeps the static upsell surface free of animation", () => {
    expect(utilityBlock("fv-upsell")).not.toMatch(/animation|transition/);
  });
});
