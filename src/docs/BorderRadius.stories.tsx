import type { Meta, StoryObj } from "@storybook/react";

const meta = {
  title: "Foundations/Border Radius",
  parameters: {
    layout: "fullscreen",
    controls: { disable: true },
    actions: { disable: true },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

type RadiusToken = {
  name: string;
  variable: string;
  tailwind: string;
  value: string;
};

const radiusTokens: RadiusToken[] = [
  { name: "xs", variable: "--radius-xs", tailwind: "rounded-xs", value: "8px" },
  { name: "sm", variable: "--radius-sm", tailwind: "rounded-sm", value: "12px" },
  { name: "md", variable: "--radius-md", tailwind: "rounded-md", value: "16px" },
  { name: "lg", variable: "--radius-lg", tailwind: "rounded-lg", value: "24px" },
  { name: "xl", variable: "--radius-xl", tailwind: "rounded-xl", value: "32px" },
  { name: "2xl", variable: "--radius-2xl", tailwind: "rounded-2xl", value: "40px" },
  { name: "full", variable: "--radius-full", tailwind: "rounded-full", value: "9999px" },
];

function RadiusCard({ token }: { token: RadiusToken }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 24,
        padding: "16px 0",
        borderBottom: "1px solid var(--color-neutral-alphas-100)",
      }}
    >
      <div
        style={{
          width: 80,
          height: 80,
          flexShrink: 0,
          backgroundColor: "var(--color-brand-secondary-muted)",
          border: "2px solid var(--color-brand-secondary-default)",
          borderRadius: `var(${token.variable})`,
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
            fontFamily: "monospace",
            fontSize: 12,
            color: "var(--color-content-secondary)",
          }}
        >
          {token.value}
        </div>
        <div
          style={{
            display: "flex",
            gap: 8,
            marginTop: 6,
          }}
        >
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
      </div>
    </div>
  );
}

export const Scale: Story = {
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
        Border Radius
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
        A 7-step radius scale from subtle rounding to fully circular. Use Tailwind's{" "}
        <code style={{ fontFamily: "monospace", fontSize: 14 }}>rounded-*</code> utilities or
        reference the CSS custom properties directly.
      </p>
      <div
        style={{
          display: "flex",
          gap: 8,
          margin: "0 0 40px",
          flexWrap: "wrap",
        }}
      >
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
          rounded-md
        </code>
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
          rounded-t-lg
        </code>
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
          rounded-full
        </code>
      </div>

      {radiusTokens.map((token) => (
        <RadiusCard key={token.name} token={token} />
      ))}
    </div>
  ),
};
