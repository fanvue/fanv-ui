import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { TextArea } from "./TextArea";

const meta: Meta<typeof TextArea> = {
  title: "Components/TextArea",
  component: TextArea,
  parameters: {
    layout: "centered",
    design: {
      type: "figma",
      url: "https://www.figma.com/design/S8zFdcOjt4qN4PrwntuCdt/Fanvue-Library?node-id=1012-1736&m=dev",
    },
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["48", "40", "32"],
    },
    label: {
      control: "text",
    },
    helperText: {
      control: "text",
    },
    errorMessage: {
      control: "text",
    },
    placeholder: {
      control: "text",
    },
    disabled: {
      control: "boolean",
    },
    error: {
      control: "boolean",
    },
    fullWidth: {
      control: "boolean",
    },
    showClearButton: {
      control: "boolean",
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: "375px" }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: "Label",
    placeholder: "Text Area",
  },
};

export const WithoutLabel: Story = {
  args: {
    placeholder: "No label",
    "aria-label": "Description",
  },
};

export const Size48: Story = {
  args: {
    size: "48",
    label: "Size 48",
    placeholder: "Text Area",
  },
};

export const Size40: Story = {
  args: {
    size: "40",
    label: "Size 40",
    placeholder: "Text Area",
  },
};

export const Size32: Story = {
  args: {
    size: "32",
    label: "Size 32",
    placeholder: "Text Area",
  },
};

export const WithHelperText: Story = {
  args: {
    label: "Description",
    placeholder: "Enter your description...",
    helperText: "Helper Text",
  },
};

export const WithClearButton: Story = {
  args: {
    label: "Description",
    placeholder: "Enter your description...",
    showClearButton: true,
    defaultValue: "This text can be cleared",
  },
};

export const ErrorState: Story = {
  args: {
    label: "Description",
    placeholder: "Enter your description...",
    error: true,
    errorMessage: "This field is required",
    defaultValue: "",
  },
};

export const ErrorWithoutMessage: Story = {
  args: {
    label: "Description",
    placeholder: "Enter your description...",
    error: true,
    helperText: "This field is required",
    defaultValue: "",
  },
};

export const ErrorWithClearButton: Story = {
  args: {
    label: "Description",
    placeholder: "Enter your description...",
    error: true,
    errorMessage: "Invalid input",
    showClearButton: true,
    defaultValue: "Invalid text",
  },
};

export const Disabled: Story = {
  args: {
    label: "Label",
    placeholder: "Disabled textarea",
    disabled: true,
  },
};

export const DisabledWithValue: Story = {
  args: {
    label: "Label",
    placeholder: "Disabled textarea",
    disabled: true,
    defaultValue: "Disabled value that cannot be edited",
  },
};

export const FullWidth: Story = {
  decorators: [
    (Story) => (
      <div style={{ width: "100%", maxWidth: "600px" }}>
        <Story />
      </div>
    ),
  ],
  args: {
    label: "Full Width",
    placeholder: "This field spans the full width",
    fullWidth: true,
  },
};

export const ControlledExample: Story = {
  name: "Controlled",
  parameters: {
    docs: {
      description: {
        story:
          "TextArea uses `value` and `onChange`. Works with React state and form libraries (e.g. react-hook-form).",
      },
    },
  },
  render: function ControlledExampleRender() {
    const [value, setValue] = useState("");
    const [error, setError] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setValue(e.target.value);
      setError(e.target.value.length > 0 && e.target.value.length < 10);
    };

    const handleClear = () => {
      setValue("");
      setError(false);
    };

    return (
      <div className="flex w-[375px] flex-col gap-4">
        <TextArea
          label="Description"
          placeholder="Enter description (min 10 characters)"
          value={value}
          onChange={handleChange}
          onClear={handleClear}
          showClearButton
          error={error}
          errorMessage={error ? "Description must be at least 10 characters" : undefined}
          helperText={!error ? `${value.length} characters` : undefined}
        />
        <div className="typography-caption-regular text-body-200">
          Current value: {value || "(empty)"}
        </div>
      </div>
    );
  },
};

export const AllStates: Story = {
  name: "All States",
  render: () => (
    <div className="flex w-[375px] flex-col gap-6">
      <TextArea label="Default" placeholder="Text Area" />
      <TextArea label="With helper" placeholder="Text Area" helperText="Helper text" />
      <TextArea label="With value" defaultValue="Typed text" />
      <TextArea label="With clear button" showClearButton defaultValue="This can be cleared" />
      <TextArea label="Error" error errorMessage="Error message" defaultValue="invalid" />
      <TextArea label="Disabled" placeholder="Text Area" disabled />
      <TextArea label="Disabled with value" defaultValue="Value" disabled />
    </div>
  ),
};

export const AllSizeVariants: Story = {
  name: "All Sizes",
  render: () => (
    <div className="flex w-[375px] flex-col gap-4">
      <TextArea size="48" label="Size 48" placeholder="Default size" />
      <TextArea size="40" label="Size 40" placeholder="Medium size" />
      <TextArea size="32" label="Size 32" placeholder="Compact size" />
    </div>
  ),
};
