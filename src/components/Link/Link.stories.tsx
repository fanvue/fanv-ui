import type { Meta, StoryObj } from "@storybook/react";
import { expect, within } from "storybook/test";
import { ArrowRightIcon } from "../Icons/ArrowRightIcon";
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
      options: ["primary", "brand", "inherit", "subtle"],
    },
    size: {
      control: "select",
      options: ["16", "14", "inherit"],
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

export const Inherit: Story = {
  render: (args) => (
    <p className="typography-description-12px-regular max-w-xs text-content-secondary">
      A flat fee applies to every crypto payout.{" "}
      <Link {...args} variant="inherit" size="inherit">
        Learn more about payout fees
      </Link>
    </p>
  ),
};

/**
 * The `subtle` variant with an arrow: secondary text at rest, 32px tall so it sits level with a
 * 32px control. On hover the text turns primary and underlines, and the arrow moves 2px. Hover it
 * to see: the play function checks the resting state only.
 */
export const Subtle: Story = {
  args: {
    variant: "subtle",
    size: "14",
    children: "Open full page",
    rightIcon: <ArrowRightIcon />,
  },
  play: async ({ canvasElement }) => {
    const link = within(canvasElement).getByRole("link", { name: "Open full page" });
    const label = within(link).getByText("Open full page");

    await expect(link.getBoundingClientRect().height).toBe(32);
    await expect(getComputedStyle(link).columnGap).toBe("4px");
    await expect(getComputedStyle(link).paddingLeft).toBe("4px");
    await expect(getComputedStyle(label).textDecorationLine).toBe("none");
    await expect(getComputedStyle(label).textUnderlineOffset).toBe("4px");
    await expect(getComputedStyle(label).fontSize).toBe("14px");
  },
};

/** Without an icon, `subtle` keeps the line height of its text so it can sit inside a row of copy. */
export const SubtleWithoutIcon: Story = {
  args: {
    variant: "subtle",
    size: "14",
    children: "View all campaigns",
  },
};

/**
 * `subtle` with `size="inherit"` takes its type from the container, here a 12px caption row. It
 * stands alone: for a link inside a sentence use `inherit`, which stays underlined at rest.
 */
export const SubtleInheritSize: Story = {
  render: (args) => (
    <div className="typography-description-12px-regular">
      <Link {...args} variant="subtle" size="inherit">
        View all campaigns
      </Link>
    </div>
  ),
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
