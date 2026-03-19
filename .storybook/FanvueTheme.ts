import { create } from "storybook/theming";

export default create({
  base: "dark",

  brandTitle: "Fanvue UI Internal",
  brandUrl: "https://fanvue.com",
  brandImage: "./logo.svg",
  brandTarget: "_self",
  colorPrimary: "#22c55e",
  colorSecondary: "#22c55e",
  appBg: "#0a0a0a",
  appContentBg: "#0a0a0a",
  appBorderColor: "rgba(255, 255, 255, 0.1)",
  textColor: "#ffffff",
  textInverseColor: "rgba(255, 255, 255, 0.6)",
  textMutedColor: "rgba(255, 255, 255, 0.3)",

  barTextColor: "#ffffff",
  barHoverColor: "#ffffff",
  barSelectedColor: "#22c55e",
  barBg: "#171717",
});
