import type { Meta, StoryObj } from "@storybook/react";
import { AddIcon } from "../Icons/AddIcon";
import { AIIcon } from "../Icons/AIIcon";
import { AlertIcon } from "../Icons/AlertIcon";
import { ArrowDownIcon } from "../Icons/ArrowDownIcon";
import { ArrowLeftIcon } from "../Icons/ArrowLeftIcon";
import { ArrowRightIcon } from "../Icons/ArrowRightIcon";
import { ArrowUpIcon } from "../Icons/ArrowUpIcon";
import { ArrowUpRightIcon } from "../Icons/ArrowUpRightIcon";
import { BankIcon } from "../Icons/BankIcon";
import { BellIcon } from "../Icons/BellIcon";
import { BellOffIcon } from "../Icons/BellOffIcon";
import { BoltIcon } from "../Icons/BoltIcon";
import { BulbIcon } from "../Icons/BulbIcon";
import { Calendar2Icon } from "../Icons/Calendar2Icon";
import { CalendarIcon } from "../Icons/CalendarIcon";
import { CameraIcon } from "../Icons/CameraIcon";
import { ChartIcon } from "../Icons/ChartIcon";
import { CheckCircleIcon } from "../Icons/CheckCircleIcon";
import { CheckIcon } from "../Icons/CheckIcon";
import { CheckOutlineIcon } from "../Icons/CheckOutlineIcon";
import { ChevronDownIcon } from "../Icons/ChevronDownIcon";
import { ChevronLeftIcon } from "../Icons/ChevronLeftIcon";
import { ChevronRightIcon } from "../Icons/ChevronRightIcon";
import { ChevronUpIcon } from "../Icons/ChevronUpIcon";
import { ClockIcon } from "../Icons/ClockIcon";
import { CloseIcon } from "../Icons/CloseIcon";
import { CodeIcon } from "../Icons/CodeIcon";
import { CoinIcon } from "../Icons/CoinIcon";
import { CompassIcon } from "../Icons/CompassIcon";
import { CopyIcon } from "../Icons/CopyIcon";
import { CrossIcon } from "../Icons/CrossIcon";
import { CrownIcon } from "../Icons/CrownIcon";
import { DiamondIcon } from "../Icons/DiamondIcon";
import { DiscountIcon } from "../Icons/DiscountIcon";
import { DonateIcon } from "../Icons/DonateIcon";
import { DoubleTickIcon } from "../Icons/DoubleTickIcon";
import { DownloadIcon } from "../Icons/DownloadIcon";
import { EditIcon } from "../Icons/EditIcon";
import { ErrorCircleIcon } from "../Icons/ErrorCircleIcon";
import { ErrorIcon } from "../Icons/ErrorIcon";
import { ExpandIcon } from "../Icons/ExpandIcon";
import { EyeClosedIcon } from "../Icons/EyeClosedIcon";
import { EyeIcon } from "../Icons/EyeIcon";
import { EyeSlashIcon } from "../Icons/EyeSlashIcon";
import { FlagIcon } from "../Icons/FlagIcon";
import { FlameIcon } from "../Icons/FlameIcon";
import { FolderIcon } from "../Icons/FolderIcon";
import { ForwardIcon } from "../Icons/ForwardIcon";
import { GalleryIcon } from "../Icons/GalleryIcon";
import { GenderIcon } from "../Icons/GenderIcon";
import { GiftIcon } from "../Icons/GiftIcon";
import { HelpIcon } from "../Icons/HelpIcon";
import { HomeIcon } from "../Icons/HomeIcon";
import { HourglassIcon } from "../Icons/HourglassIcon";
import { ImageIcon } from "../Icons/ImageIcon";
import { InboxIcon } from "../Icons/InboxIcon";
import { InfoCircleIcon } from "../Icons/InfoCircleIcon";
import { InfoIcon } from "../Icons/InfoIcon";
import { LinkIcon } from "../Icons/LinkIcon";
import { LocationIcon } from "../Icons/LocationIcon";
import { LockerOffIcon } from "../Icons/LockerOffIcon";
import { LockerOnIcon } from "../Icons/LockerOnIcon";
import { LogoutIcon } from "../Icons/LogoutIcon";
import { LoveIcon } from "../Icons/LoveIcon";
import { MegaphoneIcon } from "../Icons/MegaphoneIcon";
import { MenuCloseIcon } from "../Icons/MenuCloseIcon";
import { MenuIcon } from "../Icons/MenuIcon";
import { MenuOpenIcon } from "../Icons/MenuOpenIcon";
import { MessageIcon } from "../Icons/MessageIcon";
import { MicrophoneIcon } from "../Icons/MicrophoneIcon";
import { MinusIcon } from "../Icons/MinusIcon";
import { MoonIcon } from "../Icons/MoonIcon";
import { MoreIcon } from "../Icons/MoreIcon";
import { MoreVerticalIcon } from "../Icons/MoreVerticalIcon";
import { NewMessageIcon } from "../Icons/NewMessageIcon";
import { PauseIcon } from "../Icons/PauseIcon";
import { PhoneIcon } from "../Icons/PhoneIcon";
import { PhoneOffIcon } from "../Icons/PhoneOffIcon";
import { PinIcon } from "../Icons/PinIcon";
import { PlayIcon } from "../Icons/PlayIcon";
import { PlusIcon } from "../Icons/PlusIcon";
import { PrivacyIcon } from "../Icons/PrivacyIcon";
import { RepeatIcon } from "../Icons/RepeatIcon";
import { Reply2Icon } from "../Icons/Reply2Icon";
import { ReplyIcon } from "../Icons/ReplyIcon";
import { ReverseIcon } from "../Icons/ReverseIcon";
import { SearchIcon } from "../Icons/SearchIcon";
import { SendIcon } from "../Icons/SendIcon";
import { SettingsIcon } from "../Icons/SettingsIcon";
import { ShareIcon } from "../Icons/ShareIcon";
import { SpinnerIcon } from "../Icons/SpinnerIcon";
import { StarIcon } from "../Icons/StarIcon";
import { StopIcon } from "../Icons/StopIcon";
import { SuccessIcon } from "../Icons/SuccessIcon";
import { SunIcon } from "../Icons/SunIcon";
import { Support2Icon } from "../Icons/Support2Icon";
import { SupportIcon } from "../Icons/SupportIcon";
import { TagIcon } from "../Icons/TagIcon";
import { TaskIcon } from "../Icons/TaskIcon";
import { ThumbDownIcon } from "../Icons/ThumbDownIcon";
import { ThumbUpIcon } from "../Icons/ThumbUpIcon";
import { TickCircleIcon } from "../Icons/TickCircleIcon";
import { TickCircleOffIcon } from "../Icons/TickCircleOffIcon";
import { TickIcon } from "../Icons/TickIcon";
import { TrashBinIcon } from "../Icons/TrashBinIcon";
import { TrophyIcon } from "../Icons/TrophyIcon";
import { UploadCloudIcon } from "../Icons/UploadCloudIcon";
import { UploadIcon } from "../Icons/UploadIcon";
import { UserCircleIcon } from "../Icons/UserCircleIcon";
import { UserIcon } from "../Icons/UserIcon";
import { UsersIcon } from "../Icons/UsersIcon";
import { VideoIcon } from "../Icons/VideoIcon";
import { VipBadgeIcon } from "../Icons/VipBadgeIcon";
import { WalletIcon } from "../Icons/WalletIcon";
import { WarningIcon } from "../Icons/WarningIcon";
import { WarningTriangleIcon } from "../Icons/WarningTriangleIcon";
import { WifiOffIcon } from "../Icons/WifiOffIcon";
import { WifiOnIcon } from "../Icons/WifiOnIcon";
import { WrenchIcon } from "../Icons/WrenchIcon";
import { IconButton } from "./IconButton";

