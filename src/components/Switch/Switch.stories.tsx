import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { NON_VISUAL_STORY_PARAMETERS } from "../../storybook";
import { Switch } from "./Switch";

const meta = {
  title: "Components/Switch",
  component: Switch,
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
      options: ["default", "small"],
    },
    checked: {
      control: "boolean",
    },
    disabled: {
      control: "boolean",
    },
  },
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    "aria-label": "Toggle feature",
  },
};

export const ControlledExample: Story = {
  parameters: NON_VISUAL_STORY_PARAMETERS,
  name: "Controlled",
  render: function ControlledRender() {
    const [checked, setChecked] = useState(false);
    return (
      <div className="flex items-center gap-3">
        <Switch checked={checked} onCheckedChange={setChecked} aria-label="Toggle feature" />
        <span className="text-content-secondary text-sm">{checked ? "On" : "Off"}</span>
      </div>
    );
  },
};

export const UncontrolledExample: Story = {
  parameters: NON_VISUAL_STORY_PARAMETERS,
  name: "Uncontrolled",
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <Switch aria-label="Default unchecked" />
        <span className="text-content-secondary text-sm">Default (unchecked)</span>
      </div>
      <div className="flex items-center gap-3">
        <Switch defaultChecked aria-label="Default checked" />
        <span className="text-content-secondary text-sm">Default checked</span>
      </div>
    </div>
  ),
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <span className="typography-body-small-14px-semibold text-content-secondary">
          Default Size
        </span>
        <div className="flex items-center gap-4">
          <Switch checked={true} aria-label="On" />
          <Switch checked={false} aria-label="Off" />
          <Switch disabled checked={true} aria-label="Disabled on" />
          <Switch disabled checked={false} aria-label="Disabled off" />
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <span className="typography-body-small-14px-semibold text-content-secondary">
          Small Size
        </span>
        <div className="flex items-center gap-4">
          <Switch size="small" checked={true} aria-label="On" />
          <Switch size="small" checked={false} aria-label="Off" />
          <Switch size="small" disabled checked={true} aria-label="Disabled on" />
          <Switch size="small" disabled checked={false} aria-label="Disabled off" />
        </div>
      </div>
    </div>
  ),
};
