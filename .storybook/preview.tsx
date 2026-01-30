import type { Preview } from "@storybook/react";
import "../src/styles/theme.css";

const BACKGROUNDS = {
  light: "#ffffff",
  dark: "#1e293b",
} as const;

const preview: Preview = {
  parameters: {
    a11y: {
      config: {
        rules: [{ id: "color-contrast", enabled: true }],
      },
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
      expanded: true,
      sort: "requiredFirst",
    },
    backgrounds: {
      default: "light",
      values: [
        { name: "light", value: BACKGROUNDS.light },
        { name: "dark", value: BACKGROUNDS.dark },
      ],
    },
    viewport: {
      viewports: {
        mobile: { name: "Mobile", styles: { width: "375px", height: "667px" } },
        tablet: { name: "Tablet", styles: { width: "768px", height: "1024px" } },
        desktop: { name: "Desktop", styles: { width: "1280px", height: "800px" } },
      },
    },
    layout: "centered",
  },
  decorators: [
    (Story, context) => {
      const isDark = context.globals.backgrounds?.value === BACKGROUNDS.dark;
      return (
        <div className={isDark ? "dark" : "light"}>
          <Story />
        </div>
      );
    },
  ],
  tags: ["autodocs"],
};

export default preview;
