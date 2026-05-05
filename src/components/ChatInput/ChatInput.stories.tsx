import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { AIIcon } from "../Icons/AIIcon";
import { BulbIcon } from "../Icons/BulbIcon";
import { ChatInput } from "./ChatInput";

const SELECT_OPTIONS = [
  { value: "fanvue-ai", label: "Fanvue AI", icon: <AIIcon className="size-4" /> },
  { value: "example", label: "Example", icon: <BulbIcon className="size-4" /> },
];

const meta = {
  title: "Components/ChatInput",
  component: ChatInput,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    placeholder: { control: "text" },
    disabled: { control: "boolean" },
    loading: { control: "boolean" },
    showFileButton: { control: "boolean" },
    minRows: { control: "number" },
    maxRows: { control: "number" },
    maxLength: { control: "number" },
  },
  decorators: [
    (Story) => (
      <div style={{ width: "600px" }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ChatInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: "Type a message...",
  },
};

export const WithPlaceholder: Story = {
  args: {
    placeholder: "Ask the Creator Agent...",
  },
};

export const Disabled: Story = {
  args: {
    placeholder: "Type a message...",
    disabled: true,
    value: "This input is disabled",
  },
};

export const Loading: Story = {
  args: {
    placeholder: "Type a message...",
    loading: true,
    value: "Waiting for response...",
  },
};

export const WithFileButton: Story = {
  args: {
    placeholder: "Type a message...",
    showFileButton: true,
  },
};

export const WithModelSelector: Story = {
  render: () => {
    const [model, setModel] = useState("fanvue-ai");

    return (
      <ChatInput
        placeholder="Type a message..."
        selectOptions={SELECT_OPTIONS}
        selectValue={model}
        onSelectChange={setModel}
      />
    );
  },
};

export const WithFileButtonAndModelSelector: Story = {
  render: () => {
    const [model, setModel] = useState("fanvue-ai");

    return (
      <ChatInput
        placeholder="Type a message..."
        showFileButton
        selectOptions={SELECT_OPTIONS}
        selectValue={model}
        onSelectChange={setModel}
      />
    );
  },
};

export const WithAttachments: Story = {
  render: () => {
    const [attachments, setAttachments] = useState<
      { id: string; src: string; ariaLabel: string }[]
    >([
      {
        id: "a",
        src: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=128&h=128&fit=crop",
        ariaLabel: "Attachment preview one",
      },
      {
        id: "b",
        src: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=128&h=128&fit=crop",
        ariaLabel: "Attachment preview two",
      },
    ]);

    return (
      <ChatInput
        placeholder="Type a message..."
        showFileButton
        onFileClick={() =>
          setAttachments((prev) => [
            ...prev,
            {
              id: crypto.randomUUID(),
              src: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=128&h=128&fit=crop",
              ariaLabel: "New attachment",
            },
          ])
        }
        attachments={attachments}
        onAttachmentRemove={(id) => setAttachments((prev) => prev.filter((x) => x.id !== id))}
      />
    );
  },
};

export const WithAttachmentsAndModelSelector: Story = {
  render: () => {
    const [model, setModel] = useState("fanvue-ai");
    const [attachments, setAttachments] = useState<
      { id: string; src: string; ariaLabel: string }[]
    >([
      {
        id: "a",
        src: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=128&h=128&fit=crop",
        ariaLabel: "Attachment preview one",
      },
    ]);

    return (
      <ChatInput
        placeholder="Type a message..."
        showFileButton
        onFileClick={() =>
          setAttachments((prev) => [
            ...prev,
            {
              id: crypto.randomUUID(),
              src: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=128&h=128&fit=crop",
              ariaLabel: "New attachment",
            },
          ])
        }
        attachments={attachments}
        onAttachmentRemove={(id) => setAttachments((prev) => prev.filter((x) => x.id !== id))}
        selectOptions={SELECT_OPTIONS}
        selectValue={model}
        onSelectChange={setModel}
      />
    );
  },
};

export const WithCustomAttachmentPreviews: Story = {
  args: {
    placeholder: "Type a message...",
    attachmentPreviews: (
      <div className="typography-regular-body-md shrink-0 rounded-sm border border-dashed border-border-primary px-3 py-2 text-content-secondary">
        Custom preview slot
      </div>
    ),
  },
};

export const WithCustomToolbarRight: Story = {
  args: {
    placeholder: "Type a message...",
    toolbarRight: (
      <span className="typography-regular-body-md px-2 text-content-secondary">Custom</span>
    ),
  },
};

export const WithMaxLength: Story = {
  args: {
    placeholder: "Max 100 characters...",
    maxLength: 100,
  },
};

export const WithMultipleRows: Story = {
  args: {
    placeholder: "Type a message...",
    minRows: 3,
    maxRows: 8,
  },
};

export const Controlled: Story = {
  render: () => {
    const [value, setValue] = useState("");
    const [messages, setMessages] = useState<{ id: string; text: string }[]>([]);

    return (
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2 rounded-lg border border-neutral-alphas-200 p-4">
          {messages.length === 0 && (
            <p className="typography-regular-body-md text-content-secondary">
              No messages yet. Try sending one!
            </p>
          )}
          {messages.map((msg) => (
            <div
              key={msg.id}
              className="typography-regular-body-md rounded-lg bg-neutral-alphas-50 px-3 py-2"
            >
              {msg.text}
            </div>
          ))}
        </div>
        <ChatInput
          placeholder="Type a message..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onSubmit={(text) => {
            setMessages((prev) => [...prev, { id: crypto.randomUUID(), text }]);
            setValue("");
          }}
        />
      </div>
    );
  },
};

export const FullFeature: Story = {
  render: () => {
    const [value, setValue] = useState("");
    const [model, setModel] = useState("fanvue-ai");
    const [fileHint, setFileHint] = useState<string | null>(null);

    return (
      <div className="flex w-full flex-col gap-2">
        <ChatInput
          placeholder="Ask the Creator Agent..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onSubmit={() => setValue("")}
          showFileButton
          onFileClick={() => setFileHint("Attach tapped.")}
          selectOptions={SELECT_OPTIONS}
          selectValue={model}
          onSelectChange={setModel}
        />
        {fileHint ? (
          <output className="typography-regular-body-sm px-1 text-content-secondary">
            {fileHint}
          </output>
        ) : null}
      </div>
    );
  },
};
