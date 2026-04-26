import { render } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { AddIcon } from "./AddIcon";
import { AI2Icon } from "./AI2Icon";
import { AIDisclosureIcon } from "./AIDisclosureIcon";
import { AIIcon } from "./AIIcon";
import { AlertIcon } from "./AlertIcon";
import { AppsIcon } from "./AppsIcon";
import { ArrowDownIcon } from "./ArrowDownIcon";
import { ArrowLeftIcon } from "./ArrowLeftIcon";
import { ArrowRightIcon } from "./ArrowRightIcon";
import { ArrowUpIcon } from "./ArrowUpIcon";
import { ArrowUpRightIcon } from "./ArrowUpRightIcon";
import { AtSignIcon } from "./AtSignIcon";
import { AutoMessageIcon } from "./AutoMessageIcon";
import { BankIcon } from "./BankIcon";
import { BellIcon } from "./BellIcon";
import { BellOffIcon } from "./BellOffIcon";
import { BoltIcon } from "./BoltIcon";
import { BulbIcon } from "./BulbIcon";
import { Calendar2Icon } from "./Calendar2Icon";
import { CalendarIcon } from "./CalendarIcon";
import { CameraIcon } from "./CameraIcon";
import { CardIcon } from "./CardIcon";
import { ChartIcon } from "./ChartIcon";
import { CheckBoxOffIcon } from "./CheckBoxOffIcon";
import { CheckBoxOnIcon } from "./CheckBoxOnIcon";
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
import { ExclamationMarkIcon } from "./ExclamationMarkIcon";
import { ExpandIcon } from "./ExpandIcon";
import { EyeClosedIcon } from "./EyeClosedIcon";
import { EyeIcon } from "./EyeIcon";
import { EyeOffIcon } from "./EyeOffIcon";
import { EyeSlashIcon } from "./EyeSlashIcon";
import { FacebookIcon } from "./FacebookIcon";
import { FlagIcon } from "./FlagIcon";
import { FlameIcon } from "./FlameIcon";
import { FolderIcon } from "./FolderIcon";
import { ForwardIcon } from "./ForwardIcon";
import { GalleryIcon } from "./GalleryIcon";
import { GameIcon } from "./GameIcon";
import { GenderIcon } from "./GenderIcon";
import { GiftIcon } from "./GiftIcon";
import { GoogleIcon } from "./GoogleIcon";
import { HealthIcon } from "./HealthIcon";
import { HeartIcon } from "./HeartIcon";
import { HelpIcon } from "./HelpIcon";
import { HomeIcon } from "./HomeIcon";
import { HourglassIcon } from "./HourglassIcon";
import { ImageIcon } from "./ImageIcon";
import { InboxIcon } from "./InboxIcon";
import { InfoCircleIcon } from "./InfoCircleIcon";
import { InfoIcon } from "./InfoIcon";
import { LanguageIcon } from "./LanguageIcon";
import { LinkIcon } from "./LinkIcon";
import { LocationIcon } from "./LocationIcon";
import { LockerIcon } from "./LockerIcon";
import { LockerOffIcon } from "./LockerOffIcon";
import { LockerOnIcon } from "./LockerOnIcon";
import { LogoutIcon } from "./LogoutIcon";
import { LoveIcon } from "./LoveIcon";
import { MassMessageIcon } from "./MassMessageIcon";
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
import { NewMessageIcon } from "./NewMessageIcon";
import { OpenIcon } from "./OpenIcon";
import { PauseIcon } from "./PauseIcon";
import { PeopleIcon } from "./PeopleIcon";
import { PhoneIcon } from "./PhoneIcon";
import { PhoneOffIcon } from "./PhoneOffIcon";
import { PinIcon } from "./PinIcon";
import { PlayIcon } from "./PlayIcon";
import { PlusIcon } from "./PlusIcon";
import { PrivacyIcon } from "./PrivacyIcon";
import { QueueIcon } from "./QueueIcon";
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
import { ThumbDownFilledIcon } from "./ThumbDownFilledIcon";
import { ThumbDownIcon } from "./ThumbDownIcon";
import { ThumbUpFilledIcon } from "./ThumbUpFilledIcon";
import { ThumbUpIcon } from "./ThumbUpIcon";
import { TickCircleIcon } from "./TickCircleIcon";
import { TickCircleOffIcon } from "./TickCircleOffIcon";
import { TickIcon } from "./TickIcon";
import { ToolsIcon } from "./ToolsIcon";
import { TrashBinIcon } from "./TrashBinIcon";
import { TrashIcon } from "./TrashIcon";
import { TrophyIcon } from "./TrophyIcon";
import { TwitterIcon } from "./TwitterIcon";
import { UploadCloudIcon } from "./UploadCloudIcon";
import { UploadIcon } from "./UploadIcon";
import { UploadToCloudIcon } from "./UploadToCloudIcon";
import { UserAddIcon } from "./UserAddIcon";
import { UserAIIcon } from "./UserAIIcon";
import { UserCircleIcon } from "./UserCircleIcon";
import { UserIcon } from "./UserIcon";
import { UserMenuIcon } from "./UserMenuIcon";
import { UsersIcon } from "./UsersIcon";
import { VaultIcon } from "./VaultIcon";
import { VideoIcon } from "./VideoIcon";
import { VipBadgeIcon } from "./VipBadgeIcon";
import { WalletIcon } from "./WalletIcon";
import { WarningIcon } from "./WarningIcon";
import { WarningTriangleIcon } from "./WarningTriangleIcon";
import { WifiIcon } from "./WifiIcon";
import { WifiOffIcon } from "./WifiOffIcon";
import { WifiOnIcon } from "./WifiOnIcon";
import { WrenchIcon } from "./WrenchIcon";

