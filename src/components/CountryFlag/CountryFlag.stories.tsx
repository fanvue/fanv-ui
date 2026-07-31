import type { Meta, StoryObj } from "@storybook/react";
import { CountryFlag, type CountryFlagSize } from "./CountryFlag";
import { FLAG_SHAPES } from "./flagShapes";

const meta = {
  title: "Components/CountryFlag",
  component: CountryFlag,
  parameters: {
    layout: "padded",
    design: {
      type: "figma",
      url: "https://www.figma.com/design/23x2vofTPkLpbcJyRdDa55/Creator---Management%E2%80%A8--Teams?node-id=8294-29097",
    },
  },
  args: {
    country: "US",
    label: "United States",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof CountryFlag>;

export default meta;
type Story = StoryObj<typeof CountryFlag>;

const SIZES: CountryFlagSize[] = [16, 20, 24, 32];

export const Default: Story = {};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-end gap-4">
      {SIZES.map((size) => (
        <span key={size} className="flex flex-col items-center gap-2">
          <CountryFlag country="US" size={size} />
          <span className="typography-description-12px-regular text-content-secondary">{size}</span>
        </span>
      ))}
    </div>
  ),
};

export const Unknown: Story = {
  name: "Unknown country code",
  args: { country: "zz", label: undefined },
  render: (args) => (
    <p className="typography-body-small-14px-regular text-content-secondary">
      Nothing renders for a code we hold no artwork for:
      <CountryFlag {...args} />
    </p>
  ),
};

export const AllFlags: Story = {
  name: "Every flag",
  render: () => (
    <div className="flex flex-wrap gap-2">
      {Object.keys(FLAG_SHAPES).map((code) => (
        <CountryFlag key={code} country={code} label={code.toUpperCase()} />
      ))}
    </div>
  ),
};
