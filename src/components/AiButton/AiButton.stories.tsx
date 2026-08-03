import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { AiButton } from "./AiButton";

const meta = {
  title: "Components/AiButton",
  component: AiButton,
  parameters: {
    layout: "centered",
    design: {
      type: "figma",
      url: "https://www.figma.com/design/S8zFdcOjt4qN4PrwntuCdt/Fanvue-Library?node-id=16650-1558&m=dev",
    },
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
 * The fill is translucent and backdrop-blurred, so it takes on whatever sits
 * behind it. A centred story on the default canvas cannot show that working —
 * these three surfaces can.
 */
export const OnSurfaces: Story = {
  parameters: { layout: "padded" },
  render: (args) => (
    <div className="flex flex-col gap-4">
      {(
        [
          ["Background/Primary", "bg-background-primary"],
          ["Background/Secondary", "bg-background-secondary"],
          ["Green/900", "bg-[var(--primitives-color-green-900)]"],
        ] as const
      ).map(([label, surface]) => (
        <div className={`flex items-center gap-4 rounded-md p-4 ${surface}`} key={label}>
          <AiButton {...args} />
          <span className="typography-description-12px-regular text-content-secondary">
            {label}
          </span>
        </div>
      ))}
    </div>
  ),
};