const meta = {
  title: "Components/IconButton",
  component: IconButton,
  parameters: {
    layout: "centered",
    design: {
      type: "figma",
      url: "https://www.figma.com/design/S8zFdcOjt4qN4PrwntuCdt/Fanvue-Library?node-id=87-4400",
    },
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: [
        "primary",
        "secondary",
        "tertiary",
        "brand",
        "contrast",
        "messaging",
        "navTray",
        "tertiaryDestructive",
        "stop",
        "microphone",
      ],
    },
    size: {
      control: "select",
      options: ["24", "32", "40", "52", "72"],
    },
    disabled: { control: "boolean" },
    counterValue: { control: "number" },
  },
} satisfies Meta<typeof IconButton>;

export default meta;
type Story = StoryObj<typeof meta>;

// Primary variants
export const Primary24: Story = {
  args: {
    variant: "primary",
    size: "24",
    icon: <HomeIcon />,
    "aria-label": "Home",
  },
};

export const Primary32: Story = {
  args: {
    variant: "primary",
    size: "32",
    icon: <HomeIcon />,
  },
};

export const Primary40: Story = {
  args: {
    variant: "primary",
    size: "40",
    icon: <HomeIcon />,
  },
};

export const PrimaryDisabled: Story = {
  args: {
    variant: "primary",
    size: "40",
    icon: <HomeIcon />,
    disabled: true,
  },
};

