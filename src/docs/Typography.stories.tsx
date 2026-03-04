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

const weightLabels: Record<number, string> = {
  400: "Regular",
  600: "Semibold",
  700: "Bold",
};

const regularTokens: TypographyToken[] = [
  {
    name: "Body Lg",
    className: "typography-regular-body-lg",
    size: "16px",
    weight: 400,
    lineHeight: "24px",
    sample: "Body text at the standard reading size for paragraphs and content.",
  },
  {
    name: "Body Md",
    className: "typography-regular-body-md",
    size: "14px",
    weight: 400,
    lineHeight: "18px",
    sample: "Smaller body text for secondary content and descriptions.",
  },
  {
    name: "Body Sm",
    className: "typography-regular-body-sm",
    size: "12px",
    weight: 400,
    lineHeight: "16px",
    sample: "Caption text for annotations and helper text.",
  },
];

const semiboldTokens: TypographyToken[] = [
  {
    name: "Body Lg",
    className: "typography-semibold-body-lg",
    size: "16px",
    weight: 600,
    lineHeight: "24px",
    sample: "Body text with semibold weight for strong emphasis.",
  },
  {
    name: "Body Md",
    className: "typography-semibold-body-md",
    size: "14px",
    weight: 600,
    lineHeight: "18px",
    sample: "Smaller body text with semibold weight.",
  },
  {
    name: "Body Sm",
    className: "typography-semibold-body-sm",
    size: "12px",
    weight: 600,
    lineHeight: "16px",
    sample: "Semibold caption for labels and emphasis.",
  },
  {
    name: "Link Lg",
    className: "typography-semibold-link-lg",
    size: "16px",
    weight: 600,
    lineHeight: "22px",
    decoration: "underline",
    sample: "Large link text",
  },
  {
    name: "Link Md",
    className: "typography-semibold-link-md",
    size: "14px",
    weight: 600,
    lineHeight: "18px",
    decoration: "underline",
    sample: "Medium link text",
  },
  {
    name: "Link Xs",
    className: "typography-semibold-link-xs",
    size: "12px",
    weight: 600,
    lineHeight: "16px",
    decoration: "underline",
    sample: "Extra small link text",
  },
  {
    name: "Badge",
    className: "typography-semibold-badge",
    size: "9px",
    weight: 600,
    lineHeight: "10.8px",
    letterSpacing: "0.9px",
    textTransform: "uppercase",
    sample: "Badge Label",
  },
];

const boldTokens: TypographyToken[] = [
  {
    name: "Display",
    className: "typography-bold-display",
    size: "64px",
    weight: 700,
    lineHeight: "64px",
    sample: "Display",
  },
  {
    name: "Heading Xl",
    className: "typography-bold-heading-xl",
    size: "48px",
    weight: 700,
    lineHeight: "52.8px",
    sample: "Heading XL",
  },
  {
    name: "Heading Lg",
    className: "typography-bold-heading-lg",
    size: "40px",
    weight: 700,
    lineHeight: "44px",
    sample: "Heading Lg",
  },
  {
    name: "Heading Md",
    className: "typography-bold-heading-md",
    size: "32px",
    weight: 700,
    lineHeight: "35.2px",
    sample: "Heading Md",
  },
  {
    name: "Heading Sm",
    className: "typography-bold-heading-sm",
    size: "24px",
    weight: 700,
    lineHeight: "32px",
    sample: "Heading Sm",
  },
  {
    name: "Heading Xs",
    className: "typography-bold-heading-xs",
    size: "20px",
    weight: 700,
    lineHeight: "24px",
    sample: "Heading Xs",
  },
];

function TypographyRow({ token }: { token: TypographyToken }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "200px 1fr",
        gap: 24,
        padding: "20px 0",
        borderBottom: "1px solid var(--color-neutral-200)",
        alignItems: "baseline",
      }}
    >
      <div style={{ flexShrink: 0 }}>
        <div
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: "var(--color-foreground-default)",
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
              color: "var(--color-foreground-tertiary)",
            }}
          >
            {token.className}
          </span>
          <span style={{ fontSize: 11, color: "var(--color-foreground-secondary)" }}>
            {token.size} / {token.lineHeight} · {weightLabels[token.weight] || token.weight}
            {token.letterSpacing ? ` · LS ${token.letterSpacing}` : ""}
            {token.textTransform ? ` · ${token.textTransform}` : ""}
          </span>
        </div>
      </div>
      <div
        className={token.className}
        style={{ color: "var(--color-foreground-default)", minWidth: 0 }}
      >
        {token.sample}
      </div>
    </div>
  );
}

function SectionHeading({ children }: { children: string }) {
  return (
    <h2
      style={{
        fontSize: 14,
        fontWeight: 600,
        textTransform: "uppercase",
        letterSpacing: "0.05em",
        color: "var(--color-foreground-tertiary)",
        margin: "0 0 8px",
      }}
    >
      {children}
    </h2>
  );
}

export const Scale: Story = {
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
        Typography
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
            color: "var(--color-foreground-tertiary)",
            padding: "8px 12px",
            backgroundColor: "var(--color-surface-input)",
            borderRadius: 6,
          }}
        >
          {'<p className="typography-semibold-body-lg">...</p>'}
        </code>
      </div>

      <section>
        <SectionHeading>Bold</SectionHeading>
        {boldTokens.map((token) => (
          <TypographyRow key={token.className} token={token} />
        ))}
      </section>

      <section style={{ marginTop: 32 }}>
        <SectionHeading>Semibold</SectionHeading>
        {semiboldTokens.map((token) => (
          <TypographyRow key={token.className} token={token} />
        ))}
      </section>

      <section style={{ marginTop: 32 }}>
        <SectionHeading>Regular</SectionHeading>
        {regularTokens.map((token) => (
          <TypographyRow key={token.className} token={token} />
        ))}
      </section>
    </div>
  ),
};
