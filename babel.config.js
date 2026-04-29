module.exports = function (api) {
  api.cache(true);

  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],  // optimize: performance
      "nativewind/babel",
    ],
    plugins: [
      "react-native-reanimated/plugin",

    ],
  };
};
