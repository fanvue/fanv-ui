import type { Meta, StoryObj } from "@storybook/react";
import { cn } from "@/utils/cn";
import { AgentPanelFlair } from "./AgentPanelFlair";

const meta = {
  title: "Components/AgentPanelFlair",
  component: AgentPanelFlair,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof AgentPanelFlair>;

export default meta;
type Story = StoryObj<typeof meta>;

const PanelPreview = ({ dark }: { dark?: boolean }) => (
  <div
    className={cn(
      "relative h-[560px] w-[420px] overflow-hidden rounded-md bg-bg-primary",
      dark && "dark",
    )}
  >
    <AgentPanelFlair />
    <div className="relative z-10 flex flex-col gap-1 p-6">
      <h2 className="typography-bold-heading-sm text-content-primary">Creator Agent</h2>
      <p className="typography-regular-body-md text-content-secondary">How can I help today?</p>
    </div>
  </div>
);

export const Default: Story = {
  render: () => <PanelPreview />,
};

export const DarkMode: Story = {
  render: () => <PanelPreview dark />,
};
