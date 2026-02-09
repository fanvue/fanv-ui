import type { Meta, StoryObj } from "@storybook/react";
import { HomeIcon, MicrophoneIcon, StopIcon } from "../Icons";
import { IconButton } from "./IconButton";

const meta = {
  title: "Components/IconButton",
  component: IconButton,
  parameters: {
    layout: "centered",
    design: {
      type: "figma",
      url: "https://www.figma.com/design/S8zFdcOjt4qN4PrwntuCdt/Fanvue-Library?node-id=87-4400",
    },
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: [
        "primary",
        "secondary",
        "tertiary",
        "brand",
        "contrast",
        "messaging",
        "navTray",
        "tertiaryDestructive",
        "stop",
        "microphone",
      ],
    },
    size: {
      control: "select",
      options: ["24", "32", "40", "52", "72"],
    },
    counterValue: { control: "number" },
  },
} satisfies Meta<typeof IconButton>;

export default meta;
type Story = StoryObj<typeof meta>;

// Primary variants
export const Primary24: Story = {
  args: {
    variant: "primary",
    size: "24",
    icon: <HomeIcon />,
    "aria-label": "Home",
  },
};

export const Primary32: Story = {
  args: {
    variant: "primary",
    size: "32",
    icon: <HomeIcon />,
  },
};

export const Primary40: Story = {
  args: {
    variant: "primary",
    size: "40",
    icon: <HomeIcon />,
  },
};

export const PrimaryDisabled: Story = {
  args: {
    variant: "primary",
    size: "40",
    icon: <HomeIcon />,
    disabled: true,
  },
};

// Secondary variants
export const Secondary24: Story = {
  args: {
    variant: "secondary",
    size: "24",
    icon: <HomeIcon />,
  },
};

export const Secondary32: Story = {
  args: {
    variant: "secondary",
    size: "32",
    icon: <HomeIcon />,
  },
};

export const Secondary40: Story = {
  args: {
    variant: "secondary",
    size: "40",
    icon: <HomeIcon />,
  },
};

export const SecondaryDisabled: Story = {
  args: {
    variant: "secondary",
    size: "40",
    icon: <HomeIcon />,
    disabled: true,
  },
};

// Tertiary variants
export const Tertiary24: Story = {
  args: {
    variant: "tertiary",
    size: "24",
    icon: <HomeIcon />,
  },
};

export const Tertiary32: Story = {
  args: {
    variant: "tertiary",
    size: "32",
    icon: <HomeIcon />,
  },
};

export const Tertiary40: Story = {
  args: {
    variant: "tertiary",
    size: "40",
    icon: <HomeIcon />,
  },
};

export const TertiaryDisabled: Story = {
  args: {
    variant: "tertiary",
    size: "40",
    icon: <HomeIcon />,
    disabled: true,
  },
};

export const TertiaryWithCounter: Story = {
  args: {
    variant: "tertiary",
    size: "40",
    icon: <HomeIcon />,
    counterShow: true,
    counterValue: 12,
  },
};

// Brand variants
export const Brand24: Story = {
  args: {
    variant: "brand",
    size: "24",
    icon: <HomeIcon />,
  },
};

export const Brand40: Story = {
  args: {
    variant: "brand",
    size: "40",
    icon: <HomeIcon />,
  },
};

export const BrandDisabled: Story = {
  args: {
    variant: "brand",
    size: "40",
    icon: <HomeIcon />,
    disabled: true,
  },
};

// Contrast variants
export const Contrast24: Story = {
  args: {
    variant: "contrast",
    size: "24",
    icon: <HomeIcon />,
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};

// Tertiary Destructive variants
export const TertiaryDestructive24: Story = {
  args: {
    variant: "tertiaryDestructive",
    size: "24",
    icon: <HomeIcon />,
  },
};

export const TertiaryDestructive32: Story = {
  args: {
    variant: "tertiaryDestructive",
    size: "32",
    icon: <HomeIcon />,
  },
};

export const TertiaryDestructiveDisabled: Story = {
  args: {
    variant: "tertiaryDestructive",
    size: "32",
    icon: <HomeIcon />,
    disabled: true,
  },
};

// Nav tray variants
export const NavTray40: Story = {
  args: {
    variant: "navTray",
    size: "40",
    icon: <HomeIcon />,
  },
};

export const NavTrayWithCounter: Story = {
  args: {
    variant: "navTray",
    size: "40",
    icon: <HomeIcon />,
    counterValue: 12,
  },
};

export const NavTrayDisabled: Story = {
  args: {
    variant: "navTray",
    size: "40",
    icon: <HomeIcon />,
    disabled: true,
  },
};

// Messaging variant
export const Messaging52: Story = {
  args: {
    variant: "messaging",
    size: "52",
    icon: <HomeIcon />,
  },
};

export const MessagingDisabled: Story = {
  args: {
    variant: "messaging",
    size: "52",
    icon: <HomeIcon />,
    disabled: true,
  },
};

// Microphone variant
export const Microphone72: Story = {
  args: {
    variant: "microphone",
    size: "72",
    icon: <MicrophoneIcon />,
  },
};

// Stop variant
export const Stop72: Story = {
  args: {
    variant: "stop",
    size: "72",
    icon: <StopIcon />,
  },
};
