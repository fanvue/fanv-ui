import type { Preview } from "@storybook/react";
import { useEffect } from "react";
import "./preview.css";

const BACKGROUNDS = {
  light: "#ffffff",
  dark: "#0a0a0a",
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
  },
  initialGlobals: {
    theme: "light",
  },
  decorators: [
    (Story, context) => {
      const theme = context.globals.theme || "light";
      const isDark = theme === "dark";
      const backgroundColor = isDark ? BACKGROUNDS.dark : BACKGROUNDS.light;

      useEffect(() => {
        document.body.style.backgroundColor = backgroundColor;

        const root = document.documentElement;
        root.style.colorScheme = theme;
        root.setAttribute("data-color-scheme", theme);

        if (isDark) {
          root.classList.add("dark");
        } else {
          root.classList.remove("dark");
        }

        const docsStories = document.querySelectorAll(".docs-story");
        docsStories.forEach((element) => {
          (element as HTMLElement).style.backgroundColor = backgroundColor;
        });

        return () => {
          document.body.style.backgroundColor = "";
          root.style.colorScheme = "";
          root.removeAttribute("data-color-scheme");
          root.classList.remove("dark");
          docsStories.forEach((element) => {
            (element as HTMLElement).style.backgroundColor = "";
          });
        };
      }, [backgroundColor, theme, isDark]);

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
