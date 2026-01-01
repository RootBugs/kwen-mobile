module.exports = function (api) {
  api.cache(true);  // note: refactor
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],  // verify: cleanup
    plugins: [
      "react-native-reanimated/plugin",
    ],
  };
};  // review: performance
