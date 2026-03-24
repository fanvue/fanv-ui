import type { Meta, StoryObj } from "@storybook/react";
import { AppStoreAppCard } from "./AppStoreAppCard";

const sampleImage = {
  src: "https://placehold.co/144x144/151515/ffffff/png?text=App",
  alt: "App icon",
};

const meta = {
  title: "App store/AppStoreAppCard",
  component: AppStoreAppCard,
  args: {
    title: "Content Scheduler Pro",
    description: "Put your products where people go to find ideas to try and buy",
    imageProps: sampleImage,
    planLabel: "Free plan available",
  },
} satisfies Meta<typeof AppStoreAppCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithMeta: Story = {
  args: {
    rating: 4.6,
    reviewCount: 89,
    installCount: 231,
    category: "messaging",
  },
};

export const WithAdd: Story = {
  args: {
    showAdd: true,
    onAdd: () => {},
    rating: 4.6,
    reviewCount: 89,
    installCount: 231,
    category: "messaging",
  },
};

/** Narrow viewport: max width + no Add (same story as WithAdd; resize preview to compare). */
export const WithAddMobileViewport: Story = {
  ...WithAdd,
  parameters: {
    viewport: { defaultViewport: "mobile1" },
  },
};
