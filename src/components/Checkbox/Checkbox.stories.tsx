import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Checkbox } from "./Checkbox";

const meta = {
  title: "Components/Checkbox",
  component: Checkbox,
  parameters: {
    layout: "centered",
    design: {
      type: "figma",
      url: "https://www.figma.com/design/S8zFdcOjt4qN4PrwntuCdt/Fanvue-Library?node-id=9291-9101&m=dev",
    },
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["default", "small"],
    },
    checked: {
      control: "select",
      options: [true, false, "indeterminate"],
    },
    disabled: {
      control: "boolean",
    },
  },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: "Checkbox",
    helperText: "Helper",
  },
};

export const UncontrolledExample: Story = {
  name: "Uncontrolled",
  args: {
    label: "I agree (uncontrolled)",
  },
  parameters: {
    docs: {
      description: {
        story:
          "No `checked` prop. State is managed internally; works with ref-based form libraries (e.g. react-hook-form).",
      },
    },
  },
};

export const ControlledExample: Story = {
  name: "Controlled",
  parameters: {
    docs: {
      description: {
        story: "`checked` and `onCheckedChange` driven by React state.",
      },
    },
  },
  render: function ControlledExampleRender() {
    const [checked, setChecked] = useState<boolean | "indeterminate">(false);
    return <Checkbox label="I agree (controlled)" checked={checked} onCheckedChange={setChecked} />;
  },
};

export const Checked: Story = {
  args: {
    checked: true,
  },
};

export const Indeterminate: Story = {
  args: {
    checked: "indeterminate",
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const DisabledChecked: Story = {
  args: {
    disabled: true,
    checked: true,
  },
};

export const WithLabel: Story = {
  args: {
    label: "Accept terms and conditions",
  },
};

export const WithLabelAndHelperText: Story = {
  args: {
    label: "Checkbox",
    helperText: "Helper",
  },
};

export const WithLabelAndLongHelperText: Story = {
  args: {
    label: "Subscribe to newsletter",
    helperText: "Get weekly updates about new features and releases",
  },
};

export const SmallSize: Story = {
  args: {
    size: "small",
    label: "Small text size",
    helperText: "Label and helper use smaller text",
  },
};

export const DefaultSize: Story = {
  args: {
    size: "default",
    label: "Default text size",
    helperText: "Label and helper use default text size",
  },
};

export const LongLabel: Story = {
  args: {
    label:
      "I agree to the terms and conditions and privacy policy of this application and consent to the processing of my personal data",
    helperText: "By checking this box, you confirm that you have read and understood our policies",
  },
  parameters: {
    layout: "padded",
  },
};

export const MultipleCheckboxes: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Checkbox label="Option 1" />
      <Checkbox label="Option 2" checked />
      <Checkbox label="Option 3" checked="indeterminate" />
      <Checkbox label="Option 4 (Disabled)" disabled />
    </div>
  ),
  parameters: {
    layout: "padded",
  },
};
