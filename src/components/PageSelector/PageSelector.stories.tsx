import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { PageSelector } from "./PageSelector";

const meta = {
  title: "Components/PageSelector",
  component: PageSelector,
  parameters: {
    layout: "centered",
    design: {
      type: "figma",
      url: "https://www.figma.com/design/fDlJj7bf7KXQlibPoujgaC/Creator---AI-Features?node-id=6267-38772&m=dev",
    },
  },
  tags: ["autodocs"],
  argTypes: {
    totalPages: {
      control: { type: "number", min: 1 },
    },
    currentPage: {
      control: { type: "number", min: 1 },
    },
    loop: {
      control: "boolean",
    },
    disabled: {
      control: "boolean",
    },
  },
} satisfies Meta<typeof PageSelector>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    totalPages: 3,
    currentPage: 1,
  },
};

export const MiddlePage: Story = {
  args: {
    totalPages: 3,
    currentPage: 2,
  },
};

export const Looping: Story = {
  args: {
    totalPages: 3,
    currentPage: 1,
    loop: true,
  },
};

export const Disabled: Story = {
  args: {
    totalPages: 3,
    currentPage: 2,
    disabled: true,
  },
};

export const CustomLabel: Story = {
  args: {
    totalPages: 5,
    currentPage: 2,
    formatLabel: (current, total) => `Page ${current} / ${total}`,
  },
};

export const Interactive: Story = {
  args: {
    totalPages: 3,
    currentPage: 1,
  },
  render: function InteractiveRender() {
    const [page, setPage] = useState(1);
    return <PageSelector totalPages={3} currentPage={page} onPageChange={setPage} />;
  },
};
