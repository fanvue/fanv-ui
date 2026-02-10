import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { SwitchToggle } from "./SwitchToggle";

const meta = {
  title: "Components/SwitchToggle",
  component: SwitchToggle,
  parameters: {
    layout: "centered",
    design: {
      type: "figma",
      url: "https://www.figma.com/design/S8zFdcOjt4qN4PrwntuCdt/Fanvue-Library?node-id=87-4101&m=dev",
    },
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["24", "32", "40"],
    },
    disabled: {
      control: "boolean",
    },
  },
} satisfies Meta<typeof SwitchToggle>;

export default meta;
type Story = StoryObj<typeof meta>;

const defaultOptions: [{ label: string; value: string }, { label: string; value: string }] = [
  { label: "Net", value: "net" },
  { label: "Gross", value: "gross" },
];

export const Default: Story = {
  args: {
    options: defaultOptions,
    "aria-label": "Toggle view",
  },
};

export const SmallSize: Story = {
  args: {
    size: "24",
    options: defaultOptions,
    "aria-label": "Toggle view",
  },
};

export const MediumSize: Story = {
  args: {
    size: "32",
    options: defaultOptions,
    "aria-label": "Toggle view",
  },
};

export const LargeSize: Story = {
  args: {
    size: "40",
    options: defaultOptions,
    "aria-label": "Toggle view",
  },
};

export const SecondOptionSelected: Story = {
  args: {
    options: defaultOptions,
    defaultValue: "gross",
    "aria-label": "Toggle view",
  },
};

export const Disabled: Story = {
  args: {
    options: defaultOptions,
    disabled: true,
    "aria-label": "Toggle view",
  },
};

export const ControlledExample: Story = {
  name: "Controlled",
  args: {
    options: defaultOptions,
    "aria-label": "Toggle view",
  },
  render: function ControlledRender() {
    const [value, setValue] = useState("net");
    return (
      <div className="flex flex-col items-center gap-3">
        <SwitchToggle
          options={defaultOptions}
          value={value}
          onChange={setValue}
          aria-label="Toggle view"
        />
        <span className="text-body-200 text-sm">Selected: {value}</span>
      </div>
    );
  },
};

export const UncontrolledExample: Story = {
  name: "Uncontrolled",
  args: {
    options: defaultOptions,
    "aria-label": "Toggle view",
  },
  render: () => (
    <div className="flex flex-col items-start gap-4">
      <div className="flex flex-col gap-2">
        <span className="text-body-200 text-sm">Default (first option selected)</span>
        <SwitchToggle options={defaultOptions} aria-label="Default toggle" />
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-body-200 text-sm">With defaultValue (second option selected)</span>
        <SwitchToggle options={defaultOptions} defaultValue="gross" aria-label="Preset toggle" />
      </div>
    </div>
  ),
};

export const CustomLabels: Story = {
  args: {
    options: [
      { label: "Monthly", value: "monthly" },
      { label: "Yearly", value: "yearly" },
    ],
    "aria-label": "Billing period",
  },
};

export const AllSizes: Story = {
  args: {
    options: defaultOptions,
    "aria-label": "Toggle view",
  },
  render: () => (
    <div className="flex flex-col items-start gap-4">
      <div className="flex flex-col gap-2">
        <span className="typography-body-2-semibold text-body-200">Small (24)</span>
        <SwitchToggle size="24" options={defaultOptions} aria-label="Small toggle" />
      </div>
      <div className="flex flex-col gap-2">
        <span className="typography-body-2-semibold text-body-200">Medium (32)</span>
        <SwitchToggle size="32" options={defaultOptions} aria-label="Medium toggle" />
      </div>
      <div className="flex flex-col gap-2">
        <span className="typography-body-2-semibold text-body-200">Large (40)</span>
        <SwitchToggle size="40" options={defaultOptions} aria-label="Large toggle" />
      </div>
    </div>
  ),
};
