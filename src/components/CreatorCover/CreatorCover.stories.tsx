import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "../Button/Button";
import { CreatorCover } from "./CreatorCover";

const meta = {
  title: "Components/CreatorCover",
  component: CreatorCover,
  parameters: {
    layout: "centered",
    design: {
      type: "figma",
      url: "https://www.figma.com/design/Iq9ctjP7rhIKI3PGSbduNL/Fanvue-Exploration?node-id=2379-75729&m=dev",
    },
    chromatic: {
      modes: {
        light: { theme: "light" },
        dark: { theme: "dark" },
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof CreatorCover>;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleImage =
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&h=900&fit=crop";

const wrapperDecorator = (Story: () => React.ReactElement) => (
  <div className="w-120">
    <Story />
  </div>
);

const defaultArgs = {
  imageSrc: sampleImage,
  imageAlt: "Jane Doe",
  name: "JANE DOE",
  tagline: "GLOBAL POPSTAR",
  tag: "New Joiner",
  action: (
    <Button variant="primary" size="48" fullWidth>
      Join for free for 7 days
    </Button>
  ),
};

export const Default: Story = {
  args: defaultArgs,
  decorators: [wrapperDecorator],
};

export const WithoutTag: Story = {
  args: {
    ...defaultArgs,
    tag: undefined,
  },
  decorators: [wrapperDecorator],
};

export const WithoutTagline: Story = {
  args: {
    ...defaultArgs,
    tagline: undefined,
  },
  decorators: [wrapperDecorator],
};

export const NameOnly: Story = {
  args: {
    imageSrc: sampleImage,
    imageAlt: "Jane Doe",
    name: "JANE DOE",
  },
  decorators: [wrapperDecorator],
};

export const SeparateBackground: Story = {
  args: {
    ...defaultArgs,
    backgroundSrc:
      "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=600&h=900&fit=crop",
  },
  decorators: [wrapperDecorator],
};

export const CustomActionNode: Story = {
  args: {
    ...defaultArgs,
    action: (
      <Button variant="brand" size="48" fullWidth>
        Subscribe
      </Button>
    ),
  },
  decorators: [wrapperDecorator],
};
