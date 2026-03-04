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
  fontSize: string;
  fontWeight: number;
  lineHeight: string;
  letterSpacing?: string;
  textDecoration?: string;
  textTransform?: string;
};

type TypographyGroup = {
  title: string;
  weight: number;
  tokens: TypographyToken[];
};

const typographyGroups: TypographyGroup[] = [
  {
    title: "Regular",
    weight: 400,
    tokens: [
      {
        name: "body-lg",
        className: "typography-regular-body-lg",
        fontSize: "16px",
        fontWeight: 400,
        lineHeight: "24px",
      },
      {
        name: "body-md",
        className: "typography-regular-body-md",
        fontSize: "14px",
        fontWeight: 400,
        lineHeight: "18px",
      },
      {
        name: "body-sm",
        className: "typography-regular-body-sm",
        fontSize: "12px",
        fontWeight: 400,
        lineHeight: "16px",
      },
    ],
  },
  {
    title: "Semibold",
    weight: 600,
    tokens: [
      {
        name: "body-lg",
        className: "typography-semibold-body-lg",
        fontSize: "16px",
        fontWeight: 600,
        lineHeight: "24px",
      },
      {
        name: "body-md",
        className: "typography-semibold-body-md",
        fontSize: "14px",
        fontWeight: 600,
        lineHeight: "18px",
      },
      {
        name: "body-sm",
        className: "typography-semibold-body-sm",
        fontSize: "12px",
        fontWeight: 600,
        lineHeight: "16px",
      },
      {
        name: "link-lg",
        className: "typography-semibold-link-lg",
        fontSize: "16px",
        fontWeight: 600,
        lineHeight: "22px",
        textDecoration: "underline",
      },
      {
        name: "link-md",
        className: "typography-semibold-link-md",
        fontSize: "14px",
        fontWeight: 600,
        lineHeight: "18px",
        textDecoration: "underline",
      },
      {
        name: "link-xs",
        className: "typography-semibold-link-xs",
        fontSize: "12px",
        fontWeight: 600,
        lineHeight: "16px",
        textDecoration: "underline",
      },
      {
        name: "badge",
        className: "typography-semibold-badge",
        fontSize: "9px",
        fontWeight: 600,
        lineHeight: "10.8px",
        letterSpacing: "0.9px",
        textTransform: "uppercase",
      },
    ],
  },
  {
    title: "Bold",
    weight: 700,
    tokens: [
      {
        name: "heading-xs",
        className: "typography-bold-heading-xs",
        fontSize: "20px",
        fontWeight: 700,
        lineHeight: "24px",
      },
      {
        name: "heading-sm",
        className: "typography-bold-heading-sm",
        fontSize: "24px",
        fontWeight: 700,
        lineHeight: "32px",
      },
      {
        name: "heading-md",
        className: "typography-bold-heading-md",
        fontSize: "32px",
        fontWeight: 700,
        lineHeight: "35.2px",
      },
      {
        name: "heading-lg",
        className: "typography-bold-heading-lg",
        fontSize: "40px",
        fontWeight: 700,
        lineHeight: "44px",
      },
      {
        name: "heading-xl",
        className: "typography-bold-heading-xl",
        fontSize: "48px",
        fontWeight: 700,
        lineHeight: "52.8px",
      },
      {
        name: "display",
        className: "typography-bold-display",
        fontSize: "64px",
        fontWeight: 700,
        lineHeight: "64px",
      },
    ],
  },
];

function TokenRow({ token }: { token: TypographyToken }) {
  const extras: string[] = [];
  if (token.letterSpacing) extras.push(`letter-spacing: ${token.letterSpacing}`);
  if (token.textDecoration) extras.push(token.textDecoration);
  if (token.textTransform) extras.push(token.textTransform);

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 240px 200px",
        gap: 24,
        alignItems: "baseline",
        padding: "16px 0",
        borderBottom: "1px solid var(--color-neutral-100)",
      }}
    >
      <span className={token.className} style={{ color: "var(--color-foreground-default)" }}>
        The quick brown fox jumps over the lazy dog
      </span>
      <code
        style={{
          fontFamily: "monospace",
          fontSize: 12,
          color: "var(--color-brand-tertiary-default)",
          whiteSpace: "nowrap",
        }}
      >
        {token.className}
      </code>
      <span
        style={{
          fontFamily: "monospace",
          fontSize: 12,
          color: "var(--color-foreground-secondary)",
          whiteSpace: "nowrap",
        }}
      >
        {token.fontSize} / {token.fontWeight} / {token.lineHeight}
        {extras.length > 0 && (
          <span style={{ color: "var(--color-neutral-300)" }}>{" · " + extras.join(" · ")}</span>
        )}
      </span>
    </div>
  );
}

function TypographyGroupSection({ group }: { group: TypographyGroup }) {
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
      <p
        style={{
          fontSize: 14,
          color: "var(--color-foreground-secondary)",
          margin: "0 0 16px",
        }}
      >
        Weight: {group.weight}
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 240px 200px",
          gap: 24,
          padding: "8px 0",
          borderBottom: "2px solid var(--color-neutral-200)",
          fontSize: 11,
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          color: "var(--color-neutral-300)",
        }}
      >
        <span>Sample</span>
        <span>Class</span>
        <span>Size / Weight / Line-height</span>
      </div>

      {group.tokens.map((token) => (
        <TokenRow key={token.className} token={token} />
      ))}
    </section>
  );
}

export const Styles: Story = {
  render: () => (
    <div style={{ padding: "40px 48px", maxWidth: 1100, fontFamily: "Inter, sans-serif" }}>
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
        Typography tokens are exported from Figma and auto-generated into CSS utility classes. Each
        token sets font-size, weight, line-height, and optional letter-spacing or text-decoration.
        Apply them directly as Tailwind v4 utility classes.
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

      {typographyGroups.map((group) => (
        <TypographyGroupSection key={group.title} group={group} />
      ))}
    </div>
  ),
};
