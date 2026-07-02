import type { Meta, StoryObj } from "@storybook/react";
import { AIIcon } from "../Icons/AIIcon";
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
        "successColour",
        "warningColour",
        "errorColour",
        "infoColour",
        "aiGenerated",
        "negative",
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

export const SuccessColour: Story = {
  args: {
    variant: "successColour",
    children: "Success",
  },
};

export const WarningColour: Story = {
  args: {
    variant: "warningColour",
    children: "Warning",
  },
};

export const ErrorColour: Story = {
  args: {
    variant: "errorColour",
    children: "Error",
  },
};

export const InfoColour: Story = {
  args: {
    variant: "infoColour",
    children: "Info",
  },
};

export const AIGenerated: Story = {
  args: {
    variant: "aiGenerated",
    leftDot: false,
    leftIcon: <AIIcon className="size-3" />,
    children: "AI Generated",
  },
};

export const Negative: Story = {
  args: {
    variant: "negative",
    children: "Negative",
  },
  decorators: [
    (Story) => (
      <div className="rounded-xs bg-surface-primary-inverted p-4">
        <Story />
      </div>
    ),
  ],
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

export const Truncated: Story = {
  render: () => (
    <div className="flex flex-col gap-3" style={{ width: 80 }}>
      <Badge variant="success">Very long badge text here</Badge>
      <Badge variant="brand" leftDot={false} leftIcon={<CheckCircleIcon className="size-3" />}>
        Truncated with icon
      </Badge>
      <Badge variant="default" rightIcon={<ArrowUpRightIcon className="size-3" />}>
        Truncated right icon
      </Badge>
    </div>
  ),
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
