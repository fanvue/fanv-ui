import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "../Button/Button";
import { ChevronDownIcon } from "../Icons/ChevronDownIcon";
import { TableToolbarAction } from "../Table/Table";
import { Popover, PopoverClose, PopoverContent, PopoverTrigger } from "./Popover";

const meta = {
  title: "Components/Popover",
  component: Popover,
  parameters: {
    layout: "centered",
    design: {
      type: "figma",
      url: "https://www.figma.com/design/S8zFdcOjt4qN4PrwntuCdt/Fanvue-Library?node-id=17245-2317",
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Popover>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Popover {...args}>
      <PopoverTrigger asChild>
        <Button variant="secondary">Open popover</Button>
      </PopoverTrigger>
      <PopoverContent aria-label="Example">
        <div className="typography-body-small-14px-regular flex w-64 flex-col gap-2 p-2">
          <p>Any content can sit inside a popover.</p>
          <PopoverClose asChild>
            <Button variant="secondary" size="32">
              Close
            </Button>
          </PopoverClose>
        </div>
      </PopoverContent>
    </Popover>
  ),
};

/**
 * The panel as a toolbar filter uses it: open under its trigger, holding a short form with its own
 * actions. Focus is left on the page here so the snapshot shows the panel at rest; by default
 * focus moves into the panel on open.
 */
export const Open: Story = {
  args: { defaultOpen: true },
  render: (args) => (
    <Popover {...args}>
      <PopoverTrigger asChild>
        <TableToolbarAction icon={<ChevronDownIcon size={16} />}>Date</TableToolbarAction>
      </PopoverTrigger>
      <PopoverContent aria-label="Date filter" onOpenAutoFocus={(event) => event.preventDefault()}>
        <div className="flex w-64 flex-col gap-4 p-2">
          <div className="flex flex-col gap-1">
            <p className="typography-body-small-14px-semibold">Custom range</p>
            <p className="typography-description-12px-regular text-content-secondary">
              Pick a start and an end date, then apply.
            </p>
          </div>
          <div className="flex justify-end gap-2">
            <PopoverClose asChild>
              <Button variant="secondary" size="32">
                Cancel
              </Button>
            </PopoverClose>
            <PopoverClose asChild>
              <Button variant="primary" size="32">
                Apply
              </Button>
            </PopoverClose>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  ),
};

export const WithToolbarAction: Story = {
  render: (args) => (
    <Popover {...args}>
      <PopoverTrigger asChild>
        <TableToolbarAction>Filters</TableToolbarAction>
      </PopoverTrigger>
      <PopoverContent aria-label="Filters">
        <p className="typography-body-small-14px-regular w-64 p-2">Filter options go here.</p>
      </PopoverContent>
    </Popover>
  ),
};
