import { render } from "@testing-library/react";
import { Fragment } from "react";
import { describe, expect, it } from "vitest";
import { renderSlottedText, renderTextChildren } from "./renderTextChildren";

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

describe("renderSlottedText", () => {
  it("leaves an element without children unchanged", () => {
    const image = <img alt="" src="/a.png" />;
    expect(renderSlottedText(image)).toBe(image);
  });
});
