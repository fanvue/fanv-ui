import type { Meta, StoryObj } from "@storybook/react";
import { ArrowUpRightIcon } from "../Icons/ArrowUpRightIcon";
import { CheckCircleIcon } from "../Icons/CheckCircleIcon";
import { Badge } from "./Badge";

const meta = {
  title: "Components/Badge",
  component: Badge,
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
        "default",
        "dark",
        "success",
        "warning",
        "error",
        "special",
        "info",
        "online",
        "brand",
        "pink",
        "brandLight",
        "pinkLight",
      ],
    },
    leftDot: { control: "boolean" },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "Badge",
  },
};

export const Dark: Story = {
  args: {
    variant: "dark",
    children: "Badge",
  },
};

export const Success: Story = {
  args: {
    variant: "success",
    children: "Success",
  },
};

export const Warning: Story = {
  args: {
    variant: "warning",
    children: "Warning",
  },
};

// biome-ignore lint/suspicious/noShadowRestrictedNames: Story name must match Figma variant
export const Error: Story = {
  args: {
    variant: "error",
    children: "Error",
  },
};

export const Special: Story = {
  args: {
    variant: "special",
    children: "Special",
  },
};

export const Info: Story = {
  args: {
    variant: "info",
    children: "Info",
  },
};

export const Online: Story = {
  args: {
    variant: "online",
    children: "Online",
  },
};

export const Brand: Story = {
  args: {
    variant: "brand",
    children: "Brand",
  },
};

export const Pink: Story = {
  args: {
    variant: "pink",
    children: "Pink",
  },
};

export const BrandLight: Story = {
  args: {
    variant: "brandLight",
    children: "Brand Light",
  },
};

export const PinkLight: Story = {
  args: {
    variant: "pinkLight",
    children: "Pink Light",
  },
};

export const WithoutDot: Story = {
  args: {
    leftDot: false,
    children: "No Dot",
  },
};

export const LeftIcon: Story = {
  args: {
    leftIcon: <CheckCircleIcon className="size-3" />,
    leftDot: false,
    children: "Verified",
  },
};

export const RightIcon: Story = {
  args: {
    rightIcon: <ArrowUpRightIcon className="size-3" />,
    leftDot: false,
    children: "Link",
  },
};
