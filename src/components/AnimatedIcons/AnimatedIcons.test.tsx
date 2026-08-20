import { render } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { AddIcon as StaticAddIcon } from "../Icons/AddIcon";
import { AffiliatesIcon as StaticAffiliatesIcon } from "../Icons/AffiliatesIcon";
import { AIIcon as StaticAIIcon } from "../Icons/AIIcon";
import { ArrowDownIcon as StaticArrowDownIcon } from "../Icons/ArrowDownIcon";
import { ArrowLeftIcon as StaticArrowLeftIcon } from "../Icons/ArrowLeftIcon";
import { ArrowRightIcon as StaticArrowRightIcon } from "../Icons/ArrowRightIcon";
import { ArrowUpIcon as StaticArrowUpIcon } from "../Icons/ArrowUpIcon";
import { ArrowUpRightIcon as StaticArrowUpRightIcon } from "../Icons/ArrowUpRightIcon";
import { AtSignIcon as StaticAtSignIcon } from "../Icons/AtSignIcon";
import { BellIcon as StaticBellIcon } from "../Icons/BellIcon";
import { BoltIcon as StaticBoltIcon } from "../Icons/BoltIcon";
import { CalendarIcon as StaticCalendarIcon } from "../Icons/CalendarIcon";
import { CardIcon as StaticCardIcon } from "../Icons/CardIcon";
import { CheckIcon as StaticCheckIcon } from "../Icons/CheckIcon";
import { CheckOutlineIcon as StaticCheckOutlineIcon } from "../Icons/CheckOutlineIcon";
import { ChevronDownIcon as StaticChevronDownIcon } from "../Icons/ChevronDownIcon";
import { ChevronLeftIcon as StaticChevronLeftIcon } from "../Icons/ChevronLeftIcon";
import { ChevronRightIcon as StaticChevronRightIcon } from "../Icons/ChevronRightIcon";
import { ChevronUpIcon as StaticChevronUpIcon } from "../Icons/ChevronUpIcon";
import { ClockIcon as StaticClockIcon } from "../Icons/ClockIcon";
import { CloseIcon as StaticCloseIcon } from "../Icons/CloseIcon";
import { CogIcon as StaticCogIcon } from "../Icons/CogIcon";
import { CoinIcon as StaticCoinIcon } from "../Icons/CoinIcon";
import { CopyIcon as StaticCopyIcon } from "../Icons/CopyIcon";
import { CrossIcon as StaticCrossIcon } from "../Icons/CrossIcon";
import { DiscordIcon as StaticDiscordIcon } from "../Icons/DiscordIcon";
import { DoubleTickIcon as StaticDoubleTickIcon } from "../Icons/DoubleTickIcon";
import { DownloadIcon as StaticDownloadIcon } from "../Icons/DownloadIcon";
import { EmojiIcon as StaticEmojiIcon } from "../Icons/EmojiIcon";
import { ExpandIcon as StaticExpandIcon } from "../Icons/ExpandIcon";
import { EyeIcon as StaticEyeIcon } from "../Icons/EyeIcon";
import { EyeOffIcon as StaticEyeOffIcon } from "../Icons/EyeOffIcon";
import { FlameIcon as StaticFlameIcon } from "../Icons/FlameIcon";
import { HeartIcon as StaticHeartIcon } from "../Icons/HeartIcon";
import { HelpIcon as StaticHelpIcon } from "../Icons/HelpIcon";
import { HomeIcon as StaticHomeIcon } from "../Icons/HomeIcon";
import { HourglassIcon as StaticHourglassIcon } from "../Icons/HourglassIcon";
import { LanguageIcon as StaticLanguageIcon } from "../Icons/LanguageIcon";
import { LinkIcon as StaticLinkIcon } from "../Icons/LinkIcon";
import { LocationIcon as StaticLocationIcon } from "../Icons/LocationIcon";
import { LockerIcon as StaticLockerIcon } from "../Icons/LockerIcon";
import { LockerOnIcon as StaticLockerOnIcon } from "../Icons/LockerOnIcon";
import { MenuCloseIcon as StaticMenuCloseIcon } from "../Icons/MenuCloseIcon";
import { MenuIcon as StaticMenuIcon } from "../Icons/MenuIcon";
import { MenuOpenIcon as StaticMenuOpenIcon } from "../Icons/MenuOpenIcon";
import { MicrophoneIcon as StaticMicrophoneIcon } from "../Icons/MicrophoneIcon";
import { NewMessageIcon as StaticNewMessageIcon } from "../Icons/NewMessageIcon";
import { OpenIcon as StaticOpenIcon } from "../Icons/OpenIcon";
import { PeopleIcon as StaticPeopleIcon } from "../Icons/PeopleIcon";
import { PhoneIcon as StaticPhoneIcon } from "../Icons/PhoneIcon";
import { PlusIcon as StaticPlusIcon } from "../Icons/PlusIcon";
import { ReverseIcon as StaticReverseIcon } from "../Icons/ReverseIcon";
import { SearchIcon as StaticSearchIcon } from "../Icons/SearchIcon";
import { SendIcon as StaticSendIcon } from "../Icons/SendIcon";
import { SettingsIcon as StaticSettingsIcon } from "../Icons/SettingsIcon";
import { SoundIcon as StaticSoundIcon } from "../Icons/SoundIcon";
import { SpinnerIcon as StaticSpinnerIcon } from "../Icons/SpinnerIcon";
import { SunIcon as StaticSunIcon } from "../Icons/SunIcon";
import { ThumbDownIcon as StaticThumbDownIcon } from "../Icons/ThumbDownIcon";
import { ThumbUpIcon as StaticThumbUpIcon } from "../Icons/ThumbUpIcon";
import { TickCircleIcon as StaticTickCircleIcon } from "../Icons/TickCircleIcon";
import { TickIcon as StaticTickIcon } from "../Icons/TickIcon";
import { TrashBinIcon as StaticTrashBinIcon } from "../Icons/TrashBinIcon";
import { TrashIcon as StaticTrashIcon } from "../Icons/TrashIcon";
import { UploadCloudIcon as StaticUploadCloudIcon } from "../Icons/UploadCloudIcon";
import { UploadIcon as StaticUploadIcon } from "../Icons/UploadIcon";
import { UploadToCloudIcon as StaticUploadToCloudIcon } from "../Icons/UploadToCloudIcon";
import { UsersIcon as StaticUsersIcon } from "../Icons/UsersIcon";
import { WalletIcon as StaticWalletIcon } from "../Icons/WalletIcon";
import { WifiIcon as StaticWifiIcon } from "../Icons/WifiIcon";
import { WifiOnIcon as StaticWifiOnIcon } from "../Icons/WifiOnIcon";
import { WrenchIcon as StaticWrenchIcon } from "../Icons/WrenchIcon";
import { AddIcon } from "./AddIcon";
import { AffiliatesIcon } from "./AffiliatesIcon";
import { AIIcon } from "./AIIcon";
import { ArrowDownIcon } from "./ArrowDownIcon";
import { ArrowLeftIcon } from "./ArrowLeftIcon";
import { ArrowRightIcon } from "./ArrowRightIcon";
import { ArrowUpIcon } from "./ArrowUpIcon";
import { ArrowUpRightIcon } from "./ArrowUpRightIcon";
import { AtSignIcon } from "./AtSignIcon";
import { BellIcon } from "./BellIcon";
import { BoltIcon } from "./BoltIcon";
import { CalendarIcon } from "./CalendarIcon";
import { CardIcon } from "./CardIcon";
import { CheckIcon } from "./CheckIcon";
import { CheckOutlineIcon } from "./CheckOutlineIcon";
import { ChevronDownIcon } from "./ChevronDownIcon";
import { ChevronLeftIcon } from "./ChevronLeftIcon";
import { ChevronRightIcon } from "./ChevronRightIcon";
import { ChevronUpIcon } from "./ChevronUpIcon";
import { ClockIcon } from "./ClockIcon";
import { CloseIcon } from "./CloseIcon";
import { CogIcon } from "./CogIcon";
import { CoinIcon } from "./CoinIcon";
import { CopyIcon } from "./CopyIcon";
import { CrossIcon } from "./CrossIcon";
import { DiscordIcon } from "./DiscordIcon";
import { DoubleTickIcon } from "./DoubleTickIcon";
import { DownloadIcon } from "./DownloadIcon";
import { EmojiIcon } from "./EmojiIcon";
import { ExpandIcon } from "./ExpandIcon";
import { EyeIcon } from "./EyeIcon";
import { EyeOffIcon } from "./EyeOffIcon";
import { FlameIcon } from "./FlameIcon";
import { HeartIcon } from "./HeartIcon";
import { HelpIcon } from "./HelpIcon";
import { HomeIcon } from "./HomeIcon";
import { HourglassIcon } from "./HourglassIcon";
import { LanguageIcon } from "./LanguageIcon";
import { LinkIcon } from "./LinkIcon";
import { LocationIcon } from "./LocationIcon";
import { LockerIcon } from "./LockerIcon";
import { LockerOnIcon } from "./LockerOnIcon";
import { MenuCloseIcon } from "./MenuCloseIcon";
import { MenuIcon } from "./MenuIcon";
import { MenuOpenIcon } from "./MenuOpenIcon";
import { MicrophoneIcon } from "./MicrophoneIcon";
import { NewMessageIcon } from "./NewMessageIcon";
import { OpenIcon } from "./OpenIcon";
import { PeopleIcon } from "./PeopleIcon";
import { PhoneIcon } from "./PhoneIcon";
import { PlusIcon } from "./PlusIcon";
import { ReverseIcon } from "./ReverseIcon";
import { SearchIcon } from "./SearchIcon";
import { SendIcon } from "./SendIcon";
import { SettingsIcon } from "./SettingsIcon";
import { SoundIcon } from "./SoundIcon";
import { SpinnerIcon } from "./SpinnerIcon";
import { SunIcon } from "./SunIcon";
import { ThumbDownIcon } from "./ThumbDownIcon";
import { ThumbUpIcon } from "./ThumbUpIcon";
import { TickCircleIcon } from "./TickCircleIcon";
import { TickIcon } from "./TickIcon";
import { TrashBinIcon } from "./TrashBinIcon";
import { TrashIcon } from "./TrashIcon";
import { UploadCloudIcon } from "./UploadCloudIcon";
import { UploadIcon } from "./UploadIcon";
import { UploadToCloudIcon } from "./UploadToCloudIcon";
import { UsersIcon } from "./UsersIcon";
import { WalletIcon } from "./WalletIcon";
import { WifiIcon } from "./WifiIcon";
import { WifiOnIcon } from "./WifiOnIcon";
import { WrenchIcon } from "./WrenchIcon";

