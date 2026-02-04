import StyleDictionary from "style-dictionary";

const getColorTokens = (tokens) => {
  let lightColorTokens = "";
  let darkColorTokens = "";
  let themeColorTokens = "";

  tokens.forEach((token) => {
    if (token.type === "color") {
      const path = structuredClone(token.path);

      // Build light color tokens as :root defaults
      if (path.includes("light")) {
        path.splice(1, 1);
        lightColorTokens += `  --${path.join("-")}: ${token.value};\n`;
      }

      // Build dark color tokens as .dark overrides
      if (path.includes("dark")) {
        const path = structuredClone(token.path);
        path.splice(1, 1);
        darkColorTokens += `  --${path.join("-")}: ${token.value};\n`;
      }
      // Build theme variables
      const tokenKey = path.join("-");
      themeColorTokens += `  --${tokenKey}: var(--${tokenKey});\n`;
    }
  });

  return `\n@theme {\n${themeColorTokens}}\n\n:root {\n${lightColorTokens}\n}\n\n.dark {\n${darkColorTokens}\n}`;
};

const getTypographyClasses = (typographyTokens) => {
  let typographyClasses = "";
  for (const [key, typographyObject] of Object.entries(typographyTokens)) {
    let typographyClass = "";
    const typographyClassName = `typography-${key.replaceAll(" ", "-").replaceAll("---", "-")}`;
    typographyClass = `${typographyClass}\n.${typographyClassName} {\n`;

    for (const typographyProp of Object.values(typographyObject)) {
      const kebabedPropName = typographyProp.name.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
      typographyClass = `${typographyClass}  ${kebabedPropName}: ${typographyProp.value}${typographyProp.type === "dimension" ? "px" : ""};\n`;
    }

    typographyClasses = `${typographyClasses}${typographyClass}}\n`;
  }

  return typographyClasses;
};

StyleDictionary.registerFormat({
  name: "css/tailwind-variables",
  format: ({ dictionary }) => {
    const colorTokens = getColorTokens(dictionary.allTokens);

    const typographyClasses = getTypographyClasses(dictionary.tokens.typography);
    return `@import "tailwindcss";\n${colorTokens}\n${typographyClasses}\n`;
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
