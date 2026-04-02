import type { Meta, StoryObj } from "@storybook/react";
import { type ComponentType, useState } from "react";
import { AddIcon } from "../components/Icons/AddIcon";
import { AIIcon } from "../components/Icons/AIIcon";
import { AlertIcon } from "../components/Icons/AlertIcon";
import { ArrowDownIcon } from "../components/Icons/ArrowDownIcon";
import { ArrowLeftIcon } from "../components/Icons/ArrowLeftIcon";
import { ArrowRightIcon } from "../components/Icons/ArrowRightIcon";
import { ArrowUpIcon } from "../components/Icons/ArrowUpIcon";
import { ArrowUpRightIcon } from "../components/Icons/ArrowUpRightIcon";
import { BankIcon } from "../components/Icons/BankIcon";
import { BellIcon } from "../components/Icons/BellIcon";
import { BellOffIcon } from "../components/Icons/BellOffIcon";
import { BoltIcon } from "../components/Icons/BoltIcon";
import { BulbIcon } from "../components/Icons/BulbIcon";
import { Calendar2Icon } from "../components/Icons/Calendar2Icon";
import { CalendarIcon } from "../components/Icons/CalendarIcon";
import { CameraIcon } from "../components/Icons/CameraIcon";
import { ChartIcon } from "../components/Icons/ChartIcon";
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
import { ExpandIcon } from "../components/Icons/ExpandIcon";
import { EyeClosedIcon } from "../components/Icons/EyeClosedIcon";
import { EyeIcon } from "../components/Icons/EyeIcon";
import { EyeSlashIcon } from "../components/Icons/EyeSlashIcon";
import { FacebookIcon } from "../components/Icons/FacebookIcon";
import { FlagIcon } from "../components/Icons/FlagIcon";
import { FlameIcon } from "../components/Icons/FlameIcon";
import { FolderIcon } from "../components/Icons/FolderIcon";
import { ForwardIcon } from "../components/Icons/ForwardIcon";
import { GalleryIcon } from "../components/Icons/GalleryIcon";
import { GenderIcon } from "../components/Icons/GenderIcon";
import { GiftIcon } from "../components/Icons/GiftIcon";
import { GoogleIcon } from "../components/Icons/GoogleIcon";
import { HelpIcon } from "../components/Icons/HelpIcon";
import { HomeIcon } from "../components/Icons/HomeIcon";
import { HourglassIcon } from "../components/Icons/HourglassIcon";
import { ImageIcon } from "../components/Icons/ImageIcon";
import { InboxIcon } from "../components/Icons/InboxIcon";
import { InfoCircleIcon } from "../components/Icons/InfoCircleIcon";
import { InfoIcon } from "../components/Icons/InfoIcon";
import { LinkIcon } from "../components/Icons/LinkIcon";
import { LocationIcon } from "../components/Icons/LocationIcon";
import { LockerOffIcon } from "../components/Icons/LockerOffIcon";
import { LockerOnIcon } from "../components/Icons/LockerOnIcon";
import { LogoutIcon } from "../components/Icons/LogoutIcon";
import { LoveIcon } from "../components/Icons/LoveIcon";
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
import { TrashBinIcon } from "../components/Icons/TrashBinIcon";
import { TrophyIcon } from "../components/Icons/TrophyIcon";
import { TwitterIcon } from "../components/Icons/TwitterIcon";
import type { IconProps } from "../components/Icons/types";
import { UploadCloudIcon } from "../components/Icons/UploadCloudIcon";
import { UploadIcon } from "../components/Icons/UploadIcon";
import { UserCircleIcon } from "../components/Icons/UserCircleIcon";
import { UserIcon } from "../components/Icons/UserIcon";
import { UsersIcon } from "../components/Icons/UsersIcon";
import { VideoIcon } from "../components/Icons/VideoIcon";
import { VipBadgeIcon } from "../components/Icons/VipBadgeIcon";
import { WalletIcon } from "../components/Icons/WalletIcon";
import { WarningIcon } from "../components/Icons/WarningIcon";
import { WarningTriangleIcon } from "../components/Icons/WarningTriangleIcon";
import { WifiOffIcon } from "../components/Icons/WifiOffIcon";
import { WifiOnIcon } from "../components/Icons/WifiOnIcon";
import { WrenchIcon } from "../components/Icons/WrenchIcon";

