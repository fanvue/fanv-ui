import type { Meta, StoryObj } from "@storybook/react";
import { AppStoreBanner } from "./AppStoreBanner";

const copy = {
  eyebrow: "Build for Fanvue",
  headline: "When your app runs on Fanvue's API, creators earn more. Faster. With less effort.",
  ctaLabel: "See how to get started",
} as const;

const meta = {
  title: "App store/AppStoreBanner",
  component: AppStoreBanner,
  args: {
    ...copy,
    onCtaPress: () => {},
  },
} satisfies Meta<typeof AppStoreBanner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithDescription: Story = {
  args: {
    description: "Optional supporting copy for wider layouts.",
  },
};
