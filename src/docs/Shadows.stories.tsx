import type { Meta, StoryObj } from "@storybook/react";

const meta = {
  title: "Foundations/Shadows",
  parameters: {
    layout: "fullscreen",
    controls: { disable: true },
    actions: { disable: true },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

type ShadowToken = {
  name: string;
  variable: string;
  tailwind: string;
  description: string;
  value: string;
};

const elevationTokens: ShadowToken[] = [
  {
    name: "Small",
    variable: "--shadow-sm",
    tailwind: "shadow-sm",
    description: "Subtle lift for cards and containers.",
    value: "0px 1px 3px -1px #0000000d, 0px 1px 4px 0px #0000000f",
  },
  {
    name: "Medium",
    variable: "--shadow-md",
    tailwind: "shadow-md",
    description: "Default elevation for raised surfaces.",
    value: "0px 2px 4px -1px #0000000f, 0px 3px 10px -1px #00000014",
  },
  {
    name: "Large",
    variable: "--shadow-lg",
    tailwind: "shadow-lg",
    description: "High emphasis for modals and prominent cards.",
    value: "0px 4px 8px -1px #00000014, 0px 8px 22px -1px #0000001a",
  },
];

const blurTokens: ShadowToken[] = [
  {
    name: "Blur Menu",
    variable: "--shadow-blur-menu",
    tailwind: "shadow-blur-menu",
    description: "Dropdown menus and popovers.",
    value: "0px 6px 12px 0px #0000001a",
  },
  {
    name: "Blur Floating",
    variable: "--shadow-blur-floating",
    tailwind: "shadow-blur-floating",
    description: "Floating and draggable elements.",
    value: "0px 12px 40px 2px #00000026",
  },
];

const focusToken: ShadowToken = {
  name: "Focus Ring",
  variable: "--shadow-focus-ring",
  tailwind: "shadow-focus-ring",
  description:
    "Keyboard navigation indicator. Two-layer ring using bg-primary and interaction-focus.",
  value: "0 0 0 2px var(--color-background-primary), 0 0 0 4px var(--color-interaction-focus)",
};

function ShadowCard({ token }: { token: ShadowToken }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 32,
        padding: "24px 0",
        borderBottom: "1px solid var(--color-neutral-alphas-100)",
      }}
    >
      <div
        style={{
          width: 120,
          height: 80,
          flexShrink: 0,
          borderRadius: 12,
          backgroundColor: "var(--color-surface-primary)",
          boxShadow: `var(${token.variable})`,
        }}
      />
      <div style={{ minWidth: 0 }}>
        <div
          style={{
            fontSize: 16,
            fontWeight: 600,
            color: "var(--color-content-primary)",
            marginBottom: 2,
          }}
        >
          {token.name}
        </div>
        <div
          style={{
            fontSize: 13,
            color: "var(--color-content-secondary)",
            marginBottom: 6,
          }}
        >
          {token.description}
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <code
            style={{
              fontSize: 11,
              fontFamily: "monospace",
              padding: "2px 6px",
              borderRadius: 4,
              backgroundColor: "var(--color-neutral-alphas-100)",
              color: "var(--color-brand-secondary-default)",
            }}
          >
            {token.tailwind}
          </code>
          <code
            style={{
              fontSize: 11,
              fontFamily: "monospace",
              padding: "2px 6px",
              borderRadius: 4,
              backgroundColor: "var(--color-neutral-alphas-100)",
              color: "var(--color-content-tertiary)",
            }}
          >
            var({token.variable})
          </code>
        </div>
        <div
          style={{
            fontFamily: "monospace",
            fontSize: 10,
            color: "var(--color-content-tertiary)",
            marginTop: 4,
            wordBreak: "break-all",
          }}
        >
          {token.value}
        </div>
      </div>
    </div>
  );
}

export const Elevation: Story = {
  render: () => (
    <div style={{ padding: "40px 48px", maxWidth: 960, fontFamily: "Inter, sans-serif" }}>
      <h1
        style={{
          fontSize: 32,
          fontWeight: 800,
          color: "var(--color-content-primary)",
          margin: "0 0 8px",
        }}
      >
        Shadows
      </h1>
      <p
        style={{
          fontSize: 16,
          color: "var(--color-content-secondary)",
          margin: "0 0 40px",
          maxWidth: 640,
          lineHeight: 1.5,
        }}
      >
        Elevation and focus tokens for layering UI surfaces. Three tiers of drop shadow for
        progressive depth, two blur shadows for floating UI, and a focus ring for accessibility.
      </p>

      <h3
        style={{
          fontSize: 18,
          fontWeight: 700,
          color: "var(--color-content-primary)",
          margin: "0 0 4px",
        }}
      >
        Elevation
      </h3>
      <p
        style={{
          fontSize: 14,
          color: "var(--color-content-secondary)",
          margin: "0 0 8px",
        }}
      >
        Progressive depth for cards, panels, and modals.
      </p>
      {elevationTokens.map((token) => (
        <ShadowCard key={token.name} token={token} />
      ))}

      <h3
        style={{
          fontSize: 18,
          fontWeight: 700,
          color: "var(--color-content-primary)",
          margin: "32px 0 4px",
        }}
      >
        Blur
      </h3>
      <p
        style={{
          fontSize: 14,
          color: "var(--color-content-secondary)",
          margin: "0 0 8px",
        }}
      >
        Heavier shadows for floating elements that sit above the page.
      </p>
      {blurTokens.map((token) => (
        <ShadowCard key={token.name} token={token} />
      ))}

      <h3
        style={{
          fontSize: 18,
          fontWeight: 700,
          color: "var(--color-content-primary)",
          margin: "32px 0 4px",
        }}
      >
        Focus
      </h3>
      <p
        style={{
          fontSize: 14,
          color: "var(--color-content-secondary)",
          margin: "0 0 8px",
        }}
      >
        Keyboard navigation ring built from two concentric outlines.
      </p>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 32,
          padding: "24px 0",
        }}
      >
        <button
          type="button"
          style={{
            width: 120,
            height: 44,
            flexShrink: 0,
            borderRadius: 8,
            backgroundColor: "var(--color-surface-primary)",
            border: "1px solid var(--color-border-primary)",
            boxShadow: `var(${focusToken.variable})`,
            cursor: "default",
            fontSize: 13,
            fontWeight: 600,
            color: "var(--color-content-primary)",
          }}
        >
          Focused
        </button>
        <div style={{ minWidth: 0 }}>
          <div
            style={{
              fontSize: 16,
              fontWeight: 600,
              color: "var(--color-content-primary)",
              marginBottom: 2,
            }}
          >
            {focusToken.name}
          </div>
          <div
            style={{
              fontSize: 13,
              color: "var(--color-content-secondary)",
              marginBottom: 6,
            }}
          >
            {focusToken.description}
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <code
              style={{
                fontSize: 11,
                fontFamily: "monospace",
                padding: "2px 6px",
                borderRadius: 4,
                backgroundColor: "var(--color-neutral-alphas-100)",
                color: "var(--color-brand-secondary-default)",
              }}
            >
              {focusToken.tailwind}
            </code>
            <code
              style={{
                fontSize: 11,
                fontFamily: "monospace",
                padding: "2px 6px",
                borderRadius: 4,
                backgroundColor: "var(--color-neutral-alphas-100)",
                color: "var(--color-content-tertiary)",
              }}
            >
              var({focusToken.variable})
            </code>
          </div>
        </div>
      </div>
    </div>
  ),
};
