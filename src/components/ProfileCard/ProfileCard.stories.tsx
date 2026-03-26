import type { Meta, StoryObj } from "@storybook/react";
import { ProfileCard } from "./ProfileCard";

const meta = {
  title: "Components/ProfileCard",
  component: ProfileCard,
  parameters: {
    layout: "centered",
    design: {
      type: "figma",
      url: "https://www.figma.com/design/Iq9ctjP7rhIKI3PGSbduNL/Fanvue-Exploration?node-id=175-4952&m=dev",
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof ProfileCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: "Aitana Lopez",
    username: "@fit_aitana",
    bannerSrc: "https://www.figma.com/api/mcp/asset/1bcaf49c-a79f-488c-8bd7-812da99b76dd",
    avatarSrc: "https://www.figma.com/api/mcp/asset/6862c012-9d9c-4fbd-a815-bd870ad27b38",
    followLabel: "Follow",
  },
};