const legacyIcons = [
  { name: "ArrowUpRightIcon", Component: ArrowUpRightIcon },
  { name: "CameraIcon", Component: CameraIcon },
  { name: "CheckCircleIcon", Component: CheckCircleIcon },
  { name: "CheckIcon", Component: CheckIcon },
  { name: "CheckOutlineIcon", Component: CheckOutlineIcon },
  { name: "CrossIcon", Component: CrossIcon },
  { name: "EmojiIcon", Component: EmojiIcon },
  { name: "ErrorCircleIcon", Component: ErrorCircleIcon },
  { name: "ErrorIcon", Component: ErrorIcon },
  { name: "EyeClosedIcon", Component: EyeClosedIcon },
  { name: "EyeSlashIcon", Component: EyeSlashIcon },
  { name: "FacebookIcon", Component: FacebookIcon },
  { name: "GalleryIcon", Component: GalleryIcon },
  { name: "GoogleIcon", Component: GoogleIcon },
  { name: "InfoCircleIcon", Component: InfoCircleIcon },
  { name: "LockerOnIcon", Component: LockerOnIcon },
  { name: "OpenIcon", Component: OpenIcon },
  { name: "PeopleIcon", Component: PeopleIcon },
  { name: "PlusIcon", Component: PlusIcon },
  { name: "SpinnerIcon", Component: SpinnerIcon },
  { name: "SuccessIcon", Component: SuccessIcon },
  { name: "ThumbDownFilledIcon", Component: ThumbDownFilledIcon },
  { name: "ThumbUpFilledIcon", Component: ThumbUpFilledIcon },
  { name: "TrashBinIcon", Component: TrashBinIcon },
  { name: "TwitterIcon", Component: TwitterIcon },
  { name: "UploadCloudIcon", Component: UploadCloudIcon },
  { name: "UserCircleIcon", Component: UserCircleIcon },
  { name: "VipBadgeIcon", Component: VipBadgeIcon },
  { name: "WarningTriangleIcon", Component: WarningTriangleIcon },
  { name: "WifiOnIcon", Component: WifiOnIcon },
  { name: "WrenchIcon", Component: WrenchIcon },
];

