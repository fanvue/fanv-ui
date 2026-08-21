import type { Meta, StoryObj } from "@storybook/react";
import { type ComponentType, useEffect, useRef, useState } from "react";
import { AddIcon as AnimatedAddIcon } from "../components/AnimatedIcons/AddIcon";
import { AffiliatesIcon as AnimatedAffiliatesIcon } from "../components/AnimatedIcons/AffiliatesIcon";
import { AIIcon as AnimatedAIIcon } from "../components/AnimatedIcons/AIIcon";
import { ArrowDownIcon as AnimatedArrowDownIcon } from "../components/AnimatedIcons/ArrowDownIcon";
import { ArrowLeftIcon as AnimatedArrowLeftIcon } from "../components/AnimatedIcons/ArrowLeftIcon";
import { ArrowRightIcon as AnimatedArrowRightIcon } from "../components/AnimatedIcons/ArrowRightIcon";
import { ArrowUpIcon as AnimatedArrowUpIcon } from "../components/AnimatedIcons/ArrowUpIcon";
import { ArrowUpRightIcon as AnimatedArrowUpRightIcon } from "../components/AnimatedIcons/ArrowUpRightIcon";
import { AtSignIcon as AnimatedAtSignIcon } from "../components/AnimatedIcons/AtSignIcon";
import { BellIcon as AnimatedBellIcon } from "../components/AnimatedIcons/BellIcon";
import { BoltIcon as AnimatedBoltIcon } from "../components/AnimatedIcons/BoltIcon";
import { CalendarIcon as AnimatedCalendarIcon } from "../components/AnimatedIcons/CalendarIcon";
import { CardIcon as AnimatedCardIcon } from "../components/AnimatedIcons/CardIcon";
import { CheckIcon as AnimatedCheckIcon } from "../components/AnimatedIcons/CheckIcon";
import { CheckOutlineIcon as AnimatedCheckOutlineIcon } from "../components/AnimatedIcons/CheckOutlineIcon";
import { ChevronDownIcon as AnimatedChevronDownIcon } from "../components/AnimatedIcons/ChevronDownIcon";
import { ChevronLeftIcon as AnimatedChevronLeftIcon } from "../components/AnimatedIcons/ChevronLeftIcon";
import { ChevronRightIcon as AnimatedChevronRightIcon } from "../components/AnimatedIcons/ChevronRightIcon";
import { ChevronUpIcon as AnimatedChevronUpIcon } from "../components/AnimatedIcons/ChevronUpIcon";
import { ClockIcon as AnimatedClockIcon } from "../components/AnimatedIcons/ClockIcon";
import { CloseIcon as AnimatedCloseIcon } from "../components/AnimatedIcons/CloseIcon";
import { CogIcon as AnimatedCogIcon } from "../components/AnimatedIcons/CogIcon";
import { CoinIcon as AnimatedCoinIcon } from "../components/AnimatedIcons/CoinIcon";
import { CopyIcon as AnimatedCopyIcon } from "../components/AnimatedIcons/CopyIcon";
import { CrossIcon as AnimatedCrossIcon } from "../components/AnimatedIcons/CrossIcon";
import { DiscordIcon as AnimatedDiscordIcon } from "../components/AnimatedIcons/DiscordIcon";
import { DoubleTickIcon as AnimatedDoubleTickIcon } from "../components/AnimatedIcons/DoubleTickIcon";
import { DownloadIcon as AnimatedDownloadIcon } from "../components/AnimatedIcons/DownloadIcon";
import { EmojiIcon as AnimatedEmojiIcon } from "../components/AnimatedIcons/EmojiIcon";
import { ExpandIcon as AnimatedExpandIcon } from "../components/AnimatedIcons/ExpandIcon";
import { EyeIcon as AnimatedEyeIcon } from "../components/AnimatedIcons/EyeIcon";
import { EyeOffIcon as AnimatedEyeOffIcon } from "../components/AnimatedIcons/EyeOffIcon";
import { FlameIcon as AnimatedFlameIcon } from "../components/AnimatedIcons/FlameIcon";
import { HeartIcon as AnimatedHeartIcon } from "../components/AnimatedIcons/HeartIcon";
import { HelpIcon as AnimatedHelpIcon } from "../components/AnimatedIcons/HelpIcon";
import { HomeIcon as AnimatedHomeIcon } from "../components/AnimatedIcons/HomeIcon";
import { HourglassIcon as AnimatedHourglassIcon } from "../components/AnimatedIcons/HourglassIcon";
import { LanguageIcon as AnimatedLanguageIcon } from "../components/AnimatedIcons/LanguageIcon";
import { LinkIcon as AnimatedLinkIcon } from "../components/AnimatedIcons/LinkIcon";
import { LocationIcon as AnimatedLocationIcon } from "../components/AnimatedIcons/LocationIcon";
import { LockerIcon as AnimatedLockerIcon } from "../components/AnimatedIcons/LockerIcon";
import { MenuCloseIcon as AnimatedMenuCloseIcon } from "../components/AnimatedIcons/MenuCloseIcon";
import { MenuIcon as AnimatedMenuIcon } from "../components/AnimatedIcons/MenuIcon";
import { MenuOpenIcon as AnimatedMenuOpenIcon } from "../components/AnimatedIcons/MenuOpenIcon";
import { MicrophoneIcon as AnimatedMicrophoneIcon } from "../components/AnimatedIcons/MicrophoneIcon";
import { NewMessageIcon as AnimatedNewMessageIcon } from "../components/AnimatedIcons/NewMessageIcon";
import { OpenIcon as AnimatedOpenIcon } from "../components/AnimatedIcons/OpenIcon";
import { PeopleIcon as AnimatedPeopleIcon } from "../components/AnimatedIcons/PeopleIcon";
import { PhoneIcon as AnimatedPhoneIcon } from "../components/AnimatedIcons/PhoneIcon";
import { PlusIcon as AnimatedPlusIcon } from "../components/AnimatedIcons/PlusIcon";
import { ReverseIcon as AnimatedReverseIcon } from "../components/AnimatedIcons/ReverseIcon";
import { SearchIcon as AnimatedSearchIcon } from "../components/AnimatedIcons/SearchIcon";
import { SendIcon as AnimatedSendIcon } from "../components/AnimatedIcons/SendIcon";
import { SettingsIcon as AnimatedSettingsIcon } from "../components/AnimatedIcons/SettingsIcon";
import { SoundIcon as AnimatedSoundIcon } from "../components/AnimatedIcons/SoundIcon";
import { SunIcon as AnimatedSunIcon } from "../components/AnimatedIcons/SunIcon";
import { ThumbDownIcon as AnimatedThumbDownIcon } from "../components/AnimatedIcons/ThumbDownIcon";
import { ThumbUpIcon as AnimatedThumbUpIcon } from "../components/AnimatedIcons/ThumbUpIcon";
import { TickCircleIcon as AnimatedTickCircleIcon } from "../components/AnimatedIcons/TickCircleIcon";
import { TickIcon as AnimatedTickIcon } from "../components/AnimatedIcons/TickIcon";
import { TrashBinIcon as AnimatedTrashBinIcon } from "../components/AnimatedIcons/TrashBinIcon";
import { TrashIcon as AnimatedTrashIcon } from "../components/AnimatedIcons/TrashIcon";
import type { AnimatedIconHandle } from "../components/AnimatedIcons/types";
import { UploadCloudIcon as AnimatedUploadCloudIcon } from "../components/AnimatedIcons/UploadCloudIcon";
import { UploadIcon as AnimatedUploadIcon } from "../components/AnimatedIcons/UploadIcon";
import { UploadToCloudIcon as AnimatedUploadToCloudIcon } from "../components/AnimatedIcons/UploadToCloudIcon";
import { UsersIcon as AnimatedUsersIcon } from "../components/AnimatedIcons/UsersIcon";
import { WalletIcon as AnimatedWalletIcon } from "../components/AnimatedIcons/WalletIcon";
import { WifiIcon as AnimatedWifiIcon } from "../components/AnimatedIcons/WifiIcon";
import { WrenchIcon as AnimatedWrenchIcon } from "../components/AnimatedIcons/WrenchIcon";
import { AddCircleIcon } from "../components/Icons/AddCircleIcon";
import { AddIcon } from "../components/Icons/AddIcon";
import { AffiliatesIcon } from "../components/Icons/AffiliatesIcon";
import { AI2Icon } from "../components/Icons/AI2Icon";
import { AICallIcon } from "../components/Icons/AICallIcon";
import { AIDisclosureIcon } from "../components/Icons/AIDisclosureIcon";
import { AIIcon } from "../components/Icons/AIIcon";
import { AISettingsIcon } from "../components/Icons/AISettingsIcon";
import { AlertIcon } from "../components/Icons/AlertIcon";
import { AppsIcon } from "../components/Icons/AppsIcon";
import { ArrowDownIcon } from "../components/Icons/ArrowDownIcon";
import { ArrowLeftIcon } from "../components/Icons/ArrowLeftIcon";
import { ArrowRightIcon } from "../components/Icons/ArrowRightIcon";
import { ArrowUpIcon } from "../components/Icons/ArrowUpIcon";
import { ArrowUpRightIcon } from "../components/Icons/ArrowUpRightIcon";
import { AtSignIcon } from "../components/Icons/AtSignIcon";
import { AutoMessageIcon } from "../components/Icons/AutoMessageIcon";
import { BankIcon } from "../components/Icons/BankIcon";
import { BellIcon } from "../components/Icons/BellIcon";
import { BellOffIcon } from "../components/Icons/BellOffIcon";
import { BoltIcon } from "../components/Icons/BoltIcon";
import { BulbIcon } from "../components/Icons/BulbIcon";
import { Calendar2Icon } from "../components/Icons/Calendar2Icon";
import { CalendarIcon } from "../components/Icons/CalendarIcon";
import { CameraIcon } from "../components/Icons/CameraIcon";
import { CardIcon } from "../components/Icons/CardIcon";
import { ChartIcon } from "../components/Icons/ChartIcon";
import { CheckBoxOffIcon } from "../components/Icons/CheckBoxOffIcon";
import { CheckBoxOnIcon } from "../components/Icons/CheckBoxOnIcon";
import { CheckCircleIcon } from "../components/Icons/CheckCircleIcon";
import { CheckIcon } from "../components/Icons/CheckIcon";
import { CheckOutlineIcon } from "../components/Icons/CheckOutlineIcon";
import { ChevronDownIcon } from "../components/Icons/ChevronDownIcon";
import { ChevronLeftIcon } from "../components/Icons/ChevronLeftIcon";
import { ChevronRightIcon } from "../components/Icons/ChevronRightIcon";
import { ChevronUpIcon } from "../components/Icons/ChevronUpIcon";
import { ClockIcon } from "../components/Icons/ClockIcon";
import { CloseIcon } from "../components/Icons/CloseIcon";
import { CodeIcon } from "../components/Icons/CodeIcon";
import { CogIcon } from "../components/Icons/CogIcon";
import { CoinIcon } from "../components/Icons/CoinIcon";
import { CompassIcon } from "../components/Icons/CompassIcon";
import { CopyIcon } from "../components/Icons/CopyIcon";
import { CrossCircleIcon } from "../components/Icons/CrossCircleIcon";
import { CrossIcon } from "../components/Icons/CrossIcon";
import { CrownIcon } from "../components/Icons/CrownIcon";
import { DenseGridViewIcon } from "../components/Icons/DenseGridViewIcon";
import { DiamondIcon } from "../components/Icons/DiamondIcon";
import { DiscordIcon } from "../components/Icons/DiscordIcon";
import { DiscountIcon } from "../components/Icons/DiscountIcon";
import { DonateIcon } from "../components/Icons/DonateIcon";
import { DoubleTickIcon } from "../components/Icons/DoubleTickIcon";
import { DownloadIcon } from "../components/Icons/DownloadIcon";
import { EditIcon } from "../components/Icons/EditIcon";
import { EmojiIcon } from "../components/Icons/EmojiIcon";
import { ErrorCircleIcon } from "../components/Icons/ErrorCircleIcon";
import { ErrorIcon } from "../components/Icons/ErrorIcon";
import { ExclamationMarkIcon } from "../components/Icons/ExclamationMarkIcon";
import { ExpandIcon } from "../components/Icons/ExpandIcon";
import { EyeClosedIcon } from "../components/Icons/EyeClosedIcon";
import { EyeIcon } from "../components/Icons/EyeIcon";
import { EyeOffIcon } from "../components/Icons/EyeOffIcon";
import { EyeSlashIcon } from "../components/Icons/EyeSlashIcon";
import { FacebookIcon } from "../components/Icons/FacebookIcon";
import { FlagIcon } from "../components/Icons/FlagIcon";
import { FlameIcon } from "../components/Icons/FlameIcon";
import { FlashIcon } from "../components/Icons/FlashIcon";
import { FolderIcon } from "../components/Icons/FolderIcon";
import { ForwardIcon } from "../components/Icons/ForwardIcon";
import { GalleryIcon } from "../components/Icons/GalleryIcon";
import { GameIcon } from "../components/Icons/GameIcon";
import { GenderIcon } from "../components/Icons/GenderIcon";
import { GifIcon } from "../components/Icons/GifIcon";
import { GiftIcon } from "../components/Icons/GiftIcon";
import { GoogleIcon } from "../components/Icons/GoogleIcon";
import { GridViewIcon } from "../components/Icons/GridViewIcon";
import { HealthIcon } from "../components/Icons/HealthIcon";
import { HeartIcon } from "../components/Icons/HeartIcon";
import { HelpIcon } from "../components/Icons/HelpIcon";
import { HomeIcon } from "../components/Icons/HomeIcon";
import { HourglassIcon } from "../components/Icons/HourglassIcon";
import { ImageIcon } from "../components/Icons/ImageIcon";
import { ImageUploadIcon } from "../components/Icons/ImageUploadIcon";
import { InboxIcon } from "../components/Icons/InboxIcon";
import { InfoCircleIcon } from "../components/Icons/InfoCircleIcon";
import { InfoIcon } from "../components/Icons/InfoIcon";
import { LanguageIcon } from "../components/Icons/LanguageIcon";
import { LinkIcon } from "../components/Icons/LinkIcon";
import { ListViewIcon } from "../components/Icons/ListViewIcon";
import { LocationIcon } from "../components/Icons/LocationIcon";
import { LockerIcon } from "../components/Icons/LockerIcon";
import { LockerOffIcon } from "../components/Icons/LockerOffIcon";
import { LockerOnIcon } from "../components/Icons/LockerOnIcon";
import { LogoutIcon } from "../components/Icons/LogoutIcon";
import { LoveIcon } from "../components/Icons/LoveIcon";
import { MassMessageIcon } from "../components/Icons/MassMessageIcon";
import { MegaphoneIcon } from "../components/Icons/MegaphoneIcon";
import { MenuCloseIcon } from "../components/Icons/MenuCloseIcon";
import { MenuIcon } from "../components/Icons/MenuIcon";
import { MenuOpenIcon } from "../components/Icons/MenuOpenIcon";
import { MessageIcon } from "../components/Icons/MessageIcon";
import { MicrophoneIcon } from "../components/Icons/MicrophoneIcon";
import { MinusIcon } from "../components/Icons/MinusIcon";
import { MoonIcon } from "../components/Icons/MoonIcon";
import { MoreIcon } from "../components/Icons/MoreIcon";
import { MoreVerticalIcon } from "../components/Icons/MoreVerticalIcon";
import { NewMessageIcon } from "../components/Icons/NewMessageIcon";
import { OpenIcon } from "../components/Icons/OpenIcon";
import { PauseIcon } from "../components/Icons/PauseIcon";
import { PeopleIcon } from "../components/Icons/PeopleIcon";
import { PhoneIcon } from "../components/Icons/PhoneIcon";
import { PhoneOffIcon } from "../components/Icons/PhoneOffIcon";
import { Pin2Icon } from "../components/Icons/Pin2Icon";
import { PinIcon } from "../components/Icons/PinIcon";
import { PlayIcon } from "../components/Icons/PlayIcon";
import { PlusIcon } from "../components/Icons/PlusIcon";
import { PrivacyIcon } from "../components/Icons/PrivacyIcon";
import { ProgrammingArrowIcon } from "../components/Icons/ProgrammingArrowIcon";
import { QueueIcon } from "../components/Icons/QueueIcon";
import { ReceiveMoneyIcon } from "../components/Icons/ReceiveMoneyIcon";
import { RefreshArrowIcon } from "../components/Icons/RefreshArrowIcon";
import { RepeatIcon } from "../components/Icons/RepeatIcon";
import { Reply2Icon } from "../components/Icons/Reply2Icon";
import { ReplyIcon } from "../components/Icons/ReplyIcon";
import { ReverseIcon } from "../components/Icons/ReverseIcon";
import { SearchIcon } from "../components/Icons/SearchIcon";
import { SendIcon } from "../components/Icons/SendIcon";
import { SettingsIcon } from "../components/Icons/SettingsIcon";
import { ShareIcon } from "../components/Icons/ShareIcon";
import { SoundIcon } from "../components/Icons/SoundIcon";
import { SpinnerIcon } from "../components/Icons/SpinnerIcon";
import { StarIcon } from "../components/Icons/StarIcon";
import { StopIcon } from "../components/Icons/StopIcon";
import { SuccessIcon } from "../components/Icons/SuccessIcon";
import { SunIcon } from "../components/Icons/SunIcon";
import { Support2Icon } from "../components/Icons/Support2Icon";
import { SupportIcon } from "../components/Icons/SupportIcon";
import { TagIcon } from "../components/Icons/TagIcon";
import { TaskIcon } from "../components/Icons/TaskIcon";
import { ThumbDownFilledIcon } from "../components/Icons/ThumbDownFilledIcon";
import { ThumbDownIcon } from "../components/Icons/ThumbDownIcon";
import { ThumbUpFilledIcon } from "../components/Icons/ThumbUpFilledIcon";
import { ThumbUpIcon } from "../components/Icons/ThumbUpIcon";
import { TickCircleIcon } from "../components/Icons/TickCircleIcon";
import { TickCircleOffIcon } from "../components/Icons/TickCircleOffIcon";
import { TickIcon } from "../components/Icons/TickIcon";
import { ToolsIcon } from "../components/Icons/ToolsIcon";
import { TranscationArrowIcon } from "../components/Icons/TranscationArrowIcon";
import { TrashBinIcon } from "../components/Icons/TrashBinIcon";
import { TrashIcon } from "../components/Icons/TrashIcon";
import { TrophyIcon } from "../components/Icons/TrophyIcon";
import { TwitterIcon } from "../components/Icons/TwitterIcon";
import { UploadCloudIcon } from "../components/Icons/UploadCloudIcon";
import { UploadIcon } from "../components/Icons/UploadIcon";
import { UploadToCloudIcon } from "../components/Icons/UploadToCloudIcon";
import { UserAddIcon } from "../components/Icons/UserAddIcon";
import { UserAIIcon } from "../components/Icons/UserAIIcon";
import { UserCircleIcon } from "../components/Icons/UserCircleIcon";
import { UserIcon } from "../components/Icons/UserIcon";
import { UserMenuIcon } from "../components/Icons/UserMenuIcon";
import { UsersIcon } from "../components/Icons/UsersIcon";
import { VaultIcon } from "../components/Icons/VaultIcon";
import { VerifiedIcon } from "../components/Icons/VerifiedIcon";
import { VideoIcon } from "../components/Icons/VideoIcon";
import { VipBadgeIcon } from "../components/Icons/VipBadgeIcon";
import { WalletIcon } from "../components/Icons/WalletIcon";
import { WarningIcon } from "../components/Icons/WarningIcon";
import { WarningTriangleIcon } from "../components/Icons/WarningTriangleIcon";
import { WifiIcon } from "../components/Icons/WifiIcon";
import { WifiOffIcon } from "../components/Icons/WifiOffIcon";
import { WifiOnIcon } from "../components/Icons/WifiOnIcon";
import { WrenchIcon } from "../components/Icons/WrenchIcon";

