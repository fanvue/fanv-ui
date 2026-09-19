import type { Meta, StoryObj } from "@storybook/react";
import { userEvent, within } from "storybook/test";
import { Button } from "../Button/Button";
import { CopyIcon } from "../Icons/CopyIcon";
import { EditIcon } from "../Icons/EditIcon";
import { MessageIcon } from "../Icons/MessageIcon";
import { StarIcon } from "../Icons/StarIcon";
import { TrashBinIcon } from "../Icons/TrashBinIcon";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalItem,
  ModalTitle,
  ModalTrigger,
} from "./Modal";

const FIGMA_URL =
  "https://www.figma.com/design/23x2vofTPkLpbcJyRdDa55/Creator---Management%E2%80%A8--Teams?node-id=9076-77632&m=dev";

const meta = {
  title: "Components/Modal",
  component: ModalContent,
  parameters: {
    layout: "centered",
    design: {
      type: "figma",
      url: FIGMA_URL,
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof ModalContent>;

export default meta;
type Story = StoryObj<typeof meta>;

const openModal: Story["play"] = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  await userEvent.click(canvas.getByRole("button", { name: /open modal/i }));
};

export const ListActions: Story = {
  name: "List actions",
  render: () => (
    <Modal>
      <ModalTrigger asChild>
        <Button>Open modal</Button>
      </ModalTrigger>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>Top Spenders</ModalTitle>
        </ModalHeader>
        <ModalBody>
          <ModalItem leadingIcon={<MessageIcon size={16} filled />}>Message List</ModalItem>
          <ModalItem leadingIcon={<StarIcon size={16} filled />}>Add to Favourites</ModalItem>
          <ModalItem leadingIcon={<EditIcon size={16} filled />}>Edit List</ModalItem>
          <ModalItem leadingIcon={<CopyIcon size={16} filled />}>Duplicate</ModalItem>
          <ModalItem destructive leadingIcon={<TrashBinIcon className="size-4" />}>
            Delete List
          </ModalItem>
        </ModalBody>
      </ModalContent>
    </Modal>
  ),
  play: openModal,
};

export const ItemStates: Story = {
  name: "Item states",
  render: () => (
    <Modal>
      <ModalTrigger asChild>
        <Button>Open modal</Button>
      </ModalTrigger>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>Item states</ModalTitle>
        </ModalHeader>
        <ModalBody>
          <ModalItem>Standard</ModalItem>
          <ModalItem selected>Selected</ModalItem>
          <ModalItem disabled>Disabled</ModalItem>
          <ModalItem destructive>Error</ModalItem>
        </ModalBody>
      </ModalContent>
    </Modal>
  ),
  play: openModal,
};
