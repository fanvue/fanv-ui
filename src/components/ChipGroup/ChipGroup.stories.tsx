import type { Meta, StoryObj } from "@storybook/react";
import { Chip } from "../Chip/Chip";
import { ChipGroup } from "./ChipGroup";

const categories = [
  "Music",
  "Fitness",
  "Cooking",
  "Travel",
  "Gaming",
  "Art",
  "Fashion",
  "Photography",
  "Comedy",
  "Wellness",
];

const chips = categories.map((label, index) => (
  <Chip key={label} size="40" selected={index === 0} onClick={() => {}}>
    {label}
  </Chip>
));

const meta = {
  title: "Components/ChipGroup",
  component: ChipGroup,
  parameters: {
    layout: "padded",
    design: {
      type: "figma",
      url: "https://www.figma.com/design/S8zFdcOjt4qN4PrwntuCdt/Fanvue-Library?node-id=17399-509",
    },
  },
  tags: ["autodocs"],
  argTypes: {
    wrapped: {
      control: "boolean",
    },
  },
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ChipGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    "aria-label": "Categories",
    wrapped: false,
    children: chips,
  },
};

export const Wrapped: Story = {
  args: {
    "aria-label": "Categories",
    wrapped: true,
    children: chips,
  },
};
