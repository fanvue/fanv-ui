import type { Meta, StoryObj } from "@storybook/react";
import { useEffect, useState } from "react";

const meta = {
  title: "Foundations/Colors",
  parameters: {
    layout: "fullscreen",
    controls: { disable: true },
    actions: { disable: true },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

type ColorToken = {
  name: string;
  variable: string;
  tailwind: string;
};

type ColorGroup = {
  title: string;
  description?: string;
  tokens: ColorToken[];
};

const primitiveGroups: ColorGroup[] = [
  {
    title: "Gray",
    description: "Foundation neutrals used by the semantic layer.",
    tokens: [
      { name: "50", variable: "--primitives-color-gray-50", tailwind: "primitives-color-gray-50" },
      {
        name: "100",
        variable: "--primitives-color-gray-100",
        tailwind: "primitives-color-gray-100",
      },
      {
        name: "200",
        variable: "--primitives-color-gray-200",
        tailwind: "primitives-color-gray-200",
      },
      {
        name: "300",
        variable: "--primitives-color-gray-300",
        tailwind: "primitives-color-gray-300",
      },
      {
        name: "400",
        variable: "--primitives-color-gray-400",
        tailwind: "primitives-color-gray-400",
      },
      {
        name: "500",
        variable: "--primitives-color-gray-500",
        tailwind: "primitives-color-gray-500",
      },
      {
        name: "600",
        variable: "--primitives-color-gray-600",
        tailwind: "primitives-color-gray-600",
      },
      {
        name: "700",
        variable: "--primitives-color-gray-700",
        tailwind: "primitives-color-gray-700",
      },
      {
        name: "800",
        variable: "--primitives-color-gray-800",
        tailwind: "primitives-color-gray-800",
      },
      {
        name: "900",
        variable: "--primitives-color-gray-900",
        tailwind: "primitives-color-gray-900",
      },
      {
        name: "950",
        variable: "--primitives-color-gray-950",
        tailwind: "primitives-color-gray-950",
      },
      {
        name: "Black",
        variable: "--primitives-color-gray-black",
        tailwind: "primitives-color-gray-black",
      },
      {
        name: "White",
        variable: "--primitives-color-gray-white",
        tailwind: "primitives-color-gray-white",
      },
    ],
  },
  {
    title: "Green",
    description: "Brand accent primitive palette.",
    tokens: Array.from(
      [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950],
      (step) =>
        ({
          name: String(step),
          variable: `--primitives-color-green-${step}`,
          tailwind: `primitives-color-green-${step}`,
        }) satisfies ColorToken,
    ),
  },
  {
    title: "Pink",
    tokens: Array.from(
      [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950],
      (step) =>
        ({
          name: String(step),
          variable: `--primitives-color-pink-${step}`,
          tailwind: `primitives-color-pink-${step}`,
        }) satisfies ColorToken,
    ),
  },
  {
    title: "Purple",
    tokens: Array.from(
      [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950],
      (step) =>
        ({
          name: String(step),
          variable: `--primitives-color-purple-${step}`,
          tailwind: `primitives-color-purple-${step}`,
        }) satisfies ColorToken,
    ),
  },
  {
    title: "Red",
    tokens: Array.from(
      [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950],
      (step) =>
        ({
          name: String(step),
          variable: `--primitives-color-red-${step}`,
          tailwind: `primitives-color-red-${step}`,
        }) satisfies ColorToken,
    ),
  },
  {
    title: "Amber",
    tokens: Array.from(
      [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950],
      (step) =>
        ({
          name: String(step),
          variable: `--primitives-color-amber-${step}`,
          tailwind: `primitives-color-amber-${step}`,
        }) satisfies ColorToken,
    ),
  },
  {
    title: "Blue",
    tokens: Array.from(
      [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950],
      (step) =>
        ({
          name: String(step),
          variable: `--primitives-color-blue-${step}`,
          tailwind: `primitives-color-blue-${step}`,
        }) satisfies ColorToken,
    ),
  },
  {
    title: "Emerald Green",
    tokens: Array.from(
      [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950],
      (step) =>
        ({
          name: String(step),
          variable: `--primitives-color-emerald-green-${step}`,
          tailwind: `primitives-color-emerald-green-${step}`,
        }) satisfies ColorToken,
    ),
  },
  {
    title: "Black Alpha",
    description: "Semi-transparent black for overlays and neutral tinting.",
    tokens: Array.from(
      [0, 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950],
      (step) =>
        ({
          name: String(step),
          variable: `--primitives-color-blackalpha-${step}`,
          tailwind: `primitives-color-blackalpha-${step}`,
        }) satisfies ColorToken,
    ),
  },
  {
    title: "White Alpha",
    description: "Semi-transparent white for overlays and tinting on dark surfaces.",
    tokens: Array.from(
      [0, 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950],
      (step) =>
        ({
          name: String(step),
          variable: `--primitives-color-whitealpha-${step}`,
          tailwind: `primitives-color-whitealpha-${step}`,
        }) satisfies ColorToken,
    ),
  },
];

const semanticGroups: ColorGroup[] = [
  {
    title: "Neutral",
    description: "Subtle tones for borders, dividers, and secondary surfaces.",
    tokens: [
      ...[50, 100, 150, 200, 300, 400, 500, 600, 700, 800, 900, 950].map(
        (step) =>
          ({
            name: String(step),
            variable: `--color-neutral-alphas-${step}`,
            tailwind: `neutral-alphas-${step}`,
          }) satisfies ColorToken,
      ),
    ],
  },
  {
    title: "Content",
    description: "Text and icon colors.",
    tokens: [
      { name: "Primary", variable: "--color-content-primary", tailwind: "content-primary" },
      {
        name: "Secondary",
        variable: "--color-content-secondary",
        tailwind: "content-secondary",
      },
      {
        name: "Tertiary",
        variable: "--color-content-tertiary",
        tailwind: "content-tertiary",
      },
      {
        name: "Primary Inverted",
        variable: "--color-content-primary-inverted",
        tailwind: "content-primary-inverted",
      },
    ],
  },
  {
    title: "Surface",
    description: "Background and container colors for layouts.",
    tokens: [
      { name: "Primary", variable: "--color-surface-primary", tailwind: "surface-primary" },
      {
        name: "Secondary",
        variable: "--color-surface-secondary",
        tailwind: "surface-secondary",
      },
      {
        name: "Tertiary",
        variable: "--color-surface-tertiary",
        tailwind: "surface-tertiary",
      },
      {
        name: "Inputs",
        variable: "--color-inputs-inputs-primary",
        tailwind: "inputs-inputs-primary",
      },
      {
        name: "Inputs Off",
        variable: "--color-inputs-inputs-off",
        tailwind: "inputs-inputs-off",
      },
      {
        name: "Primary Inverted",
        variable: "--color-surface-primary-inverted",
        tailwind: "surface-primary-inverted",
      },
      {
        name: "Purple Muted",
        variable: "--color-surface-purple-muted",
        tailwind: "surface-purple-muted",
      },
      {
        name: "Green Muted",
        variable: "--color-surface-green-muted",
        tailwind: "surface-green-muted",
      },
    ],
  },
  {
    title: "Background",
    description: "Page-level background colors.",
    tokens: [
      { name: "Primary", variable: "--color-background-primary", tailwind: "bg-primary" },
      { name: "Overlay", variable: "--color-background-overlay", tailwind: "bg-overlay" },
    ],
  },
  {
    title: "Brand — Primary",
    description: "Primary brand color (green).",
    tokens: [
      {
        name: "Default",
        variable: "--color-brand-primary-default",
        tailwind: "brand-primary-default",
      },
      { name: "Muted", variable: "--color-brand-primary-muted", tailwind: "brand-primary-muted" },
      { name: "Hover", variable: "--color-brand-primary-hover", tailwind: "brand-primary-hover" },
    ],
  },
  {
    title: "Brand — Secondary",
    description: "Secondary brand color (purple).",
    tokens: [
      {
        name: "Default",
        variable: "--color-brand-secondary-default",
        tailwind: "brand-secondary-default",
      },
      {
        name: "Muted",
        variable: "--color-brand-secondary-muted",
        tailwind: "brand-secondary-muted",
      },
      {
        name: "Hover",
        variable: "--color-brand-secondary-hover",
        tailwind: "brand-secondary-hover",
      },
    ],
  },
  {
    title: "Success",
    description: "Positive feedback and confirmation states.",
    tokens: [
      {
        name: "Surface",
        variable: "--color-success-surface",
        tailwind: "success-surface",
      },
      { name: "Content", variable: "--color-success-content", tailwind: "success-content" },
      { name: "Secondary", variable: "--color-success-secondary", tailwind: "success-secondary" },
    ],
  },
  {
    title: "Warning",
    description: "Caution and attention states.",
    tokens: [
      {
        name: "Surface",
        variable: "--color-warning-surface",
        tailwind: "warning-surface",
      },
      { name: "Content", variable: "--color-warning-content", tailwind: "warning-content" },
      { name: "Secondary", variable: "--color-warning-secondary", tailwind: "warning-secondary" },
    ],
  },
  {
    title: "Error",
    description: "Destructive and error states.",
    tokens: [
      { name: "Surface", variable: "--color-error-surface", tailwind: "error-surface" },
      { name: "Content", variable: "--color-error-content", tailwind: "error-content" },
      { name: "Secondary", variable: "--color-error-secondary", tailwind: "error-secondary" },
    ],
  },
  {
    title: "Info",
    description: "Informational feedback states.",
    tokens: [
      { name: "Surface", variable: "--color-info-surface", tailwind: "info-surface" },
      { name: "Content", variable: "--color-info-content", tailwind: "info-content" },
      { name: "Secondary", variable: "--color-info-secondary", tailwind: "info-secondary" },
    ],
  },
  {
    title: "Link",
    description: "Anchor and interactive link colors.",
    tokens: [
      { name: "Default", variable: "--color-link-default", tailwind: "link-default" },
      { name: "Hover", variable: "--color-link-hover", tailwind: "link-hover" },
    ],
  },
  {
    title: "Special",
    description: "Accent colors for premium and special features.",
    tokens: [
      { name: "Default", variable: "--color-special-default", tailwind: "special-default" },
      {
        name: "Background",
        variable: "--color-special-background",
        tailwind: "special-background",
      },
    ],
  },
  {
    title: "Chart",
    description: "Data visualization palette for charts and graphs.",
    tokens: [
      { name: "Teal", variable: "--color-special-chart-teal", tailwind: "special-chart-teal" },
      { name: "Sky", variable: "--color-special-chart-sky", tailwind: "special-chart-sky" },
      {
        name: "Magenta",
        variable: "--color-special-chart-magenta",
        tailwind: "special-chart-magenta",
      },
      {
        name: "Orange",
        variable: "--color-special-chart-orange",
        tailwind: "special-chart-orange",
      },
      { name: "Gray", variable: "--color-special-chart-gray", tailwind: "special-chart-gray" },
      { name: "Pink", variable: "--color-special-chart-pink", tailwind: "special-chart-pink" },
      {
        name: "Purple",
        variable: "--color-special-chart-purple",
        tailwind: "special-chart-purple",
      },
    ],
  },
  {
    title: "Interaction",
    description: "Focus ring color for keyboard navigation.",
    tokens: [
      { name: "Focus", variable: "--color-interaction-focus", tailwind: "interaction-focus" },
    ],
  },
  {
    title: "Border",
    description: "Border colors for containers and inputs.",
    tokens: [
      { name: "Primary", variable: "--color-border-primary", tailwind: "border-primary" },
      { name: "Strong", variable: "--color-border-strong", tailwind: "border-strong" },
      { name: "Error", variable: "--color-border-error", tailwind: "border-error" },
    ],
  },
  {
    title: "Icons",
    description: "Icon-specific color tokens.",
    tokens: [
      { name: "Primary", variable: "--color-icons-primary", tailwind: "icons-primary" },
      { name: "Secondary", variable: "--color-icons-secondary", tailwind: "icons-secondary" },
      { name: "Tertiary", variable: "--color-icons-tertiary", tailwind: "icons-tertiary" },
      { name: "Brand Green", variable: "--color-icons-brand-green", tailwind: "icons-brand-green" },
      {
        name: "Brand Purple",
        variable: "--color-icons-brand-purple",
        tailwind: "icons-brand-purple",
      },
    ],
  },
  {
    title: "Buttons",
    description: "Button-specific color tokens.",
    tokens: [
      { name: "Primary", variable: "--color-buttons-primary", tailwind: "buttons-primary" },
      {
        name: "Primary Hover",
        variable: "--color-buttons-primary-hover",
        tailwind: "buttons-primary-hover",
      },
      {
        name: "Primary Muted",
        variable: "--color-buttons-primary-muted",
        tailwind: "buttons-primary-muted",
      },
      { name: "Brand", variable: "--color-buttons-brand", tailwind: "buttons-brand" },
      {
        name: "Brand Hover",
        variable: "--color-buttons-brand-hover",
        tailwind: "buttons-brand-hover",
      },
      {
        name: "Brand Muted",
        variable: "--color-buttons-brand-muted",
        tailwind: "buttons-brand-muted",
      },
    ],
  },
];

function resolveColor(variable: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(variable).trim();
}

function Swatch({ token }: { token: ColorToken }) {
  const [hex, setHex] = useState("");

  useEffect(() => {
    setHex(resolveColor(token.variable));
  }, [token.variable]);

  const checkerboard = "repeating-conic-gradient(#e0e0e0 0% 25%, #fff 0% 50%) 0 0 / 12px 12px";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6, minWidth: 0 }}>
      <div
        style={{
          width: "100%",
          aspectRatio: "1",
          borderRadius: 8,
          background: checkerboard,
          position: "relative",
          overflow: "hidden",
          border: "1px solid rgba(128,128,128,0.2)",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: `var(${token.variable})`,
          }}
        />
      </div>
      <div style={{ fontSize: 12, lineHeight: 1.3 }}>
        <div style={{ fontWeight: 600, color: "var(--color-content-primary)" }}>{token.name}</div>
        <div
          style={{
            fontFamily: "monospace",
            fontSize: 11,
            color: "var(--color-content-secondary)",
            wordBreak: "break-all",
          }}
        >
          {hex}
        </div>
        <div
          style={{
            fontFamily: "monospace",
            fontSize: 10,
            color: "var(--color-content-tertiary)",
            marginTop: 2,
          }}
        >
          bg-{token.tailwind}
        </div>
      </div>
    </div>
  );
}

