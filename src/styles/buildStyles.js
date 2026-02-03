import StyleDictionary from "style-dictionary";

const getColorTokens = (tokens) => {
  let rootColorTokens = "";
  let darkColorTokens = "";
  let themeTokens = "";
  const processedTokens = new Set();

  tokens.forEach((token) => {
    if (token.type === "color") {
      const path = structuredClone(token.path);

      // Build light color tokens as :root defaults
      if (path.includes("light")) {
        path.splice(path.indexOf("light"), 1);
        const tokenKey = path.join("-");
        if (!processedTokens.has(tokenKey)) {
          // Add to :root as default (light mode defaults)
          rootColorTokens += `  --${tokenKey}: ${token.value};\n`;
          // Add to theme mapping (references the CSS variable)
          themeTokens += `  --${tokenKey}: var(--${tokenKey});\n`;
          processedTokens.add(tokenKey);
        }
      }

      // Build dark color tokens as .dark overrides
      if (path.includes("dark")) {
        const darkPath = structuredClone(token.path);
        darkPath.splice(darkPath.indexOf("dark"), 1);
        const tokenKey = darkPath.join("-");
        darkColorTokens += `  --${tokenKey}: ${token.value};\n`;
      }
    }
  });

  return `:root {\n${rootColorTokens}}\n\n@theme {\n${themeTokens}}\n\n.dark {\n${darkColorTokens}}`;
};

StyleDictionary.registerFormat({
  name: "css/tailwind-variables",
  format: ({ dictionary }) => {
    const colorTokens = getColorTokens(dictionary.allTokens);
    return `@import "tailwindcss";\n\n${colorTokens}\n`;
  },
});

const tailwindStyleDictionary = new StyleDictionary({
  source: ["src/styles/styleTokens.json"],
  platforms: {
    css: {
      buildPath: "src/styles/",
      files: [
        {
          format: "css/tailwind-variables",
          destination: "theme.css",
        },
      ],
    },
  },
  log: {
    verbosity: "verbose",
  },
});

void tailwindStyleDictionary.buildAllPlatforms();
