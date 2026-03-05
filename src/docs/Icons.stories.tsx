import type { Meta, StoryObj } from "@storybook/react";
import { type ComponentType, useState } from "react";
import { AiEnhanceIcon } from "../components/Icons/AiEnhanceIcon";
import { ArrowDownIcon } from "../components/Icons/ArrowDownIcon";
import { ArrowLeftIcon } from "../components/Icons/ArrowLeftIcon";
import { ArrowRightIcon } from "../components/Icons/ArrowRightIcon";
import { ArrowUpIcon } from "../components/Icons/ArrowUpIcon";
import { ArrowUpRightIcon } from "../components/Icons/ArrowUpRightIcon";
import { BankIcon } from "../components/Icons/BankIcon";
import { BellIcon } from "../components/Icons/BellIcon";
import { BellOffIcon } from "../components/Icons/BellOffIcon";
import { BulbIcon } from "../components/Icons/BulbIcon";
import { CalendarDateIcon } from "../components/Icons/CalendarDateIcon";
import { CalendarIcon } from "../components/Icons/CalendarIcon";
import { ChartIcon } from "../components/Icons/ChartIcon";
import { CheckboxOffIcon } from "../components/Icons/CheckboxOffIcon";
import { CheckboxOnIcon } from "../components/Icons/CheckboxOnIcon";
import { CheckCircleIcon } from "../components/Icons/CheckCircleIcon";
import { CheckIcon } from "../components/Icons/CheckIcon";
import { CheckOutlineIcon } from "../components/Icons/CheckOutlineIcon";
import { ChevronDownIcon } from "../components/Icons/ChevronDownIcon";
import { ChevronLeftIcon } from "../components/Icons/ChevronLeftIcon";
import { ChevronRightIcon } from "../components/Icons/ChevronRightIcon";
import { ChevronUpIcon } from "../components/Icons/ChevronUpIcon";
import { ClockIcon } from "../components/Icons/ClockIcon";
import { CloseIcon } from "../components/Icons/CloseIcon";
import { CodeCircleIcon } from "../components/Icons/CodeCircleIcon";
import { CoinIcon } from "../components/Icons/CoinIcon";
import { CompassIcon } from "../components/Icons/CompassIcon";
import { CopyIcon } from "../components/Icons/CopyIcon";
import { CrossIcon } from "../components/Icons/CrossIcon";
import { CrownIcon } from "../components/Icons/CrownIcon";
import { DangerIcon } from "../components/Icons/DangerIcon";
import { DiamondIcon } from "../components/Icons/DiamondIcon";
import { DiscountCircleIcon } from "../components/Icons/DiscountCircleIcon";
import { DonateIcon } from "../components/Icons/DonateIcon";
import { DoubleCheckIcon } from "../components/Icons/DoubleCheckIcon";
import { DownloadIcon } from "../components/Icons/DownloadIcon";
import { EditIcon } from "../components/Icons/EditIcon";
import { ErrorCircleIcon } from "../components/Icons/ErrorCircleIcon";
import { ErrorIcon } from "../components/Icons/ErrorIcon";
import { ExpandIcon } from "../components/Icons/ExpandIcon";
import { EyeClosedIcon } from "../components/Icons/EyeClosedIcon";
import { EyeIcon } from "../components/Icons/EyeIcon";
import { EyeSlashIcon } from "../components/Icons/EyeSlashIcon";
import { FireIcon } from "../components/Icons/FireIcon";
import { FlagIcon } from "../components/Icons/FlagIcon";
import { FlameIcon } from "../components/Icons/FlameIcon";
import { FolderIcon } from "../components/Icons/FolderIcon";
import { ForwardIcon } from "../components/Icons/ForwardIcon";
import { GalleryAddIcon } from "../components/Icons/GalleryAddIcon";
import { GalleryIcon } from "../components/Icons/GalleryIcon";
import { GenderIcon } from "../components/Icons/GenderIcon";
import { GiftIcon } from "../components/Icons/GiftIcon";
import { HomeIcon } from "../components/Icons/HomeIcon";
import { HourglassIcon } from "../components/Icons/HourglassIcon";
import { InboxIcon } from "../components/Icons/InboxIcon";
import { InfoCircleIcon } from "../components/Icons/InfoCircleIcon";
import { InfoIcon } from "../components/Icons/InfoIcon";
import { LifebuoyIcon } from "../components/Icons/LifebuoyIcon";
import { LightningIcon } from "../components/Icons/LightningIcon";
import { LinkIcon } from "../components/Icons/LinkIcon";
import { LocationIcon } from "../components/Icons/LocationIcon";
import { LockIcon } from "../components/Icons/LockIcon";
import { LockSlashIcon } from "../components/Icons/LockSlashIcon";
import { LogoutIcon } from "../components/Icons/LogoutIcon";
import { LoveClickIcon } from "../components/Icons/LoveClickIcon";
import { MedalIcon } from "../components/Icons/MedalIcon";
import { MenuIcon } from "../components/Icons/MenuIcon";
import { MessageFavoriteIcon } from "../components/Icons/MessageFavoriteIcon";
import { MicrophoneIcon } from "../components/Icons/MicrophoneIcon";
import { MinusIcon } from "../components/Icons/MinusIcon";
import { MoneyIcon } from "../components/Icons/MoneyIcon";
import { MoonIcon } from "../components/Icons/MoonIcon";
import { MoreHorizontalIcon } from "../components/Icons/MoreHorizontalIcon";
import { MoreVerticalIcon } from "../components/Icons/MoreVerticalIcon";
import { PauseCircleIcon } from "../components/Icons/PauseCircleIcon";
import { PhoneIcon } from "../components/Icons/PhoneIcon";
import { PhoneOffIcon } from "../components/Icons/PhoneOffIcon";
import { PinIcon } from "../components/Icons/PinIcon";
import { PlayCircleIcon } from "../components/Icons/PlayCircleIcon";
import { PlusIcon } from "../components/Icons/PlusIcon";
import { QuestionIcon } from "../components/Icons/QuestionIcon";
import { RepeatIcon } from "../components/Icons/RepeatIcon";
import { ReplyArrowIcon } from "../components/Icons/ReplyArrowIcon";
import { ReplyIcon } from "../components/Icons/ReplyIcon";
import { SearchIcon } from "../components/Icons/SearchIcon";
import { SendIcon } from "../components/Icons/SendIcon";
import { SettingsIcon } from "../components/Icons/SettingsIcon";
import { ShareIcon } from "../components/Icons/ShareIcon";
import { ShieldIcon } from "../components/Icons/ShieldIcon";
import { SidebarLeftIcon } from "../components/Icons/SidebarLeftIcon";
import { SidebarRightIcon } from "../components/Icons/SidebarRightIcon";
import { SpeakerIcon } from "../components/Icons/SpeakerIcon";
import { SpinnerIcon } from "../components/Icons/SpinnerIcon";
import { StarIcon } from "../components/Icons/StarIcon";
import { StopCircleIcon } from "../components/Icons/StopCircleIcon";
import { StopIcon } from "../components/Icons/StopIcon";
import { SuccessIcon } from "../components/Icons/SuccessIcon";
import { SunIcon } from "../components/Icons/SunIcon";
import { SupportIcon } from "../components/Icons/SupportIcon";
import { TagIcon } from "../components/Icons/TagIcon";
import { TaskIcon } from "../components/Icons/TaskIcon";
import { ThumbDownIcon } from "../components/Icons/ThumbDownIcon";
import { ThumbUpIcon } from "../components/Icons/ThumbUpIcon";
import { TrashIcon } from "../components/Icons/TrashIcon";
import type { IconProps } from "../components/Icons/types";
import { UploadCloudIcon } from "../components/Icons/UploadCloudIcon";
import { UploadIcon } from "../components/Icons/UploadIcon";
import { UserCircleAddIcon } from "../components/Icons/UserCircleAddIcon";
import { UserSquareIcon } from "../components/Icons/UserSquareIcon";
import { UsersIcon } from "../components/Icons/UsersIcon";
import { VideoIcon } from "../components/Icons/VideoIcon";
import { VipBadgeIcon } from "../components/Icons/VipBadgeIcon";
import { WalletIcon } from "../components/Icons/WalletIcon";
import { WarningIcon } from "../components/Icons/WarningIcon";
import { WarningTriangleIcon } from "../components/Icons/WarningTriangleIcon";
import { WifiIcon } from "../components/Icons/WifiIcon";
import { WifiOffIcon } from "../components/Icons/WifiOffIcon";
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
};

