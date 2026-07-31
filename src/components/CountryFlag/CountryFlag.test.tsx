import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { CountryFlag } from "./CountryFlag";
import { FLAG_SHAPES } from "./flagShapes";

describe("CountryFlag", () => {
  it("has no accessibility violations", async () => {
    const { container } = render(<CountryFlag country="US" label="United States" />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("names the flag when given a label", () => {
    render(<CountryFlag country="US" label="United States" />);
    expect(screen.getByRole("img", { name: "United States" })).toBeInTheDocument();
  });

  it("hides the flag from assistive tech when it is decorative", () => {
    const { container } = render(<CountryFlag country="US" />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("aria-hidden", "true");
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });

  it("accepts the country code in either case", () => {
    const drawnPaths = (country: string) =>
      [...render(<CountryFlag country={country} />).container.querySelectorAll("path")].map((p) =>
        p.getAttribute("d"),
      );

    expect(drawnPaths("NL")).toEqual(drawnPaths("nl"));
    expect(drawnPaths("nl")).toHaveLength(FLAG_SHAPES.nl.length);
  });

  it("defaults to the 20px the designs use, and takes the other sizes", () => {
    const { container: fallback } = render(<CountryFlag country="US" />);
    expect(fallback.querySelector("svg")).toHaveClass("size-5");

    const { container: large } = render(<CountryFlag country="US" size={32} />);
    expect(large.querySelector("svg")).toHaveClass("size-8");
  });

  it("gives each instance its own mask so flags on one page don't collide", () => {
    const { container } = render(
      <>
        <CountryFlag country="US" />
        <CountryFlag country="NL" />
      </>,
    );
    const [first, second] = [...container.querySelectorAll("mask")].map((m) => m.id);
    expect(first).toBeTruthy();
    expect(first).not.toBe(second);
    // A url(#...) reference can't carry the colons React's useId produces.
    expect(first).not.toContain(":");
    expect(container.querySelector("g")).toHaveAttribute("mask", `url(#${first})`);
  });

  it("draws every flag with shapes it can render", () => {
    const tags = new Set(
      Object.values(FLAG_SHAPES).flatMap((shapes) => shapes.map((shape) => shape.tag)),
    );
    expect([...tags].sort()).toEqual(["circle", "ellipse", "path", "rect"]);
  });
  it("falls back to the placeholder disc for a code with no artwork", () => {
    const { container } = render(<CountryFlag country="zz" label="Unknown" />);
    const svg = container.querySelector("svg");
    // Not null, and drawn on the same viewBox as a real flag.
    expect(svg).not.toBeNull();
    expect(svg).toHaveAttribute("viewBox", "0 0 512 512");
    expect(svg?.querySelectorAll("path, circle, rect, ellipse").length).toBeGreaterThan(0);
  });

  it("renders the placeholder identically to an explicit xx", () => {
    const { container: unknown } = render(<CountryFlag country="zz" />);
    const { container: explicit } = render(<CountryFlag country="xx" />);
    const shapes = (c: HTMLElement) =>
      [...c.querySelectorAll("path, circle, rect, ellipse")].map((n) => n.getAttribute("fill"));
    expect(shapes(unknown)).toEqual(shapes(explicit));
  });
});
