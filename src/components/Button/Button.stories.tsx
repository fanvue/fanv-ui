import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./Button";

const meta = {
  title: "Components/Button",
  component: Button,
  parameters: {
    layout: "centered",
    design: {
      type: "figma",
      url: "https://www.figma.com/design/S8zFdcOjt4qN4PrwntuCdt/Fanvue-Library?node-id=87-4100&m=dev",
    },
  },
  tags: ["autodocs"],
  argTypes: {
    Style: {
      control: "select",
      options: [
        "Primary",
        "Secondary",
        "Tertiary",
        "Link",
        "Brand",
        "Destructive",
        "White",
        "Switch",
        "Tertiary Destructive",
        "Text",
      ],
    },
    Size: {
      control: "select",
      options: ["48", "40", "32", "24"],
    },
    loading: { control: "boolean" },
    disabled: { control: "boolean" },
    active: { control: "boolean" },
    discount: { control: "text" },
    price: { control: "text" },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    Style: "Primary",
    Size: "48",
    children: "Label",
  },
};

export const Secondary: Story = {
  args: {
    Style: "Secondary",
    Size: "48",
    children: "Label",
  },
};

export const Tertiary: Story = {
  args: {
    Style: "Tertiary",
    Size: "48",
    children: "Label",
  },
};

export const Link: Story = {
  args: {
    Style: "Link",
    Size: "48",
    children: "Label",
  },
};

export const Brand: Story = {
  args: {
    Style: "Brand",
    Size: "48",
    children: "Label",
  },
};

export const Destructive: Story = {
  args: {
    Style: "Destructive",
    Size: "48",
    children: "Label",
  },
};

export const White: Story = {
  args: {
    Style: "White",
    Size: "48",
    children: "Label",
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};

export const Switch: Story = {
  args: {
    Style: "Switch",
    Size: "40",
    children: "Label",
  },
};

export const SwitchActive: Story = {
  args: {
    Style: "Switch",
    Size: "40",
    active: true,
    children: "Label",
  },
};

export const TertiaryDestructive: Story = {
  args: {
    Style: "Tertiary Destructive",
    Size: "32",
    children: "Label",
  },
};

export const Text: Story = {
  args: {
    Style: "Text",
    Size: "24",
    children: "Label",
  },
};

export const Size48: Story = {
  args: {
    Style: "Primary",
    Size: "48",
    children: "Label",
  },
};

export const Size40: Story = {
  args: {
    Style: "Primary",
    Size: "40",
    children: "Label",
  },
};

export const Size32: Story = {
  args: {
    Style: "Primary",
    Size: "32",
    children: "Label",
  },
};

export const Size24: Story = {
  args: {
    Style: "Text",
    Size: "24",
    children: "Label",
  },
};

export const Disabled: Story = {
  args: {
    Style: "Primary",
    Size: "48",
    disabled: true,
    children: "Label",
  },
};

export const Loading: Story = {
  args: {
    Style: "Primary",
    Size: "48",
    loading: true,
    children: "Label",
  },
};

export const LoadingSecondary: Story = {
  args: {
    Style: "Secondary",
    Size: "48",
    loading: true,
    children: "Label",
  },
};

export const LoadingBrand: Story = {
  args: {
    Style: "Brand",
    Size: "48",
    loading: true,
    children: "Label",
  },
};

const PlusIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className="size-5"
    aria-hidden="true"
  >
    <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className="size-5"
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z"
      clipRule="evenodd"
    />
  </svg>
);

export const WithLeftIcon: Story = {
  args: {
    Style: "Primary",
    Size: "48",
    leftIcon: <PlusIcon />,
    children: "Add Item",
  },
};

export const WithRightIcon: Story = {
  args: {
    Style: "Primary",
    Size: "48",
    rightIcon: <ArrowRightIcon />,
    children: "Continue",
  },
};

export const WithBothIcons: Story = {
  args: {
    Style: "Secondary",
    Size: "48",
    leftIcon: <PlusIcon />,
    rightIcon: <ArrowRightIcon />,
    children: "Action",
  },
};

export const IconOnly: Story = {
  args: {
    Style: "Primary",
    Size: "48",
    leftIcon: <PlusIcon />,
    children: "",
    className: "px-3",
  },
};

export const AsLink: Story = {
  args: {
    Style: "Primary",
    Size: "48",
    asChild: true,
    children: <a href="https://fanvue.com">Visit Fanvue</a>,
  },
};

const CrownIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className="size-5"
    aria-hidden="true"
  >
    <path d="M10 2a1 1 0 011 1v1.323l1.45-.363a1 1 0 01.55 1.92l-1.15.288.5 1.5 2.5-.625a1 1 0 01.62 1.9l-3 1.5a1 1 0 01-.9 0l-3-1.5a1 1 0 01.62-1.9l2.5.625.5-1.5-1.15-.288a1 1 0 01.55-1.92l1.45.363V3a1 1 0 011-1zM4 8h12v8H4V8z" />
  </svg>
);

export const WithPrice: Story = {
  args: {
    Style: "Primary",
    Size: "48",
    children: "Subscribe",
    price: "$9.99/month",
  },
  parameters: {
    design: {
      type: "figma",
      url: "https://www.figma.com/design/S8zFdcOjt4qN4PrwntuCdt/Fanvue-Library?node-id=11461-10108&m=dev",
    },
  },
};

export const JoinNowWithPrice: Story = {
  args: {
    Style: "White",
    Size: "48",
    children: "Join now",
    rightIcon: <CrownIcon />,
    price: "$X.XX/ month",
  },
  parameters: {
    backgrounds: { default: "dark" },
    design: {
      type: "figma",
      url: "https://www.figma.com/design/S8zFdcOjt4qN4PrwntuCdt/Fanvue-Library?node-id=11461-10108&m=dev",
    },
  },
};

export const WithDiscountAndPrice: Story = {
  args: {
    Style: "Primary",
    Size: "48",
    children: "Subscribe",
    discount: "$19.99/month",
    price: "$9.99/month",
  },
  parameters: {
    design: {
      type: "figma",
      url: "https://www.figma.com/design/S8zFdcOjt4qN4PrwntuCdt/Fanvue-Library?node-id=11461-10108&m=dev",
    },
  },
};

export const AllStylesSize48: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <Button Style="Primary" Size="48">
        Primary
      </Button>
      <Button Style="Secondary" Size="48">
        Secondary
      </Button>
      <Button Style="Tertiary" Size="48">
        Tertiary
      </Button>
      <Button Style="Link" Size="48">
        Link
      </Button>
      <Button Style="Brand" Size="48">
        Brand
      </Button>
      <Button Style="Destructive" Size="48">
        Destructive
      </Button>
      <div className="rounded bg-neutral-400 p-2">
        <Button Style="White" Size="48">
          White
        </Button>
      </div>
    </div>
  ),
};

export const AllStylesSize40: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <Button Style="Primary" Size="40">
        Primary
      </Button>
      <Button Style="Secondary" Size="40">
        Secondary
      </Button>
      <Button Style="Tertiary" Size="40">
        Tertiary
      </Button>
      <Button Style="Link" Size="40">
        Link
      </Button>
      <Button Style="Brand" Size="40">
        Brand
      </Button>
      <Button Style="Destructive" Size="40">
        Destructive
      </Button>
      <div className="rounded bg-neutral-400 p-2">
        <Button Style="White" Size="40">
          White
        </Button>
      </div>
      <Button Style="Switch" Size="40">
        Switch
      </Button>
      <Button Style="Switch" Size="40" active>
        Switch Active
      </Button>
    </div>
  ),
};

export const AllStylesSize32: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <Button Style="Primary" Size="32">
        Primary
      </Button>
      <Button Style="Secondary" Size="32">
        Secondary
      </Button>
      <Button Style="Tertiary" Size="32">
        Tertiary
      </Button>
      <Button Style="Brand" Size="32">
        Brand
      </Button>
      <Button Style="Destructive" Size="32">
        Destructive
      </Button>
      <div className="rounded bg-neutral-400 p-2">
        <Button Style="White" Size="32">
          White
        </Button>
      </div>
      <Button Style="Tertiary Destructive" Size="32">
        Tertiary Destructive
      </Button>
      <Button Style="Switch" Size="32">
        Switch
      </Button>
    </div>
  ),
};

export const AllStatesMatrix: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <span className="w-24 text-sm">Default:</span>
        <Button Style="Primary" Size="48">
          Label
        </Button>
        <Button Style="Secondary" Size="48">
          Label
        </Button>
        <Button Style="Tertiary" Size="48">
          Label
        </Button>
      </div>
      <div className="flex items-center gap-4">
        <span className="w-24 text-sm">Disabled:</span>
        <Button Style="Primary" Size="48" disabled>
          Label
        </Button>
        <Button Style="Secondary" Size="48" disabled>
          Label
        </Button>
        <Button Style="Tertiary" Size="48" disabled>
          Label
        </Button>
      </div>
      <div className="flex items-center gap-4">
        <span className="w-24 text-sm">Loading:</span>
        <Button Style="Primary" Size="48" loading>
          Label
        </Button>
        <Button Style="Secondary" Size="48" loading>
          Label
        </Button>
        <Button Style="Tertiary" Size="48" loading>
          Label
        </Button>
      </div>
    </div>
  ),
};