type IconEntry = {
  name: string;
  // biome-ignore lint/suspicious/noExplicitAny: heterogeneous prop shapes (prop-based vs legacy).
  component: ComponentType<any>;
  /** Animated twin from `@fanvue/ui/animated-icons`, when one exists. */
  // biome-ignore lint/suspicious/noExplicitAny: heterogeneous prop shapes (prop-based vs legacy).
  animated: ComponentType<any> | null;
  tags: string[];
  propBased: boolean;
};

const meta = {
  title: "Foundations/Icons",
  parameters: {
    layout: "fullscreen",
    controls: { disable: true },
    actions: { disable: true },
    design: {
      type: "figma",
      url: "https://www.figma.com/design/S8zFdcOjt4qN4PrwntuCdt/Fanvue-Library?node-id=16626-13603",
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

const icons: IconEntry[] = [
  {
    name: "AI2Icon",
    component: AI2Icon,
    animated: null,
    tags: ["ai", "artificial", "intelligence", "sparkle", "alt"],
    propBased: true,
  },
  { name: "AICallIcon", component: AICallIcon, animated: null, tags: [], propBased: true },
  {
    name: "AIDisclosureIcon",
    component: AIDisclosureIcon,
    animated: null,
    tags: [],
    propBased: true,
  },
  {
    name: "AIIcon",
    component: AIIcon,
    animated: AnimatedAIIcon,
    tags: ["ai", "artificial", "intelligence", "machine"],
    propBased: true,
  },
  {
    name: "AISettingsIcon",
    component: AISettingsIcon,
    animated: null,
    tags: ["ai", "settings", "gear", "cog", "personalise", "configure"],
    propBased: true,
  },
  {
    name: "AddCircleIcon",
    component: AddCircleIcon,
    animated: null,
    tags: ["add", "plus", "create", "new", "square", "compose"],
    propBased: true,
  },
  {
    name: "AddIcon",
    component: AddIcon,
    animated: AnimatedAddIcon,
    tags: ["add", "plus", "create", "new"],
    propBased: true,
  },
  {
    name: "AffiliatesIcon",
    component: AffiliatesIcon,
    animated: AnimatedAffiliatesIcon,
    tags: [],
    propBased: true,
  },
  {
    name: "AlertIcon",
    component: AlertIcon,
    animated: null,
    tags: ["alert", "warning", "exclamation"],
    propBased: true,
  },
  {
    name: "AppsIcon",
    component: AppsIcon,
    animated: null,
    tags: ["apps", "grid", "applications", "menu"],
    propBased: true,
  },
  {
    name: "ArrowDownIcon",
    component: ArrowDownIcon,
    animated: AnimatedArrowDownIcon,
    tags: ["arrow", "down", "navigation"],
    propBased: true,
  },
  {
    name: "ArrowLeftIcon",
    component: ArrowLeftIcon,
    animated: AnimatedArrowLeftIcon,
    tags: ["arrow", "left", "back", "navigation"],
    propBased: true,
  },
  {
    name: "ArrowRightIcon",
    component: ArrowRightIcon,
    animated: AnimatedArrowRightIcon,
    tags: ["arrow", "right", "navigation", "next"],
    propBased: true,
  },
  {
    name: "ArrowUpIcon",
    component: ArrowUpIcon,
    animated: AnimatedArrowUpIcon,
    tags: ["arrow", "up", "navigation"],
    propBased: true,
  },
  {
    name: "ArrowUpRightIcon",
    component: ArrowUpRightIcon,
    animated: AnimatedArrowUpRightIcon,
    tags: ["arrow", "up", "right", "external", "link"],
    propBased: false,
  },
  {
    name: "AtSignIcon",
    component: AtSignIcon,
    animated: AnimatedAtSignIcon,
    tags: ["at", "mention", "email", "sign"],
    propBased: true,
  },
  {
    name: "AutoMessageIcon",
    component: AutoMessageIcon,
    animated: null,
    tags: ["auto", "message", "automatic", "bot", "automation"],
    propBased: true,
  },
  {
    name: "BankIcon",
    component: BankIcon,
    animated: null,
    tags: ["bank", "login", "enter", "door"],
    propBased: true,
  },
  {
    name: "BellIcon",
    component: BellIcon,
    animated: AnimatedBellIcon,
    tags: ["bell", "notification", "alarm"],
    propBased: true,
  },
  {
    name: "BellOffIcon",
    component: BellOffIcon,
    animated: null,
    tags: ["bell", "off", "mute", "notification"],
    propBased: true,
  },
  {
    name: "BoltIcon",
    component: BoltIcon,
    animated: AnimatedBoltIcon,
    tags: ["bolt", "lightning", "power", "energy"],
    propBased: true,
  },
  {
    name: "BulbIcon",
    component: BulbIcon,
    animated: null,
    tags: ["bulb", "light", "idea", "lamp"],
    propBased: true,
  },
  {
    name: "Calendar2Icon",
    component: Calendar2Icon,
    animated: null,
    tags: ["calendar", "date", "schedule", "simple"],
    propBased: true,
  },
  {
    name: "CalendarIcon",
    component: CalendarIcon,
    animated: AnimatedCalendarIcon,
    tags: ["calendar", "date", "schedule"],
    propBased: true,
  },
  {
    name: "CameraIcon",
    component: CameraIcon,
    animated: null,
    tags: ["camera", "photo", "capture"],
    propBased: false,
  },
  {
    name: "CardIcon",
    component: CardIcon,
    animated: AnimatedCardIcon,
    tags: ["card", "credit", "payment", "wallet"],
    propBased: true,
  },
  {
    name: "ChartIcon",
    component: ChartIcon,
    animated: null,
    tags: ["chart", "love", "heart", "analytics"],
    propBased: true,
  },
  {
    name: "CheckBoxOffIcon",
    component: CheckBoxOffIcon,
    animated: null,
    tags: ["checkbox", "unchecked", "empty", "square", "off"],
    propBased: true,
  },
  {
    name: "CheckBoxOnIcon",
    component: CheckBoxOnIcon,
    animated: null,
    tags: ["checkbox", "checked", "ticked", "on"],
    propBased: true,
  },
  {
    name: "CheckCircleIcon",
    component: CheckCircleIcon,
    animated: null,
    tags: ["check", "circle", "success", "done"],
    propBased: false,
  },
  {
    name: "CheckIcon",
    component: CheckIcon,
    animated: AnimatedCheckIcon,
    tags: ["check", "tick", "done", "confirm"],
    propBased: false,
  },
  {
    name: "CheckOutlineIcon",
    component: CheckOutlineIcon,
    animated: AnimatedCheckOutlineIcon,
    tags: ["check", "outline", "circle", "confirm"],
    propBased: false,
  },
  {
    name: "ChevronDownIcon",
    component: ChevronDownIcon,
    animated: AnimatedChevronDownIcon,
    tags: ["chevron", "down", "arrow", "expand"],
    propBased: true,
  },
  {
    name: "ChevronLeftIcon",
    component: ChevronLeftIcon,
    animated: AnimatedChevronLeftIcon,
    tags: ["chevron", "left", "arrow", "back"],
    propBased: true,
  },
  {
    name: "ChevronRightIcon",
    component: ChevronRightIcon,
    animated: AnimatedChevronRightIcon,
    tags: ["chevron", "right", "arrow", "next"],
    propBased: true,
  },
  {
    name: "ChevronUpIcon",
    component: ChevronUpIcon,
    animated: AnimatedChevronUpIcon,
    tags: ["chevron", "up", "arrow", "collapse"],
    propBased: true,
  },
  {
    name: "ClockIcon",
    component: ClockIcon,
    animated: AnimatedClockIcon,
    tags: ["clock", "time", "schedule"],
    propBased: true,
  },
  {
    name: "CloseIcon",
    component: CloseIcon,
    animated: AnimatedCloseIcon,
    tags: ["close", "x", "dismiss", "remove"],
    propBased: true,
  },
  {
    name: "CodeIcon",
    component: CodeIcon,
    animated: null,
    tags: ["code", "brackets", "programming"],
    propBased: true,
  },
  {
    name: "CogIcon",
    component: CogIcon,
    animated: AnimatedCogIcon,
    tags: ["cog", "gear", "settings", "config", "preferences"],
    propBased: true,
  },
  {
    name: "CoinIcon",
    component: CoinIcon,
    animated: AnimatedCoinIcon,
    tags: ["coin", "money", "currency", "star"],
    propBased: true,
  },
  {
    name: "CompassIcon",
    component: CompassIcon,
    animated: null,
    tags: ["compass", "navigation", "direction", "explore"],
    propBased: true,
  },
  {
    name: "CopyIcon",
    component: CopyIcon,
    animated: AnimatedCopyIcon,
    tags: ["copy", "duplicate", "clipboard", "paste"],
    propBased: true,
  },
  {
    name: "CrossCircleIcon",
    component: CrossCircleIcon,
    animated: null,
    tags: [],
    propBased: true,
  },
  {
    name: "CrossIcon",
    component: CrossIcon,
    animated: AnimatedCrossIcon,
    tags: ["cross", "x", "close", "cancel", "remove"],
    propBased: false,
  },
  {
    name: "CrownIcon",
    component: CrownIcon,
    animated: null,
    tags: ["crown", "premium", "vip", "special"],
    propBased: true,
  },
  {
    name: "DenseGridViewIcon",
    component: DenseGridViewIcon,
    animated: null,
    tags: ["grid", "dense", "compact", "view", "layout", "gallery"],
    propBased: true,
  },
  {
    name: "DiamondIcon",
    component: DiamondIcon,
    animated: null,
    tags: ["diamond", "gem", "premium"],
    propBased: true,
  },
  {
    name: "DiscordIcon",
    component: DiscordIcon,
    animated: AnimatedDiscordIcon,
    tags: [],
    propBased: true,
  },
  {
    name: "DiscountIcon",
    component: DiscountIcon,
    animated: null,
    tags: ["discount", "sale", "percent"],
    propBased: true,
  },
  {
    name: "DonateIcon",
    component: DonateIcon,
    animated: null,
    tags: ["donate", "gift", "give"],
    propBased: true,
  },
  {
    name: "DoubleTickIcon",
    component: DoubleTickIcon,
    animated: AnimatedDoubleTickIcon,
    tags: ["double", "tick", "check", "read"],
    propBased: true,
  },
  {
    name: "DownloadIcon",
    component: DownloadIcon,
    animated: AnimatedDownloadIcon,
    tags: ["download", "save", "file"],
    propBased: true,
  },
  {
    name: "EditIcon",
    component: EditIcon,
    animated: null,
    tags: ["edit", "pen", "write", "modify"],
    propBased: true,
  },
  {
    name: "EmojiIcon",
    component: EmojiIcon,
    animated: AnimatedEmojiIcon,
    tags: ["emoji", "smiley", "face", "happy"],
    propBased: false,
  },
  {
    name: "ErrorCircleIcon",
    component: ErrorCircleIcon,
    animated: null,
    tags: ["error", "circle", "alert", "danger"],
    propBased: false,
  },
  {
    name: "ErrorIcon",
    component: ErrorIcon,
    animated: null,
    tags: ["error", "alert", "danger", "warning"],
    propBased: false,
  },
  {
    name: "ExclamationMarkIcon",
    component: ExclamationMarkIcon,
    animated: null,
    tags: [],
    propBased: true,
  },
  {
    name: "ExpandIcon",
    component: ExpandIcon,
    animated: AnimatedExpandIcon,
    tags: ["expand", "fullscreen", "resize"],
    propBased: true,
  },
  {
    name: "EyeClosedIcon",
    component: EyeClosedIcon,
    animated: null,
    tags: ["eye", "closed", "hidden", "invisible"],
    propBased: false,
  },
  {
    name: "EyeIcon",
    component: EyeIcon,
    animated: AnimatedEyeIcon,
    tags: ["eye", "view", "visibility", "show"],
    propBased: true,
  },
  {
    name: "EyeOffIcon",
    component: EyeOffIcon,
    animated: AnimatedEyeOffIcon,
    tags: ["eye", "off", "hidden", "invisible", "hide"],
    propBased: true,
  },
  {
    name: "EyeSlashIcon",
    component: EyeSlashIcon,
    animated: null,
    tags: ["eye", "slash", "hidden", "invisible"],
    propBased: false,
  },
  {
    name: "FacebookIcon",
    component: FacebookIcon,
    animated: null,
    tags: ["facebook", "social", "login"],
    propBased: false,
  },
  {
    name: "FlagIcon",
    component: FlagIcon,
    animated: null,
    tags: ["flag", "report", "bookmark"],
    propBased: true,
  },
  {
    name: "FlameIcon",
    component: FlameIcon,
    animated: AnimatedFlameIcon,
    tags: ["flame", "fire", "hot", "trending", "popular"],
    propBased: true,
  },
  { name: "FlashIcon", component: FlashIcon, animated: null, tags: [], propBased: true },
  {
    name: "FolderIcon",
    component: FolderIcon,
    animated: null,
    tags: ["folder", "directory", "file"],
    propBased: true,
  },
  {
    name: "ForwardIcon",
    component: ForwardIcon,
    animated: null,
    tags: ["forward", "next", "skip"],
    propBased: true,
  },
  {
    name: "GalleryIcon",
    component: GalleryIcon,
    animated: null,
    tags: ["gallery", "image", "photo"],
    propBased: false,
  },
  {
    name: "GameIcon",
    component: GameIcon,
    animated: null,
    tags: ["game", "controller", "play", "joystick"],
    propBased: true,
  },
  {
    name: "GenderIcon",
    component: GenderIcon,
    animated: null,
    tags: ["gender", "identity"],
    propBased: true,
  },
  { name: "GifIcon", component: GifIcon, animated: null, tags: [], propBased: true },
  {
    name: "GiftIcon",
    component: GiftIcon,
    animated: null,
    tags: ["gift", "present", "reward"],
    propBased: true,
  },
  {
    name: "GoogleIcon",
    component: GoogleIcon,
    animated: null,
    tags: ["google", "social", "login"],
    propBased: false,
  },
  {
    name: "GridViewIcon",
    component: GridViewIcon,
    animated: null,
    tags: ["grid", "view", "layout", "gallery"],
    propBased: true,
  },
  {
    name: "HealthIcon",
    component: HealthIcon,
    animated: null,
    tags: ["health", "medical", "heart", "pulse"],
    propBased: true,
  },
  {
    name: "HeartIcon",
    component: HeartIcon,
    animated: AnimatedHeartIcon,
    tags: ["heart", "love", "like", "favorite"],
    propBased: true,
  },
  {
    name: "HelpIcon",
    component: HelpIcon,
    animated: AnimatedHelpIcon,
    tags: ["help", "question", "support"],
    propBased: true,
  },
  {
    name: "HomeIcon",
    component: HomeIcon,
    animated: AnimatedHomeIcon,
    tags: ["home", "house", "main", "start"],
    propBased: true,
  },
  {
    name: "HourglassIcon",
    component: HourglassIcon,
    animated: AnimatedHourglassIcon,
    tags: ["hourglass", "timer", "wait"],
    propBased: true,
  },
  {
    name: "ImageIcon",
    component: ImageIcon,
    animated: null,
    tags: ["image", "photo", "picture", "gallery"],
    propBased: true,
  },
  {
    name: "ImageUploadIcon",
    component: ImageUploadIcon,
    animated: null,
    tags: [],
    propBased: true,
  },
  {
    name: "InboxIcon",
    component: InboxIcon,
    animated: null,
    tags: ["inbox", "mail", "message"],
    propBased: true,
  },
  {
    name: "InfoCircleIcon",
    component: InfoCircleIcon,
    animated: null,
    tags: ["info", "circle", "information"],
    propBased: false,
  },
  {
    name: "InfoIcon",
    component: InfoIcon,
    animated: null,
    tags: ["info", "information", "help"],
    propBased: true,
  },
  {
    name: "LanguageIcon",
    component: LanguageIcon,
    animated: AnimatedLanguageIcon,
    tags: ["language", "translate", "locale", "globe"],
    propBased: true,
  },
  {
    name: "LinkIcon",
    component: LinkIcon,
    animated: AnimatedLinkIcon,
    tags: ["link", "chain", "url"],
    propBased: true,
  },
  {
    name: "ListViewIcon",
    component: ListViewIcon,
    animated: null,
    tags: ["list", "view", "layout", "row"],
    propBased: true,
  },
  {
    name: "LocationIcon",
    component: LocationIcon,
    animated: AnimatedLocationIcon,
    tags: ["location", "map", "pin"],
    propBased: true,
  },
  {
    name: "LockerIcon",
    component: LockerIcon,
    animated: AnimatedLockerIcon,
    tags: ["locker", "lock", "secure", "padlock"],
    propBased: true,
  },
  {
    name: "LockerOffIcon",
    component: LockerOffIcon,
    animated: null,
    tags: ["locker", "off", "unlock", "open"],
    propBased: true,
  },
  {
    name: "LockerOnIcon",
    component: LockerOnIcon,
    animated: null,
    tags: ["locker", "on", "lock", "secure"],
    propBased: false,
  },
  {
    name: "LogoutIcon",
    component: LogoutIcon,
    animated: null,
    tags: ["logout", "exit", "sign out"],
    propBased: true,
  },
  {
    name: "LoveIcon",
    component: LoveIcon,
    animated: null,
    tags: ["love", "heart", "like", "favorite"],
    propBased: true,
  },
  {
    name: "MassMessageIcon",
    component: MassMessageIcon,
    animated: null,
    tags: ["mass", "message", "broadcast", "bulk"],
    propBased: true,
  },
  {
    name: "MegaphoneIcon",
    component: MegaphoneIcon,
    animated: null,
    tags: ["megaphone", "announce", "speaker"],
    propBased: true,
  },
  {
    name: "MenuCloseIcon",
    component: MenuCloseIcon,
    animated: AnimatedMenuCloseIcon,
    tags: ["menu", "close", "sidebar"],
    propBased: true,
  },
  {
    name: "MenuIcon",
    component: MenuIcon,
    animated: AnimatedMenuIcon,
    tags: ["menu", "hamburger", "navigation"],
    propBased: true,
  },
  {
    name: "MenuOpenIcon",
    component: MenuOpenIcon,
    animated: AnimatedMenuOpenIcon,
    tags: ["menu", "open", "sidebar"],
    propBased: true,
  },
  {
    name: "MessageIcon",
    component: MessageIcon,
    animated: null,
    tags: ["message", "chat", "comment"],
    propBased: true,
  },
  {
    name: "MicrophoneIcon",
    component: MicrophoneIcon,
    animated: AnimatedMicrophoneIcon,
    tags: ["microphone", "mic", "audio", "voice"],
    propBased: true,
  },
  {
    name: "MinusIcon",
    component: MinusIcon,
    animated: null,
    tags: ["minus", "subtract", "remove", "decrease"],
    propBased: true,
  },
  {
    name: "MoonIcon",
    component: MoonIcon,
    animated: null,
    tags: ["moon", "night", "dark", "theme"],
    propBased: true,
  },
  {
    name: "MoreIcon",
    component: MoreIcon,
    animated: null,
    tags: ["more", "horizontal", "dots", "ellipsis"],
    propBased: true,
  },
  {
    name: "MoreVerticalIcon",
    component: MoreVerticalIcon,
    animated: null,
    tags: ["more", "vertical", "dots", "ellipsis"],
    propBased: true,
  },
  {
    name: "NewMessageIcon",
    component: NewMessageIcon,
    animated: AnimatedNewMessageIcon,
    tags: ["message", "chat", "comment", "new"],
    propBased: true,
  },
  {
    name: "OpenIcon",
    component: OpenIcon,
    animated: AnimatedOpenIcon,
    tags: ["open", "external", "link", "new window"],
    propBased: false,
  },
  {
    name: "PauseIcon",
    component: PauseIcon,
    animated: null,
    tags: ["pause", "media", "stop"],
    propBased: true,
  },
  {
    name: "PeopleIcon",
    component: PeopleIcon,
    animated: AnimatedPeopleIcon,
    tags: ["people", "users", "group", "followers", "social"],
    propBased: false,
  },
  {
    name: "PhoneIcon",
    component: PhoneIcon,
    animated: AnimatedPhoneIcon,
    tags: ["phone", "call", "contact"],
    propBased: true,
  },
  {
    name: "PhoneOffIcon",
    component: PhoneOffIcon,
    animated: null,
    tags: ["phone", "off", "end", "call"],
    propBased: true,
  },
  { name: "Pin2Icon", component: Pin2Icon, animated: null, tags: [], propBased: true },
  {
    name: "PinIcon",
    component: PinIcon,
    animated: null,
    tags: ["pin", "bookmark", "save"],
    propBased: true,
  },
  {
    name: "PlayIcon",
    component: PlayIcon,
    animated: null,
    tags: ["play", "media", "start", "video"],
    propBased: true,
  },
  {
    name: "PlusIcon",
    component: PlusIcon,
    animated: AnimatedPlusIcon,
    tags: ["plus", "add", "create", "new", "increase"],
    propBased: false,
  },
  {
    name: "PrivacyIcon",
    component: PrivacyIcon,
    animated: null,
    tags: ["privacy", "shield", "secure"],
    propBased: true,
  },
  {
    name: "ProgrammingArrowIcon",
    component: ProgrammingArrowIcon,
    animated: null,
    tags: ["workflow", "branch", "git", "flow", "automation", "programming"],
    propBased: true,
  },
  {
    name: "QueueIcon",
    component: QueueIcon,
    animated: null,
    tags: ["queue", "list", "stack", "order"],
    propBased: true,
  },
  {
    name: "ReceiveMoneyIcon",
    component: ReceiveMoneyIcon,
    animated: null,
    tags: ["receive", "money", "hand", "dollar", "earnings"],
    propBased: true,
  },
  {
    name: "RefreshArrowIcon",
    component: RefreshArrowIcon,
    animated: null,
    tags: ["refresh", "reload", "sync", "automations", "rotate"],
    propBased: true,
  },
  {
    name: "RepeatIcon",
    component: RepeatIcon,
    animated: null,
    tags: ["repeat", "loop", "refresh"],
    propBased: true,
  },
  {
    name: "Reply2Icon",
    component: Reply2Icon,
    animated: null,
    tags: ["reply", "respond", "arrow"],
    propBased: true,
  },
  {
    name: "ReplyIcon",
    component: ReplyIcon,
    animated: null,
    tags: ["reply", "respond", "arrow"],
    propBased: true,
  },
  {
    name: "ReverseIcon",
    component: ReverseIcon,
    animated: AnimatedReverseIcon,
    tags: ["reverse", "undo", "back"],
    propBased: true,
  },
  {
    name: "SearchIcon",
    component: SearchIcon,
    animated: AnimatedSearchIcon,
    tags: ["search", "find", "magnify", "look"],
    propBased: true,
  },
  {
    name: "SendIcon",
    component: SendIcon,
    animated: AnimatedSendIcon,
    tags: ["send", "submit", "paper plane"],
    propBased: true,
  },
  {
    name: "SettingsIcon",
    component: SettingsIcon,
    animated: AnimatedSettingsIcon,
    tags: ["settings", "gear", "config"],
    propBased: true,
  },
  {
    name: "ShareIcon",
    component: ShareIcon,
    animated: null,
    tags: ["share", "social", "send"],
    propBased: true,
  },
  {
    name: "SoundIcon",
    component: SoundIcon,
    animated: AnimatedSoundIcon,
    tags: [],
    propBased: true,
  },
  {
    name: "SpinnerIcon",
    component: SpinnerIcon,
    animated: null,
    tags: ["spinner", "loading", "progress"],
    propBased: false,
  },
  {
    name: "StarIcon",
    component: StarIcon,
    animated: null,
    tags: ["star", "favorite", "rating"],
    propBased: true,
  },
  {
    name: "StopIcon",
    component: StopIcon,
    animated: null,
    tags: ["stop", "halt", "end"],
    propBased: true,
  },
  {
    name: "SuccessIcon",
    component: SuccessIcon,
    animated: null,
    tags: ["success", "check", "done"],
    propBased: false,
  },
  {
    name: "SunIcon",
    component: SunIcon,
    animated: AnimatedSunIcon,
    tags: ["sun", "light", "day", "theme"],
    propBased: true,
  },
  {
    name: "Support2Icon",
    component: Support2Icon,
    animated: null,
    tags: ["support", "help", "lifebuoy"],
    propBased: true,
  },
  {
    name: "SupportIcon",
    component: SupportIcon,
    animated: null,
    tags: ["support", "help", "headset"],
    propBased: true,
  },
  {
    name: "TagIcon",
    component: TagIcon,
    animated: null,
    tags: ["tag", "label", "category"],
    propBased: true,
  },
  {
    name: "TaskIcon",
    component: TaskIcon,
    animated: null,
    tags: ["task", "todo", "checklist"],
    propBased: true,
  },
  {
    name: "ThumbDownFilledIcon",
    component: ThumbDownFilledIcon,
    animated: null,
    tags: ["thumb", "down", "dislike", "filled"],
    propBased: false,
  },
  {
    name: "ThumbDownIcon",
    component: ThumbDownIcon,
    animated: AnimatedThumbDownIcon,
    tags: ["thumb", "down", "dislike"],
    propBased: true,
  },
  {
    name: "ThumbUpFilledIcon",
    component: ThumbUpFilledIcon,
    animated: null,
    tags: ["thumb", "up", "like", "filled"],
    propBased: false,
  },
  {
    name: "ThumbUpIcon",
    component: ThumbUpIcon,
    animated: AnimatedThumbUpIcon,
    tags: ["thumb", "up", "like"],
    propBased: true,
  },
  {
    name: "TickCircleIcon",
    component: TickCircleIcon,
    animated: AnimatedTickCircleIcon,
    tags: ["tick", "circle", "check", "done"],
    propBased: true,
  },
  {
    name: "TickCircleOffIcon",
    component: TickCircleOffIcon,
    animated: null,
    tags: ["tick", "circle", "off", "unchecked"],
    propBased: true,
  },
  {
    name: "TickIcon",
    component: TickIcon,
    animated: AnimatedTickIcon,
    tags: ["tick", "check", "done", "confirm"],
    propBased: true,
  },
  {
    name: "ToolsIcon",
    component: ToolsIcon,
    animated: null,
    tags: ["tools", "wrench", "settings", "fix", "repair"],
    propBased: true,
  },
  {
    name: "TranscationArrowIcon",
    component: TranscationArrowIcon,
    animated: null,
    tags: [],
    propBased: true,
  },
  {
    name: "TrashBinIcon",
    component: TrashBinIcon,
    animated: AnimatedTrashBinIcon,
    tags: ["trash", "bin", "delete", "remove"],
    propBased: false,
  },
  {
    name: "TrashIcon",
    component: TrashIcon,
    animated: AnimatedTrashIcon,
    tags: ["trash", "delete", "remove", "bin", "garbage"],
    propBased: true,
  },
  {
    name: "TrophyIcon",
    component: TrophyIcon,
    animated: null,
    tags: ["trophy", "award", "medal", "achievement"],
    propBased: true,
  },
  {
    name: "TwitterIcon",
    component: TwitterIcon,
    animated: null,
    tags: ["x", "twitter", "social", "login"],
    propBased: false,
  },
  {
    name: "UploadCloudIcon",
    component: UploadCloudIcon,
    animated: AnimatedUploadCloudIcon,
    tags: ["upload", "cloud"],
    propBased: false,
  },
  {
    name: "UploadIcon",
    component: UploadIcon,
    animated: AnimatedUploadIcon,
    tags: ["upload", "send", "file"],
    propBased: true,
  },
  {
    name: "UploadToCloudIcon",
    component: UploadToCloudIcon,
    animated: AnimatedUploadToCloudIcon,
    tags: [],
    propBased: true,
  },
  { name: "UserAIIcon", component: UserAIIcon, animated: null, tags: [], propBased: true },
  {
    name: "UserAddIcon",
    component: UserAddIcon,
    animated: null,
    tags: ["user", "add", "follow", "invite", "new"],
    propBased: true,
  },
  {
    name: "UserCircleIcon",
    component: UserCircleIcon,
    animated: null,
    tags: ["user", "circle", "avatar", "profile"],
    propBased: false,
  },
  {
    name: "UserIcon",
    component: UserIcon,
    animated: null,
    tags: ["user", "person", "profile"],
    propBased: true,
  },
  {
    name: "UserMenuIcon",
    component: UserMenuIcon,
    animated: null,
    tags: ["user", "menu", "profile", "options"],
    propBased: true,
  },
  {
    name: "UsersIcon",
    component: UsersIcon,
    animated: AnimatedUsersIcon,
    tags: ["users", "group", "people", "team"],
    propBased: true,
  },
  {
    name: "VaultIcon",
    component: VaultIcon,
    animated: null,
    tags: ["vault", "safe", "secure", "storage"],
    propBased: true,
  },
  { name: "VerifiedIcon", component: VerifiedIcon, animated: null, tags: [], propBased: true },
  {
    name: "VideoIcon",
    component: VideoIcon,
    animated: null,
    tags: ["video", "camera", "record", "media"],
    propBased: true,
  },
  {
    name: "VipBadgeIcon",
    component: VipBadgeIcon,
    animated: null,
    tags: ["vip", "badge", "premium", "special"],
    propBased: false,
  },
  {
    name: "WalletIcon",
    component: WalletIcon,
    animated: AnimatedWalletIcon,
    tags: ["wallet", "money", "payment"],
    propBased: true,
  },
  {
    name: "WarningIcon",
    component: WarningIcon,
    animated: null,
    tags: ["warning", "caution", "alert"],
    propBased: true,
  },
  {
    name: "WarningTriangleIcon",
    component: WarningTriangleIcon,
    animated: null,
    tags: ["warning", "triangle", "caution"],
    propBased: false,
  },
  {
    name: "WifiIcon",
    component: WifiIcon,
    animated: AnimatedWifiIcon,
    tags: ["wifi", "network", "internet", "connected", "signal"],
    propBased: true,
  },
  {
    name: "WifiOffIcon",
    component: WifiOffIcon,
    animated: null,
    tags: ["wifi", "off", "disconnected"],
    propBased: true,
  },
  {
    name: "WifiOnIcon",
    component: WifiOnIcon,
    animated: null,
    tags: ["wifi", "on", "connected", "internet"],
    propBased: false,
  },
  {
    name: "WrenchIcon",
    component: WrenchIcon,
    animated: AnimatedWrenchIcon,
    tags: ["wrench", "tool", "settings", "fix"],
    propBased: false,
  },
];

type SizeOption = { label: string; className: string; numeric: 16 | 24 | 32 };
const SIZE_OPTIONS: SizeOption[] = [
  { label: "16", className: "size-4", numeric: 16 },
  { label: "24", className: "size-6", numeric: 24 },
  { label: "32", className: "size-8", numeric: 32 },
];

function IconCard({
  entry,
  sizeClass,
  numeric,
  filled,
  animated,
}: {
  entry: IconEntry;
  sizeClass: string;
  numeric: 16 | 24 | 32;
  filled: boolean;
  animated: boolean;
}) {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);
  const showAnimated = animated && entry.animated !== null;
  const Icon = showAnimated && entry.animated ? entry.animated : entry.component;
  // The icon is not focusable, so the card drives it: hover, and focus for
  // keyboard users.
  const controlRef = useRef<AnimatedIconHandle>(null);
  const play = () => controlRef.current?.startAnimation();
  const settle = () => controlRef.current?.stopAnimation();

  const importText = `import { ${entry.name} } from "${
    showAnimated ? "@fanvue/ui/animated-icons" : "@fanvue/ui"
  }";`;

  const handleCopy = () => {
    navigator.clipboard.writeText(importText).then(() => {
      setCopied(true);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setCopied(false), 1500);
    });
  };

  const propExtras: Record<string, unknown> = {};
  if (entry.propBased) {
    propExtras.size = numeric;
    // The animated artwork is stroke-only, so it has no filled variant.
    if (filled && !showAnimated) propExtras.filled = true;
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        padding: 16,
        borderRadius: 8,
        border: "1px solid var(--color-neutral-alphas-100)",
        backgroundColor: copied
          ? "var(--color-success-surface)"
          : "var(--color-neutral-alphas-100)",
        cursor: "pointer",
        transition: "background-color 150ms, border-color 150ms",
        width: "100%",
        position: "relative",
        borderStyle: animated && entry.animated === null ? "dashed" : "solid",
      }}
      aria-label={`${entry.name} — ${
        entry.animated !== null ? "has an animated twin" : "static only"
      }. Click to copy ${importText}`}
      title={`Click to copy: ${importText}`}
      onMouseEnter={play}
      onMouseLeave={settle}
      onFocus={play}
      onBlur={settle}
    >
      {entry.animated !== null && (
        <span
          aria-hidden="true"
          style={{
            position: "absolute",
            top: 4,
            left: 6,
            fontSize: 9,
            fontFamily: "monospace",
            color: showAnimated
              ? "var(--color-brand-secondary-default)"
              : "var(--color-content-tertiary)",
          }}
        >
          anim
        </span>
      )}
      {entry.propBased && (
        <span
          aria-hidden="true"
          style={{
            position: "absolute",
            top: 4,
            right: 6,
            fontSize: 9,
            fontFamily: "monospace",
            color: "var(--color-content-tertiary)",
          }}
        >
          v2
        </span>
      )}
      <Icon
        className={sizeClass}
        style={{ color: "var(--color-content-primary)" }}
        {...(showAnimated ? { controlRef } : {})}
        {...propExtras}
      />
      <span
        style={{
          fontSize: 11,
          fontFamily: "monospace",
          color: copied ? "var(--color-success-content)" : "var(--color-content-secondary)",
          textAlign: "center",
          wordBreak: "break-all",
        }}
      >
        {copied ? "Copied!" : entry.name}
      </span>
    </button>
  );
}