// Secondary variants
export const Secondary24: Story = {
  args: {
    variant: "secondary",
    size: "24",
    icon: <HomeIcon />,
  },
};

export const Secondary32: Story = {
  args: {
    variant: "secondary",
    size: "32",
    icon: <HomeIcon />,
  },
};

export const Secondary40: Story = {
  args: {
    variant: "secondary",
    size: "40",
    icon: <HomeIcon />,
  },
};

export const SecondaryDisabled: Story = {
  args: {
    variant: "secondary",
    size: "40",
    icon: <HomeIcon />,
    disabled: true,
  },
};

// Tertiary variants
export const Tertiary24: Story = {
  args: {
    variant: "tertiary",
    size: "24",
    icon: <HomeIcon />,
  },
};

export const Tertiary32: Story = {
  args: {
    variant: "tertiary",
    size: "32",
    icon: <HomeIcon />,
  },
};

export const Tertiary40: Story = {
  args: {
    variant: "tertiary",
    size: "40",
    icon: <HomeIcon />,
  },
};

export const TertiaryDisabled: Story = {
  args: {
    variant: "tertiary",
    size: "40",
    icon: <HomeIcon />,
    disabled: true,
  },
};

export const TertiaryWithCounter: Story = {
  args: {
    variant: "tertiary",
    size: "40",
    icon: <HomeIcon />,
    counterValue: 12,
  },
};

// Brand variants
export const Brand24: Story = {
  args: {
    variant: "brand",
    size: "24",
    icon: <HomeIcon />,
  },
};

export const Brand40: Story = {
  args: {
    variant: "brand",
    size: "40",
    icon: <HomeIcon />,
  },
};

export const BrandDisabled: Story = {
  args: {
    variant: "brand",
    size: "40",
    icon: <HomeIcon />,
    disabled: true,
  },
};

