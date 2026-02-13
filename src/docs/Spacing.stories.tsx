import type { Meta, StoryObj } from "@storybook/react";

const meta = {
  title: "Foundations/Spacing",
  parameters: {
    layout: "fullscreen",
    controls: { disable: true },
    actions: { disable: true },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

type SpacingStep = {
  name: string;
  rem: string;
  px: number;
};

const spacingScale: SpacingStep[] = [
  { name: "0", rem: "0", px: 0 },
  { name: "px", rem: "1px", px: 1 },
  { name: "0.5", rem: "0.125rem", px: 2 },
  { name: "1", rem: "0.25rem", px: 4 },
  { name: "1.5", rem: "0.375rem", px: 6 },
  { name: "2", rem: "0.5rem", px: 8 },
  { name: "2.5", rem: "0.625rem", px: 10 },
  { name: "3", rem: "0.75rem", px: 12 },
  { name: "3.5", rem: "0.875rem", px: 14 },
  { name: "4", rem: "1rem", px: 16 },
  { name: "5", rem: "1.25rem", px: 20 },
  { name: "6", rem: "1.5rem", px: 24 },
  { name: "7", rem: "1.75rem", px: 28 },
  { name: "8", rem: "2rem", px: 32 },
  { name: "9", rem: "2.25rem", px: 36 },
  { name: "10", rem: "2.5rem", px: 40 },
  { name: "11", rem: "2.75rem", px: 44 },
  { name: "12", rem: "3rem", px: 48 },
  { name: "14", rem: "3.5rem", px: 56 },
  { name: "16", rem: "4rem", px: 64 },
  { name: "20", rem: "5rem", px: 80 },
  { name: "24", rem: "6rem", px: 96 },
  { name: "28", rem: "7rem", px: 112 },
  { name: "32", rem: "8rem", px: 128 },
  { name: "36", rem: "9rem", px: 144 },
  { name: "40", rem: "10rem", px: 160 },
  { name: "44", rem: "11rem", px: 176 },
  { name: "48", rem: "12rem", px: 192 },
  { name: "52", rem: "13rem", px: 208 },
  { name: "56", rem: "14rem", px: 224 },
  { name: "60", rem: "15rem", px: 240 },
  { name: "64", rem: "16rem", px: 256 },
  { name: "72", rem: "18rem", px: 288 },
  { name: "80", rem: "20rem", px: 320 },
  { name: "96", rem: "24rem", px: 384 },
];

const maxBarPx = 384;

function SpacingRow({ step }: { step: SpacingStep }) {
  const barWidth = step.px === 0 ? 0 : Math.max(1, (step.px / maxBarPx) * 100);

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "56px 88px 56px 1fr",
        gap: 12,
        alignItems: "center",
        padding: "6px 0",
        borderBottom: "1px solid var(--color-neutral-100)",
        fontSize: 13,
      }}
    >
      <span
        style={{
          fontFamily: "monospace",
          fontWeight: 600,
          color: "var(--color-body-100)",
        }}
      >
        {step.name}
      </span>
      <span
        style={{
          fontFamily: "monospace",
          color: "var(--color-body-200)",
        }}
      >
        {step.rem}
      </span>
      <span
        style={{
          fontFamily: "monospace",
          color: "var(--color-primary-300)",
          textAlign: "right",
        }}
      >
        {step.px}px
      </span>
      <div
        style={{
          height: 16,
          borderRadius: 3,
          position: "relative",
        }}
      >
        {step.px > 0 && (
          <div
            style={{
              height: "100%",
              width: `${barWidth}%`,
              backgroundColor: "var(--color-brand-purple-500)",
              borderRadius: 3,
              minWidth: 2,
            }}
          />
        )}
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
          color: "var(--color-body-100)",
          margin: "0 0 8px",
        }}
      >
        Spacing
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
        We use a <strong>4px base grid</strong>. Spacing is managed through Tailwind CSS utility
        classes, which follow a consistent multiplier scale. Use these values for padding, margin,
        gap, and sizing to maintain visual rhythm.
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
            color: "var(--color-primary-300)",
            padding: "8px 12px",
            backgroundColor: "var(--color-background-600)",
            borderRadius: 6,
          }}
        >
          p-4 → 1rem (16px)
        </code>
        <code
          style={{
            fontSize: 13,
            fontFamily: "monospace",
            color: "var(--color-primary-300)",
            padding: "8px 12px",
            backgroundColor: "var(--color-background-600)",
            borderRadius: 6,
          }}
        >
          gap-2 → 0.5rem (8px)
        </code>
        <code
          style={{
            fontSize: 13,
            fontFamily: "monospace",
            color: "var(--color-primary-300)",
            padding: "8px 12px",
            backgroundColor: "var(--color-background-600)",
            borderRadius: 6,
          }}
        >
          m-6 → 1.5rem (24px)
        </code>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "56px 88px 56px 1fr",
          gap: 12,
          padding: "8px 0",
          borderBottom: "2px solid var(--color-neutral-200)",
          fontSize: 11,
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          color: "var(--color-primary-300)",
        }}
      >
        <span>Name</span>
        <span>Size</span>
        <span style={{ textAlign: "right" }}>Pixels</span>
        <span>Visual</span>
      </div>

      {spacingScale.map((step) => (
        <SpacingRow key={step.name} step={step} />
      ))}

      <section
        style={{
          marginTop: 40,
          paddingTop: 24,
          borderTop: "1px solid var(--color-neutral-200)",
        }}
      >
        <h3
          style={{
            fontSize: 18,
            fontWeight: 700,
            color: "var(--color-body-100)",
            margin: "0 0 12px",
          }}
        >
          Usage
        </h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 16,
          }}
        >
          {[
            {
              title: "Padding",
              examples: ["p-2", "px-4", "py-3", "pt-6"],
              desc: "Inner spacing within elements.",
            },
            {
              title: "Margin",
              examples: ["m-4", "mx-auto", "mt-8", "mb-2"],
              desc: "Outer spacing between elements.",
            },
            {
              title: "Gap",
              examples: ["gap-2", "gap-x-4", "gap-y-3"],
              desc: "Spacing between flex/grid children.",
            },
            {
              title: "Size",
              examples: ["w-8", "h-10", "size-6"],
              desc: "Width, height, and combined sizing.",
            },
          ].map((section) => (
            <div
              key={section.title}
              style={{
                padding: 16,
                borderRadius: 8,
                backgroundColor: "var(--color-background-600)",
              }}
            >
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: "var(--color-body-100)",
                  marginBottom: 4,
                }}
              >
                {section.title}
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: "var(--color-body-200)",
                  marginBottom: 8,
                }}
              >
                {section.desc}
              </div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {section.examples.map((ex) => (
                  <code
                    key={ex}
                    style={{
                      fontSize: 11,
                      fontFamily: "monospace",
                      padding: "2px 6px",
                      borderRadius: 4,
                      backgroundColor: "var(--color-background-700)",
                      color: "var(--color-brand-purple-500)",
                    }}
                  >
                    {ex}
                  </code>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  ),
};
