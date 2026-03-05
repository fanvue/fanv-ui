import type { Meta, StoryObj } from "@storybook/react";
import { useEffect, useState } from "react";

const meta = {
  title: "Foundations/Token Integrity",
  parameters: {
    layout: "fullscreen",
    controls: { disable: true },
    actions: { disable: true },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

/**
 * Subset of primitive tokens that semantic tokens reference via var().
 * If any of these resolve to empty, the semantic layer is broken.
 */
const PRIMITIVE_TOKENS = [
  "--primitives-color-gray-black",
  "--primitives-color-gray-white",
  "--primitives-color-gray-50",
  "--primitives-color-gray-100",
  "--primitives-color-gray-200",
  "--primitives-color-gray-300",
  "--primitives-color-gray-400",
  "--primitives-color-gray-500",
  "--primitives-color-gray-700",
  "--primitives-color-gray-800",
  "--primitives-color-gray-900",
  "--primitives-color-gray-950",
  "--primitives-color-green-400",
  "--primitives-color-green-500",
  "--primitives-color-purple-400",
  "--primitives-color-purple-500",
  "--primitives-color-purple-600",
  "--primitives-color-red-50",
  "--primitives-color-red-300",
  "--primitives-color-red-400",
  "--primitives-color-red-600",
  "--primitives-color-red-700",
  "--primitives-color-red-950",
  "--primitives-color-amber-50",
  "--primitives-color-amber-300",
  "--primitives-color-amber-400",
  "--primitives-color-amber-600",
  "--primitives-color-amber-700",
  "--primitives-color-amber-900",
  "--primitives-color-blue-50",
  "--primitives-color-blue-300",
  "--primitives-color-blue-500",
  "--primitives-color-blue-600",
  "--primitives-color-blue-700",
  "--primitives-color-blue-900",
  "--primitives-color-blackalpha-500",
  "--primitives-color-blackalpha-700",
  "--primitives-color-blackalpha-800",
  "--primitives-color-whitealpha-600",
  "--primitives-color-whitealpha-700",
  "--primitives-color-whitealpha-800",
  "--primitives-color-whitealpha-900",
  "--primitives-color-whitealpha-950",
  "--primitives-color-emerald-green-50",
  "--primitives-color-emerald-green-300",
  "--primitives-color-emerald-green-600",
  "--primitives-color-emerald-green-700",
  "--primitives-color-emerald-green-900",
] as const;

/** Semantic tokens that must resolve to a real color value. */
const SEMANTIC_TOKENS = [
  "--color-foreground-default",
  "--color-foreground-secondary",
  "--color-foreground-inverse",
  "--color-foreground-tertiary",
  "--color-surface-page",
  "--color-surface-container",
  "--color-surface-containerraised",
  "--color-surface-modal",
  "--color-surface-pageinverse",
  "--color-surface-input",
  "--color-surface-behindpage",
  "--color-success-default",
  "--color-success-background",
  "--color-success-border",
  "--color-warning-default",
  "--color-warning-background",
  "--color-warning-border",
  "--color-error-default",
  "--color-error-background",
  "--color-error-border",
  "--color-info-default",
  "--color-info-background",
  "--color-info-border",
  "--color-brand-accent-default",
  "--color-brand-secondary-default",
  "--color-ring",
] as const;

type TokenResult = { token: string; raw: string; computed: string; ok: boolean };

function resolveTokens(tokens: readonly string[]): TokenResult[] {
  const style = getComputedStyle(document.documentElement);
  return tokens.map((token) => {
    const raw = style.getPropertyValue(token).trim();
    // Create a temporary element to resolve var() chains to a final value
    const el = document.createElement("div");
    el.style.color = `var(${token})`;
    document.body.appendChild(el);
    const computed = getComputedStyle(el).color;
    document.body.removeChild(el);
    // A missing / unresolved token typically yields "" or "rgba(0, 0, 0, 0)"
    const ok = raw !== "" && computed !== "" && computed !== "rgba(0, 0, 0, 0)";
    return { token, raw, computed, ok };
  });
}

function TokenTable({ title, results }: { title: string; results: TokenResult[] }) {
  const pass = results.filter((r) => r.ok).length;
  const fail = results.length - pass;

  return (
    <div style={{ marginBottom: 32 }}>
      <h2
        style={{
          fontFamily: "Inter, sans-serif",
          fontSize: 20,
          fontWeight: 700,
          marginBottom: 8,
          color: "var(--color-foreground-default, #151515)",
        }}
      >
        {title}{" "}
        <span style={{ fontWeight: 400, fontSize: 14 }}>
          ({pass} pass{fail > 0 ? `, ${fail} FAIL` : ""})
        </span>
      </h2>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          fontFamily: "monospace",
          fontSize: 13,
        }}
      >
        <thead>
          <tr style={{ textAlign: "left", borderBottom: "2px solid #e5e5e5" }}>
            <th style={{ padding: "6px 12px" }}>Status</th>
            <th style={{ padding: "6px 12px" }}>Token</th>
            <th style={{ padding: "6px 12px" }}>Raw value</th>
            <th style={{ padding: "6px 12px" }}>Computed</th>
            <th style={{ padding: "6px 12px" }}>Preview</th>
          </tr>
        </thead>
        <tbody>
          {results.map((r) => (
            <tr
              key={r.token}
              style={{
                borderBottom: "1px solid #f0f0f0",
                background: r.ok ? undefined : "#fde8e8",
              }}
            >
              <td style={{ padding: "4px 12px" }}>{r.ok ? "OK" : "FAIL"}</td>
              <td style={{ padding: "4px 12px" }}>{r.token}</td>
              <td style={{ padding: "4px 12px" }}>{r.raw || "(empty)"}</td>
              <td style={{ padding: "4px 12px" }}>{r.computed}</td>
              <td style={{ padding: "4px 12px" }}>
                <div
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: 4,
                    border: "1px solid #ccc",
                    backgroundColor: `var(${r.token})`,
                  }}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/**
 * Verifies that primitive and semantic design tokens are defined and resolve
 * to real color values in the current build. This catches CSS tree-shaking
 * regressions where Tailwind v4 strips `:root` custom property definitions.
 */
export const Audit: Story = {
  render: () => {
    const [primitiveResults, setPrimitiveResults] = useState<TokenResult[]>([]);
    const [semanticResults, setSemanticResults] = useState<TokenResult[]>([]);

    useEffect(() => {
      setPrimitiveResults(resolveTokens(PRIMITIVE_TOKENS));
      setSemanticResults(resolveTokens(SEMANTIC_TOKENS));
    }, []);

    const allOk = [...primitiveResults, ...semanticResults].every((r) => r.ok);

    return (
      <div style={{ padding: 32, maxWidth: 960 }}>
        <h1
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: 28,
            fontWeight: 700,
            marginBottom: 4,
            color: "var(--color-foreground-default, #151515)",
          }}
        >
          Token Integrity Audit
        </h1>
        <p
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: 14,
            marginBottom: 24,
            color: "#737373",
          }}
        >
          Checks that primitive and semantic CSS custom properties survive production builds.
          Failures indicate tree-shaking has stripped token definitions.
        </p>

        <div
          style={{
            padding: "12px 16px",
            borderRadius: 8,
            marginBottom: 24,
            fontFamily: "Inter, sans-serif",
            fontWeight: 600,
            fontSize: 14,
            background: allOk ? "#e6fff5" : "#fdecec",
            color: allOk ? "#00874c" : "#e33d3d",
          }}
        >
          {allOk
            ? `All ${primitiveResults.length + semanticResults.length} tokens resolved successfully`
            : `Some tokens failed to resolve — check for CSS tree-shaking issues`}
        </div>

        <TokenTable title="Primitive Tokens" results={primitiveResults} />
        <TokenTable title="Semantic Tokens" results={semanticResults} />
      </div>
    );
  },
};
