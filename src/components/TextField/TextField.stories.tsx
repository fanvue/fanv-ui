import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Chip } from "../Chip/Chip";
import { ErrorCircleIcon } from "../Icons/ErrorCircleIcon";
import { HomeIcon } from "../Icons/HomeIcon";
import { InfoCircleIcon } from "../Icons/InfoCircleIcon";
import { TextField } from "./TextField";

const meta: Meta<typeof TextField> = {
  title: "Components/TextField",
  component: TextField,
  parameters: {
    layout: "centered",
    design: {
      type: "figma",
      url: "https://www.figma.com/design/S8zFdcOjt4qN4PrwntuCdt/Fanvue-Library?node-id=16633-67897",
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
    validated: {
      control: "boolean",
    },
    fullWidth: {
      control: "boolean",
    },
    leftLabel: {
      control: "text",
    },
    rightLabel: {
      control: "text",
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

export const WithoutLabel: Story = {
  args: {
    placeholder: "No label",
    "aria-label": "Search",
  },
};

export const SideLabelPrefix: Story = {
  name: "Side Label (prefix)",
  args: {
    label: "Price",
    leftLabel: "$",
    placeholder: "0.00",
  },
};

export const SideLabelSuffix: Story = {
  name: "Side Label (suffix)",
  args: {
    label: "Amount",
    rightLabel: "USD",
    placeholder: "0.00",
  },
};

export const SideLabelWithIcon: Story = {
  name: "Side Label with icon",
  args: {
    label: "Website",
    leftIcon: <HomeIcon />,
    rightLabel: ".fanvue.com",
    placeholder: "your-handle",
  },
};

export const SideLabelSizes: Story = {
  name: "Side Label (all sizes)",
  render: () => (
    <div className="flex w-[375px] flex-col gap-4">
      <TextField size="48" label="Size 48" leftLabel="$" rightLabel="USD" placeholder="0.00" />
      <TextField size="40" label="Size 40" leftLabel="$" rightLabel="USD" placeholder="0.00" />
      <TextField size="32" label="Size 32" leftLabel="$" rightLabel="USD" placeholder="0.00" />
    </div>
  ),
};

export const WithButtonSizes: Story = {
  name: "With button (all sizes)",
  render: () => (
    <div className="flex w-[375px] flex-col gap-4">
      <TextField
        size="48"
        label="Size 48"
        placeholder="Enter code"
        action={<Chip size="32">Apply</Chip>}
      />
      <TextField
        size="40"
        label="Size 40"
        placeholder="Enter code"
        action={<Chip size="32">Apply</Chip>}
      />
      <TextField
        size="32"
        label="Size 32"
        placeholder="Enter code"
        action={<Chip size="32">Apply</Chip>}
      />
    </div>
  ),
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

export const ErrorWithIcons: Story = {
  args: {
    label: "Email",
    placeholder: "you@example.com",
    error: true,
    errorMessage: "Invalid email",
    leftIcon: <HomeIcon />,
    rightIcon: <ErrorCircleIcon />,
    defaultValue: "bad-email",
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
    chromatic: { disableSnapshot: true },
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
        <div className="typography-description-12px-regular text-content-secondary">
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
      <TextField label="Default" placeholder="Placeholder" />
      <TextField label="With helper" placeholder="Placeholder" helperText="Helper text" />
      <TextField label="With value" defaultValue="Typed text" />
      <TextField label="Validated" validated defaultValue="user@example.com" />
      <TextField label="Error" error errorMessage="Error message" defaultValue="invalid" />
      <TextField label="Disabled" placeholder="Placeholder" disabled />
      <TextField label="Disabled with value" defaultValue="Value" disabled />
      <TextField label="Left icon" placeholder="Placeholder" leftIcon={<HomeIcon />} />
      <TextField label="Right icon" placeholder="Placeholder" rightIcon={<InfoCircleIcon />} />
      <TextField
        label="Both icons"
        placeholder="Placeholder"
        leftIcon={<HomeIcon />}
        rightIcon={<InfoCircleIcon />}
      />
    </div>
  ),
};

export const TextOverflow: Story = {
  name: "Text Overflow",
  render: () => (
    <div className="flex w-[200px] flex-col gap-6">
      <TextField
        label="Default"
        defaultValue="https://www.example.com/very/long/url/that/should/not/overflow/the/container/boundary"
      />
      <TextField
        label="With icons"
        leftIcon={<HomeIcon />}
        rightIcon={<InfoCircleIcon />}
        defaultValue="https://www.example.com/very/long/url/that/should/not/overflow/the/container/boundary"
      />
      <TextField
        label="Size 32"
        size="32"
        defaultValue="https://www.example.com/very/long/url/that/should/not/overflow/the/container/boundary"
      />
    </div>
  ),
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
