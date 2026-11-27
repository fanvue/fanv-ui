import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import type { TagVariant } from "../Tag/Tag";
import type { TagPickerOption } from "./TagField";
import { TagPicker, type TagPickerProps } from "./TagPicker";

const OPTIONS: TagPickerOption[] = [
  { value: "whale", label: "Whale", emoji: "🐳", colour: "blue" },
  { value: "top", label: "Top spender", emoji: "💎", colour: "purple" },
  { value: "owl", label: "Night owl" },
  { value: "tipper", label: "Big tipper", emoji: "💰", colour: "amber" },
  { value: "new", label: "New", colour: "green" },
  { value: "inactive", label: "Inactive", colour: "red" },
];

const COLOURS: readonly TagVariant[] = [
  "gray",
  "blue",
  "teal",
  "green",
  "amber",
  "red",
  "pink",
  "purple",
];

function StatefulPicker({
  initial = [],
  ...props
}: Partial<TagPickerProps> & { initial?: string[] }) {
  const [options, setOptions] = React.useState(OPTIONS);
  const [value, setValue] = React.useState(initial);
  return (
    <div className="w-80">
      <TagPicker
        {...props}
        label="Tags"
        options={options}
        value={value}
        onValueChange={setValue}
        onCreate={({ label, emoji }) => {
          const option: TagPickerOption = {
            value: `${label}-${options.length}`,
            label,
            emoji,
            colour: COLOURS[options.length % COLOURS.length],
          };
          setOptions((current) => [...current, option]);
          setValue((current) => [...current, option.value]);
        }}
      />
    </div>
  );
}

const meta = {
  title: "Components/TagPicker",
  component: TagPicker,
  parameters: {
    layout: "centered",
    design: {
      type: "figma",
      url: "https://www.figma.com/design/S8zFdcOjt4qN4PrwntuCdt/Fanvue-Library?node-id=23899-1424",
    },
  },
  tags: ["autodocs"],
  args: { label: "Tags", options: OPTIONS, value: [], onValueChange: () => {} },
  render: (args) => <StatefulPicker {...args} />,
} satisfies Meta<typeof TagPicker>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The empty field. Click anywhere on it to open the picker. */
export const Default: Story = {};

/**
 * With tags picked. Open it, type to filter, use ↑ ↓ and Enter, or press Backspace on an empty
 * input to select and then remove the last tag. Type a name that starts with an emoji, such as
 * "🦄 Unicorn", to create a tag with that emoji.
 */
export const WithTags: Story = {
  render: (args) => <StatefulPicker {...args} initial={["whale", "top"]} />,
};

/** Open on first render, as a popover under the field. */
export const Open: Story = {
  render: (args) => <StatefulPicker {...args} initial={["whale", "top"]} defaultOpen />,
};

/** The mobile sheet, floated 16px from the sides and bottom. Rows are 40px for touch. */
export const Sheet: Story = {
  parameters: { viewport: { defaultViewport: "mobile1" } },
  render: (args) => (
    <StatefulPicker {...args} initial={["whale", "top"]} variant="sheet" defaultOpen />
  ),
};
