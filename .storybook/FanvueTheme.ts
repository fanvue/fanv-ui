import { create } from "storybook/theming";
import tokens from "../src/styles/styleTokens.json";

const primitives = tokens.primitives.dark.color;

export default create({
  base: "dark",

  // Brand
  brandTitle: "Fanvue UI",
  brandUrl: "https://fanvue.com",
  brandImage: "./logo.svg",
  brandTarget: "_self",
  colorPrimary: primitives.green[500].value,
  colorSecondary: primitives.green[500].value,
  appBg: primitives.gray[950].value,
  appContentBg: primitives.gray[950].value,
  appBorderColor: primitives.whitealpha[200].value,
  textColor: primitives.gray.white.value,
  textInverseColor: primitives.whitealpha[600].value,
  textMutedColor: primitives.whitealpha[300].value,

  barTextColor: primitives.gray.white.value,
  barHoverColor: primitives.gray.white.value,
  barSelectedColor: primitives.green[500].value,
  barBg: primitives.gray[900].value,
});
