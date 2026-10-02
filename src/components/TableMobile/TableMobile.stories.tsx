import type { Meta, StoryObj } from "@storybook/react";
import { Avatar } from "../Avatar/Avatar";
import { Checkbox } from "../Checkbox/Checkbox";
import { IconButton } from "../IconButton/IconButton";
import { ChevronDownIcon } from "../Icons/ChevronDownIcon";
import { ChevronRightIcon } from "../Icons/ChevronRightIcon";
import { StarIcon } from "../Icons/StarIcon";
import { Pill } from "../Pill/Pill";
import { TableMobileField, TableMobileList, TableMobileRow } from "./TableMobile";

const AVATAR_SRC =
  "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=80&h=80&fit=crop";

const meta = {
  title: "Components/TableMobile",
  component: TableMobileRow,
  parameters: {
    layout: "padded",
    design: {
      type: "figma",
      url: "https://www.figma.com/design/S8zFdcOjt4qN4PrwntuCdt/Fanvue-Library?node-id=21310-4905",
    },
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="w-[361px] max-w-full">
        <TableMobileList aria-label="Rows">
          <Story />
        </TableMobileList>
      </div>
    ),
  ],
  argTypes: {
    labelPosition: { control: "inline-radio", options: ["below", "above"] },
  },
} satisfies Meta<typeof TableMobileRow>;

export default meta;
type Story = StoryObj<typeof meta>;

const secondaryFields = (
  <>
    <TableMobileField label="Secondary" value="Sub Content" />
    <TableMobileField label="Secondary" value="Sub Content" />
    <TableMobileField label="Secondary" value="Sub Content" />
  </>
);

const openButton = (
  <IconButton variant="secondary" size="24" icon={<ChevronRightIcon />} aria-label="Open row" />
);

export const Default: Story = {
  args: {
    header: <Pill variant="green">Active</Pill>,
    actions: (
      <>
        <IconButton variant="tertiary" size="24" icon={<StarIcon />} aria-label="Favourite" />
        {openButton}
      </>
    ),
    title: "Main Content of the Table",
    label: "Primary",
    children: secondaryFields,
  },
};

export const BaseText: Story = {
  args: {
    header: <Pill variant="green">Active</Pill>,
    actions: openButton,
    title: "Main Content of the Table",
    label: "Primary",
    labelPosition: "above",
    children: secondaryFields,
  },
};

export const WithImage: Story = {
  args: {
    header: <Pill variant="green">Active</Pill>,
    actions: openButton,
    media: (
      <>
        <img
          alt=""
          className="size-10 rounded-sm bg-neutral-alphas-200 object-cover"
          src={AVATAR_SRC}
        />
        <ChevronDownIcon className="size-4 text-content-primary" aria-hidden />
      </>
    ),
    title: "Main Content of the Table",
    label: "Primary",
    labelPosition: "above",
    children: secondaryFields,
  },
};

export const WithAvatar: Story = {
  name: "Avatar",
  args: {
    actions: <Checkbox aria-label="Select Jane Doe" />,
    media: <Avatar src={AVATAR_SRC} alt="" fallback="JD" size={40} />,
    title: "Jane Doe",
    label: "@jane_doe",
    children: (
      <>
        <TableMobileField label="Status" value={<Pill variant="green">Subscriber</Pill>} />
        <TableMobileField label="Spend" value="$120.00" />
        <TableMobileField label="Last Active" value="2d ago" />
      </>
    ),
  },
};
