import { render } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { AddIcon } from "./AddIcon";
import { AIIcon } from "./AIIcon";
import { AlertIcon } from "./AlertIcon";
import { ArrowDownIcon } from "./ArrowDownIcon";
import { ArrowLeftIcon } from "./ArrowLeftIcon";
import { ArrowRightIcon } from "./ArrowRightIcon";
import { ArrowUpIcon } from "./ArrowUpIcon";
import { ArrowUpRightIcon } from "./ArrowUpRightIcon";
import { BankIcon } from "./BankIcon";
import { BellIcon } from "./BellIcon";
import { BellOffIcon } from "./BellOffIcon";
import { BoltIcon } from "./BoltIcon";
import { BulbIcon } from "./BulbIcon";
import { Calendar2Icon } from "./Calendar2Icon";
import { CalendarIcon } from "./CalendarIcon";
import { CameraIcon } from "./CameraIcon";
import { ChartIcon } from "./ChartIcon";
import { CheckCircleIcon } from "./CheckCircleIcon";
import { CheckIcon } from "./CheckIcon";
import { CheckOutlineIcon } from "./CheckOutlineIcon";
import { ChevronDownIcon } from "./ChevronDownIcon";
import { ChevronLeftIcon } from "./ChevronLeftIcon";
import { ChevronRightIcon } from "./ChevronRightIcon";
import { ChevronUpIcon } from "./ChevronUpIcon";
import { ClockIcon } from "./ClockIcon";
import { CloseIcon } from "./CloseIcon";
import { CodeIcon } from "./CodeIcon";
import { CoinIcon } from "./CoinIcon";
import { CompassIcon } from "./CompassIcon";
import { CopyIcon } from "./CopyIcon";
import { CrossIcon } from "./CrossIcon";
import { CrownIcon } from "./CrownIcon";
import { DiamondIcon } from "./DiamondIcon";
import { DiscountIcon } from "./DiscountIcon";
import { DonateIcon } from "./DonateIcon";
import { DoubleTickIcon } from "./DoubleTickIcon";
import { DownloadIcon } from "./DownloadIcon";
import { EditIcon } from "./EditIcon";
import { EmojiIcon } from "./EmojiIcon";
import { ErrorCircleIcon } from "./ErrorCircleIcon";
import { ErrorIcon } from "./ErrorIcon";
import { ExpandIcon } from "./ExpandIcon";
import { EyeClosedIcon } from "./EyeClosedIcon";
import { EyeIcon } from "./EyeIcon";
import { EyeSlashIcon } from "./EyeSlashIcon";
import { FlagIcon } from "./FlagIcon";
import { FlameIcon } from "./FlameIcon";
import { FolderIcon } from "./FolderIcon";
import { ForwardIcon } from "./ForwardIcon";
import { GalleryIcon } from "./GalleryIcon";
import { GenderIcon } from "./GenderIcon";
import { GiftIcon } from "./GiftIcon";
import { HelpIcon } from "./HelpIcon";
import { HomeIcon } from "./HomeIcon";
import { HourglassIcon } from "./HourglassIcon";
import { ImageIcon } from "./ImageIcon";
import { InboxIcon } from "./InboxIcon";
import { InfoCircleIcon } from "./InfoCircleIcon";
import { InfoIcon } from "./InfoIcon";
import { LinkIcon } from "./LinkIcon";
import { LocationIcon } from "./LocationIcon";
import { LockerOffIcon } from "./LockerOffIcon";
import { LockerOnIcon } from "./LockerOnIcon";
import { LogoutIcon } from "./LogoutIcon";
import { LoveIcon } from "./LoveIcon";
import { MegaphoneIcon } from "./MegaphoneIcon";
import { MenuCloseIcon } from "./MenuCloseIcon";
import { MenuIcon } from "./MenuIcon";
import { MenuOpenIcon } from "./MenuOpenIcon";
import { MessageIcon } from "./MessageIcon";
import { MicrophoneIcon } from "./MicrophoneIcon";
import { MinusIcon } from "./MinusIcon";
import { MoonIcon } from "./MoonIcon";
import { MoreIcon } from "./MoreIcon";
import { MoreVerticalIcon } from "./MoreVerticalIcon";
import { PauseIcon } from "./PauseIcon";
import { PhoneIcon } from "./PhoneIcon";
import { PhoneOffIcon } from "./PhoneOffIcon";
import { PinIcon } from "./PinIcon";
import { PlayIcon } from "./PlayIcon";
import { PlusIcon } from "./PlusIcon";
import { PrivacyIcon } from "./PrivacyIcon";
import { RepeatIcon } from "./RepeatIcon";
import { Reply2Icon } from "./Reply2Icon";
import { ReplyIcon } from "./ReplyIcon";
import { ReverseIcon } from "./ReverseIcon";
import { SearchIcon } from "./SearchIcon";
import { SendIcon } from "./SendIcon";
import { SettingsIcon } from "./SettingsIcon";
import { ShareIcon } from "./ShareIcon";
import { SpinnerIcon } from "./SpinnerIcon";
import { StarIcon } from "./StarIcon";
import { StopIcon } from "./StopIcon";
import { SuccessIcon } from "./SuccessIcon";
import { SunIcon } from "./SunIcon";
import { Support2Icon } from "./Support2Icon";
import { SupportIcon } from "./SupportIcon";
import { TagIcon } from "./TagIcon";
import { TaskIcon } from "./TaskIcon";
import { ThumbDownIcon } from "./ThumbDownIcon";
import { ThumbUpIcon } from "./ThumbUpIcon";
import { TickCircleIcon } from "./TickCircleIcon";
import { TickCircleOffIcon } from "./TickCircleOffIcon";
import { TickIcon } from "./TickIcon";
import { TrashBinIcon } from "./TrashBinIcon";
import { TrophyIcon } from "./TrophyIcon";
import { UploadCloudIcon } from "./UploadCloudIcon";
import { UploadIcon } from "./UploadIcon";
import { UserCircleIcon } from "./UserCircleIcon";
import { UserIcon } from "./UserIcon";
import { UsersIcon } from "./UsersIcon";
import { VideoIcon } from "./VideoIcon";
import { VipBadgeIcon } from "./VipBadgeIcon";
import { WalletIcon } from "./WalletIcon";
import { WarningIcon } from "./WarningIcon";
import { WarningTriangleIcon } from "./WarningTriangleIcon";
import { WifiOffIcon } from "./WifiOffIcon";
import { WifiOnIcon } from "./WifiOnIcon";
import { WrenchIcon } from "./WrenchIcon";

