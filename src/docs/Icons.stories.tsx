import type { Meta, StoryObj } from "@storybook/react";
import { type ComponentType, useEffect, useRef, useState } from "react";
import { AddIcon } from "../components/Icons/AddIcon";
import { AI2Icon } from "../components/Icons/AI2Icon";
import { AIDisclosureIcon } from "../components/Icons/AIDisclosureIcon";
import { AIIcon } from "../components/Icons/AIIcon";
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
import { CoinIcon } from "../components/Icons/CoinIcon";
import { CompassIcon } from "../components/Icons/CompassIcon";
import { CopyIcon } from "../components/Icons/CopyIcon";
import { CrossIcon } from "../components/Icons/CrossIcon";
import { CrownIcon } from "../components/Icons/CrownIcon";
import { DiamondIcon } from "../components/Icons/DiamondIcon";
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
import { FolderIcon } from "../components/Icons/FolderIcon";
import { ForwardIcon } from "../components/Icons/ForwardIcon";
import { GalleryIcon } from "../components/Icons/GalleryIcon";
import { GameIcon } from "../components/Icons/GameIcon";
import { GenderIcon } from "../components/Icons/GenderIcon";
import { GiftIcon } from "../components/Icons/GiftIcon";
import { GoogleIcon } from "../components/Icons/GoogleIcon";
import { HealthIcon } from "../components/Icons/HealthIcon";
import { HeartIcon } from "../components/Icons/HeartIcon";
import { HelpIcon } from "../components/Icons/HelpIcon";
import { HomeIcon } from "../components/Icons/HomeIcon";
import { HourglassIcon } from "../components/Icons/HourglassIcon";
import { ImageIcon } from "../components/Icons/ImageIcon";
import { InboxIcon } from "../components/Icons/InboxIcon";
import { InfoCircleIcon } from "../components/Icons/InfoCircleIcon";
import { InfoIcon } from "../components/Icons/InfoIcon";
import { LanguageIcon } from "../components/Icons/LanguageIcon";
import { LinkIcon } from "../components/Icons/LinkIcon";
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
import { PinIcon } from "../components/Icons/PinIcon";
import { PlayIcon } from "../components/Icons/PlayIcon";
import { PlusIcon } from "../components/Icons/PlusIcon";
import { PrivacyIcon } from "../components/Icons/PrivacyIcon";
import { QueueIcon } from "../components/Icons/QueueIcon";
import { RepeatIcon } from "../components/Icons/RepeatIcon";
import { Reply2Icon } from "../components/Icons/Reply2Icon";
import { ReplyIcon } from "../components/Icons/ReplyIcon";
import { ReverseIcon } from "../components/Icons/ReverseIcon";
import { SearchIcon } from "../components/Icons/SearchIcon";
import { SendIcon } from "../components/Icons/SendIcon";
import { SettingsIcon } from "../components/Icons/SettingsIcon";
import { ShareIcon } from "../components/Icons/ShareIcon";
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
    tags: ["ai", "artificial", "intelligence", "sparkle", "alt"],
    propBased: true,
  },
  { name: "AIDisclosureIcon", component: AIDisclosureIcon, tags: [], propBased: true },
  {
    name: "AIIcon",
    component: AIIcon,
    tags: ["ai", "artificial", "intelligence", "machine"],
    propBased: true,
  },
  { name: "AddIcon", component: AddIcon, tags: ["add", "plus", "create", "new"], propBased: true },
  {
    name: "AlertIcon",
    component: AlertIcon,
    tags: ["alert", "warning", "exclamation"],
    propBased: true,
  },
  {
    name: "AppsIcon",
    component: AppsIcon,
    tags: ["apps", "grid", "applications", "menu"],
    propBased: true,
  },
  {
    name: "ArrowDownIcon",
    component: ArrowDownIcon,
    tags: ["arrow", "down", "navigation"],
    propBased: true,
  },
  {
    name: "ArrowLeftIcon",
    component: ArrowLeftIcon,
    tags: ["arrow", "left", "back", "navigation"],
    propBased: true,
  },
  {
    name: "ArrowRightIcon",
    component: ArrowRightIcon,
    tags: ["arrow", "right", "navigation", "next"],
    propBased: true,
  },
  {
    name: "ArrowUpIcon",
    component: ArrowUpIcon,
    tags: ["arrow", "up", "navigation"],
    propBased: true,
  },
  {
    name: "ArrowUpRightIcon",
    component: ArrowUpRightIcon,
    tags: ["arrow", "up", "right", "external", "link"],
    propBased: false,
  },
  {
    name: "AtSignIcon",
    component: AtSignIcon,
    tags: ["at", "mention", "email", "sign"],
    propBased: true,
  },
  {
    name: "AutoMessageIcon",
    component: AutoMessageIcon,
    tags: ["auto", "message", "automatic", "bot", "automation"],
    propBased: true,
  },
  {
    name: "BankIcon",
    component: BankIcon,
    tags: ["bank", "login", "enter", "door"],
    propBased: true,
  },
  {
    name: "BellIcon",
    component: BellIcon,
    tags: ["bell", "notification", "alarm"],
    propBased: true,
  },
  {
    name: "BellOffIcon",
    component: BellOffIcon,
    tags: ["bell", "off", "mute", "notification"],
    propBased: true,
  },
  {
    name: "BoltIcon",
    component: BoltIcon,
    tags: ["bolt", "lightning", "power", "energy"],
    propBased: true,
  },
  {
    name: "BulbIcon",
    component: BulbIcon,
    tags: ["bulb", "light", "idea", "lamp"],
    propBased: true,
  },
  {
    name: "Calendar2Icon",
    component: Calendar2Icon,
    tags: ["calendar", "date", "schedule", "simple"],
    propBased: true,
  },
  {
    name: "CalendarIcon",
    component: CalendarIcon,
    tags: ["calendar", "date", "schedule"],
    propBased: true,
  },
  {
    name: "CameraIcon",
    component: CameraIcon,
    tags: ["camera", "photo", "capture"],
    propBased: false,
  },
  {
    name: "CardIcon",
    component: CardIcon,
    tags: ["card", "credit", "payment", "wallet"],
    propBased: true,
  },
  {
    name: "ChartIcon",
    component: ChartIcon,
    tags: ["chart", "love", "heart", "analytics"],
    propBased: true,
  },
  {
    name: "CheckBoxOffIcon",
    component: CheckBoxOffIcon,
    tags: ["checkbox", "unchecked", "empty", "square", "off"],
    propBased: true,
  },
  {
    name: "CheckBoxOnIcon",
    component: CheckBoxOnIcon,
    tags: ["checkbox", "checked", "ticked", "on"],
    propBased: true,
  },
  {
    name: "CheckCircleIcon",
    component: CheckCircleIcon,
    tags: ["check", "circle", "success", "done"],
    propBased: false,
  },
  {
    name: "CheckIcon",
    component: CheckIcon,
    tags: ["check", "tick", "done", "confirm"],
    propBased: false,
  },
  {
    name: "CheckOutlineIcon",
    component: CheckOutlineIcon,
    tags: ["check", "outline", "circle", "confirm"],
    propBased: false,
  },
  {
    name: "ChevronDownIcon",
    component: ChevronDownIcon,
    tags: ["chevron", "down", "arrow", "expand"],
    propBased: true,
  },
  {
    name: "ChevronLeftIcon",
    component: ChevronLeftIcon,
    tags: ["chevron", "left", "arrow", "back"],
    propBased: true,
  },
  {
    name: "ChevronRightIcon",
    component: ChevronRightIcon,
    tags: ["chevron", "right", "arrow", "next"],
    propBased: true,
  },
  {
    name: "ChevronUpIcon",
    component: ChevronUpIcon,
    tags: ["chevron", "up", "arrow", "collapse"],
    propBased: true,
  },
  { name: "ClockIcon", component: ClockIcon, tags: ["clock", "time", "schedule"], propBased: true },
  {
    name: "CloseIcon",
    component: CloseIcon,
    tags: ["close", "x", "dismiss", "remove"],
    propBased: true,
  },
  {
    name: "CodeIcon",
    component: CodeIcon,
    tags: ["code", "brackets", "programming"],
    propBased: true,
  },
  {
    name: "CoinIcon",
    component: CoinIcon,
    tags: ["coin", "money", "currency", "star"],
    propBased: true,
  },
  {
    name: "CompassIcon",
    component: CompassIcon,
    tags: ["compass", "navigation", "direction", "explore"],
    propBased: true,
  },
  {
    name: "CopyIcon",
    component: CopyIcon,
    tags: ["copy", "duplicate", "clipboard", "paste"],
    propBased: true,
  },
  {
    name: "CrossIcon",
    component: CrossIcon,
    tags: ["cross", "x", "close", "cancel", "remove"],
    propBased: false,
  },
  {
    name: "CrownIcon",
    component: CrownIcon,
    tags: ["crown", "premium", "vip", "special"],
    propBased: true,
  },
  {
    name: "DiamondIcon",
    component: DiamondIcon,
    tags: ["diamond", "gem", "premium"],
    propBased: true,
  },
  {
    name: "DiscountIcon",
    component: DiscountIcon,
    tags: ["discount", "sale", "percent"],
    propBased: true,
  },
  { name: "DonateIcon", component: DonateIcon, tags: ["donate", "gift", "give"], propBased: true },
  {
    name: "DoubleTickIcon",
    component: DoubleTickIcon,
    tags: ["double", "tick", "check", "read"],
    propBased: true,
  },
  {
    name: "DownloadIcon",
    component: DownloadIcon,
    tags: ["download", "save", "file"],
    propBased: true,
  },
  {
    name: "EditIcon",
    component: EditIcon,
    tags: ["edit", "pen", "write", "modify"],
    propBased: true,
  },
  {
    name: "EmojiIcon",
    component: EmojiIcon,
    tags: ["emoji", "smiley", "face", "happy"],
    propBased: false,
  },
  {
    name: "ErrorCircleIcon",
    component: ErrorCircleIcon,
    tags: ["error", "circle", "alert", "danger"],
    propBased: false,
  },
  {
    name: "ErrorIcon",
    component: ErrorIcon,
    tags: ["error", "alert", "danger", "warning"],
    propBased: false,
  },
  { name: "ExclamationMarkIcon", component: ExclamationMarkIcon, tags: [], propBased: true },
  {
    name: "ExpandIcon",
    component: ExpandIcon,
    tags: ["expand", "fullscreen", "resize"],
    propBased: true,
  },
  {
    name: "EyeClosedIcon",
    component: EyeClosedIcon,
    tags: ["eye", "closed", "hidden", "invisible"],
    propBased: false,
  },
  {
    name: "EyeIcon",
    component: EyeIcon,
    tags: ["eye", "view", "visibility", "show"],
    propBased: true,
  },
  {
    name: "EyeOffIcon",
    component: EyeOffIcon,
    tags: ["eye", "off", "hidden", "invisible", "hide"],
    propBased: true,
  },
  {
    name: "EyeSlashIcon",
    component: EyeSlashIcon,
    tags: ["eye", "slash", "hidden", "invisible"],
    propBased: false,
  },
  {
    name: "FacebookIcon",
    component: FacebookIcon,
    tags: ["facebook", "social", "login"],
    propBased: false,
  },
  { name: "FlagIcon", component: FlagIcon, tags: ["flag", "report", "bookmark"], propBased: true },
  {
    name: "FlameIcon",
    component: FlameIcon,
    tags: ["flame", "fire", "hot", "trending", "popular"],
    propBased: true,
  },
  {
    name: "FolderIcon",
    component: FolderIcon,
    tags: ["folder", "directory", "file"],
    propBased: true,
  },
  {
    name: "ForwardIcon",
    component: ForwardIcon,
    tags: ["forward", "next", "skip"],
    propBased: true,
  },
  {
    name: "GalleryIcon",
    component: GalleryIcon,
    tags: ["gallery", "image", "photo"],
    propBased: false,
  },
  {
    name: "GameIcon",
    component: GameIcon,
    tags: ["game", "controller", "play", "joystick"],
    propBased: true,
  },
  { name: "GenderIcon", component: GenderIcon, tags: ["gender", "identity"], propBased: true },
  { name: "GiftIcon", component: GiftIcon, tags: ["gift", "present", "reward"], propBased: true },
  {
    name: "GoogleIcon",
    component: GoogleIcon,
    tags: ["google", "social", "login"],
    propBased: false,
  },
  {
    name: "HealthIcon",
    component: HealthIcon,
    tags: ["health", "medical", "heart", "pulse"],
    propBased: true,
  },
  {
    name: "HeartIcon",
    component: HeartIcon,
    tags: ["heart", "love", "like", "favorite"],
    propBased: true,
  },
  { name: "HelpIcon", component: HelpIcon, tags: ["help", "question", "support"], propBased: true },
  {
    name: "HomeIcon",
    component: HomeIcon,
    tags: ["home", "house", "main", "start"],
    propBased: true,
  },
  {
    name: "HourglassIcon",
    component: HourglassIcon,
    tags: ["hourglass", "timer", "wait"],
    propBased: true,
  },
  {
    name: "ImageIcon",
    component: ImageIcon,
    tags: ["image", "photo", "picture", "gallery"],
    propBased: true,
  },
  { name: "InboxIcon", component: InboxIcon, tags: ["inbox", "mail", "message"], propBased: true },
  {
    name: "InfoCircleIcon",
    component: InfoCircleIcon,
    tags: ["info", "circle", "information"],
    propBased: false,
  },
  { name: "InfoIcon", component: InfoIcon, tags: ["info", "information", "help"], propBased: true },
  {
    name: "LanguageIcon",
    component: LanguageIcon,
    tags: ["language", "translate", "locale", "globe"],
    propBased: true,
  },
  { name: "LinkIcon", component: LinkIcon, tags: ["link", "chain", "url"], propBased: true },
  {
    name: "LocationIcon",
    component: LocationIcon,
    tags: ["location", "map", "pin"],
    propBased: true,
  },
  {
    name: "LockerIcon",
    component: LockerIcon,
    tags: ["locker", "lock", "secure", "padlock"],
    propBased: true,
  },
  {
    name: "LockerOffIcon",
    component: LockerOffIcon,
    tags: ["locker", "off", "unlock", "open"],
    propBased: true,
  },
  {
    name: "LockerOnIcon",
    component: LockerOnIcon,
    tags: ["locker", "on", "lock", "secure"],
    propBased: false,
  },
  {
    name: "LogoutIcon",
    component: LogoutIcon,
    tags: ["logout", "exit", "sign out"],
    propBased: true,
  },
  {
    name: "LoveIcon",
    component: LoveIcon,
    tags: ["love", "heart", "like", "favorite"],
    propBased: true,
  },
  {
    name: "MassMessageIcon",
    component: MassMessageIcon,
    tags: ["mass", "message", "broadcast", "bulk"],
    propBased: true,
  },
  {
    name: "MegaphoneIcon",
    component: MegaphoneIcon,
    tags: ["megaphone", "announce", "speaker"],
    propBased: true,
  },
  {
    name: "MenuCloseIcon",
    component: MenuCloseIcon,
    tags: ["menu", "close", "sidebar"],
    propBased: true,
  },
  {
    name: "MenuIcon",
    component: MenuIcon,
    tags: ["menu", "hamburger", "navigation"],
    propBased: true,
  },
  {
    name: "MenuOpenIcon",
    component: MenuOpenIcon,
    tags: ["menu", "open", "sidebar"],
    propBased: true,
  },
  {
    name: "MessageIcon",
    component: MessageIcon,
    tags: ["message", "chat", "comment"],
    propBased: true,
  },
  {
    name: "MicrophoneIcon",
    component: MicrophoneIcon,
    tags: ["microphone", "mic", "audio", "voice"],
    propBased: true,
  },
  {
    name: "MinusIcon",
    component: MinusIcon,
    tags: ["minus", "subtract", "remove", "decrease"],
    propBased: true,
  },
  {
    name: "MoonIcon",
    component: MoonIcon,
    tags: ["moon", "night", "dark", "theme"],
    propBased: true,
  },
  {
    name: "MoreIcon",
    component: MoreIcon,
    tags: ["more", "horizontal", "dots", "ellipsis"],
    propBased: true,
  },
  {
    name: "MoreVerticalIcon",
    component: MoreVerticalIcon,
    tags: ["more", "vertical", "dots", "ellipsis"],
    propBased: true,
  },
  {
    name: "NewMessageIcon",
    component: NewMessageIcon,
    tags: ["message", "chat", "comment", "new"],
    propBased: true,
  },
  {
    name: "OpenIcon",
    component: OpenIcon,
    tags: ["open", "external", "link", "new window"],
    propBased: false,
  },
  { name: "PauseIcon", component: PauseIcon, tags: ["pause", "media", "stop"], propBased: true },
  {
    name: "PeopleIcon",
    component: PeopleIcon,
    tags: ["people", "users", "group", "followers", "social"],
    propBased: false,
  },
  { name: "PhoneIcon", component: PhoneIcon, tags: ["phone", "call", "contact"], propBased: true },
  {
    name: "PhoneOffIcon",
    component: PhoneOffIcon,
    tags: ["phone", "off", "end", "call"],
    propBased: true,
  },
  { name: "PinIcon", component: PinIcon, tags: ["pin", "bookmark", "save"], propBased: true },
  {
    name: "PlayIcon",
    component: PlayIcon,
    tags: ["play", "media", "start", "video"],
    propBased: true,
  },
  {
    name: "PlusIcon",
    component: PlusIcon,
    tags: ["plus", "add", "create", "new", "increase"],
    propBased: false,
  },
  {
    name: "PrivacyIcon",
    component: PrivacyIcon,
    tags: ["privacy", "shield", "secure"],
    propBased: true,
  },
  {
    name: "QueueIcon",
    component: QueueIcon,
    tags: ["queue", "list", "stack", "order"],
    propBased: true,
  },
  {
    name: "RepeatIcon",
    component: RepeatIcon,
    tags: ["repeat", "loop", "refresh"],
    propBased: true,
  },
  {
    name: "Reply2Icon",
    component: Reply2Icon,
    tags: ["reply", "respond", "arrow"],
    propBased: true,
  },
  { name: "ReplyIcon", component: ReplyIcon, tags: ["reply", "respond", "arrow"], propBased: true },
  {
    name: "ReverseIcon",
    component: ReverseIcon,
    tags: ["reverse", "undo", "back"],
    propBased: true,
  },
  {
    name: "SearchIcon",
    component: SearchIcon,
    tags: ["search", "find", "magnify", "look"],
    propBased: true,
  },
  {
    name: "SendIcon",
    component: SendIcon,
    tags: ["send", "submit", "paper plane"],
    propBased: true,
  },
  {
    name: "SettingsIcon",
    component: SettingsIcon,
    tags: ["settings", "gear", "config"],
    propBased: true,
  },
  { name: "ShareIcon", component: ShareIcon, tags: ["share", "social", "send"], propBased: true },
  {
    name: "SpinnerIcon",
    component: SpinnerIcon,
    tags: ["spinner", "loading", "progress"],
    propBased: false,
  },
  { name: "StarIcon", component: StarIcon, tags: ["star", "favorite", "rating"], propBased: true },
  { name: "StopIcon", component: StopIcon, tags: ["stop", "halt", "end"], propBased: true },
  {
    name: "SuccessIcon",
    component: SuccessIcon,
    tags: ["success", "check", "done"],
    propBased: false,
  },
  { name: "SunIcon", component: SunIcon, tags: ["sun", "light", "day", "theme"], propBased: true },
  {
    name: "Support2Icon",
    component: Support2Icon,
    tags: ["support", "help", "lifebuoy"],
    propBased: true,
  },
  {
    name: "SupportIcon",
    component: SupportIcon,
    tags: ["support", "help", "headset"],
    propBased: true,
  },
  { name: "TagIcon", component: TagIcon, tags: ["tag", "label", "category"], propBased: true },
  { name: "TaskIcon", component: TaskIcon, tags: ["task", "todo", "checklist"], propBased: true },
  {
    name: "ThumbDownFilledIcon",
    component: ThumbDownFilledIcon,
    tags: ["thumb", "down", "dislike", "filled"],
    propBased: false,
  },
  {
    name: "ThumbDownIcon",
    component: ThumbDownIcon,
    tags: ["thumb", "down", "dislike"],
    propBased: true,
  },
  {
    name: "ThumbUpFilledIcon",
    component: ThumbUpFilledIcon,
    tags: ["thumb", "up", "like", "filled"],
    propBased: false,
  },
  { name: "ThumbUpIcon", component: ThumbUpIcon, tags: ["thumb", "up", "like"], propBased: true },
  {
    name: "TickCircleIcon",
    component: TickCircleIcon,
    tags: ["tick", "circle", "check", "done"],
    propBased: true,
  },
  {
    name: "TickCircleOffIcon",
    component: TickCircleOffIcon,
    tags: ["tick", "circle", "off", "unchecked"],
    propBased: true,
  },
  {
    name: "TickIcon",
    component: TickIcon,
    tags: ["tick", "check", "done", "confirm"],
    propBased: true,
  },
  {
    name: "ToolsIcon",
    component: ToolsIcon,
    tags: ["tools", "wrench", "settings", "fix", "repair"],
    propBased: true,
  },
  {
    name: "TrashBinIcon",
    component: TrashBinIcon,
    tags: ["trash", "bin", "delete", "remove"],
    propBased: false,
  },
  {
    name: "TrashIcon",
    component: TrashIcon,
    tags: ["trash", "delete", "remove", "bin", "garbage"],
    propBased: true,
  },
  {
    name: "TrophyIcon",
    component: TrophyIcon,
    tags: ["trophy", "award", "medal", "achievement"],
    propBased: true,
  },
  {
    name: "TwitterIcon",
    component: TwitterIcon,
    tags: ["x", "twitter", "social", "login"],
    propBased: false,
  },
  {
    name: "UploadCloudIcon",
    component: UploadCloudIcon,
    tags: ["upload", "cloud"],
    propBased: false,
  },
  { name: "UploadIcon", component: UploadIcon, tags: ["upload", "send", "file"], propBased: true },
  { name: "UploadToCloudIcon", component: UploadToCloudIcon, tags: [], propBased: true },
  { name: "UserAIIcon", component: UserAIIcon, tags: [], propBased: true },
  {
    name: "UserAddIcon",
    component: UserAddIcon,
    tags: ["user", "add", "follow", "invite", "new"],
    propBased: true,
  },
  {
    name: "UserCircleIcon",
    component: UserCircleIcon,
    tags: ["user", "circle", "avatar", "profile"],
    propBased: false,
  },
  { name: "UserIcon", component: UserIcon, tags: ["user", "person", "profile"], propBased: true },
  {
    name: "UserMenuIcon",
    component: UserMenuIcon,
    tags: ["user", "menu", "profile", "options"],
    propBased: true,
  },
  {
    name: "UsersIcon",
    component: UsersIcon,
    tags: ["users", "group", "people", "team"],
    propBased: true,
  },
  {
    name: "VaultIcon",
    component: VaultIcon,
    tags: ["vault", "safe", "secure", "storage"],
    propBased: true,
  },
  {
    name: "VideoIcon",
    component: VideoIcon,
    tags: ["video", "camera", "record", "media"],
    propBased: true,
  },
  {
    name: "VipBadgeIcon",
    component: VipBadgeIcon,
    tags: ["vip", "badge", "premium", "special"],
    propBased: false,
  },
  {
    name: "WalletIcon",
    component: WalletIcon,
    tags: ["wallet", "money", "payment"],
    propBased: true,
  },
  {
    name: "WarningIcon",
    component: WarningIcon,
    tags: ["warning", "caution", "alert"],
    propBased: true,
  },
  {
    name: "WarningTriangleIcon",
    component: WarningTriangleIcon,
    tags: ["warning", "triangle", "caution"],
    propBased: false,
  },
  {
    name: "WifiIcon",
    component: WifiIcon,
    tags: ["wifi", "network", "internet", "connected", "signal"],
    propBased: true,
  },
  {
    name: "WifiOffIcon",
    component: WifiOffIcon,
    tags: ["wifi", "off", "disconnected"],
    propBased: true,
  },
  {
    name: "WifiOnIcon",
    component: WifiOnIcon,
    tags: ["wifi", "on", "connected", "internet"],
    propBased: false,
  },
  {
    name: "WrenchIcon",
    component: WrenchIcon,
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
}: {
  entry: IconEntry;
  sizeClass: string;
  numeric: 16 | 24 | 32;
  filled: boolean;
}) {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);
  const Icon = entry.component;

  const importText = `import { ${entry.name} } from "@fanvue/ui";`;

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
    if (filled) propExtras.filled = true;
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
      }}
      title={`Click to copy: ${importText}`}
    >
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
        outlined/filled toggle.
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
          {"<HeartIcon size={24} filled />"}
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
            backgroundColor: "var(--color-surface-inputs)",
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
