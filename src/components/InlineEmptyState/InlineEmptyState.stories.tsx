import type { Meta, StoryObj } from "@storybook/react";
import { InlineEmptyState } from "./InlineEmptyState";

const meta = {
  title: "Components/InlineEmptyState",
  component: InlineEmptyState,
  parameters: {
    layout: "padded",
    design: {
      type: "figma",
      url: "https://www.figma.com/design/S8zFdcOjt4qN4PrwntuCdt/Fanvue-Library?node-id=14487-61260&m=dev",
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof InlineEmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "No links in this campaign yet.",
  },
};

/** Inside a bordered card, where it stands in for the rows that are not there yet. */
export const InCard: Story = {
  args: {
    children: "No links in this campaign yet.",
  },
  render: (args) => (
    <div className="max-w-xl rounded-md border border-border-primary bg-surface-primary">
      <InlineEmptyState {...args} />
    </div>
  ),
};

/**
 * Inline markup stays part of the sentence, and a long unbroken word breaks to fit a narrow
 * card.
 */
export const WithEmphasis: Story = {
  render: () => (
    <div className="max-w-52 rounded-md border border-border-primary bg-surface-primary">
      <InlineEmptyState>
        No links for <strong>summer_launch_early_access_2026</strong> yet.
      </InlineEmptyState>
    </div>
  ),
};

/** A long message wraps and stays centred. The block is at least 80px tall and grows with it. */
export const LongMessage: Story = {
  args: {
    children:
      "Nothing to show for this date range. Pick a longer range, or check back once your first link has been clicked.",
  },
  render: (args) => (
    <div className="max-w-xs rounded-md border border-border-primary bg-surface-primary">
      <InlineEmptyState {...args} />
    </div>
  ),
};
