import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { AiButton } from "./AiButton";

const meta = {
  title: "Components/AiButton",
  component: AiButton,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    size: { control: "select", options: ["24", "32", "40"] },
    active: { control: "boolean" },
    disabled: { control: "boolean" },
  },
  args: {
    label: "Analyse",
    activeLabel: "Analysing",
    active: false,
    disabled: false,
    size: "32",
  },
} satisfies Meta<typeof AiButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Active: Story = {
  args: { active: true },
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const Sizes: Story = {
  render: (args) => (
    <div className="flex items-center gap-4">
      {(["24", "32", "40"] as const).map((size) => (
        <AiButton {...args} key={size} size={size} />
      ))}
    </div>
  ),
};

/**
 * Both labels share one grid cell, so the button keeps the width of the longer
 * label and toggling `active` crossfades without shifting the layout around it.
 */
export const Toggling: Story = {
  render: (args) => {
    const [active, setActive] = useState(false);
    return (
      <div className="flex items-center gap-4">
        <AiButton {...args} active={active} onClick={() => setActive((value) => !value)} />
        <span className="typography-description-12px-regular text-content-secondary">
          click to toggle
        </span>
      </div>
    );
  },
};

export const LongLabel: Story = {
  args: { label: "Analyse this chart", activeLabel: "Analysing this chart" },
};

/**
 * With several `AiButton`s side by side, `idleShimmer={false}` keeps the two
 * idle actions still so only the one that is genuinely running reads as busy.
 */
export const GroupedActions: Story = {
  render: () => {
    const [active, setActive] = useState<"generate" | "voicenote" | "enhance" | null>(null);
    const actions = [
      { id: "generate" as const, label: "Generate reply", activeLabel: "Generating" },
      { id: "voicenote" as const, label: "Generate voicenote", activeLabel: "Converting" },
      { id: "enhance" as const, label: "Enhance for speech", activeLabel: "Enhancing" },
    ];
    return (
      <div className="flex items-center gap-2">
        {actions.map((action) => (
          <AiButton
            key={action.id}
            label={action.label}
            activeLabel={action.activeLabel}
            active={active === action.id}
            idleShimmer={false}
            onClick={() => setActive(action.id)}
          />
        ))}
      </div>
    );
  },
};
