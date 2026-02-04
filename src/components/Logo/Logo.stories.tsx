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
    type: {
      control: "select",
      options: ["Full", "Icon", "Wordmark", "Portrait"],
    },
    color: {
      control: "select",
      options: ["Full colour", "Decolour", "White Always", "Black Always"],
    },
  },
} satisfies Meta<typeof Logo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const FullColour: Story = {
  args: {
    type: "Full",
    color: "Full colour",
  },
};

export const FullDecolour: Story = {
  args: {
    type: "Full",
    color: "Decolour",
  },
};

export const FullWhiteAlways: Story = {
  args: {
    type: "Full",
    color: "White Always",
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};

export const FullBlackAlways: Story = {
  args: {
    type: "Full",
    color: "Black Always",
  },
};

export const IconFullColour: Story = {
  args: {
    type: "Icon",
    color: "Full colour",
  },
};

export const IconDecolour: Story = {
  args: {
    type: "Icon",
    color: "Decolour",
  },
};

export const IconWhiteAlways: Story = {
  args: {
    type: "Icon",
    color: "White Always",
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};

export const IconBlackAlways: Story = {
  args: {
    type: "Icon",
    color: "Black Always",
  },
};

export const WordmarkFullColour: Story = {
  args: {
    type: "Wordmark",
    color: "Full colour",
  },
};

export const WordmarkDecolour: Story = {
  args: {
    type: "Wordmark",
    color: "Decolour",
  },
};

export const WordmarkWhiteAlways: Story = {
  args: {
    type: "Wordmark",
    color: "White Always",
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};

export const WordmarkBlackAlways: Story = {
  args: {
    type: "Wordmark",
    color: "Black Always",
  },
};

export const PortraitFullColour: Story = {
  args: {
    type: "Portrait",
    color: "Full colour",
  },
};

export const PortraitDecolour: Story = {
  args: {
    type: "Portrait",
    color: "Decolour",
  },
};

export const PortraitWhiteAlways: Story = {
  args: {
    type: "Portrait",
    color: "White Always",
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};

export const PortraitBlackAlways: Story = {
  args: {
    type: "Portrait",
    color: "Black Always",
  },
};
