import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { Button } from "../Button/Button";
import { MobileStepper } from "./MobileStepper";

const meta: Meta<typeof MobileStepper> = {
  title: "Components/MobileStepper",
  component: MobileStepper,
  parameters: {
    layout: "padded",
  },
  args: {
    steps: 6,
    activeStep: 2,
  },
};

export default meta;

type Story = StoryObj<typeof MobileStepper>;

export const Dots: Story = {
  args: {
    variant: "dots",
    backButton: (
      <Button size="32" variant="tertiary">
        Back
      </Button>
    ),
    nextButton: (
      <Button size="32" variant="tertiary">
        Next
      </Button>
    ),
  },
};

export const Progress: Story = {
  args: {
    variant: "progress",
    backButton: (
      <Button size="32" variant="tertiary">
        Back
      </Button>
    ),
    nextButton: (
      <Button size="32" variant="tertiary">
        Next
      </Button>
    ),
  },
};

export const Text: Story = {
  args: {
    variant: "text",
    backButton: (
      <Button size="32" variant="tertiary">
        Back
      </Button>
    ),
    nextButton: (
      <Button size="32" variant="tertiary">
        Next
      </Button>
    ),
  },
};

export const TextCustomFormat: Story = {
  args: {
    variant: "text",
    formatText: (active, total) => `Step ${active} of ${total}`,
    backButton: (
      <Button size="32" variant="tertiary">
        Back
      </Button>
    ),
    nextButton: (
      <Button size="32" variant="tertiary">
        Next
      </Button>
    ),
  },
};

export const NoButtons: Story = {
  args: {
    variant: "dots",
  },
};

export const BottomPosition: Story = {
  args: {
    variant: "dots",
    position: "bottom",
    backButton: (
      <Button size="32" variant="tertiary">
        Back
      </Button>
    ),
    nextButton: (
      <Button size="32" variant="tertiary">
        Next
      </Button>
    ),
  },
};

export const SingleStep: Story = {
  args: {
    steps: 1,
    activeStep: 0,
    variant: "dots",
    backButton: (
      <Button size="32" variant="tertiary" disabled>
        Back
      </Button>
    ),
    nextButton: (
      <Button size="32" variant="tertiary" disabled>
        Next
      </Button>
    ),
  },
};

export const ManySteps: Story = {
  args: {
    steps: 20,
    activeStep: 10,
    variant: "dots",
    backButton: (
      <Button size="32" variant="tertiary">
        Back
      </Button>
    ),
    nextButton: (
      <Button size="32" variant="tertiary">
        Next
      </Button>
    ),
  },
};

export const FirstStep: Story = {
  args: {
    steps: 6,
    activeStep: 0,
    variant: "dots",
    backButton: (
      <Button size="32" variant="tertiary" disabled>
        Back
      </Button>
    ),
    nextButton: (
      <Button size="32" variant="tertiary">
        Next
      </Button>
    ),
  },
};

export const LastStep: Story = {
  args: {
    steps: 6,
    activeStep: 5,
    variant: "dots",
    backButton: (
      <Button size="32" variant="tertiary">
        Back
      </Button>
    ),
    nextButton: (
      <Button size="32" variant="tertiary" disabled>
        Next
      </Button>
    ),
  },
};

function InteractiveDemo() {
  const [activeStep, setActiveStep] = React.useState(0);
  const steps = 6;

  return (
    <MobileStepper
      steps={steps}
      activeStep={activeStep}
      variant="dots"
      backButton={
        <Button
          size="32"
          variant="tertiary"
          disabled={activeStep === 0}
          onClick={() => setActiveStep((prev) => prev - 1)}
        >
          Back
        </Button>
      }
      nextButton={
        <Button
          size="32"
          variant="tertiary"
          disabled={activeStep === steps - 1}
          onClick={() => setActiveStep((prev) => prev + 1)}
        >
          Next
        </Button>
      }
    />
  );
}

