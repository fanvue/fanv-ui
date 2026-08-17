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

/** Every size and every field state in one view. */
export const AllStates: Story = {
  parameters: { layout: "padded" },
  render: () => (
    <div className="flex w-[375px] flex-col gap-4">
      <SearchField size="48" label="Size 48" placeholder="Search..." />
      <SearchField size="40" label="Size 40" placeholder="Search..." />
      <SearchField size="32" label="Size 32" placeholder="Search..." />
      <SearchField label="With helper" placeholder="Search..." helperText="Type to search" />
      <SearchField
        label="Error"
        placeholder="Search..."
        error
        errorMessage="Search query is too short"
      />
      <SearchField label="Disabled" placeholder="Search..." disabled />
    </div>
  ),
};

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

export const TextOverflow: Story = {
  name: "Text Overflow",
  render: () => (
    <div className="flex w-[200px] flex-col gap-6">
      <SearchField
        placeholder="Search..."
        defaultValue="https://www.example.com/very/long/url/that/should/not/overflow/the/container/boundary"
      />
      <SearchField
        label="With label"
        placeholder="Search..."
        size="32"
        defaultValue="https://www.example.com/very/long/url/that/should/not/overflow/the/container/boundary"
      />
    </div>
  ),
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
