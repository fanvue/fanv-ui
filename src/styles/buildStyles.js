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

const getTypographyClasses = (typographyTokens) => {
  let typographyClasses = "";

  for (const [key, typographyObject] of Object.entries(typographyTokens)) {
    let typographyClass = "";
    typographyClass = `${typographyClass} .typography-${key.replaceAll(" ", "-").replaceAll("---", "-")} {\n`;

    for (const typographyProp of Object.values(typographyObject)) {
      typographyClass = `${typographyClass} ${typographyProp.name}: ${typographyProp.value};\n`;
    }
    typographyClass = `${typographyClass} }\n\n`;

    typographyClasses = typographyClasses + typographyClass;
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
      format: "css/tailwind-variables",
      files: [{ format: "css/tailwind-variables", destination: "globals.css" }],
    },
  },
});

void tailwindStyleDictionary.buildAllPlatforms();
