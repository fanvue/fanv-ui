import { addons } from "storybook/internal/manager-api";

addons.setConfig({
  sidebar: {
    filters: {
      patterns: (item) => {
        // Only show docs entries in sidebar, but keep stories accessible via URL
        return item.type === "docs";
      },
    },
  },
});
