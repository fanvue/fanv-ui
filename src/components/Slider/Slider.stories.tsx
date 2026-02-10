import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Slider } from "./Slider";

const meta: Meta<typeof Slider> = {
  title: "Components/Slider",
  component: Slider,
  parameters: {
    layout: "centered",
    design: {
      type: "figma",
      url: "https://www.figma.com/design/S8zFdcOjt4qN4PrwntuCdt/Fanvue-Library?node-id=9292-636&m=dev",
    },
  },
  tags: ["autodocs"],
  argTypes: {
    labelPosition: {
      control: "select",
      options: ["top", "left"],
    },
    disabled: {
      control: "boolean",
    },
    showTooltip: {
      control: "boolean",
    },
    min: { control: "number" },
    max: { control: "number" },
    step: { control: "number" },
  },
  decorators: [
    (Story) => (
      <div style={{ width: 400 }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    defaultValue: [50],
    label: "Label",
    minLabel: "Min Value",
    maxLabel: "Max Value",
  },
};

export const LabelTop: Story = {
  args: {
    defaultValue: [40],
    label: "Volume",
    labelPosition: "top",
    minLabel: "0",
    maxLabel: "100",
  },
};

export const LabelLeft: Story = {
  args: {
    defaultValue: [40],
    label: "Volume",
    labelPosition: "left",
    minLabel: "0",
    maxLabel: "100",
  },
};

export const WithTooltip: Story = {
  args: {
    defaultValue: [25],
    label: "Brightness",
    showTooltip: true,
    minLabel: "0%",
    maxLabel: "100%",
  },
};

export const WithFormattedTooltip: Story = {
  args: {
    defaultValue: [50],
    label: "Price",
    showTooltip: true,
    min: 0,
    max: 1000,
    step: 10,
    formatTooltip: (value: number) => `$${value}`,
  },
};

export const Range: Story = {
  args: {
    defaultValue: [20, 80],
    label: "Price Range",
    minLabel: "$0",
    maxLabel: "$1000",
  },
};

export const NoLabels: Story = {
  args: {
    defaultValue: [50],
  },
};

export const MinMaxLabelsOnly: Story = {
  args: {
    defaultValue: [30],
    minLabel: "Low",
    maxLabel: "High",
  },
};

export const Disabled: Story = {
  args: {
    defaultValue: [50],
    label: "Disabled Slider",
    minLabel: "Min",
    maxLabel: "Max",
    disabled: true,
  },
};

export const CustomStep: Story = {
  args: {
    defaultValue: [50],
    label: "Rating",
    min: 0,
    max: 100,
    step: 25,
    minLabel: "0",
    maxLabel: "100",
    showTooltip: true,
  },
};

export const ControlledExample: Story = {
  name: "Controlled",
  parameters: {
    docs: {
      description: {
        story: "`value` and `onValueChange` driven by React state.",
      },
    },
  },
  render: function ControlledExampleRender() {
    const [value, setValue] = useState([50]);
    return (
      <div className="flex flex-col gap-4">
        <Slider
          value={value}
          onValueChange={setValue}
          label="Controlled"
          showTooltip
          minLabel="0"
          maxLabel="100"
        />
        <p className="text-body-200 text-sm">
          Current value: <strong>{value[0]}</strong>
        </p>
      </div>
    );
  },
};

export const LabelLeftNoMinMax: Story = {
  args: {
    defaultValue: [60],
    label: "Speed",
    labelPosition: "left",
  },
};
