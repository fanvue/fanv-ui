import type { Meta, StoryObj } from "@storybook/react";
import { RadioGroup } from "../RadioGroup/RadioGroup";
import { Radio } from "./Radio";

const meta = {
  title: "Components/Radio",
  component: Radio,
  parameters: {
    layout: "centered",
    design: {
      type: "figma",
      url: "https://www.figma.com/design/S8zFdcOjt4qN4PrwntuCdt/Fanvue-Library?node-id=9291-9370&m=dev",
    },
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["default", "small"],
    },
    disabled: {
      control: "boolean",
    },
    label: {
      control: "text",
    },
    helperText: {
      control: "text",
    },
    checked: {
      control: "boolean",
      description: "Control the checked state",
    },
  },
  render: (args) => (
    <RadioGroup>
      <Radio {...args} />
    </RadioGroup>
  ),
} satisfies Meta<typeof Radio>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: "Option",
    value: "option",
  },
};

export const Small: Story = {
  args: {
    size: "small",
    label: "Option",
    value: "option",
  },
};

export const Disabled: Story = {
  args: {
    label: "Disabled",
    value: "disabled",
    disabled: true,
  },
};

export const WithHelperText: Story = {
  args: {
    label: "Option with helper",
    helperText: "This is helpful descriptive text",
    value: "helper",
  },
};
