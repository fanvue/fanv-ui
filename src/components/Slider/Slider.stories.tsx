import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { E2E_FIXTURE_PARAMETERS, NON_VISUAL_STORY_PARAMETERS } from "../../storybook";
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

/** Every label arrangement, plus the disabled and range forms. */
export const AllVariants: Story = {
  parameters: { layout: "padded" },
  render: () => (
    <div className="flex w-[360px] flex-col gap-8">
      <Slider
        defaultValue={[40]}
        label="Label top"
        labelPosition="top"
        minLabel="0"
        maxLabel="100"
      />
      <Slider
        defaultValue={[40]}
        label="Label left"
        labelPosition="left"
        minLabel="0"
        maxLabel="100"
      />
      <Slider defaultValue={[60]} label="Label left, no min/max" labelPosition="left" />
      <Slider defaultValue={[30]} minLabel="Low" maxLabel="High" />
      <Slider defaultValue={[50]} />
      <Slider defaultValue={[20, 80]} label="Range" minLabel="$0" maxLabel="$1000" />
      <Slider defaultValue={[50]} label="Disabled" minLabel="Min" maxLabel="Max" disabled />
    </div>
  ),
};

export const Default: Story = {
  args: {
    defaultValue: [50],
    label: "Label",
    minLabel: "Min Value",
    maxLabel: "Max Value",
  },
};

/**
 * Fixtures for `e2e/slider.spec.ts`, which asserts against `getByRole("slider")` and
 * so cannot target a cell inside `AllVariants` (it renders eight thumbs). Their
 * appearance is covered there, so they do not take a snapshot. Renaming or removing
 * one of these will fail the E2E job.
 */
export const NoLabels: Story = {
  parameters: E2E_FIXTURE_PARAMETERS,
  args: { defaultValue: [50] },
};

export const Disabled: Story = {
  parameters: E2E_FIXTURE_PARAMETERS,
  args: {
    defaultValue: [50],
    label: "Disabled Slider",
    minLabel: "Min",
    maxLabel: "Max",
    disabled: true,
  },
};

export const Range: Story = {
  parameters: E2E_FIXTURE_PARAMETERS,
  args: {
    defaultValue: [20, 80],
    label: "Price Range",
    minLabel: "$0",
    maxLabel: "$1000",
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
    ...NON_VISUAL_STORY_PARAMETERS,
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
        <p className="text-content-secondary text-sm">
          Current value: <strong>{value[0]}</strong>
        </p>
      </div>
    );
  },
};
