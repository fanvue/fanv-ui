import { create } from "storybook/theming";
import tokens from "../src/styles/styleTokens.json";

const dark = tokens.primitives.dark.color;

export default create({
  base: "dark",

  // Brand
  brandTitle: "Fanvue UI",
  brandUrl: "https://fanvue.com",
  brandImage: "./logo.svg",
  brandTarget: "_self",
  colorPrimary: dark.green[500].value,
  colorSecondary: dark.green[500].value,
  appBg: dark.gray[900].value,
  appContentBg: dark.gray[900].value,
  appBorderColor: dark.whitealpha[200].value,
  textColor: dark.gray.white.value,
  textInverseColor: dark.gray[300].value,
  textMutedColor: dark.gray[400].value,

  barTextColor: dark.gray.white.value,
  barHoverColor: dark.gray.white.value,
  barSelectedColor: dark.green[500].value,
  barBg: dark.gray[800].value,
});