export const Interactive: Story = {
  render: () => <InteractiveDemo />,
  parameters: {
    docs: {
      source: {
        code: `function InteractiveDemo() {
  const [activeStep, setActiveStep] = React.useState(0);
  const steps = 6;

  return (
    <MobileStepper
      steps={steps}
      activeStep={activeStep}
      variant="dots"
      backButton={
        <Button
          size="32"
          variant="tertiary"
          disabled={activeStep === 0}
          onClick={() => setActiveStep((prev) => prev - 1)}
        >
          Back
        </Button>
      }
      nextButton={
        <Button
          size="32"
          variant="tertiary"
          disabled={activeStep === steps - 1}
          onClick={() => setActiveStep((prev) => prev + 1)}
        >
          Next
        </Button>
      }
    />
  );
}`,
      },
    },
  },
};

function InteractiveProgressDemo() {
  const [activeStep, setActiveStep] = React.useState(0);
  const steps = 6;

  return (
    <MobileStepper
      steps={steps}
      activeStep={activeStep}
      variant="progress"
      backButton={
        <Button
          size="32"
          variant="tertiary"
          disabled={activeStep === 0}
          onClick={() => setActiveStep((prev) => prev - 1)}
        >
          Back
        </Button>
      }
      nextButton={
        <Button
          size="32"
          variant="tertiary"
          disabled={activeStep === steps - 1}
          onClick={() => setActiveStep((prev) => prev + 1)}
        >
          Next
        </Button>
      }
    />
  );
}

export const InteractiveProgress: Story = {
  render: () => <InteractiveProgressDemo />,
  parameters: {
    docs: {
      source: {
        code: `function InteractiveProgressDemo() {
  const [activeStep, setActiveStep] = React.useState(0);
  const steps = 6;

  return (
    <MobileStepper
      steps={steps}
      activeStep={activeStep}
      variant="progress"
      backButton={
        <Button
          size="32"
          variant="tertiary"
          disabled={activeStep === 0}
          onClick={() => setActiveStep((prev) => prev - 1)}
        >
          Back
        </Button>
      }
      nextButton={
        <Button
          size="32"
          variant="tertiary"
          disabled={activeStep === steps - 1}
          onClick={() => setActiveStep((prev) => prev + 1)}
        >
          Next
        </Button>
      }
    />
  );
}`,
      },
    },
  },
};

function InteractiveTextDemo() {
  const [activeStep, setActiveStep] = React.useState(0);
  const steps = 6;

  return (
    <MobileStepper
      steps={steps}
      activeStep={activeStep}
      variant="text"
      backButton={
        <Button
          size="32"
          variant="tertiary"
          disabled={activeStep === 0}
          onClick={() => setActiveStep((prev) => prev - 1)}
        >
          Back
        </Button>
      }
      nextButton={
        <Button
          size="32"
          variant="tertiary"
          disabled={activeStep === steps - 1}
          onClick={() => setActiveStep((prev) => prev + 1)}
        >
          Next
        </Button>
      }
    />
  );
}

export const InteractiveText: Story = {
  render: () => <InteractiveTextDemo />,
  parameters: {
    docs: {
      source: {
        code: `function InteractiveTextDemo() {
  const [activeStep, setActiveStep] = React.useState(0);
  const steps = 6;

  return (
    <MobileStepper
      steps={steps}
      activeStep={activeStep}
      variant="text"
      backButton={
        <Button
          size="32"
          variant="tertiary"
          disabled={activeStep === 0}
          onClick={() => setActiveStep((prev) => prev - 1)}
        >
          Back
        </Button>
      }
      nextButton={
        <Button
          size="32"
          variant="tertiary"
          disabled={activeStep === steps - 1}
          onClick={() => setActiveStep((prev) => prev + 1)}
        >
          Next
        </Button>
      }
    />
  );
}`,
      },
    },
  },
};
