import { render, screen } from "@testing-library/react";
import * as React from "react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { InlineEmptyState } from "./InlineEmptyState";

describe("InlineEmptyState", () => {
  describe("API", () => {
    it("renders its message as a paragraph", () => {
      render(<InlineEmptyState>No links yet.</InlineEmptyState>);
      expect(screen.getByRole("paragraph")).toHaveTextContent("No links yet.");
    });

    it("keeps a message with inline markup as one sentence", () => {
      render(
        <InlineEmptyState>
          No links for <strong>this campaign</strong> yet.
        </InlineEmptyState>,
      );
      const paragraph = screen.getByRole("paragraph");
      expect(paragraph).toHaveTextContent("No links for this campaign yet.");
      expect(paragraph.children).toHaveLength(1);
    });

    it("applies custom className", () => {
      render(<InlineEmptyState className="custom">No links yet.</InlineEmptyState>);
      expect(screen.getByRole("paragraph")).toHaveClass("custom");
    });

    it("forwards its ref to the paragraph", () => {
      const ref = React.createRef<HTMLParagraphElement>();
      render(<InlineEmptyState ref={ref}>No links yet.</InlineEmptyState>);
      expect(ref.current).toBe(screen.getByRole("paragraph"));
    });

    it("passes HTML attributes through", () => {
      render(<InlineEmptyState role="status">No links yet.</InlineEmptyState>);
      expect(screen.getByRole("status")).toHaveTextContent("No links yet.");
    });
  });

  describe("accessibility", () => {
    it("has no accessibility violations", async () => {
      const { container } = render(<InlineEmptyState>No links yet.</InlineEmptyState>);
      expect(await axe(container)).toHaveNoViolations();
    });
  });
});
