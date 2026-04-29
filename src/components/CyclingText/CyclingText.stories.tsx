import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Button } from "../Button/Button";
import { SpinnerIcon } from "../Icons/SpinnerIcon";
import { CyclingText } from "./CyclingText";

const meta = {
  title: "Components/CyclingText",
  component: CyclingText,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    direction: { control: "radio", options: ["up", "down"] },
    sizing: { control: "radio", options: ["longest", "current"] },
    intervalMs: { control: { type: "number", min: 200, step: 100 } },
    transitionMs: { control: { type: "number", min: 0, step: 20 } },
    paused: { control: "boolean" },
  },
} satisfies Meta<typeof CyclingText>;

export default meta;
type Story = StoryObj<typeof meta>;

const STAGES = [
  "Thinking",
  "Reading messages",
  "Drafting reply",
  "Connecting the dots",
  "Almost there",
];

export const Default: Story = {
  args: {
    items: STAGES,
    intervalMs: 1800,
    transitionMs: 380,
    direction: "up",
    sizing: "longest",
  },
};

export const InsideAButton: Story = {
  render: (args) => (
    <Button variant="secondary">
      <SpinnerIcon className="mr-2 size-4 animate-spin" />
      <CyclingText {...args} />
    </Button>
  ),
  args: {
    items: STAGES,
  },
};

export const InsideAStatusRow: Story = {
  render: (args) => (
    <div className="inline-flex items-center gap-2 text-content-tertiary">
      <SpinnerIcon className="size-4 animate-spin" />
      <CyclingText {...args} />
    </div>
  ),
  args: {
    items: STAGES,
  },
};

export const SizedToCurrent: Story = {
  args: {
    items: STAGES,
    sizing: "current",
  },
};

export const ShortItems: Story = {
  args: {
    items: ["One", "Two", "Three"],
    intervalMs: 900,
  },
};

export const Paused: Story = {
  args: {
    items: STAGES,
    paused: true,
  },
};

export const FakePlaceholder: Story = {
  render: (args) => {
    const [value, setValue] = useState("");
    const [focused, setFocused] = useState(false);
    const showPlaceholder = !focused && value.length === 0;

    return (
      <div className="relative w-80">
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="w-full rounded-md border border-border-default bg-bg-primary px-3 py-2 text-content-primary outline-none"
        />
        {showPlaceholder && (
          <CyclingText
            {...args}
            className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-content-tertiary"
          />
        )}
      </div>
    );
  },
  args: {
    items: ["Search creators…", "Find a fan…", "Look up a transaction…", "Browse posts…"],
  },
};
