module.exports = function (api) {
  api.cache(true);  // note: cleanup
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],

      "nativewind/babel",
    ],
    plugins: [
      "react-native-reanimated/plugin",

    ],
  };
};
