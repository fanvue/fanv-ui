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
    type: {
      control: "select",
      options: [
        "Default",
        "Dark",
        "Success",
        "Warning",
        "Error",
        "Special",
        "Info",
        "Online",
        "Brand",
        "Pink",
        "Brand light",
        "Pink light",
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
    type: "Dark",
    children: "Badge",
  },
};

export const Success: Story = {
  args: {
    type: "Success",
    children: "Success",
  },
};

export const Warning: Story = {
  args: {
    type: "Warning",
    children: "Warning",
  },
};

// biome-ignore lint/suspicious/noShadowRestrictedNames: Story name must match Figma variant
export const Error: Story = {
  args: {
    type: "Error",
    children: "Error",
  },
};

export const Special: Story = {
  args: {
    type: "Special",
    children: "Special",
  },
};

export const Info: Story = {
  args: {
    type: "Info",
    children: "Info",
  },
};

export const Online: Story = {
  args: {
    type: "Online",
    children: "Online",
  },
};

export const Brand: Story = {
  args: {
    type: "Brand",
    children: "Brand",
  },
};

export const Pink: Story = {
  args: {
    type: "Pink",
    children: "Pink",
  },
};

export const BrandLight: Story = {
  args: {
    type: "Brand light",
    children: "Brand Light",
  },
};

export const PinkLight: Story = {
  args: {
    type: "Pink light",
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
