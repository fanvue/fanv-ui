import type { Meta, StoryObj } from "@storybook/react";
import { CreatorTile } from "./CreatorTile";

const SAMPLE_IMAGE =
  "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=480&h=720&fit=crop";

const meta = {
  title: "Components/CreatorTile",
  component: CreatorTile,
  parameters: {
    layout: "centered",
    design: {
      type: "figma",
      url: "https://www.figma.com/design/Iq9ctjP7rhIKI3PGSbduNL/Fanvue-Exploration?node-id=2379-76293&m=dev",
    },
  },
  tags: ["autodocs"],
  argTypes: {
    radius: {
      control: "select",
      options: ["none", "xs", "sm", "md", "lg", "xl"],
    },
    aspectRatio: {
      control: "select",
      options: ["tall", "medium", "short"],
    },
  },
} satisfies Meta<typeof CreatorTile>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    imageSrc: SAMPLE_IMAGE,
    imageAlt: "Portrait of a creator",
    name: "JANE DOE",
    tagline: "GLOBAL MUSIC ICON",
  },
  render: (args) => (
    <div className="w-[239px]">
      <CreatorTile {...args} />
    </div>
  ),
};

export const WithoutTagline: Story = {
  args: {
    imageSrc: SAMPLE_IMAGE,
    imageAlt: "Portrait of a creator",
    name: "JANE DOE",
  },
  render: (args) => (
    <div className="w-[239px]">
      <CreatorTile {...args} />
    </div>
  ),
};

export const RadiusScale: Story = {
  args: {
    imageSrc: SAMPLE_IMAGE,
    imageAlt: "Portrait of a creator",
    name: "JANE DOE",
  },
  render: () => (
    <div className="flex flex-wrap items-start gap-4">
      {(["none", "xs", "sm", "md", "lg", "xl"] as const).map((radius) => (
        <div key={radius} className="flex w-[180px] flex-col gap-2">
          <CreatorTile
            imageSrc={SAMPLE_IMAGE}
            imageAlt="Portrait of a creator"
            name="JANE DOE"
            tagline={`RADIUS ${radius.toUpperCase()}`}
            radius={radius}
          />
          <p className="typography-regular-body-sm text-content-secondary">
            radius=&quot;{radius}&quot;
          </p>
        </div>
      ))}
    </div>
  ),
};

export const AspectRatios: Story = {
  args: {
    imageSrc: SAMPLE_IMAGE,
    imageAlt: "Portrait of a creator",
    name: "JANE DOE",
  },
  render: () => (
    <div className="flex flex-wrap items-start gap-4">
      {(["tall", "medium", "short"] as const).map((aspectRatio) => (
        <div key={aspectRatio} className="flex w-[200px] flex-col gap-2">
          <CreatorTile
            imageSrc={SAMPLE_IMAGE}
            imageAlt="Portrait of a creator"
            name="JANE DOE"
            tagline={aspectRatio.toUpperCase()}
            aspectRatio={aspectRatio}
          />
          <p className="typography-regular-body-sm text-content-secondary">
            aspectRatio=&quot;{aspectRatio}&quot;
          </p>
        </div>
      ))}
    </div>
  ),
};

export const NoRoundedEdges: Story = {
  args: {
    imageSrc: SAMPLE_IMAGE,
    imageAlt: "Portrait of a creator",
    name: "JANE DOE",
    tagline: "SHARP CORNERS",
    radius: "none",
  },
  render: (args) => (
    <div className="w-[239px]">
      <CreatorTile {...args} />
    </div>
  ),
};
