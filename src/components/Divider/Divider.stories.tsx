import type { Meta, StoryObj } from "@storybook/react";
import { Divider } from "./Divider";

const meta = {
  title: "Components/Divider",
  component: Divider,
  parameters: {
    layout: "centered",
    design: {
      type: "figma",
      url: "https://www.figma.com/design/S8zFdcOjt4qN4PrwntuCdt/Fanvue-Library?node-id=1480-471",
    },
  },
  tags: ["autodocs"],
  argTypes: {
    label: { control: "text" },
  },
} satisfies Meta<typeof Divider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  decorators: [
    (Story) => (
      <div className="w-64">
        <Story />
      </div>
    ),
  ],
};

export const WithText: Story = {
  args: {
    label: "or",
  },
  decorators: [
    (Story) => (
      <div className="w-64">
        <Story />
      </div>
    ),
  ],
};

export const CustomText: Story = {
  args: {
    label: "Custom label",
  },
  decorators: [
    (Story) => (
      <div className="w-64">
        <Story />
      </div>
    ),
  ],
};

export const InContent: Story = {
  render: () => (
    <div className="w-80 space-y-4">
      <p className="text-sm">Section 1</p>
      <Divider />
      <p className="text-sm">Section 2</p>
      <Divider label="or" />
      <p className="text-sm">Section 3</p>
    </div>
  ),
};
