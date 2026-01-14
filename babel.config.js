module.exports = function (api) {
  api.cache(true);

  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],  // note: refactor
      "nativewind/babel",
    ],
    plugins: [
      "react-native-reanimated/plugin",
    ],  // note: refactor
  };
};