const icons = [
  { name: "AddIcon", Component: AddIcon },
  { name: "AIIcon", Component: AIIcon },
  { name: "AlertIcon", Component: AlertIcon },
  { name: "ArrowDownIcon", Component: ArrowDownIcon },
  { name: "ArrowLeftIcon", Component: ArrowLeftIcon },
  { name: "ArrowRightIcon", Component: ArrowRightIcon },
  { name: "ArrowUpIcon", Component: ArrowUpIcon },
  { name: "ArrowUpRightIcon", Component: ArrowUpRightIcon },
  { name: "BankIcon", Component: BankIcon },
  { name: "BellIcon", Component: BellIcon },
  { name: "BellOffIcon", Component: BellOffIcon },
  { name: "BoltIcon", Component: BoltIcon },
  { name: "BulbIcon", Component: BulbIcon },
  { name: "Calendar2Icon", Component: Calendar2Icon },
  { name: "CalendarIcon", Component: CalendarIcon },
  { name: "CameraIcon", Component: CameraIcon },
  { name: "ChartIcon", Component: ChartIcon },
  { name: "CheckCircleIcon", Component: CheckCircleIcon },
  { name: "CheckIcon", Component: CheckIcon },
  { name: "CheckOutlineIcon", Component: CheckOutlineIcon },
  { name: "ChevronDownIcon", Component: ChevronDownIcon },
  { name: "ChevronLeftIcon", Component: ChevronLeftIcon },
  { name: "ChevronRightIcon", Component: ChevronRightIcon },
  { name: "ChevronUpIcon", Component: ChevronUpIcon },
  { name: "ClockIcon", Component: ClockIcon },
  { name: "CloseIcon", Component: CloseIcon },
  { name: "CodeIcon", Component: CodeIcon },
  { name: "CoinIcon", Component: CoinIcon },
  { name: "CompassIcon", Component: CompassIcon },
  { name: "CopyIcon", Component: CopyIcon },
  { name: "CrossIcon", Component: CrossIcon },
  { name: "CrownIcon", Component: CrownIcon },
  { name: "DiamondIcon", Component: DiamondIcon },
  { name: "DiscountIcon", Component: DiscountIcon },
  { name: "DonateIcon", Component: DonateIcon },
  { name: "DoubleTickIcon", Component: DoubleTickIcon },
  { name: "DownloadIcon", Component: DownloadIcon },
  { name: "EditIcon", Component: EditIcon },
  { name: "EmojiIcon", Component: EmojiIcon },
  { name: "ErrorCircleIcon", Component: ErrorCircleIcon },
  { name: "ErrorIcon", Component: ErrorIcon },
  { name: "ExpandIcon", Component: ExpandIcon },
  { name: "EyeClosedIcon", Component: EyeClosedIcon },
  { name: "EyeIcon", Component: EyeIcon },
  { name: "EyeSlashIcon", Component: EyeSlashIcon },
  { name: "FlagIcon", Component: FlagIcon },
  { name: "FlameIcon", Component: FlameIcon },
  { name: "FolderIcon", Component: FolderIcon },
  { name: "ForwardIcon", Component: ForwardIcon },
  { name: "GalleryIcon", Component: GalleryIcon },
  { name: "GenderIcon", Component: GenderIcon },
  { name: "GiftIcon", Component: GiftIcon },
  { name: "HelpIcon", Component: HelpIcon },
  { name: "HomeIcon", Component: HomeIcon },
  { name: "HourglassIcon", Component: HourglassIcon },
  { name: "ImageIcon", Component: ImageIcon },
  { name: "InboxIcon", Component: InboxIcon },
  { name: "InfoCircleIcon", Component: InfoCircleIcon },
  { name: "InfoIcon", Component: InfoIcon },
  { name: "LinkIcon", Component: LinkIcon },
  { name: "LocationIcon", Component: LocationIcon },
  { name: "LockerOffIcon", Component: LockerOffIcon },
  { name: "LockerOnIcon", Component: LockerOnIcon },
  { name: "LogoutIcon", Component: LogoutIcon },
  { name: "LoveIcon", Component: LoveIcon },
  { name: "MegaphoneIcon", Component: MegaphoneIcon },
  { name: "MenuCloseIcon", Component: MenuCloseIcon },
  { name: "MenuIcon", Component: MenuIcon },
  { name: "MenuOpenIcon", Component: MenuOpenIcon },
  { name: "MessageIcon", Component: MessageIcon },
  { name: "MicrophoneIcon", Component: MicrophoneIcon },
  { name: "MinusIcon", Component: MinusIcon },
  { name: "MoonIcon", Component: MoonIcon },
  { name: "MoreIcon", Component: MoreIcon },
  { name: "MoreVerticalIcon", Component: MoreVerticalIcon },
  { name: "PauseIcon", Component: PauseIcon },
  { name: "PhoneIcon", Component: PhoneIcon },
  { name: "PhoneOffIcon", Component: PhoneOffIcon },
  { name: "PinIcon", Component: PinIcon },
  { name: "PlayIcon", Component: PlayIcon },
  { name: "PlusIcon", Component: PlusIcon },
  { name: "PrivacyIcon", Component: PrivacyIcon },
  { name: "RepeatIcon", Component: RepeatIcon },
  { name: "Reply2Icon", Component: Reply2Icon },
  { name: "ReplyIcon", Component: ReplyIcon },
  { name: "ReverseIcon", Component: ReverseIcon },
  { name: "SearchIcon", Component: SearchIcon },
  { name: "SendIcon", Component: SendIcon },
  { name: "SettingsIcon", Component: SettingsIcon },
  { name: "ShareIcon", Component: ShareIcon },
  { name: "SpinnerIcon", Component: SpinnerIcon },
  { name: "StarIcon", Component: StarIcon },
  { name: "StopIcon", Component: StopIcon },
  { name: "SuccessIcon", Component: SuccessIcon },
  { name: "SunIcon", Component: SunIcon },
  { name: "Support2Icon", Component: Support2Icon },
  { name: "SupportIcon", Component: SupportIcon },
  { name: "TagIcon", Component: TagIcon },
  { name: "TaskIcon", Component: TaskIcon },
  { name: "TickCircleIcon", Component: TickCircleIcon },
  { name: "TickCircleOffIcon", Component: TickCircleOffIcon },
  { name: "TickIcon", Component: TickIcon },
  { name: "TrashBinIcon", Component: TrashBinIcon },
  { name: "TrophyIcon", Component: TrophyIcon },
  { name: "ThumbDownIcon", Component: ThumbDownIcon },
  { name: "ThumbUpIcon", Component: ThumbUpIcon },
  { name: "UploadCloudIcon", Component: UploadCloudIcon },
  { name: "UploadIcon", Component: UploadIcon },
  { name: "UserCircleIcon", Component: UserCircleIcon },
  { name: "UserIcon", Component: UserIcon },
  { name: "UsersIcon", Component: UsersIcon },
  { name: "VideoIcon", Component: VideoIcon },
  { name: "VipBadgeIcon", Component: VipBadgeIcon },
  { name: "WalletIcon", Component: WalletIcon },
  { name: "WarningIcon", Component: WarningIcon },
  { name: "WarningTriangleIcon", Component: WarningTriangleIcon },
  { name: "WifiOffIcon", Component: WifiOffIcon },
  { name: "WifiOnIcon", Component: WifiOnIcon },
  { name: "WrenchIcon", Component: WrenchIcon },
];

describe("Icons", () => {
  for (const { name, Component } of icons) {
    describe(name, () => {
      it("renders an SVG element", () => {
        const { container } = render(<Component />);
        const svg = container.querySelector("svg");
        expect(svg).toBeInTheDocument();
      });

      it("applies aria-hidden by default", () => {
        const { container } = render(<Component />);
        const svg = container.querySelector("svg");
        expect(svg).toHaveAttribute("aria-hidden", "true");
      });

      it("has a default size class", () => {
        const { container } = render(<Component />);
        const svg = container.querySelector("svg");
        expect(svg?.getAttribute("class")).toMatch(/size-\d/);
      });

      it("allows size override via className", () => {
        const { container } = render(<Component className="size-10" />);
        const svg = container.querySelector("svg");
        expect(svg).toHaveClass("size-10");
      });

      it("applies custom className", () => {
        const { container } = render(<Component className="custom-icon" />);
        const svg = container.querySelector("svg");
        expect(svg).toHaveClass("custom-icon");
      });

      it("forwards ref", () => {
        const ref = createRef<SVGSVGElement>();
        render(<Component ref={ref} />);
        expect(ref.current).toBeInstanceOf(SVGSVGElement);
      });
    });
  }
});
