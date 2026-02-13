import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { PasswordField } from "./PasswordField";

const meta: Meta<typeof PasswordField> = {
  title: "Components/PasswordField",
  component: PasswordField,
  parameters: {
    layout: "centered",
    design: {
      type: "figma",
      url: "https://www.figma.com/design/S8zFdcOjt4qN4PrwntuCdt/Fanvue-Library?node-id=1012-1494&m=dev",
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
    placeholder: "Password",
  },
};

export const Size48: Story = {
  args: {
    size: "48",
    label: "Size 48",
    placeholder: "Password",
  },
};

export const Size40: Story = {
  args: {
    size: "40",
    label: "Size 40",
    placeholder: "Password",
  },
};

export const Size32: Story = {
  args: {
    size: "32",
    label: "Size 32",
    placeholder: "Password",
  },
};

export const WithHelperText: Story = {
  args: {
    label: "Password",
    placeholder: "Enter your password",
    helperText: "Must be at least 8 characters",
  },
};

export const WithLeftIcon: Story = {
  args: {
    label: "Password",
    placeholder: "Enter password",
    leftIcon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <title>Lock</title>
        <rect
          x="3"
          y="9"
          width="14"
          height="9"
          rx="2"
          stroke="currentColor"
          strokeWidth="1.5"
          fill="none"
        />
        <path
          d="M6 9V6a4 4 0 0 1 8 0v3"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
};

export const ErrorState: Story = {
  args: {
    label: "Password",
    placeholder: "Enter your password",
    error: true,
    errorMessage: "Password is required",
  },
};

export const ErrorWithoutMessage: Story = {
  args: {
    label: "Password",
    placeholder: "Enter password",
    error: true,
    helperText: "This field is required",
  },
};

export const Disabled: Story = {
  args: {
    label: "Label",
    placeholder: "Password",
    disabled: true,
  },
};

export const DisabledWithValue: Story = {
  args: {
    label: "Label",
    placeholder: "Password",
    disabled: true,
    defaultValue: "••••••••",
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
          "PasswordField uses `value` and `onChange`. Works with React state and form libraries (e.g. react-hook-form).",
      },
    },
  },
  render: function ControlledExampleRender() {
    const [value, setValue] = useState("");
    const [error, setError] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue(e.target.value);
      setError(e.target.value.length > 0 && e.target.value.length < 8);
    };

    return (
      <div className="flex w-[375px] flex-col gap-4">
        <PasswordField
          label="Password"
          placeholder="Enter password (min 8 characters)"
          value={value}
          onChange={handleChange}
          error={error}
          errorMessage={error ? "Password must be at least 8 characters" : undefined}
          helperText={!error ? `${value.length} characters` : undefined}
        />
        <div className="typography-caption-regular text-body-200">
          Current value: {value || "(empty)"}
        </div>
      </div>
    );
  },
};

export const AllSizeVariants: Story = {
  name: "All Sizes",
  render: () => (
    <div className="flex w-[375px] flex-col gap-4">
      <PasswordField size="48" label="Size 48" placeholder="Password" />
      <PasswordField size="40" label="Size 40" placeholder="Password" />
      <PasswordField size="32" label="Size 32" placeholder="Password" />
    </div>
  ),
};
