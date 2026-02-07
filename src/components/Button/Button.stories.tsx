import type { Meta, StoryObj } from "@storybook/react";
import { ArrowRightIcon } from "../Icons/ArrowRightIcon";
import { CrownIcon } from "../Icons/CrownIcon";
import { PlusIcon } from "../Icons/PlusIcon";
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
    variant: {
      control: "select",
      options: [
        "primary",
        "secondary",
        "tertiary",
        "link",
        "brand",
        "destructive",
        "white",
        "switch",
        "tertiaryDestructive",
        "text",
      ],
    },
    size: {
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
    variant: "primary",
    size: "48",
    children: "Label",
  },
};

export const Secondary: Story = {
  args: {
    variant: "secondary",
    size: "48",
    children: "Label",
  },
};

export const Tertiary: Story = {
  args: {
    variant: "tertiary",
    size: "48",
    children: "Label",
  },
};

export const Link: Story = {
  args: {
    variant: "link",
    size: "48",
    children: "Label",
  },
};

export const Brand: Story = {
  args: {
    variant: "brand",
    size: "48",
    children: "Label",
  },
};

export const Destructive: Story = {
  args: {
    variant: "destructive",
    size: "48",
    children: "Label",
  },
};

export const White: Story = {
  args: {
    variant: "white",
    size: "48",
    children: "Label",
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};

export const Switch: Story = {
  args: {
    variant: "switch",
    size: "40",
    children: "Label",
  },
};

export const SwitchActive: Story = {
  args: {
    variant: "switch",
    size: "40",
    active: true,
    children: "Label",
  },
};

export const TertiaryDestructive: Story = {
  args: {
    variant: "tertiaryDestructive",
    size: "32",
    children: "Label",
  },
};

export const Text: Story = {
  args: {
    variant: "text",
    size: "24",
    children: "Label",
  },
};

export const Size48: Story = {
  args: {
    variant: "primary",
    size: "48",
    children: "Label",
  },
};

export const Size40: Story = {
  args: {
    variant: "primary",
    size: "40",
    children: "Label",
  },
};

export const Size32: Story = {
  args: {
    variant: "primary",
    size: "32",
    children: "Label",
  },
};

export const Size24: Story = {
  args: {
    variant: "text",
    size: "24",
    children: "Label",
  },
};

export const Disabled: Story = {
  args: {
    variant: "primary",
    size: "48",
    disabled: true,
    children: "Label",
  },
};

export const Loading: Story = {
  args: {
    variant: "primary",
    size: "48",
    loading: true,
    children: "Label",
  },
};

export const LoadingSecondary: Story = {
  args: {
    variant: "secondary",
    size: "48",
    loading: true,
    children: "Label",
  },
};

export const LoadingBrand: Story = {
  args: {
    variant: "brand",
    size: "48",
    loading: true,
    children: "Label",
  },
};

export const WithLeftIcon: Story = {
  args: {
    variant: "primary",
    size: "48",
    leftIcon: <PlusIcon size={5} />,
    children: "Add Item",
  },
};

export const WithRightIcon: Story = {
  args: {
    variant: "primary",
    size: "48",
    rightIcon: <ArrowRightIcon size={5} />,
    children: "Continue",
  },
};

export const WithBothIcons: Story = {
  args: {
    variant: "secondary",
    size: "48",
    leftIcon: <PlusIcon size={5} />,
    rightIcon: <ArrowRightIcon size={5} />,
    children: "Action",
  },
};

export const IconOnly: Story = {
  args: {
    variant: "primary",
    size: "48",
    leftIcon: <PlusIcon size={5} />,
    children: "",
    className: "px-3",
  },
};

export const AsLink: Story = {
  args: {
    variant: "primary",
    size: "48",
    asChild: true,
    children: <a href="https://fanvue.com">Visit Fanvue</a>,
  },
};

export const WithPrice: Story = {
  args: {
    variant: "primary",
    size: "48",
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
    variant: "white",
    size: "48",
    children: "Join now",
    rightIcon: <CrownIcon size={5} />,
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
    variant: "primary",
    size: "48",
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
      <Button variant="primary" size="48">
        Primary
      </Button>
      <Button variant="secondary" size="48">
        Secondary
      </Button>
      <Button variant="tertiary" size="48">
        Tertiary
      </Button>
      <Button variant="link" size="48">
        Link
      </Button>
      <Button variant="brand" size="48">
        Brand
      </Button>
      <Button variant="destructive" size="48">
        Destructive
      </Button>
      <div className="rounded bg-neutral-400 p-2">
        <Button variant="white" size="48">
          White
        </Button>
      </div>
    </div>
  ),
};

export const AllStylesSize40: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <Button variant="primary" size="40">
        Primary
      </Button>
      <Button variant="secondary" size="40">
        Secondary
      </Button>
      <Button variant="tertiary" size="40">
        Tertiary
      </Button>
      <Button variant="link" size="40">
        Link
      </Button>
      <Button variant="brand" size="40">
        Brand
      </Button>
      <Button variant="destructive" size="40">
        Destructive
      </Button>
      <div className="rounded bg-neutral-400 p-2">
        <Button variant="white" size="40">
          White
        </Button>
      </div>
      <Button variant="switch" size="40">
        Switch
      </Button>
      <Button variant="switch" size="40" active>
        Switch Active
      </Button>
    </div>
  ),
};

export const AllStylesSize32: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <Button variant="primary" size="32">
        Primary
      </Button>
      <Button variant="secondary" size="32">
        Secondary
      </Button>
      <Button variant="tertiary" size="32">
        Tertiary
      </Button>
      <Button variant="brand" size="32">
        Brand
      </Button>
      <Button variant="destructive" size="32">
        Destructive
      </Button>
      <div className="rounded bg-neutral-400 p-2">
        <Button variant="white" size="32">
          White
        </Button>
      </div>
      <Button variant="tertiaryDestructive" size="32">
        Tertiary Destructive
      </Button>
      <Button variant="switch" size="32">
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
        <Button variant="primary" size="48">
          Label
        </Button>
        <Button variant="secondary" size="48">
          Label
        </Button>
        <Button variant="tertiary" size="48">
          Label
        </Button>
      </div>
      <div className="flex items-center gap-4">
        <span className="w-24 text-sm">Disabled:</span>
        <Button variant="primary" size="48" disabled>
          Label
        </Button>
        <Button variant="secondary" size="48" disabled>
          Label
        </Button>
        <Button variant="tertiary" size="48" disabled>
          Label
        </Button>
      </div>
      <div className="flex items-center gap-4">
        <span className="w-24 text-sm">Loading:</span>
        <Button variant="primary" size="48" loading>
          Label
        </Button>
        <Button variant="secondary" size="48" loading>
          Label
        </Button>
        <Button variant="tertiary" size="48" loading>
          Label
        </Button>
      </div>
    </div>
  ),
};
