import type { Meta, StoryObj } from "@storybook/react";

const meta = {
  title: "Foundations/Typography",
  parameters: {
    layout: "fullscreen",
    controls: { disable: true },
    actions: { disable: true },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

type TypographyToken = {
  name: string;
  className: string;
  size: string;
  weight: number;
  lineHeight: string;
  letterSpacing?: string;
  decoration?: string;
  textTransform?: string;
  sample?: string;
};

const typographyTokens: TypographyToken[] = [
  {
    name: "Hero",
    className: "typography-hero",
    size: "64px",
    weight: 800,
    lineHeight: "64px",
    sample: "Hero Title",
  },
  {
    name: "Heading 1",
    className: "typography-heading-1",
    size: "48px",
    weight: 700,
    lineHeight: "52.8px",
    sample: "Heading One",
  },
  {
    name: "Heading 2",
    className: "typography-heading-2",
    size: "40px",
    weight: 700,
    lineHeight: "44px",
    sample: "Heading Two",
  },
  {
    name: "Heading 32",
    className: "typography-heading-32",
    size: "32px",
    weight: 700,
    lineHeight: "40px",
    sample: "Heading 32",
  },
  {
    name: "Heading 3",
    className: "typography-heading-3",
    size: "24px",
    weight: 700,
    lineHeight: "32px",
    sample: "Heading Three",
  },
  {
    name: "Heading 4",
    className: "typography-heading-4",
    size: "20px",
    weight: 700,
    lineHeight: "26px",
    sample: "Heading Four",
  },
  {
    name: "Subtitle",
    className: "typography-subtitle",
    size: "18px",
    weight: 600,
    lineHeight: "24px",
    sample: "Subtitle Text",
  },
  {
    name: "Body 1 Regular",
    className: "typography-body-1-regular",
    size: "16px",
    weight: 400,
    lineHeight: "24px",
    sample: "Body text at the standard reading size for paragraphs and content.",
  },
  {
    name: "Body 1 Medium",
    className: "typography-body-1-medium",
    size: "16px",
    weight: 500,
    lineHeight: "24px",
    sample: "Body text with medium weight for slight emphasis.",
  },
  {
    name: "Body 1 Semibold",
    className: "typography-body-1-semibold",
    size: "16px",
    weight: 600,
    lineHeight: "24px",
    sample: "Body text with semibold weight for strong emphasis.",
  },
  {
    name: "Body 2 Regular",
    className: "typography-body-2-regular",
    size: "14px",
    weight: 400,
    lineHeight: "18px",
    sample: "Smaller body text for secondary content and descriptions.",
  },
  {
    name: "Body 2 Medium",
    className: "typography-body-2-medium",
    size: "14px",
    weight: 500,
    lineHeight: "18px",
    sample: "Smaller body text with medium weight.",
  },
  {
    name: "Body 2 Semibold",
    className: "typography-body-2-semibold",
    size: "14px",
    weight: 600,
    lineHeight: "18px",
    sample: "Smaller body text with semibold weight.",
  },
  {
    name: "Button Large",
    className: "typography-button-large",
    size: "18px",
    weight: 600,
    lineHeight: "24px",
    sample: "Large Button",
  },
  {
    name: "Button Small",
    className: "typography-button-small",
    size: "16px",
    weight: 600,
    lineHeight: "22px",
    sample: "Small Button",
  },
  {
    name: "Link Large",
    className: "typography-link-large",
    size: "16px",
    weight: 500,
    lineHeight: "22px",
    decoration: "underline",
    sample: "Large link text",
  },
  {
    name: "Link Small",
    className: "typography-link-small",
    size: "14px",
    weight: 500,
    lineHeight: "18px",
    decoration: "underline",
    sample: "Small link text",
  },
  {
    name: "Link X-Small",
    className: "typography-link-x-small",
    size: "12px",
    weight: 500,
    lineHeight: "16px",
    decoration: "underline",
    sample: "Extra small link text",
  },
  {
    name: "Caption Regular",
    className: "typography-caption-regular",
    size: "12px",
    weight: 400,
    lineHeight: "16px",
    sample: "Caption text for annotations and helper text.",
  },
  {
    name: "Caption Semibold",
    className: "typography-caption-semibold",
    size: "12px",
    weight: 600,
    lineHeight: "16px",
    sample: "Semibold caption for labels and emphasis.",
  },
  {
    name: "Badge",
    className: "typography-badge",
    size: "9px",
    weight: 600,
    lineHeight: "10.8px",
    letterSpacing: "0.9px",
    textTransform: "uppercase",
    sample: "Badge Label",
  },
];

const weightLabels: Record<number, string> = {
  400: "Regular",
  500: "Medium",
  600: "Semibold",
  700: "Bold",
  800: "Extrabold",
};

function TypographyRow({ token }: { token: TypographyToken }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "180px 1fr",
        gap: 24,
        padding: "20px 0",
        borderBottom: "1px solid var(--color-neutral-100)",
        alignItems: "baseline",
      }}
    >
      <div style={{ flexShrink: 0 }}>
        <div
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: "var(--color-body-100)",
            marginBottom: 4,
          }}
        >
          {token.name}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <span
            style={{
              fontFamily: "monospace",
              fontSize: 11,
              color: "var(--color-primary-300)",
            }}
          >
            {token.className}
          </span>
          <span style={{ fontSize: 11, color: "var(--color-body-200)" }}>
            {token.size} / {token.lineHeight} · {weightLabels[token.weight] || token.weight}
            {token.letterSpacing ? ` · LS ${token.letterSpacing}` : ""}
            {token.textTransform ? ` · ${token.textTransform}` : ""}
          </span>
        </div>
      </div>
      <div className={token.className} style={{ color: "var(--color-body-100)", minWidth: 0 }}>
        {token.sample}
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
        Typography
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
        All typography is set in <strong>Inter</strong>. Styles are available as Tailwind utility
        classes generated from our Figma tokens. Apply them directly to elements.
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
          {'<p className="typography-body-1-regular">...</p>'}
        </code>
      </div>

      <section>
        <h2
          style={{
            fontSize: 14,
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            color: "var(--color-primary-300)",
            margin: "0 0 8px",
          }}
        >
          Headings
        </h2>
        {typographyTokens
          .filter(
            (t) =>
              t.name.startsWith("Hero") ||
              t.name.startsWith("Heading") ||
              t.name.startsWith("Subtitle"),
          )
          .map((token) => (
            <TypographyRow key={token.className} token={token} />
          ))}
      </section>

      <section style={{ marginTop: 32 }}>
        <h2
          style={{
            fontSize: 14,
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            color: "var(--color-primary-300)",
            margin: "0 0 8px",
          }}
        >
          Body
        </h2>
        {typographyTokens
          .filter((t) => t.name.startsWith("Body"))
          .map((token) => (
            <TypographyRow key={token.className} token={token} />
          ))}
      </section>

      <section style={{ marginTop: 32 }}>
        <h2
          style={{
            fontSize: 14,
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            color: "var(--color-primary-300)",
            margin: "0 0 8px",
          }}
        >
          Buttons
        </h2>
        {typographyTokens
          .filter((t) => t.name.startsWith("Button"))
          .map((token) => (
            <TypographyRow key={token.className} token={token} />
          ))}
      </section>

      <section style={{ marginTop: 32 }}>
        <h2
          style={{
            fontSize: 14,
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            color: "var(--color-primary-300)",
            margin: "0 0 8px",
          }}
        >
          Links
        </h2>
        {typographyTokens
          .filter((t) => t.name.startsWith("Link"))
          .map((token) => (
            <TypographyRow key={token.className} token={token} />
          ))}
      </section>

      <section style={{ marginTop: 32 }}>
        <h2
          style={{
            fontSize: 14,
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            color: "var(--color-primary-300)",
            margin: "0 0 8px",
          }}
        >
          Captions &amp; Badges
        </h2>
        {typographyTokens
          .filter((t) => t.name.startsWith("Caption") || t.name.startsWith("Badge"))
          .map((token) => (
            <TypographyRow key={token.className} token={token} />
          ))}
      </section>
    </div>
  ),
};
