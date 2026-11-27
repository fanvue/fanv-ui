import { describe, expect, it } from "vitest";
import { moveItem, placeValue } from "./useTagReorder";

describe("moveItem", () => {
  it("moves an item down", () => {
    expect(moveItem(["a", "b", "c", "d"], 0, 2)).toEqual(["b", "c", "a", "d"]);
  });

  it("moves an item up", () => {
    expect(moveItem(["a", "b", "c", "d"], 3, 1)).toEqual(["a", "d", "b", "c"]);
  });

  it("returns a new array and leaves the input alone", () => {
    const items = ["a", "b"];
    expect(moveItem(items, 0, 1)).toEqual(["b", "a"]);
    expect(items).toEqual(["a", "b"]);
  });
});

describe("placeValue", () => {
  it("puts the value before the row it was dropped above", () => {
    expect(placeValue(["a", "b", "c", "d"], "a", "c", "d")).toEqual(["b", "a", "c", "d"]);
  });

  it("puts the value after the last visible row when dropped below it", () => {
    expect(placeValue(["a", "b", "c", "d"], "a", undefined, "c")).toEqual(["b", "c", "a", "d"]);
  });

  it("keeps hidden values in place around the move", () => {
    expect(placeValue(["a", "hidden", "b", "c"], "c", "b", "c")).toEqual(["a", "hidden", "c", "b"]);
  });

  it("returns the order unchanged when there is nothing to anchor to", () => {
    expect(placeValue(["a"], "a", undefined, undefined)).toEqual(["a"]);
  });
});
