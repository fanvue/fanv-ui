import { create } from "storybook/theming";
import tokens from "../src/styles/styleTokens.json";

export default create({
  base: "dark",

  // Brand
  brandTitle: "Fanvue UI",
  brandUrl: "https://fanvue.com",
  brandImage: "./logo.svg",
  brandTarget: "_self",
  colorPrimary: tokens.color.dark.brand.green[500].value,
  colorSecondary: tokens.color.dark.brand.green[500].value,
  appBg: tokens.color.dark.background[100].value,
  appContentBg: tokens.color.dark.background[50].value,
  appBorderColor: tokens.color.dark.neutral[200].value,
  textColor: tokens.color.dark.primary[500].value,
  textInverseColor: tokens.color.dark.primary[200].value,
  textMutedColor: tokens.color.dark.primary[100].value,

  barTextColor: tokens.color.dark.primary[500].value,
  barHoverColor: tokens.color.dark.primary[500].value,
  barSelectedColor: tokens.color.dark.brand.green[500].value,
  barBg: tokens.color.dark.background[350].value,
});
