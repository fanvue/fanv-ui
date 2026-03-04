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

const semanticGroups: ColorGroup[] = [
  {
    title: "Foreground",
    description: "Text and icon colors.",
    tokens: [
      { name: "Default", variable: "--color-foreground-default", tailwind: "foreground-default" },
      {
        name: "Secondary",
        variable: "--color-foreground-secondary",
        tailwind: "foreground-secondary",
      },
      {
        name: "Tertiary",
        variable: "--color-foreground-tertiary",
        tailwind: "foreground-tertiary",
      },
      { name: "Inverse", variable: "--color-foreground-inverse", tailwind: "foreground-inverse" },
      {
        name: "On Accent",
        variable: "--color-foreground-onaccent",
        tailwind: "foreground-onaccent",
      },
      {
        name: "On Accent Inverse",
        variable: "--color-foreground-onaccentinverse",
        tailwind: "foreground-onaccentinverse",
      },
    ],
  },
  {
    title: "Surface",
    description: "Background and container colors for layouts.",
    tokens: [
      { name: "Page", variable: "--color-surface-page", tailwind: "surface-page" },
      {
        name: "Page Inverse",
        variable: "--color-surface-pageinverse",
        tailwind: "surface-pageinverse",
      },
      {
        name: "Page Inverse Soft",
        variable: "--color-surface-pageinversesoft",
        tailwind: "surface-pageinversesoft",
      },
      {
        name: "Behind Page",
        variable: "--color-surface-behindpage",
        tailwind: "surface-behindpage",
      },
      {
        name: "Container",
        variable: "--color-surface-container",
        tailwind: "surface-container",
      },
      {
        name: "Container Raised",
        variable: "--color-surface-containerraised",
        tailwind: "surface-containerraised",
      },
      {
        name: "Container Subtle",
        variable: "--color-surface-containersubtle",
        tailwind: "surface-containersubtle",
      },
      { name: "Input", variable: "--color-surface-input", tailwind: "surface-input" },
      { name: "Modal", variable: "--color-surface-modal", tailwind: "surface-modal" },
      { name: "Backdrop", variable: "--color-surface-backdrop", tailwind: "surface-backdrop" },
    ],
  },
  {
    title: "Neutral",
    description: "Borders, dividers, and secondary UI tones.",
    tokens: [
      { name: "50", variable: "--color-neutral-50", tailwind: "neutral-50" },
      { name: "100", variable: "--color-neutral-100", tailwind: "neutral-100" },
      { name: "150", variable: "--color-neutral-150", tailwind: "neutral-150" },
      { name: "200", variable: "--color-neutral-200", tailwind: "neutral-200" },
      { name: "300", variable: "--color-neutral-300", tailwind: "neutral-300" },
      { name: "400", variable: "--color-neutral-400", tailwind: "neutral-400" },
      { name: "500", variable: "--color-neutral-500", tailwind: "neutral-500" },
      { name: "600", variable: "--color-neutral-600", tailwind: "neutral-600" },
      { name: "700", variable: "--color-neutral-700", tailwind: "neutral-700" },
      { name: "800", variable: "--color-neutral-800", tailwind: "neutral-800" },
      { name: "900", variable: "--color-neutral-900", tailwind: "neutral-900" },
      { name: "950", variable: "--color-neutral-950", tailwind: "neutral-950" },
      { name: "Solid", variable: "--color-neutral-solid", tailwind: "neutral-solid" },
      {
        name: "Inverse Solid",
        variable: "--color-neutral-inversesolid",
        tailwind: "neutral-inversesolid",
      },
    ],
  },
  {
    title: "Brand — Accent",
    description: "Primary brand accent (green).",
    tokens: [
      { name: "Muted", variable: "--color-brand-accent-muted", tailwind: "brand-accent-muted" },
      {
        name: "Default",
        variable: "--color-brand-accent-default",
        tailwind: "brand-accent-default",
      },
      { name: "Hover", variable: "--color-brand-accent-hover", tailwind: "brand-accent-hover" },
      {
        name: "Foreground",
        variable: "--color-brand-accent-foreground",
        tailwind: "brand-accent-foreground",
      },
    ],
  },
  {
    title: "Brand — Secondary",
    description: "Secondary brand color (pink).",
    tokens: [
      {
        name: "Muted",
        variable: "--color-brand-secondary-muted",
        tailwind: "brand-secondary-muted",
      },
      {
        name: "Default",
        variable: "--color-brand-secondary-default",
        tailwind: "brand-secondary-default",
      },
      {
        name: "Hover",
        variable: "--color-brand-secondary-hover",
        tailwind: "brand-secondary-hover",
      },
      {
        name: "Foreground",
        variable: "--color-brand-secondary-foreground",
        tailwind: "brand-secondary-foreground",
      },
    ],
  },
  {
    title: "Brand — Tertiary",
    description: "Tertiary brand color (purple).",
    tokens: [
      {
        name: "Muted",
        variable: "--color-brand-tertiary-muted",
        tailwind: "brand-tertiary-muted",
      },
      {
        name: "Default",
        variable: "--color-brand-tertiary-default",
        tailwind: "brand-tertiary-default",
      },
      {
        name: "Hover",
        variable: "--color-brand-tertiary-hover",
        tailwind: "brand-tertiary-hover",
      },
      {
        name: "Foreground",
        variable: "--color-brand-tertiary-foreground",
        tailwind: "brand-tertiary-foreground",
      },
    ],
  },
  {
    title: "Success",
    description: "Positive feedback and confirmation states.",
    tokens: [
      {
        name: "Background",
        variable: "--color-success-background",
        tailwind: "success-background",
      },
      { name: "Default", variable: "--color-success-default", tailwind: "success-default" },
      { name: "Border", variable: "--color-success-border", tailwind: "success-border" },
    ],
  },
  {
    title: "Warning",
    description: "Caution and attention states.",
    tokens: [
      {
        name: "Background",
        variable: "--color-warning-background",
        tailwind: "warning-background",
      },
      { name: "Default", variable: "--color-warning-default", tailwind: "warning-default" },
      { name: "Border", variable: "--color-warning-border", tailwind: "warning-border" },
    ],
  },
  {
    title: "Error",
    description: "Destructive and error states.",
    tokens: [
      { name: "Background", variable: "--color-error-background", tailwind: "error-background" },
      { name: "Default", variable: "--color-error-default", tailwind: "error-default" },
      { name: "Border", variable: "--color-error-border", tailwind: "error-border" },
    ],
  },
  {
    title: "Info",
    description: "Informational feedback states.",
    tokens: [
      { name: "Background", variable: "--color-info-background", tailwind: "info-background" },
      { name: "Default", variable: "--color-info-default", tailwind: "info-default" },
      { name: "Border", variable: "--color-info-border", tailwind: "info-border" },
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
    title: "Ring",
    description: "Focus ring color.",
    tokens: [{ name: "Ring", variable: "--color-ring", tailwind: "ring" }],
  },
  {
    title: "Special",
    description: "Premium and special feature colors.",
    tokens: [
      {
        name: "Background",
        variable: "--color-special-background",
        tailwind: "special-background",
      },
      { name: "Default", variable: "--color-special-default", tailwind: "special-default" },
    ],
  },
  {
    title: "Chart",
    description: "Data visualization palette.",
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
];

const shadowTokens = [
  { name: "Focus Ring", variable: "--shadow-focus-ring", tailwind: "shadow-focus-ring" },
  { name: "Card", variable: "--shadow-card", tailwind: "shadow-card" },
  { name: "Card Subtle", variable: "--shadow-cardsubtle", tailwind: "shadow-cardsubtle" },
  { name: "Float", variable: "--shadow-float", tailwind: "shadow-float" },
  { name: "Lifted", variable: "--shadow-lifted", tailwind: "shadow-lifted" },
  { name: "Nav", variable: "--shadow-nav", tailwind: "shadow-nav" },
  { name: "Blur Floating", variable: "--shadow-blur-floating", tailwind: "shadow-blur-floating" },
  { name: "Blur Menu", variable: "--shadow-blur-menu", tailwind: "shadow-blur-menu" },
];

function resolveColor(variable: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(variable).trim();
}

function Swatch({ token }: { token: ColorToken }) {
  const ref = useRef<HTMLDivElement>(null);
  const [hex, setHex] = useState("");

  useEffect(() => {
    setHex(resolveColor(token.variable));
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
        <div style={{ fontWeight: 600, color: "var(--color-foreground-default)" }}>
          {token.name}
        </div>
        <div
          style={{
            fontFamily: "monospace",
            fontSize: 11,
            color: "var(--color-foreground-secondary)",
            wordBreak: "break-all",
          }}
        >
          {hex}
        </div>
        <div
          style={{
            fontFamily: "monospace",
            fontSize: 10,
            color: "var(--color-neutral-300)",
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
          color: "var(--color-foreground-default)",
          margin: "0 0 4px",
        }}
      >
        {group.title}
      </h3>
      {group.description && (
        <p
          style={{
            fontSize: 14,
            color: "var(--color-foreground-secondary)",
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
          color: "var(--color-foreground-default)",
          margin: "0 0 8px",
        }}
      >
        Colors
      </h1>
      <p
        style={{
          fontSize: 16,
          color: "var(--color-foreground-secondary)",
          margin: "0 0 12px",
          maxWidth: 640,
          lineHeight: 1.5,
        }}
      >
        Color tokens are exported from Figma and auto-generated into CSS custom properties. Every
        semantic token adapts between light and dark themes. Use the theme toggle in the toolbar to
        preview both modes.
      </p>
      <p
        style={{
          fontSize: 13,
          fontFamily: "monospace",
          color: "var(--color-neutral-300)",
          margin: "0 0 40px",
          padding: "8px 12px",
          backgroundColor: "var(--color-surface-containerraised)",
          borderRadius: 6,
          display: "inline-block",
        }}
      >
        @import "fanv-ui/styles/theme.css";
      </p>

      {semanticGroups.map((group) => (
        <ColorGroupSection key={group.title} group={group} />
      ))}

      <section
        style={{ marginTop: 48, paddingTop: 24, borderTop: "1px solid var(--color-neutral-200)" }}
      >
        <h3
          style={{
            fontSize: 18,
            fontWeight: 700,
            color: "var(--color-foreground-default)",
            margin: "0 0 4px",
          }}
        >
          Shadows
        </h3>
        <p
          style={{
            fontSize: 14,
            color: "var(--color-foreground-secondary)",
            margin: "0 0 16px",
          }}
        >
          Elevation and focus tokens.
        </p>
        <div style={{ display: "flex", gap: 32, flexWrap: "wrap" }}>
          {shadowTokens.map((shadow) => (
            <div key={shadow.name} style={{ textAlign: "center" }}>
              <div
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 12,
                  backgroundColor: "var(--color-surface-container)",
                  boxShadow: `var(${shadow.variable})`,
                  margin: "0 auto 8px",
                }}
              />
              <div
                style={{ fontSize: 13, fontWeight: 600, color: "var(--color-foreground-default)" }}
              >
                {shadow.name}
              </div>
              <div
                style={{
                  fontFamily: "monospace",
                  fontSize: 10,
                  color: "var(--color-neutral-300)",
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
