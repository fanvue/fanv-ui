import type { Preview } from "@storybook/react";
import { useEffect } from "react";
import "../src/styles/theme.css";
import tokens from "../src/styles/styleTokens.json";

const BACKGROUNDS = {
  light: tokens.color.light.background[150].value,
  dark: tokens.color.dark.background[150].value,
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
      disable: true,
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
  globalTypes: {
    theme: {
      description: "Global theme for components",
      toolbar: {
        title: "Theme",
        icon: "paintbrush",
        items: [
          { value: "light", icon: "circlehollow", title: "Light theme" },
          { value: "dark", icon: "circle", title: "Dark theme" },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    theme: "light",
  },
  decorators: [
    (Story, context) => {
      const theme = context.globals.theme || "light";
      const isDark = theme === "dark";
      const backgroundColor = isDark ? BACKGROUNDS.dark : BACKGROUNDS.light;

      // Sync background with theme for body and docs-story elements
      useEffect(() => {
        // Update body background
        document.body.style.backgroundColor = backgroundColor;

        // Update all .docs-story elements (autodocs canvas containers)
        const docsStories = document.querySelectorAll(".docs-story");
        docsStories.forEach((element) => {
          (element as HTMLElement).style.backgroundColor = backgroundColor;
        });

        return () => {
          document.body.style.backgroundColor = "";
          docsStories.forEach((element) => {
            (element as HTMLElement).style.backgroundColor = "";
          });
        };
      }, [backgroundColor]);

      return (
        <div className={theme}>
          <Story />
        </div>
      );
    },
  ],
  tags: ["autodocs"],
};

export default preview;