// Contrast variants
export const Contrast24: Story = {
  args: {
    variant: "contrast",
    size: "24",
    icon: <HomeIcon />,
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};

// Tertiary Destructive variants
export const TertiaryDestructive24: Story = {
  args: {
    variant: "tertiaryDestructive",
    size: "24",
    icon: <HomeIcon />,
  },
};

export const TertiaryDestructive32: Story = {
  args: {
    variant: "tertiaryDestructive",
    size: "32",
    icon: <HomeIcon />,
  },
};

export const TertiaryDestructiveDisabled: Story = {
  args: {
    variant: "tertiaryDestructive",
    size: "32",
    icon: <HomeIcon />,
    disabled: true,
  },
};

// Nav tray variants
export const NavTray40: Story = {
  args: {
    variant: "navTray",
    size: "40",
    icon: <HomeIcon />,
  },
};

export const NavTrayWithCounter: Story = {
  args: {
    variant: "navTray",
    size: "40",
    icon: <HomeIcon />,
    counterValue: 12,
  },
};

export const NavTrayDisabled: Story = {
  args: {
    variant: "navTray",
    size: "40",
    icon: <HomeIcon />,
    disabled: true,
  },
};

// Messaging variant
export const Messaging52: Story = {
  args: {
    variant: "messaging",
    size: "52",
    icon: <HomeIcon />,
  },
};

export const MessagingDisabled: Story = {
  args: {
    variant: "messaging",
    size: "52",
    icon: <HomeIcon />,
    disabled: true,
  },
};

// Microphone variant
export const Microphone72: Story = {
  args: {
    variant: "microphone",
    size: "72",
    icon: <MicrophoneIcon />,
  },
};

// Stop variant
export const Stop72: Story = {
  args: {
    variant: "stop",
    size: "72",
    icon: <StopIcon />,
  },
};

// All icons in IconButton for visual regression
const allIcons = [
  { name: "AddIcon", icon: <AddIcon /> },
  { name: "AIIcon", icon: <AIIcon /> },
  { name: "AlertIcon", icon: <AlertIcon /> },
  { name: "ArrowDownIcon", icon: <ArrowDownIcon /> },
  { name: "ArrowLeftIcon", icon: <ArrowLeftIcon /> },
  { name: "ArrowRightIcon", icon: <ArrowRightIcon /> },
  { name: "ArrowUpIcon", icon: <ArrowUpIcon /> },
  { name: "ArrowUpRightIcon", icon: <ArrowUpRightIcon /> },
  { name: "BankIcon", icon: <BankIcon /> },
  { name: "BellIcon", icon: <BellIcon /> },
  { name: "BellOffIcon", icon: <BellOffIcon /> },
  { name: "BoltIcon", icon: <BoltIcon /> },
  { name: "BulbIcon", icon: <BulbIcon /> },
  { name: "Calendar2Icon", icon: <Calendar2Icon /> },
  { name: "CalendarIcon", icon: <CalendarIcon /> },
  { name: "CameraIcon", icon: <CameraIcon /> },
  { name: "ChartIcon", icon: <ChartIcon /> },
  { name: "CheckCircleIcon", icon: <CheckCircleIcon /> },
  { name: "CheckIcon", icon: <CheckIcon /> },
  { name: "CheckOutlineIcon", icon: <CheckOutlineIcon /> },
  { name: "ChevronDownIcon", icon: <ChevronDownIcon /> },
  { name: "ChevronLeftIcon", icon: <ChevronLeftIcon /> },
  { name: "ChevronRightIcon", icon: <ChevronRightIcon /> },
  { name: "ChevronUpIcon", icon: <ChevronUpIcon /> },
  { name: "ClockIcon", icon: <ClockIcon /> },
  { name: "CloseIcon", icon: <CloseIcon /> },
  { name: "CodeIcon", icon: <CodeIcon /> },
  { name: "CoinIcon", icon: <CoinIcon /> },
  { name: "CompassIcon", icon: <CompassIcon /> },
  { name: "CopyIcon", icon: <CopyIcon /> },
  { name: "CrossIcon", icon: <CrossIcon /> },
  { name: "CrownIcon", icon: <CrownIcon /> },
  { name: "DiamondIcon", icon: <DiamondIcon /> },
  { name: "DiscountIcon", icon: <DiscountIcon /> },
  { name: "DonateIcon", icon: <DonateIcon /> },
  { name: "DoubleTickIcon", icon: <DoubleTickIcon /> },
  { name: "DownloadIcon", icon: <DownloadIcon /> },
  { name: "EditIcon", icon: <EditIcon /> },
  { name: "ErrorCircleIcon", icon: <ErrorCircleIcon /> },
  { name: "ErrorIcon", icon: <ErrorIcon /> },
  { name: "ExpandIcon", icon: <ExpandIcon /> },
  { name: "EyeClosedIcon", icon: <EyeClosedIcon /> },
  { name: "EyeIcon", icon: <EyeIcon /> },
  { name: "EyeSlashIcon", icon: <EyeSlashIcon /> },
  { name: "FlagIcon", icon: <FlagIcon /> },
  { name: "FlameIcon", icon: <FlameIcon /> },
  { name: "FolderIcon", icon: <FolderIcon /> },
  { name: "ForwardIcon", icon: <ForwardIcon /> },
  { name: "GalleryIcon", icon: <GalleryIcon /> },
  { name: "GenderIcon", icon: <GenderIcon /> },
  { name: "GiftIcon", icon: <GiftIcon /> },
  { name: "HelpIcon", icon: <HelpIcon /> },
  { name: "HomeIcon", icon: <HomeIcon /> },
  { name: "HourglassIcon", icon: <HourglassIcon /> },
  { name: "ImageIcon", icon: <ImageIcon /> },
  { name: "InboxIcon", icon: <InboxIcon /> },
  { name: "InfoCircleIcon", icon: <InfoCircleIcon /> },
  { name: "InfoIcon", icon: <InfoIcon /> },
  { name: "LinkIcon", icon: <LinkIcon /> },
  { name: "LocationIcon", icon: <LocationIcon /> },
  { name: "LockerOffIcon", icon: <LockerOffIcon /> },
  { name: "LockerOnIcon", icon: <LockerOnIcon /> },
  { name: "LogoutIcon", icon: <LogoutIcon /> },
  { name: "LoveIcon", icon: <LoveIcon /> },
  { name: "MegaphoneIcon", icon: <MegaphoneIcon /> },
  { name: "MenuCloseIcon", icon: <MenuCloseIcon /> },
  { name: "MenuIcon", icon: <MenuIcon /> },
  { name: "MenuOpenIcon", icon: <MenuOpenIcon /> },
  { name: "MessageIcon", icon: <MessageIcon /> },
  { name: "MicrophoneIcon", icon: <MicrophoneIcon /> },
  { name: "MinusIcon", icon: <MinusIcon /> },
  { name: "MoonIcon", icon: <MoonIcon /> },
  { name: "MoreIcon", icon: <MoreIcon /> },
  { name: "MoreVerticalIcon", icon: <MoreVerticalIcon /> },
  { name: "NewMessageIcon", icon: <NewMessageIcon /> },
  { name: "PauseIcon", icon: <PauseIcon /> },
  { name: "PhoneIcon", icon: <PhoneIcon /> },
  { name: "PhoneOffIcon", icon: <PhoneOffIcon /> },
  { name: "PinIcon", icon: <PinIcon /> },
  { name: "PlayIcon", icon: <PlayIcon /> },
  { name: "PlusIcon", icon: <PlusIcon /> },
  { name: "PrivacyIcon", icon: <PrivacyIcon /> },
  { name: "RepeatIcon", icon: <RepeatIcon /> },
  { name: "Reply2Icon", icon: <Reply2Icon /> },
  { name: "ReplyIcon", icon: <ReplyIcon /> },
  { name: "ReverseIcon", icon: <ReverseIcon /> },
  { name: "SearchIcon", icon: <SearchIcon /> },
  { name: "SendIcon", icon: <SendIcon /> },
  { name: "SettingsIcon", icon: <SettingsIcon /> },
  { name: "ShareIcon", icon: <ShareIcon /> },
  { name: "SpinnerIcon", icon: <SpinnerIcon /> },
  { name: "StarIcon", icon: <StarIcon /> },
  { name: "StopIcon", icon: <StopIcon /> },
  { name: "SuccessIcon", icon: <SuccessIcon /> },
  { name: "SunIcon", icon: <SunIcon /> },
  { name: "Support2Icon", icon: <Support2Icon /> },
  { name: "SupportIcon", icon: <SupportIcon /> },
  { name: "TagIcon", icon: <TagIcon /> },
  { name: "TaskIcon", icon: <TaskIcon /> },
  { name: "TickCircleIcon", icon: <TickCircleIcon /> },
  { name: "TickCircleOffIcon", icon: <TickCircleOffIcon /> },
  { name: "TickIcon", icon: <TickIcon /> },
  { name: "TrashBinIcon", icon: <TrashBinIcon /> },
  { name: "TrophyIcon", icon: <TrophyIcon /> },
  { name: "ThumbDownIcon", icon: <ThumbDownIcon /> },
  { name: "ThumbUpIcon", icon: <ThumbUpIcon /> },
  { name: "UploadCloudIcon", icon: <UploadCloudIcon /> },
  { name: "UploadIcon", icon: <UploadIcon /> },
  { name: "UserCircleIcon", icon: <UserCircleIcon /> },
  { name: "UserIcon", icon: <UserIcon /> },
  { name: "UsersIcon", icon: <UsersIcon /> },
  { name: "VideoIcon", icon: <VideoIcon /> },
  { name: "VipBadgeIcon", icon: <VipBadgeIcon /> },
  { name: "WalletIcon", icon: <WalletIcon /> },
  { name: "WarningIcon", icon: <WarningIcon /> },
  { name: "WarningTriangleIcon", icon: <WarningTriangleIcon /> },
  { name: "WifiOffIcon", icon: <WifiOffIcon /> },
  { name: "WifiOnIcon", icon: <WifiOnIcon /> },
  { name: "WrenchIcon", icon: <WrenchIcon /> },
];

export const AllIcons: Story = {
  args: {
    icon: <HomeIcon />,
    "aria-label": "All icons",
  },
  render: () => (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(72px, 1fr))",
        gap: 8,
        padding: 16,
        maxWidth: 960,
      }}
    >
      {allIcons.map(({ name, icon }) => (
        <div
          key={name}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 4,
          }}
        >
          <IconButton icon={icon} aria-label={name} variant="secondary" size="40" />
          <span
            style={{
              fontSize: 9,
              fontFamily: "monospace",
              textAlign: "center",
              wordBreak: "break-all",
              color: "#666",
            }}
          >
            {name}
          </span>
        </div>
      ))}
    </div>
  ),
  parameters: {
    layout: "fullscreen",
  },
};
