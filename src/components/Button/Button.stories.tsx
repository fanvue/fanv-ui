import type { Meta, StoryObj } from "@storybook/react";
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
    className: "w-12 px-0 justify-center",
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
    variant: "brand",
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
    variant: "brand",
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
    variant: "brand",
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
  "link",
  "tertiaryDestructive",
  "text",
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
    <Button variant={variant} size="48" negative={negative} loading>
      Label
    </Button>
    <Button variant={variant} size="40" negative={negative}>
      Label
    </Button>
    <Button variant={variant} size="32" negative={negative}>
      Label
    </Button>
    <Button variant={variant} size="24" negative={negative}>
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
        <h3 className="typography-header-heading-xs mb-3">
          Default surface — default, disabled, loading, then sizes 40 / 32 / 24
        </h3>
        <div className="flex flex-col gap-2">
          {NEGATIVE_AWARE_VARIANTS_LIST.map((v) => renderMatrixRow(v, false))}
          {STANDALONE_VARIANTS_LIST.map((v) => renderMatrixRow(v, false))}
        </div>
      </div>
      <div className="rounded-md bg-surface-primary-inverted p-4">
        <h3 className="typography-header-heading-xs mb-3 text-content-primary-inverted">
          Negative on dark surface
        </h3>
        <div className="flex flex-col gap-2">
          {NEGATIVE_AWARE_VARIANTS_LIST.map((v) => renderMatrixRow(v, true))}
        </div>
      </div>
    </div>
  ),
};
