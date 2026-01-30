import StyleDictionary from "style-dictionary";

const getColorTokens = (tokens) => {
  let lightColorTokens = "";
  let darkColorTokens = "";
  let themeColorTokens = "";

  tokens.forEach((token) => {
    if (token.type === "color") {
      const path = structuredClone(token.path);
      // Build light color tokens
      if (path.includes("light")) {
        path.splice(1, 1);
        lightColorTokens += `--${path.join("-")}: ${token.value};\n`;
      }
      // Build dark color tokens
      if (path.includes("dark")) {
        const path = structuredClone(token.path);
        path.splice(1, 1);
        darkColorTokens += `--${path.join("-")}: ${token.value};\n`;
      }
      // Build theme variables
      const tokenKey = path.join("-");
      themeColorTokens += `--${tokenKey}: hsl(var(--${tokenKey}));\n`;
    }
  });

  return `@theme {\n${themeColorTokens}}\n.light {\n${lightColorTokens}\n}\n\n.dark {\n${darkColorTokens}\n}`;
};

StyleDictionary.registerFormat({
  name: "css/tailwind-variables",
  format: ({ dictionary }) => {
    const colorTokens = getColorTokens(dictionary.allTokens);
    return `@import "tailwindcss";\n${colorTokens}\n`;
  },
});

const tailwindStyleDictionary = new StyleDictionary({
  source: ["src/styles/styleTokens.json"],
  platforms: {
    css: {
      buildPath: "src/styles/",
      format: "css/tailwind-variables",
      files: [{ format: "css/tailwind-variables", destination: "theme.css" }],
    },
  },
});

void tailwindStyleDictionary.buildAllPlatforms();
