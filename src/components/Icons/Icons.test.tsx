import { render } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { AiEnhanceIcon } from "./AiEnhanceIcon";
import { ArrowDownIcon } from "./ArrowDownIcon";
import { ArrowLeftIcon } from "./ArrowLeftIcon";
import { ArrowRightIcon } from "./ArrowRightIcon";
import { ArrowUpIcon } from "./ArrowUpIcon";
import { ArrowUpRightIcon } from "./ArrowUpRightIcon";
import { BankIcon } from "./BankIcon";
import { BellIcon } from "./BellIcon";
import { BellOffIcon } from "./BellOffIcon";
import { BulbIcon } from "./BulbIcon";
import { CalendarDateIcon } from "./CalendarDateIcon";
import { CalendarIcon } from "./CalendarIcon";
import { ChartIcon } from "./ChartIcon";
import { CheckboxOffIcon } from "./CheckboxOffIcon";
import { CheckboxOnIcon } from "./CheckboxOnIcon";
import { CheckCircleIcon } from "./CheckCircleIcon";
import { CheckIcon } from "./CheckIcon";
import { CheckOutlineIcon } from "./CheckOutlineIcon";
import { ChevronDownIcon } from "./ChevronDownIcon";
import { ChevronLeftIcon } from "./ChevronLeftIcon";
import { ChevronRightIcon } from "./ChevronRightIcon";
import { ChevronUpIcon } from "./ChevronUpIcon";
import { ClockIcon } from "./ClockIcon";
import { CloseIcon } from "./CloseIcon";
import { CodeCircleIcon } from "./CodeCircleIcon";
import { CoinIcon } from "./CoinIcon";
import { CompassIcon } from "./CompassIcon";
import { CopyIcon } from "./CopyIcon";
import { CrossIcon } from "./CrossIcon";
import { CrownIcon } from "./CrownIcon";
import { DangerIcon } from "./DangerIcon";
import { DiamondIcon } from "./DiamondIcon";
import { DiscountCircleIcon } from "./DiscountCircleIcon";
import { DonateIcon } from "./DonateIcon";
import { DoubleCheckIcon } from "./DoubleCheckIcon";
import { DownloadIcon } from "./DownloadIcon";
import { EditIcon } from "./EditIcon";
import { ErrorCircleIcon } from "./ErrorCircleIcon";
import { ErrorIcon } from "./ErrorIcon";
import { ExpandIcon } from "./ExpandIcon";
import { EyeClosedIcon } from "./EyeClosedIcon";
import { EyeIcon } from "./EyeIcon";
import { EyeSlashIcon } from "./EyeSlashIcon";
import { FireIcon } from "./FireIcon";
import { FlagIcon } from "./FlagIcon";
import { FlameIcon } from "./FlameIcon";
import { FolderIcon } from "./FolderIcon";
import { ForwardIcon } from "./ForwardIcon";
import { GalleryAddIcon } from "./GalleryAddIcon";
import { GalleryIcon } from "./GalleryIcon";
import { GenderIcon } from "./GenderIcon";
import { GiftIcon } from "./GiftIcon";
import { HomeIcon } from "./HomeIcon";
import { HourglassIcon } from "./HourglassIcon";
import { InboxIcon } from "./InboxIcon";
import { InfoCircleIcon } from "./InfoCircleIcon";
import { InfoIcon } from "./InfoIcon";
import { LifebuoyIcon } from "./LifebuoyIcon";
import { LightningIcon } from "./LightningIcon";
import { LinkIcon } from "./LinkIcon";
import { LocationIcon } from "./LocationIcon";
import { LockIcon } from "./LockIcon";
import { LockSlashIcon } from "./LockSlashIcon";
import { LogoutIcon } from "./LogoutIcon";
import { LoveClickIcon } from "./LoveClickIcon";
import { MedalIcon } from "./MedalIcon";
import { MenuIcon } from "./MenuIcon";
import { MessageFavoriteIcon } from "./MessageFavoriteIcon";
import { MicrophoneIcon } from "./MicrophoneIcon";
import { MinusIcon } from "./MinusIcon";
import { MoneyIcon } from "./MoneyIcon";
import { MoonIcon } from "./MoonIcon";
import { MoreHorizontalIcon } from "./MoreHorizontalIcon";
import { MoreVerticalIcon } from "./MoreVerticalIcon";
import { PauseCircleIcon } from "./PauseCircleIcon";
import { PhoneIcon } from "./PhoneIcon";
import { PhoneOffIcon } from "./PhoneOffIcon";
import { PinIcon } from "./PinIcon";
import { PlayCircleIcon } from "./PlayCircleIcon";
import { PlusIcon } from "./PlusIcon";
import { QuestionIcon } from "./QuestionIcon";
import { RepeatIcon } from "./RepeatIcon";
import { ReplyArrowIcon } from "./ReplyArrowIcon";
import { ReplyIcon } from "./ReplyIcon";
import { SearchIcon } from "./SearchIcon";
import { SendIcon } from "./SendIcon";
import { SettingsIcon } from "./SettingsIcon";
import { ShareIcon } from "./ShareIcon";
import { ShieldIcon } from "./ShieldIcon";
import { SidebarLeftIcon } from "./SidebarLeftIcon";
import { SidebarRightIcon } from "./SidebarRightIcon";
import { SpeakerIcon } from "./SpeakerIcon";
import { SpinnerIcon } from "./SpinnerIcon";
import { StarIcon } from "./StarIcon";
import { StopCircleIcon } from "./StopCircleIcon";
import { StopIcon } from "./StopIcon";
import { SuccessIcon } from "./SuccessIcon";
import { SunIcon } from "./SunIcon";
import { SupportIcon } from "./SupportIcon";
import { TagIcon } from "./TagIcon";
import { TaskIcon } from "./TaskIcon";
import { ThumbDownIcon } from "./ThumbDownIcon";
import { ThumbUpIcon } from "./ThumbUpIcon";
import { TrashIcon } from "./TrashIcon";
import { UploadCloudIcon } from "./UploadCloudIcon";
import { UploadIcon } from "./UploadIcon";
import { UserCircleAddIcon } from "./UserCircleAddIcon";
import { UserSquareIcon } from "./UserSquareIcon";
import { UsersIcon } from "./UsersIcon";
import { VideoIcon } from "./VideoIcon";
import { VipBadgeIcon } from "./VipBadgeIcon";
import { WalletIcon } from "./WalletIcon";
import { WarningIcon } from "./WarningIcon";
import { WarningTriangleIcon } from "./WarningTriangleIcon";
import { WifiIcon } from "./WifiIcon";
import { WifiOffIcon } from "./WifiOffIcon";
import { WrenchIcon } from "./WrenchIcon";

