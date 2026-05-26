import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { userEvent, within } from "storybook/test";
import { Button } from "../Button/Button";
import { EditIcon } from "../Icons/EditIcon";
import { StarIcon } from "../Icons/StarIcon";
import { TrashBinIcon } from "../Icons/TrashBinIcon";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuHeader,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./DropdownMenu";

const meta = {
  title: "Components/DropdownMenu",
  component: DropdownMenuContent,
  parameters: {
    layout: "centered",
    design: {
      type: "figma",
      url: "https://www.figma.com/design/S8zFdcOjt4qN4PrwntuCdt/Fanvue-Library?node-id=16804-78529",
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof DropdownMenuContent>;

export default meta;
type Story = StoryObj<typeof meta>;

const openMenu: Story["play"] = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  const buttons = canvas.getAllByRole("button");
  await userEvent.click(buttons[0] as HTMLElement);
};

export const Default: Story = {
  play: openMenu,
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button>Open Menu</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>Option 1</DropdownMenuItem>
        <DropdownMenuItem>Option 2</DropdownMenuItem>
        <DropdownMenuItem>Option 3</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

export const WithIcons: Story = {
  play: openMenu,
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button>Open Menu</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem leadingIcon={<EditIcon />}>Edit</DropdownMenuItem>
        <DropdownMenuItem leadingIcon={<StarIcon />}>Favourite</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

export const WithGroupsAndLabels: Story = {
  play: openMenu,
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button>Open Menu</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuGroup>
          <DropdownMenuLabel position="top">Actions</DropdownMenuLabel>
          <DropdownMenuItem leadingIcon={<EditIcon />}>Edit</DropdownMenuItem>
          <DropdownMenuItem leadingIcon={<StarIcon />}>Favourite</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuGroup>
          <DropdownMenuLabel>Danger zone</DropdownMenuLabel>
          <DropdownMenuItem destructive leadingIcon={<TrashBinIcon />}>
            Delete
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

export const WithSeparator: Story = {
  play: openMenu,
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button>Open Menu</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>Rename</DropdownMenuItem>
        <DropdownMenuItem>Duplicate</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem destructive leadingIcon={<TrashBinIcon />}>
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

export const WithDisabledItems: Story = {
  play: openMenu,
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button>Open Menu</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>Enabled</DropdownMenuItem>
        <DropdownMenuItem disabled>Disabled</DropdownMenuItem>
        <DropdownMenuItem>Also enabled</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

export const AsChildLink: Story = {
  play: openMenu,
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button>Open Menu</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem asChild>
          <a href="#settings">Settings</a>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <a href="#profile">Profile</a>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

export const Size32: Story = {
  play: openMenu,
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="32">Open Menu</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem size="32" leadingIcon={<EditIcon />}>
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem size="32" leadingIcon={<StarIcon />}>
          Favourite
        </DropdownMenuItem>
        <DropdownMenuItem size="32" selected>
          Selected
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

export const WithHeader: Story = {
  play: openMenu,
  render: () => {
    const Demo = () => {
      const [open, setOpen] = React.useState(false);
      return (
        <DropdownMenu open={open} onOpenChange={setOpen}>
          <DropdownMenuTrigger asChild>
            <Button>Sort by</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-72">
            <DropdownMenuHeader title="Sort by" onClose={() => setOpen(false)} />
            <DropdownMenuItem>Newest first</DropdownMenuItem>
            <DropdownMenuItem>Oldest first</DropdownMenuItem>
            <DropdownMenuItem>Most popular</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    };
    return <Demo />;
  },
};

export const WithSearchHeader: Story = {
  play: openMenu,
  render: () => {
    const Demo = () => {
      const [open, setOpen] = React.useState(false);
      const [query, setQuery] = React.useState("");
      const items = ["Alice", "Bob", "Charlie", "Diana", "Edward", "Fiona"];
      const filtered = items.filter((name) => name.toLowerCase().includes(query.toLowerCase()));
      return (
        <DropdownMenu open={open} onOpenChange={setOpen}>
          <DropdownMenuTrigger asChild>
            <Button>Pick a person</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-80">
            <DropdownMenuHeader
              type="search"
              searchProps={{
                value: query,
                onChange: setQuery,
                placeholder: "Search people\u2026",
              }}
              onClose={() => setOpen(false)}
            />
            {filtered.length === 0 ? (
              <DropdownMenuLabel position="top">No results</DropdownMenuLabel>
            ) : (
              filtered.map((name) => (
                <DropdownMenuItem key={name} onSelect={(event) => event.preventDefault()}>
                  {name}
                </DropdownMenuItem>
              ))
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    };
    return <Demo />;
  },
};

export const WithRadioGroup: Story = {
  play: openMenu,
  render: () => {
    const Demo = () => {
      const [sort, setSort] = React.useState("newest");
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button>Sort: {sort}</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-72">
            <DropdownMenuRadioGroup value={sort} onValueChange={setSort}>
              <DropdownMenuRadioItem value="newest" helper="Most recent first">
                Newest
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="oldest" helper="Oldest first">
                Oldest
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="popular" helper="By engagement">
                Most popular
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="locked" disabled helper="Requires Pro plan">
                Custom order
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    };
    return <Demo />;
  },
};

export const SizeMatrix: Story = {
  play: openMenu,
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button>Open Menu</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-72">
        <DropdownMenuLabel position="top">Size 40</DropdownMenuLabel>
        <DropdownMenuItem size="40">Default</DropdownMenuItem>
        <DropdownMenuItem size="40" selected>
          Selected
        </DropdownMenuItem>
        <DropdownMenuItem size="40" disabled>
          Disabled
        </DropdownMenuItem>
        <DropdownMenuItem size="40" destructive>
          Error
        </DropdownMenuItem>
        <DropdownMenuLabel>Size 32</DropdownMenuLabel>
        <DropdownMenuItem size="32">Default</DropdownMenuItem>
        <DropdownMenuItem size="32" selected>
          Selected
        </DropdownMenuItem>
        <DropdownMenuItem size="32" disabled>
          Disabled
        </DropdownMenuItem>
        <DropdownMenuItem size="32" destructive>
          Error
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

export const AllStatesV2: Story = {
  play: openMenu,
  render: () => {
    const Demo = () => {
      const [selectedRadio, setSelectedRadio] = React.useState("two");
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button>Open Menu</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-80">
            <DropdownMenuHeader title="Account" />
            <DropdownMenuItem leadingIcon={<EditIcon />}>Edit profile</DropdownMenuItem>
            <DropdownMenuItem leadingIcon={<StarIcon />} selected>
              Favourited
            </DropdownMenuItem>
            <DropdownMenuItem disabled>Pending review</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Preferences</DropdownMenuLabel>
            <DropdownMenuRadioGroup value={selectedRadio} onValueChange={setSelectedRadio}>
              <DropdownMenuRadioItem value="one" helper="Show me less">
                Quiet mode
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="two" helper="Default">
                Balanced
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="three" helper="Show me everything">
                All updates
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem destructive leadingIcon={<TrashBinIcon />}>
              Delete account
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    };
    return <Demo />;
  },
};
