import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "../Button/Button";
import { SpinnerIcon } from "../Icons/SpinnerIcon";
import { CyclingText } from "./CyclingText";

const meta = {
  title: "Components/CyclingText",
  component: CyclingText,
  parameters: {
    layout: "centered",
    design: {
      type: "figma",
      url: "https://www.figma.com/design/S8zFdcOjt4qN4PrwntuCdt/Fanvue-Library?node-id=18117-70537&t=aDs0f0yBBCb6keGl-1",
    },
  },
  tags: ["autodocs"],
  argTypes: {
    direction: { control: "radio", options: ["up", "down"] },
    sizing: { control: "radio", options: ["longest", "current"] },
    intervalMs: { control: { type: "number", min: 200, step: 100 } },
    transitionMs: { control: { type: "number", min: 0, step: 20 } },
    paused: { control: "boolean" },
    announceChanges: { control: "boolean" },
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
  render: (args) => (
    <div className="w-80 rounded-md border border-border-default bg-background-primary px-3 py-2 text-content-tertiary">
      <CyclingText {...args} />
    </div>
  ),
  args: {
    items: ["Search creators…", "Find a fan…", "Look up a transaction…", "Browse posts…"],
  },
};