const propBasedIcons = [
  { name: "AI2Icon", Component: AI2Icon, hasFilled: true },
  { name: "AIDisclosureIcon", Component: AIDisclosureIcon, hasFilled: true },
  { name: "AIIcon", Component: AIIcon, hasFilled: true },
  { name: "AddIcon", Component: AddIcon, hasFilled: false },
  { name: "AlertIcon", Component: AlertIcon, hasFilled: true },
  { name: "AppsIcon", Component: AppsIcon, hasFilled: true },
  { name: "ArrowDownIcon", Component: ArrowDownIcon, hasFilled: false },
  { name: "ArrowLeftIcon", Component: ArrowLeftIcon, hasFilled: false },
  { name: "ArrowRightIcon", Component: ArrowRightIcon, hasFilled: false },
  { name: "ArrowUpIcon", Component: ArrowUpIcon, hasFilled: false },
  { name: "AtSignIcon", Component: AtSignIcon, hasFilled: false },
  { name: "AutoMessageIcon", Component: AutoMessageIcon, hasFilled: true },
  { name: "BankIcon", Component: BankIcon, hasFilled: true },
  { name: "BellIcon", Component: BellIcon, hasFilled: true },
  { name: "BellOffIcon", Component: BellOffIcon, hasFilled: true },
  { name: "BoltIcon", Component: BoltIcon, hasFilled: true },
  { name: "BulbIcon", Component: BulbIcon, hasFilled: true },
  { name: "Calendar2Icon", Component: Calendar2Icon, hasFilled: true },
  { name: "CalendarIcon", Component: CalendarIcon, hasFilled: true },
  { name: "CardIcon", Component: CardIcon, hasFilled: true },
  { name: "ChartIcon", Component: ChartIcon, hasFilled: true },
  { name: "CheckBoxOffIcon", Component: CheckBoxOffIcon, hasFilled: true },
  { name: "CheckBoxOnIcon", Component: CheckBoxOnIcon, hasFilled: true },
  { name: "ChevronDownIcon", Component: ChevronDownIcon, hasFilled: false },
  { name: "ChevronLeftIcon", Component: ChevronLeftIcon, hasFilled: false },
  { name: "ChevronRightIcon", Component: ChevronRightIcon, hasFilled: false },
  { name: "ChevronUpIcon", Component: ChevronUpIcon, hasFilled: false },
  { name: "ClockIcon", Component: ClockIcon, hasFilled: true },
  { name: "CloseIcon", Component: CloseIcon, hasFilled: false },
  { name: "CodeIcon", Component: CodeIcon, hasFilled: true },
  { name: "CoinIcon", Component: CoinIcon, hasFilled: true },
  { name: "CompassIcon", Component: CompassIcon, hasFilled: true },
  { name: "CopyIcon", Component: CopyIcon, hasFilled: true },
  { name: "CrownIcon", Component: CrownIcon, hasFilled: true },
  { name: "DiamondIcon", Component: DiamondIcon, hasFilled: true },
  { name: "DiscountIcon", Component: DiscountIcon, hasFilled: true },
  { name: "DonateIcon", Component: DonateIcon, hasFilled: true },
  { name: "DoubleTickIcon", Component: DoubleTickIcon, hasFilled: true },
  { name: "DownloadIcon", Component: DownloadIcon, hasFilled: true },
  { name: "EditIcon", Component: EditIcon, hasFilled: true },
  { name: "ExclamationMarkIcon", Component: ExclamationMarkIcon, hasFilled: true },
  { name: "ExpandIcon", Component: ExpandIcon, hasFilled: true },
  { name: "EyeIcon", Component: EyeIcon, hasFilled: true },
  { name: "EyeOffIcon", Component: EyeOffIcon, hasFilled: true },
  { name: "FlagIcon", Component: FlagIcon, hasFilled: true },
  { name: "FlameIcon", Component: FlameIcon, hasFilled: true },
  { name: "FolderIcon", Component: FolderIcon, hasFilled: true },
  { name: "ForwardIcon", Component: ForwardIcon, hasFilled: true },
  { name: "GameIcon", Component: GameIcon, hasFilled: true },
  { name: "GenderIcon", Component: GenderIcon, hasFilled: true },
  { name: "GiftIcon", Component: GiftIcon, hasFilled: true },
  { name: "HealthIcon", Component: HealthIcon, hasFilled: true },
  { name: "HeartIcon", Component: HeartIcon, hasFilled: true },
  { name: "HelpIcon", Component: HelpIcon, hasFilled: true },
  { name: "HomeIcon", Component: HomeIcon, hasFilled: true },
  { name: "HourglassIcon", Component: HourglassIcon, hasFilled: true },
  { name: "ImageIcon", Component: ImageIcon, hasFilled: true },
  { name: "InboxIcon", Component: InboxIcon, hasFilled: true },
  { name: "InfoIcon", Component: InfoIcon, hasFilled: true },
  { name: "LanguageIcon", Component: LanguageIcon, hasFilled: true },
  { name: "LinkIcon", Component: LinkIcon, hasFilled: false },
  { name: "LocationIcon", Component: LocationIcon, hasFilled: true },
  { name: "LockerIcon", Component: LockerIcon, hasFilled: true },
  { name: "LockerOffIcon", Component: LockerOffIcon, hasFilled: true },
  { name: "LogoutIcon", Component: LogoutIcon, hasFilled: true },
  { name: "LoveIcon", Component: LoveIcon, hasFilled: true },
  { name: "MassMessageIcon", Component: MassMessageIcon, hasFilled: true },
  { name: "MegaphoneIcon", Component: MegaphoneIcon, hasFilled: true },
  { name: "MenuCloseIcon", Component: MenuCloseIcon, hasFilled: true },
  { name: "MenuIcon", Component: MenuIcon, hasFilled: false },
  { name: "MenuOpenIcon", Component: MenuOpenIcon, hasFilled: true },
  { name: "MessageIcon", Component: MessageIcon, hasFilled: true },
  { name: "MicrophoneIcon", Component: MicrophoneIcon, hasFilled: true },
  { name: "MinusIcon", Component: MinusIcon, hasFilled: false },
  { name: "MoonIcon", Component: MoonIcon, hasFilled: true },
  { name: "MoreIcon", Component: MoreIcon, hasFilled: false },
  { name: "MoreVerticalIcon", Component: MoreVerticalIcon, hasFilled: false },
  { name: "NewMessageIcon", Component: NewMessageIcon, hasFilled: true },
  { name: "PauseIcon", Component: PauseIcon, hasFilled: true },
  { name: "PhoneIcon", Component: PhoneIcon, hasFilled: true },
  { name: "PhoneOffIcon", Component: PhoneOffIcon, hasFilled: true },
  { name: "PinIcon", Component: PinIcon, hasFilled: true },
  { name: "PlayIcon", Component: PlayIcon, hasFilled: true },
  { name: "PrivacyIcon", Component: PrivacyIcon, hasFilled: true },
  { name: "QueueIcon", Component: QueueIcon, hasFilled: false },
  { name: "RepeatIcon", Component: RepeatIcon, hasFilled: false },
  { name: "Reply2Icon", Component: Reply2Icon, hasFilled: true },
  { name: "ReplyIcon", Component: ReplyIcon, hasFilled: true },
  { name: "ReverseIcon", Component: ReverseIcon, hasFilled: false },
  { name: "SearchIcon", Component: SearchIcon, hasFilled: true },
  { name: "SendIcon", Component: SendIcon, hasFilled: true },
  { name: "SettingsIcon", Component: SettingsIcon, hasFilled: true },
  { name: "ShareIcon", Component: ShareIcon, hasFilled: true },
  { name: "StarIcon", Component: StarIcon, hasFilled: true },
  { name: "StopIcon", Component: StopIcon, hasFilled: true },
  { name: "SunIcon", Component: SunIcon, hasFilled: true },
  { name: "Support2Icon", Component: Support2Icon, hasFilled: true },
  { name: "SupportIcon", Component: SupportIcon, hasFilled: true },
  { name: "TagIcon", Component: TagIcon, hasFilled: true },
  { name: "TaskIcon", Component: TaskIcon, hasFilled: false },
  { name: "ThumbDownIcon", Component: ThumbDownIcon, hasFilled: true },
  { name: "ThumbUpIcon", Component: ThumbUpIcon, hasFilled: true },
  { name: "TickCircleIcon", Component: TickCircleIcon, hasFilled: true },
  { name: "TickCircleOffIcon", Component: TickCircleOffIcon, hasFilled: false },
  { name: "TickIcon", Component: TickIcon, hasFilled: false },
  { name: "ToolsIcon", Component: ToolsIcon, hasFilled: true },
  { name: "TrashIcon", Component: TrashIcon, hasFilled: true },
  { name: "TrophyIcon", Component: TrophyIcon, hasFilled: true },
  { name: "UploadIcon", Component: UploadIcon, hasFilled: true },
  { name: "UploadToCloudIcon", Component: UploadToCloudIcon, hasFilled: true },
  { name: "UserAIIcon", Component: UserAIIcon, hasFilled: true },
  { name: "UserAddIcon", Component: UserAddIcon, hasFilled: true },
  { name: "UserIcon", Component: UserIcon, hasFilled: true },
  { name: "UserMenuIcon", Component: UserMenuIcon, hasFilled: true },
  { name: "UsersIcon", Component: UsersIcon, hasFilled: true },
  { name: "VaultIcon", Component: VaultIcon, hasFilled: true },
  { name: "VideoIcon", Component: VideoIcon, hasFilled: true },
  { name: "WalletIcon", Component: WalletIcon, hasFilled: true },
  { name: "WarningIcon", Component: WarningIcon, hasFilled: true },
  { name: "WifiIcon", Component: WifiIcon, hasFilled: false },
  { name: "WifiOffIcon", Component: WifiOffIcon, hasFilled: false },
];

