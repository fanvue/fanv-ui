import type { Meta, StoryObj } from "@storybook/react";
import { ArrowRightIcon } from "../Icons/ArrowRightIcon";
import { PlusIcon } from "../Icons/PlusIcon";
import { Button, type ButtonSize, type ButtonVariant } from "./Button";

const meta = {
  title: "Components/ButtonV2",
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
        "upsell",
        "error",
        "ai",
        "alwaysWhite",
        "alwaysBlack",
      ],
    },
    size: {
      control: "select",
      options: ["48", "40", "32"],
    },
    negative: { control: "boolean" },
    loading: { control: "boolean" },
    disabled: { control: "boolean" },
    fullWidth: { control: "boolean" },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

const NEGATIVE_AWARE: ButtonVariant[] = ["primary", "secondary", "tertiary", "outline"];
const STANDALONE: ButtonVariant[] = ["upsell", "error", "ai", "alwaysWhite", "alwaysBlack"];
const SIZES: ButtonSize[] = ["48", "40", "32"];

const darkSurface = (children: React.ReactNode) => (
  <div className="rounded bg-surface-primary-inverted p-4">{children}</div>
);

export const Primary: Story = {
  args: { variant: "primary", size: "48", children: "Label" },
};

export const Secondary: Story = {
  args: { variant: "secondary", size: "48", children: "Label" },
};

export const Tertiary: Story = {
  args: { variant: "tertiary", size: "48", children: "Label" },
};

export const Outline: Story = {
  args: { variant: "outline", size: "48", children: "Label" },
};

export const Upsell: Story = {
  args: { variant: "upsell", size: "48", children: "Label" },
};

export const ErrorVariant: Story = {
  args: { variant: "error", size: "48", children: "Label" },
};

export const AI: Story = {
  args: { variant: "ai", size: "48", children: "Label" },
};

export const AlwaysWhite: Story = {
  args: { variant: "alwaysWhite", size: "48", children: "Label" },
  parameters: { backgrounds: { default: "dark" } },
};

export const AlwaysBlack: Story = {
  args: { variant: "alwaysBlack", size: "48", children: "Label" },
};

export const Negative: Story = {
  args: { variant: "primary", size: "48", negative: true, children: "Label" },
  parameters: { backgrounds: { default: "dark" } },
  render: (args) => darkSurface(<Button {...args} />),
};

export const Disabled: Story = {
  args: { variant: "primary", size: "48", disabled: true, children: "Label" },
};

export const Loading: Story = {
  args: { variant: "primary", size: "48", loading: true, children: "Label" },
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

export const AsLink: Story = {
  args: {
    variant: "primary",
    size: "48",
    asChild: true,
    children: <a href="https://fanvue.com">Visit Fanvue</a>,
  },
};

export const AllVariantsBySize: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      {SIZES.map((size) => (
        <div key={size} className="flex flex-col gap-2">
          <span className="typography-semibold-body-sm text-content-secondary">{size}px</span>
          <div className="flex flex-wrap items-center gap-3">
            {STANDALONE.map((variant) => (
              <Button key={variant} variant={variant} size={size}>
                {variant}
              </Button>
            ))}
            {NEGATIVE_AWARE.map((variant) => (
              <Button key={variant} variant={variant} size={size}>
                {variant}
              </Button>
            ))}
          </div>
        </div>
      ))}
    </div>
  ),
};

export const NegativeOnDarkSurface: Story = {
  parameters: { backgrounds: { default: "dark" } },
  render: () =>
    darkSurface(
      <div className="flex flex-wrap items-center gap-3">
        {NEGATIVE_AWARE.map((variant) => (
          <Button key={variant} variant={variant} size="48" negative>
            {variant}
          </Button>
        ))}
      </div>,
    ),
};

export const StatesMatrix: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <span className="w-24 text-sm">Default:</span>
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="upsell">Upsell</Button>
        <Button variant="error">Error</Button>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <span className="w-24 text-sm">Disabled:</span>
        <Button variant="primary" disabled>
          Primary
        </Button>
        <Button variant="secondary" disabled>
          Secondary
        </Button>
        <Button variant="outline" disabled>
          Outline
        </Button>
        <Button variant="upsell" disabled>
          Upsell
        </Button>
        <Button variant="error" disabled>
          Error
        </Button>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <span className="w-24 text-sm">Loading:</span>
        <Button variant="primary" loading>
          Primary
        </Button>
        <Button variant="secondary" loading>
          Secondary
        </Button>
        <Button variant="outline" loading>
          Outline
        </Button>
        <Button variant="upsell" loading>
          Upsell
        </Button>
        <Button variant="error" loading>
          Error
        </Button>
      </div>
    </div>
  ),
};
