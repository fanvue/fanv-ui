import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "../Button/Button";
import { CreatorCard } from "./CreatorCard";

const SAMPLE_IMAGE =
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=580&h=900&fit=crop";
const SAMPLE_AVATAR =
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=128&h=128&fit=crop";

const meta = {
  title: "Components/CreatorCard",
  component: CreatorCard,
  parameters: {
    layout: "centered",
    design: {
      type: "figma",
      url: "https://www.figma.com/design/Iq9ctjP7rhIKI3PGSbduNL/Fanvue-Exploration?node-id=2379-76229",
    },
  },
  tags: ["autodocs"],
  argTypes: {
    rounded: {
      control: "select",
      options: ["none", "xs", "sm", "md", "lg", "xl"],
    },
  },
  args: {
    imageSrc: SAMPLE_IMAGE,
    name: "Jane Doe",
    description: "MODEL & PODCASTER",
    avatarSrc: SAMPLE_AVATAR,
    avatarFallback: "JD",
    rounded: "lg",
  },
} satisfies Meta<typeof CreatorCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TwoButtons: Story = {
  args: {
    actions: (
      <>
        <Button variant="brand" size="32" fullWidth>
          Join for free for 3 days
        </Button>
        <Button variant="primary" size="32" fullWidth>
          Follow for Free
        </Button>
      </>
    ),
  },
};

export const OneButton: Story = {
  args: {
    actions: (
      <Button variant="primary" size="32" fullWidth>
        Follow for Free
      </Button>
    ),
  },
};

export const NoButtons: Story = {};

export const RoundedSizes: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-start gap-6">
      {(["none", "xs", "sm", "md", "lg", "xl"] as const).map((rounded) => (
        <div key={rounded} className="flex flex-col items-center gap-2">
          <CreatorCard {...args} rounded={rounded} />
          <p className="typography-regular-body-sm text-content-secondary">{rounded}</p>
        </div>
      ))}
    </div>
  ),
  args: {
    actions: (
      <Button variant="primary" size="32" fullWidth>
        Follow for Free
      </Button>
    ),
  },
};

export const WithoutDescription: Story = {
  args: {
    description: undefined,
    actions: (
      <Button variant="primary" size="32" fullWidth>
        Follow for Free
      </Button>
    ),
  },
};
