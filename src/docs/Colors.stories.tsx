import type { Meta, StoryObj } from "@storybook/react";
import { useEffect, useRef, useState } from "react";

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

const colorGroups: ColorGroup[] = [
  {
    title: "Primary",
    description: "Core text and UI element colors. Adapts between dark and light themes.",
    tokens: [
      { name: "50", variable: "--color-primary-50", tailwind: "primary-50" },
      { name: "100", variable: "--color-primary-100", tailwind: "primary-100" },
      { name: "200", variable: "--color-primary-200", tailwind: "primary-200" },
      { name: "300", variable: "--color-primary-300", tailwind: "primary-300" },
      { name: "400", variable: "--color-primary-400", tailwind: "primary-400" },
      { name: "500", variable: "--color-primary-500", tailwind: "primary-500" },
    ],
  },
  {
    title: "Neutral",
    description: "Subtle tones for borders, dividers, and secondary surfaces.",
    tokens: [
      { name: "50", variable: "--color-neutral-50", tailwind: "neutral-50" },
      { name: "100", variable: "--color-neutral-100", tailwind: "neutral-100" },
      { name: "200", variable: "--color-neutral-200", tailwind: "neutral-200" },
      { name: "250", variable: "--color-neutral-250", tailwind: "neutral-250" },
      { name: "300", variable: "--color-neutral-300", tailwind: "neutral-300" },
      { name: "350", variable: "--color-neutral-350", tailwind: "neutral-350" },
      { name: "400", variable: "--color-neutral-400", tailwind: "neutral-400" },
      { name: "500", variable: "--color-neutral-500", tailwind: "neutral-500" },
    ],
  },
  {
    title: "Body",
    description: "Text colors and constant values that don't change with theme.",
    tokens: [
      { name: "100", variable: "--color-body-100", tailwind: "body-100" },
      { name: "200", variable: "--color-body-200", tailwind: "body-200" },
      { name: "300", variable: "--color-body-300", tailwind: "body-300" },
      { name: "400", variable: "--color-body-400", tailwind: "body-400" },
      {
        name: "Black Solid",
        variable: "--color-body-black-solid-constant",
        tailwind: "body-black-solid-constant",
      },
      {
        name: "White Solid",
        variable: "--color-body-white-solid-constant",
        tailwind: "body-white-solid-constant",
      },
    ],
  },
  {
    title: "Background",
    description: "Surface and overlay colors for layouts and containers.",
    tokens: [
      { name: "0", variable: "--color-background-0", tailwind: "background-0" },
      { name: "1", variable: "--color-background-1", tailwind: "background-1" },
      { name: "150", variable: "--color-background-150", tailwind: "background-150" },
      { name: "200", variable: "--color-background-200", tailwind: "background-200" },
      { name: "250", variable: "--color-background-250", tailwind: "background-250" },
      { name: "350", variable: "--color-background-350", tailwind: "background-350" },
      { name: "400", variable: "--color-background-400", tailwind: "background-400" },
      { name: "500", variable: "--color-background-500", tailwind: "background-500" },
      { name: "600", variable: "--color-background-600", tailwind: "background-600" },
      { name: "700", variable: "--color-background-700", tailwind: "background-700" },
      { name: "800", variable: "--color-background-800", tailwind: "background-800" },
      {
        name: "Inverse Solid",
        variable: "--color-background-inverse-solid",
        tailwind: "background-inverse-solid",
      },
      { name: "Solid", variable: "--color-background-solid", tailwind: "background-solid" },
      {
        name: "Inverse Solid Light",
        variable: "--color-background-inverse-solid-light",
        tailwind: "background-inverse-solid-light",
      },
      {
        name: "White Solid Constant",
        variable: "--color-background-white-solid-constant",
        tailwind: "background-white-solid-constant",
      },
    ],
  },
  {
    title: "Success",
    description: "Positive feedback and confirmation states.",
    tokens: [
      { name: "50", variable: "--color-success-50", tailwind: "success-50" },
      { name: "500", variable: "--color-success-500", tailwind: "success-500" },
    ],
  },
  {
    title: "Warning",
    description: "Caution and attention states.",
    tokens: [
      { name: "50", variable: "--color-warning-50", tailwind: "warning-50" },
      { name: "500", variable: "--color-warning-500", tailwind: "warning-500" },
    ],
  },
  {
    title: "Error",
    description: "Destructive and error states.",
    tokens: [
      { name: "50", variable: "--color-error-50", tailwind: "error-50" },
      { name: "500", variable: "--color-error-500", tailwind: "error-500" },
    ],
  },
  {
    title: "Info",
    description: "Informational feedback states.",
    tokens: [
      { name: "50", variable: "--color-info-50", tailwind: "info-50" },
      { name: "500", variable: "--color-info-500", tailwind: "info-500" },
    ],
  },
  {
    title: "Hover",
    description: "Interactive hover state overlays.",
    tokens: [
      { name: "100", variable: "--color-hover-100", tailwind: "hover-100" },
      { name: "200", variable: "--color-hover-200", tailwind: "hover-200" },
      { name: "300", variable: "--color-hover-300", tailwind: "hover-300" },
      { name: "400", variable: "--color-hover-400", tailwind: "hover-400" },
    ],
  },
  {
    title: "Link",
    description: "Anchor and interactive link colors.",
    tokens: [
      { name: "500", variable: "--color-link-500", tailwind: "link-500" },
      { name: "600", variable: "--color-link-600", tailwind: "link-600" },
    ],
  },
  {
    title: "Disabled",
    description: "Disabled and inactive element states.",
    tokens: [
      { name: "100", variable: "--color-disabled-100", tailwind: "disabled-100" },
      { name: "400", variable: "--color-disabled-400", tailwind: "disabled-400" },
      { name: "500", variable: "--color-disabled-500", tailwind: "disabled-500" },
      { name: "600", variable: "--color-disabled-600", tailwind: "disabled-600" },
    ],
  },
  {
    title: "Chart",
    description: "Data visualization palette for charts and graphs.",
    tokens: [
      { name: "50", variable: "--color-chart-50", tailwind: "chart-50" },
      { name: "100", variable: "--color-chart-100", tailwind: "chart-100" },
      { name: "200", variable: "--color-chart-200", tailwind: "chart-200" },
      { name: "300", variable: "--color-chart-300", tailwind: "chart-300" },
      { name: "400", variable: "--color-chart-400", tailwind: "chart-400" },
      { name: "500", variable: "--color-chart-500", tailwind: "chart-500" },
      { name: "600", variable: "--color-chart-600", tailwind: "chart-600" },
    ],
  },
  {
    title: "Brand",
    description: "Fanvue brand identity colors.",
    tokens: [
      { name: "Green 50", variable: "--color-brand-green-50", tailwind: "brand-green-50" },
      { name: "Green 500", variable: "--color-brand-green-500", tailwind: "brand-green-500" },
      { name: "Pink 50", variable: "--color-brand-pink-50", tailwind: "brand-pink-50" },
      { name: "Pink 500", variable: "--color-brand-pink-500", tailwind: "brand-pink-500" },
      { name: "Purple 50", variable: "--color-brand-purple-50", tailwind: "brand-purple-50" },
      { name: "Purple 500", variable: "--color-brand-purple-500", tailwind: "brand-purple-500" },
    ],
  },
  {
    title: "Special",
    description: "Accent colors for premium and special features.",
    tokens: [
      { name: "50", variable: "--color-special-50", tailwind: "special-50" },
      { name: "500", variable: "--color-special-500", tailwind: "special-500" },
    ],
  },
];