const icons: IconEntry[] = [
  { name: "AiEnhanceIcon", component: AiEnhanceIcon },
  { name: "ArrowDownIcon", component: ArrowDownIcon },
  { name: "ArrowLeftIcon", component: ArrowLeftIcon },
  { name: "ArrowRightIcon", component: ArrowRightIcon },
  { name: "ArrowUpIcon", component: ArrowUpIcon },
  { name: "ArrowUpRightIcon", component: ArrowUpRightIcon },
  { name: "BankIcon", component: BankIcon },
  { name: "BellIcon", component: BellIcon },
  { name: "BellOffIcon", component: BellOffIcon },
  { name: "BulbIcon", component: BulbIcon },
  { name: "CalendarDateIcon", component: CalendarDateIcon },
  { name: "CalendarIcon", component: CalendarIcon },
  { name: "ChartIcon", component: ChartIcon },
  { name: "CheckboxOffIcon", component: CheckboxOffIcon },
  { name: "CheckboxOnIcon", component: CheckboxOnIcon },
  { name: "CheckCircleIcon", component: CheckCircleIcon },
  { name: "CheckIcon", component: CheckIcon },
  { name: "CheckOutlineIcon", component: CheckOutlineIcon },
  { name: "ChevronDownIcon", component: ChevronDownIcon },
  { name: "ChevronLeftIcon", component: ChevronLeftIcon },
  { name: "ChevronRightIcon", component: ChevronRightIcon },
  { name: "ChevronUpIcon", component: ChevronUpIcon },
  { name: "ClockIcon", component: ClockIcon },
  { name: "CloseIcon", component: CloseIcon },
  { name: "CodeCircleIcon", component: CodeCircleIcon },
  { name: "CoinIcon", component: CoinIcon },
  { name: "CompassIcon", component: CompassIcon },
  { name: "CopyIcon", component: CopyIcon },
  { name: "CrossIcon", component: CrossIcon },
  { name: "CrownIcon", component: CrownIcon },
  { name: "DangerIcon", component: DangerIcon },
  { name: "DiamondIcon", component: DiamondIcon },
  { name: "DiscountCircleIcon", component: DiscountCircleIcon },
  { name: "DonateIcon", component: DonateIcon },
  { name: "DoubleCheckIcon", component: DoubleCheckIcon },
  { name: "DownloadIcon", component: DownloadIcon },
  { name: "EditIcon", component: EditIcon },
  { name: "ErrorCircleIcon", component: ErrorCircleIcon },
  { name: "ErrorIcon", component: ErrorIcon },
  { name: "ExpandIcon", component: ExpandIcon },
  { name: "EyeClosedIcon", component: EyeClosedIcon },
  { name: "EyeIcon", component: EyeIcon },
  { name: "EyeSlashIcon", component: EyeSlashIcon },
  { name: "FireIcon", component: FireIcon },
  { name: "FlagIcon", component: FlagIcon },
  { name: "FlameIcon", component: FlameIcon },
  { name: "FolderIcon", component: FolderIcon },
  { name: "ForwardIcon", component: ForwardIcon },
  { name: "GalleryAddIcon", component: GalleryAddIcon },
  { name: "GalleryIcon", component: GalleryIcon },
  { name: "GenderIcon", component: GenderIcon },
  { name: "GiftIcon", component: GiftIcon },
  { name: "HomeIcon", component: HomeIcon },
  { name: "HourglassIcon", component: HourglassIcon },
  { name: "InboxIcon", component: InboxIcon },
  { name: "InfoCircleIcon", component: InfoCircleIcon },
  { name: "InfoIcon", component: InfoIcon },
  { name: "LifebuoyIcon", component: LifebuoyIcon },
  { name: "LightningIcon", component: LightningIcon },
  { name: "LinkIcon", component: LinkIcon },
  { name: "LocationIcon", component: LocationIcon },
  { name: "LockIcon", component: LockIcon },
  { name: "LockSlashIcon", component: LockSlashIcon },
  { name: "LogoutIcon", component: LogoutIcon },
  { name: "LoveClickIcon", component: LoveClickIcon },
  { name: "MedalIcon", component: MedalIcon },
  { name: "MenuIcon", component: MenuIcon },
  { name: "MessageFavoriteIcon", component: MessageFavoriteIcon },
  { name: "MicrophoneIcon", component: MicrophoneIcon },
  { name: "MinusIcon", component: MinusIcon },
  { name: "MoneyIcon", component: MoneyIcon },
  { name: "MoonIcon", component: MoonIcon },
  { name: "MoreHorizontalIcon", component: MoreHorizontalIcon },
  { name: "MoreVerticalIcon", component: MoreVerticalIcon },
  { name: "PauseCircleIcon", component: PauseCircleIcon },
  { name: "PhoneIcon", component: PhoneIcon },
  { name: "PhoneOffIcon", component: PhoneOffIcon },
  { name: "PinIcon", component: PinIcon },
  { name: "PlayCircleIcon", component: PlayCircleIcon },
  { name: "PlusIcon", component: PlusIcon },
  { name: "QuestionIcon", component: QuestionIcon },
  { name: "RepeatIcon", component: RepeatIcon },
  { name: "ReplyArrowIcon", component: ReplyArrowIcon },
  { name: "ReplyIcon", component: ReplyIcon },
  { name: "SearchIcon", component: SearchIcon },
  { name: "SendIcon", component: SendIcon },
  { name: "SettingsIcon", component: SettingsIcon },
  { name: "ShareIcon", component: ShareIcon },
  { name: "ShieldIcon", component: ShieldIcon },
  { name: "SidebarLeftIcon", component: SidebarLeftIcon },
  { name: "SidebarRightIcon", component: SidebarRightIcon },
  { name: "SpeakerIcon", component: SpeakerIcon },
  { name: "SpinnerIcon", component: SpinnerIcon },
  { name: "StarIcon", component: StarIcon },
  { name: "StopCircleIcon", component: StopCircleIcon },
  { name: "StopIcon", component: StopIcon },
  { name: "SuccessIcon", component: SuccessIcon },
  { name: "SunIcon", component: SunIcon },
  { name: "SupportIcon", component: SupportIcon },
  { name: "TagIcon", component: TagIcon },
  { name: "TaskIcon", component: TaskIcon },
  { name: "ThumbDownIcon", component: ThumbDownIcon },
  { name: "ThumbUpIcon", component: ThumbUpIcon },
  { name: "TrashIcon", component: TrashIcon },
  { name: "UploadCloudIcon", component: UploadCloudIcon },
  { name: "UploadIcon", component: UploadIcon },
  { name: "UserCircleAddIcon", component: UserCircleAddIcon },
  { name: "UsersIcon", component: UsersIcon },
  { name: "UserSquareIcon", component: UserSquareIcon },
  { name: "VideoIcon", component: VideoIcon },
  { name: "VipBadgeIcon", component: VipBadgeIcon },
  { name: "WalletIcon", component: WalletIcon },
  { name: "WarningIcon", component: WarningIcon },
  { name: "WarningTriangleIcon", component: WarningTriangleIcon },
  { name: "WifiIcon", component: WifiIcon },
  { name: "WifiOffIcon", component: WifiOffIcon },
  { name: "WrenchIcon", component: WrenchIcon },
];

