import type { Meta, StoryObj } from "@storybook/react";
import { Radio } from "../Radio/Radio";
import { RadioGroup } from "./RadioGroup";

const meta = {
  title: "Components/RadioGroup",
  component: RadioGroup,
  parameters: {
    layout: "centered",
    design: {
      type: "figma",
      url: "https://www.figma.com/design/S8zFdcOjt4qN4PrwntuCdt/Fanvue-Library?node-id=9291-9370&m=dev",
    },
  },
  tags: ["autodocs"],
  argTypes: {
    disabled: {
      control: "boolean",
    },
  },
  render: (args) => (
    <RadioGroup {...args} aria-label="Options" className="flex flex-col gap-4">
      <Radio label="Option 1" value="option1" />
      <Radio label="Option 2" value="option2" />
      <Radio label="Option 3" value="option3" />
    </RadioGroup>
  ),
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    defaultValue: "option1",
  },
};

export const Small: Story = {
  args: {
    defaultValue: "option1",
  },
  render: (args) => (
    <RadioGroup {...args} aria-label="Small options" className="flex flex-col gap-4">
      <Radio size="small" label="Option 1" value="option1" />
      <Radio size="small" label="Option 2" value="option2" />
      <Radio size="small" label="Option 3" value="option3" />
    </RadioGroup>
  ),
};

export const Disabled: Story = {
  args: {
    disabled: true,
    defaultValue: "option1",
  },
  render: (args) => (
    <RadioGroup {...args} aria-label="Disabled options" className="flex flex-col gap-4">
      <Radio label="Option 1" value="option1" />
      <Radio label="Option 2" value="option2" />
      <Radio label="Option 3" value="option3" />
    </RadioGroup>
  ),
};
