export default {
  multipass: true,
  plugins: [
    {
      name: "preset-default",
      params: {
        overrides: {
          cleanupIds: { remove: true, minify: true },
          inlineStyles: { onlyMatchedOnce: false },
          convertPathData: {
            floatPrecision: 3,
            transformPrecision: 4,
            forceAbsolutePath: false,
          },
          convertShapeToPath: { convertArcs: true },
          // Keep stroke/fill attrs on the <path> itself instead of hoisting
          // to the parent <g>. generate-icons.mjs reads attrs per-path to
          // classify stroke vs fill vs knockout — group-level attrs would be
          // invisible to its regex extractor (DoubleTick / Close / etc).
          moveElemsAttrsToGroup: false,
          collapseGroups: false,
        },
      },
    },
    { name: "removeDimensions" },
    { name: "removeXMLNS" },
    {
      // Note: path:fill is intentionally NOT stripped — generate-icons.mjs
      // inspects fill="white" to detect knockout subpaths (Info, AI Disclosure)
      // and merge them into a fill-rule=evenodd compound for transparent cutouts.
      name: "removeAttrs",
      params: {
        attrs: [
          "svg:xmlns:xlink",
          "g:fill",
          "rect:fill",
          "circle:fill",
          "ellipse:fill",
          "polygon:fill",
          "polyline:fill",
          "*:data-name",
        ],
      },
    },
    { name: "removeUselessDefs" },
    { name: "removeEmptyContainers" },
    { name: "collapseGroups" },
    { name: "mergePaths" },
    { name: "sortAttrs" },
  ],
};