describe("Icons", () => {
  for (const { name, Component } of [...legacyIcons, ...propBasedIcons]) {
    describe(name, () => {
      it("renders an SVG element", () => {
        const { container } = render(<Component />);
        expect(container.querySelector("svg")).toBeInTheDocument();
      });

      it("applies aria-hidden by default", () => {
        const { container } = render(<Component />);
        expect(container.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
      });

      it("allows aria-hidden override for standalone usage", () => {
        const { container } = render(
          <Component aria-hidden={false} role="img" aria-label="example" />,
        );
        expect(container.querySelector("svg")).toHaveAttribute("aria-hidden", "false");
      });

      it("has a default size class", () => {
        const { container } = render(<Component />);
        expect(container.querySelector("svg")?.getAttribute("class")).toMatch(/size-\d/);
      });

      it("allows size override via className", () => {
        const { container } = render(<Component className="size-10" />);
        expect(container.querySelector("svg")).toHaveClass("size-10");
      });

      it("applies custom className", () => {
        const { container } = render(<Component className="custom-icon" />);
        expect(container.querySelector("svg")).toHaveClass("custom-icon");
      });

      it("forwards ref", () => {
        const ref = createRef<SVGSVGElement>();
        render(<Component ref={ref} />);
        expect(ref.current).toBeInstanceOf(SVGSVGElement);
      });

      it("has no accessibility violations", async () => {
        const { container } = render(
          <Component role="img" aria-label={name} aria-hidden={false} />,
        );
        expect(await axe(container)).toHaveNoViolations();
      });
    });
  }

  for (const { name, Component, hasFilled } of propBasedIcons) {
    describe(`${name} (prop-based)`, () => {
      it("renders each size with a matching viewBox", () => {
        for (const size of [16, 24, 32] as const) {
          const { container } = render(<Component size={size} />);
          const svg = container.querySelector("svg");
          expect(svg).toHaveAttribute("viewBox", `0 0 ${size} ${size}`);
        }
      });

      if (hasFilled) {
        it("renders different geometry for filled vs outlined in at least one size", () => {
          const diffs = ([16, 24, 32] as const).map((size) => {
            const { container: outlined } = render(<Component size={size} />);
            const { container: filled } = render(<Component size={size} filled />);
            const o = outlined.querySelector("svg")?.innerHTML ?? "";
            const f = filled.querySelector("svg")?.innerHTML ?? "";
            return o !== "" && f !== "" && o !== f;
          });
          expect(diffs.some(Boolean)).toBe(true);
        });
      } else {
        it("accepts the filled prop without error (variant unavailable)", () => {
          const { container } = render(<Component filled />);
          expect(container.querySelector("svg")).toBeInTheDocument();
        });
      }
    });
  }
});
