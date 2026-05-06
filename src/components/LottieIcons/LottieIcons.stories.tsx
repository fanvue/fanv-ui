import type { Meta, StoryObj } from "@storybook/react";
import { AppsLottieIcon } from "./AppsLottieIcon";
import { BellLottieIcon } from "./BellLottieIcon";
import { ChartLottieIcon } from "./ChartLottieIcon";
import { CoinLottieIcon } from "./CoinLottieIcon";
import { GalleryLottieIcon } from "./GalleryLottieIcon";
import { HomeLottieIcon } from "./HomeLottieIcon";
import { MessageLottieIcon } from "./MessageLottieIcon";
import { SettingsLottieIcon } from "./SettingsLottieIcon";
import { SidebarLeftLottieIcon } from "./SidebarLeftLottieIcon";
import { SidebarRightLottieIcon } from "./SidebarRightLottieIcon";

const meta = {
  title: "LottieIcons",
  parameters: { layout: "padded" },
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const ICONS = [
  { name: "Home", Component: HomeLottieIcon },
  { name: "Chart", Component: ChartLottieIcon },
  { name: "Coin", Component: CoinLottieIcon },
  { name: "Apps", Component: AppsLottieIcon },
  { name: "Gallery", Component: GalleryLottieIcon },
  { name: "Message", Component: MessageLottieIcon },
  { name: "Bell", Component: BellLottieIcon },
  { name: "Settings", Component: SettingsLottieIcon },
  { name: "SidebarLeft", Component: SidebarLeftLottieIcon },
  { name: "SidebarRight", Component: SidebarRightLottieIcon },
] as const;

export const Gallery: Story = {
  render: () => (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
      {ICONS.map(({ name, Component }) => (
        <li key={name}>
          <button
            type="button"
            className="flex w-full flex-col items-center gap-2 rounded-md border border-border-primary p-4 hover:bg-surface-secondary focus-visible:shadow-focus-ring focus-visible:outline-none"
          >
            <Component size={32} />
            <span className="typography-regular-body-xs-static text-content-secondary">{name}</span>
          </button>
        </li>
      ))}
    </ul>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-end gap-4">
      <button type="button" className="rounded-md border border-border-primary p-3">
        <HomeLottieIcon size={16} />
      </button>
      <button type="button" className="rounded-md border border-border-primary p-3">
        <HomeLottieIcon size={24} />
      </button>
      <button type="button" className="rounded-md border border-border-primary p-3">
        <HomeLottieIcon size={32} />
      </button>
    </div>
  ),
};

export const ManualPlayback: Story = {
  render: () => (
    <div className="flex flex-col items-start gap-3">
      <p className="typography-regular-body-sm-static text-content-secondary">
        With <code>trigger="manual"</code> the icon ignores ancestor hover/focus.
      </p>
      <BellLottieIcon trigger="manual" play size={32} />
    </div>
  ),
};
