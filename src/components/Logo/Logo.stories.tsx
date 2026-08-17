import type { Meta, StoryObj } from "@storybook/react";
import { Logo } from "./Logo";

const meta = {
  title: "Components/Logo",
  component: Logo,
  parameters: {
    layout: "centered",
    design: {
      type: "figma",
      url: "https://www.figma.com/design/S8zFdcOjt4qN4PrwntuCdt/Fanvue-Library?node-id=109-367&m=dev",
    },
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["full", "icon", "wordmark", "portrait"],
    },
    color: {
      control: "select",
      options: ["fullColour", "decolour", "whiteAlways", "blackAlways"],
    },
    version: {
      control: "select",
      options: ["default", "agencies"],
    },
    size: {
      control: "select",
      options: ["16", "20", "24", "32", "40", "48", "64"],
    },
  },
} satisfies Meta<typeof Logo>;

export default meta;
type Story = StoryObj<typeof meta>;

const VARIANTS = ["full", "icon", "wordmark", "portrait"] as const;

/**
 * Both versions across every variant and colour. `whiteAlways` sits on an inverted
 * surface so it stays visible — it renders white regardless of the active theme.
 */
export const AllVariants: Story = {
  parameters: { layout: "padded" },
  render: () => (
    <div className="flex flex-col gap-10">
      {(["default", "agencies"] as const).map((version) => (
        <div key={version} className="flex flex-col gap-4">
          <h3 className="typography-body-small-14px-semibold text-content-primary capitalize">
            {version}
          </h3>
          <div className="grid grid-cols-[auto_repeat(4,minmax(0,1fr))] items-center gap-x-8 gap-y-6">
            <span />
            {VARIANTS.map((variant) => (
              <span
                key={variant}
                className="typography-description-12px-semibold text-content-tertiary"
              >
                {variant}
              </span>
            ))}
            {(["fullColour", "decolour", "blackAlways"] as const).map((color) => (
              <Row key={color} color={color} version={version} />
            ))}
          </div>
          <div className="grid grid-cols-[auto_repeat(4,minmax(0,1fr))] items-center gap-x-8 rounded-xs bg-surface-primary-inverted p-4">
            <Row color="whiteAlways" version={version} inverted />
          </div>
        </div>
      ))}
    </div>
  ),
};

const Row = ({
  color,
  version,
  inverted = false,
}: {
  color: "fullColour" | "decolour" | "whiteAlways" | "blackAlways";
  version: "default" | "agencies";
  inverted?: boolean;
}) => (
  <>
    <span
      className={`typography-description-12px-semibold ${
        inverted ? "text-content-primary-inverted" : "text-content-tertiary"
      }`}
    >
      {color}
    </span>
    {VARIANTS.map((variant) => (
      <Logo key={variant} variant={variant} color={color} version={version} size="40" />
    ))}
  </>
);

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col items-start gap-6">
      <Logo size="16" />
      <Logo size="20" />
      <Logo size="24" />
      <Logo size="32" />
      <Logo size="40" />
      <Logo size="48" />
      <Logo size="64" />
    </div>
  ),
};
