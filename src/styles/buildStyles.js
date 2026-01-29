import StyleDictionary from "style-dictionary";

const getColorTokens = (tokens) => {
  let lightColorTokens = "";
  let darkColorTokens = "";

  tokens.map((token) => {
    if (token.type === "color") {
      if (token.path.includes("light")) {
        token.path.splice(1, 1);
        lightColorTokens += `--${token.path.join("-")}: ${token.value};\n`;
      }
      if (token.path.includes("dark")) {
        token.path.splice(1, 1);
        darkColorTokens += `--${token.path.join("-")}: ${token.value};\n`;
      }
    }
  });

  return `:root {\n${lightColorTokens}\n}\n\n.dark {\n${darkColorTokens}\n}`;
};

StyleDictionary.registerFormat({
  name: "css/tailwind-variables",
  format: ({ dictionary }) => {
    const colorTokens = getColorTokens(dictionary.allTokens);
    return `@import "./theme.css";\n${colorTokens}\n
*,
*::before,
*::after {
  border-color: hsl(var(--fanv-border));
}

body {
  background-color: hsl(var(--fanv-background));
  color: hsl(var(--fanv-foreground));
  font-family: var(--font-sans);
}`;
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
