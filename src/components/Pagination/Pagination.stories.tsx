import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Pagination } from "./Pagination";

const meta = {
  title: "Components/Pagination",
  component: Pagination,
  parameters: {
    layout: "centered",
    design: {
      type: "figma",
      url: "https://www.figma.com/design/S8zFdcOjt4qN4PrwntuCdt/Fanvue-Library?node-id=2440-20778",
    },
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "dots"],
    },
    totalPages: {
      control: { type: "number", min: 1, max: 50 },
    },
    currentPage: {
      control: { type: "number", min: 1 },
    },
  },
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    totalPages: 5,
    currentPage: 2,
  },
};

export const FirstPage: Story = {
  args: {
    totalPages: 5,
    currentPage: 1,
  },
};

export const LastPage: Story = {
  args: {
    totalPages: 5,
    currentPage: 5,
  },
};

export const ManyPages: Story = {
  args: {
    totalPages: 20,
    currentPage: 10,
  },
};

export const ManyPagesStart: Story = {
  args: {
    totalPages: 20,
    currentPage: 2,
  },
};

export const ManyPagesEnd: Story = {
  args: {
    totalPages: 20,
    currentPage: 19,
  },
};

export const SinglePage: Story = {
  args: {
    totalPages: 1,
    currentPage: 1,
  },
};

export const Dots: Story = {
  args: {
    variant: "dots",
    totalPages: 15,
    currentPage: 2,
  },
};

export const DotsFirstPage: Story = {
  args: {
    variant: "dots",
    totalPages: 15,
    currentPage: 1,
  },
};

export const DotsLastPage: Story = {
  args: {
    variant: "dots",
    totalPages: 15,
    currentPage: 15,
  },
};

export const DotsFewPages: Story = {
  args: {
    variant: "dots",
    totalPages: 5,
    currentPage: 3,
  },
};

export const Interactive: Story = {
  args: {
    totalPages: 20,
    currentPage: 1,
  },
  render: (args) => {
    const [page, setPage] = useState(args.currentPage);
    return <Pagination {...args} currentPage={page} onPageChange={setPage} />;
  },
};

export const InteractiveDots: Story = {
  args: {
    variant: "dots",
    totalPages: 10,
    currentPage: 1,
  },
  render: (args) => {
    const [page, setPage] = useState(args.currentPage);
    return <Pagination {...args} currentPage={page} onPageChange={setPage} />;
  },
};
