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
  args: {
    imageSrc: SAMPLE_IMAGE,
    name: "Jane Doe",
    description: "MODEL & PODCASTER",
    avatarSrc: SAMPLE_AVATAR,
    avatarFallback: "JD",
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

export const ContainerScaling: Story = {
  args: {
    actions: (
      <Button variant="primary" size="32" fullWidth>
        Follow for Free
      </Button>
    ),
  },
  render: (args) => (
    <div className="flex flex-wrap items-start gap-6">
      {[
        { label: "160px", className: "w-40" },
        { label: "240px", className: "w-60" },
        { label: "320px", className: "w-80" },
        { label: "420px max", className: "w-[420px] max-w-[calc(100vw-2rem)]" },
      ].map((container) => (
        <div key={container.label} className="flex flex-col gap-2">
          <div className={container.className}>
            <CreatorCard {...args} />
          </div>
          <p className="typography-regular-body-sm text-content-secondary">{container.label}</p>
        </div>
      ))}
    </div>
  ),
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
