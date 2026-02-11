import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { HomeIcon } from "../Icons/HomeIcon";
import { TextField } from "./TextField";

const meta: Meta<typeof TextField> = {
  title: "Components/TextField",
  component: TextField,
  parameters: {
    layout: "centered",
    design: {
      type: "figma",
      url: "https://www.figma.com/design/S8zFdcOjt4qN4PrwntuCdt/Fanvue-Library?node-id=4262-17626&m=dev",
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
    placeholder: "Placeholder Text",
  },
};

export const Size48: Story = {
  args: {
    size: "48",
    label: "Size 48",
    placeholder: "Placeholder Text",
  },
};

export const Size40: Story = {
  args: {
    size: "40",
    label: "Size 40",
    placeholder: "Placeholder Text",
  },
};

export const Size32: Story = {
  args: {
    size: "32",
    label: "Size 32",
    placeholder: "Placeholder Text",
  },
};

export const WithHelperText: Story = {
  args: {
    label: "Email",
    placeholder: "you@example.com",
    helperText: "We'll never share your email",
  },
};

export const WithLeftIcon: Story = {
  args: {
    label: "Search",
    placeholder: "Search...",
    leftIcon: <HomeIcon />,
  },
};

export const WithRightIcon: Story = {
  args: {
    label: "Password",
    type: "password",
    placeholder: "Enter password",
    rightIcon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-label="Show password">
        <title>Eye</title>
        <path
          d="M1 10s3-7 9-7 9 7 9 7-3 7-9 7-9-7-9-7Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle
          cx="10"
          cy="10"
          r="3"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
};

export const ErrorState: Story = {
  args: {
    label: "Email",
    placeholder: "you@example.com",
    error: true,
    errorMessage: "Please enter a valid email address",
    defaultValue: "invalid-email",
  },
};

export const ErrorWithoutMessage: Story = {
  args: {
    label: "Username",
    placeholder: "Enter username",
    error: true,
    helperText: "This field is required",
    defaultValue: "",
  },
};

export const Disabled: Story = {
  args: {
    label: "Label",
    placeholder: "Disabled input",
    disabled: true,
  },
};

export const DisabledWithValue: Story = {
  args: {
    label: "Label",
    placeholder: "Disabled input",
    disabled: true,
    defaultValue: "Disabled value",
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
          "TextField uses `value` and `onChange`. Works with React state and form libraries (e.g. react-hook-form).",
      },
    },
  },
  render: function ControlledExampleRender() {
    const [value, setValue] = useState("");
    const [error, setError] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue(e.target.value);
      setError(e.target.value.length > 0 && e.target.value.length < 3);
    };

    return (
      <div className="flex w-[375px] flex-col gap-4">
        <TextField
          label="Username"
          placeholder="Enter username (min 3 characters)"
          value={value}
          onChange={handleChange}
          error={error}
          errorMessage={error ? "Username must be at least 3 characters" : undefined}
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
      <TextField size="48" label="Size 48" placeholder="Default size" />
      <TextField size="40" label="Size 40" placeholder="Medium size" />
      <TextField size="32" label="Size 32" placeholder="Compact size" />
    </div>
  ),
};
