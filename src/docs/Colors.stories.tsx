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
      { name: "50", variable: "--color-neutral-100", tailwind: "neutral-100" },
      { name: "100", variable: "--color-neutral-200", tailwind: "neutral-200" },
      { name: "200", variable: "--color-neutral-250", tailwind: "neutral-250" },
      { name: "300", variable: "--color-neutral-300", tailwind: "neutral-300" },
      { name: "400", variable: "--color-neutral-350", tailwind: "neutral-350" },
      { name: "500", variable: "--color-neutral-400", tailwind: "neutral-400" },
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
      { name: "100", variable: "--color-foreground-default", tailwind: "foreground-default" },
      { name: "200", variable: "--color-foreground-secondary", tailwind: "foreground-secondary" },
      { name: "300", variable: "--color-foreground-inverse", tailwind: "foreground-inverse" },
      { name: "400", variable: "--color-foreground-inverse", tailwind: "foreground-inverse" },
      {
        name: "Black Solid",
        variable: "--color-foreground-onaccent",
        tailwind: "foreground-onaccent",
      },
      {
        name: "White Solid",
        variable: "--color-foreground-onaccentinverse",
        tailwind: "foreground-onaccentinverse",
      },
    ],
  },
  {
    title: "Background",
    description: "Surface and overlay colors for layouts and containers.",
    tokens: [
      { name: "150", variable: "--color-surface-container", tailwind: "surface-container" },
      { name: "200", variable: "--color-surface-container", tailwind: "surface-container" },
      {
        name: "250",
        variable: "--color-surface-containerraised",
        tailwind: "surface-containerraised",
      },
      {
        name: "350",
        variable: "--color-primitives-color-blackalpha-200",
        tailwind: "primitives-color-blackalpha-200",
      },
      {
        name: "400",
        variable: "--color-primitives-color-blackalpha-900",
        tailwind: "primitives-color-blackalpha-900",
      },
      { name: "500", variable: "--color-surface-backdrop", tailwind: "surface-backdrop" },
      {
        name: "600",
        variable: "--color-surface-containerraised",
        tailwind: "surface-containerraised",
      },
      {
        name: "700",
        variable: "--color-surface-containerraised",
        tailwind: "surface-containerraised",
      },
      {
        name: "800",
        variable: "--color---primitives-color-blackalpha-600",
        tailwind: "--primitives-color-blackalpha-600",
      },
      {
        name: "Inverse Solid",
        variable: "--color-surface-page",
        tailwind: "surface-page",
      },
      { name: "Solid", variable: "--color-surface-pageInverse", tailwind: "surface-pageInverse" },
      {
        name: "Inverse Solid Light",
        variable: "--color-surface-page-light",
        tailwind: "surface-page-light",
      },
      {
        name: "White Solid Constant",
        variable: "--color-primitives-color-gray-white",
        tailwind: "primitives-color-gray-white",
      },
    ],
  },
  {
    title: "Success",
    description: "Positive feedback and confirmation states.",
    tokens: [
      { name: "50", variable: "--color-success-background", tailwind: "success-background" },
      { name: "500", variable: "--color-success-default", tailwind: "success-default" },
    ],
  },
  {
    title: "Warning",
    description: "Caution and attention states.",
    tokens: [
      { name: "50", variable: "--color-warning-background", tailwind: "warning-background" },
      { name: "500", variable: "--color-warning-default", tailwind: "warning-default" },
    ],
  },
  {
    title: "Error",
    description: "Destructive and error states.",
    tokens: [
      { name: "50", variable: "--color-error-background", tailwind: "error-background" },
      { name: "500", variable: "--color-error-default", tailwind: "error-default" },
    ],
  },
  {
    title: "Info",
    description: "Informational feedback states.",
    tokens: [
      { name: "50", variable: "--color-info-background", tailwind: "info-background" },
      { name: "500", variable: "--color-info-default", tailwind: "info-default" },
    ],
  },
  {
    title: "Hover",
    description: "Interactive hover state overlays.",
    tokens: [
      { name: "100", variable: "--color-neutral-800", tailwind: "neutral-800" },
      { name: "200", variable: "--color-neutral-500", tailwind: "neutral-500" },
      { name: "300", variable: "--color-neutral-100", tailwind: "neutral-100" },
      { name: "400", variable: "--color-neutral-50", tailwind: "neutral-50" },
    ],
  },
  {
    title: "Link",
    description: "Anchor and interactive link colors.",
    tokens: [
      { name: "500", variable: "--color-link-default", tailwind: "link-default" },
      { name: "600", variable: "--color-link-hover", tailwind: "link-hover" },
    ],
  },
  {
    title: "Disabled",
    description: "Disabled and inactive element states.",
    tokens: [
      { name: "100", variable: "--color-neutral-250", tailwind: "neutral-250" },
      { name: "400", variable: "--color-neutral-300", tailwind: "neutral-300" },
      { name: "500", variable: "--color-neutral-350", tailwind: "neutral-350" },
      { name: "600", variable: "--color-neutral-700", tailwind: "neutral-700" },
    ],
  },
  {
    title: "Chart",
    description: "Data visualization palette for charts and graphs.",
    tokens: [
      { name: "50", variable: "--color-special-chart-teal", tailwind: "special-chart-teal" },
      { name: "100", variable: "--color-special-chart-sky", tailwind: "special-chart-sky" },
      { name: "200", variable: "--color-special-chart-magenta", tailwind: "special-chart-magenta" },
      { name: "300", variable: "--color-special-chart-orange", tailwind: "special-chart-orange" },
      { name: "400", variable: "--color-special-chart-gray", tailwind: "special-chart-gray" },
      { name: "500", variable: "--color-special-chart-pink", tailwind: "special-chart-pink" },
      { name: "600", variable: "--color-special-chart-purple", tailwind: "special-chart-purple" },
    ],
  },
  {
    title: "Brand",
    description: "Fanvue brand identity colors.",
    tokens: [
      { name: "Green 50", variable: "--color-brand-accent-muted", tailwind: "brand-accent-muted" },
      {
        name: "Green 500",
        variable: "--color-brand-accent-default",
        tailwind: "brand-accent-default",
      },
      {
        name: "Pink 50",
        variable: "--color-brand-secondary-muted",
        tailwind: "brand-secondary-muted",
      },
      {
        name: "Pink 500",
        variable: "--color-brand-secondary-default",
        tailwind: "brand-secondary-default",
      },
      {
        name: "Purple 50",
        variable: "--color-brand-tertiary-muted",
        tailwind: "brand-tertiary-muted",
      },
      {
        name: "Purple 500",
        variable: "--color-brand-tertiary-default",
        tailwind: "brand-tertiary-default",
      },
    ],
  },
  {
    title: "Special",
    description: "Accent colors for premium and special features.",
    tokens: [
      { name: "50", variable: "--color-special-background", tailwind: "special-background" },
      { name: "500", variable: "--color-special-default", tailwind: "special-default" },
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
        Our color tokens are exported from Figma and auto-generated into CSS custom properties.
        Every token adapts between light and dark themes. Use the theme toggle in the toolbar above
        to preview both modes.
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
