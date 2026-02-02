import { setProjectAnnotations } from "@storybook/react";
import * as previewAnnotations from "./preview";

// Apply Storybook's preview configuration to Vitest tests
setProjectAnnotations([previewAnnotations]);
