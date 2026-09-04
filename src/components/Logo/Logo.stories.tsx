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
      options: ["full", "icon", "wordmark", "portrait", "3d"],
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
      options: ["16", "20", "24", "32", "40", "48", "64", "80"],
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

/**
 * The 3D mark is icon-only and has one fixed treatment, so `color` and `version` do not
 * apply. The mark is clipped to its own box but casts a green glow beneath it, which is why
 * the sizes below are spaced further apart than the flat variants need. The glow keeps Figma's
 * absolute values at every size below 80, so it reads at full strength on the nav's 24px mark.
 */
export const ThreeD: Story = {
  parameters: { layout: "padded" },
  render: () => (
    <div className="flex flex-wrap items-end gap-16 p-4 pb-16">
      {(["24", "32", "48", "64", "80"] as const).map((size) => (
        <div key={size} className="flex flex-col items-start gap-3">
          <Logo variant="3d" size={size} aria-label="Fanvue" />
          <span className="typography-description-12px-semibold text-content-tertiary">{size}</span>
        </div>
      ))}
    </div>
  ),
};

/**
 * The nav slot the 3D mark is intended for: a 32px square holding a 24px logo, matching
 * `DesktopNavigationHeader`. Shown on both surfaces because the glow is green and reads
 * differently against each.
 */
export const ThreeDInNavSlot: Story = {
  parameters: { layout: "padded" },
  render: () => (
    <div className="flex gap-8">
      {(["bg-surface-primary", "bg-surface-primary-inverted"] as const).map((surface) => (
        <div key={surface} className={`flex gap-6 rounded-xs p-6 ${surface}`}>
          {(["icon", "3d"] as const).map((variant) => (
            <div
              key={variant}
              className="grid size-8 place-items-center rounded-sm outline-dashed outline-1 outline-content-tertiary"
            >
              <Logo variant={variant} size="24" className="size-6" aria-label="Fanvue" />
            </div>
          ))}
        </div>
      ))}
    </div>
  ),
};