/** The `size-*` box class an icon renders with, e.g. `size-6`. */
function boxClass(container: HTMLElement) {
  const classes = container.querySelector("svg")?.getAttribute("class") ?? "";
  return classes.split(/\s+/).find((c) => /^size-/.test(c));
}

const animatedIcons = [
  { name: "AddIcon", Component: AddIcon, Static: StaticAddIcon, propBased: true },
  {
    name: "AffiliatesIcon",
    Component: AffiliatesIcon,
    Static: StaticAffiliatesIcon,
    propBased: true,
  },
  { name: "AIIcon", Component: AIIcon, Static: StaticAIIcon, propBased: true },
  { name: "ArrowDownIcon", Component: ArrowDownIcon, Static: StaticArrowDownIcon, propBased: true },
  { name: "ArrowLeftIcon", Component: ArrowLeftIcon, Static: StaticArrowLeftIcon, propBased: true },
  {
    name: "ArrowRightIcon",
    Component: ArrowRightIcon,
    Static: StaticArrowRightIcon,
    propBased: true,
  },
  { name: "ArrowUpIcon", Component: ArrowUpIcon, Static: StaticArrowUpIcon, propBased: true },
  {
    name: "ArrowUpRightIcon",
    Component: ArrowUpRightIcon,
    Static: StaticArrowUpRightIcon,
    propBased: false,
  },
  { name: "AtSignIcon", Component: AtSignIcon, Static: StaticAtSignIcon, propBased: true },
  { name: "BellIcon", Component: BellIcon, Static: StaticBellIcon, propBased: true },
  { name: "BoltIcon", Component: BoltIcon, Static: StaticBoltIcon, propBased: true },
  { name: "CalendarIcon", Component: CalendarIcon, Static: StaticCalendarIcon, propBased: true },
  { name: "CardIcon", Component: CardIcon, Static: StaticCardIcon, propBased: true },
  { name: "CheckIcon", Component: CheckIcon, Static: StaticCheckIcon, propBased: false },
  {
    name: "CheckOutlineIcon",
    Component: CheckOutlineIcon,
    Static: StaticCheckOutlineIcon,
    propBased: false,
  },
  {
    name: "ChevronDownIcon",
    Component: ChevronDownIcon,
    Static: StaticChevronDownIcon,
    propBased: true,
  },
  {
    name: "ChevronLeftIcon",
    Component: ChevronLeftIcon,
    Static: StaticChevronLeftIcon,
    propBased: true,
  },
  {
    name: "ChevronRightIcon",
    Component: ChevronRightIcon,
    Static: StaticChevronRightIcon,
    propBased: true,
  },
  { name: "ChevronUpIcon", Component: ChevronUpIcon, Static: StaticChevronUpIcon, propBased: true },
  { name: "ClockIcon", Component: ClockIcon, Static: StaticClockIcon, propBased: true },
  { name: "CloseIcon", Component: CloseIcon, Static: StaticCloseIcon, propBased: true },
  { name: "CogIcon", Component: CogIcon, Static: StaticCogIcon, propBased: true },
  { name: "CoinIcon", Component: CoinIcon, Static: StaticCoinIcon, propBased: true },
  { name: "CopyIcon", Component: CopyIcon, Static: StaticCopyIcon, propBased: true },
  { name: "CrossIcon", Component: CrossIcon, Static: StaticCrossIcon, propBased: false },
  { name: "DiscordIcon", Component: DiscordIcon, Static: StaticDiscordIcon, propBased: true },
  {
    name: "DoubleTickIcon",
    Component: DoubleTickIcon,
    Static: StaticDoubleTickIcon,
    propBased: true,
  },
  { name: "DownloadIcon", Component: DownloadIcon, Static: StaticDownloadIcon, propBased: true },
  { name: "EmojiIcon", Component: EmojiIcon, Static: StaticEmojiIcon, propBased: false },
  { name: "ExpandIcon", Component: ExpandIcon, Static: StaticExpandIcon, propBased: true },
  { name: "EyeIcon", Component: EyeIcon, Static: StaticEyeIcon, propBased: true },
  { name: "EyeOffIcon", Component: EyeOffIcon, Static: StaticEyeOffIcon, propBased: true },
  { name: "FlameIcon", Component: FlameIcon, Static: StaticFlameIcon, propBased: true },
  { name: "HeartIcon", Component: HeartIcon, Static: StaticHeartIcon, propBased: true },
  { name: "HelpIcon", Component: HelpIcon, Static: StaticHelpIcon, propBased: true },
  { name: "HomeIcon", Component: HomeIcon, Static: StaticHomeIcon, propBased: true },
  { name: "HourglassIcon", Component: HourglassIcon, Static: StaticHourglassIcon, propBased: true },
  { name: "LanguageIcon", Component: LanguageIcon, Static: StaticLanguageIcon, propBased: true },
  { name: "LinkIcon", Component: LinkIcon, Static: StaticLinkIcon, propBased: true },
  { name: "LocationIcon", Component: LocationIcon, Static: StaticLocationIcon, propBased: true },
  { name: "LockerIcon", Component: LockerIcon, Static: StaticLockerIcon, propBased: true },
  { name: "LockerOnIcon", Component: LockerOnIcon, Static: StaticLockerOnIcon, propBased: false },
  { name: "MenuCloseIcon", Component: MenuCloseIcon, Static: StaticMenuCloseIcon, propBased: true },
  { name: "MenuIcon", Component: MenuIcon, Static: StaticMenuIcon, propBased: true },
  { name: "MenuOpenIcon", Component: MenuOpenIcon, Static: StaticMenuOpenIcon, propBased: true },
  {
    name: "MicrophoneIcon",
    Component: MicrophoneIcon,
    Static: StaticMicrophoneIcon,
    propBased: true,
  },
  {
    name: "NewMessageIcon",
    Component: NewMessageIcon,
    Static: StaticNewMessageIcon,
    propBased: true,
  },
  { name: "OpenIcon", Component: OpenIcon, Static: StaticOpenIcon, propBased: false },
  { name: "PeopleIcon", Component: PeopleIcon, Static: StaticPeopleIcon, propBased: false },
  { name: "PhoneIcon", Component: PhoneIcon, Static: StaticPhoneIcon, propBased: true },
  { name: "PlusIcon", Component: PlusIcon, Static: StaticPlusIcon, propBased: false },
  { name: "ReverseIcon", Component: ReverseIcon, Static: StaticReverseIcon, propBased: true },
  { name: "SearchIcon", Component: SearchIcon, Static: StaticSearchIcon, propBased: true },
  { name: "SendIcon", Component: SendIcon, Static: StaticSendIcon, propBased: true },
  { name: "SettingsIcon", Component: SettingsIcon, Static: StaticSettingsIcon, propBased: true },
  { name: "SoundIcon", Component: SoundIcon, Static: StaticSoundIcon, propBased: true },
  { name: "SpinnerIcon", Component: SpinnerIcon, Static: StaticSpinnerIcon, propBased: false },
  { name: "SunIcon", Component: SunIcon, Static: StaticSunIcon, propBased: true },
  { name: "ThumbDownIcon", Component: ThumbDownIcon, Static: StaticThumbDownIcon, propBased: true },
  { name: "ThumbUpIcon", Component: ThumbUpIcon, Static: StaticThumbUpIcon, propBased: true },
  {
    name: "TickCircleIcon",
    Component: TickCircleIcon,
    Static: StaticTickCircleIcon,
    propBased: true,
  },
  { name: "TickIcon", Component: TickIcon, Static: StaticTickIcon, propBased: true },
  { name: "TrashBinIcon", Component: TrashBinIcon, Static: StaticTrashBinIcon, propBased: false },
  { name: "TrashIcon", Component: TrashIcon, Static: StaticTrashIcon, propBased: true },
  {
    name: "UploadCloudIcon",
    Component: UploadCloudIcon,
    Static: StaticUploadCloudIcon,
    propBased: false,
  },
  { name: "UploadIcon", Component: UploadIcon, Static: StaticUploadIcon, propBased: true },
  {
    name: "UploadToCloudIcon",
    Component: UploadToCloudIcon,
    Static: StaticUploadToCloudIcon,
    propBased: true,
  },
  { name: "UsersIcon", Component: UsersIcon, Static: StaticUsersIcon, propBased: true },
  { name: "WalletIcon", Component: WalletIcon, Static: StaticWalletIcon, propBased: true },
  { name: "WifiIcon", Component: WifiIcon, Static: StaticWifiIcon, propBased: true },
  { name: "WifiOnIcon", Component: WifiOnIcon, Static: StaticWifiOnIcon, propBased: false },
  { name: "WrenchIcon", Component: WrenchIcon, Static: StaticWrenchIcon, propBased: false },
];

