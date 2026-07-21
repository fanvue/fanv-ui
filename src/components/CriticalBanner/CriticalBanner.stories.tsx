import type { Meta, StoryObj } from "@storybook/react";
import { CriticalBanner } from "./CriticalBanner";

const meta = {
  title: "Components/CriticalBanner",
  component: CriticalBanner,
  parameters: {
    layout: "padded",
    design: {
      type: "figma",
      url: "https://www.figma.com/design/S8zFdcOjt4qN4PrwntuCdt/Fanvue-Library?node-id=17880-90686",
    },
  },
  tags: ["autodocs"],
  argTypes: {
    layout: {
      control: "inline-radio",
      options: ["trailing", "under"],
    },
    title: { control: "text" },
    ctaLabel: { control: "text" },
  },
  args: {
    title: "Alert title",
    children: "This is the body text for info in-app alert, longer text for the reference",
    ctaLabel: "CTA",
  },
} satisfies Meta<typeof CriticalBanner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TrailingCta: Story = {
  args: {
    layout: "trailing",
  },
};

export const UnderCta: Story = {
  args: {
    layout: "under",
  },
};

export const WithoutTitle: Story = {
  args: {
    layout: "trailing",
    title: undefined,
  },
};

export const WithoutCta: Story = {
  args: {
    layout: "trailing",
    ctaLabel: undefined,
  },
};

export const AccountSuspended: Story = {
  args: {
    layout: "trailing",
    title: "Your account has been suspended",
    children:
      "We detected activity that violates our terms of service. Contact support to resolve this before you can continue.",
    ctaLabel: "Contact support",
  },
};

export const PaymentFailedUnder: Story = {
  args: {
    layout: "under",
    title: "We couldn't process your payment",
    children:
      "Your subscription payment was declined. Update your payment method now to avoid losing access to your account and its content.",
    ctaLabel: "Update payment method",
  },
};
