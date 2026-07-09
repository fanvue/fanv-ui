import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { ChatMessage } from "./ChatMessage";

describe("ChatMessage", () => {
  describe("API", () => {
    it("applies custom className", () => {
      const { container } = render(<ChatMessage className="custom-class" message="Hi" />);
      expect(container.firstChild).toHaveClass("custom-class");
    });

    it("renders the message text", () => {
      render(<ChatMessage message="Placeholder message." />);
      expect(screen.getByText("Placeholder message.")).toBeInTheDocument();
    });

    it("renders the timestamp", () => {
      render(<ChatMessage variant="audio" audioDuration="0:05" time="16:00" />);
      expect(screen.getByText("16:00")).toBeInTheDocument();
    });

    it("forwards ref", () => {
      const ref = React.createRef<HTMLDivElement>();
      render(<ChatMessage ref={ref} message="Hi" />);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });

  describe("sender vs receiver", () => {
    it("right-aligns sender messages", () => {
      const { container } = render(<ChatMessage user="sender" message="Hi" />);
      expect(container.firstChild).toHaveClass("justify-end");
    });

    it("left-aligns receiver messages", () => {
      const { container } = render(<ChatMessage user="receiver" message="Hi" />);
      expect(container.firstChild).toHaveClass("justify-start");
    });

    it("renders an avatar for receiver messages", () => {
      render(<ChatMessage user="receiver" message="Hi" avatarFallback="JD" />);
      expect(screen.getByTestId("avatar")).toBeInTheDocument();
    });

    it("does not render an avatar for sender messages", () => {
      render(<ChatMessage user="sender" message="Hi" />);
      expect(screen.queryByTestId("avatar")).not.toBeInTheDocument();
    });

    it("reserves avatar space for receiver messages when the avatar is hidden", () => {
      render(<ChatMessage user="receiver" message="Hi" showAvatar={false} />);
      expect(screen.queryByTestId("avatar")).not.toBeInTheDocument();
    });
  });

  describe("delivery status", () => {
    it("shows a delivered tick on sender messages", () => {
      render(<ChatMessage user="sender" message="Hi" time="16:00" />);
      expect(screen.getByRole("img", { name: "Delivered" })).toBeInTheDocument();
    });

    it("shows a read tick when status is read", () => {
      render(<ChatMessage user="sender" message="Hi" time="16:00" status="read" />);
      expect(screen.getByRole("img", { name: "Read" })).toBeInTheDocument();
    });

    it("does not show a tick on receiver messages", () => {
      render(<ChatMessage user="receiver" message="Hi" time="16:00" />);
      expect(screen.queryByRole("img", { name: "Delivered" })).not.toBeInTheDocument();
    });
  });

  describe("typing variant", () => {
    it("exposes the typing indicator with the default label", () => {
      render(<ChatMessage user="receiver" variant="typing" />);
      expect(screen.getByRole("status", { name: "Typing" })).toBeInTheDocument();
    });

    it("supports a custom typing label", () => {
      render(<ChatMessage user="receiver" variant="typing" typingLabel="Jane is typing" />);
      expect(screen.getByRole("status", { name: "Jane is typing" })).toBeInTheDocument();
    });
  });

  describe("deleted variant", () => {
    it("renders the default deleted label", () => {
      render(<ChatMessage variant="deleted" time="16:00" />);
      expect(screen.getByText("Message deleted")).toBeInTheDocument();
      expect(screen.getByText("16:00")).toBeInTheDocument();
    });

    it("supports a custom deleted label", () => {
      render(<ChatMessage variant="deleted" deletedLabel="Removed" />);
      expect(screen.getByText("Removed")).toBeInTheDocument();
    });
  });

  describe("audio variant", () => {
    it("toggles play and pause when uncontrolled", async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(<ChatMessage variant="audio" audioDuration="0:05" onPlayingChange={handleChange} />);

      const button = screen.getByRole("button", { name: "Play" });
      await user.click(button);

      expect(handleChange).toHaveBeenCalledWith(true);
      expect(screen.getByRole("button", { name: "Pause" })).toBeInTheDocument();
    });

    it("respects the controlled playing prop", async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(
        <ChatMessage variant="audio" audioDuration="0:05" playing onPlayingChange={handleChange} />,
      );

      const button = screen.getByRole("button", { name: "Pause" });
      await user.click(button);

      expect(handleChange).toHaveBeenCalledWith(false);
      // Stays paused because the parent controls the state.
      expect(screen.getByRole("button", { name: "Pause" })).toBeInTheDocument();
    });

    it("renders the duration", () => {
      render(<ChatMessage variant="audio" audioDuration="1:23" />);
      expect(screen.getByText("1:23")).toBeInTheDocument();
    });
  });

  describe("accessibility", () => {
    it("has no accessibility violations for a text message", async () => {
      const { container } = render(
        <ChatMessage user="sender" message="Placeholder message." time="16:00" status="read" />,
      );
      expect(await axe(container)).toHaveNoViolations();
    });

    it("has no accessibility violations for an audio message", async () => {
      const { container } = render(
        <ChatMessage
          user="receiver"
          variant="audio"
          audioDuration="0:05"
          time="16:00"
          avatarFallback="JD"
        />,
      );
      expect(await axe(container)).toHaveNoViolations();
    });

    it("has no accessibility violations for a typing indicator", async () => {
      const { container } = render(
        <ChatMessage user="receiver" variant="typing" avatarFallback="JD" />,
      );
      expect(await axe(container)).toHaveNoViolations();
    });
  });
});