const icons = [
  { name: "AiEnhanceIcon", Component: AiEnhanceIcon },
  { name: "ArrowDownIcon", Component: ArrowDownIcon },
  { name: "ArrowLeftIcon", Component: ArrowLeftIcon },
  { name: "ArrowRightIcon", Component: ArrowRightIcon },
  { name: "ArrowUpIcon", Component: ArrowUpIcon },
  { name: "ArrowUpRightIcon", Component: ArrowUpRightIcon },
  { name: "BankIcon", Component: BankIcon },
  { name: "BellIcon", Component: BellIcon },
  { name: "BellOffIcon", Component: BellOffIcon },
  { name: "BulbIcon", Component: BulbIcon },
  { name: "CalendarDateIcon", Component: CalendarDateIcon },
  { name: "CalendarIcon", Component: CalendarIcon },
  { name: "ChartIcon", Component: ChartIcon },
  { name: "CheckboxOffIcon", Component: CheckboxOffIcon },
  { name: "CheckboxOnIcon", Component: CheckboxOnIcon },
  { name: "CheckCircleIcon", Component: CheckCircleIcon },
  { name: "CheckIcon", Component: CheckIcon },
  { name: "CheckOutlineIcon", Component: CheckOutlineIcon },
  { name: "ChevronDownIcon", Component: ChevronDownIcon },
  { name: "ChevronLeftIcon", Component: ChevronLeftIcon },
  { name: "ChevronRightIcon", Component: ChevronRightIcon },
  { name: "ChevronUpIcon", Component: ChevronUpIcon },
  { name: "ClockIcon", Component: ClockIcon },
  { name: "CloseIcon", Component: CloseIcon },
  { name: "CodeCircleIcon", Component: CodeCircleIcon },
  { name: "CoinIcon", Component: CoinIcon },
  { name: "CompassIcon", Component: CompassIcon },
  { name: "CopyIcon", Component: CopyIcon },
  { name: "CrossIcon", Component: CrossIcon },
  { name: "CrownIcon", Component: CrownIcon },
  { name: "DangerIcon", Component: DangerIcon },
  { name: "DiamondIcon", Component: DiamondIcon },
  { name: "DiscountCircleIcon", Component: DiscountCircleIcon },
  { name: "DonateIcon", Component: DonateIcon },
  { name: "DoubleCheckIcon", Component: DoubleCheckIcon },
  { name: "DownloadIcon", Component: DownloadIcon },
  { name: "EditIcon", Component: EditIcon },
  { name: "ErrorCircleIcon", Component: ErrorCircleIcon },
  { name: "ErrorIcon", Component: ErrorIcon },
  { name: "ExpandIcon", Component: ExpandIcon },
  { name: "EyeClosedIcon", Component: EyeClosedIcon },
  { name: "EyeIcon", Component: EyeIcon },
  { name: "EyeSlashIcon", Component: EyeSlashIcon },
  { name: "FireIcon", Component: FireIcon },
  { name: "FlagIcon", Component: FlagIcon },
  { name: "FlameIcon", Component: FlameIcon },
  { name: "FolderIcon", Component: FolderIcon },
  { name: "ForwardIcon", Component: ForwardIcon },
  { name: "GalleryAddIcon", Component: GalleryAddIcon },
  { name: "GalleryIcon", Component: GalleryIcon },
  { name: "GenderIcon", Component: GenderIcon },
  { name: "GiftIcon", Component: GiftIcon },
  { name: "HomeIcon", Component: HomeIcon },
  { name: "HourglassIcon", Component: HourglassIcon },
  { name: "InboxIcon", Component: InboxIcon },
  { name: "InfoCircleIcon", Component: InfoCircleIcon },
  { name: "InfoIcon", Component: InfoIcon },
  { name: "LifebuoyIcon", Component: LifebuoyIcon },
  { name: "LightningIcon", Component: LightningIcon },
  { name: "LinkIcon", Component: LinkIcon },
  { name: "LocationIcon", Component: LocationIcon },
  { name: "LockIcon", Component: LockIcon },
  { name: "LockSlashIcon", Component: LockSlashIcon },
  { name: "LogoutIcon", Component: LogoutIcon },
  { name: "LoveClickIcon", Component: LoveClickIcon },
  { name: "MedalIcon", Component: MedalIcon },
  { name: "MenuIcon", Component: MenuIcon },
  { name: "MessageFavoriteIcon", Component: MessageFavoriteIcon },
  { name: "MicrophoneIcon", Component: MicrophoneIcon },
  { name: "MinusIcon", Component: MinusIcon },
  { name: "MoneyIcon", Component: MoneyIcon },
  { name: "MoonIcon", Component: MoonIcon },
  { name: "MoreHorizontalIcon", Component: MoreHorizontalIcon },
  { name: "MoreVerticalIcon", Component: MoreVerticalIcon },
  { name: "PauseCircleIcon", Component: PauseCircleIcon },
  { name: "PhoneIcon", Component: PhoneIcon },
  { name: "PhoneOffIcon", Component: PhoneOffIcon },
  { name: "PinIcon", Component: PinIcon },
  { name: "PlayCircleIcon", Component: PlayCircleIcon },
  { name: "PlusIcon", Component: PlusIcon },
  { name: "QuestionIcon", Component: QuestionIcon },
  { name: "RepeatIcon", Component: RepeatIcon },
  { name: "ReplyArrowIcon", Component: ReplyArrowIcon },
  { name: "ReplyIcon", Component: ReplyIcon },
  { name: "SearchIcon", Component: SearchIcon },
  { name: "SendIcon", Component: SendIcon },
  { name: "SettingsIcon", Component: SettingsIcon },
  { name: "ShareIcon", Component: ShareIcon },
  { name: "ShieldIcon", Component: ShieldIcon },
  { name: "SidebarLeftIcon", Component: SidebarLeftIcon },
  { name: "SidebarRightIcon", Component: SidebarRightIcon },
  { name: "SpeakerIcon", Component: SpeakerIcon },
  { name: "SpinnerIcon", Component: SpinnerIcon },
  { name: "StarIcon", Component: StarIcon },
  { name: "StopCircleIcon", Component: StopCircleIcon },
  { name: "StopIcon", Component: StopIcon },
  { name: "SuccessIcon", Component: SuccessIcon },
  { name: "SunIcon", Component: SunIcon },
  { name: "SupportIcon", Component: SupportIcon },
  { name: "TagIcon", Component: TagIcon },
  { name: "TaskIcon", Component: TaskIcon },
  { name: "ThumbDownIcon", Component: ThumbDownIcon },
  { name: "ThumbUpIcon", Component: ThumbUpIcon },
  { name: "TrashIcon", Component: TrashIcon },
  { name: "UploadCloudIcon", Component: UploadCloudIcon },
  { name: "UploadIcon", Component: UploadIcon },
  { name: "UserCircleAddIcon", Component: UserCircleAddIcon },
  { name: "UsersIcon", Component: UsersIcon },
  { name: "UserSquareIcon", Component: UserSquareIcon },
  { name: "VideoIcon", Component: VideoIcon },
  { name: "VipBadgeIcon", Component: VipBadgeIcon },
  { name: "WalletIcon", Component: WalletIcon },
  { name: "WarningIcon", Component: WarningIcon },
  { name: "WarningTriangleIcon", Component: WarningTriangleIcon },
  { name: "WifiIcon", Component: WifiIcon },
  { name: "WifiOffIcon", Component: WifiOffIcon },
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
