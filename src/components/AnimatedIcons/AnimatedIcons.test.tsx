import { fireEvent, render, waitFor } from "@testing-library/react";
import type * as React from "react";
import { createRef } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
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
import { WrenchIcon } from "./WrenchIcon";

/** The `size-*` box class an icon renders with, e.g. `size-6`. */
function boxClass(container: HTMLElement) {
  const classes = container.querySelector("svg")?.getAttribute("class") ?? "";
  return classes.split(/\s+/).find((c) => /^size-/.test(c));
}

/** Every class an icon renders with, order-independent. */
function classList(container: HTMLElement) {
  const classes = container.querySelector("svg")?.getAttribute("class") ?? "";
  return classes.split(/\s+/).filter(Boolean).sort();
}

/**
 * Stroke width relative to the coordinate space it is drawn in.
 *
 * The rendered weight is `strokeWidth * boxPx / viewBox`, and both icons of a pair
 * render in the same box (asserted separately), so this ratio is what has to match.
 * The static icons stroke their paths; the animated ones stroke the root `<svg>`.
 */
function strokeRatio(container: HTMLElement) {
  const svg = container.querySelector("svg");
  const viewBox = svg?.getAttribute("viewBox")?.trim().split(/\s+/)[3];
  const strokeWidth =
    svg?.getAttribute("stroke-width") ??
    svg?.querySelector("[stroke-width]")?.getAttribute("stroke-width");
  if (!viewBox || !strokeWidth) return null;
  return Number((Number(strokeWidth) / Number(viewBox)).toFixed(4));
}

/** Attributes Motion animates directly rather than through inline style. */
const ANIMATABLE_ATTRS = [
  "d",
  "opacity",
  "stroke-width",
  "stroke-dasharray",
  "stroke-dashoffset",
  "transform",
  "x",
  "y",
  "x1",
  "x2",
  "y1",
  "y2",
  "cx",
  "cy",
  "r",
  "points",
];

/**
 * Read an animatable attribute, collapsing the representations Motion leaves
 * behind once an element is back at rest.
 *
 * Motion writes its own bookkeeping when it takes an element over — a literal
 * `undefined`, a fully-drawn `stroke-dasharray` of `1 1` with zero offset from
 * normalised `pathLength`, an explicit `opacity: 1` — and does not clean it up.
 * Only the *resting* values are collapsed, so a mid-animation value still reads as
 * a change.
 */
function restingAttr(el: Element, name: string) {
  const raw = el.getAttribute(name);
  if (raw === null || raw === "undefined") return "";
  if (name === "opacity" && Number(raw) === 1) return "";
  if (name === "stroke-dasharray" && /^1(\.0+)?\s+1(\.0+)?$/.test(raw.trim())) return "";
  if (name === "stroke-dashoffset" && Number(raw) === 0) return "";
  return raw;
}

/**
 * A comparable picture of everything an animation can move.
 *
 * `transform-box`/`transform-origin`, an identity `transform` and a resting
 * `opacity: 1` are normalised away for the same reason as {@link restingAttr}.
 */
function frame(container: HTMLElement) {
  return [...container.querySelectorAll("svg, svg *")]
    .map((el) => {
      const style = (el.getAttribute("style") ?? "")
        .replace(/transform:\s*none;?/g, "")
        .replace(/transform-(box|origin):[^;]*;?/g, "")
        .replace(/opacity:\s*1(\.0+)?;?/g, "")
        .replace(/\s+/g, " ")
        .trim();
      const attrs = ANIMATABLE_ATTRS.map((a) => restingAttr(el, a)).join(",");
      return `${el.tagName}|${style}|${attrs}`;
    })
    .join("\n");
}

/**
 * Wait until the DOM stops moving, then return that frame.
 *
 * Used instead of a fixed delay because the resting state is not always the
 * mount state: several icons declare a resting variant that sets more than
 * `initial` does, so the DOM after settling legitimately differs from the DOM
 * before anything was ever played. What has to hold is that rest is *stable* and
 * *reproducible*, which is what the hover test asserts.
 */
async function settle(container: HTMLElement) {
  let previous = frame(container);
  let quiet = 0;
  // Three consecutive identical samples, not one: several icons stagger their
  // paths with per-element delays, so a single quiet interval can land inside a
  // delay window and read as finished while the animation is still running.
  for (let i = 0; i < 80; i++) {
    await new Promise((resolve) => setTimeout(resolve, 50));
    const next = frame(container);
    quiet = next === previous ? quiet + 1 : 0;
    previous = next;
    if (quiet >= 3) return next;
  }
  return previous;
}

