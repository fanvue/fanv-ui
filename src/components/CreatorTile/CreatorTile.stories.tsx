import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "../Button/Button";
import { CreatorTile } from "./CreatorTile";

const SAMPLE_BACKGROUND =
  "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=720&h=400&fit=crop";
const SAMPLE_AVATAR =
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=128&h=128&fit=crop";

const meta = {
  title: "Components/CreatorTile",
  component: CreatorTile,
  parameters: {
    layout: "centered",
    design: {
      type: "figma",
      url: "https://www.figma.com/design/Iq9ctjP7rhIKI3PGSbduNL/Fanvue-Exploration?node-id=2379-75778&m=dev",
    },
  },
  tags: ["autodocs"],
  argTypes: {
    aspectRatio: {
      control: "select",
      options: ["tall", "medium", "short"],
    },
  },
  args: {
    background: <img src={SAMPLE_BACKGROUND} alt="" loading="lazy" />,
    name: "Aitana Lopez",
    tagline: "@fit_aitana",
    avatar: {
      src: SAMPLE_AVATAR,
      alt: "Aitana Lopez",
      fallback: "AL",
    },
    action: (
      <Button variant="primary" size="32">
        Follow
      </Button>
    ),
  },
} satisfies Meta<typeof CreatorTile>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <div className="w-90">
      <CreatorTile {...args} className="rounded-lg" />
    </div>
  ),
};

export const WithoutTagline: Story = {
  args: {
    tagline: undefined,
  },
  render: (args) => (
    <div className="w-90">
      <CreatorTile {...args} className="rounded-lg" />
    </div>
  ),
};

export const WithoutAction: Story = {
  args: {
    action: undefined,
  },
  render: (args) => (
    <div className="w-90">
      <CreatorTile {...args} className="rounded-lg" />
    </div>
  ),
};

export const AspectRatios: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-start gap-4">
      {(["tall", "medium", "short"] as const).map((aspectRatio) => (
        <div key={aspectRatio} className="flex w-[280px] flex-col gap-2">
          <CreatorTile {...args} aspectRatio={aspectRatio} className="rounded-lg" />
          <p className="typography-regular-body-sm text-content-secondary">
            aspectRatio=&quot;{aspectRatio}&quot;
          </p>
        </div>
      ))}
    </div>
  ),
};