describe("AnimatedIcons", () => {
  for (const { name, Component } of animatedIcons) {
    describe(name, () => {
      it("renders an SVG element", () => {
        const { container } = render(<Component />);
        expect(container.querySelector("svg")).toBeInTheDocument();
      });

      it("renders a single element with no wrapper", () => {
        const { container } = render(<Component />);
        expect(container.children).toHaveLength(1);
        expect(container.firstElementChild?.tagName.toLowerCase()).toBe("svg");
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

      it("applies custom className", () => {
        const { container } = render(<Component className="custom-icon" />);
        expect(container.querySelector("svg")).toHaveClass("custom-icon");
      });

      it("allows size override via className", () => {
        const { container } = render(<Component className="size-10" />);
        expect(container.querySelector("svg")).toHaveClass("size-10");
      });

      it("forwards ref to the svg element", () => {
        const ref = createRef<SVGSVGElement>();
        render(<Component ref={ref} />);
        expect(ref.current).toBeInstanceOf(SVGSVGElement);
      });

      it("exposes imperative animation controls via controlRef", () => {
        const controlRef = createRef<{
          startAnimation: () => void;
          stopAnimation: () => void;
        }>();
        render(<Component controlRef={controlRef} />);
        expect(typeof controlRef.current?.startAnimation).toBe("function");
        expect(typeof controlRef.current?.stopAnimation).toBe("function");
      });

      it("has no accessibility violations", async () => {
        const { container } = render(
          <Component role="img" aria-label={name} aria-hidden={false} />,
        );
        expect(await axe(container)).toHaveNoViolations();
      });
    });
  }

  describe("stays 1:1 with the static icon of the same name", () => {
    for (const { name, Component, Static, propBased } of animatedIcons) {
      if (propBased) {
        it(`${name} matches its static twin's box at every size`, () => {
          for (const size of [16, 24, 32] as const) {
            const animated = render(<Component size={size} />);
            const original = render(<Static size={size} />);
            expect(boxClass(animated.container)).toBe(boxClass(original.container));
          }
        });
      } else {
        it(`${name} matches its static twin's default box`, () => {
          const animated = render(<Component />);
          const original = render(<Static />);
          expect(boxClass(animated.container)).toBe(boxClass(original.container));
        });
      }
    }
  });
});
