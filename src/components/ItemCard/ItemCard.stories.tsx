import type { Meta, StoryObj } from "@storybook/react";
import { ItemCard } from "./ItemCard";

const meta = {
  title: "Components/ItemCard",
  component: ItemCard,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    showAdd: { control: "boolean" },
    rating: { control: { type: "number", min: 0, max: 5, step: 0.1 } },
    reviewCount: { control: "number" },
    installCount: { control: "number" },
  },
} satisfies Meta<typeof ItemCard>;

export default meta;
type Story = StoryObj<typeof meta>;

const SAMPLE_IMAGE =
  "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=144&h=144&fit=crop";

export const Default: Story = {
  args: {
    title: "Sample App",
    description: "A great app that helps you do amazing things with your content.",
    imageProps: { src: SAMPLE_IMAGE, alt: "Sample App" },
    planLabel: "Free plan available",
  },
};

export const WithRatings: Story = {
  args: {
    title: "Popular App",
    description: "Highly rated app with thousands of happy users.",
    imageProps: { src: SAMPLE_IMAGE, alt: "Popular App" },
    rating: 4.8,
    reviewCount: 1250,
    planLabel: "Free plan available",
  },
};

export const WithInstalls: Story = {
  args: {
    title: "Trending App",
    description: "One of the most installed apps on the platform.",
    imageProps: { src: SAMPLE_IMAGE, alt: "Trending App" },
    installCount: 5000,
    planLabel: "Free plan available",
  },
};

export const WithCategory: Story = {
  args: {
    title: "Messaging App",
    description: "Connect with your fans through instant messaging.",
    imageProps: { src: SAMPLE_IMAGE, alt: "Messaging App" },
    category: "MESSAGING",
    planLabel: "Free plan available",
  },
};

export const WithAddButton: Story = {
  args: {
    title: "New App",
    description: "Try out this new app and boost your engagement.",
    imageProps: { src: SAMPLE_IMAGE, alt: "New App" },
    showAdd: true,
    addLabel: "Add",
    onAdd: () => alert("Add clicked!"),
    planLabel: "Free plan available",
  },
};

export const FullFeatured: Story = {
  args: {
    title: "Premium Analytics",
    description: "Get detailed insights about your audience and content performance.",
    imageProps: { src: SAMPLE_IMAGE, alt: "Premium Analytics" },
    rating: 4.9,
    reviewCount: 3200,
    installCount: 15000,
    category: "ANALYTICS",
    showAdd: true,
    addLabel: "Add",
    onAdd: () => alert("Add clicked!"),
    planLabel: "Free plan available",
  },
};

export const NoImage: Story = {
  args: {
    title: "Text Only App",
    description: "This app shows initials when no image is provided.",
    imageProps: { alt: "Text Only App" },
    planLabel: "Free plan available",
  },
};

export const Clickable: Story = {
  args: {
    title: "Clickable Card",
    description: "Click anywhere on this card to trigger the onClick handler.",
    imageProps: { src: SAMPLE_IMAGE, alt: "Clickable Card" },
    planLabel: "Free plan available",
    onClick: () => alert("Card clicked!"),
  },
};

export const LongDescription: Story = {
  args: {
    title: "App With Long Description",
    description:
      "This is a very long description that should be truncated after two lines. The component uses line-clamp-2 to ensure the description doesn't overflow.",
    imageProps: { src: SAMPLE_IMAGE, alt: "App With Long Description" },
    planLabel: "Free plan available",
  },
};

export const Grid: Story = {
  args: {
    title: "Grid Example",
    description: "Shows multiple cards in a grid layout.",
    imageProps: { src: SAMPLE_IMAGE, alt: "Grid Example" },
  },
  render: () => (
    <div className="grid w-[900px] grid-cols-3 gap-4">
      <ItemCard
        title="Analytics Pro"
        description="Track your performance metrics in real-time."
        imageProps={{ src: SAMPLE_IMAGE, alt: "Analytics Pro" }}
        rating={4.7}
        reviewCount={890}
        planLabel="Free plan available"
        onClick={() => {}}
      />
      <ItemCard
        title="Fan Messenger"
        description="Direct messaging with your biggest fans."
        imageProps={{ src: SAMPLE_IMAGE, alt: "Fan Messenger" }}
        rating={4.9}
        reviewCount={2100}
        category="MESSAGING"
        planLabel="Free plan available"
        onClick={() => {}}
      />
      <ItemCard
        title="Content Scheduler"
        description="Plan and schedule your posts in advance."
        imageProps={{ alt: "Content Scheduler" }}
        installCount={8500}
        planLabel="Free plan available"
        onClick={() => {}}
      />
    </div>
  ),
};
