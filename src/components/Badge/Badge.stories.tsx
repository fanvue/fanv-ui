import type { Meta, StoryObj } from "@storybook/react";
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
    leftIcon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        className="size-3"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
          clipRule="evenodd"
        />
      </svg>
    ),
    leftDot: false,
    children: "Verified",
  },
};

export const RightIcon: Story = {
  args: {
    rightIcon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        className="size-3"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M5.22 14.78a.75.75 0 001.06 0l7.22-7.22v5.69a.75.75 0 001.5 0v-7.5a.75.75 0 00-.75-.75h-7.5a.75.75 0 000 1.5h5.69l-7.22 7.22a.75.75 0 000 1.06z"
          clipRule="evenodd"
        />
      </svg>
    ),
    leftDot: false,
    children: "Link",
  },
};
