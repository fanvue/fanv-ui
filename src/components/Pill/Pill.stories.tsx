import type { Meta, StoryObj } from "@storybook/react";
import { ArrowUpRightIcon } from "../Icons/ArrowUpRightIcon";
import { FireIcon } from "../Icons/FireIcon";
import { Pill } from "./Pill";

const meta = {
  title: "Components/Pill",
  component: Pill,
  parameters: {
    layout: "centered",
    design: {
      type: "figma",
      url: "https://www.figma.com/design/S8zFdcOjt4qN4PrwntuCdt/Fanvue-Library?node-id=694-4211&m=dev",
    },
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: [
        "Green",
        "Grey",
        "Blue",
        "Gold",
        "Pink Light",
        "Base",
        "Brand",
        "Brand light",
        "Beta",
        "Error",
      ],
    },
  },
} satisfies Meta<typeof Pill>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Green: Story = {
  args: {
    variant: "Green",
    children: "Subscriber",
  },
};

export const Grey: Story = {
  args: {
    variant: "Grey",
    children: "Expired",
  },
};

export const Blue: Story = {
  args: {
    variant: "Blue",
    children: "Follower",
  },
};

export const Gold: Story = {
  args: {
    variant: "Gold",
    children: "VIP Subscriber",
  },
};

export const PinkLight: Story = {
  args: {
    variant: "Pink Light",
    children: "Text",
  },
};

export const Base: Story = {
  args: {
    variant: "Base",
    children: "Example",
  },
};

export const Brand: Story = {
  args: {
    variant: "Brand",
    children: "20% discount",
  },
};

export const BrandLight: Story = {
  args: {
    variant: "Brand light",
    children: "20% discount",
  },
};

export const Beta: Story = {
  args: {
    variant: "Beta",
    children: "Beta",
  },
};

// biome-ignore lint/suspicious/noShadowRestrictedNames: Story name must match Figma variant
export const Error: Story = {
  args: {
    variant: "Error",
    children: "Error",
  },
};

export const LeftIcon: Story = {
  args: {
    variant: "Base",
    leftIcon: <FireIcon className="size-4" />,
    children: "Example",
  },
};

export const RightIcon: Story = {
  args: {
    variant: "Brand",
    rightIcon: <ArrowUpRightIcon className="size-4" />,
    children: "20% discount",
  },
};
