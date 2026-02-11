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
      options: ["full", "icon", "wordmark", "portrait"],
    },
    color: {
      control: "select",
      options: ["fullColour", "decolour", "whiteAlways", "blackAlways"],
    },
  },
} satisfies Meta<typeof Logo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const FullColour: Story = {
  args: {
    type: "full",
    color: "fullColour",
  },
};

export const FullDecolour: Story = {
  args: {
    type: "full",
    color: "decolour",
  },
};

export const FullWhiteAlways: Story = {
  args: {
    type: "full",
    color: "whiteAlways",
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};

export const FullBlackAlways: Story = {
  args: {
    type: "full",
    color: "blackAlways",
  },
};

export const IconFullColour: Story = {
  args: {
    type: "icon",
    color: "fullColour",
  },
};

export const IconDecolour: Story = {
  args: {
    type: "icon",
    color: "decolour",
  },
};

export const IconWhiteAlways: Story = {
  args: {
    type: "icon",
    color: "whiteAlways",
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};

export const IconBlackAlways: Story = {
  args: {
    type: "icon",
    color: "blackAlways",
  },
};

export const WordmarkFullColour: Story = {
  args: {
    type: "wordmark",
    color: "fullColour",
  },
};

export const WordmarkDecolour: Story = {
  args: {
    type: "wordmark",
    color: "decolour",
  },
};

export const WordmarkWhiteAlways: Story = {
  args: {
    type: "wordmark",
    color: "whiteAlways",
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};

export const WordmarkBlackAlways: Story = {
  args: {
    type: "wordmark",
    color: "blackAlways",
  },
};

export const PortraitFullColour: Story = {
  args: {
    type: "portrait",
    color: "fullColour",
  },
};

export const PortraitDecolour: Story = {
  args: {
    type: "portrait",
    color: "decolour",
  },
};

export const PortraitWhiteAlways: Story = {
  args: {
    type: "portrait",
    color: "whiteAlways",
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};

export const PortraitBlackAlways: Story = {
  args: {
    type: "portrait",
    color: "blackAlways",
  },
};
