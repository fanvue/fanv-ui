import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { PlusIcon } from "../Icons/PlusIcon";
import { InlineEdit } from "./InlineEdit";

const meta = {
  title: "Components/InlineEdit",
  component: InlineEdit,
  parameters: {
    layout: "centered",
    design: {
      type: "figma",
      url: "https://www.figma.com/design/S8zFdcOjt4qN4PrwntuCdt/Fanvue-Library?node-id=17354-271&m=dev",
    },
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["32", "40"],
    },
    disabled: { control: "boolean" },
  },
} satisfies Meta<typeof InlineEdit>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: "New folder",
    onSubmit: () => {},
  },
  render: (args) => {
    const [value, setValue] = useState(args.value);
    return <InlineEdit {...args} value={value} onSubmit={setValue} />;
  },
};

export const Size32: Story = {
  args: {
    size: "32",
    value: "Inbox folder",
    onSubmit: () => {},
  },
  render: (args) => {
    const [value, setValue] = useState(args.value);
    return <InlineEdit {...args} value={value} onSubmit={setValue} />;
  },
};

export const Size40: Story = {
  args: {
    size: "40",
    value: "Inbox folder",
    onSubmit: () => {},
  },
  render: (args) => {
    const [value, setValue] = useState(args.value);
    return <InlineEdit {...args} value={value} onSubmit={setValue} />;
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    value: "Locked folder",
    onSubmit: () => {},
  },
};

export const WithLeftIcon: Story = {
  args: {
    value: "New folder",
    onSubmit: () => {},
    leftIcon: <PlusIcon className="size-4" />,
  },
  render: (args) => {
    const [value, setValue] = useState(args.value);
    return <InlineEdit {...args} value={value} onSubmit={setValue} />;
  },
};

export const WithMaxLength: Story = {
  args: {
    value: "Folder",
    onSubmit: () => {},
    maxLength: 20,
  },
  render: (args) => {
    const [value, setValue] = useState(args.value);
    return <InlineEdit {...args} value={value} onSubmit={setValue} />;
  },
};

export const InAList: Story = {
  args: {
    value: "",
    onSubmit: () => {},
  },
  render: () => {
    const [folders, setFolders] = useState([
      { id: "inbox", name: "Inbox" },
      { id: "drafts", name: "Drafts" },
      { id: "sent", name: "Sent" },
    ]);
    return (
      <div className="flex flex-wrap gap-2">
        {folders.map((folder) => (
          <InlineEdit
            key={folder.id}
            value={folder.name}
            onSubmit={(next) =>
              setFolders((prev) =>
                prev.map((current) =>
                  current.id === folder.id ? { ...current, name: next } : current,
                ),
              )
            }
          />
        ))}
      </div>
    );
  },
};
