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
    variant: "full",
    color: "fullColour",
  },
};

export const FullDecolour: Story = {
  args: {
    variant: "full",
    color: "decolour",
  },
};

export const FullWhiteAlways: Story = {
  args: {
    variant: "full",
    color: "whiteAlways",
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};

export const FullBlackAlways: Story = {
  args: {
    variant: "full",
    color: "blackAlways",
  },
};

export const IconFullColour: Story = {
  args: {
    variant: "icon",
    color: "fullColour",
  },
};

export const IconDecolour: Story = {
  args: {
    variant: "icon",
    color: "decolour",
  },
};

export const IconWhiteAlways: Story = {
  args: {
    variant: "icon",
    color: "whiteAlways",
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};

export const IconBlackAlways: Story = {
  args: {
    variant: "icon",
    color: "blackAlways",
  },
};

export const WordmarkFullColour: Story = {
  args: {
    variant: "wordmark",
    color: "fullColour",
  },
};

export const WordmarkDecolour: Story = {
  args: {
    variant: "wordmark",
    color: "decolour",
  },
};

export const WordmarkWhiteAlways: Story = {
  args: {
    variant: "wordmark",
    color: "whiteAlways",
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};

export const WordmarkBlackAlways: Story = {
  args: {
    variant: "wordmark",
    color: "blackAlways",
  },
};

export const PortraitFullColour: Story = {
  args: {
    variant: "portrait",
    color: "fullColour",
  },
};

export const PortraitDecolour: Story = {
  args: {
    variant: "portrait",
    color: "decolour",
  },
};

export const PortraitWhiteAlways: Story = {
  args: {
    variant: "portrait",
    color: "whiteAlways",
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};

export const PortraitBlackAlways: Story = {
  args: {
    variant: "portrait",
    color: "blackAlways",
  },
};
