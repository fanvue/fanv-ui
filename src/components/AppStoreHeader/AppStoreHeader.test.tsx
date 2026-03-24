import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { AppStoreHeader } from "./AppStoreHeader";

const img = { src: "https://example.com/hero.jpg", alt: "" };

describe("AppStoreHeader", () => {
  it("renders title and subtitle", () => {
    render(<AppStoreHeader title={<>Line one</>} subtitle="Supporting line" imageProps={img} />);
    expect(screen.getByRole("heading", { level: 2, name: "Line one" })).toBeInTheDocument();
    expect(screen.getByText("Supporting line")).toBeInTheDocument();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(
      <AppStoreHeader title="Title" subtitle="Subtitle" imageProps={{ ...img, alt: "" }} />,
    );
    const results = await axe(container);
    // eslint-disable-next-line -- vitest-axe matcher type augmentation
    (expect(results) as any).toHaveNoViolations();
  });
});
