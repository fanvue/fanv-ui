#!/usr/bin/env node
/**
 * Regenerates src/docs/Icons.stories.tsx with the full icon set, indexed
 * against scripts/icons.manifest.json so prop-based icons render with the
 * size/filled controls.
 *
 * Tag metadata lives in scripts/icon-tags.json so the generator is
 * idempotent and tags are not lost when adding new icons.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..");
const ICONS_DIR = path.join(REPO_ROOT, "src/components/Icons");
const TAGS_FILE = path.join(__dirname, "icon-tags.json");
const MANIFEST_PATH = path.join(__dirname, "icons.manifest.json");
const OUT = path.join(REPO_ROOT, "src/docs/Icons.stories.tsx");

const FIGMA_URL =
  "https://www.figma.com/design/S8zFdcOjt4qN4PrwntuCdt/Fanvue-Library?node-id=16626-13603";

const tagMap = fs.existsSync(TAGS_FILE) ? JSON.parse(fs.readFileSync(TAGS_FILE, "utf8")) : {};
const manifest = fs.existsSync(MANIFEST_PATH)
  ? JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf8"))
  : { icons: [] };
const propBasedSet = new Set(manifest.icons.map((i) => i.name));

const files = fs
  .readdirSync(ICONS_DIR)
  .filter((f) => f.endsWith(".tsx") && !f.endsWith(".test.tsx"))
  .map((f) => f.replace(/\.tsx$/, ""))
  .filter((n) => n !== "BaseIcon")
  .sort();

const imports = files.map((n) => `import { ${n} } from "../components/Icons/${n}";`).join("\n");

const entries = files
  .map((n) => {
    const tags = tagMap[n] ?? [];
    return `  { name: "${n}", component: ${n}, tags: ${JSON.stringify(tags)}, propBased: ${propBasedSet.has(n)} },`;
  })
  .join("\n");

const body = `import type { Meta, StoryObj } from "@storybook/react";
import { type ComponentType, useEffect, useRef, useState } from "react";
${imports}

type IconEntry = {
  name: string;
  // biome-ignore lint/suspicious/noExplicitAny: heterogeneous prop shapes (prop-based vs legacy).
  component: ComponentType<any>;
  tags: string[];
  propBased: boolean;
};

const meta = {
  title: "Foundations/Icons",
  parameters: {
    layout: "fullscreen",
    controls: { disable: true },
    actions: { disable: true },
    design: {
      type: "figma",
      url: "${FIGMA_URL}",
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

const icons: IconEntry[] = [
${entries}
];

type SizeOption = { label: string; className: string; numeric: 16 | 24 | 32 };
const SIZE_OPTIONS: SizeOption[] = [
  { label: "16", className: "size-4", numeric: 16 },
  { label: "24", className: "size-6", numeric: 24 },
  { label: "32", className: "size-8", numeric: 32 },
];

function IconCard({
  entry,
  sizeClass,
  numeric,
  filled,
}: {
  entry: IconEntry;
  sizeClass: string;
  numeric: 16 | 24 | 32;
  filled: boolean;
}) {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);
  const Icon = entry.component;

  const importText = \`import { \${entry.name} } from "@fanvue/ui";\`;

  const handleCopy = () => {
    navigator.clipboard.writeText(importText).then(() => {
      setCopied(true);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setCopied(false), 1500);
    });
  };

  const propExtras: Record<string, unknown> = {};
  if (entry.propBased) {
    propExtras.size = numeric;
    if (filled) propExtras.filled = true;
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        padding: 16,
        borderRadius: 8,
        border: "1px solid var(--color-neutral-alphas-100)",
        backgroundColor: copied
          ? "var(--color-success-surface)"
          : "var(--color-neutral-alphas-100)",
        cursor: "pointer",
        transition: "background-color 150ms, border-color 150ms",
        width: "100%",
        position: "relative",
      }}
      title={\`Click to copy: \${importText}\`}
    >
      {entry.propBased && (
        <span
          aria-hidden="true"
          style={{
            position: "absolute",
            top: 4,
            right: 6,
            fontSize: 9,
            fontFamily: "monospace",
            color: "var(--color-content-tertiary)",
          }}
        >
          v2
        </span>
      )}
      <Icon
        className={sizeClass}
        style={{ color: "var(--color-content-primary)" }}
        {...propExtras}
      />
      <span
        style={{
          fontSize: 11,
          fontFamily: "monospace",
          color: copied ? "var(--color-success-content)" : "var(--color-content-secondary)",
          textAlign: "center",
          wordBreak: "break-all",
        }}
      >
        {copied ? "Copied!" : entry.name}
      </span>
    </button>
  );
}

function IconGallery() {
  const [search, setSearch] = useState("");
  const [sizeLabel, setSizeLabel] = useState<"16" | "24" | "32">("24");
  const [filled, setFilled] = useState(false);

  const size: SizeOption = SIZE_OPTIONS.find((s) => s.label === sizeLabel) ?? {
    label: "24",
    className: "size-6",
    numeric: 24,
  };

  const filtered = icons.filter((icon) => {
    const q = search.toLowerCase();
    if (!q) return true;
    return icon.name.toLowerCase().includes(q) || icon.tags.some((tag) => tag.includes(q));
  });

  return (
    <div style={{ padding: "40px 48px", maxWidth: 960, fontFamily: "Inter, sans-serif" }}>
      <h1
        style={{
          fontSize: 32,
          fontWeight: 800,
          color: "var(--color-content-primary)",
          margin: "0 0 8px",
        }}
      >
        Icons
      </h1>
      <p
        style={{
          fontSize: 16,
          color: "var(--color-content-secondary)",
          margin: "0 0 12px",
          maxWidth: 640,
          lineHeight: 1.5,
        }}
      >
        {icons.length} icons available. Icons marked{" "}
        <code
          style={{
            fontSize: 12,
            fontFamily: "monospace",
            padding: "1px 4px",
            backgroundColor: "var(--color-neutral-alphas-100)",
            borderRadius: 3,
          }}
        >
          v2
        </code>{" "}
        support the prop-based API with dedicated path data at 16, 24, and 32 px sizes plus
        an outlined/filled toggle.
      </p>

      <div style={{ display: "flex", gap: 8, margin: "0 0 12px", flexWrap: "wrap" }}>
        <code
          style={{
            fontSize: 13,
            fontFamily: "monospace",
            color: "var(--color-content-tertiary)",
            padding: "8px 12px",
            backgroundColor: "var(--color-neutral-alphas-100)",
            borderRadius: 6,
          }}
        >
          {'<HeartIcon size={24} filled />'}
        </code>
      </div>

      <div
        style={{
          display: "flex",
          gap: 12,
          margin: "24px 0 24px",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <input
          type="text"
          placeholder="Search icons..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            flex: 1,
            minWidth: 200,
            maxWidth: 320,
            padding: "8px 12px",
            fontSize: 14,
            borderRadius: 6,
            border: "1px solid var(--color-neutral-alphas-200)",
            backgroundColor: "var(--color-surface-inputs)",
            color: "var(--color-content-primary)",
            outline: "none",
          }}
        />
        <div style={{ display: "flex", gap: 4 }}>
          {SIZE_OPTIONS.map((opt) => (
            <button
              key={opt.label}
              type="button"
              onClick={() => setSizeLabel(opt.label as "16" | "24" | "32")}
              style={{
                padding: "6px 10px",
                fontSize: 12,
                fontFamily: "monospace",
                borderRadius: 4,
                border: "1px solid var(--color-neutral-alphas-200)",
                backgroundColor:
                  sizeLabel === opt.label
                    ? "var(--color-brand-secondary-default)"
                    : "var(--color-neutral-alphas-100)",
                color:
                  sizeLabel === opt.label ? "#fff" : "var(--color-content-secondary)",
                cursor: "pointer",
              }}
            >
              {opt.label}px
            </button>
          ))}
        </div>
        <label
          style={{
            display: "inline-flex",
            gap: 6,
            alignItems: "center",
            fontSize: 12,
            fontFamily: "monospace",
            color: "var(--color-content-secondary)",
            cursor: "pointer",
          }}
        >
          <input
            type="checkbox"
            checked={filled}
            onChange={(e) => setFilled(e.target.checked)}
          />
          filled
        </label>
      </div>

      {filtered.length === 0 ? (
        <p style={{ color: "var(--color-content-secondary)", fontSize: 14, padding: "40px 0" }}>
          No icons matching "{search}".
        </p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))",
            gap: 8,
          }}
        >
          {filtered.map((entry) => (
            <IconCard
              key={entry.name}
              entry={entry}
              sizeClass={size.className}
              numeric={size.numeric}
              filled={filled}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export const Gallery: Story = {
  render: () => <IconGallery />,
};
`;

fs.writeFileSync(OUT, body);
console.log(`Wrote ${files.length} icon stories to ${OUT}`);

const { spawnSync } = await import("node:child_process");
const result = spawnSync("pnpm", ["biome", "check", OUT, "--write"], {
  cwd: REPO_ROOT,
  stdio: "inherit",
});
if (result.status !== 0 && result.status !== 1) {
  console.error("biome format pass failed with status", result.status);
  process.exit(result.status ?? 1);
}
