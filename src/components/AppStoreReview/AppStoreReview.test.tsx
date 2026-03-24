import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { AppStoreReview } from "./AppStoreReview";

const base = {
  reviewerName: "Abbie",
  avatarInitials: "AB",
  rating: 4,
  reviewDate: "30 Jun 2025",
  body: "Great app.",
};

describe("AppStoreReview", () => {
  it("renders reviewer, body, and star label", () => {
    render(<AppStoreReview {...base} />);
    expect(screen.getByText("Abbie")).toBeInTheDocument();
    expect(screen.getByText("Great app.")).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "4 out of 5 stars" })).toBeInTheDocument();
  });

  it("fires helpful and show more handlers", async () => {
    const user = userEvent.setup();
    const onHelpful = vi.fn();
    const onShowMore = vi.fn();
    render(
      <AppStoreReview
        {...base}
        helpfulCount={3}
        onHelpfulPress={onHelpful}
        onShowMorePress={onShowMore}
      />,
    );
    await user.click(screen.getByRole("button", { name: "Helpful (3)" }));
    await user.click(screen.getByRole("button", { name: "Show more" }));
    expect(onHelpful).toHaveBeenCalledOnce();
    expect(onShowMore).toHaveBeenCalledOnce();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(
      <AppStoreReview
        {...base}
        helpfulCount={1}
        onHelpfulPress={() => {}}
        onShowMorePress={() => {}}
      />,
    );
    const results = await axe(container);
    // eslint-disable-next-line -- vitest-axe matcher type augmentation
    (expect(results) as any).toHaveNoViolations();
  });
});
