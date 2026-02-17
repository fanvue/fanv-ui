import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { SearchField } from "./SearchField";

const meta = {
  title: "Components/SearchField",
  component: SearchField,
  parameters: {
    layout: "centered",
    design: {
      type: "figma",
      url: "https://www.figma.com/design/S8zFdcOjt4qN4PrwntuCdt/Fanvue-Library?node-id=1012-1813",
    },
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["48", "40", "32"],
    },
  },
} satisfies Meta<typeof SearchField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: "Search...",
  },
};

export const WithLabel: Story = {
  args: {
    label: "Search",
    placeholder: "Enter search terms",
  },
};

export const WithHelperText: Story = {
  args: {
    label: "Search",
    placeholder: "Search...",
    helperText: "Type to search for items",
  },
};

export const WithError: Story = {
  args: {
    label: "Search",
    placeholder: "Search...",
    error: true,
    errorMessage: "Search query is too short",
  },
};

export const Size48: Story = {
  args: {
    size: "48",
    placeholder: "Size 48",
  },
};

export const Size40: Story = {
  args: {
    size: "40",
    placeholder: "Size 40",
  },
};

export const Size32: Story = {
  args: {
    size: "32",
    placeholder: "Size 32",
  },
};

export const Disabled: Story = {
  args: {
    label: "Search",
    placeholder: "Search...",
    disabled: true,
  },
};

export const WithClearButton: Story = {
  render: (args) => {
    const [value, setValue] = useState("test query");

    return (
      <SearchField
        {...args}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onClear={() => setValue("")}
      />
    );
  },
  args: {
    label: "Search",
    placeholder: "Search...",
  },
};

export const FullWidth: Story = {
  args: {
    label: "Search",
    placeholder: "Search...",
    fullWidth: true,
  },
  decorators: [
    (Story) => (
      <div style={{ width: "400px" }}>
        <Story />
      </div>
    ),
  ],
};
