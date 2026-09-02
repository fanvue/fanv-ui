import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { userEvent, within } from "storybook/test";
import { Avatar } from "../Avatar/Avatar";
import { Button } from "../Button/Button";
import { IconButton } from "../IconButton/IconButton";
import { ChevronRightIcon } from "../Icons/ChevronRightIcon";
import { EditIcon } from "../Icons/EditIcon";
import { MoreIcon } from "../Icons/MoreIcon";
import { PlusIcon } from "../Icons/PlusIcon";
import { SearchIcon } from "../Icons/SearchIcon";
import { StarIcon } from "../Icons/StarIcon";
import { TranscationArrowIcon } from "../Icons/TranscationArrowIcon";
import { TrashBinIcon } from "../Icons/TrashBinIcon";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuHeader,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuReorderGroup,
  DropdownMenuReorderItem,
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

export const CreatorMultiSelect: Story = {
  name: "Creator multi-select (search + avatars)",
  parameters: {
    design: {
      type: "figma",
      url: "https://www.figma.com/design/23x2vofTPkLpbcJyRdDa55/Creator---Management%E2%80%A8--Teams?node-id=7393-62008",
    },
  },
  play: openMenu,
  render: () => {
    const Demo = () => {
      // Starts closed so `play` can open it: a modal Radix menu aria-hides the
      // rest of the canvas, which would leave the trigger unqueryable.
      const [open, setOpen] = React.useState(false);
      const [query, setQuery] = React.useState("");
      const [selected, setSelected] = React.useState(
        new Set(["@sofiabloom", "@aria.lane", "@novaknight", "@miarivers", "@lunavale"]),
      );
      const creators = ["@sofiabloom", "@aria.lane", "@novaknight", "@miarivers", "@lunavale"];
      const filtered = creators.filter((handle) =>
        handle.toLowerCase().includes(query.toLowerCase()),
      );
      const toggle = (handle: string) =>
        setSelected((prev) => {
          const next = new Set(prev);
          if (next.has(handle)) {
            next.delete(handle);
          } else {
            next.add(handle);
          }
          return next;
        });
      return (
        <DropdownMenu open={open} onOpenChange={setOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary">All Creators</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-72">
            <DropdownMenuHeader
              type="search"
              showClose={false}
              searchProps={{
                value: query,
                onChange: setQuery,
                placeholder: "Search\u2026",
              }}
            />
            {filtered.length === 0 ? (
              <DropdownMenuLabel position="top">No results</DropdownMenuLabel>
            ) : (
              filtered.map((handle) => (
                <DropdownMenuCheckboxItem
                  key={handle}
                  checked={selected.has(handle)}
                  onCheckedChange={() => toggle(handle)}
                  onSelect={(event) => event.preventDefault()}
                  avatar={<Avatar size={32} fallback={handle.slice(1, 3).toUpperCase()} />}
                >
                  {handle}
                </DropdownMenuCheckboxItem>
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

export const FeatureItems: Story = {
  play: openMenu,
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button>Open Menu</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80">
        <DropdownMenuItem
          avatar={<Avatar size={24} fallback="JD" />}
          trailingIcon={<ChevronRightIcon />}
        >
          Jane Doe
        </DropdownMenuItem>
        <DropdownMenuItem
          avatar={<Avatar size={24} fallback="AS" />}
          description="Product designer"
          count="12"
        >
          Alex Smith
        </DropdownMenuItem>
        <DropdownMenuItem leadingIcon={<StarIcon />} count="99+">
          Favourites
        </DropdownMenuItem>
        <DropdownMenuItem leadingIcon={<EditIcon />} description="Update your details">
          Edit profile
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

export const FeatureItemStates: Story = {
  play: openMenu,
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button>Open Menu</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80">
        <DropdownMenuLabel position="top">Size 40</DropdownMenuLabel>
        <DropdownMenuItem avatar={<Avatar size={24} fallback="JD" />} count="3">
          Default
        </DropdownMenuItem>
        <DropdownMenuItem avatar={<Avatar size={24} fallback="JD" />} count="3" selected>
          Selected
        </DropdownMenuItem>
        <DropdownMenuItem avatar={<Avatar size={24} fallback="JD" />} count="3" disabled>
          Disabled
        </DropdownMenuItem>
        <DropdownMenuItem leadingIcon={<TrashBinIcon />} count="3" destructive>
          Error
        </DropdownMenuItem>
        <DropdownMenuLabel>Size 32</DropdownMenuLabel>
        <DropdownMenuItem size="32" avatar={<Avatar size={24} fallback="JD" />} count="3">
          Default
        </DropdownMenuItem>
        <DropdownMenuItem size="32" leadingIcon={<StarIcon />} count="3" selected>
          Selected
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

const VAULT_FOLDERS = [
  "AI Images",
  "Clean Photos",
  "Wallposts",
  "Convo Starters",
  "PTVs",
  "Crop Tee Set \u{1F339}",
];

export const Reorderable: Story = {
  parameters: {
    design: {
      type: "figma",
      url: "https://www.figma.com/design/LB9q4XzCNlbOaeW3xN6tQo/Creator---Content---Creation?node-id=4841-35891",
    },
  },
  play: openMenu,
  render: () => {
    const Demo = () => {
      const [open, setOpen] = React.useState(false);
      const [items, setItems] = React.useState(VAULT_FOLDERS);
      return (
        <DropdownMenu open={open} onOpenChange={setOpen}>
          <DropdownMenuTrigger asChild>
            <Button>Reorder folders</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-60 rounded-lg border-border-strong">
            <DropdownMenuHeader
              title="All Folders"
              showClose={false}
              actions={
                <Button size="32" onClick={() => setOpen(false)}>
                  Done
                </Button>
              }
            />
            <DropdownMenuReorderGroup
              values={items}
              onReorder={setItems}
              aria-label="Reorder folders"
            >
              {items.map((item) => (
                <DropdownMenuReorderItem
                  key={item}
                  value={item}
                  dragHandleLabel={`Reorder ${item}`}
                >
                  {item}
                </DropdownMenuReorderItem>
              ))}
            </DropdownMenuReorderGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    };
    return <Demo />;
  },
};

export const ReorderableScrolling: Story = {
  play: openMenu,
  render: () => {
    const Demo = () => {
      const [open, setOpen] = React.useState(false);
      const [items, setItems] = React.useState(
        Array.from({ length: 15 }, (_, index) => `Folder ${index + 1}`),
      );
      return (
        <DropdownMenu open={open} onOpenChange={setOpen}>
          <DropdownMenuTrigger asChild>
            <Button>Reorder long list</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="max-h-80 w-60 rounded-lg border-border-strong">
            <DropdownMenuHeader
              title="Folders"
              showClose={false}
              actions={
                <Button size="32" onClick={() => setOpen(false)}>
                  Done
                </Button>
              }
            />
            <DropdownMenuReorderGroup
              values={items}
              onReorder={setItems}
              aria-label="Reorder folders"
            >
              {items.map((item) => (
                <DropdownMenuReorderItem
                  key={item}
                  value={item}
                  dragHandleLabel={`Reorder ${item}`}
                >
                  {item}
                </DropdownMenuReorderItem>
              ))}
            </DropdownMenuReorderGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    };
    return <Demo />;
  },
};

export const VaultFolders: Story = {
  name: "Vault folders (actions + reorganise)",
  parameters: {
    design: {
      type: "figma",
      url: "https://www.figma.com/design/S8zFdcOjt4qN4PrwntuCdt/Fanvue-Library?node-id=16804-84593",
    },
  },
  play: openMenu,
  render: () => {
    const Demo = () => {
      const [open, setOpen] = React.useState(false);
      const [mode, setMode] = React.useState<"browse" | "reorganise">("browse");
      const [folders, setFolders] = React.useState(VAULT_FOLDERS);
      const [actionsFor, setActionsFor] = React.useState<string | null>(null);
      const handleOpenChange = (nextOpen: boolean) => {
        setOpen(nextOpen);
        if (!nextOpen) {
          setMode("browse");
          setActionsFor(null);
        }
      };
      return (
        <DropdownMenu open={open} onOpenChange={handleOpenChange} modal={false}>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary">All Folders</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            className="w-60 rounded-lg"
            onInteractOutside={(event) => {
              if (actionsFor !== null) event.preventDefault();
            }}
          >
            {mode === "browse" ? (
              <>
                <DropdownMenuHeader
                  title="All Folders"
                  showClose={false}
                  actions={
                    <>
                      <IconButton
                        variant="tertiary"
                        size="32"
                        icon={<SearchIcon />}
                        aria-label="Search folders"
                      />
                      <IconButton
                        variant="tertiary"
                        size="32"
                        icon={<PlusIcon />}
                        aria-label="New folder"
                      />
                    </>
                  }
                />
                {folders.map((folder) => (
                  <DropdownMenuItem
                    key={folder}
                    size="32"
                    className="min-h-10 py-2"
                    onSelect={(event) => {
                      if (actionsFor !== null) event.preventDefault();
                    }}
                    trailingIcon={
                      <DropdownMenu
                        open={actionsFor === folder}
                        onOpenChange={(nextOpen) => setActionsFor(nextOpen ? folder : null)}
                      >
                        <DropdownMenuTrigger asChild>
                          <IconButton
                            variant="tertiary"
                            size="24"
                            icon={<MoreIcon />}
                            aria-label={`${folder} actions`}
                            className="data-[state=open]:bg-buttons-tertiary-hover"
                            onPointerDown={(event) => event.stopPropagation()}
                            onClick={(event) => event.stopPropagation()}
                          />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          side="right"
                          align="start"
                          sideOffset={12}
                          className="rounded-lg"
                        >
                          <DropdownMenuItem
                            size="32"
                            className="min-h-10 py-2"
                            leadingIcon={<EditIcon className="size-4" />}
                          >
                            Rename
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            size="32"
                            className="min-h-10 py-2"
                            leadingIcon={<TranscationArrowIcon className="size-4" />}
                            onSelect={() => {
                              setActionsFor(null);
                              setMode("reorganise");
                            }}
                          >
                            Reorganise
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            size="32"
                            className="min-h-10 py-2"
                            destructive
                            leadingIcon={<TrashBinIcon className="size-4" />}
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    }
                  >
                    {folder}
                  </DropdownMenuItem>
                ))}
              </>
            ) : (
              <>
                <DropdownMenuHeader
                  title="All Folders"
                  showClose={false}
                  actions={
                    <Button size="32" onClick={() => setMode("browse")}>
                      Done
                    </Button>
                  }
                />
                <DropdownMenuReorderGroup
                  values={folders}
                  onReorder={setFolders}
                  aria-label="Reorder folders"
                >
                  {folders.map((folder) => (
                    <DropdownMenuReorderItem
                      key={folder}
                      value={folder}
                      dragHandleLabel={`Reorder ${folder}`}
                    >
                      {folder}
                    </DropdownMenuReorderItem>
                  ))}
                </DropdownMenuReorderGroup>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    };
    return <Demo />;
  },
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
