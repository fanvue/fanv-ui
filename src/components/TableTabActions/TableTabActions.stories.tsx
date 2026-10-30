import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "../DropdownMenu/DropdownMenu";
import { ChevronDownIcon } from "../Icons/ChevronDownIcon";
import { SettingsIcon } from "../Icons/SettingsIcon";
import { TableTabActionButton, TableTabActionSearch, TableTabActions } from "./TableTabActions";

const meta = {
  title: "Components/TableTabActions",
  component: TableTabActions,
  parameters: {
    layout: "padded",
    design: {
      type: "figma",
      url: "https://www.figma.com/design/23x2vofTPkLpbcJyRdDa55?node-id=8906-36783",
    },
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="w-[480px] max-w-full">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof TableTabActions>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { "aria-label": "Table actions", children: null },
  render: (args) => (
    <TableTabActions {...args}>
      <TableTabActionSearch />
      <TableTabActionButton rightIcon={<SettingsIcon />}>Filter</TableTabActionButton>
      <TableTabActionButton rightIcon={<ChevronDownIcon />}>Sort By</TableTabActionButton>
    </TableTabActions>
  ),
};

export const WithMenus: Story = {
  args: { "aria-label": "Table actions", children: null },
  render: function WithMenus(args) {
    const [sort, setSort] = useState("newest");
    return (
      <TableTabActions {...args}>
        <TableTabActionSearch />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <TableTabActionButton rightIcon={<ChevronDownIcon />}>Sort By</TableTabActionButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuRadioGroup value={sort} onValueChange={setSort}>
              <DropdownMenuRadioItem value="newest">Newest</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="oldest">Oldest</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableTabActions>
    );
  },
};

export const SearchOnly: Story = {
  args: { "aria-label": "Table actions", children: null },
  render: (args) => (
    <TableTabActions {...args}>
      <TableTabActionSearch />
    </TableTabActions>
  ),
};

export const Positions: Story = {
  args: { "aria-label": "Button positions", children: null },
  render: (args) => (
    <div className="flex flex-col gap-4">
      <TableTabActions {...args} className="w-auto">
        <TableTabActionButton position="solo" rightIcon={<ChevronDownIcon />}>
          Solo
        </TableTabActionButton>
      </TableTabActions>
      <TableTabActions {...args} className="w-auto gap-0">
        <TableTabActionButton position="left" rightIcon={<ChevronDownIcon />}>
          Left
        </TableTabActionButton>
        <TableTabActionButton position="right" rightIcon={<ChevronDownIcon />}>
          Right
        </TableTabActionButton>
      </TableTabActions>
    </div>
  ),
};

export const Statuses: Story = {
  args: { "aria-label": "Button statuses", children: null },
  render: (args) => (
    <TableTabActions {...args} className="w-auto">
      <TableTabActionButton status="placeholder" rightIcon={<ChevronDownIcon />}>
        Placeholder
      </TableTabActionButton>
      <TableTabActionButton status="highlight" rightIcon={<ChevronDownIcon />}>
        Highlight
      </TableTabActionButton>
      <TableTabActionButton status="filled" rightIcon={<ChevronDownIcon />}>
        Filled
      </TableTabActionButton>
    </TableTabActions>
  ),
};
