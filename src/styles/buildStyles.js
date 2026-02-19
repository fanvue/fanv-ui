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

  return {
    themeColorTokens,
    lightColorTokens,
    darkColorTokens,
  };
};

const getTypographyClasses = (typographyTokens) => {
  let typographyClasses = "";
  for (const [key, typographyObject] of Object.entries(typographyTokens)) {
    let typographyClass = "";
    const typographyClassName = `typography-${key.replaceAll(" ", "-").replaceAll("---", "-")}`;
    typographyClass = `${typographyClass}\n@utility ${typographyClassName} {\n`;

    for (const typographyProp of Object.values(typographyObject)) {
      const kebabedPropName = typographyProp.name.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
      typographyClass = `${typographyClass}  ${kebabedPropName}: ${typographyProp.value}${typographyProp.type === "dimension" ? "px" : ""};\n`;
    }

    typographyClasses = `${typographyClasses}${typographyClass}}\n`;
  }

  return typographyClasses;
};

const getEffectTokens = (effectTokens) => {
  let effectClasses = "";
  for (const [key, effectObject] of Object.entries(effectTokens)) {
    // Figma exports the hex values instead of the token names so the theme doesn't work
    if (key === "focus ring") {
      continue;
    }
    if (effectObject.value) {
      // Make sure the effect type is dropShadow
      if (effectObject.value.shadowType !== "dropShadow") {
        continue;
      }
      const effectClass = `  --shadow-${key.replaceAll(" ", "-").replaceAll("---", "-")}: ${effectObject.value.radius}px ${effectObject.value.color} ${effectObject.value.offsetX}px ${effectObject.value.offsetY}px ${effectObject.value.spread}px;\n`;
      effectClasses = `${effectClasses}${effectClass}`;
    }
    if (effectObject["0"] && effectObject["1"]) {
      if (
        effectObject["1"].value.shadowType !== "dropShadow" ||
        effectObject["0"].value.shadowType !== "dropShadow"
      ) {
        continue;
      }
      const effectClass = `  --shadow-${key.replaceAll(" ", "-").replaceAll("---", "-")}: ${effectObject["1"].value.radius}px ${effectObject["1"].value.color} ${effectObject["1"].value.offsetX}px ${effectObject["1"].value.offsetY}px ${effectObject["1"].value.spread}px, ${effectObject["0"].value.radius}px ${effectObject["0"].value.color} ${effectObject["0"].value.offsetX}px ${effectObject["0"].value.offsetY}px ${effectObject["0"].value.spread}px;\n`;
      effectClasses = `${effectClasses}${effectClass}`;
    }

    if (effectObject["0"] === null && effectObject["1"]) {
      if (effectObject["1"].value.shadowType !== "dropShadow") {
        continue;
      }
      const effectClass = `  --shadow-${key.replaceAll(" ", "-").replaceAll("---", "-")}: ${effectObject["1"].value.radius}px ${effectObject["1"].value.color} ${effectObject["1"].value.offsetX}px ${effectObject["1"].value.offsetY}px ${effectObject["1"].value.spread}px;\n`;
      effectClasses = `${effectClasses}${effectClass}`;
    }
  }

  // To get the right focus ring values, we need to add them manually
  // DO NOT FORGET TO ADD THE FOCUS RING VALUES MANUALLY WHEN THE COLOR TOKENS CHANGE
  effectClasses = `${effectClasses}  --shadow-focus-ring: 0 0 0 2px var(--color-background-inverse-solid), 0 0 0 4px var(--color-brand-purple-500); \n`;
  return effectClasses;
};

StyleDictionary.registerFormat({
  name: "css/tailwind-variables",
  format: ({ dictionary }) => {
    const { themeColorTokens, lightColorTokens, darkColorTokens } = getColorTokens(
      dictionary.allTokens,
    );
    const typographyClasses = getTypographyClasses(dictionary.tokens.typography);
    const effectClasses = getEffectTokens(dictionary.tokens.effect);
    return `/* Consumers must provide their own Tailwind import: @import "tailwindcss"; */\n\n@variant dark (&:where(.dark, .dark *));\n\n@theme {\n${effectClasses}\n${themeColorTokens}}\n\n:root {\n${lightColorTokens}\n}\n\n.dark {\n${darkColorTokens}\n}\n${typographyClasses}\n`;
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
    // verbosity: "verbose",
  },
});

void tailwindStyleDictionary.buildAllPlatforms();
