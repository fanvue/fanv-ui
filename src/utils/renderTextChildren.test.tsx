import { render } from "@testing-library/react";
import { createElement, Fragment, type ReactNode } from "react";
import { createPortal } from "react-dom";
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
    const { container } = render(<p>{renderTextChildren(["", null, false])}</p>);
    expect(container.querySelector("p")?.innerHTML).toBe("");
  });

  it("renders a portal passed as a child", () => {
    const target = document.createElement("div");
    render(<p>{renderTextChildren([createPortal(<i>Away</i>, target), "Here"])}</p>);
    expect(target.innerHTML).toBe("<i>Away</i>");
  });

  it("keeps state apart for equal keys in separate lists", () => {
    const view = (first: boolean) => (
      <p>
        {renderTextChildren([
          first ? [<input key="one" aria-label="A" />] : [],
          [<input key="one" aria-label="B" />],
        ])}
      </p>
    );
    const { getByLabelText, rerender } = render(view(true));
    const second = getByLabelText("B");
    rerender(view(false));
    expect(getByLabelText("B")).toBe(second);
  });

  it("keeps a child's node when it gains a fragment wrapper", () => {
    const { getByLabelText, rerender } = render(
      <p>{renderTextChildren(<input key="field" aria-label="Field" />)}</p>,
    );
    const field = getByLabelText("Field");
    rerender(
      <p>
        {renderTextChildren(
          createElement(Fragment, null, <input key="field" aria-label="Field" />),
        )}
      </p>,
    );
    expect(getByLabelText("Field")).toBe(field);
  });

  it("keeps a label's node when an empty string appears before it", () => {
    const view = (lead: string | null) => (
      <p>{renderTextChildren([lead, <i key="i" />, "Loading"])}</p>
    );
    const { container, rerender } = render(view(null));
    const label = container.querySelector("span");
    rerender(view(""));
    expect(container.querySelector("span")).toBe(label);
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

describe("renderTextChildren structure", () => {
  it("keeps a nested group's node when a second group is added", () => {
    const fields = [<input key="name" aria-label="Name" />];
    const view = (extra: boolean) => (
      <p>
        {renderTextChildren(
          createElement(Fragment, null, extra ? [fields, [<i key="more" />]] : [fields]),
        )}
      </p>
    );
    const { getByLabelText, rerender } = render(view(false));
    const name = getByLabelText("Name");
    rerender(view(true));
    expect(getByLabelText("Name")).toBe(name);
  });

  it("keeps a consumer key that matches a generated one", () => {
    const view = (show: boolean) => (
      <p>{renderTextChildren([show && "Prefix", <b key="text">Name</b>])}</p>
    );
    const { container, rerender } = render(view(true));
    rerender(view(false));
    expect(container.querySelector("p")?.textContent).toBe("Name");
  });

  it("keeps a later group's node when a sparse slot is filled", () => {
    const view = (filled: boolean) => {
      const slots: ReactNode[] = new Array(3);
      if (filled) slots[0] = "Lead";
      slots[1] = [<input key="field" aria-label="Field" />];
      return <p>{renderTextChildren(slots)}</p>;
    };
    const { getByLabelText, rerender } = render(view(false));
    const field = getByLabelText("Field");
    rerender(view(true));
    expect(getByLabelText("Field")).toBe(field);
  });
});

describe("renderTextChildren nested text", () => {
  it("merges text across a text-only nested list", () => {
    const { container } = render(
      <p>{renderTextChildren(["Updated ", [2, " days ago"], <b key="edit">Edit</b>])}</p>,
    );
    expect(container.querySelector("p")?.innerHTML).toBe(
      "<span>Updated 2 days ago</span><b>Edit</b>",
    );
  });
});

describe("renderTextChildren identity", () => {
  it("returns a list without text unchanged", () => {
    const items = [<i key="a" />, null, <b key="b" />];
    expect(renderTextChildren(items)).toBe(items);
  });

  it("returns a fragment without text unchanged", () => {
    const group = (
      <Fragment>
        <i />
      </Fragment>
    );
    expect(renderTextChildren(group)).toBe(group);
  });
});

describe("renderContainedText", () => {
  it("returns plain text as one string", () => {
    expect(renderContainedText(["Cart (", 2, ")"])).toBe("Cart (2)");
  });
});

describe("renderSlottedText", () => {
  it("leaves a text-only element's children unchanged", () => {
    const option = <option>Notes</option>;
    expect(renderSlottedText(option)).toBe(option);
  });

  it("leaves plain text unchanged when the slot adds no siblings", () => {
    const link = <a href="/open">Open</a>;
    expect(renderSlottedText(link, false)).toBe(link);
  });

  it("leaves an SVG text path unchanged", () => {
    const label = (
      <textPath href="#path">
        Continue <tspan>now</tspan>
      </textPath>
    );
    expect(renderSlottedText(label)).toBe(label);
  });

  it("leaves SVG text unchanged", () => {
    const label = (
      <text>
        Open<tspan> now</tspan>
      </text>
    );
    expect(renderSlottedText(label)).toBe(label);
  });

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
