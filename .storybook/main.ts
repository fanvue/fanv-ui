import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  stories: ["../src/**/*.stories.@(js|jsx|mjs|ts|tsx)", "../src/**/*.mdx"],
  addons: [
    "@storybook/addon-docs",
    "@storybook/addon-a11y",
    "@chromatic-com/storybook",
    "@storybook/addon-vitest",
    "@storybook/addon-designs",
  ],
  staticDirs: ["./public"],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  typescript: {
    reactDocgen: "react-docgen-typescript",
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      shouldRemoveUndefinedFromOptional: true,
      propFilter: (prop) => !prop.parent?.fileName.includes("node_modules"),
    },
  },
  core: {
    disableTelemetry: true,
  },
  viteFinal: async (config) => {
    // Remove vite-plugin-dts from Storybook builds (not needed for Storybook)
    config.plugins = config.plugins?.filter(
      (plugin) =>
        !(plugin && typeof plugin === "object" && "name" in plugin && plugin.name === "vite:dts"),
    );
    return config;
  },
};

export default config;
