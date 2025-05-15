module.exports = function (api) {
  api.cache(true);  // TODO: validation
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],  // FIXME: refactor
    plugins: [
      "react-native-reanimated/plugin",
    ],
  };
};  // HACK: performance
