import { render } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";
import {
  ArrowAltIcon,
  ArrowIcon,
  BellIcon,
  BookmarkIcon,
  CameraIcon,
  CheckCircleIcon,
  CheckIcon,
  CheckmarkIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CloseIcon,
  CopyIcon,
  CrossIcon,
  CrownIcon,
  DeleteIcon,
  DoneIcon,
  DoubleCheckmarkIcon,
  DownloadIcon,
  EditIcon,
  ErrorCircleIcon,
  FireIcon,
  FolderIcon,
  ForwardIcon,
  HeartFilledIcon,
  HeartOutlineIcon,
  HomeIcon,
  HouseFilledIcon,
  HouseOutlineIcon,
  ImageIcon,
  InfoCircleIcon,
  LinkIcon,
  LockIcon,
  MailIcon,
  MenuIcon,
  MessageIcon,
  MinusIcon,
  MoreIcon,
  MoreVerticalIcon,
  PauseIcon,
  PlayIcon,
  PlusIcon,
  ProfileIcon,
  ReplyIcon,
  ReplyOutlineIcon,
  SearchIcon,
  SendIcon,
  SendOutlineIcon,
  SettingsIcon,
  ShareIcon,
  SpinnerIcon,
  StarFilledIcon,
  StarOutlineIcon,
  StopIcon,
  UnlockIcon,
  UploadIcon,
  VideoIcon,
  VipBadgeIcon,
  WarningTriangleIcon,
} from "./index";

const icons = [
  { name: "ArrowAltIcon", Component: ArrowAltIcon },
  { name: "ArrowIcon", Component: ArrowIcon },
  { name: "BellIcon", Component: BellIcon },
  { name: "BookmarkIcon", Component: BookmarkIcon },
  { name: "CameraIcon", Component: CameraIcon },
  { name: "CheckCircleIcon", Component: CheckCircleIcon },
  { name: "CheckIcon", Component: CheckIcon },
  { name: "CheckmarkIcon", Component: CheckmarkIcon },
  { name: "ChevronLeftIcon", Component: ChevronLeftIcon },
  { name: "ChevronRightIcon", Component: ChevronRightIcon },
  { name: "CloseIcon", Component: CloseIcon },
  { name: "CopyIcon", Component: CopyIcon },
  { name: "CrossIcon", Component: CrossIcon },
  { name: "CrownIcon", Component: CrownIcon },
  { name: "DeleteIcon", Component: DeleteIcon },
  { name: "DoneIcon", Component: DoneIcon },
  { name: "DoubleCheckmarkIcon", Component: DoubleCheckmarkIcon },
  { name: "DownloadIcon", Component: DownloadIcon },
  { name: "EditIcon", Component: EditIcon },
  { name: "ErrorCircleIcon", Component: ErrorCircleIcon },
  { name: "FireIcon", Component: FireIcon },
  { name: "FolderIcon", Component: FolderIcon },
  { name: "ForwardIcon", Component: ForwardIcon },
  { name: "HeartFilledIcon", Component: HeartFilledIcon },
  { name: "HeartOutlineIcon", Component: HeartOutlineIcon },
  { name: "HomeIcon", Component: HomeIcon },
  { name: "HouseFilledIcon", Component: HouseFilledIcon },
  { name: "HouseOutlineIcon", Component: HouseOutlineIcon },
  { name: "ImageIcon", Component: ImageIcon },
  { name: "InfoCircleIcon", Component: InfoCircleIcon },
  { name: "LinkIcon", Component: LinkIcon },
  { name: "LockIcon", Component: LockIcon },
  { name: "MailIcon", Component: MailIcon },
  { name: "MenuIcon", Component: MenuIcon },
  { name: "MessageIcon", Component: MessageIcon },
  { name: "MinusIcon", Component: MinusIcon },
  { name: "MoreIcon", Component: MoreIcon },
  { name: "MoreVerticalIcon", Component: MoreVerticalIcon },
  { name: "PauseIcon", Component: PauseIcon },
  { name: "PlayIcon", Component: PlayIcon },
  { name: "PlusIcon", Component: PlusIcon },
  { name: "ProfileIcon", Component: ProfileIcon },
  { name: "ReplyIcon", Component: ReplyIcon },
  { name: "ReplyOutlineIcon", Component: ReplyOutlineIcon },
  { name: "SearchIcon", Component: SearchIcon },
  { name: "SendIcon", Component: SendIcon },
  { name: "SendOutlineIcon", Component: SendOutlineIcon },
  { name: "SettingsIcon", Component: SettingsIcon },
  { name: "ShareIcon", Component: ShareIcon },
  { name: "SpinnerIcon", Component: SpinnerIcon },
  { name: "StarFilledIcon", Component: StarFilledIcon },
  { name: "StarOutlineIcon", Component: StarOutlineIcon },
  { name: "StopIcon", Component: StopIcon },
  { name: "UnlockIcon", Component: UnlockIcon },
  { name: "UploadIcon", Component: UploadIcon },
  { name: "VideoIcon", Component: VideoIcon },
  { name: "VipBadgeIcon", Component: VipBadgeIcon },
  { name: "WarningTriangleIcon", Component: WarningTriangleIcon },
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
