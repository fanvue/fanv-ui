import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

// Guards against a removed v2 token name resurfacing in shipped source. A removed token
// produces no CSS (empty value / no-op utility), so a missed rename fails silently in the
// browser — this test turns that into a build failure. Driven by the published rename map.
const map = JSON.parse(
  readFileSync(join(process.cwd(), "src/docs/token-migration-map-v3.json"), "utf-8"),
);

// The migration guide and the maps themselves document old names on purpose — scan source.
const ROOTS = ["src/components", "src/styles/theme.css", "src/styles/base.css", "src/App.tsx"];
const EXTS = /\.(tsx?|css)$/;
const PREFIXES = [
  "bg",
  "text",
  "border",
  "ring",
  "ring-offset",
  "from",
  "to",
  "via",
  "fill",
  "stroke",
  "divide",
  "outline",
  "decoration",
  "accent",
  "caret",
  "placeholder",
  "shadow",
];

const walk = (path: string): string[] => {
  if (!statSync(path, { throwIfNoEntry: false })) return [];
  if (statSync(path).isFile()) return EXTS.test(path) ? [path] : [];
  return readdirSync(path).flatMap((name) => walk(join(path, name)));
};

const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const anchored = (token: string) => new RegExp(`(?<![\\w-])${esc(token)}(?![\\w-])`);

// Every removed-token form that should no longer appear in source.
const oldForms: string[] = [
  ...Object.keys(map.colors).flatMap((name: string) => [
    name,
    ...PREFIXES.map((p) => `${p}-${name.replace(/^--color-/, "")}`),
  ]),
  ...Object.keys(map.spacing),
  ...Object.keys(map.typography).filter((name: string) => map.typography[name] !== null),
];

const files = ROOTS.flatMap(walk);

const findHits = (token: string): string[] => {
  const pattern = anchored(token);

  return files.flatMap((file) =>
    readFileSync(file, "utf-8")
      .split("\n")
      .flatMap((line, index) => (pattern.test(line) ? [`${file}:${index + 1}`] : [])),
  );
};

describe("design-token migration leftovers", () => {
  it("scans a non-empty set of source files", () => {
    expect(files.length).toBeGreaterThan(0);
  });

  it.each(oldForms)("no source file still references %s", (token) => {
    const hits = findHits(token);
    expect(hits, `${token} still used in: ${hits.join(", ")}`).toHaveLength(0);
  });
});
