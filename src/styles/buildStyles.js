import StyleDictionary from "style-dictionary";

const getColorTokens = (tokens) => {
  let lightColorTokens = "";
  let darkColorTokens = "";

  tokens.forEach((token) => {
    if (token.type === "color") {
      if (token.path.includes("light")) {
        const path = structuredClone(token.path);
        path.splice(1, 1);
        lightColorTokens += `--${path.join("-")}: ${token.value};\n`;
      }
      if (token.path.includes("dark")) {
        const path = structuredClone(token.path);
        path.splice(1, 1);
        darkColorTokens += `--${path.join("-")}: ${token.value};\n`;
      }
    }
  });

  return `:root {\n${lightColorTokens}\n}\n\n.dark {\n${darkColorTokens}\n}`;
};

StyleDictionary.registerFormat({
  name: "css/tailwind-variables",
  format: ({ dictionary }) => {
    const colorTokens = getColorTokens(dictionary.allTokens);
    return `@import "./theme.css";\n${colorTokens}\n`;
  },
});

const tailwindStyleDictionary = new StyleDictionary({
  source: ["src/styles/styleTokens.json"],
  platforms: {
    css: {
      buildPath: "src/styles/",
      format: "css/tailwind-variables",
      files: [{ format: "css/tailwind-variables", destination: "globals.css" }],
    },
  },
});

void tailwindStyleDictionary.buildAllPlatforms();
