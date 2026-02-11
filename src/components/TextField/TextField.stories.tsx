import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { TextField } from "./TextField";

const meta = {
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
      options: ["40", "48"],
    },
    state: {
      control: "select",
      options: ["default", "error", "success"],
    },
    label: {
      control: "text",
    },
    helperText: {
      control: "text",
    },
    placeholder: {
      control: "text",
    },
    disabled: {
      control: "boolean",
    },
    validated: {
      control: "boolean",
    },
  },
} satisfies Meta<typeof TextField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: "Label",
    placeholder: "Placeholder Text",
  },
};

export const Size40: Story = {
  args: {
    size: "40",
    label: "Label",
    placeholder: "Placeholder Text",
  },
};

export const Size48: Story = {
  args: {
    size: "48",
    label: "Label",
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
    leftIcon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-label="Search icon">
        <title>Search</title>
        <path
          d="M9 17A8 8 0 1 0 9 1a8 8 0 0 0 0 16ZM19 19l-4.35-4.35"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
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

export const WithPrefix: Story = {
  args: {
    label: "Amount",
    placeholder: "0.00",
    prefix: "$",
  },
};

export const ErrorState: Story = {
  args: {
    label: "Email",
    placeholder: "you@example.com",
    state: "error",
    helperText: "Please enter a valid email address",
    value: "invalid-email",
  },
};

export const Validated: Story = {
  args: {
    label: "Email",
    placeholder: "you@example.com",
    validated: true,
    helperText: "Email is valid",
    value: "user@example.com",
  },
};

export const Disabled: Story = {
  args: {
    label: "Label",
    placeholder: "Disabled input",
    disabled: true,
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
    return (
      <div className="flex w-[375px] flex-col gap-4">
        <TextField
          label="Username"
          placeholder="Enter username"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          helperText={`${value.length} characters`}
        />
        <div className="typography-caption-regular text-body-200">
          Current value: {value || "(empty)"}
        </div>
      </div>
    );
  },
};
