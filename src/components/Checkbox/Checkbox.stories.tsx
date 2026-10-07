import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { E2E_FIXTURE_PARAMETERS, NON_VISUAL_STORY_PARAMETERS } from "../../storybook";
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
      options: ["20", "16", "default", "small"],
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

/**
 * Fixtures for `e2e/checkbox.spec.ts`, which asserts against a single checkbox via
 * `getByRole("checkbox")` and so cannot target a cell inside `AllStates`. Their
 * appearance is covered there, so they do not take a snapshot. Renaming or removing
 * one of these will fail the E2E job — the label text is asserted on too.
 */
export const Checked: Story = {
  parameters: E2E_FIXTURE_PARAMETERS,
  args: { checked: true },
};

export const WithLabel: Story = {
  parameters: E2E_FIXTURE_PARAMETERS,
  args: { label: "Accept terms and conditions" },
};

export const Disabled: Story = {
  parameters: E2E_FIXTURE_PARAMETERS,
  args: { disabled: true },
};

export const UncontrolledExample: Story = {
  name: "Uncontrolled",
  args: {
    label: "I agree (uncontrolled)",
  },
  parameters: {
    ...NON_VISUAL_STORY_PARAMETERS,
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
    ...NON_VISUAL_STORY_PARAMETERS,
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

export const WithLabelAndLongHelperText: Story = {
  args: {
    label: "Subscribe to newsletter",
    helperText: "Get weekly updates about new features and releases",
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

export const AllStates: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <Checkbox label="Unchecked" />
        <Checkbox label="Checked" checked />
        <Checkbox label="Indeterminate" checked="indeterminate" />
        <Checkbox label="Disabled" disabled />
        <Checkbox label="Disabled + checked" disabled checked />
        <Checkbox label="With helper text" helperText="Helper" />
      </div>
      <div className="flex flex-col gap-4">
        <Checkbox size="16" label="Compact (16px)" helperText="Dense surfaces like data tables" />
        <Checkbox size="small" label="Small text size" helperText="Smaller label and helper" />
        <Checkbox size="default" label="Default text size" helperText="Default label and helper" />
      </div>
    </div>
  ),
  parameters: {
    layout: "padded",
  },
};
