import type { Meta, StoryObj } from "@storybook/react";
import type { ReactNode } from "react";
import { ArrowRightIcon } from "../Icons/ArrowRightIcon";
import { CrownIcon } from "../Icons/CrownIcon";
import { PlusIcon } from "../Icons/PlusIcon";
import { Pill } from "../Pill/Pill";
import { Button, type ButtonVariant } from "./Button";

const meta = {
  title: "Components/Button",
  component: Button,
  parameters: {
    layout: "centered",
    design: {
      type: "figma",
      url: "https://www.figma.com/design/S8zFdcOjt4qN4PrwntuCdt/Fanvue-Library?node-id=16650-1558&m=dev",
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
        "outline",
        "link",
        "brand",
        "destructive",
        "white",
        "alwaysBlack",
        "ai",
        "tertiaryDestructive",
        "text",
      ],
    },
    size: {
      control: "select",
      options: ["48", "40", "32", "24"],
    },
    negative: { control: "boolean" },
    loading: { control: "boolean" },
    disabled: { control: "boolean" },
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

export const Outline: Story = {
  args: {
    variant: "outline",
    size: "48",
    children: "Label",
  },
};

export const AI: Story = {
  args: {
    variant: "ai",
    size: "48",
    children: "Label",
  },
};

export const AlwaysBlack: Story = {
  args: {
    variant: "alwaysBlack",
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
    leftIcon: <PlusIcon />,
    children: "Add Item",
  },
};

export const WithRightIcon: Story = {
  args: {
    variant: "primary",
    size: "48",
    rightIcon: <ArrowRightIcon />,
    children: "Continue",
  },
};

export const WithBothIcons: Story = {
  args: {
    variant: "secondary",
    size: "48",
    leftIcon: <PlusIcon />,
    rightIcon: <ArrowRightIcon />,
    children: "Action",
  },
};

export const IconOnly: Story = {
  args: {
    variant: "primary",
    size: "48",
    leftIcon: <PlusIcon />,
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
      <div className="rounded bg-neutral-alphas-400 p-2">
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
      <div className="rounded bg-neutral-alphas-400 p-2">
        <Button variant="white" size="40">
          White
        </Button>
      </div>
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
      <div className="rounded bg-neutral-alphas-400 p-2">
        <Button variant="white" size="32">
          White
        </Button>
      </div>
      <Button variant="tertiaryDestructive" size="32">
        Tertiary Destructive
      </Button>
    </div>
  ),
};

export const WithPill: Story = {
  render: () => (
    <Button variant="secondary" size="48">
      Register as a Manager
      <Pill variant="beta" className="shrink-0">
        Beta
      </Pill>
    </Button>
  ),
};

export const WithPillAllSizes: Story = {
  render: () => (
    <div className="flex flex-col items-start gap-4">
      <Button variant="secondary" size="48">
        Register as a Manager
        <Pill variant="beta" className="shrink-0">
          Beta
        </Pill>
      </Button>
      <Button variant="secondary" size="40">
        Register as a Manager
        <Pill variant="beta" className="shrink-0">
          Beta
        </Pill>
      </Button>
      <Button variant="secondary" size="32">
        Register as a Manager
        <Pill variant="beta" className="shrink-0">
          Beta
        </Pill>
      </Button>
    </div>
  ),
};

export const WithPillAsRightIcon: Story = {
  render: () => (
    <div className="flex flex-col items-start gap-4">
      <Button variant="secondary" size="48" rightIcon={<Pill variant="beta">Beta</Pill>}>
        Register as a Manager
      </Button>
      <Button variant="tertiary" size="40" rightIcon={<Pill variant="beta">Beta</Pill>}>
        Become a Manager
      </Button>
    </div>
  ),
};

export const Truncated: Story = {
  render: () => (
    <div className="flex flex-col items-start gap-4" style={{ width: 200 }}>
      <Button variant="brand" size="48" fullWidth>
        Join now Nkr289.50 Nkr101.36/month
      </Button>
      <Button variant="primary" size="40" fullWidth>
        This is a very long button label that should truncate
      </Button>
      <Button variant="secondary" size="32" fullWidth leftIcon={<PlusIcon />}>
        Truncated with icon
      </Button>
      <Button variant="brand" size="48" fullWidth price="$9.99/mo" discount="$19.99">
        Subscribe now
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

const darkSurface = (children: ReactNode) => (
  <div className="rounded-md bg-surface-primary-inverted p-4">{children}</div>
);

export const PrimaryNegative: Story = {
  args: { variant: "primary", size: "48", negative: true, children: "Label" },
  parameters: { backgrounds: { default: "dark" } },
  render: (args) => darkSurface(<Button {...args} />),
};

export const SecondaryNegative: Story = {
  args: { variant: "secondary", size: "48", negative: true, children: "Label" },
  parameters: { backgrounds: { default: "dark" } },
  render: (args) => darkSurface(<Button {...args} />),
};

export const TertiaryNegative: Story = {
  args: { variant: "tertiary", size: "48", negative: true, children: "Label" },
  parameters: { backgrounds: { default: "dark" } },
  render: (args) => darkSurface(<Button {...args} />),
};

export const OutlineNegative: Story = {
  args: { variant: "outline", size: "48", negative: true, children: "Label" },
  parameters: { backgrounds: { default: "dark" } },
  render: (args) => darkSurface(<Button {...args} />),
};

const NEGATIVE_AWARE_VARIANTS_LIST: ButtonVariant[] = [
  "primary",
  "secondary",
  "tertiary",
  "outline",
];

const STANDALONE_VARIANTS_LIST: ButtonVariant[] = [
  "brand",
  "destructive",
  "ai",
  "white",
  "alwaysBlack",
];

const renderMatrixRow = (variant: ButtonVariant, negative: boolean) => (
  <div key={`${variant}-${negative}`} className="flex items-center gap-3">
    <span className="w-32 text-xs">{`${variant}${negative ? " (negative)" : ""}`}</span>
    <Button variant={variant} size="48" negative={negative}>
      Label
    </Button>
    <Button variant={variant} size="48" negative={negative} disabled>
      Label
    </Button>
    <Button variant={variant} size="40" negative={negative}>
      Label
    </Button>
    <Button variant={variant} size="32" negative={negative}>
      Label
    </Button>
  </div>
);

export const AllStylesV2: Story = {
  parameters: {
    layout: "padded",
    design: {
      type: "figma",
      url: "https://www.figma.com/design/S8zFdcOjt4qN4PrwntuCdt/Fanvue-Library?node-id=16650-1558&m=dev",
    },
  },
  render: () => (
    <div className="flex flex-col gap-6">
      <div>
        <h3 className="typography-bold-heading-xs mb-3">Default surface</h3>
        <div className="flex flex-col gap-2">
          {NEGATIVE_AWARE_VARIANTS_LIST.map((v) => renderMatrixRow(v, false))}
          {STANDALONE_VARIANTS_LIST.map((v) => renderMatrixRow(v, false))}
        </div>
      </div>
      <div className="rounded-md bg-surface-primary-inverted p-4">
        <h3 className="typography-bold-heading-xs mb-3 text-content-primary-inverted">
          Negative on dark surface
        </h3>
        <div className="flex flex-col gap-2">
          {NEGATIVE_AWARE_VARIANTS_LIST.map((v) => renderMatrixRow(v, true))}
        </div>
      </div>
    </div>
  ),
};
