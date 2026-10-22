import type { Meta, StoryObj } from "@storybook/react";
import { IconButton } from "../IconButton/IconButton";
import { ChevronRightIcon } from "../Icons/ChevronRightIcon";
import { StarIcon } from "../Icons/StarIcon";
import { Pill } from "../Pill/Pill";
import { TableMobileRow } from "./TableMobileRow";

const meta = {
  title: "Components/Table/TableMobileRow",
  component: TableMobileRow,
  parameters: {
    layout: "padded",
    design: {
      type: "figma",
      url: "https://www.figma.com/design/23x2vofTPkLpbcJyRdDa55/Creator---Management--Teams?node-id=9076-75776",
    },
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="w-full max-w-[361px]">
        <Story />
      </div>
    ),
  ],
  args: {
    title: "Top Spenders",
    description: "320 members",
    badge: <Pill variant="green">Dynamic</Pill>,
    actions: (
      <>
        <StarIcon size={16} filled />
        <IconButton
          variant="secondary"
          size="24"
          aria-label="Open list"
          icon={<ChevronRightIcon />}
        />
      </>
    ),
  },
} satisfies Meta<typeof TableMobileRow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithoutBadge: Story = {
  args: { badge: undefined, actions: undefined },
};

export const List: Story = {
  render: (args) => (
    <div className="flex flex-col">
      <TableMobileRow {...args} />
      <TableMobileRow
        {...args}
        title="Free trial"
        description="48 members"
        badge={<Pill variant="grey">Manual</Pill>}
      />
      <TableMobileRow {...args} title="Renewal at risk" description="1,204 members" />
    </div>
  ),
};