const meta = {
  title: "Foundations/Icons",
  parameters: {
    layout: "fullscreen",
    controls: { disable: true },
    actions: { disable: true },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

type IconEntry = {
  name: string;
  component: ComponentType<IconProps>;
  tags: string[];
};

const icons: IconEntry[] = [
  { name: "AddIcon", component: AddIcon, tags: ["add", "plus", "create", "new"] },
  { name: "AIIcon", component: AIIcon, tags: ["ai", "artificial", "intelligence", "machine"] },
  { name: "AlertIcon", component: AlertIcon, tags: ["alert", "warning", "exclamation"] },
  { name: "ArrowDownIcon", component: ArrowDownIcon, tags: ["arrow", "down", "navigation"] },
  {
    name: "ArrowLeftIcon",
    component: ArrowLeftIcon,
    tags: ["arrow", "left", "back", "navigation"],
  },
  {
    name: "ArrowRightIcon",
    component: ArrowRightIcon,
    tags: ["arrow", "right", "navigation", "next"],
  },
  { name: "ArrowUpIcon", component: ArrowUpIcon, tags: ["arrow", "up", "navigation"] },
  {
    name: "ArrowUpRightIcon",
    component: ArrowUpRightIcon,
    tags: ["arrow", "up", "right", "external", "link"],
  },
  { name: "BankIcon", component: BankIcon, tags: ["bank", "login", "enter", "door"] },
  { name: "BellIcon", component: BellIcon, tags: ["bell", "notification", "alarm"] },
  { name: "BellOffIcon", component: BellOffIcon, tags: ["bell", "off", "mute", "notification"] },
  { name: "BoltIcon", component: BoltIcon, tags: ["bolt", "lightning", "power", "energy"] },
  { name: "BulbIcon", component: BulbIcon, tags: ["bulb", "light", "idea", "lamp"] },
  {
    name: "Calendar2Icon",
    component: Calendar2Icon,
    tags: ["calendar", "date", "schedule", "simple"],
  },
  { name: "CalendarIcon", component: CalendarIcon, tags: ["calendar", "date", "schedule"] },
  { name: "CameraIcon", component: CameraIcon, tags: ["camera", "photo", "capture"] },
  { name: "ChartIcon", component: ChartIcon, tags: ["chart", "love", "heart", "analytics"] },
  {
    name: "CheckCircleIcon",
    component: CheckCircleIcon,
    tags: ["check", "circle", "success", "done"],
  },
  { name: "CheckIcon", component: CheckIcon, tags: ["check", "tick", "done", "confirm"] },
  {
    name: "CheckOutlineIcon",
    component: CheckOutlineIcon,
    tags: ["check", "outline", "circle", "confirm"],
  },
  {
    name: "ChevronDownIcon",
    component: ChevronDownIcon,
    tags: ["chevron", "down", "arrow", "expand"],
  },
  {
    name: "ChevronLeftIcon",
    component: ChevronLeftIcon,
    tags: ["chevron", "left", "arrow", "back"],
  },
  {
    name: "ChevronRightIcon",
    component: ChevronRightIcon,
    tags: ["chevron", "right", "arrow", "next"],
  },
  { name: "ChevronUpIcon", component: ChevronUpIcon, tags: ["chevron", "up", "arrow", "collapse"] },
  { name: "ClockIcon", component: ClockIcon, tags: ["clock", "time", "schedule"] },
  { name: "CloseIcon", component: CloseIcon, tags: ["close", "x", "dismiss", "remove"] },
  { name: "CodeIcon", component: CodeIcon, tags: ["code", "brackets", "programming"] },
  { name: "CoinIcon", component: CoinIcon, tags: ["coin", "money", "currency", "star"] },
  {
    name: "CompassIcon",
    component: CompassIcon,
    tags: ["compass", "navigation", "direction", "explore"],
  },
  { name: "CopyIcon", component: CopyIcon, tags: ["copy", "duplicate", "clipboard", "paste"] },
  { name: "CrossIcon", component: CrossIcon, tags: ["cross", "x", "close", "cancel", "remove"] },
  { name: "CrownIcon", component: CrownIcon, tags: ["crown", "premium", "vip", "special"] },
  { name: "DiamondIcon", component: DiamondIcon, tags: ["diamond", "gem", "premium"] },
  { name: "DiscountIcon", component: DiscountIcon, tags: ["discount", "sale", "percent"] },
  { name: "DonateIcon", component: DonateIcon, tags: ["donate", "gift", "give"] },
  { name: "DoubleTickIcon", component: DoubleTickIcon, tags: ["double", "tick", "check", "read"] },
  { name: "DownloadIcon", component: DownloadIcon, tags: ["download", "save", "file"] },
  { name: "EditIcon", component: EditIcon, tags: ["edit", "pen", "write", "modify"] },
  { name: "EmojiIcon", component: EmojiIcon, tags: ["emoji", "smiley", "face", "happy"] },
  {
    name: "ErrorCircleIcon",
    component: ErrorCircleIcon,
    tags: ["error", "circle", "alert", "danger"],
  },
  { name: "ErrorIcon", component: ErrorIcon, tags: ["error", "alert", "danger", "warning"] },
  { name: "ExpandIcon", component: ExpandIcon, tags: ["expand", "fullscreen", "resize"] },
  {
    name: "EyeClosedIcon",
    component: EyeClosedIcon,
    tags: ["eye", "closed", "hidden", "invisible"],
  },
  { name: "EyeIcon", component: EyeIcon, tags: ["eye", "view", "visibility", "show"] },
  { name: "EyeSlashIcon", component: EyeSlashIcon, tags: ["eye", "slash", "hidden", "invisible"] },
  { name: "FacebookIcon", component: FacebookIcon, tags: ["facebook", "social", "login"] },
  { name: "FlagIcon", component: FlagIcon, tags: ["flag", "report", "bookmark"] },
  {
    name: "FlameIcon",
    component: FlameIcon,
    tags: ["flame", "fire", "hot", "trending", "popular"],
  },
  { name: "FolderIcon", component: FolderIcon, tags: ["folder", "directory", "file"] },
  { name: "ForwardIcon", component: ForwardIcon, tags: ["forward", "next", "skip"] },
  { name: "GalleryIcon", component: GalleryIcon, tags: ["gallery", "image", "photo"] },
  { name: "GoogleIcon", component: GoogleIcon, tags: ["google", "social", "login"] },
  { name: "GenderIcon", component: GenderIcon, tags: ["gender", "identity"] },
  { name: "GiftIcon", component: GiftIcon, tags: ["gift", "present", "reward"] },
  { name: "HelpIcon", component: HelpIcon, tags: ["help", "question", "support"] },
  { name: "HomeIcon", component: HomeIcon, tags: ["home", "house", "main", "start"] },
  { name: "HourglassIcon", component: HourglassIcon, tags: ["hourglass", "timer", "wait"] },
  { name: "ImageIcon", component: ImageIcon, tags: ["image", "photo", "picture", "gallery"] },
  { name: "InboxIcon", component: InboxIcon, tags: ["inbox", "mail", "message"] },
  { name: "InfoCircleIcon", component: InfoCircleIcon, tags: ["info", "circle", "information"] },
  { name: "InfoIcon", component: InfoIcon, tags: ["info", "information", "help"] },
  { name: "LinkIcon", component: LinkIcon, tags: ["link", "chain", "url"] },
  { name: "LocationIcon", component: LocationIcon, tags: ["location", "map", "pin"] },
  { name: "LockerOffIcon", component: LockerOffIcon, tags: ["locker", "off", "unlock", "open"] },
  { name: "LockerOnIcon", component: LockerOnIcon, tags: ["locker", "on", "lock", "secure"] },
  { name: "LogoutIcon", component: LogoutIcon, tags: ["logout", "exit", "sign out"] },
  { name: "LoveIcon", component: LoveIcon, tags: ["love", "heart", "like", "favorite"] },
  { name: "MegaphoneIcon", component: MegaphoneIcon, tags: ["megaphone", "announce", "speaker"] },
  { name: "MenuCloseIcon", component: MenuCloseIcon, tags: ["menu", "close", "sidebar"] },
  { name: "MenuIcon", component: MenuIcon, tags: ["menu", "hamburger", "navigation"] },
  { name: "MenuOpenIcon", component: MenuOpenIcon, tags: ["menu", "open", "sidebar"] },
  { name: "MessageIcon", component: MessageIcon, tags: ["message", "chat", "comment"] },
  {
    name: "NewMessageIcon",
    component: NewMessageIcon,
    tags: ["message", "chat", "comment", "new"],
  },
  {
    name: "OpenIcon",
    component: OpenIcon,
    tags: ["open", "external", "link", "new window"],
  },
  {
    name: "MicrophoneIcon",
    component: MicrophoneIcon,
    tags: ["microphone", "mic", "audio", "voice"],
  },
  { name: "MinusIcon", component: MinusIcon, tags: ["minus", "subtract", "remove", "decrease"] },
  { name: "MoonIcon", component: MoonIcon, tags: ["moon", "night", "dark", "theme"] },
  { name: "MoreIcon", component: MoreIcon, tags: ["more", "horizontal", "dots", "ellipsis"] },
  {
    name: "MoreVerticalIcon",
    component: MoreVerticalIcon,
    tags: ["more", "vertical", "dots", "ellipsis"],
  },
  { name: "PauseIcon", component: PauseIcon, tags: ["pause", "media", "stop"] },
  {
    name: "PeopleIcon",
    component: PeopleIcon,
    tags: ["people", "users", "group", "followers", "social"],
  },
  { name: "PhoneIcon", component: PhoneIcon, tags: ["phone", "call", "contact"] },
  { name: "PhoneOffIcon", component: PhoneOffIcon, tags: ["phone", "off", "end", "call"] },
  { name: "PinIcon", component: PinIcon, tags: ["pin", "bookmark", "save"] },
  { name: "PlayIcon", component: PlayIcon, tags: ["play", "media", "start", "video"] },
  { name: "PlusIcon", component: PlusIcon, tags: ["plus", "add", "create", "new", "increase"] },
  { name: "PrivacyIcon", component: PrivacyIcon, tags: ["privacy", "shield", "secure"] },
  { name: "RepeatIcon", component: RepeatIcon, tags: ["repeat", "loop", "refresh"] },
  { name: "Reply2Icon", component: Reply2Icon, tags: ["reply", "respond", "arrow"] },
  { name: "ReplyIcon", component: ReplyIcon, tags: ["reply", "respond", "arrow"] },
  { name: "ReverseIcon", component: ReverseIcon, tags: ["reverse", "undo", "back"] },
  { name: "SearchIcon", component: SearchIcon, tags: ["search", "find", "magnify", "look"] },
  { name: "SendIcon", component: SendIcon, tags: ["send", "submit", "paper plane"] },
  { name: "SettingsIcon", component: SettingsIcon, tags: ["settings", "gear", "config"] },
  { name: "ShareIcon", component: ShareIcon, tags: ["share", "social", "send"] },
  { name: "SpinnerIcon", component: SpinnerIcon, tags: ["spinner", "loading", "progress"] },
  { name: "StarIcon", component: StarIcon, tags: ["star", "favorite", "rating"] },
  { name: "StopIcon", component: StopIcon, tags: ["stop", "halt", "end"] },
  { name: "SuccessIcon", component: SuccessIcon, tags: ["success", "check", "done"] },
  { name: "SunIcon", component: SunIcon, tags: ["sun", "light", "day", "theme"] },
  { name: "Support2Icon", component: Support2Icon, tags: ["support", "help", "lifebuoy"] },
  { name: "SupportIcon", component: SupportIcon, tags: ["support", "help", "headset"] },
  { name: "TagIcon", component: TagIcon, tags: ["tag", "label", "category"] },
  { name: "TaskIcon", component: TaskIcon, tags: ["task", "todo", "checklist"] },
  { name: "TickCircleIcon", component: TickCircleIcon, tags: ["tick", "circle", "check", "done"] },
  {
    name: "TickCircleOffIcon",
    component: TickCircleOffIcon,
    tags: ["tick", "circle", "off", "unchecked"],
  },
  { name: "TickIcon", component: TickIcon, tags: ["tick", "check", "done", "confirm"] },
  { name: "TrashBinIcon", component: TrashBinIcon, tags: ["trash", "bin", "delete", "remove"] },
  { name: "TrophyIcon", component: TrophyIcon, tags: ["trophy", "award", "medal", "achievement"] },
  {
    name: "ThumbDownFilledIcon",
    component: ThumbDownFilledIcon,
    tags: ["thumb", "down", "dislike", "filled"],
  },
  { name: "ThumbDownIcon", component: ThumbDownIcon, tags: ["thumb", "down", "dislike"] },
  {
    name: "ThumbUpFilledIcon",
    component: ThumbUpFilledIcon,
    tags: ["thumb", "up", "like", "filled"],
  },
  { name: "ThumbUpIcon", component: ThumbUpIcon, tags: ["thumb", "up", "like"] },
  { name: "UploadCloudIcon", component: UploadCloudIcon, tags: ["upload", "cloud"] },
  { name: "UploadIcon", component: UploadIcon, tags: ["upload", "send", "file"] },
  {
    name: "UserCircleIcon",
    component: UserCircleIcon,
    tags: ["user", "circle", "avatar", "profile"],
  },
  { name: "UserIcon", component: UserIcon, tags: ["user", "person", "profile"] },
  { name: "UsersIcon", component: UsersIcon, tags: ["users", "group", "people", "team"] },
  { name: "VideoIcon", component: VideoIcon, tags: ["video", "camera", "record", "media"] },
  { name: "VipBadgeIcon", component: VipBadgeIcon, tags: ["vip", "badge", "premium", "special"] },
  { name: "WalletIcon", component: WalletIcon, tags: ["wallet", "money", "payment"] },
  { name: "WarningIcon", component: WarningIcon, tags: ["warning", "caution", "alert"] },
  {
    name: "WarningTriangleIcon",
    component: WarningTriangleIcon,
    tags: ["warning", "triangle", "caution"],
  },
  { name: "WifiOffIcon", component: WifiOffIcon, tags: ["wifi", "off", "disconnected"] },
  { name: "WifiOnIcon", component: WifiOnIcon, tags: ["wifi", "on", "connected", "internet"] },
  { name: "WrenchIcon", component: WrenchIcon, tags: ["wrench", "tool", "settings", "fix"] },
  { name: "TwitterIcon", component: TwitterIcon, tags: ["x", "twitter", "social", "login"] },
];

function IconCard({ entry, size }: { entry: IconEntry; size: string }) {
  const [copied, setCopied] = useState(false);
  const Icon = entry.component;

  const importText = `import { ${entry.name} } from "@fanvue/ui";`;

  const handleCopy = () => {
    navigator.clipboard.writeText(importText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

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
      }}
      title={`Click to copy: ${importText}`}
    >
      <Icon className={size} style={{ color: "var(--color-content-primary)" }} />
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
  const [size, setSize] = useState("size-6");

  const filtered = icons.filter((icon) => {
    const q = search.toLowerCase();
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
        {icons.length} icons available. Each icon is a{" "}
        <code
          style={{
            fontSize: 14,
            fontFamily: "monospace",
            padding: "1px 4px",
            backgroundColor: "var(--color-neutral-alphas-100)",
            borderRadius: 3,
          }}
        >
          forwardRef
        </code>{" "}
        SVG component that accepts all standard SVG props. Default size is{" "}
        <code
          style={{
            fontSize: 14,
            fontFamily: "monospace",
            padding: "1px 4px",
            backgroundColor: "var(--color-neutral-alphas-100)",
            borderRadius: 3,
          }}
        >
          size-6
        </code>{" "}
        (24px). Click any icon to copy its import statement.
      </p>
      <div
        style={{
          display: "flex",
          gap: 8,
          margin: "0 0 12px",
          flexWrap: "wrap",
        }}
      >
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
          {'import { CheckIcon } from "@fanvue/ui";'}
        </code>
      </div>

      <div
        style={{
          display: "flex",
          gap: 12,
          margin: "24px 0 24px",
          alignItems: "center",
        }}
      >
        <input
          type="text"
          placeholder="Search icons..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            flex: 1,
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
          {[
            { label: "16", value: "size-4" },
            { label: "20", value: "size-5" },
            { label: "24", value: "size-6" },
            { label: "32", value: "size-8" },
          ].map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setSize(opt.value)}
              style={{
                padding: "6px 10px",
                fontSize: 12,
                fontFamily: "monospace",
                borderRadius: 4,
                border: "1px solid var(--color-neutral-alphas-200)",
                backgroundColor:
                  size === opt.value
                    ? "var(--color-brand-secondary-default)"
                    : "var(--color-neutral-alphas-100)",
                color: size === opt.value ? "#fff" : "var(--color-content-secondary)",
                cursor: "pointer",
              }}
            >
              {opt.label}px
            </button>
          ))}
        </div>
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
            <IconCard key={entry.name} entry={entry} size={size} />
          ))}
        </div>
      )}
    </div>
  );
}

export const Gallery: Story = {
  render: () => <IconGallery />,
};