function IconCard({ entry, size }: { entry: IconEntry; size: string }) {
  const [copied, setCopied] = useState(false);
  const Icon = entry.component;

  const importText = `import { ${entry.name} } from "fanv-ui";`;

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
        border: "1px solid var(--color-neutral-100)",
        backgroundColor: copied ? "var(--color-success-50)" : "var(--color-background-700)",
        cursor: "pointer",
        transition: "background-color 150ms, border-color 150ms",
        width: "100%",
      }}
      title={`Click to copy: ${importText}`}
    >
      <Icon className={size} style={{ color: "var(--color-body-100)" }} />
      <span
        style={{
          fontSize: 11,
          fontFamily: "monospace",
          color: copied ? "var(--color-success-500)" : "var(--color-body-200)",
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
  const [size, setSize] = useState("size-5");

  const filtered = icons.filter((icon) => {
    const q = search.toLowerCase();
    return icon.name.toLowerCase().includes(q);
  });

  return (
    <div style={{ padding: "40px 48px", maxWidth: 960, fontFamily: "Inter, sans-serif" }}>
      <h1
        style={{
          fontSize: 32,
          fontWeight: 800,
          color: "var(--color-body-100)",
          margin: "0 0 8px",
        }}
      >
        Icons
      </h1>
      <p
        style={{
          fontSize: 16,
          color: "var(--color-body-200)",
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
            backgroundColor: "var(--color-background-600)",
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
            backgroundColor: "var(--color-background-600)",
            borderRadius: 3,
          }}
        >
          size-5
        </code>{" "}
        (20px). Click any icon to copy its import statement.
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
            color: "var(--color-primary-300)",
            padding: "8px 12px",
            backgroundColor: "var(--color-background-600)",
            borderRadius: 6,
          }}
        >
          {'import { CheckIcon } from "fanv-ui";'}
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
            border: "1px solid var(--color-neutral-200)",
            backgroundColor: "var(--color-background-200)",
            color: "var(--color-body-100)",
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
                border: "1px solid var(--color-neutral-200)",
                backgroundColor:
                  size === opt.value
                    ? "var(--color-brand-purple-500)"
                    : "var(--color-background-700)",
                color: size === opt.value ? "#fff" : "var(--color-body-200)",
                cursor: "pointer",
              }}
            >
              {opt.label}px
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p style={{ color: "var(--color-body-200)", fontSize: 14, padding: "40px 0" }}>
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
