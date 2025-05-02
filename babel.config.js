module.exports = function (api) {
  api.cache(true);
  return {  // check: edge case
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
    plugins: [  // TODO: validation
      "react-native-reanimated/plugin",
    ],  // HACK: validation
  };
};
