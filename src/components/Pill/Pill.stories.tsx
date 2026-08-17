import type { Meta, StoryObj } from "@storybook/react";
import { ArrowUpRightIcon } from "../Icons/ArrowUpRightIcon";
import { FlameIcon } from "../Icons/FlameIcon";
import { Pill } from "./Pill";

const meta = {
  title: "Components/Pill",
  component: Pill,
  parameters: {
    layout: "centered",
    design: {
      type: "figma",
      url: "https://www.figma.com/design/S8zFdcOjt4qN4PrwntuCdt/Fanvue-Library?node-id=694-4211&m=dev",
    },
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: [
        "green",
        "grey",
        "blue",
        "gold",
        "pinkLight",
        "base",
        "contrast",
        "negative",
        "brand",
        "brandLight",
        "beta",
        "error",
        "red",
      ],
    },
  },
} satisfies Meta<typeof Pill>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Every variant, with `contrast` and `negative` on the inverted surface they are built for. */
export const AllVariants: Story = {
  parameters: { layout: "padded" },
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        {(
          [
            ["green", "Subscriber"],
            ["grey", "Expired"],
            ["blue", "Follower"],
            ["gold", "VIP Subscriber"],
            ["pinkLight", "Text"],
            ["base", "Example"],
            ["brand", "20% discount"],
            ["brandLight", "20% discount"],
            ["beta", "Beta"],
            ["error", "Error"],
            ["red", "Inactive"],
          ] as const
        ).map(([variant, label]) => (
          <Pill key={variant} variant={variant}>
            {label}
          </Pill>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-3 rounded-xs bg-surface-primary-inverted p-4">
        <Pill variant="contrast">Contrast</Pill>
        <Pill variant="negative">Negative</Pill>
      </div>
    </div>
  ),
};

export const Truncated: Story = {
  render: () => (
    <div className="flex flex-col gap-3" style={{ width: 100 }}>
      <Pill variant="brand">This is a very long pill label</Pill>
      <Pill variant="base" leftIcon={<FlameIcon className="size-4" />}>
        Truncated with icon
      </Pill>
      <Pill variant="brand" rightIcon={<ArrowUpRightIcon className="size-4" />}>
        Truncated right icon
      </Pill>
    </div>
  ),
};

export const LeftIcon: Story = {
  args: {
    variant: "base",
    leftIcon: <FlameIcon className="size-4" />,
    children: "Example",
  },
};

export const RightIcon: Story = {
  args: {
    variant: "brand",
    rightIcon: <ArrowUpRightIcon className="size-4" />,
    children: "20% discount",
  },
};
