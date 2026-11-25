import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { ChevronDownIcon } from "../Icons/ChevronDownIcon";
import { TagIcon } from "../Icons/TagIcon";
import { TableToolbarAction } from "../Table/Table";
import { FilterMenu, type FilterMenuOption } from "./FilterMenu";

const PLATFORMS: FilterMenuOption[] = [
  { value: "instagram", label: "Instagram" },
  { value: "youtube", label: "YouTube" },
  { value: "tagged", label: "Tagged links", icon: <TagIcon /> },
];

const meta = {
  title: "Components/FilterMenu",
  component: FilterMenu,
  parameters: {
    layout: "centered",
    design: {
      type: "figma",
      url: "https://www.figma.com/design/S8zFdcOjt4qN4PrwntuCdt/Fanvue-Library?node-id=17245-2317",
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof FilterMenu>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    options: PLATFORMS,
    value: ["instagram"],
    onValueChange: () => {},
    children: (
      <TableToolbarAction icon={<ChevronDownIcon size={16} />}>Platform</TableToolbarAction>
    ),
  },
  render: function FilterMenuStory(args) {
    const [value, setValue] = React.useState(args.value);
    return (
      <FilterMenu
        options={args.options}
        value={value}
        onValueChange={setValue}
        contentProps={{ "aria-label": "Platform" }}
      >
        {args.children}
      </FilterMenu>
    );
  },
};
