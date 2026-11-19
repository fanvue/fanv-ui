import { render } from "@testing-library/react";
import { Fragment } from "react";
import { describe, expect, it } from "vitest";
import { renderContainedText, renderSlottedText, renderTextChildren } from "./renderTextChildren";

describe("renderTextChildren", () => {
  it("merges adjacent text into one span", () => {
    const count = 2;
    const { container } = render(<p>{renderTextChildren(["Cart (", count, ")"])}</p>);
    expect(container.querySelector("p")?.innerHTML).toBe("<span>Cart (2)</span>");
  });

  it("wraps text inside fragments and keeps element siblings", () => {
    const { container } = render(
      <p>
        {renderTextChildren(
          <Fragment key="label">
            Loading
            <b>!</b>
          </Fragment>,
        )}
      </p>,
    );
    expect(container.querySelector("p")?.innerHTML).toBe("<span>Loading</span><b>!</b>");
  });

  it("renders nothing for empty text", () => {
    expect(renderTextChildren(["", null, false])).toEqual([]);
  });
});

describe("renderTextChildren keys", () => {
  it("keeps a label's node when a sibling appears before it", () => {
    const view = (showIcon: boolean) => (
      <p>{renderTextChildren([showIcon && <i key="icon" />, "Loading"])}</p>
    );
    const { container, rerender } = render(view(false));
    const label = container.querySelector("span");
    rerender(view(true));
    expect(container.querySelector("span")).toBe(label);
  });

  it("gives children of differently keyed fragments distinct keys", () => {
    const nodes = renderTextChildren([
      <Fragment key="a">
        <i key="b.$c" />
      </Fragment>,
      <Fragment key="a.$b">
        <i key="c" />
      </Fragment>,
    ]) as { key: string }[];
    expect(nodes[0]?.key).not.toBe(nodes[1]?.key);
  });

  it("leaves whitespace-only text unwrapped", () => {
    const { container } = render(<p>{renderTextChildren([<b key="more">More</b>, " "])}</p>);
    expect(container.querySelector("p")?.innerHTML).toBe("<b>More</b> ");
  });
});

describe("renderContainedText", () => {
  it("returns plain text as one string", () => {
    expect(renderContainedText(["Cart (", 2, ")"])).toBe("Cart (2)");
  });
});

describe("renderSlottedText", () => {
  it("leaves a custom component's children unchanged", () => {
    const Upper = ({ children }: { children: string }) => <a href="/plans">{children}</a>;
    const child = <Upper>Plans</Upper>;
    expect(renderSlottedText(child)).toBe(child);
  });

  it("leaves an element without children unchanged", () => {
    const image = <img alt="" src="/a.png" />;
    expect(renderSlottedText(image)).toBe(image);
  });
});
