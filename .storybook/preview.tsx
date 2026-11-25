import type { Preview } from "@storybook/react";
import { useEffect } from "react";
import "./preview.css";
import tokens from "../src/styles/styleTokens.json";
import tokensV2 from "../src/styles/styleTokensV2.json";

const BACKGROUNDS = {
  current: {
    light: tokens.primitives.light.color.gray.white.value,
    dark: tokens.primitives.dark.color.gray.black.value,
  },
  v2: {
    light: tokensV2.primitives.light.color.gray["75"].value,
    dark: tokensV2.primitives.dark.color.gray.black.value,
  },
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
    chromatic: {
      modes: {
        light: { theme: "light" },
        dark: { theme: "dark" },
      },
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
    palette: {
      description: "Colour palette: the current tokens, or the opt-in v2 palette (theme-v2)",
      toolbar: {
        title: "Palette",
        icon: "contrast",
        items: [
          { value: "current", title: "Current palette" },
          { value: "v2", title: "v2 palette" },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    theme: "light",
    palette: "current",
  },
  decorators: [
    (Story, context) => {
      const theme = context.globals.theme || "light";
      const isDark = theme === "dark";
      const isV2 = context.globals.palette === "v2";
      const backgrounds = isV2 ? BACKGROUNDS.v2 : BACKGROUNDS.current;
      const backgroundColor = isDark ? backgrounds.dark : backgrounds.light;

      // Sync background with theme for body and docs-story elements
      useEffect(() => {
        // Update body background
        document.body.style.backgroundColor = backgroundColor;

        // Set color-scheme to affect prefers-color-scheme media queries
        const root = document.documentElement;
        root.style.colorScheme = theme;
        root.setAttribute("data-color-scheme", theme);

        // Toggle dark class for Tailwind CSS dark mode
        if (isDark) {
          root.classList.add("dark");
        } else {
          root.classList.remove("dark");
        }
        root.classList.toggle("theme-v2", isV2);

        // Update all .docs-story elements (autodocs canvas containers)
        const docsStories = document.querySelectorAll(".docs-story");
        docsStories.forEach((element) => {
          (element as HTMLElement).style.backgroundColor = backgroundColor;
        });

        return () => {
          document.body.style.backgroundColor = "";
          root.style.colorScheme = "";
          root.removeAttribute("data-color-scheme");
          root.classList.remove("dark");
          root.classList.remove("theme-v2");
          docsStories.forEach((element) => {
            (element as HTMLElement).style.backgroundColor = "";
          });
        };
      }, [backgroundColor, theme, isDark, isV2]);

      return (
        <div className={theme} style={{ colorScheme: theme }}>
          <Story />
        </div>
      );
    },
  ],
  tags: ["autodocs"],
};

export default preview;