/** Report reduced motion for the duration of a test. */
function stubReducedMotion(matches: boolean) {
  vi.stubGlobal(
    "matchMedia",
    vi.fn().mockImplementation((query: string) => ({
      matches,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  );
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
  { name: "WrenchIcon", Component: WrenchIcon, Static: StaticWrenchIcon, propBased: false },
];

afterEach(() => {
  vi.unstubAllGlobals();
});

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

      it("keeps a caller's style prop alongside its own", () => {
        const { container } = render(<Component style={{ color: "rgb(1, 2, 3)" }} />);
        expect(container.querySelector("svg")).toHaveStyle({ color: "rgb(1, 2, 3)" });
      });

      it("animates on hover and settles back on leave", async () => {
        const { container } = render(<Component />);
        const svg = container.querySelector("svg") as SVGSVGElement;
        const mounted = frame(container);

        // Hovering has to move something. An icon whose variant labels do not
        // match what the hook plays renders as a static SVG and fails here.
        fireEvent.mouseEnter(svg);
        await waitFor(() => expect(frame(container)).not.toBe(mounted), { timeout: 3000 });

        fireEvent.mouseLeave(svg);
        const rested = await settle(container);

        // ...and the resting state has to be reproducible: a second cycle lands
        // in exactly the same place, so nothing sticks mid-animation or drifts.
        fireEvent.mouseEnter(svg);
        await waitFor(() => expect(frame(container)).not.toBe(rested), { timeout: 3000 });

        fireEvent.mouseLeave(svg);
        expect(await settle(container)).toBe(rested);
      });

      it("gets its hover trigger back when controlRef goes away", async () => {
        const controlRef = createRef<{
          startAnimation: () => void;
          stopAnimation: () => void;
        }>();
        const { container, rerender } = render(<Component controlRef={controlRef} />);
        const svg = container.querySelector("svg") as SVGSVGElement;
        const rest = frame(container);

        rerender(<Component />);
        fireEvent.mouseEnter(svg);
        await waitFor(() => expect(frame(container)).not.toBe(rest), { timeout: 3000 });
      });

      it("stands down its hover trigger while a controlRef drives it", async () => {
        const controlRef = createRef<{
          startAnimation: () => void;
          stopAnimation: () => void;
        }>();
        const { container } = render(<Component controlRef={controlRef} />);
        const svg = container.querySelector("svg") as SVGSVGElement;
        const rest = frame(container);

        fireEvent.mouseEnter(svg);
        await new Promise((resolve) => setTimeout(resolve, 100));
        expect(frame(container)).toBe(rest);

        controlRef.current?.startAnimation();
        await waitFor(() => expect(frame(container)).not.toBe(rest), { timeout: 3000 });
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

      it("stays still when the user has asked for reduced motion", async () => {
        stubReducedMotion(true);
        const { container } = render(<Component />);
        const svg = container.querySelector("svg") as SVGSVGElement;
        const rest = frame(container);

        fireEvent.mouseEnter(svg);
        await new Promise((resolve) => setTimeout(resolve, 100));
        expect(frame(container)).toBe(rest);
      });

      it("has no accessibility violations", async () => {
        const { container } = render(
          <Component role="img" aria-label={name} aria-hidden={false} />,
        );
        expect(await axe(container)).toHaveNoViolations();
      });
    });
  }

  describe("stays a drop-in for the static icon of the same name", () => {
    for (const { name, Component, Static, propBased } of animatedIcons) {
      if (propBased) {
        const Sized = Component as React.ComponentType<{ size: 16 | 24 | 32 }>;
        const StaticSized = Static as React.ComponentType<{ size: 16 | 24 | 32 }>;

        it(`${name} matches its static twin's box, classes and stroke weight at every size`, () => {
          for (const size of [16, 24, 32] as const) {
            const animated = render(<Sized size={size} />);
            const original = render(<StaticSized size={size} />);
            expect(boxClass(animated.container)).toBe(boxClass(original.container));
            expect(classList(animated.container)).toEqual(classList(original.container));
            const staticRatio = strokeRatio(original.container);
            // Fill-only static artwork has no stroke to match.
            if (staticRatio !== null) {
              expect(strokeRatio(animated.container)).toBe(staticRatio);
            }
          }
        });
      } else {
        const Legacy = Component as React.ComponentType<Record<string, never>>;
        const StaticLegacy = Static as React.ComponentType<Record<string, never>>;

        it(`${name} matches its static twin's box, classes and stroke weight`, () => {
          const animated = render(<Legacy />);
          const original = render(<StaticLegacy />);
          expect(boxClass(animated.container)).toBe(boxClass(original.container));
          expect(classList(animated.container)).toEqual(classList(original.container));
          const staticRatio = strokeRatio(original.container);
          if (staticRatio !== null) {
            expect(strokeRatio(animated.container)).toBe(staticRatio);
          }
        });
      }
    }
  });
});
