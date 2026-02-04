import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
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

export const UncontrolledExample: Story = {
  name: "Uncontrolled",
  args: { value: "unused" },
  parameters: {
    docs: {
      description: {
        story:
          "RadioGroup uses `defaultValue`. Selection is managed internally (e.g. no React state).",
      },
    },
  },
  render: () => (
    <RadioGroup defaultValue="b">
      <Radio label="Option A" value="a" />
      <Radio label="Option B" value="b" />
      <Radio label="Option C" value="c" />
    </RadioGroup>
  ),
};

export const ControlledExample: Story = {
  name: "Controlled",
  args: { value: "unused" },
  parameters: {
    docs: {
      description: {
        story:
          "RadioGroup uses `value` and `onValueChange`. Works with React state and form libraries (e.g. react-hook-form).",
      },
    },
  },
  render: function ControlledExampleRender() {
    const [value, setValue] = useState("b");
    return (
      <RadioGroup value={value} onValueChange={setValue}>
        <Radio label="Option A" value="a" />
        <Radio label="Option B" value="b" />
        <Radio label="Option C" value="c" />
      </RadioGroup>
    );
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