function resolveColor(variable: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(variable).trim();
}

function Swatch({ token }: { token: ColorToken }) {
  const ref = useRef<HTMLDivElement>(null);
  const [hex, setHex] = useState("");

  useEffect(() => {
    const value = resolveColor(token.variable);
    setHex(value);
  });

  const checkerboard = "repeating-conic-gradient(#e0e0e0 0% 25%, #fff 0% 50%) 0 0 / 12px 12px";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6, minWidth: 0 }}>
      <div
        ref={ref}
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
        <div style={{ fontWeight: 600, color: "var(--color-body-100)" }}>{token.name}</div>
        <div
          style={{
            fontFamily: "monospace",
            fontSize: 11,
            color: "var(--color-body-200)",
            wordBreak: "break-all",
          }}
        >
          {hex}
        </div>
        <div
          style={{
            fontFamily: "monospace",
            fontSize: 10,
            color: "var(--color-primary-300)",
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
          color: "var(--color-body-100)",
          margin: "0 0 4px",
        }}
      >
        {group.title}
      </h3>
      {group.description && (
        <p
          style={{
            fontSize: 14,
            color: "var(--color-body-200)",
            margin: "0 0 16px",
          }}
        >
          {group.description}
        </p>
      )}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${Math.min(group.tokens.length, 8)}, minmax(80px, 1fr))`,
          gap: 16,
        }}
      >
        {group.tokens.map((token) => (
          <Swatch key={token.variable} token={token} />
        ))}
      </div>
    </section>
  );
}

export const Palette: Story = {
  render: () => (
    <div style={{ padding: "40px 48px", maxWidth: 960, fontFamily: "Inter, sans-serif" }}>
      <h1
        style={{
          fontSize: 32,
          fontWeight: 800,
          color: "var(--color-body-100)",
          margin: "0 0 8px",
        }}
      >
        Colors
      </h1>
      <p
        style={{
          fontSize: 16,
          color: "var(--color-body-200)",
          margin: "0 0 12px",
          maxWidth: 640,
          lineHeight: 1.5,
        }}
      >
        Our color tokens are exported from Figma and auto-generated into CSS custom properties.
        Every token adapts between light and dark themes. Use the theme toggle in the toolbar above
        to preview both modes.
      </p>
      <p
        style={{
          fontSize: 13,
          fontFamily: "monospace",
          color: "var(--color-primary-300)",
          margin: "0 0 40px",
          padding: "8px 12px",
          backgroundColor: "var(--color-background-600)",
          borderRadius: 6,
          display: "inline-block",
        }}
      >
        @import "fanv-ui/styles/theme.css";
      </p>

      {colorGroups.map((group) => (
        <ColorGroupSection key={group.title} group={group} />
      ))}

      <section
        style={{ marginTop: 48, paddingTop: 24, borderTop: "1px solid var(--color-neutral-200)" }}
      >
        <h3
          style={{
            fontSize: 18,
            fontWeight: 700,
            color: "var(--color-body-100)",
            margin: "0 0 4px",
          }}
        >
          Shadows
        </h3>
        <p
          style={{
            fontSize: 14,
            color: "var(--color-body-200)",
            margin: "0 0 16px",
          }}
        >
          Focus ring and background blur tokens for interactive element states.
        </p>
        <div style={{ display: "flex", gap: 32 }}>
          {[
            { name: "Focus Ring", variable: "--shadow-focus-ring", tailwind: "shadow-focus-ring" },
            {
              name: "Background Blur",
              variable: "--shadow-background-blur",
              tailwind: "shadow-background-blur",
            },
          ].map((shadow) => (
            <div key={shadow.name} style={{ textAlign: "center" }}>
              <div
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 12,
                  backgroundColor: "var(--color-background-200)",
                  boxShadow: `var(${shadow.variable})`,
                  margin: "0 auto 8px",
                }}
              />
              <div style={{ fontSize: 13, fontWeight: 600, color: "var(--color-body-100)" }}>
                {shadow.name}
              </div>
              <div
                style={{
                  fontFamily: "monospace",
                  fontSize: 10,
                  color: "var(--color-primary-300)",
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