function IconGallery() {
  const [search, setSearch] = useState("");
  const [sizeLabel, setSizeLabel] = useState<"16" | "24" | "32">("24");
  const [filled, setFilled] = useState(false);
  const [animated, setAnimated] = useState(false);
  const animatedCount = icons.filter((icon) => icon.animated !== null).length;

  const size: SizeOption = SIZE_OPTIONS.find((s) => s.label === sizeLabel) ?? {
    label: "24",
    className: "size-6",
    numeric: 24,
  };

  const filtered = icons.filter((icon) => {
    const q = search.toLowerCase();
    if (!q) return true;
    return icon.name.toLowerCase().includes(q) || icon.tags.some((tag) => tag.includes(q));
  });

  return (
    <div style={{ padding: "40px 48px", maxWidth: 960, fontFamily: "Inter, sans-serif" }}>
      <h1
        style={{
          fontSize: 32,
          fontWeight: 800,
          color: "var(--color-content-primary)",
          margin: "0 0 8px",
        }}
      >
        Icons
      </h1>
      <p
        style={{
          fontSize: 16,
          color: "var(--color-content-secondary)",
          margin: "0 0 12px",
          maxWidth: 640,
          lineHeight: 1.5,
        }}
      >
        {icons.length} icons available. Icons marked{" "}
        <code
          style={{
            fontSize: 12,
            fontFamily: "monospace",
            padding: "1px 4px",
            backgroundColor: "var(--color-neutral-alphas-100)",
            borderRadius: 3,
          }}
        >
          v2
        </code>{" "}
        support the prop-based API with dedicated path data at 16, 24, and 32 px sizes plus an
        outlined/filled toggle. {animatedCount} are marked{" "}
        <code
          style={{
            fontSize: 12,
            fontFamily: "monospace",
            padding: "1px 4px",
            backgroundColor: "var(--color-neutral-alphas-100)",
            borderRadius: 3,
          }}
        >
          anim
        </code>{" "}
        and have an animated twin of the same name on{" "}
        <code
          style={{
            fontSize: 12,
            fontFamily: "monospace",
            padding: "1px 4px",
            backgroundColor: "var(--color-neutral-alphas-100)",
            borderRadius: 3,
          }}
        >
          @fanvue/ui/animated-icons
        </code>
        . Turn on <b>animated</b> below to preview them (hover or focus a card) and copy that import
        instead. They render in exactly the same box as the static icon, so swapping the import
        never moves your layout. Requires the optional{" "}
        <code
          style={{
            fontSize: 12,
            fontFamily: "monospace",
            padding: "1px 4px",
            backgroundColor: "var(--color-neutral-alphas-100)",
            borderRadius: 3,
          }}
        >
          motion
        </code>{" "}
        peer dependency, and animated icons are stroke-only (no filled variant).
      </p>

      <div style={{ display: "flex", gap: 8, margin: "0 0 12px", flexWrap: "wrap" }}>
        <code
          style={{
            fontSize: 13,
            fontFamily: "monospace",
            color: "var(--color-content-tertiary)",
            padding: "8px 12px",
            backgroundColor: "var(--color-neutral-alphas-100)",
            borderRadius: 6,
          }}
        >
          {animated
            ? 'import { HeartIcon } from "@fanvue/ui/animated-icons";'
            : "<HeartIcon size={24} filled />"}
        </code>
      </div>

      <div
        style={{
          display: "flex",
          gap: 12,
          margin: "24px 0 24px",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <input
          type="text"
          placeholder="Search icons..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            flex: 1,
            minWidth: 200,
            maxWidth: 320,
            padding: "8px 12px",
            fontSize: 14,
            borderRadius: 6,
            border: "1px solid var(--color-neutral-alphas-200)",
            backgroundColor: "var(--color-inputs-inputs-primary)",
            color: "var(--color-content-primary)",
            outline: "none",
          }}
        />
        <div style={{ display: "flex", gap: 4 }}>
          {SIZE_OPTIONS.map((opt) => (
            <button
              key={opt.label}
              type="button"
              onClick={() => setSizeLabel(opt.label as "16" | "24" | "32")}
              style={{
                padding: "6px 10px",
                fontSize: 12,
                fontFamily: "monospace",
                borderRadius: 4,
                border: "1px solid var(--color-neutral-alphas-200)",
                backgroundColor:
                  sizeLabel === opt.label
                    ? "var(--color-brand-secondary-default)"
                    : "var(--color-neutral-alphas-100)",
                color: sizeLabel === opt.label ? "#fff" : "var(--color-content-secondary)",
                cursor: "pointer",
              }}
            >
              {opt.label}px
            </button>
          ))}
        </div>
        <label
          style={{
            display: "inline-flex",
            gap: 6,
            alignItems: "center",
            fontSize: 12,
            fontFamily: "monospace",
            color: "var(--color-content-secondary)",
            cursor: "pointer",
          }}
        >
          <input type="checkbox" checked={filled} onChange={(e) => setFilled(e.target.checked)} />
          filled
        </label>
        <label
          style={{
            display: "inline-flex",
            gap: 6,
            alignItems: "center",
            fontSize: 12,
            fontFamily: "monospace",
            color: "var(--color-content-secondary)",
            cursor: "pointer",
          }}
        >
          <input
            type="checkbox"
            checked={animated}
            onChange={(e) => setAnimated(e.target.checked)}
          />
          animated
        </label>
      </div>

      {filtered.length === 0 ? (
        <p style={{ color: "var(--color-content-secondary)", fontSize: 14, padding: "40px 0" }}>
          No icons matching "{search}".
        </p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))",
            gap: 8,
          }}
        >
          {filtered.map((entry) => (
            <IconCard
              key={entry.name}
              entry={entry}
              sizeClass={size.className}
              numeric={size.numeric}
              filled={filled}
              animated={animated}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export const Gallery: Story = {
  render: () => <IconGallery />,
};