function ColorGroupSection({ group }: { group: ColorGroup }) {
  return (
    <section style={{ marginBottom: 40 }}>
      <h3
        style={{
          fontSize: 18,
          fontWeight: 700,
          color: "var(--color-content-primary)",
          margin: "0 0 4px",
        }}
      >
        {group.title}
      </h3>
      {group.description && (
        <p
          style={{
            fontSize: 14,
            color: "var(--color-content-secondary)",
            margin: "0 0 16px",
          }}
        >
          {group.description}
        </p>
      )}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${Math.min(group.tokens.length, 13)}, minmax(64px, 1fr))`,
          gap: 12,
        }}
      >
        {group.tokens.map((token) => (
          <Swatch key={token.variable} token={token} />
        ))}
      </div>
    </section>
  );
}

const shadowTokens = [
  { name: "Small", variable: "--shadow-sm", tailwind: "shadow-sm" },
  { name: "Medium", variable: "--shadow-md", tailwind: "shadow-md" },
  { name: "Large", variable: "--shadow-lg", tailwind: "shadow-lg" },
  { name: "Blur Menu", variable: "--shadow-blur-menu", tailwind: "shadow-blur-menu" },
  {
    name: "Blur Floating",
    variable: "--shadow-blur-floating",
    tailwind: "shadow-blur-floating",
  },
  { name: "Focus Ring", variable: "--shadow-focus-ring", tailwind: "shadow-focus-ring" },
];

export const Primitives: Story = {
  render: () => (
    <div style={{ padding: "40px 48px", maxWidth: 1100, fontFamily: "Inter, sans-serif" }}>
      <h1
        style={{
          fontSize: 32,
          fontWeight: 800,
          color: "var(--color-content-primary)",
          margin: "0 0 8px",
        }}
      >
        Primitive Colors
      </h1>
      <p
        style={{
          fontSize: 16,
          color: "var(--color-content-secondary)",
          margin: "0 0 12px",
          maxWidth: 720,
          lineHeight: 1.5,
        }}
      >
        Raw color palette exported from Figma. These are not meant to be used directly in components
        — use the semantic tokens instead. Primitives are the building blocks that semantic tokens
        reference.
      </p>
      <p
        style={{
          fontSize: 13,
          fontFamily: "monospace",
          color: "var(--color-content-tertiary)",
          margin: "0 0 40px",
          padding: "8px 12px",
          backgroundColor: "var(--color-inputs-inputs-primary)",
          borderRadius: 6,
          display: "inline-block",
        }}
      >
        var(--primitives-color-&#123;hue&#125;-&#123;step&#125;)
      </p>

      {primitiveGroups.map((group) => (
        <ColorGroupSection key={group.title} group={group} />
      ))}
    </div>
  ),
};

export const Semantic: Story = {
  render: () => (
    <div style={{ padding: "40px 48px", maxWidth: 1100, fontFamily: "Inter, sans-serif" }}>
      <h1
        style={{
          fontSize: 32,
          fontWeight: 800,
          color: "var(--color-content-primary)",
          margin: "0 0 8px",
        }}
      >
        Semantic Colors
      </h1>
      <p
        style={{
          fontSize: 16,
          color: "var(--color-content-secondary)",
          margin: "0 0 12px",
          maxWidth: 720,
          lineHeight: 1.5,
        }}
      >
        Purpose-driven tokens that adapt between light and dark themes. Use these in all component
        code. Toggle the theme in the toolbar above to preview both modes.
      </p>
      <p
        style={{
          fontSize: 13,
          fontFamily: "monospace",
          color: "var(--color-content-tertiary)",
          margin: "0 0 40px",
          padding: "8px 12px",
          backgroundColor: "var(--color-inputs-inputs-primary)",
          borderRadius: 6,
          display: "inline-block",
        }}
      >
        bg-&#123;token&#125; · text-&#123;token&#125; · border-&#123;token&#125;
      </p>

      {semanticGroups.map((group) => (
        <ColorGroupSection key={group.title} group={group} />
      ))}

      <section
        style={{
          marginTop: 48,
          paddingTop: 24,
          borderTop: "1px solid var(--color-neutral-alphas-200)",
        }}
      >
        <h3
          style={{
            fontSize: 18,
            fontWeight: 700,
            color: "var(--color-content-primary)",
            margin: "0 0 4px",
          }}
        >
          Shadows
        </h3>
        <p
          style={{
            fontSize: 14,
            color: "var(--color-content-secondary)",
            margin: "0 0 16px",
          }}
        >
          Elevation and focus tokens for interactive elements and containers.
        </p>
        <div style={{ display: "flex", gap: 32, flexWrap: "wrap" }}>
          {shadowTokens.map((shadow) => (
            <div key={shadow.name} style={{ textAlign: "center" }}>
              <div
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 12,
                  backgroundColor: "var(--color-surface-primary)",
                  boxShadow: `var(${shadow.variable})`,
                  margin: "0 auto 8px",
                }}
              />
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: "var(--color-content-primary)",
                }}
              >
                {shadow.name}
              </div>
              <div
                style={{
                  fontFamily: "monospace",
                  fontSize: 10,
                  color: "var(--color-content-tertiary)",
                }}
              >
                {shadow.tailwind}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  ),
};
