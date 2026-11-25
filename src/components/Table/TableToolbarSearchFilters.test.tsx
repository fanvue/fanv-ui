import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { TableToolbarSearch } from "./Table";
import type { TableToolbarSearchFilter } from "./TableToolbarSearchFilters";

function makeFilters(): TableToolbarSearchFilter[] {
  return ["Platform", "Tag", "Date"].map((label) => ({
    id: label,
    name: `${label} is`,
    value: "Any",
    onRemove: vi.fn(),
    removeLabel: `Remove ${label} filter`,
  }));
}

function renderSearch(filters: TableToolbarSearchFilter[], onClearFilters = vi.fn()) {
  return render(
    <TableToolbarSearch
      value=""
      onValueChange={() => {}}
      placeholder="Search"
      clearLabel="Clear search"
      filters={filters}
      formatHiddenFilters={(count) => `${count} more filters`}
      clearFiltersLabel="Clear all"
      onClearFilters={onClearFilters}
    />,
  );
}

function mockLayout(availableWidth: number) {
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(function (
    this: HTMLElement,
  ) {
    const ruler = this.closest("[inert]");
    if (!ruler) return new DOMRect();
    if (ruler === this) return new DOMRect(0, 0, availableWidth, 24);
    const index = Array.from(this.parentElement?.children ?? []).indexOf(this);
    return new DOMRect(index * 130, 0, 120, 24);
  });
}

describe("TableToolbarSearch filters", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("gives each filter a remove button that calls its own onRemove", async () => {
    const user = userEvent.setup();
    const filters = makeFilters();
    renderSearch(filters);

    await user.click(screen.getByRole("button", { name: "Remove Tag filter" }));

    expect(filters[1]?.onRemove).toHaveBeenCalledOnce();
    expect(filters[0]?.onRemove).not.toHaveBeenCalled();
    expect(screen.getByRole("button", { name: "Remove Platform filter" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Remove Date filter" })).toBeInTheDocument();
  });

  it("calls onClearFilters from Clear all, and hides Clear all when no filter is applied", async () => {
    const user = userEvent.setup();
    const onClearFilters = vi.fn();
    const { unmount } = renderSearch(makeFilters(), onClearFilters);

    await user.click(screen.getByRole("button", { name: "Clear all" }));
    expect(onClearFilters).toHaveBeenCalledOnce();

    unmount();
    renderSearch([], onClearFilters);
    expect(screen.queryByRole("button", { name: "Clear all" })).not.toBeInTheDocument();
  });

  it("renders the bare field when no filters are passed", () => {
    const { container } = render(
      <TableToolbarSearch
        value=""
        onValueChange={() => {}}
        placeholder="Search"
        clearLabel="Clear search"
      />,
    );

    const label = container.querySelector("label");
    expect(label?.children).toHaveLength(2);
    expect(screen.getByRole("searchbox", { name: "Search" }).parentElement).toBe(label);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("collapses the filters that do not fit into a +N tag named by formatHiddenFilters", () => {
    mockLayout(300);
    renderSearch(makeFilters());

    expect(screen.getByRole("button", { name: "Remove Platform filter" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Remove Tag filter" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Remove Date filter" })).not.toBeInTheDocument();
    expect(screen.getByText("2 more filters")).toBeInTheDocument();
  });

  it("has no accessibility violations with a collapsed tail", async () => {
    mockLayout(300);
    const { container } = renderSearch(makeFilters());

    expect(await axe(container)).toHaveNoViolations();
  });
});
