import type { Meta, StoryObj } from "@storybook/react";
import { ArrowUpRightIcon } from "../Icons/ArrowUpRightIcon";
import { WalletIcon } from "../Icons/WalletIcon";
import { Link } from "./Link";

const meta = {
  title: "Components/Link",
  component: Link,
  parameters: {
    layout: "centered",
    design: {
      type: "figma",
      url: "https://www.figma.com/design/S8zFdcOjt4qN4PrwntuCdt/Fanvue-Library?node-id=16800-10890",
    },
  },
  tags: ["autodocs"],
  args: {
    href: "#",
    children: "CTA",
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "brand"],
    },
    size: {
      control: "select",
      options: ["16", "14"],
    },
    disabled: { control: "boolean" },
  },
} satisfies Meta<typeof Link>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    variant: "primary",
  },
};

export const Brand: Story = {
  args: {
    variant: "brand",
  },
};

export const Small: Story = {
  args: {
    size: "14",
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const LeftIcon: Story = {
  args: {
    leftIcon: <WalletIcon />,
  },
};

export const RightIcon: Story = {
  args: {
    rightIcon: <ArrowUpRightIcon />,
  },
};

export const AsChildWithIcon: Story = {
  name: "asChild (composed) with icon",
  args: { children: undefined },
  parameters: {
    docs: {
      description: {
        story:
          "`asChild` composes onto a router link (or plain `<a>`) while still rendering `leftIcon` / `rightIcon` around the label.",
      },
    },
  },
  render: () => (
    <Link asChild variant="brand" rightIcon={<ArrowUpRightIcon />}>
      <a href="/plans">See our plans</a>
    </Link>
  ),
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      {(["16", "14"] as const).map((size) => (
        <div key={size} className="flex flex-col gap-3">
          <span className="typography-description-12px-semibold text-content-tertiary">
            {size}px
          </span>
          <div className="flex flex-wrap items-center gap-6">
            <Link href="#" variant="primary" size={size}>
              Primary
            </Link>
            <Link href="#" variant="brand" size={size}>
              Brand
            </Link>
            <Link href="#" variant="primary" size={size} rightIcon={<ArrowUpRightIcon />}>
              With icon
            </Link>
            <Link href="#" variant="primary" size={size} disabled>
              Disabled
            </Link>
          </div>
        </div>
      ))}
    </div>
  ),
};
