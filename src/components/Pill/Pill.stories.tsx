import type { Meta, StoryObj } from "@storybook/react";
import { ArrowUpRightIcon } from "../Icons/ArrowAltIcon";
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
        "green",
        "grey",
        "blue",
        "gold",
        "pinkLight",
        "base",
        "brand",
        "brandLight",
        "beta",
        "error",
      ],
    },
  },
} satisfies Meta<typeof Pill>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Green: Story = {
  args: {
    variant: "green",
    children: "Subscriber",
  },
};

export const Grey: Story = {
  args: {
    variant: "grey",
    children: "Expired",
  },
};

export const Blue: Story = {
  args: {
    variant: "blue",
    children: "Follower",
  },
};

export const Gold: Story = {
  args: {
    variant: "gold",
    children: "VIP Subscriber",
  },
};

export const PinkLight: Story = {
  args: {
    variant: "pinkLight",
    children: "Text",
  },
};

export const Base: Story = {
  args: {
    variant: "base",
    children: "Example",
  },
};

export const Brand: Story = {
  args: {
    variant: "brand",
    children: "20% discount",
  },
};

export const BrandLight: Story = {
  args: {
    variant: "brandLight",
    children: "20% discount",
  },
};

export const Beta: Story = {
  args: {
    variant: "beta",
    children: "Beta",
  },
};

// biome-ignore lint/suspicious/noShadowRestrictedNames: Story name must match Figma variant
export const Error: Story = {
  args: {
    variant: "error",
    children: "Error",
  },
};

export const LeftIcon: Story = {
  args: {
    variant: "base",
    leftIcon: <FireIcon className="size-4" />,
    children: "Example",
  },
};

export const RightIcon: Story = {
  args: {
    variant: "brand",
    rightIcon: <ArrowUpRightIcon className="size-4" />,
    children: "20% discount",
  },
};
