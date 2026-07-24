import type { Meta, StoryObj } from "@storybook/react";
import { IconButton } from "../IconButton/IconButton";
import { CopyIcon } from "../Icons/CopyIcon";
import { EditIcon } from "../Icons/EditIcon";
import { ForwardIcon } from "../Icons/ForwardIcon";
import { HeartIcon } from "../Icons/HeartIcon";
import { PauseIcon } from "../Icons/PauseIcon";
import { PlayIcon } from "../Icons/PlayIcon";
import { RepeatIcon } from "../Icons/RepeatIcon";
import { ReplyIcon } from "../Icons/ReplyIcon";
import { ShareIcon } from "../Icons/ShareIcon";
import { TrashBinIcon } from "../Icons/TrashBinIcon";
import { ButtonIconGroup } from "./ButtonIconGroup";

const meta = {
  title: "Components/ButtonIconGroup",
  component: ButtonIconGroup,
  parameters: {
    layout: "centered",
    design: {
      type: "figma",
      url: "https://www.figma.com/design/S8zFdcOjt4qN4PrwntuCdt/Fanvue-Library?node-id=17522-11290",
    },
  },
  tags: ["autodocs"],
  argTypes: {
    orientation: {
      control: "radio",
      options: ["horizontal", "vertical"],
    },
  },
} satisfies Meta<typeof ButtonIconGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    "aria-label": "Post actions",
    children: [
      <IconButton key="like" variant="tertiary" size="48" icon={<HeartIcon />} aria-label="Like" />,
      <IconButton
        key="reply"
        variant="tertiary"
        size="48"
        icon={<ReplyIcon />}
        aria-label="Reply"
      />,
      <IconButton
        key="share"
        variant="tertiary"
        size="48"
        icon={<ShareIcon />}
        aria-label="Share"
      />,
    ],
  },
};

export const MediaControls: Story = {
  args: {
    "aria-label": "Media controls",
    children: [
      <IconButton key="play" variant="tertiary" size="48" icon={<PlayIcon />} aria-label="Play" />,
      <IconButton
        key="pause"
        variant="tertiary"
        size="48"
        icon={<PauseIcon />}
        aria-label="Pause"
      />,
      <IconButton
        key="forward"
        variant="tertiary"
        size="48"
        icon={<ForwardIcon />}
        aria-label="Skip forward"
      />,
      <IconButton
        key="repeat"
        variant="tertiary"
        size="48"
        icon={<RepeatIcon />}
        aria-label="Repeat"
      />,
    ],
  },
};

export const EditingTools: Story = {
  args: {
    "aria-label": "Editing tools",
    children: [
      <IconButton key="edit" variant="tertiary" size="48" icon={<EditIcon />} aria-label="Edit" />,
      <IconButton key="copy" variant="tertiary" size="48" icon={<CopyIcon />} aria-label="Copy" />,
      <IconButton
        key="delete"
        variant="tertiary"
        size="48"
        icon={<TrashBinIcon />}
        aria-label="Delete"
      />,
    ],
  },
};

export const SecondaryVariant: Story = {
  args: {
    "aria-label": "Post actions",
    children: [
      <IconButton
        key="like"
        variant="secondary"
        size="40"
        icon={<HeartIcon />}
        aria-label="Like"
      />,
      <IconButton
        key="reply"
        variant="secondary"
        size="40"
        icon={<ReplyIcon />}
        aria-label="Reply"
      />,
      <IconButton
        key="share"
        variant="secondary"
        size="40"
        icon={<ShareIcon />}
        aria-label="Share"
      />,
    ],
  },
};

export const Vertical: Story = {
  args: {
    orientation: "vertical",
    "aria-label": "Media controls",
    children: [
      <IconButton key="play" variant="tertiary" size="48" icon={<PlayIcon />} aria-label="Play" />,
      <IconButton
        key="pause"
        variant="tertiary"
        size="48"
        icon={<PauseIcon />}
        aria-label="Pause"
      />,
      <IconButton
        key="forward"
        variant="tertiary"
        size="48"
        icon={<ForwardIcon />}
        aria-label="Skip forward"
      />,
    ],
  },
};

export const Disabled: Story = {
  args: {
    "aria-label": "Editing tools",
    children: [
      <IconButton
        key="edit"
        variant="tertiary"
        size="48"
        icon={<EditIcon />}
        aria-label="Edit"
        disabled
      />,
      <IconButton
        key="copy"
        variant="tertiary"
        size="48"
        icon={<CopyIcon />}
        aria-label="Copy"
        disabled
      />,
      <IconButton
        key="delete"
        variant="tertiary"
        size="48"
        icon={<TrashBinIcon />}
        aria-label="Delete"
        disabled
      />,
    ],
  },
};
