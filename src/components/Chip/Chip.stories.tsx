import type { Meta, StoryObj } from "@storybook/react";
import { CheckCircleIcon } from "../Icons/CheckCircleIcon";
import { CrossIcon } from "../Icons/CrossIcon";
import { Chip } from "./Chip";

/** Placeholder example for logo stories — consumers provide their own `<img>/NextImage` */
const PaymentLogo = ({ label, color }: { label: string; color: string }) => (
  <img
    src={`data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><circle cx="10" cy="10" r="10" fill="${color}"/><text x="10" y="14" text-anchor="middle" fill="white" font-size="10" font-family="sans-serif">${label}</text></svg>`)}`}
    alt={`${label} logo`}
    className="size-5 rounded-full"
  />
);

const meta = {
  title: "Components/Chip",
  component: Chip,
  parameters: {
    layout: "centered",
    design: {
      type: "figma",
      url: "https://www.figma.com/design/S8zFdcOjt4qN4PrwntuCdt/Fanvue-Library?node-id=87-4102&m=dev",
    },
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["rounded", "square", "dark"],
    },
    size: {
      control: "select",
      options: ["32", "40"],
    },
    selected: { control: "boolean" },
    disabled: { control: "boolean" },
    leftDot: { control: "boolean" },
  },
} satisfies Meta<typeof Chip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Rounded: Story = {
  args: {
    children: "Chip",
  },
};

export const Square: Story = {
  args: {
    variant: "square",
    children: "Chip",
  },
};

export const Dark: Story = {
  args: {
    variant: "dark",
    children: "Chip",
  },
};

export const Size32: Story = {
  args: {
    size: "32",
    children: "Chip",
  },
};

export const Size40: Story = {
  args: {
    size: "40",
    children: "Chip",
  },
};

export const Selected: Story = {
  args: {
    selected: true,
    children: "Chip",
    onClick: () => {},
  },
};

export const SelectedSquare: Story = {
  args: {
    variant: "square",
    selected: true,
    children: "Chip",
    onClick: () => {},
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    children: "Chip",
  },
};

export const DisabledSelected: Story = {
  args: {
    selected: true,
    disabled: true,
    children: "Chip",
    onClick: () => {},
  },
};

export const DisabledDark: Story = {
  args: {
    variant: "dark",
    disabled: true,
    children: "Chip",
  },
};

export const Interactive: Story = {
  args: {
    children: "Chip",
    onClick: () => {},
  },
};

export const InteractiveSelected: Story = {
  args: {
    selected: true,
    children: "Chip",
    onClick: () => {},
  },
};

export const WithDot: Story = {
  args: {
    leftDot: true,
    children: "Chip",
  },
};

export const WithDotDark: Story = {
  args: {
    variant: "dark",
    leftDot: true,
    children: "Chip",
  },
};

export const WithLeftIcon: Story = {
  args: {
    leftIcon: <CheckCircleIcon className="size-5" />,
    children: "Chip",
  },
};

export const WithRightIcon: Story = {
  args: {
    rightIcon: <CrossIcon className="size-5" />,
    children: "Chip",
    onClick: () => {},
  },
};

export const WithBothIcons: Story = {
  args: {
    leftIcon: <CheckCircleIcon className="size-5" />,
    rightIcon: <CrossIcon className="size-5" />,
    children: "Chip",
  },
};

export const WithNotification: Story = {
  args: {
    notificationLabel: "99+",
    children: "Chip",
  },
};

export const FullExample: Story = {
  args: {
    leftDot: true,
    rightIcon: <CrossIcon className="size-5" />,
    notificationLabel: "3",
    selected: true,
    children: "Filter",
    onClick: () => {},
  },
};

export const MediumRounded: Story = {
  args: {
    size: "40",
    children: "Chip",
  },
};

export const MediumSquare: Story = {
  args: {
    variant: "square",
    size: "40",
    children: "Chip",
  },
};

export const MediumDark: Story = {
  args: {
    variant: "dark",
    size: "40",
    children: "Chip",
  },
};

export const MediumSelected: Story = {
  args: {
    size: "40",
    selected: true,
    children: "Chip",
    onClick: () => {},
  },
};

export const PaymentMethod: Story = {
  args: {
    variant: "square",
    size: "40",
    leftIcon: <PaymentLogo label="₿" color="#F7931A" />,
    children: "Bitcoin",
    onClick: () => {},
  },
};

export const PaymentMethodSelected: Story = {
  args: {
    variant: "square",
    size: "40",
    leftIcon: <PaymentLogo label="G" color="#4285F4" />,
    children: "Google Pay",
    selected: true,
    onClick: () => {},
  },
};

export const PaymentMethodDisabled: Story = {
  args: {
    variant: "square",
    size: "40",
    leftIcon: <PaymentLogo label="P" color="#003087" />,
    children: "PayPal",
    disabled: true,
  },
};

export const PaymentMethodGroup: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <Chip
        variant="square"
        size="40"
        leftIcon={<PaymentLogo label="₿" color="#F7931A" />}
        onClick={() => {}}
      >
        Bitcoin
      </Chip>
      <Chip
        variant="square"
        size="40"
        leftIcon={<PaymentLogo label="G" color="#4285F4" />}
        selected
        onClick={() => {}}
      >
        Google Pay
      </Chip>
      <Chip
        variant="square"
        size="40"
        leftIcon={<PaymentLogo label="P" color="#003087" />}
        onClick={() => {}}
      >
        PayPal
      </Chip>
      <Chip
        variant="square"
        size="40"
        leftIcon={<PaymentLogo label="A" color="#000000" />}
        onClick={() => {}}
      >
        Apple Pay
      </Chip>
    </div>
  ),
};
