import type { Meta, StoryObj } from "@storybook/react";
import { ChatMessage } from "./ChatMessage";

const AVATAR = "https://i.pravatar.cc/80?img=47";

const meta = {
  title: "Components/ChatMessage",
  component: ChatMessage,
  parameters: {
    layout: "padded",
    design: {
      type: "figma",
      url: "https://www.figma.com/design/S8zFdcOjt4qN4PrwntuCdt/Fanvue-Library?node-id=18206-9841&m=dev",
    },
  },
  tags: ["autodocs"],
  argTypes: {
    user: { control: "inline-radio", options: ["sender", "receiver"] },
    variant: { control: "inline-radio", options: ["text", "typing", "audio", "deleted"] },
    status: { control: "inline-radio", options: ["delivered", "read"] },
    online: { control: "boolean" },
    showAvatar: { control: "boolean" },
  },
  decorators: [
    (Story) => (
      <div className="mx-auto w-[444px] max-w-full px-6">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ChatMessage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    user: "receiver",
    message: "Placeholder message.",
    time: "16:00",
    avatarSrc: AVATAR,
    online: true,
  },
};

export const Sender: Story = {
  args: {
    user: "sender",
    message: "Placeholder message.",
    time: "16:00",
    status: "read",
  },
};

export const LongMessage: Story = {
  args: {
    user: "receiver",
    message:
      "Hey! Just wanted to give you a quick update on everything we talked about earlier today. I've gone through all of the notes, applied the changes you suggested, and double-checked every detail. Let me know if there's anything else you'd like me to adjust before we finalise and send it over tomorrow.",
    time: "16:00",
    avatarSrc: AVATAR,
    online: true,
  },
};

export const Typing: Story = {
  args: {
    user: "receiver",
    variant: "typing",
    avatarSrc: AVATAR,
    online: true,
  },
};

export const Audio: Story = {
  args: {
    user: "sender",
    variant: "audio",
    audioDuration: "0:05",
    time: "16:00",
    status: "read",
  },
};

export const Deleted: Story = {
  args: {
    user: "receiver",
    variant: "deleted",
    time: "16:00",
    avatarSrc: AVATAR,
    online: true,
  },
};

/** Every variant, for both sender and receiver, as it appears in the design. */
export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <ChatMessage user="sender" variant="typing" />
      <ChatMessage user="receiver" variant="typing" avatarSrc={AVATAR} online />
      <ChatMessage
        user="receiver"
        message="Placeholder message."
        time="16:00"
        avatarSrc={AVATAR}
        online
      />
      <ChatMessage user="sender" message="Placeholder message." time="16:00" />
      <ChatMessage
        user="receiver"
        message="Placeholder message sits here, please change me."
        time="16:00"
        avatarSrc={AVATAR}
        online
      />
      <ChatMessage
        user="sender"
        message="Placeholder message sits here, please change me."
        time="16:00"
      />
      <ChatMessage
        user="receiver"
        variant="audio"
        audioDuration="0:05"
        time="16:00"
        avatarSrc={AVATAR}
        online
      />
      <ChatMessage user="sender" variant="audio" audioDuration="0:05" time="16:00" />
      <ChatMessage user="receiver" variant="deleted" time="16:00" avatarSrc={AVATAR} online />
      <ChatMessage user="sender" variant="deleted" time="16:00" />
    </div>
  ),
};

/** The blue read receipt shown once a sender message has been read. */
export const ReadReceipt: Story = {
  args: {
    user: "sender",
    message: "Placeholder message.",
    time: "16:00",
    status: "read",
  },
};

/** A short conversation showing grouped bubbles and avatar reservation. */
export const Conversation: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <ChatMessage
        user="receiver"
        message="Hey! Are you free later?"
        time="15:58"
        avatarSrc={AVATAR}
        online
      />
      <ChatMessage user="sender" message="Yeah, after 5." time="15:59" status="read" />
      <ChatMessage
        user="sender"
        message="Want to grab something to eat around the corner?"
        time="15:59"
        status="read"
      />
      <ChatMessage user="receiver" variant="typing" avatarSrc={AVATAR} online />
      <ChatMessage
        user="receiver"
        variant="audio"
        audioDuration="0:12"
        time="16:01"
        avatarSrc={AVATAR}
        online
      />
      <ChatMessage user="receiver" variant="deleted" time="16:02" showAvatar={false} />
      <ChatMessage
        user="sender"
        message="Perfect, see you there!"
        time="16:03"
        status="delivered"
      />
    </div>
  ),
};
