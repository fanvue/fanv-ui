import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { ChevronDownIcon } from "../Icons/ChevronDownIcon";
import { TableToolbarAction } from "../Table/Table";
import { DateRangePanel, type DateRangeValue } from "./DateRangePanel";
import { DateRangePicker } from "./DateRangePicker";

const PRESETS = [
  { id: "all", label: "All time" },
  { id: "today", label: "Today" },
  { id: "yesterday", label: "Yesterday" },
  { id: "7d", label: "Last 7 days" },
  { id: "30d", label: "Last 30 days" },
];

const meta = {
  title: "Components/DateRangePicker",
  component: DateRangePicker,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof DateRangePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    presets: PRESETS,
    customRangeLabel: "Custom range",
    value: { type: "preset", presetId: "all" },
    onValueChange: () => {},
    children: <TableToolbarAction icon={<ChevronDownIcon size={16} />}>Date</TableToolbarAction>,
  },
  render: (args) => {
    const [value, setValue] = useState<DateRangeValue>(args.value);
    return (
      <DateRangePicker {...args} value={value} onValueChange={setValue}>
        {args.children}
      </DateRangePicker>
    );
  },
};

export const Panel: StoryObj<typeof DateRangePanel> = {
  render: () => {
    const [value, setValue] = useState<DateRangeValue>({ type: "preset", presetId: "all" });
    return (
      <DateRangePanel
        presets={PRESETS}
        customRangeLabel="Custom range"
        value={value}
        onValueChange={setValue}
        confirmCustomRange={false}
      />
    );
  },
};
