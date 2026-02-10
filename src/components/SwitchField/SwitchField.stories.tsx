import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { SwitchField } from "./SwitchField";

const meta = {
  title: "Components/SwitchField",
  component: SwitchField,
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
    orientation: {
      control: "select",
      options: ["right", "left"],
    },
    disabled: {
      control: "boolean",
    },
    infoText: {
      control: "text",
    },
  },
} satisfies Meta<typeof SwitchField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: "Toggle",
    helperText: "Helper",
  },
};

export const OrientationRight: Story = {
  args: {
    label: "Toggle",
    helperText: "Helper",
    orientation: "right",
  },
};

export const OrientationLeft: Story = {
  args: {
    label: "Toggle",
    helperText: "Helper",
    orientation: "left",
  },
};

export const SmallRight: Story = {
  args: {
    label: "Toggle",
    helperText: "Helper",
    size: "small",
    orientation: "right",
  },
};

export const SmallLeft: Story = {
  args: {
    label: "Toggle",
    helperText: "Helper",
    size: "small",
    orientation: "left",
  },
};

export const WithInfo: Story = {
  args: {
    label: "Toggle",
    helperText: "Helper",
    infoText: "Info text",
  },
};

export const LabelOnly: Story = {
  args: {
    label: "Notifications",
  },
};

export const Disabled: Story = {
  args: {
    label: "Toggle",
    helperText: "Helper",
    disabled: true,
  },
};

export const DisabledChecked: Story = {
  args: {
    label: "Toggle",
    helperText: "Helper",
    disabled: true,
    checked: true,
  },
};

export const ControlledExample: Story = {
  name: "Controlled",
  render: function ControlledRender() {
    const [checked, setChecked] = useState(false);
    return (
      <SwitchField
        label="Notifications"
        helperText="Get notified about new updates"
        checked={checked}
        onCheckedChange={setChecked}
      />
    );
  },
};

export const UncontrolledExample: Story = {
  name: "Uncontrolled",
  render: () => (
    <div className="flex flex-col gap-4">
      <SwitchField label="Notifications" helperText="Default (unchecked)" />
      <SwitchField label="Dark mode" helperText="Default checked" defaultChecked />
    </div>
  ),
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <span className="typography-body-2-semibold text-body-200">
          Default - Right orientation
        </span>
        <SwitchField label="Toggle" helperText="Helper" orientation="right" checked={true} />
      </div>
      <div className="flex flex-col gap-3">
        <span className="typography-body-2-semibold text-body-200">Default - Left orientation</span>
        <SwitchField label="Toggle" helperText="Helper" orientation="left" checked={true} />
      </div>
      <div className="flex flex-col gap-3">
        <span className="typography-body-2-semibold text-body-200">Small - Right orientation</span>
        <SwitchField
          label="Toggle"
          helperText="Helper"
          size="small"
          orientation="right"
          checked={true}
        />
      </div>
      <div className="flex flex-col gap-3">
        <span className="typography-body-2-semibold text-body-200">Small - Left orientation</span>
        <SwitchField
          label="Toggle"
          helperText="Helper"
          size="small"
          orientation="left"
          checked={true}
        />
      </div>
    </div>
  ),
  parameters: {
    layout: "padded",
  },
};
