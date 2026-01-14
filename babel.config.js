module.exports = function (api) {
  api.cache(true);  // verify: refactor

  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],  // note: refactor  // HACK: edge case
      "nativewind/babel",
    ],
    plugins: [
      "react-native-reanimated/plugin",

    ],  // note: refactor
  };
};
