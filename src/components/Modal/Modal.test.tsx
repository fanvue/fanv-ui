import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { Button } from "../Button/Button";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalItem,
  ModalTitle,
  ModalTrigger,
} from "./Modal";

describe("Modal", () => {
  it("renders the v2 modal surface", () => {
    render(
      <Modal defaultOpen>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>Top Spenders</ModalTitle>
          </ModalHeader>
        </ModalContent>
      </Modal>,
    );

    const modal = screen.getByRole("dialog");
    expect(modal).toHaveClass("bg-modal-background");
    expect(modal).toHaveClass("border-modal-stroke");
    expect(modal).toHaveClass("shadow-blur-menu");
    expect(modal).toHaveClass("backdrop-blur-[4px]");
    expect(modal).toHaveClass("rounded-t-[var(--color-modal-radius)]");
    expect(modal).toHaveClass("sm:rounded-[var(--color-modal-radius)]");
    expect(modal).toHaveClass("p-[var(--color-modal-padding-mobile)]");
    expect(modal).toHaveClass("sm:p-[var(--color-modal-padding-desktop)]");
    expect(modal).not.toHaveClass("sm:rounded-lg");
    expect(document.querySelector(".bg-icons-tertiary")).not.toBeInTheDocument();
  });

  it("closes from the header button", async () => {
    const user = userEvent.setup();
    render(
      <Modal defaultOpen>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>Top Spenders</ModalTitle>
          </ModalHeader>
        </ModalContent>
      </Modal>,
    );

    await user.click(screen.getByRole("button", { name: "Close" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("opens from the trigger", async () => {
    const user = userEvent.setup();
    render(
      <Modal>
        <ModalTrigger asChild>
          <Button>Open</Button>
        </ModalTrigger>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>Top Spenders</ModalTitle>
          </ModalHeader>
        </ModalContent>
      </Modal>,
    );

    await user.click(screen.getByRole("button", { name: "Open" }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });
});

describe("ModalItem", () => {
  it("renders the label and leading icon", () => {
    render(
      <Modal defaultOpen>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>Top Spenders</ModalTitle>
          </ModalHeader>
          <ModalBody>
            <ModalItem leadingIcon={<span data-testid="icon" />}>Edit List</ModalItem>
          </ModalBody>
        </ModalContent>
      </Modal>,
    );

    expect(screen.getByRole("button", { name: "Edit List" })).toBeInTheDocument();
    expect(screen.getByTestId("icon")).toBeInTheDocument();
  });

  it("applies the error treatment", () => {
    render(
      <Modal defaultOpen>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>Top Spenders</ModalTitle>
          </ModalHeader>
          <ModalBody>
            <ModalItem destructive>Delete List</ModalItem>
          </ModalBody>
        </ModalContent>
      </Modal>,
    );

    expect(screen.getByRole("button", { name: "Delete List" })).toHaveClass("text-error-content");
  });

  it("marks the selected row", () => {
    render(
      <Modal defaultOpen>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>Top Spenders</ModalTitle>
          </ModalHeader>
          <ModalBody>
            <ModalItem selected>Add to Favourites</ModalItem>
          </ModalBody>
        </ModalContent>
      </Modal>,
    );

    expect(screen.getByRole("button", { name: "Add to Favourites" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByRole("button", { name: "Add to Favourites" })).toHaveClass(
      "bg-neutral-alphas-100",
    );
  });

  it("does not fire or close when disabled", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <Modal defaultOpen>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>Top Spenders</ModalTitle>
          </ModalHeader>
          <ModalBody>
            <ModalItem disabled onClick={onClick}>
              Message List
            </ModalItem>
          </ModalBody>
        </ModalContent>
      </Modal>,
    );

    await user.click(screen.getByRole("button", { name: "Message List" }));
    expect(onClick).not.toHaveBeenCalled();
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("calls onClick and closes the modal", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <Modal defaultOpen>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>Top Spenders</ModalTitle>
          </ModalHeader>
          <ModalBody>
            <ModalItem onClick={onClick}>Duplicate</ModalItem>
          </ModalBody>
        </ModalContent>
      </Modal>,
    );

    await user.click(screen.getByRole("button", { name: "Duplicate" }));
    expect(onClick).toHaveBeenCalledOnce();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("stays open when closeOnSelect is false", async () => {
    const user = userEvent.setup();
    render(
      <Modal defaultOpen>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>Top Spenders</ModalTitle>
          </ModalHeader>
          <ModalBody>
            <ModalItem closeOnSelect={false}>Add to Favourites</ModalItem>
          </ModalBody>
        </ModalContent>
      </Modal>,
    );

    await user.click(screen.getByRole("button", { name: "Add to Favourites" }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(
      <Modal defaultOpen>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>Top Spenders</ModalTitle>
          </ModalHeader>
          <ModalBody>
            <ModalItem>Message List</ModalItem>
            <ModalItem destructive>Delete List</ModalItem>
          </ModalBody>
        </ModalContent>
      </Modal>,
    );

    expect(await axe(container)).toHaveNoViolations();
  });
});
